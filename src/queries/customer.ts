// external dependencies
import { useMutation, useQuery, useQueryClient } from "react-query";

// orangery elements & internal dependencies
import { FormError } from "../states/mobx-form";

// queries & backend
import { backend } from "./backend";
import { processError } from "./commons";

export interface ICustomerUpsertParams {
  first_name: string;
  last_name: string;
  email: string;
  invoice_email?: string;
  customer_number: string;
  company_name: string;
  tax_id: string;
  create_dashboard: boolean;
  address: string;
  invoice_extra_info?: string;

  uuid?: string;
  office_uuid?: string;

  product_uuids?: string[];
  remove_product_uuids?: string[];
}

export interface ICustomerResult {
  uuid: string;
  email: string;
  invoice_email: string;
  image: string | null;
  customer_number: string;
  name: string;
  created_date: Date;
  office: ICustomerOffice;
  products: ICustomerProduct[];
  first_name: string;
  last_name: string;
  create_dashboard: boolean;
  company_name: string;
  tax_id: string;
  address: string;
  invoice_extra_info: string;
  office_uuid: string;
}

async function upsertCustomer(
  params: ICustomerUpsertParams
): Promise<ICustomerResult> {
  try {
    const data = {
      first_name: params.first_name,
      last_name: params.last_name,
      email: params.email,
      invoice_email: params.invoice_email,
      customer_number: params.customer_number,
      create_dashboard: params.create_dashboard,
      company_name: params.company_name,
      tax_id: params.tax_id,
      address: params.address,
      invoice_extra_info: params.invoice_extra_info,
      product_uuids: params.product_uuids,
      remove_product_uuids: params.remove_product_uuids,
    };
    if (params.uuid) {
      const response = await backend.put(
        `/office/${params.office_uuid}/customer/${params.uuid}`,
        data,
        {}
      );
      const result = response.data?.data;
      return result;
    } else {
      const response = await backend.post(
        `/office/${params.office_uuid}/customer`,
        data,
        {}
      );
      const result = response.data?.data;
      return result;
    }
  } catch (err: any) {
    const processedError = processError(err);
    throw processedError;
  }
}

export function useUpsertCustomer() {
  const queryClient = useQueryClient();
  return useMutation<ICustomerResult, Error, ICustomerUpsertParams>(
    upsertCustomer,
    {
      onSuccess: (data, variables) => {
        const office_uuid = variables.office_uuid;
        queryClient.invalidateQueries(["customers", office_uuid]);
        queryClient.invalidateQueries(["customer", office_uuid, data.uuid]);
      },
    }
  );
}

export interface ICustomerDelete {
  office_uuid?: string;
  uuid?: string;
}
async function deleteCustomer(params: ICustomerDelete): Promise<void> {
  try {
    const result = await backend.delete(
      `/office/${params.office_uuid}/customer/${params.uuid}`,
      {}
    );
    const deleteResult = result.data.data;
  } catch (err: any) {
    const processedError = processError(err);
    throw processedError;
  }
}

export function useDeleteCustomer() {
  const queryClient = useQueryClient();
  return useMutation<void, Error, ICustomerDelete>(deleteCustomer, {
    onSuccess: (_, variables) => {
      const office_uuid = variables.office_uuid;
      queryClient.invalidateQueries(["customers", office_uuid]);
      queryClient.invalidateQueries(["customer", office_uuid, variables.uuid]);
    },
  });
}

export interface ICustomerOffice {
  uuid: string;
  name: string;
  address: string;
  phone: string;
  email: string;
  lat: number;
  lon: number;
  timezone: string;
  images: [];
  opening_times: IOpeningTimes;
}

export interface ICustomerProduct {
  uuid: string;
  name: string;
  description: string;
  quantity: number;
}

export interface IOpeningTimes {
  uuid: string;
  timestamp: number;
  created: Date;
  day: number;
  closed: boolean;
  from_time: string;
  until_time: string;
}
export interface ICustomer {
  // common except delete
  email: string;
  invoice_email: string;
  image: string | null;
  customer_number: string;
  created_date: Date;
  // only in get & put response
  uuid: string;
  name: string;
  office: ICustomerOffice;
  products: ICustomerProduct[];
  organization?: string | null;

  // only in post
  create_dashboard?: boolean | null;

  // only in post & put
  first_name: string;
  last_name: string;
  company_name: string;
  tax_id: string;
  address: string;
  invoice_extra_info: string;

  // only in put
  office_uuid: string;
}

async function getCustomers(office_uuid: string): Promise<ICustomer[]> {
  if (!office_uuid) {
    throw "office_uuid should not be empty in getCustomers()";
  }
  try {
    const resp = await backend.get(`/office/${office_uuid}/customer`, {});
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

export function useCustomers(office_uuid: string) {
  return useQuery<ICustomer[], Error>(
    ["customers", office_uuid],
    () => getCustomers(office_uuid),
    {
      refetchOnWindowFocus: false,
    }
  );
}

async function getCustomer(
  office_uuid: string,
  customer_uuid: string
): Promise<ICustomer> {
  if (!office_uuid) {
    throw "office_uuid and/or employee_uuid should not be empty in getCustomer()";
  }
  try {
    const resp = await backend.get(
      `/office/${office_uuid}/customer/${customer_uuid}`,
      {}
    );
    const data = resp.data;
    let result = data?.data;

    return result;
  } catch (err: any) {
    throw err;
  }
}

export function useCustomer(office_uuid: string, customer_uuid: any) {
  return useQuery<ICustomer, Error>(
    ["customer", office_uuid],
    () => getCustomer(office_uuid, customer_uuid),
    {
      refetchOnWindowFocus: false,
    }
  );
}

export interface ICustomerOrganizationInsertParams {
  office_uuid: string;

  company_name: string;

  email: string;
  uuid: string;

  tax_id?: string;
}

export interface ICustomerOrganizationResult { }

async function insertCustomerOrganization(
  params: ICustomerOrganizationInsertParams
): Promise<ICustomerOrganizationResult> {
  try {
    const data = {
      company_name: params.company_name,
      email: params.email,
    };

    const response = await backend.post(
      `/office/${params.office_uuid}/customer/dashboard`,
      data,
      {}
    );
    const result = response.data?.data;
    return result;
  } catch (err: any) {
    const processedError = processError(err);
    throw processedError;
  }
}

export function useInsertCustomerOrganization() {
  const queryClient = useQueryClient();
  return useMutation<
    ICustomerOrganizationResult,
    Error,
    ICustomerOrganizationInsertParams
  >(insertCustomerOrganization, {
    onSuccess: (data, variables) => {
      const office_uuid = variables.office_uuid;
      queryClient.invalidateQueries(["customers", office_uuid]);
      queryClient.invalidateQueries(["customer", office_uuid, variables.uuid]);
    },
  });
}
