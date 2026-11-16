// external dependencies
import { useMutation, useQuery, useQueryClient } from "react-query";

// orangery elements & internal dependencies
import { FormError } from "../states/mobx-form";

// queries & backend
import { backend } from "./backend";
import { processError } from "./commons";

export interface IDoor {
  lock_id: string,
  uuid: string,
  created: string,
  lock_name: string,
  lock_location: string,
  lock_location_id: string,
  iq: {
    uuid: string,
    created: string,
    iq_id: string,
    iq_name: string,
    location_id: string,
    connected: boolean
  }

  name?: string;
}


async function getDoors(office_uuid: string): Promise<IDoor[]> {
  if (!office_uuid) {
    throw "office_uuid should not be empty in getDoors()";
  }
  try {
    const resp = await backend.get(`/salto/get-locks`, {});
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
    // return result;
  } catch (err: any) {
    throw err;
  }
}

export function useDoors(office_uuid: any) {
  return useQuery<IDoor[], Error>(
    ["doors", office_uuid],
    () => getDoors(office_uuid),
    {
      refetchOnWindowFocus: false,
    }
  );
}
