// external dependencies
import { useMutation, useQuery, useQueryClient } from "react-query";

// orangery elements & internal dependencies
import { FormError } from "../states/mobx-form";

// queries & backend
import { backend } from "./backend";
import { IDesk } from "./desk"
import { IAsset } from "./asset"
import { IFloor } from "./floor"
import { IUser } from "./dashboard"
import { IUseListParams, processError } from "./commons";
import { IOffer } from "./tenant"
import { ICustomer } from "./customer";
import { IDoor } from "./door";

export interface IRoomUpsertParams {
  office_uuid?: string;
  uuid?: string;

  name: string;
  description: string;
  capacity: number;
  floor_uuid: string;
  images: string[];

  desks: string[];
  assets: string[];
  doors: string[];
  user_uuids: string[];

  active: boolean;
}

export interface IImage {
  uuid: string;
}

export interface IRoom {
  office_uuid: string;
  uuid: string;

  name: string;
  description: string;
  capacity: number;
  floor: IFloor;
  images: IImage[];

  desks: IDesk[];
  assets: IAsset[];
  doors: IDoor[];
  users: IUser[];

  active: boolean;

  tenant_office_uuid?: boolean | null;

  product: IOffer | null;
  customer: ICustomer;

  department?: {
    name: string;
    uuid: string;
  }
}

export interface IRoomDeleteParams {
  office_uuid: string;
  uuid: string;
}

async function upsertRoom(params: IRoomUpsertParams): Promise<IRoom> {
  try {
    const data = { ...params };

    if (params.uuid) {
      const result = await backend.put(
        `/office/${params.office_uuid}/room/${params.uuid}`,
        data,
        {}
      );
      const finalResult = result.data.data;
      return finalResult;
    } else {
      const result = await backend.post(
        `/office/${params.office_uuid}/room`,
        data,
        {}
      );
      const finalResult = result.data.data;
      return finalResult;
    }
  } catch (err: any) {
    const processedError = processError(err);
    throw processedError;
  }
}

export function useUpsertRoom() {
  const queryClient = useQueryClient();
  return useMutation<IRoom, Error, IRoomUpsertParams>(upsertRoom, {
    onSuccess: (_, variables) => {
      const office_uuid = variables.office_uuid;
      queryClient.invalidateQueries(["rooms", office_uuid]);
    },
  });
}

async function deleteRoom(params: IRoomDeleteParams): Promise<void> {
  try {
    const result = await backend.delete(
      `/office/${params.office_uuid}/room/${params.uuid}`,
      {}
    );
    const deleteResult = result.data.data;
  } catch (err: any) {
    const processedError = processError(err);
    throw processedError;
  }
}

export function useDeleteRoom() {
  const queryClient = useQueryClient();
  return useMutation<void, Error, IRoomDeleteParams>(deleteRoom, {
    onSuccess: (_, variables) => {
      const office_uuid = variables.office_uuid;
      queryClient.invalidateQueries(["rooms", office_uuid]);
    },
  });
}

// async function getRooms(office_uuid: string): Promise<IRoom[]> {
//   if (!office_uuid) {
//     throw "office_uuid should not be empty in getRooms()";
//   }
//   try {
//     const resp = await backend.get(`/office/${office_uuid}/room`, {});
//     const data = resp.data;
//     let result = data?.data.rooms;
//     result = result
//       .map((f: any) => ({
//         ...f,
//         office_uuid,
//       }))
//       .sort((a: any, b: any) =>
//         new Date(a.created_date).getTime() < new Date(b.created_date).getTime()
//           ? 1
//           : -1
//       );
//     return result;
//   } catch (err: any) {
//     throw err;
//   }
// }

// export function useRooms(office_uuid: string) {
//   return useQuery<IRoom[], Error>(
//     ["rooms", office_uuid],
//     () => getRooms(office_uuid),
//     {
//       refetchOnWindowFocus: false,
//     }
//   );
// }

async function getRooms(params: IUseListParams): Promise<IRoom[]> {
  if (!params.office_uuid) {
    throw "office_uuid should not be empty in getRooms()";
  }
  try {
    const resp = await backend.get(
      `/office/${params.office_uuid}/room${params.status ? `?status=${params.status}` : ""}`,
      {}
    );
    const data = resp.data;
    let result = data?.data.rooms;
    result = result
      .map((f: any) => ({
        ...f,
        office_uuid: params.office_uuid,
      }))
      .sort((a: any, b: any) =>
        new Date(a.created_date).getTime() < new Date(b.created_date).getTime()
          ? 1
          : -1
      );
    return result;
  } catch (err: any) {
    throw err;
  }
}

export function useRooms(params: IUseListParams) {
  return useQuery<IRoom[], Error>(
    ["rooms" + (params.status ? "-" + params.status : ""), params.office_uuid],
    () => getRooms(params),
    {
      refetchOnWindowFocus: false,
    }
  );
}

async function getRoom(office_uuid: string, room_uuid: string): Promise<IRoom> {
  if (!office_uuid) {
    throw "office_uuid and/or room_uuid should not be empty in getRooms()";
  }
  try {
    const resp = await backend.get(`/office/${office_uuid}/room/${room_uuid}`, {});
    const data = resp.data;
    let result = data?.data;

    result.office_uuid = office_uuid;

    return result;
  } catch (err: any) {
    throw err;
  }
}

export function useRoom(office_uuid: string, room_uuid: string) {
  return useQuery<IRoom, Error>(
    ["room", office_uuid, room_uuid],
    () => getRoom(office_uuid, room_uuid),
    {
      refetchOnWindowFocus: false,
    }
  );
}