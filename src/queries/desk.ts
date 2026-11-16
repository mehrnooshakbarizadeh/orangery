// external dependencies
import { useMutation, useQuery, useQueryClient } from "react-query";

// orangery elements & internal dependencies
//

// queries & backend
import { backend } from "./backend";
import { IUseListParams, processError } from "./commons";
import { IOffer } from "./tenant"
import { ICustomer } from "./customer";

export interface IDeskParams {
  uuid?: string;
  name: string;
  assigned_user_uuids: string[];
  flex: boolean;
  active: boolean;
  public: boolean;
  is_physical: boolean;
  department_uuid?: string;
  capacity: number;
  price: number;
  floor_uuid: string;
  office_uuid: string;
}
export interface IAssignedUser {
  name: string;
  uuid: string;
  image?: string;
}
export interface IAssignedFloor {
  name: string;
  uuid: string;
}
export interface IDeskResult {
  office_uuid: string;
  uuid: string;
  name: string;
  public: boolean;
  assigned_users: {
    name: string;
    uuid: string;
    image?: string;
  }[];
  assigned_floor?: {
    name: string;
    uuid: string;
  };
  flex: boolean;
  active: boolean;
  is_physical: boolean;
  department: string;
  created_by: string;
  created_date: string;
  updated_by: string;
  bookings: [];
  capacity: number;
  price: number;
  large: false;

  tenant_office_uuid?: string | null;
}
async function upsertDesk(params: IDeskParams): Promise<IDeskResult> {
  try {
    const data = {
      name: params.name,
      assigned_user_uuids: params.assigned_user_uuids,
      flex: params.flex,
      active: params.active,
      public: params.public,
      is_physical: params.is_physical,
      department_uuid: params.department_uuid,
      capacity: params.capacity,
      price: params.price,
      floor_uuid: params.floor_uuid,
    };

    if (params.uuid) {
      const result = await backend.put(
        `/office/${params.office_uuid}/desk/${params.uuid}`,
        data,
        {}
      );
      const finalResult = result.data.data;
      return finalResult.desk;
    } else {
      const result = await backend.post(
        `/office/${params.office_uuid}/desk`,
        data,
        {}
      );
      const finalResult = result.data.data;
      return finalResult.desk;
    }
  } catch (err: any) {
    const processedError = processError(err);
    throw processedError;
  }
}

export function useUpsertDesk() {
  const queryClient = useQueryClient();
  return useMutation<IDeskResult, Error, IDeskParams>(upsertDesk, {
    onSuccess: (data, variables) => {
      const office_uuid = variables.office_uuid;
      queryClient.invalidateQueries(["desks", office_uuid]);
      queryClient.invalidateQueries(["desk", office_uuid, data.uuid]);
    },
  });
}

export interface IDeleteDeskParams {
  office_uuid: string;
  uuid: string;
}
async function deleteDesk(params: IDeleteDeskParams): Promise<void> {
  try {
    const result = await backend.delete(
      `/office/${params.office_uuid}/desk/${params.uuid}`,
      {}
    );
    const deleteResult = result.data.data;
  } catch (err: any) {
    const processedError = processError(err);
    throw processedError;
  }
}

export function useDeleteDesk() {
  const queryClient = useQueryClient();
  return useMutation<void, Error, IDeleteDeskParams>(deleteDesk, {
    onSuccess: (_, variables) => {
      const office_uuid = variables.office_uuid;
      queryClient.invalidateQueries(["desks", office_uuid]);
      queryClient.invalidateQueries(["desk", office_uuid, variables.uuid]);
    },
  });
}

export interface IDeleteMultiDeskParams {
  office_uuid: string;
  uuids: string[];
}
async function deleteMultiDesk(params: IDeleteMultiDeskParams): Promise<void> {
  try {
    const result = await backend.delete(
      `/office/${params.office_uuid}/desk`,
      {
        data: {
          uuids: params.uuids
        }
      }
    );
    const deleteResult = result.data.data;
  } catch (err: any) {
    const processedError = processError(err);
    throw processedError;
  }
}

export function useDeleteMultiDesk() {
  const queryClient = useQueryClient();
  return useMutation<void, Error, IDeleteMultiDeskParams>(deleteMultiDesk, {
    onSuccess: (_, variables) => {
      const office_uuid = variables.office_uuid;
      queryClient.invalidateQueries(['desks', office_uuid]);
      variables.uuids.forEach(uuid => {
        queryClient.invalidateQueries(['desk', office_uuid, uuid]);
      })
    },
  });
}

export interface IDesk {
  office_uuid: string;
  uuid: string;
  name: string;
  assigned_users: {
    name: string;
    uuid: string;
    image?: string;
  }[];
  assigned_floor?: {
    name: string;
    uuid: string;
  };
  flex: boolean;
  active: boolean;
  public: boolean;
  is_physical: boolean;
  department: string;
  created_by?: string;
  created_date?: string;
  updated_by?: string;
  bookings?: [];
  capacity: number;
  price: number;
  large?: false;

  tenant_office_uuid?: string | null;

  product?: IOffer | null;
  customer?: ICustomer | null;

  department_obj?: {
    uuid: string;
    name: string;
  };
}

async function getDesk(office_uuid?: any, desk_uuid?: any): Promise<IDesk> {
  if (!office_uuid || !desk_uuid) {
    throw "office_uuid and/or desk_uuid should not be empty in getDesk()";
  }
  try {
    const resp = await backend.get(
      `/office/${office_uuid}/desk/${desk_uuid}`,
      {}
    );
    const data = resp.data;
    let result = data?.data.desk;

    if (result)
      result.office_uuid = office_uuid
    return result;
  } catch (err: any) {
    throw err;
  }
}

export function useDesk(office_uuid?: any, desk_uuid?: any) {
  return useQuery<IDesk, Error>(
    ["desk", office_uuid, desk_uuid],
    () => getDesk(office_uuid, desk_uuid),
    {
      refetchOnWindowFocus: false,
    }
  );
}

async function getPublicDesks(office_uuid: string): Promise<IDesk[]> {
  if (!office_uuid) {
    throw "office_uuid should not be empty in getDesks()";
  }
  try {
    const resp = await backend.get(`/office/${office_uuid}/desk`, {});
    const data = resp.data;
    let result = data?.data.desks;
    result = result
      .map((f: any) => ({
        ...f,
        office_uuid,
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

export function usePublicDesks(office_uuid: string) {
  return useQuery<IDesk[], Error>(
    ["desks", office_uuid],
    () => getPublicDesks(office_uuid),
    {
      refetchOnWindowFocus: false,
    }
  );
}

async function getDesks(params: IUseListParams): Promise<IDesk[]> {
  if (!params.office_uuid) {
    throw "office_uuid should not be empty in getDesks()";
  }
  try {
    const resp = await backend.get(
      `/office/${params.office_uuid}/desk${params.status ? `?status=${params.status}` : ""}`,
      {}
    );
    const data = resp.data;
    let result = data?.data.desks;
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

export function useDesks(params: IUseListParams) {
  return useQuery<IDesk[], Error>(
    ["desks", params.office_uuid, params.status],
    () => getDesks(params),
    {
      refetchOnWindowFocus: false,
    }
  );
}
