// external dependencies
import { useMutation, useQuery, useQueryClient } from "react-query";

// orangery elements & internal dependencies
import { FormError } from "../states/mobx-form";

// queries & backend
import { backend } from "./backend";

export interface IUser {
  email: string, 
  image: string, 
  name: string 
}
export interface IReward {
  // office_uuid: string;
  // uuid: string;
  // name: string
 
created_at: string, 
invoice_number: string, 
type: string, 
points: number,
product: boolean, 
user: IUser, 
uuid: string, 
success: boolean, 
}

async function getRewards(office_uuid: string): Promise<IReward[]> {
  if (!office_uuid) {
    throw "office_uuid should not be empty in getVisitor()";
  }
  try {
    const resp = await backend.get(`/office/${office_uuid}/reward`, {});
    const data = resp.data;
    let result = data?.data.rewards;
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

export function useRewards(office_uuid: string) {
  return useQuery<IReward[], Error>(
    ["rewards", office_uuid],
    () => getRewards(office_uuid),
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
