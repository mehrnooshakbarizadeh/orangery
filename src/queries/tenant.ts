// external dependencies
import { useMutation, useQuery, useQueryClient } from "react-query";

// orangery elements & internal dependencies
import { FormError } from "../states/mobx-form";

// queries & backend
import { backend } from "./backend";

export interface IOfferParams {
  uuid?: string;
  name: string;
  description: string;
  instructions?: string;
  product_type: string;
  payable_via_invoice: boolean;
  force_invoice_payment?: boolean;
  offer_is_free: boolean;
  desks: string[];
  room_uuids: string[];
  assets: string[];
  documents: string[];
  images: string[];
  price: number;
  sale_price: number;
  quantity: number;
  deposit: number;
  minimum_contract_duration?: number | null;
  tax_rate: number;
  published: boolean;
  marketplace: boolean;
  status: boolean;
  payment_method: string;
  auto_confirm_request: boolean;
  date_picker?: boolean;
  hourly_select: boolean;
  create_dashboard_for_tenant: boolean;
  contract_start_date: string; // Date;
  contract_end_date?: Date | null;
  office_uuid: string;

  is_wholesale?: boolean;

  updateAll?: boolean;

  block_days?: string[];
}
export interface IResultAsset {
  uuid: string;
}
export interface IResultDesk {
  uuid: string;
}
export interface IResultRoom {
  uuid: string;
}
export interface IResultDocument {
  uuid: string;
  name?: string;
}
export interface IResultImage {
  uuid: string;
}
export interface IOfferResult {
  assets: IResultAsset[];
  auto_confirm_request: boolean;
  hourly_select: boolean;
  contract_end_date?: Date;
  contract_start_date: Date;
  product_type: string;
  create_dashboard_for_tenant: boolean;
  created_at: Date;
  deposit: number;
  description: string;
  instructions?: string;
  payable_via_invoice: boolean;
  force_invoice_payment?: boolean;
  desks: IResultDesk[];
  rooms: IResultRoom[];
  documents: IResultDocument[];
  images: IResultImage[];
  name: string;
  number_of_requests: number;
  payment_method: string;
  price: number;
  published: boolean;
  offer_is_free: boolean;
  marketplace: boolean;
  status: boolean;
  minimum_contract_duration?: number | null;
  tax_rate: number;
  quantity: number;
  sale_price: number;
  uuid: string;
  is_wholesale?: boolean;

  block_days?: string[];
}

async function upsertOffer(params: IOfferParams): Promise<IOfferResult> {
  try {
    const data = {
      name: params.name,
      description: params.description,
      instructions: params.instructions,
      desks: params.desks,
      room_uuids: params.room_uuids,
      assets: params.assets,
      payable_via_invoice: params.payable_via_invoice,
      force_invoice_payment: params.force_invoice_payment,
      documents: params.documents,
      images: params.images,
      date_picker: params.date_picker,
      hourly_select: params.hourly_select,
      published: params.published,
      marketplace: params.marketplace,
      status: params.status,
      price: params.price,
      product_type: params.product_type,
      sale_price: params.sale_price,
      offer_is_free: params.offer_is_free,
      quantity: params.quantity,
      deposit: params.deposit,
      minimum_contract_duration: params.minimum_contract_duration,
      tax_rate: params.tax_rate,
      payment_method: params.payment_method,
      auto_confirm_request: params.auto_confirm_request,
      create_dashboard_for_tenant: params.create_dashboard_for_tenant,
      contract_start_date: params.contract_start_date,
      contract_end_date: params.contract_end_date,

      is_wholesale: params.is_wholesale,

      block_days: params.block_days,
    };

    if (params.uuid) {
      const result = await backend.put(
        `/office/${params.office_uuid}/product/${params.uuid}`,
        data,
        {}
      );
      const finalResult = result.data.data;
      return finalResult;
    } else {
      const result = await backend.post(
        `/office/${params.office_uuid}/product`,
        data,
        {}
      );
      const finalResult = result.data.data;
      return finalResult;
    }
  } catch (err: any) {
    const processedError = processError(err);
    throw processedError;
  }
}

