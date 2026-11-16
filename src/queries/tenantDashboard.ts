// external dependencies
import { useQuery } from "react-query";

// orangery elements & internal dependencies
import { FormError } from "../states/mobx-form";

// queries & backend
import { backend } from "./backend";

export interface IStatistics {
  number_of_products: number;
  rented_products: number;
  number_of_tenant_requests: number;
}

async function getStatistic(
  office_uuid?: string,
  uuid?: string
): Promise<IStatistics> {
  if (!office_uuid) {
    throw "office_uuid should not be empty in getStatistic()";
  }
  try {
    const resp = await backend.get(
      `/office/${office_uuid}/tenant/statistics`,
      {}
    );
    const data = resp.data;
    let result = data?.data;
    return result;
  } catch (err: any) {
    throw err;
  }
}

export function useStatistic(office_uuid?: string) {
  return useQuery<IStatistics, Error>(
    ["statistic", office_uuid],
    () => getStatistic(office_uuid),
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
