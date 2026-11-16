// external dependencies
import { useMutation, useQuery, useQueryClient } from "react-query";

// orangery elements & internal dependencies
import { FormError } from "../states/mobx-form";

// queries & backend
import { backend } from "./backend";
import { IMedia } from "./media";

export interface IMeetingRoomParams {
  uuid?: string;
  name: string;
  active: boolean;
  payable_via_invoice: boolean;
  department_uuid?: string;
  description: string;
  capacity: number;
  price: number;
  assets: IRoomAsset[];
  daily_price?: number | string | null;
  number_of_hours_to_daily_price?: number | string | null;
  floor_uuid: string;
  tag_uuids: string[];
  office_uuid: string;
  image_uuids: string[];
}
export interface IMeetingRoomResult {
  uuid: string;
  office_uuid: string;
  description: string;
  name: string;
  bookings: IBooking[];
  assigned_floor: {
    name: string;
    uuid: string;
  };
  tags: {
    uuid: string;
    name: string;
  }[];
  active: boolean;
  payable_via_invoice: boolean;
  capacity: number;
  price: number;
  daily_price?: number | null;
  number_of_hours_to_daily_price?: number | null;
  department: string;
  created_by: string;
  created_date: Date;
  updated_by: string;
  timestamp: string;
  time_slots: [];
  assets: IRoomAsset[];
  image_uuids: string[];

  tenant_office_uuid?: string | null;
}
async function upsertMeetingRoom(
  params: IMeetingRoomParams
): Promise<IMeetingRoomResult> {
  try {
    const data = {
      name: params.name,
      active: params.active,
      payable_via_invoice: params.payable_via_invoice,
      department_uuid: params.department_uuid,
      capacity: params.capacity,
      description: params.description,
      price: params.price,
      daily_price: params.daily_price,
      assets: params.assets,
      number_of_hours_to_daily_price: params.number_of_hours_to_daily_price,
      tag_uuids: params.tag_uuids,
      floor_uuid: params.floor_uuid,
      image_uuids: params.image_uuids,
    };
    if (params.uuid) {
      const response = await backend.put(
        `/office/${params.office_uuid}/meeting-room/${params.uuid}`,
        data,
        {}
      );
      const result = response.data.data?.meeting_room;
      return result;
    } else {
      const response = await backend.post(
        `/office/${params.office_uuid}/meeting-room`,
        data,
        {}
      );
      const result = response.data.data?.meeting_room;
      return result;
    }
  } catch (err: any) {
    const processedError = processError(err);
    throw processedError;
  }
}

export function useUpsertMeetingRoom() {
  const queryClient = useQueryClient();
  return useMutation<IMeetingRoomResult, Error, IMeetingRoomParams>(
    upsertMeetingRoom,
    {
      onSuccess: (data, variables) => {
        const office_uuid = variables.office_uuid;
        queryClient.invalidateQueries(["meetingRooms", office_uuid]);
        queryClient.invalidateQueries(["meetingRoom", office_uuid, data.uuid]);
      },
    }
  );
}

export interface IDeleteMeetingRoomParams {
  office_uuid: string;
  uuid: string;
}
async function deleteMeetingRoom(
  params: IDeleteMeetingRoomParams
): Promise<void> {
  try {
    const result = await backend.delete(
      `/office/${params.office_uuid}/meeting-room/${params.uuid}`,
      {}
    );
    const deleteResult = result.data.data;
  } catch (err: any) {
    const processedError = processError(err);
    throw processedError;
  }
}

export function useDeleteMeetingRoom() {
  const queryClient = useQueryClient();
  return useMutation<void, Error, IDeleteMeetingRoomParams>(deleteMeetingRoom, {
    onSuccess: (_, variables) => {
      const office_uuid = variables.office_uuid;
      queryClient.invalidateQueries(["meetingRooms", office_uuid]);
      queryClient.invalidateQueries([
        "meetingRoom",
        office_uuid,
        variables.uuid,
      ]);
    },
  });
}

export interface IDeleteMultiMeetingRoomParams {
  office_uuid: string;
  uuids: string[];
}
async function deleteMultiMeetingRoom(
  params: IDeleteMultiMeetingRoomParams
): Promise<void> {
  try {
    const result = await backend.delete(
      `/office/${params.office_uuid}/meeting-room`,
      {
        data: {
          uuids: params.uuids,
        },
      }
    );
    const deleteResult = result.data.data;
  } catch (err: any) {
    const processedError = processError(err);
    throw processedError;
  }
}

