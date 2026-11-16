// external dependencies
import { useMutation, useQuery, useQueryClient } from "react-query";

// queries & backend
import { backend } from "../backend";
import { IUser } from "../dashboard";
import { IOffice } from "../office";
import { processError } from "../commons";

export interface IActivityLog {
  uuid: string;
  created: string;
  user: IUser;
  message: string;
}

async function getActivityLogs(): Promise<IActivityLog[]> {
  try {
    const resp = await backend.get(`/salto/get-logs`, {});
    const data = resp.data;
    let result = data?.data?.logs;
    result = result
      .sort((a: any, b: any) =>
        new Date(a.created).getTime() < new Date(b.created).getTime()
          ? 1
          : -1
      );
    return result;
  } catch (err: any) {
    throw err;
  }
}

export function useActivityLogs() {
  return useQuery<IActivityLog[], Error>(
    ["saltoKsActivityLogs"],
    () => getActivityLogs(),
    {
      refetchOnWindowFocus: false,
    }
  );
}

export interface IDoorAccess {
  uuid: string;
  name: string;
  first_name: string;
  last_name: string;
  email: string;
  image: string | null;
  door_accesses: {
    lock_name: string;
    lock_id: string;
    office?: IOffice
  }[]

  tenant_office_uuid?: string;
}

async function getDoorAccesses(): Promise<IDoorAccess[]> {
  try {
    const resp = await backend.get(`/salto/get-users`, {});
    const data = resp.data;
    let result = data?.data?.users;
    // result = result
    //   .sort((a: any, b: any) =>
    //     new Date(a.created).getTime() < new Date(b.created).getTime()
    //       ? 1
    //       : -1
    //   );

    return result;
  } catch (err: any) {
    throw err;
  }
}

export function useDoorAccesses() {
  return useQuery<IDoorAccess[], Error>(
    ["saltoKsDoorAccesses"],
    () => getDoorAccesses(),
    {
      refetchOnWindowFocus: false,
    }
  );
}

export interface IDoorAccessInsertParams {
  user_uuid: string;
  lock_ids: string[];
  remove_lock_ids: string[];
}

export interface IDoorAccessResult {
}

