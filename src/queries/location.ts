import { useQuery } from "react-query";
import { backend } from "./backend";
import { IImage } from "./content-management";

export interface ILocation {
    uuid: string,
    name: string,
    address: string,
    phone: string,
    email: string,
    lat: number,
    lon: number,
    timezone: string,
    images: IImage,
    day_pass_price: number,
    opening_times: {}
}

async function getLocations(office_uuid: string): Promise<ILocation[]> {
    if (!office_uuid) {
      throw "office_uuid should not be empty in getContent()";
    }
    try {
      const resp = await backend.get(`/orangery/locations`, {});
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
    } catch (err: any) {
      throw err;
    }
  }
  
  export function useLocations(office_uuid: string) {
    return useQuery<ILocation[], Error>(
      ["locations", office_uuid],
      () => getLocations(office_uuid),
      {
        refetchOnWindowFocus: false,
      }
    );
  }