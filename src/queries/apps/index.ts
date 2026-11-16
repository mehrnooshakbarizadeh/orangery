// external dependencies
import { useMutation, useQuery, useQueryClient } from "react-query";

// queries & backend
import { backend } from "../backend";

export interface IApp {
  uuid: string;
  name: string;
  image?: string;
  integrated: boolean;
  description?: string;
  price?: number;

  events?: string[];
}

async function getApps(): Promise<IApp[]> {
  try {
    const resp = await backend.get(`/app`, {});
    const data = resp.data;
    let result = data?.data;
    // result = result
    // .sort((a: any, b: any) =>
    //   new Date(a.created_date).getTime() < new Date(b.created_date).getTime()
    //     ? 1
    //     : -1
    // );
    return result;
  } catch (err: any) {
    throw err;
  }
}

export function useApps() {
  return useQuery<IApp[], Error>(
    ["apps"],
    () => getApps(),
    {
      refetchOnWindowFocus: false,
    }
  );
}

export function useAppsMutation() {
  const queryClient = useQueryClient();
  return useMutation<IApp[], Error>(
    getApps,
    {
      onSuccess: (_, variables) => {
        queryClient.invalidateQueries(["apps"]);
      },
    }
  );
}