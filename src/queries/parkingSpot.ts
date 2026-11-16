// external dependencies
import { AnyPointerEvent } from "framer-motion/types/gestures/PanSession";
import { useMutation, useQuery, useQueryClient } from "react-query";

// orangery elements & internal dependencies
import { FormError } from "../states/mobx-form";

// queries & backend
import { backend } from "./backend";
import { IUser } from "./dashboard";
import { IMedia } from "./media";

import { backendMock } from "./backendMock";
export interface IParkingSpot {
  uuid?: string;
  name?: string;
  description?: string;
  images?: IMedia[];
  office_uuid: string;
  tenant_office_uuid?: string | null;
  // assigned_user?: IUser;
  // created_date?: string;
  // active: boolean;
  // status?: string;
}

async function getParkingSpot(office_uuid: string): Promise<IParkingSpot> {
  if (!office_uuid) {
    throw "office_uuid should not be empty in getParkingSpot()";
  }
  try {
    const resp = await backend.get(`/office/${office_uuid}/parking-spot`, {});
    const data = resp.data;
    return data.data.parking_spots;
  } catch (err: any) {
    throw err;
  }
}

export function useParkingSpot(parkingSpot_uuid: string) {
  return useQuery<IParkingSpot, Error>(
    ["parkingSpot", parkingSpot_uuid],
    () => getParkingSpot(parkingSpot_uuid),
    {
      refetchOnWindowFocus: false,
    }
  );
}

export interface IParkingSpotParams {
  uuid?: string;
  name?: string;
  description?: string;
  office_uuid: string;
  image_uuids: string[];
  // active: boolean;
}
export interface IParkingSpotResult {
  uuid: string;
}

async function upsertParkingSpot(
  params: IParkingSpotParams
): Promise<IParkingSpotResult> {
  try { 
    const data = {
      name: params.name,
      description: params.description,
      image_uuid: params.image_uuids,
      // active: params.active,
    };
    if (params.uuid) {
      const response = await backend.put(
        `/office/${params.office_uuid}/parking-spot/${params.uuid}`,
        data,
        {}
      );
      const result = response.data.data?.parking_spot;
      return result;
    } else {
      const result = await backend.post(
        `/office/${params.office_uuid}/parking-spot`,
        data,
        {
          headers: (data as any).getHeaders?.(),
        }
      );
      const finalResult = result.data.data.parking_spot;
      return finalResult.data;
    }
  } catch (err: any) {
    const processedError = processError(err);
    throw processedError;
  }
}

export function useUpsertParkingSpot() {
  const queryClient = useQueryClient();
  return useMutation<IParkingSpotResult, Error, IParkingSpotParams>(
    upsertParkingSpot,
    {
      onSuccess: (_, variables) => {
        const office_uuid = variables.office_uuid;
        queryClient.invalidateQueries(["parkingSpots", office_uuid]);
      },
    }
  );
}

export interface IDeleteParkingSpotParams {
  office_uuid: string;
  uuid?: string;
}
async function deleteParkingSpot(
  params: IDeleteParkingSpotParams
): Promise<void> {
  try {
    const result = await backend.delete(
      `/office/${params.office_uuid}/parking-spot/${params.uuid}`,
      {}
    );
    const deleteResult = result.data.data;
  } catch (err: any) {
    const processedError = processError(err);
    throw processedError;
  }
}

export function useDeleteParkingSpot() {
  const queryClient = useQueryClient();
  return useMutation<void, Error, IDeleteParkingSpotParams>(deleteParkingSpot, {
    onSuccess: (_, variables) => {
      const office_uuid = variables.office_uuid;
      queryClient.invalidateQueries(["parkingSpots", office_uuid]);
    },
  });
}

async function getParkingSpots(office_uuid: string): Promise<IParkingSpot[]> {
  if (!office_uuid) {
    throw "office_uuid should not be empty in getParkingSpots()";
  }
  try {
    // const resp = await backend.get(`/office/${office_uuid}/parking-spot`, {});
    const resp = await backend.get(`/office/${office_uuid}/parking-spot`, {});
    const data = resp.data;
    let result = data?.data.parking_spots;
    result = result
      .map((e: any) => ({
        ...e,
        office_uuid,
      }))
      .sort((a: any, b: any) =>
        new Date(a.created_date).getTime() > new Date(b.created_date).getTime()
          ? 1
          : -1
      );

    return result;
  } catch (err: any) {
    throw err;
  }
}

export function useParkingSpots(office_uuid: string) {
  return useQuery<IParkingSpot[], Error>(
    ["parkingSpots", office_uuid],
    () => getParkingSpots(office_uuid),
    {
      refetchOnWindowFocus: false,
    }
  );
}

export function processError(err: any) {
  if (err.response) {
    if (err.response.data.error_code === 500) {
      const error: FormError = {
        errors: [
          {
            field: "",
            error: err.response.data.msg || "Something went wrong on server!",
          },
        ],
      };
      return error;
    }
    if (err.response.data.error_code === 400) {
      const error: FormError = {
        errors: [
          {
            field: "",
            error: err.response.data.msg || "Something went wrong on client!",
          },
        ],
      };
      return error;
    }

    //TODO handle 400 / 500
    const error: FormError = {
      errors: [
        {
          field: "firstName",
          error: "bad name",
        },
      ],
    };
    return error;
  } else if (err.request) {
    // debugger;
    // TODO network error
    const error: FormError = {
      errors: [
        {
          field: "",
          error: "Network Error",
        },
      ],
    };
    return error;
  } else {
    // debugger;
    //TODO something else
    const error: FormError = {
      errors: [
        {
          field: "",
          error: "Something went wrong!",
        },
      ],
    };
    return error;
  }
}