export function useUpsertOffer() {
  const queryClient = useQueryClient();
  return useMutation<IOfferResult, Error, IOfferParams>(upsertOffer, {
    onSuccess: (data, variables) => {
      const office_uuid = variables.office_uuid;
      queryClient.invalidateQueries(["offers", office_uuid]);
      queryClient.invalidateQueries(["offer", office_uuid, data.uuid]);

      const updateAll = variables.updateAll;
      if (updateAll) {
        queryClient.invalidateQueries(["statistic", office_uuid]);
        queryClient.invalidateQueries(["tenant_requests", office_uuid, undefined]);
      }
    }
  });
}

export interface IDeleteOfferParams {
  office_uuid: string;
  uuid: string;
}
async function deleteOffer(params: IDeleteOfferParams): Promise<void> {
  try {
    const result = await backend.delete(
      `/office/${params.office_uuid}/product/${params.uuid}`,
      {}
    );
    const deleteResult = result.data.data;
  } catch (err: any) {
    const processedError = processError(err);
    throw processedError;
  }
}

export function useDeleteOffer() {
  const queryClient = useQueryClient();
  return useMutation<void, Error, IDeleteOfferParams>(deleteOffer, {
    onSuccess: (_, variables) => {
      const office_uuid = variables.office_uuid;
      queryClient.invalidateQueries(["offers", office_uuid]);
      queryClient.invalidateQueries(["offer", office_uuid, variables.uuid]);
    },
  });
}

export interface IOfferDesk {
  uuid: string;
}
export interface IOfferRoom {
  uuid: string;
}
export interface IOfferAsset {
  uuid: string;
}
export interface IOfferDocument {
  uuid: string;
}
export interface IOfferImages {
  uuid: string;
}
export interface IOffer {
  uuid: string;
  name: string;
  number_of_requests: number;
  description: string;
  product_type: string;
  instructions?: string;
  desks: IOfferDesk[];
  rooms: IOfferRoom[];
  assets: IOfferAsset[];
  documents: IOfferDocument[];
  images: IOfferImages[];
  price: number;
  sale_price: number;
  quantity: number;
  deposit: number;
  published: boolean;
  offer_is_free: boolean;
  payable_via_invoice: boolean;
  force_invoice_payment?: boolean;
  marketplace: boolean;
  status: boolean;
  minimum_contract_duration?: number | null;
  tax_rate: number;
  payment_method: string;
  auto_confirm_request: boolean;
  create_dashboard_for_tenant: boolean;
  date_picker?: boolean;
  hourly_select: boolean;
  contract_start_date: Date;
  contract_end_date: Date;
  office_uuid: string;
  created_at: Date;
  is_wholesale?: boolean;

  block_days?: string[];
}

async function getOffer(params: IOfferGetParams): Promise<IOffer> {
  if (!params.office_uuid) {
    throw "office_uuid should not be empty in getOffer()";
  }
  try {
    const resp = await backend.get(
      `/office/${params.office_uuid}/product/${params.uuid}`,
      {}
    );
    const data = resp.data;
    let result = data?.data;
    return result;
  } catch (err: any) {
    throw err;
  }
}

// export function useOffer(office_uuid?: string, uuid?: string) {
//   return useQuery<IOffer, Error>(
//     ["offer", office_uuid, uuid],
//     () => getOffer(office_uuid, uuid),
//     {
//       refetchOnWindowFocus: false,
//     }
//   );
// }

export interface IOfferGetParams {
  office_uuid?: string;
  uuid?: string;
}

export function useOffer() {
  const queryClient = useQueryClient();
  return useMutation<IOffer, Error, IOfferGetParams>(
    getOffer,
    {
      onSuccess: (_, variables) => {
        const office_uuid = variables.office_uuid;
        const uuid = variables.uuid;
        queryClient.invalidateQueries(["offer", office_uuid, uuid]);
      },
      retry: 3
    }
  );
}

