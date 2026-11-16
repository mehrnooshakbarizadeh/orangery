// external dependencies
import { useMutation, useQuery, useQueryClient } from "react-query";

// orangery elements & internal dependencies
import { FormError } from "../states/mobx-form";

// queries & backend
import { backend } from "./backend";

export interface IRegisterVisitorParams {
  uuid: string;
  visitor_name: string;
  visitor_email: string;
  host_uuid: string;
  arrival: string; 
  public_note: string;
  office_uuid: string;
}

export interface IVisitor {
  uuid: string;
  name: string;
  email: string;
}
export interface IRegisterVisitorResult {
  uuid: string;
  visitor_name: string;
  visitor_email: string;
  host_uuid: string;
  arrival: string; 
  public_note: string;
  office_uuid: string;
  visitor: IVisitor;
}

async function postRegisterVisitor(params: IRegisterVisitorParams): Promise<IRegisterVisitorResult> {
  try {
    const data = {
      visitor_name: params.visitor_name,
      visitor_email: params.visitor_email,
      host_uuid: params.host_uuid,
      arrival: params.arrival,
      public_note: params.public_note,
      office_uuid: params.office_uuid,
    };

    const result = await backend.post(
      `/visitor/register`,
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

export function usePostVisitor() {
  const queryClient = useQueryClient();
  return useMutation<IRegisterVisitorResult, Error, IRegisterVisitorParams>(postRegisterVisitor, {
    onSuccess: (data, variables) => {
      const office_uuid = variables.office_uuid;
      queryClient.invalidateQueries(["registerVisitors", office_uuid]);
      queryClient.invalidateQueries(["registerVisitor", office_uuid, data.uuid]);
     
    },
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
