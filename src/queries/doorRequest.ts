import { useMutation, useQuery, useQueryClient } from "react-query";
import { backend } from "./backend";
import { IUseListParams, processError } from "./commons";
import { IOffer } from "./tenant"
import { ICustomer } from "./customer";
import { doorRequest } from "../components/dashboard/apps/saltoKs/doorRequestsTab/DoorRequestSample";

// export type DoorRequestActionStatus = 'accept' | 'reject' | 'pending' | 'string'

export interface IDoorRequest {
  uuid: string;
  created: string;
  status: string;
  user: {
    uuid: string;
    name: string;
    email: string;
    image: null;
  };
  lock: {
    uuid: string;
    lock_id: number;
    lock_name: string;
    lock_location: string;
    office: {
      name: string;
      uuid: string;
    };
  };
  product: {
    uuid: string;
    name: string;
    description: string;
    quantity: number;
    type: string;
  };
}

export interface IDoorRequestParams {
  door_request_uuid: string;
  door_request_uuids: string[],
  status: string;
}

export interface IDoorRequestResult {
  door_request_uuids: string[],
  door_request_uuid: string,
  status: string,
}
async function putDoorRequest(params: IDoorRequestParams): Promise<IDoorRequestResult> {
  try {
    const data = {
      door_request_uuids: params.door_request_uuids,
      door_request_uuid: params.door_request_uuid,
      status: params.status,
    };

    if (params.door_request_uuid) {
      const result = await backend.put(
        `/door-request`,
        data,
        {}
      );
      
      const finalResult = result.data.data;
      return finalResult.doorRequest;
    } else {
      const result = await backend.post(
        `/door-request`,
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

export function usePutDoorRequest() {
  const queryClient = useQueryClient();
  return useMutation<IDoorRequestResult, Error, IDoorRequestParams>(putDoorRequest, {
    onSuccess: (data, variables) => {
      // const office_uuid = variables.office_uuid;
      queryClient.invalidateQueries(["door-requests"]);
      queryClient.invalidateQueries(["door-request", data.door_request_uuid]);
    },
  });
}

export interface IDoorRequest {
  uuid: string;
  created: string;
  status: string;
  // status: DoorRequestActionStatus;
  user: {
    uuid: string;
    name: string;
    email: string;
    image: null;
  };
  lock: {
    uuid: string;
    lock_id: number;
    lock_name: string;
    lock_location: string;
    office: {
      name: string;
      uuid: string;
    };
  };
  product: {
    uuid: string;
    name: string;
    description: string;
    quantity: number;
    type: string;
  };
}


async function getDoorRequests(): Promise<IDoorRequest[]> {
 
  try {
    const resp = await backend.get(
      `/door-request`,
      {}
    );
    const data = resp.data;
    let result = data?.data.door_requests;
    result = result
    return result;
  } catch (err: any) {
    throw err;
  }
}

export function useDoorRequests() {
  return useQuery<IDoorRequest[], Error>(
    ["door-requests"],
    () => getDoorRequests(),
    {
      refetchOnWindowFocus: false,
    }
  );
}
