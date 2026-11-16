// external dependencies
import { useMutation, useQuery, useQueryClient } from "react-query";

// orangery elements & internal dependencies
import { FormError } from "../states/mobx-form";

// queries & backend
import { backend, setBackendToken } from "./backend";

export interface IInsertPaymentMethodParams {
  name: string,
  number: string,
  exp_month: string,
  exp_year: string,
  cvc?: string,

  iban: string,
  is_sepa_payment: boolean
}

export interface IInsertPaymentMethodResult {
}

async function insertPaymentMethod(
  params: IInsertPaymentMethodParams
): Promise<IInsertPaymentMethodResult> {
  try {
    const data = {
      name: params.name,
      iban: params.iban,
      number: params.number,
      exp_month: params.exp_month,
      exp_year: params.exp_year,
      cvc: params.cvc,
      is_sepa_payment: params.is_sepa_payment,
    };
    const response = await backend.post(
      `/company/payment-method`,
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

export function useInsertPaymentMethod() {
  const queryClient = useQueryClient();
  return useMutation<IInsertPaymentMethodResult, Error, IInsertPaymentMethodParams>(
    insertPaymentMethod,
    {
      onSuccess: (_, variables) => {
        queryClient.invalidateQueries(["paymentMethod",]);
      },
    }
  );
}

export interface IDeletePaymentMethodParams {
  // number: string,
  // exp_month: number,
  // exp_year: number,
  // cvc: string,
  // name: string,
  last4?: string,
}

async function deletePaymentMethod(
  params: IDeletePaymentMethodParams
): Promise<void> {
  try {
    const result = await backend.delete(
      `/company/payment`,
      {}
    );
    const deleteResult = result.data.data;
  } catch (err: any) {
    const processedError = processError(err);
    throw processedError;
  }
}

export function useDeletePaymentMethod() {
  const queryClient = useQueryClient();
  return useMutation<void, Error, IDeletePaymentMethodParams>(deletePaymentMethod, {
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries(["paymentMethod",]);
    },
  });
}

export interface IPaymentMethod {
  is_sepa_payment: boolean

  email: string;  ////////!!!!!!!! usage?

  name: string;
  brand: string;
  exp_month: number;
  exp_year: number;

  last4: string;

  country: string;
}

async function getPaymentMethod(): Promise<IPaymentMethod> {
  try {
    const resp = await backend.get(`/company/payment-method`, {});
    const data = resp.data;
    let result = data?.data;

    return result;
  } catch (err: any) {
    throw err;
  }
}

export function usePaymentMethod() {
  return useQuery<IPaymentMethod, Error>(
    ["paymentMethod",],
    () => getPaymentMethod(),
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