export function useDeleteMultiMeetingRoom() {
  const queryClient = useQueryClient();
  return useMutation<void, Error, IDeleteMultiMeetingRoomParams>(
    deleteMultiMeetingRoom,
    {
      onSuccess: (_, variables) => {
        const office_uuid = variables.office_uuid;
        queryClient.invalidateQueries(["meetingRooms", office_uuid]);
        variables.uuids.forEach((uuid) => {
          queryClient.invalidateQueries(["meetingRoom", office_uuid, uuid]);
        });
      },
    }
  );
}
export interface IBooking {
  date: string;
  user: {
    name: string;
    uuid: string;
  };
  desk: string;
  meeting_room: {
    name: string;
    uuid: string;
  };
}

export interface IRoomAsset {
  grouped_name: string;
  asset_type: string;
  price: number;
  quantity: number;
  stock: number;
  uuids?: string[];
}
export interface IMeetingRoom {
  uuid: string;
  office_uuid: string;
  name: string;
  bookings: IBooking[];
  assets: IRoomAsset[];
  assigned_floor: {
    name: string;
    uuid: string;
  };
  tags: {
    uuid: string;
    name: string;
  }[];
  active: boolean;
  payable_via_invoice: boolean;
  capacity: number;
  price: number;
  daily_price?: number | null;
  number_of_hours_to_daily_price?: number | null;
  department: string;
  description: string;
  created_by: string;
  created_date: Date;
  updated_by: string;
  timestamp: string;
  time_slots: [];
  images: IMedia[];

  tenant_office_uuid: string | null;

  department_obj?: {
    uuid: string;
    name: string;
  };
}

async function getMeetingRoom(
  office_uuid?: any,
  meeting_room_uuid?: any
): Promise<IMeetingRoom> {
  if (!office_uuid || !meeting_room_uuid) {
    throw "office_uuid and/or meeting_room_uuid should not be empty in getMeetingRoom()";
  }
  try {
    const resp = await backend.get(
      `/office/${office_uuid}/meeting_room/${meeting_room_uuid}`,
      {}
    );
    const data = resp.data;
    let result = data?.data.meeting_room;
    return result;
  } catch (err: any) {
    throw err;
  }
}

export function useMeetingRoom(office_uuid?: any, meeting_room_uuid?: any) {
  return useQuery<IMeetingRoom, Error>(
    ["meetingRoom", office_uuid, meeting_room_uuid],
    () => getMeetingRoom(office_uuid, meeting_room_uuid),
    {
      refetchOnWindowFocus: false,
    }
  );
}

async function getMeetingRooms(office_uuid: string): Promise<IMeetingRoom[]> {
  if (!office_uuid) {
    throw "office_uuid should not be empty in getMeetingRooms()";
  }
  try {
    const resp = await backend.get(`/office/${office_uuid}/meeting-room`, {});
    const data = resp.data;
    let result = data?.data.meeting_rooms;
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

export function useMeetingRooms(office_uuid: string) {
  return useQuery<IMeetingRoom[], Error>(
    ["meetingRooms", office_uuid],
    () => getMeetingRooms(office_uuid),
    {
      refetchOnWindowFocus: false,
    }
  );
}
async function getAvailableMeetingRooms(office_uuid: string, start: string, end: string, weeks: number): Promise<IMeetingRoom[]> {
  if (!office_uuid) {
    throw "office_uuid should not be empty in getAvailableMeetingRooms()";
  }
  try {
    const resp = await backend.get(`/office/${office_uuid}/meeting-room/available?start=${start}&end=${end}&weeks=${weeks}`, {});
    const data = resp.data;
    let result = data?.data.meeting_rooms;
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

export function useAvailableMeetingRooms(office_uuid: string, start: string, end: string, weeks: number) {
  return useQuery<IMeetingRoom[], Error>(
    ["meetingRooms", office_uuid],
    () => getAvailableMeetingRooms(office_uuid, start, end, weeks),
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
    if (err.response.data.error_code === 403) {
      const error: FormError = {
        errors: [
          {
            field: "",
            error:
              err.response.data.msg || "the username is already registered!",
          },
        ],
      };
      return error;
    }
    // debugger;
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