async function getOffers(office_uuid: string): Promise<IOffer[]> {
  if (!office_uuid) {
    throw "office_uuid should not be empty in getOffers()";
  }
  try {
    const resp = await backend.get(`/office/${office_uuid}/product`, {});
    const data = resp.data;
    let result = data?.data.products;
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

export function useOffers(office_uuid: string) {
  return useQuery<IOffer[], Error>(
    ["offers", office_uuid],
    () => getOffers(office_uuid),
    {
      refetchOnWindowFocus: false,
    }
  );
}

async function getAllOffers(office_uuid: string): Promise<IOffer[]> {
  if (!office_uuid) {
    throw "office_uuid should not be empty in getAllOffers()";
  }
  try {
    const resp = await backend.get(`/office/${office_uuid}/product/all`, {});
    const data = resp.data;
    let result = data?.data.products;
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

export function useAllOffers(office_uuid: string) {
  return useQuery<IOffer[], Error>(
    ["allOffers", office_uuid],
    () => getAllOffers(office_uuid),
    {
      refetchOnWindowFocus: false,
    }
  );
}

export interface IRentedAsset {
  uuid: string;
}
export interface IRentedDocument {
  uuid: string;
  name?: string;
}
export interface IRentedDesk {
  uuid: string;
}
export interface IRentedRoom {
  has_thumbnail?: boolean;

  uuid: string;
}
export interface IRentedImage {
  uuid: string;

  has_thumbnail?: boolean;
}

export interface IOffice {
  address: string;
  day_pass_price: string;
  email: string;
  images: string[]
  name : string;
  opening_times: {closed: boolean, created: string, day: number, from_time: string}
  phone: string;
  timezone: string;
  uuid:string
}
export interface IRentedProduct {
  product: {
    uuid: string;
    name: string;
    description: string;
    instructions?: string;
    offer_is_free: boolean;
    quantity: number;
    rented_quantity?: number;
    product_type: string;
    price: number;
    sale_price: number;
    deposit: number;
    minimum_contract_duration?: number | null;
    tax_rate: number;
    payment_method: string;
    number_of_requests: number;
    published: boolean;
    marketplace: boolean;
    status: boolean;
    payable_via_invoice: boolean;
    force_invoice_payment?: boolean;
    contract_start_date: Date;
    contract_end_date: Date;
    create_dashboard_for_tenant: boolean;
    auto_confirm_request: boolean;
    hourly_select: boolean;
    created_at: Date;
    assets: IRentedAsset[];
    desks: IRentedDesk[];
    rooms: IRentedRoom[];
    images: IRentedImage[];
    documents: IRentedDocument[];
    office: IOffice;

    is_wholesale?: boolean;
  };
  user: {
    uuid: string;
    name: string;
    email: string;
    image: string;
    company_name?: string;
    customer_number: number;
    office: {
      uuid: string;
      name: string;
      address: string;
    };
  };
  user_product: IUserProduct;
}

export interface IUserProduct {
  business_payment: boolean; // false,
  canceled: boolean; // false,
  from_time: Date; // "Thu, 27 Apr 2023 12:00:00 GMT",
  ignore_billing: boolean; // false,
  invoice_payment: boolean; // true,
  start_date: Date; // "Thu, 27 Apr 2023 00:00:00 GMT",
  until_time: Date; // "Thu, 27 Apr 2023 13:00:00 GMT",
  uuid: string; // "83146c55-139c-4996-a93f-19e77770c407"

}

async function getRentedProducts(
  office_uuid: string
): Promise<IRentedProduct[]> {
  if (!office_uuid) {
    throw "office_uuid should not be empty in getgetRentedProducts()";
  }
  try {
    const resp = await backend.get(`/office/${office_uuid}/product/rented`, {});
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

export function useRentedProducts(office_uuid: string) {
  return useQuery<IRentedProduct[], Error>(
    ["rentedProduct", office_uuid],
    () => getRentedProducts(office_uuid),
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
    if (err.response.data.error_code === "dfbe6") {
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

export interface IUserProductParams {
  user_product_uuid: string;

  business_payment?: boolean;
  canceled?: boolean;
  ignore_billing?: boolean;
  invoice_payment?: boolean;
}

export interface IUserProductResult { }

async function updateUserProduct(params: IUserProductParams): Promise<IUserProductResult> {
  try {
    const data = {
      business_payment: params.business_payment,
      canceled: params.canceled,
      ignore_billing: params.ignore_billing,
      invoice_payment: params.invoice_payment,
    };

    const result = await backend.put(
      `/user-product/${params.user_product_uuid}`,
      data,
      {}
    );
    const finalResult = result.data.data;
    return finalResult;
  } catch (err: any) {
    const processedError = processError(err);
    throw processedError;
  }
}

export function useUpdateUserProduct() {
  const queryClient = useQueryClient();
  return useMutation<IUserProductResult, Error, IUserProductParams>(updateUserProduct, {
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries(["rentedProduct"]); // , office_uuid
    }
  });
}