// external dependencies
import { useMutation, useQuery, useQueryClient } from "react-query";

// orangery elements & internal dependencies
import { FormError } from "../states/mobx-form";

// queries & backend
import { backend } from "./backend";



export interface IEmployee {
  uuid: string;
  office_uuid: string;
  name: string;
  first_name: string;
  last_name: string;
  image?: string;
  email: string;
  address?: string;
  group: {
    name: string;
    display_name: string;
    uuid: string;
  };
  phone: string;
  created_by: string;
  created_date: string;
  updated_by: string;
  timestamp: number;
  desk: {
    name: string;
    uuid: string;
  };
}


async function getCSVEmployees(office_uuid: string): Promise<IEmployee[]> {
  if (!office_uuid) {
    throw "office_uuid should not be empty in getEmployee()";
  }
  try {
    const resp = await backend.get(`/office/${office_uuid}/employee`, {});
    const data = resp.data;
    let result = data?.data.employees;
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

export function useCSVEmployees(office_uuid: string) {
  return useQuery<IEmployee[], Error>(
    ["employees", office_uuid],
    () => getCSVEmployees(office_uuid),
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
