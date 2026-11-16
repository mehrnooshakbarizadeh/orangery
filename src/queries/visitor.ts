// external dependencies
import { useMutation, useQuery, useQueryClient } from "react-query";

// orangery elements & internal dependencies
import { FormError } from "../states/mobx-form";

// queries & backend
import { backend } from "./backend";

export interface IVisitorParams {
  uuid?: string;
  visitor_name: string;
  visitor_email: string;
  host_uuid: string;
  arrival: string; ////////!!!!!!!! should be revised
  private_note: string;
  public_note: string;
  send_email: boolean;
  office_uuid: string;

  updateDashboard?: boolean;
}
export interface IHost {
  uuid: string;
  name: string;
  status: string;
  image?: string | null;
}
export interface IVisitorResult {
  office_uuid: string;
  uuid: string;
  visitor: IVisitor;
  host: IHost;
  public_note: string;
  private_note: string;
  send_email: boolean;
  arrival: Date;
  arrived: boolean;
  created_by: string;
  created_date: string;
  updated_by: string;
  timestamp: number;
}
async function upsertVisitor(params: IVisitorParams): Promise<IVisitorResult> {
  try {
    const data = {
      visitor_name: params.visitor_name,
      visitor_email: params.visitor_email,
      host_uuid: params.host_uuid,
      arrival: params.arrival,
      private_note: params.private_note,
      public_note: params.public_note,
      send_email: params.send_email,
    };

    if (params.uuid) {
      const result = await backend.put(
        `/office/${params.office_uuid}/visitor/${params.uuid}`,
        data,
        {}
      );
      const finalResult = result.data.data;
      return finalResult;
    } else {
      const result = await backend.post(
        `/office/${params.office_uuid}/visitor`,
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

export function useUpsertVisitor() {
  const queryClient = useQueryClient();
  return useMutation<IVisitorResult, Error, IVisitorParams>(upsertVisitor, {
    onSuccess: (data, variables) => {
      const office_uuid = variables.office_uuid;
      queryClient.invalidateQueries(["visitors", office_uuid]);
      queryClient.invalidateQueries(["visitor", office_uuid, data.uuid]);
      if (variables.updateDashboard) {
        queryClient.invalidateQueries(["dashboard", office_uuid]);
      }
    },
  });
}

export interface IDeleteVisitorParams {
  office_uuid: string;
  uuid: string;
}
async function deleteVisitor(params: IDeleteVisitorParams): Promise<void> {
  try {
    const result = await backend.delete(
      `/office/${params.office_uuid}/visitor/${params.uuid}`,
      {}
    );
    const deleteResult = result.data.data;
  } catch (err: any) {
    const processedError = processError(err);
    throw processedError;
  }
}

export function useDeleteVisitor() {
  const queryClient = useQueryClient();
  return useMutation<void, Error, IDeleteVisitorParams>(deleteVisitor, {
    onSuccess: (_, variables) => {
      const office_uuid = variables.office_uuid;
      queryClient.invalidateQueries(["visitors", office_uuid]);
      queryClient.invalidateQueries(["visitor", office_uuid, variables.uuid]);
    },
  });
}
export interface IVisitor {
  uuid: string;
  name: string;
  status: string;
  email: string;
  image?: string | null;
}

export interface IVisitorType {
  office_uuid: string;
  uuid: string;
  visitor: IVisitor;
  host: IHost;
  public_note: string;
  private_note: string;
  send_email: boolean;
  arrival: Date;
  arrived: boolean;
  created_by: string;
  created_date: string;
  updated_by: string;
  timestamp: number;
}

async function getVisitors(office_uuid: string): Promise<IVisitorType[]> {
  if (!office_uuid) {
    throw "office_uuid should not be empty in getVisitor()";
  }
  try {
    const resp = await backend.get(`/office/${office_uuid}/visitor`, {});
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

export function useVisitors(office_uuid: string) {
  return useQuery<IVisitorType[], Error>(
    ["visitors", office_uuid],
    () => getVisitors(office_uuid),
    {
      refetchOnWindowFocus: false,
    }
  );
}

async function getVisitor(
  office_uuid: string,
  visitor_uuid: any
): Promise<IVisitorType> {
  if (!office_uuid) {
    throw "office_uuid and/or visitor_uuid should not be empty in getVisitor()";
  }
  try {
    const resp = await backend.get(
      `/office/${office_uuid}/visitor/${visitor_uuid}`,
      {}
    );
    const data = resp.data;
    let result = data?.data;

    return result;
  } catch (err: any) {
    throw err;
  }
}

export function useVisitor(office_uuid: string, visitor_uuid: any) {
  return useQuery<IVisitorType, Error>(
    ["visitor", office_uuid],
    () => getVisitor(office_uuid, visitor_uuid),
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
