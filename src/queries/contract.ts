// external dependencies
import { useMutation, useQuery, useQueryClient } from "react-query";

// orangery elements & internal dependencies
import { FormError } from "../states/mobx-form";

// queries & backend
import { backend } from "./backend";

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

export interface IRentedImage {
  uuid: string;

  has_thumbnail?: boolean;
}
export interface IRentedRoom {
  uuid: string;
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


export interface IContract {
  product: {
    uuid: string;
    name: string;
    description: string;
    quantity: number;
    price: number;
    sale_price: number;
    minimum_contract_duration: number;
    tax_rate: number;
    deposit: number;
    product_type: string;
    rooms: IRentedRoom[];
    payment_method: string;
    one_time_payment?: boolean;
    payable_via_invoice: boolean;
    force_invoice_payment?: boolean;
    number_of_requests: number;
    contract_start_date: Date;
    contract_end_date: Date;
    create_dashboard_for_tenant: boolean;
    hourly_select: boolean;
    auto_confirm_request: boolean;
    created_at: Date;
    published: boolean;
    offer_is_free: boolean;
    marketplace: boolean;
    status: boolean;
    assets: IRentedAsset[];
    desks: IRentedDesk[];
    images: IRentedImage[];
    documents: IRentedDocument[];
    office: IOffice;
  };
  user: {
    uuid: string;
    name: string;
    email: string;
    image: string;
    customer_number: number;
    office: {
      uuid: string;
      name: string;
      address: string;
    };
  };
  user_product: {
    business_payment: boolean; // false,
    canceled: boolean; // false,
    from_time: Date; // "Thu, 27 Apr 2023 12:00:00 GMT",
    ignore_billing: boolean; // false,
    invoice_payment: boolean; // true,
    start_date: Date; // "Thu, 27 Apr 2023 00:00:00 GMT",
    until_time: Date; // "Thu, 27 Apr 2023 13:00:00 GMT",
    uuid: string; // "83146c55-139c-4996-a93f-19e77770c407"
  }
}
// export interface IContract {
//   uuid: string;
//   name: string;
//   description: string;
//   quantity: number;
//   price: number;
//   sale_price: number;
//   deposit: number;
//   payment_method: string;
//   number_of_requests: number;
//   contract_start_date: Date;
//   contract_end_date: Date;
//   create_dashboard_for_tenant: boolean;
//   auto_confirm_request: boolean;
//   created_at: Date;
//   assets: IRentedAsset[];
//   desks: IRentedDesk[];
//   images: IRentedImage[];
//   documents: IRentedDocument[];
// }

export interface IContractResult { }

export interface IDeleteContractParams {
  uuid: string;
}

async function deleteContract(params: IDeleteContractParams): Promise<void> {
  try {
    const result = await backend.delete(`/contract/${params.uuid}`, {});
    const deleteResult = result.data.data;
  } catch (err: any) {
    const processedError = processError(err);
    throw processedError;
  }
}

export function useDeleteContract() {
  const queryClient = useQueryClient();
  return useMutation<void, Error, IDeleteContractParams>(deleteContract, {
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries(["contracts"]);
    },
  });
}

async function getContracts(): Promise<IContract[]> {
  try {
    const resp = await backend.get(`/contract`, {});
    const data = resp.data;
    let result = data?.data.contracts;
    result = result.sort((a: any, b: any) =>
      new Date(a.created_date).getTime() > new Date(b.created_date).getTime()
        ? 1
        : -1
    );

    return result;
  } catch (err: any) {
    throw err;
  }
}

export function useContracts() {
  return useQuery<IContract[], Error>(["contracts"], () => getContracts(), {
    refetchOnWindowFocus: false,
  });
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