async function insertDoorAccess(
  params: IDoorAccessInsertParams
): Promise<IDoorAccessResult> {
  try {
    const data = {
      user_uuid: params.user_uuid,
      lock_ids: params.lock_ids,
      remove_lock_ids: params.remove_lock_ids,
    };
    const response = await backend.post(
      `/salto/assign-locks`,
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

export function useInsertDoorAccess() {
  const queryClient = useQueryClient();
  return useMutation<IDoorAccessResult, Error, IDoorAccessInsertParams>(
    insertDoorAccess,
    {
      onSuccess: (_, variables) => {
        queryClient.invalidateQueries(["saltoKsDoorAccesses"]);
      },
    }
  );
}

export interface IIq {
  uuid: string;
  created: string;
  iq_id: string;
  iq_name: string;
  connected: boolean;

  location?: string;
  location_id: string;

  data?: any;
  // sample "data": {
  // "id": "193ddc9a-b3c2-11eb-98ca-000d3a46ad5a",
  // "customer_reference": "IQ - Orangery - Stralsund - Kaffee",
  // "time_zone": "Europe/Berlin",
  // "mac": "0C.90.32",
  // "operator": "Unknown",
  // "state": "active",
  // "restore_required": false,
  // "reset_date": "2021-07-12T07:47:47Z",
  // "online": true,
  // "led_enabled": true,
  // "data_sync_state": "not_synced",
  // "signal_strength": 31,
  // "revision": "2.0"
  // }
}

async function getIqs(): Promise<IIq[]> {
  try {
    const resp = await backend.get(`/salto/get-iqs`, {});
    const data = resp.data;
    let result = data?.data?.iqs;
    result = result
      .sort((a: any, b: any) =>
        a.connected && !b.connected
          ? 1
          : -1
      );
    return result;
  } catch (err: any) {
    throw err;
  }
}

export function useIqs() {
  return useQuery<IIq[], Error>(
    ["saltoKsIqs"],
    () => getIqs(),
    {
      refetchOnWindowFocus: false,
    }
  );
}

export interface IIqOldPinResult {
  success: boolean;
  data: boolean;
}

export interface IIqOldPinParams {
  iq_id: string;
}

async function requestIqOldPinSms(params: IIqOldPinParams): Promise<IIqOldPinResult> {
  try {
    const data = {
    };
    const response = await backend.put(
      `/salto/iq/${params.iq_id}/sms`,
      data,
      {}
    );
    const result = response.data;
    return result;
  } catch (err: any) {
    throw err;
  }
}

export function useRequestIqOldPinSms(params: IIqOldPinParams) {
  return useQuery<IIqOldPinResult, Error>(
    ["saltoKsRequestIqOldPinSms"],
    () => requestIqOldPinSms(params),
    {
      refetchOnWindowFocus: false,
    }
  );
}

export interface IIqConnectResult {
  success: boolean;
  data: boolean;
}

export interface IIqConnectParams {
  iq_id: string;
  old_pin: string;
  new_pin: string;
}

async function connectIq(params: IIqConnectParams): Promise<IIqConnectResult> {
  try {
    const data = {
      old_pin: params.old_pin,
      new_pin: params.new_pin
    };
    const response = await backend.put(
      `/salto/iq/${params.iq_id}/new-pin`,
      data,
      {}
    );
    const result = response.data;
    return result;
  } catch (err: any) {
    throw err;
  }
}

export function useConnectIq() {
  const queryClient = useQueryClient();
  return useMutation<IIqConnectResult, Error, IIqConnectParams>(
    connectIq,
    {
      onSuccess: (_, variables) => {
        queryClient.invalidateQueries(["saltoKsIqs"]);
      },
    }
  );
}

export interface ILock {
  uuid: string;
  lock_id: string;
  lock_name: string;

  created: string;
  lock_location: string;
  lock_location_id: string;
  iq: IIq;

  data?: any

  office?: IOffice

  users?: IDoorAccess[]
}

async function getLocks(withUsers?: boolean): Promise<ILock[]> {
  try {
    const resp = await backend.get(`/salto/get-locks`, {});
    const data = resp.data;
    let result = data?.data;

    result = result.map((lock: ILock) => ({
      ...lock,
      users: [] as IDoorAccess[]
    }));

    if (withUsers) {
      const resp = await backend.get(`/salto/get-users`, {});
      const data = resp.data;
      let doorAccessesResult = data?.data?.users;

      result = result.map((lock: ILock) => ({
        ...lock,
        users: [
          ...(lock.users ?? []),
          ...doorAccessesResult?.filter(
            (user: IDoorAccess) => user.door_accesses.find(
              (doorAccess) => doorAccess.lock_id === lock.lock_id)
          )
        ]
      }))
    }

    // result = result
    // .sort((a: any, b: any) =>
    //   new Date(a.created).getTime() < new Date(b.created).getTime()
    //     ? 1
    //     : -1
    // );
    return result;
  } catch (err: any) {
    throw err;
  }
}

export function useLocks(withUsers?: boolean) {
  return useQuery<ILock[], Error>(
    ["saltoKsLocks"],
    () => getLocks(withUsers),
    {
      refetchOnWindowFocus: false,
    }
  );
}

export interface IDoor {
  uuid: string;
  lock_name: string;
  lock_id: string;
  office?: string;
  lock_location?: string;
}

async function getDoors(): Promise<IDoor[]> {
  try {
    const resp = await backend.get(`/salto/get-locks`, {});
    const data = resp.data;
    let result = data?.data;

    result = result.map((lock: ILock) => ({
      uuid: lock.uuid,
      lock_name: lock.lock_name,
      lock_id: lock.lock_id,
      office: lock.office?.name,
      lock_location: lock.lock_location,
    }));
    return result;
  } catch (err: any) {
    throw err;
  }
}

export function useDoors() {
  return useQuery<IDoor[], Error>(
    ["saltoKsDoors"],
    () => getDoors(),
    {
      refetchOnWindowFocus: false,
    }
  );
}

export interface IOpenLockParams {
  lock_id: string;
}

export interface IOpenLockResult {
  success: boolean;
  data: boolean;
}

async function openLock(
  params: IOpenLockParams
): Promise<IOpenLockResult> {
  try {
    const data = {
    };
    const response = await backend.put(
      `/salto/lock/${params.lock_id}/open-lock-admin`,
      data,
      {}
    );
    const result = response.data;
    return result;
  } catch (err: any) {
    const processedError = processError(err);
    throw processedError;
  }
}

export function useOpenLock() {
  const queryClient = useQueryClient();
  return useMutation<IOpenLockResult, Error, IOpenLockParams>(openLock, {
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries(["saltoKsLocks"]);
    },
  });
}

export interface IConnectResult {
  success: boolean;
  data: boolean;
}

export interface IConnectParams {
  salto_api_admin_email: string;
  salto_api_admin_password: string;
}

async function connect(params: IConnectParams): Promise<IConnectResult> {
  try {
    const data = {
      salto_api_admin_email: params.salto_api_admin_email,
      salto_api_admin_password: params.salto_api_admin_password,
    };
    const response = await backend.post(
      `/salto/integrate`,
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

async function deleteSaltoKs(): Promise<void> {
  try {
    const result = await backend.delete(
      `/salto/integrate`,
      {}
    );
    const deleteResult = result.data.data;
  } catch (err: any) {
    const processedError = processError(err);
    throw processedError;
  }
}

export function useDeleteSaltoKs() {
  const queryClient = useQueryClient();
  return useMutation<void, Error, void>(deleteSaltoKs, {
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries(["apps"]);
    },
  });
}

export interface ILockUpdateParams {
  office_uuid: string;
  lock_id: string;
}

export interface ILockUpdateResult { }

async function updateLock(params: ILockUpdateParams): Promise<ILockUpdateResult> {
  try {
    const data = params;
    const response = await backend.put(
      `/salto/lock/${params.lock_id}`,
      data,
      {}
    );
    const result = response.data;
    return result;
  } catch (err: any) {
    throw err;
  }
}

export function useUpdateLock() {
  const queryClient = useQueryClient();
  return useMutation<ILockUpdateResult, Error, ILockUpdateParams>(updateLock, {
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries(["saltoKsLocks", variables.lock_id]);
    },
  });
}