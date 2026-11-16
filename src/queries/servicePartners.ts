// external dependencies
import { useMutation, useQuery, useQueryClient } from "react-query";

// orangery elements & internal dependencies
import { FormError } from "../states/mobx-form";

// queries & backend
import { backend } from "./backend";



export interface IDeleteServicePartnerParam {
  uuid: string;
}

async function deleteServicePartner(
  params: IDeleteServicePartnerParam
): Promise<void> {
  try {
    const result = await backend.delete(
      `/service-partner/${params.uuid}`,
      {}
    );
    const deleteResult = result.data.data;
  } catch (err: any) {
    const processedError = processError(err);
    throw processedError;
  }
}

export function useDeleteServicePartner() {
  const queryClient = useQueryClient();
  return useMutation<void, Error, IDeleteServicePartnerParam>(deleteServicePartner, {
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries(["servicePartners"]);
      queryClient.invalidateQueries([
        "servicePartner",
        variables.uuid,
      ]);
    },
  });
}

// export interface IDeleteMultiMeetingRoomParams {
//   office_uuid: string;
//   uuids: string[];
// }
// async function deleteMultiMeetingRoom(
//   params: IDeleteMultiMeetingRoomParams
// ): Promise<void> {
//   try {
//     const result = await backend.delete(
//       `/office/${params.office_uuid}/meeting-room`,
//       {
//         data: {
//           uuids: params.uuids,
//         },
//       }
//     );
//     const deleteResult = result.data.data;
//   } catch (err: any) {
//     const processedError = processError(err);
//     throw processedError;
//   }
// }

// export function useDeleteMultiMeetingRoom() {
//   const queryClient = useQueryClient();
//   return useMutation<void, Error, IDeleteMultiMeetingRoomParams>(
//     deleteMultiMeetingRoom,
//     {
//       onSuccess: (_, variables) => {
//         const office_uuid = variables.office_uuid;
//         queryClient.invalidateQueries(["meetingRooms", office_uuid]);
//         variables.uuids.forEach((uuid) => {
//           queryClient.invalidateQueries(["meetingRoom", office_uuid, uuid]);
//         });
//       },
//     }
//   );
// }

export interface IServicePartner {
  uuid: string;
  name: string;
  description: string;
  email: string;
  category: string;
  active: boolean;
}

async function upsertServicePartner(
  params: IServicePartner
): Promise<IServicePartner> {
  try {
    const data = {
      name: params.name,
      active: params.active,
      description: params.description,
      email: params.email,
      category: params.category,
    };
    if (params.uuid) {
      const response = await backend.put(
        `/service-partner/${params.uuid}`,
        data,
        {}
      );
      const result = response.data.data;
      return result;
    } else {
      const response = await backend.post(
        `/service-partner`,
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

export function useUpsertServicePartner() {
  const queryClient = useQueryClient();
  return useMutation<IServicePartner, Error, IServicePartner>(
    upsertServicePartner,
    {
      onSuccess: (data, variables) => {
        queryClient.invalidateQueries(["servicePartners"]);
        queryClient.invalidateQueries(["servicePartner", data.uuid]);
      },
    }
  );
}

async function getServicePartners(): Promise<IServicePartner[]> {
  
  try {
    const resp = await backend.get(`/service-partner`, {});
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

export function useServicePartners() {
  return useQuery<IServicePartner[], Error>(
    ["servicePartners"],
    () => getServicePartners(),
    {
      refetchOnWindowFocus: false,
    }
  );
}

export function processError(err: any) {
  if (err.response) {
    if (err.response.data.error_code === 500) {
      const error: FormError = {
        errors: [
          {
            field: "",
            error: err.response.data.msg || "Something went wrong on server!",
          },
        ],
      };
      return error;
    }
    if (err.response.data.error_code === 400) {
      const error: FormError = {
        errors: [
          {
            field: "",
            error: err.response.data.msg || "Something went wrong on client!",
          },
        ],
      };
      return error;
    }
    if (err.response.data.error_code === 403) {
      const error: FormError = {
        errors: [
          {
            field: "",
            error:
              err.response.data.msg || "the username is already registered!",
          },
        ],
      };
      return error;
    }
    // debugger;
    //TODO handle 400 / 500
    const error: FormError = {
      errors: [
        {
          field: "firstName",
          error: "bad name",
        },
      ],
    };
    return error;
  } else if (err.request) {
    // debugger;
    // TODO network error
    const error: FormError = {
      errors: [
        {
          field: "",
          error: "Network Error",
        },
      ],
    };
    return error;
  } else {
    // debugger;
    //TODO something else
    const error: FormError = {
      errors: [
        {
          field: "",
          error: "Something went wrong!",
        },
      ],
    };
    return error;
  }
}
