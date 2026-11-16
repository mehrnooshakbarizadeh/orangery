// external dependencies
import { useMutation, useQuery, useQueryClient } from "react-query";

// queries & backend
import { backend } from "../backend";
import { processError } from "../commons";
import { IDoor } from "./saltoKs";
import { IOffer } from "../tenant";


export interface IConnectResult { }

async function connect(): Promise<IConnectResult> {
  try {
    const data = {};
    const response = await backend.post(`/automation-flow/integrate`, data, {});
    const result = response.data;
    return result;
  } catch (err: any) {
    throw err;
  }
}

export function useConnect() {
  const queryClient = useQueryClient();
  return useMutation<IConnectResult, Error, void>(connect, {
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries(["apps"]);
    },
  });
}

async function disconnect(): Promise<void> {
  try {
    const result = await backend.delete(`/automation-flow/integrate`, {});
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

export interface IAutomation {
  uuid: string;
  name: string;
  offer_types: string[];
  groups: string[];
  access_from_time?: string | null;
  access_until_time?: string | null;
  active_from: string | null;
  active_until: string | null;
  company: {
    uuid: string;
    name: string;
  };
  office: {
    uuid: string;
    name: string;
  };
  doors: IDoor[];
  products:
  IOffer[];
  // {
  //   uuid: string;
  //   name: string;
  //   description: string;
  //   quantity: number;
  //   type: string;
  // }[];
  created_by: string;
  created_date: string;
  updated_by: string;
  timestamp: number;
}

async function getAutomation(uuid?: string): Promise<IAutomation> {
  if (!uuid) {
    throw "automation uuid should not be empty in getAutomation()";
  }
  try {
    const resp = await backend.get(`/automation-flow/${uuid}`, {});
    const data = resp.data;
    let result = data?.data;
    return result;
  } catch (err: any) {
    throw err;
  }
}

export function useAutomation(uuid?: string) {
  return useQuery<IAutomation, Error>(
    ["automation", uuid],
    () => getAutomation(uuid),
    {
      refetchOnWindowFocus: false,
    }
  );
}

async function getAutomations(): Promise<IAutomation[]> {

  try {
    const resp = await backend.get(`/automation-flow`, {});
    const data = resp.data;
    let result = data?.data;
    result = result
      .map((e: any) => ({
        ...e,
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

export function useAutomations() {
  return useQuery<IAutomation[], Error>(
    ["automations"],
    () => getAutomations(),
    {
      refetchOnWindowFocus: false,
    }
  );
}

async function getAllOffers(): Promise<IOffer[]> {

  try {
    const resp = await backend.get(`/company/products`, {});
    const data = resp.data;
    let result = data?.data;
    result = result
      .map((f: any) => ({
        ...f,
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

export function useAllOffers() {
  return useQuery<IOffer[], Error>(
    ["allOffers"],
    () => getAllOffers(),
    {
      refetchOnWindowFocus: false,
    }
  );
}

export interface IAutomationParams {
  uuid: string;
  name: string;
  offer_types?: string[];
  groups?: string[];
  access_from_time?: string | null;
  access_until_time?: string | null;
  active_from?: string | null;
  active_until?: string | null;
  office_uuid?: string;
  doors: string[];
  products_uuids?: string[];
}

async function upsertAutomation(
  params: IAutomationParams
): Promise<IAutomation> {
  try {
    const data = {
      name: params.name,
      offer_types: params.offer_types,
      groups: params.groups,
      access_from_time: params.access_from_time,
      access_until_time: params.access_until_time,
      active_from: params.active_from,
      active_until: params.active_until,
      office_uuid: params.office_uuid,
      doors: params.doors,
      products: params.products_uuids,
    }
    if (params.uuid) {
      const response = await backend.put(
        `/automation-flow/${params.uuid}`,
        data,
        {}
      );
      const result = response.data.data;
      return result;
    } else {
      const response = await backend.post(
        `/automation-flow`,
        data,
        {}
      );
      const result = response.data.data;
      return result;
    }
  } catch (err: any) {
    const processedError = processError(err);
    throw processedError;
  }
}

export function useUpsertAutomation() {
  const queryClient = useQueryClient();
  return useMutation<IAutomation, Error, IAutomationParams>(
    upsertAutomation,
    {
      onSuccess: (data, variables) => {
        queryClient.invalidateQueries(["automations"]);
      },
    }
  );
}

export interface IDeleteAutomationParam {
  uuid: string;
}

async function deleteAutomation(
  params: IDeleteAutomationParam
): Promise<void> {
  try {
    const result = await backend.delete(
      `/automation-flow/${params.uuid}`,
      {}
    );
    const deleteResult = result.data.data;
  } catch (err: any) {
    const processedError = processError(err);
    throw processedError;
  }
}

export function useDeleteAutomation() {
  const queryClient = useQueryClient();
  return useMutation<void, Error, IDeleteAutomationParam>(deleteAutomation, {
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries(["automations"]);
      queryClient.invalidateQueries([
        "auotmation",
        variables.uuid,
      ]);
    },
  });
}

