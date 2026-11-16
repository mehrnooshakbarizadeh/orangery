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

export interface IGoogleUser {
  first_name: string;
  last_name: string;
  email: string;
}

async function getGoogleAdminUsersPreview(): Promise<IGoogleUser[]> {
  try {
    const resp = await backend.get(`/google/admin/user/sync/preview`, {});
    const data = resp.data;
    let result = data?.data;
    return result;
  } catch (err: any) {
    throw err;
  }
}

export function useGoogleAdminUsersPreview() {
  return useQuery<IGoogleUser[], Error>(["googleAdminUsers"], () =>
    getGoogleAdminUsersPreview()
  );
}

async function getGoogleAdminUsersPreviewCheck(): Promise<any> {
  let conf: AxiosRequestConfig = {};

  conf.validateStatus = (status: number) => {
    return (status >= 200 && status < 300) || status == 403 || status == 400;
  };
  try {
    const resp = await backend.get(`/google/admin/user/sync/preview`, conf);
    const data = resp;
    let result = data;
    return result;
  } catch (err: any) {
    throw err;
  }
}
export function useGoogleAdminUsersPreviewCheckMutation() {
  const queryClient = useQueryClient();
  return useMutation<any, Error>(getGoogleAdminUsersPreviewCheck, {
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries(["googleAdminUsers"]);
    },
  });
}

async function disconnect(): Promise<void> {
  try {
    const result = await backend.delete(`/google/admin/user/credentials`, {});
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

export interface IGoogleUserImport {
  first_name: string;
  last_name: string;
  email: string;
  group_uuid: string;
  office_id: string;
}

export interface IGoogleUserImportResult {
  name: string;
  error: string | null;
}

async function googleUserImport(
  params: IGoogleUserImport[]
): Promise<IGoogleUserImportResult[]> {
  try {
    const data = params;
    const response = await backend.post(
      `/google/admin/user/sync/import`,
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

export function useGoogleUserImport() {
  const queryClient = useQueryClient();
  return useMutation<IGoogleUserImportResult[], Error, IGoogleUserImport[]>(
    googleUserImport,
    {
      onSuccess: (_, variables) => {
        // const office_uuid = variables.office_uuid;
        queryClient.invalidateQueries(["googleAdminUsers"]);
      },
    }
  );
}
