// external dependencies
import { useQuery } from "react-query";

// orangery elements & internal dependencies
import { FormError } from "../states/mobx-form";

// queries & backend
import { backend } from "./backend";
import { IUser } from "./dashboard"
import { IOfferResult } from "./tenant";

export interface ITenantPayment {
  uuid: string;
  invoice_number: string;
  name: string;
  date: Date;
  sale_price: number;
  total?: number;

  pending: boolean | null;
  to_be_charged?: boolean | null;
  charge_success: boolean;
  refunded?: boolean | null;

  storno_invoice?: string | null;
  deposit_invoice?: string | null;
  user?: IUser;

  sent_invoice: boolean | null;
  sent_storno_invoice: boolean | null;
  sent_deposit_invoice: boolean | null;

  is_pay_via_invoice?: boolean | null;
  card_payment?: boolean | null;
  sepa_payment?: boolean | null;

  requested_dates: string[];
}

async function getTenantPayments(
  office_uuid: string
): Promise<ITenantPayment[]> {
  if (!office_uuid) {
    throw "office_uuid should not be empty in getTenantPayments()";
  }
  try {
    const resp = await backend.get(
      `/office/${office_uuid}/tenant/billings`,
      {}
    );
    const data = resp.data;
    let result = data?.data?.billings;

    return result;
  } catch (err: any) {
    throw err;
  }
}

export function useTenantPayments(office_uuid: string) {
  return useQuery<ITenantPayment[], Error>(
    ["tenantPayments", office_uuid],
    () => getTenantPayments(office_uuid),
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
