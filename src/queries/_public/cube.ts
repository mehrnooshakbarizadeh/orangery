// external dependencies
import { useMutation, useQuery, useQueryClient } from "react-query";
import moment from "moment";

// orangery elements & internal dependencies
//

// queries & backend
import { backend } from "../backend";
import { processError } from "../commons";

export interface ITimeSlot {
  hour: number,
  minute: number,
  repr: string,
  display: string,
  date: string,
  available: boolean,
}

export interface IFeature {
  id: string; // 12a9a9b2-23bc-43ba-9253-d0030e955dfb",
  name: string; // Terrace",
  description: string; // Take a break or work outside from the compact terrace of your Nooka Space called \"the hut\".",
  iconUrl: string; // https://d23wbsd74bcuuk.cloudfront.net/icons/terrace.svg"
}

export interface IImageUrl {
  "id": string;
  "url": string;
}

export interface IPricing {
  price: number,
  tokens: number,
  currency: "EUR",
  model: "HOURLY"
}

export interface ICube {
  id: string;

  index: number;

  name: string;
  country: string;
  city: string;
  address: string;
  latitude: number,
  longitude: number,
  description: string;
  thumbnailUrl: string;
  imagesUrls: IImageUrl[],
  pricing: IPricing,
  features: IFeature[],         ////////!!!!!!!!
  installationDate: Date,
  constructionDate: Date,
  availabilityStatus: string;     ////!!!! should be constant
  access: {
    private: boolean,
    canAccess: boolean,
  },
  dailyOpenedPeriods: null | any, ////////!!!!!!!!
  product_type: string;           ////!!!! should be constant
}

async function getCube(
  cubeIndex?: string
): Promise<ICube> {
  if (!cubeIndex) {
    throw "cubeIndex should not be empty in getCube()";
  }
  try {
    const resp = await backend.get(
      `/cube/${cubeIndex}?bridge_id=true`,
      {}
    );
    const data = resp.data;
    let result = data?.data;

    result.index = cubeIndex;  ////////!!!!!!!! index!?

    return result;
  } catch (err: any) {
    throw err;
  }
}

export function useCube(cubeIndex?: string) {
  return useQuery<ICube, Error>(
    ["cube", cubeIndex],
    () => getCube(cubeIndex),
    {
      refetchOnWindowFocus: false,
    }
  );
}

export interface ICubeBooking {
  cube_info: ICube,
  cube_uuid: string;
  seconds_to_start: number,
}

async function getCubeBooking(
  bookingUuid?: string
): Promise<ICubeBooking> {
  if (!bookingUuid) {
    throw "bookingUuid should not be empty in getCubeBooking()";
  }
  try {
    const resp = await backend.get(
      `/cube/booking?booking_uuid=${bookingUuid}`,
      {}
    );
    const data = resp.data;
    let result = data?.data;

    return result;
  } catch (err: any) {
    throw err;
  }
}

export function useCubeBooking(bookingUuid?: string) {
  return useQuery<ICubeBooking, Error>(
    ["cubeBooking", bookingUuid],
    () => getCubeBooking(bookingUuid),
    {
      refetchOnWindowFocus: false,
    }
  );
}

export interface ICubeTimeSlotsGetParams {
  id: string;
  pickedDate: Date
}

async function getCubeTimeSlots(params: ICubeTimeSlotsGetParams): Promise<any[]> {
  try {
    const resp = await backend.get(`/cube/${params.id}/coverage?start_date=${moment(params.pickedDate).format("YYYY-MM-DD")}&end_date=${moment(params.pickedDate).add(1, "days").format("YYYY-MM-DD")}&bridge_id=false`, {
      headers: {
        Authorization: ""
      }
    });
    const data = resp.data;
    let result = data?.data;

    return result;
  } catch (err: any) {
    throw err;
  }
}

export function useCubeTimeSlots(params: ICubeTimeSlotsGetParams) {
  return useQuery<ITimeSlot[], Error>(
    ["cubeTimeSlots", params.id, params.pickedDate],
    () => getCubeTimeSlots(params),
    {
      refetchOnWindowFocus: false,
    }
  );
}

export function useCubeTimeSlotsMutation() {
  const queryClient = useQueryClient();
  return useMutation<any[], Error, ICubeTimeSlotsGetParams>(
    getCubeTimeSlots,
    {
      onSuccess: (_, variables) => {
        queryClient.invalidateQueries(["cubeTimeSlots", variables.id, variables.pickedDate]);
      },
    }
  );
}

// export type ICubeControlSensorType =
//   "DOOR_LOCK"
//   | "LIGHTS_INTERIOR"
//   | "LIGHTS_EXTERIOR";

export interface ICubeControlParams {
  cubeIndex: number,
  booking_uuid: string,
  sensor_type: string,
  value: number
}

export interface ICubeControlResult {
  version: string; // "1.101.3",
  success: boolean; // true,
  data: boolean; // true
}

async function controlCube(params: ICubeControlParams): Promise<ICubeControlResult> {
  try {
    const data = params;

    const result = await backend.post(
      `/cube/controls-public`,
      data,
      {}
    );
    const finalResult = result.data;
    return finalResult;
  } catch (err: any) {
    const processedError = processError(err);
    throw processedError;
  }
}

export function useControlCube() {
  const queryClient = useQueryClient();
  return useMutation<ICubeControlResult, Error, ICubeControlParams>(controlCube, {
    onSuccess: (_, variables) => {
      // const booking_uuid = variables.booking_uuid;
      // const sensor_type = variables.sensor_type;
      // const cubeIndex = variables.cubeIndex;
      queryClient.invalidateQueries(["cubeWidgetCategories"]);
      // queryClient.invalidateQueries(["cubeControl", booking_uuid, sensor_type]); // useless??!!
      // queryClient.invalidateQueries(["cube", cubeIndex]); // useless??!!
    },
  });
}

export interface ICubeWidgetCategory {
  title: string; //Locking",
  iconPath: string; ///icons/lock-off.svg",
  widgets: ICubeWidget[]
}

export interface ICubeWidgetMetadata {
  iconOn: string; // /icons/lock-off.svg",
  iconOff: string; // /icons/lock-on.svg",
  titleOn: string; // Tap to lock the door",
  statusOn: string; // Unlocked",
  titleOff: string; // Tap to unlock the door",
  statusOff: string; // Locked",
  offDisabled: boolean
}

export interface ICubeWidget {
  id: string; // door-lock",
  title: string; // Lock",
  type: string; // BOOLEAN",
  group: string | null; //  null,
  dependsOn: string | null; //  null,
  value: boolean; //  true,
  metadata: ICubeWidgetMetadata;
}

async function getWidgetCategories(
  bookingUuid?: string
): Promise<ICubeWidgetCategory[]> {
  if (!bookingUuid) {
    throw "bookingUuid should not be empty in getWidgetCategories()";
  }
  try {
    const resp = await backend.get(
      `/cube/controls-public?booking_uuid=${bookingUuid}`,
      {}
    );
    const data = resp?.data;
    let result = data?.data;

    return result;
  } catch (err: any) {
    throw err;
  }
}

export function useWidgetCategories(bookingUuid?: string) {
  return useQuery<ICubeWidgetCategory[], Error>(
    ["cubeWidgetCategories"], // , cubeId
    () => getWidgetCategories(bookingUuid),
    {
      refetchOnWindowFocus: false,
    }
  );
}