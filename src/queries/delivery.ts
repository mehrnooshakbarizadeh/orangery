// external dependencies
import { useMutation, useQuery, useQueryClient } from "react-query";

// orangery elements & internal dependencies
import { FormError } from "../states/mobx-form";

// queries & backend
import { backend } from "./backend";

export interface IDeliveryAreaParams {
  uuid?: string;
  name: string;
  office_uuid: string;

  updateDashboard?: boolean;
}
export interface IDeliveryResult {
  uuid: string;
}
async function upsertDeliveryArea(
  params: IDeliveryAreaParams
): Promise<IDeliveryResult> {
  try {
    const data = {
      name: params.name,
    };
    if (params.uuid) {
      const response = await backend.put(
        `/office/${params.office_uuid}/delivery_area/${params.uuid}`,
        data,
        {}
      );
      const result = response.data.data?.delivery_area;
      return result;
    } else {
      const response = await backend.post(
        `/office/${params.office_uuid}/delivery_area`,
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

export function useUpsertDeliveryArea() {
  const queryClient = useQueryClient();
  return useMutation<IDeliveryResult, Error, IDeliveryAreaParams>(
    upsertDeliveryArea,
    {
      onSuccess: (_, variables) => {
        const office_uuid = variables.office_uuid;
        queryClient.invalidateQueries(["deliveryAreas", office_uuid]);
        if (variables.updateDashboard) {
          queryClient.invalidateQueries(["dashboard", office_uuid]);
        }
      },
    }
  );
}

export interface IDeleteDeliveryAreaParams {
  office_uuid: string;
  uuid: string;
}
async function deleteDeliveryArea(
  params: IDeleteDeliveryAreaParams
): Promise<void> {
  try {
    const result = await backend.delete(
      `/office/${params.office_uuid}/delivery_area/${params.uuid}`,
      {}
    );
    const deleteResult = result.data.data;
  } catch (err: any) {
    const processedError = processError(err);
    throw processedError;
  }
}

export function useDeleteDeliveryArea() {
  const queryClient = useQueryClient();
  return useMutation<void, Error, IDeleteDeliveryAreaParams>(
    deleteDeliveryArea,
    {
      onSuccess: (_, variables) => {
        const office_uuid = variables.office_uuid;
        queryClient.invalidateQueries(["deliveryAreas", office_uuid]);
      },
    }
  );
}

export interface IDeliveryArea {
  uuid: string;
  office_uuid: string;
  name: string;
}

async function getDeliveryAreas(office_uuid: string): Promise<IDeliveryArea[]> {
  if (!office_uuid) {
    throw "office_uuid should not be empty in getDeliveryAreas()";
  }
  try {
    const resp = await backend.get(`/office/${office_uuid}/delivery_area`, {});
    const data = resp.data;
    let result = data?.data?.delivery_areas;
    result = result
      .map((e: any) => ({
        ...e,
        office_uuid,
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

export function useDeliveryAreas(office_uuid: string) {
  return useQuery<IDeliveryArea[], Error>(
    ["deliveryAreas", office_uuid],
    () => getDeliveryAreas(office_uuid),
    {
      refetchOnWindowFocus: false,
    }
  );
}

export interface IDeliveryLog {
  name: string;
  description: string;
  pickup_at: Date;
  image: string;
  area: string;
  signature: string;
  employee?: {
    uuid: string;
    name: string;
  };
  created_at: Date;
  has_thumbnail?: boolean;
}

async function getDeliveryLogs(office_uuid: string): Promise<IDeliveryLog[]> {
  if (!office_uuid) {
    throw "office_uuid should not be empty in getDeliveryLogs()";
  }
  try {
    const resp = await backend.get(`/office/${office_uuid}/package`, {});
    const data = resp.data;
    let result = data?.data.packages;
    // result = [
    //   ...result,
    //   {
    //     "name": "temp. frontEnd Data: first important Package",
    //     "description": "description",
    //     "pickup_at": "16.04.2022 18:30",
    //     "image": "",
    //     "area": "",
    //     "signature": "",
    //     "coworker": "H2"
    //   },
    //   {
    //     "name": "temp. frontEnd Data: second ordinary Package",
    //     "description": "description",
    //     "pickup_at": "16.04.2022 18:30",
    //     "image": "",
    //     "area": "",
    //     "signature": "",
    //     "coworker": "H2"
    //   }
    // ]
    result = result
      .map((e: any) => ({
        ...e,
        office_uuid,
      }))
      .sort((a: any, b: any) =>
        new Date(a.created_at).getTime() < new Date(b.created_at).getTime()
          ? 1
          : -1
      );

    return result;
  } catch (err: any) {
    throw err;
  }
}

export function useDeliveryLogs(office_uuid: string) {
  return useQuery<IDeliveryLog[], Error>(
    ["deliveryLogs", office_uuid],
    () => getDeliveryLogs(office_uuid),
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
