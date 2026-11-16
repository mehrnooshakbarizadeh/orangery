// external dependencies
import { useQuery } from "react-query";

// queries & backend
import { backend } from "./backend";
// import { IVisitorType } from "./visitor";

export interface ISchedule {}

async function getOfficeSchedule(office_uuid: string): Promise<any> {
  if (!office_uuid) {
    throw "office_uuid should not be empty in getSchedule()";
  }
  try {
    const resp = await backend.get(
      `/office/${office_uuid}/dashboard-schedule`,
      {}
    );
    const data = resp.data;
    let result = data?.data;
    return result;
  } catch (err: any) {
    throw err;
  }
}

export function useOfficeSchedule(office_uuid: string) {
  return useQuery<any[], Error>(
    ["officeSchedule", office_uuid],
    () => getOfficeSchedule(office_uuid),
    {
      refetchOnWindowFocus: false,
    }
  );
}

async function getOrganizationSchedule(): Promise<any> {
  try {
    const resp = await backend.get(`/dashboard-schedule`, {});
    const data = resp.data;
    let result = data?.data;

    return result;
  } catch (err: any) {
    throw err;
  }
}

export function useOrganizationSchedule() {
  return useQuery<any[], Error>(
    ["organizationSchedule"],
    () => getOrganizationSchedule(),
    {
      refetchOnWindowFocus: false,
    }
  );
}
