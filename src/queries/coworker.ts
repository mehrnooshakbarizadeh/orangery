// external dependencies
import { useQuery } from "react-query";

// orangery elements & internal dependencies
import { FormError } from "../states/mobx-form";

// queries & backend
import { backend } from "./backend";

export interface ICoworker {
  uuid: string;
  office_uuid: string;
  name: string;
  image?: string;
  email: string;
  role?: string;
}

async function getCoworkers(office_uuid: string, withoutVisitors?: boolean): Promise<ICoworker[]> {
  if (!office_uuid) {
    throw "office_uuid should not be empty in getCoworkers()";
  }
  try {
    const resp = await backend.get(`/office/${office_uuid}/coworker${withoutVisitors ? "/user_office" : ""}`, {});
    const data = resp.data;
    let result = data?.data;
    result = result
      .map((e: any) => ({
        ...e,
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

export function useCoworkers(office_uuid: string, withoutVisitors?: boolean) {
  return useQuery<ICoworker[], Error>(
    [`coworkers${withoutVisitors ? "WithoutVisitors" : ""}`, office_uuid],
    () => getCoworkers(office_uuid, withoutVisitors),
    {
      refetchOnWindowFocus: false,
    }
  );
}

async function getAllCoworker(office_uuid: string): Promise<ICoworker[]> {
  if (!office_uuid) {
    throw "office_uuid should not be empty in getCoworkers()";
  }
  try {
    const resp = await backend.get(`/office/${office_uuid}/coworker/user_office`, {});
    const data = resp.data;
    let result = data?.data;
    result = result
      .map((e: any) => ({
        ...e,
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

export function useAllCoworker(office_uuid: string, withoutVisitors?: boolean) {
  return useQuery<ICoworker[], Error>(
    ["coworkers", office_uuid],
    () => getAllCoworker(office_uuid),
    {
      refetchOnWindowFocus: false,
    }
  );
}