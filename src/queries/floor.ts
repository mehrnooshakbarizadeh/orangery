// external dependencies
import { useMutation, useQuery, useQueryClient } from "react-query";

// orangery elements & internal dependencies
import { FormError } from "../states/mobx-form";

// queries & backend
import { backend } from "./backend";
import { processError } from "./commons";

export interface IFloorParams {
  name: string;
  uuid?: string;
  office_uuid: string;
}
export interface IFloorResult {
  uuid: string;
}
async function upsertFloor(params: IFloorParams): Promise<IFloorResult> {
  try {
    const data = {
      name: params.name,
    };
    if (params.uuid) {
      const response = await backend.put(
        `/office/${params.office_uuid}/floor/${params.uuid}`,
        data,
        {}
      );
      const result = response.data.data?.floor;
      return result;
    } else {
      const response = await backend.post(
        `/office/${params.office_uuid}/floor`,
        data,
        {}
      );
      const result = response.data.data?.floor;
      return result;
    }
  } catch (err: any) {
    const processedError = processError(err);
    throw processedError;
  }
}

export function useUpsertFloor() {
  const queryClient = useQueryClient();
  return useMutation<IFloorResult, Error, IFloorParams>(upsertFloor, {
    onSuccess: (_, variables) => {
      const office_uuid = variables.office_uuid;
      queryClient.invalidateQueries(["floors", office_uuid]);
      queryClient.invalidateQueries(["offices"]);
    },
  });
}

export interface IDeleteFloorParams {
  office_uuid: string;
  uuid: string;
}
async function deleteFloor(params: IDeleteFloorParams): Promise<void> {
  try {
    const result = await backend.delete(
      `/office/${params.office_uuid}/floor/${params.uuid}`,
      {}
    );
    const deleteResult = result.data.data;
  } catch (err: any) {
    const processedError = processError(err);
    throw processedError;
  }
}

export function useDeleteFloor() {
  const queryClient = useQueryClient();
  return useMutation<void, Error, IDeleteFloorParams>(deleteFloor, {
    onSuccess: (_, variables) => {
      const office_uuid = variables.office_uuid;
      queryClient.invalidateQueries(["floors", office_uuid]);
    },
  });
}

export interface IFloor {
  uuid: string;
  office_uuid: string;
  name: string;
  data: {};
  desks: [];
  map_items: [];

  tenant_office_uuid?: string | null;
}

async function getFloor(office_uuid?: any, floor_uuid?: any): Promise<IFloor> {
  if (!office_uuid || !floor_uuid) {
    throw "office_uuid and/or floor_uuid should not be empty in getFloor()";
  }
  try {
    const resp = await backend.get(
      `/office/${office_uuid}/floor/${floor_uuid}`,
      {}
    );
    const data = resp.data;
    let result = data?.data.floor;
    return result;
  } catch (err: any) {
    throw err;
  }
}

export function useFloor(office_uuid?: any, floor_uuid?: any) {
  return useQuery<IFloor, Error>(
    ["floor", office_uuid, floor_uuid],
    () => getFloor(office_uuid, floor_uuid),
    {
      refetchOnWindowFocus: false,
    }
  );
}

async function getFloors(office_uuid: string): Promise<IFloor[]> {
  if (!office_uuid) {
    throw "office_uuid should not be empty in getFloors()";
  }
  try {
    const resp = await backend.get(`/office/${office_uuid}/floor`, {});
    const data = resp.data;
    let result = data?.data.floors;
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

export function useFloors(office_uuid: any) {
  return useQuery<IFloor[], Error>(
    ["floors", office_uuid],
    () => getFloors(office_uuid),
    {
      refetchOnWindowFocus: false,
    }
  );
}
