// external dependencies
import { useQuery } from "react-query";

// queries & backend
import { backend } from "./backend";

export interface IGroup {
  // office_uuid: string;
  display_name: string;
  name: string;
  uuid: string;
  views: string[];
}

async function getGroups(): Promise<IGroup[]> {
  try {
    const resp = await backend.get(`/groups`, {});
    const data = resp.data;
    let result = data?.data;
    // result = result.map((d: any) => ({
    //   name: d.name,
    //   display_name: d.display_name,
    //   uuid: d.uuid,
    //   // office_uuid,
    // }));

    return result;
  } catch (err: any) {
    throw err;
  }
}

export function useGroups() {
  return useQuery<IGroup[], Error>(["groups"], () => getGroups(), {
    refetchOnWindowFocus: false,
  });
}
