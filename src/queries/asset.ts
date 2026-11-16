// external dependencies
import { useMutation, useQuery, useQueryClient } from "react-query";

// orangery elements & internal dependencies
import { FormError } from "../states/mobx-form";

// queries & backend
import { backend } from "./backend";
import { IUseListParams } from "./commons";
import { IMedia } from "./media";

export interface IAssetParams {
  uuid?: string;
  name: string;
  serial_number: string;
  price: number;
  stock: number;
  image_uuids?: string[];
  invoice_uuid?: File | string;
  active: boolean;
  user_uuid: string;
  floor_uuid: string;
  office_uuid: string;

  updateDashboard?: boolean;
}
export interface IAssetParamsResult {}
// export interface IAssetUpsertResult { }

// export interface IAssetUpsertParams {
//   data: IAssetParams;
//   image: File | string;
//   invoice: File | string;
// }

async function upsertAsset(params: IAssetParams): Promise<IAssetParamsResult> {
  try {
    const data = {
      name: params.name,
      serial_number: params.serial_number,
      price: params.price,
      stock: params.stock,
      active: params.active,
      user_uuid: params.user_uuid,
      floor_uuid: params.floor_uuid,
      image_uuid: params.image_uuids,
      invoice_uuid: params.invoice_uuid,
    };

    if (params.uuid) {
      const result = await backend.put(
        `/office/${params.office_uuid}/asset/${params.uuid}`,
        data,
        {}
      );
      const finalResult = result.data.data;
      return { finalResult };
    } else {
      const result = await backend.post(
        `/office/${params.office_uuid}/asset`,
        data,
        {}
      );
      const finalResult = result.data.data;
      return { finalResult };
    }
  } catch (err: any) {
    const processedError = processError(err);
    throw processedError;
  }
}

export function useUpsertAsset() {
  const queryClient = useQueryClient();
  return useMutation<IAssetParamsResult, Error, IAssetParams>(upsertAsset, {
    onSuccess: (_, variables) => {
      const office_uuid = variables.office_uuid;
      queryClient.invalidateQueries(["assets", office_uuid]);
      if (variables.updateDashboard) {
        queryClient.invalidateQueries(["dashboard", office_uuid]);
      }
    },
  });
}

export interface IAssetDeleteParams {
  office_uuid: string;
  uuid: string;
}
async function deleteAsset(params: IAssetDeleteParams): Promise<void> {
  try {
    const result = await backend.delete(
      `/office/${params.office_uuid}/asset/${params.uuid}`,
      {}
    );
    const deleteResult = result.data.data;
  } catch (err: any) {
    const processedError = processError(err);
    throw processedError;
  }
}

export function useDeleteAsset() {
  const queryClient = useQueryClient();
  return useMutation<void, Error, IAssetDeleteParams>(deleteAsset, {
    onSuccess: (_, variables) => {
      const office_uuid = variables.office_uuid;
      queryClient.invalidateQueries(["assets", office_uuid]);
    },
  });
}

export interface IFile {
  uuid: string;
  name: string;
  created_by: string;
  created_date: string;
  updated_by: string;
  timestamp: number;
}

export interface IUser {
  name: string;
  uuid: string;
  status?: string;
  image?: string;
  has_thumbnail?: boolean;
}

export interface IFloor {
  name: string;
  uuid: string;
}

export interface IAsset {
  uuid: string;
  name: string;
  price: number;
  serial_number: string;
  images: IMedia[];
  invoice: IMedia;
  assigned_user?: IUser;
  assigned_floor?: IFloor;
  active: boolean;
  created_by: string;
  created_date: string;
  updated_by: string;
  timestamp: number;

  assignment_date?: Date;

  tenant_office_uuid?: string | null;
}

export interface IAssetGroup {
  // uuid: string;
  office_uuid: string;
  name: string;
  stock: number;
  image: string;
  assets: IAsset[];
  has_thumbnail?: boolean;
}

async function getAsset(office_uuid?: any, asset_uuid?: any): Promise<IAsset> {
  if (!office_uuid || !asset_uuid) {
    throw "office_uuid and/or asset_uuid should not be empty in getAsset()";
  }
  try {
    const resp = await backend.get(
      `/office/${office_uuid}/asset/${asset_uuid}`,
      {}
    );
    const data = resp.data;
    let result = data?.data.asset;
    return result;
  } catch (err: any) {
    throw err;
  }
}

export function useAsset(office_uuid?: any, asset_uuid?: any) {
  return useQuery<IAsset, Error>(
    ["asset", office_uuid, asset_uuid],
    () => getAsset(office_uuid, asset_uuid),
    {
      refetchOnWindowFocus: false,
    }
  );
}

async function getAssetGroups(office_uuid: string): Promise<IAssetGroup[]> {
  if (!office_uuid) {
    throw "office_uuid should not be empty in getAssets()";
  }
  try {
    const resp = await backend.get(`/office/${office_uuid}/asset/grouped`, {});
    const data = resp.data;
    let result = data?.data;
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

export function useAssetGroups(office_uuid: string) {
  return useQuery<IAssetGroup[], Error>(
    ["assets", office_uuid],
    () => getAssetGroups(office_uuid),
    {
      refetchOnWindowFocus: false,
    }
  );
}

async function getAssetGroupsRentable(office_uuid: string): Promise<IAssetGroup[]> {
  if (!office_uuid) {
    throw "office_uuid should not be empty in getAssets()";
  }
  try {
    const resp = await backend.get(`/office/${office_uuid}/asset/grouped?status=rentable`, {});
    const data = resp.data;
    let result = data?.data;
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

export function useAssetGroupsRentable(office_uuid: string) {
  return useQuery<IAssetGroup[], Error>(
    ["assets", office_uuid],
    () => getAssetGroupsRentable(office_uuid),
    {
      refetchOnWindowFocus: false,
    }
  );
}
async function getAssetGroupsRentableEvent(office_uuid: string): Promise<IAsset[]> {
  if (!office_uuid) {
    throw "office_uuid should not be empty in getAssetGroupsRentableEvent()";
  }
  try {
    const resp = await backend.get(`/office/${office_uuid}/asset/grouped?status=rentable`, {});
    const data = resp.data;
    let result = data?.data.assets;
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

export function useAssetGroupsRentableEvent(office_uuid: string) {
  return useQuery<IAsset[], Error>(
    ["assets", office_uuid],
    () => getAssetGroupsRentableEvent(office_uuid),
    {
      refetchOnWindowFocus: false,
    }
  );
}

async function getAssets(params: IUseListParams): Promise<IAsset[]> {
  if (!params.office_uuid) {
    throw "office_uuid should not be empty in getAssets()";
  }
  try {
    const resp = await backend.get(
      `/office/${params.office_uuid}/asset${
        params.status ? `?status=${params.status}` : ""
      }`,
      {}
    );
    const data = resp.data;
    let result = data?.data.assets;
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

export function useAssets(params: IUseListParams) {
  return useQuery<IAsset[], Error>(
    ["assets" + (params.status ? "-" + params.status : ""), params.office_uuid],
    () => getAssets(params),
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
