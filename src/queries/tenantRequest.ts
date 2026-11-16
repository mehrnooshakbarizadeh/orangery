// external dependencies
import { useMutation, useQuery, useQueryClient } from "react-query";

// orangery elements & internal dependencies
import { FormError } from "../states/mobx-form";

// queries & backend
import { backend } from "./backend";

export interface ITenantRequestParams {
  uuid: string;
  first_name?: string;
  last_name?: string;
  email?: string;
  accept?: boolean;
  reject?: boolean;
  transaction_number?: string;
  product_name?: string;
  product_description?: string;
  product_price?: number;
  product_image?: string;
  company_name?: string;
  address?: string;
  office_uuid: string;
}
export interface ITenantRequestResult { }
async function upsertTenantRequest(
  params: ITenantRequestParams
): Promise<ITenantRequestResult> {
  try {
    const data = {
      first_name: params.first_name,
      last_name: params.last_name,
      email: params.email,
      accept: params.accept,
      reject: params.reject,
      transaction_number: params.transaction_number,
      product_name: params.product_name,
      product_description: params.product_description,
      product_price: params.product_price,
      product_image: params.product_image,
      company_name: params.company_name,
      address: params.address,
    };

    if (params.uuid) {
      const result = await backend.put(
        `/office/${params.office_uuid}/tenant_request/${params.uuid}`,
        data,
        {}
      );
      const finalResult = result.data.data;
      return { finalResult };
    } else {
      const result = await backend.post(
        `/office/${params.office_uuid}/tenant_request/`,
        data,
        {}
      );
      const finalResult = result.data.data;
      return { finalResult };
    }
  } catch (err: any) {
    const processedError = processError(err);
    throw processedError;
  }
}

export function useUpsertTenantRequest() {
  const queryClient = useQueryClient();
  return useMutation<ITenantRequestResult, Error, ITenantRequestParams>(
    upsertTenantRequest,
    {
      onSuccess: (_, variables) => {
        const office_uuid = variables.office_uuid;
        queryClient.invalidateQueries(["tenant_request", office_uuid]);
      },
    }
  );
}

export interface IDeleteTenantRequestParams {
  office_uuid: string;
  uuid: string;
}
async function deleteTenantRequest(
  params: IDeleteTenantRequestParams
): Promise<void> {
  try {
    const result = await backend.delete(
      `/office/${params.office_uuid}/tenant_request/${params.uuid}`,
      {}
    );
    const deleteResult = result.data.data;
  } catch (err: any) {
    const processedError = processError(err);
    throw processedError;
  }
}

export function useDeleteTenantRequest() {
  const queryClient = useQueryClient();
  return useMutation<void, Error, IDeleteTenantRequestParams>(
    deleteTenantRequest,
    {
      onSuccess: (_, variables) => {
        const office_uuid = variables.office_uuid;
        queryClient.invalidateQueries(["tenant_request", office_uuid]);
      },
    }
  );
}

export interface ITenantRequest {
  uuid: string;
  first_name: string;
  last_name: string;
  email: string;
  accept: boolean;
  reject: boolean;
  transaction_number: number;
  product_name: string;
  product_description: string;
  product_price: number;
  product_image: string;
  company_name: string;
  address: string;

  has_thumbnail?: boolean;
}

async function getTenantRequest(
  office_uuid?: any,
  tenant_request?: any
): Promise<ITenantRequest[]> {
  if (!office_uuid || !tenant_request) {
    throw "office_uuid and/or tenant_request should not be empty in getTenantRequest()";
  }
  try {
    const resp = await backend.get(
      `/office/${office_uuid}/tenant_request/${tenant_request}`,
      {}
    );
    const data = resp.data;
    let result = data?.data.tenant_request;
    return result;
  } catch (err: any) {
    throw err;
  }
}

export function useTenantRequest(
  office_uuid?: string,
  tenant_request?: string
) {
  return useQuery<ITenantRequest[], Error>(
    ["tenant_requests", office_uuid, tenant_request],
    () => getTenantRequest(office_uuid, tenant_request),
    {
      refetchOnWindowFocus: false,
    }
  );
}

async function getTenantRequests(
  office_uuid: string,
  tenant_request?: string
): Promise<ITenantRequest[]> {
  if (!office_uuid) {
    throw "office_uuid should not be empty in getTenantRequests()";
  }
  try {
    const resp = await backend.get(
      `/office/${office_uuid}/tenant_request?product_uuid=${tenant_request}`,
      {}
    );
    const data = resp.data;
    let result = data?.data.tenant_requests;
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

export function useTenantRequestList(
  office_uuid: string,
  tenant_request?: string
) {
  return useQuery<ITenantRequest[], Error>(
    ["tenant_requests", office_uuid, tenant_request],
    () => getTenantRequests(office_uuid, tenant_request),
    {
      refetchOnWindowFocus: false,
    }
  );
}

async function getProductRequests(
  office_uuid: string,
  tenant_request?: any
): Promise<ITenantRequest[]> {
  if (!office_uuid) {
    throw "office_uuid should not be empty in getTenantRequests()";
  }
  try {
    const resp = await backend.get(`/office/${office_uuid}/tenant_request`, {});
    const data = resp.data;
    let result = data?.data.tenant_requests;
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

export function useProductRequestList(
  office_uuid: string,
  tenant_request?: string
) {
  return useQuery<ITenantRequest[], Error>(
    ["tenant_requests", office_uuid, tenant_request],
    () => getProductRequests(office_uuid, tenant_request),
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
