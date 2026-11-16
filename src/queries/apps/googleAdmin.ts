// external dependencies
import { useMutation, useQuery, useQueryClient } from "react-query";
import { useGlobalState } from "../../Contexts & Globals/GlobalContext";
// queries & backend
import { backend } from "../backend";
import { backendMock } from "../backendMock";
import { processError } from "../commons";
import axios from "axios";

export interface AxiosRequestConfig {
  validateStatus?: any;
}

export interface IGoogleItemResource {
  id: string;
  name: string;
  synced: boolean;
}

export interface IGoogleItem {
  building: {
    id: string;
    name: string;
    synced: boolean;
    floor_names: string[];
  };
  resources: IGoogleItemResource[];
  error: { message: string; status: number };
}

export interface IOSItemMeetingRoom {
  id: string;
  name: string;
  synced: boolean;
  floor_names: string[];
}

export interface IOSItemOfficeFloor {
  id: string;
  name: string;
}

export interface IOSItem {
  meeting_rooms: IOSItemMeetingRoom[];
  office: {
    floors: IOSItemOfficeFloor[];
    id: string;
    name: string;
    synced: boolean;
  };
  error: { message: string; status: number };
}

export interface IGoogle {
  google_resources: IGoogleItem[];
  os_meeting_rooms: IOSItem[];
}

async function getGoogleAdminPreview(): Promise<IGoogle> {
  try {
    const resp = await backend.get(`/google/admin/resource/sync/preview`, {});
    const data = resp.data;
    let result = data?.data;
    return result;
  } catch (err: any) {
    throw err;
  }
}

export function useGoogleAdminPreview() {
  return useQuery<IGoogle, Error>(["googleAdmin"], () =>
    getGoogleAdminPreview()
  );
}

async function getGoogleAdminPreviewCheck(): Promise<any> {
  let conf: AxiosRequestConfig = {};

  conf.validateStatus = (status: number) => {
    return (status >= 200 && status < 300) || status == 404;
  };
  try {
    const resp = await backend.get(`/google/admin/resource/sync/preview`, conf);
    const data = resp;
    let result = data;
    return result;
  } catch (err: any) {
    throw err;
  }
}
export function useGoogleAdminPreviewCheckMutation() {
  const queryClient = useQueryClient();
  return useMutation<any, Error>(getGoogleAdminPreviewCheck, {
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries(["googleAdmin"]);
    },
  });
}

async function disconnect(): Promise<void> {
  try {
    const result = await backend.delete(
      `/google/admin/resource/credentials`,
      {}
    );
    const deleteResult = result.data.data;
  } catch (err: any) {
    const processedError = processError(err);
    throw processedError;
  }
}

export function useDisconnect() {
  const queryClient = useQueryClient();
  return useMutation<void, Error, void>(disconnect, {
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries(["apps"]);
    },
  });
}

export interface IGoogleImport {
  resources: string[];
  office_id: string;
  floor_id: string;
}

export interface IGoogleImportResult {
  office: string;
  meeting_rooms: { name: string; error: boolean; synced: boolean }[];
}

async function googleImport(
  params: IGoogleImport[]
): Promise<IGoogleImportResult[]> {
  try {
    const data = params;
    const response = await backend.post(
      `/google/admin/resource/sync/import`,
      data,
      {}
    );
    const result = response.data?.data;
    return result;
  } catch (err: any) {
    const processedError = processError(err);
    throw processedError;
  }
}

export function useGoogleImport() {
  const queryClient = useQueryClient();
  return useMutation<IGoogleImportResult[], Error, IGoogleImport[]>(
    googleImport,
    {
      onSuccess: (_, variables) => {
        // const office_uuid = variables.office_uuid;
        queryClient.invalidateQueries(["googleAdmin"]);
      },
    }
  );
}

export interface IGoogleExport {
  meeting_rooms?: string[];
  building_id?: string | null;
  floor_name?: string | null;
}

export interface IGoogleExportResult {
  building: string;
  resources: { name: string; error: boolean; synced: boolean }[];
}

async function googleExport(
  params: (IGoogleExport | undefined)[]
): Promise<IGoogleExportResult[]> {
  try {
    const data = params;
    const response = await backend.post(
      `/google/admin/resource/sync/export`,
      data,
      {}
    );
    const result = response.data?.data;
    return result;
  } catch (err: any) {
    const processedError = processError(err);
    throw processedError;
  }
}

export function useGoogleExport() {
  const queryClient = useQueryClient();
  return useMutation<
    IGoogleExportResult[],
    Error,
    (IGoogleExport | undefined)[]
  >(googleExport, {
    onSuccess: (_, variables) => {
      // const office_uuid = variables.office_uuid;
      queryClient.invalidateQueries(["googleAdmin"]);
    },
  });
}
