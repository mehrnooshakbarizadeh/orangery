// external dependencies
import { useMutation, useQuery, useQueryClient } from "react-query";

// queries & backend
import { backend } from "../backend";
import { IUser } from "../dashboard";
import { processError } from "../commons";
import { AxiosRequestConfig } from "axios";
import { OrangeryToast } from "../../components/OrangeryElements";
export interface IConnectResult {
}
export interface IConnectParams {
  accessToken?: string;
  contactIntegration: boolean;
  ecommerceIntegration: boolean;
}

async function connect(params: IConnectParams): Promise<IConnectResult> {
  try {
    const data = {
      hubspot_access_token: params.accessToken,
      hubspot_contact_integration: params.contactIntegration,
      hubspot_ecommerce_integration: params.ecommerceIntegration,
    };
    const response = await backend.put(
      `hubspot/integration`,
      data,
      {}
    );
    const result = response.data;
    return result;
  } catch (err: any) {
    throw err;
  }
}

export function useConnect() {
  const queryClient = useQueryClient();
  return useMutation<IConnectResult, Error, IConnectParams>(
    connect,
    {
      onSuccess: (_, variables) => {
        queryClient.invalidateQueries(["apps"]);
      },
    }
  );
}

async function deleteHubSpot(): Promise<void> {
  try {
    const result = await backend.delete(
      `/hubspot/integration`,
      {}
    );
    const deleteResult = result.data.data;
  } catch (err: any) {
    const processedError = processError(err);
    throw processedError;
  }
}

export function useDeleteHubSpot() {
  const queryClient = useQueryClient();
  return useMutation<void, Error, void>(deleteHubSpot, {
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries(["apps"]);
    },
  });
}

export interface IHubSpot {
  hubspot_contact_integration: boolean;
  hubspot_ecommerce_integration: boolean,

}

async function getHubSpot(): Promise<IHubSpot> {
  try {
    const resp = await backend.get(`hubspot/integration`, {});
    const data = resp.data;
    let result = data?.data;
    return result;
  } catch (err: any) {
    throw err;
  }
}

export function useHubSpotMutation() {
  const queryClient = useQueryClient();
  return useMutation<IHubSpot, Error>(
    getHubSpot,
    {
      onSuccess: (_, variables) => {
        queryClient.invalidateQueries(["hubspot"]);
      },
    }
  );
}

export interface IHubSpotContact {
  createdate: string;
  email: string;
  firstname: string;
  hs_object_id: string;
  lastmodifieddate: string;
  lastname: string | null;
  lifecyclestage: string;
}

export interface IError {
  msg: string;
}

async function getHubSpotContacts(): Promise<IHubSpotContact[]> {
  let conf: AxiosRequestConfig = {};

  conf.validateStatus = (status: number) => {
    if (status == 403) {
      OrangeryToast("Make sure from the Hubspot token and/or the scopes.", "error");
    }
    return (status >= 200 && status < 300) || status == 403;
  };
  try {
    const resp = await backend.get(`/hubspot/contacts?current_day=true`, conf);
    const data = resp.data;
    let result = data?.data;
    return result;
  } catch (err: any) {
    throw err;
  }
}

export function useHubSpotContacts() {
  return useQuery<IHubSpotContact[], Error>(["hubSpotContacts"], () =>
    getHubSpotContacts()
  );
}