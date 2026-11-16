// external dependencies
import { useMutation, useQuery, useQueryClient } from "react-query";

// orangery elements & internal dependencies
import { FormError } from "../states/mobx-form";

// queries & backend
import { backend } from "./backend";

export interface IEmployeeParams {
  uuid?: string;

  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  address: string;
  group_uuid?: string;
  office_uuid: string;

  updateDashboard?: boolean;
}
export interface IEmployeeResult {
  uuid: string;
  office_uuid: string;
  name: string;
  phone: string;
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
  created_by: string;
  created_date: string;
  updated_by: string;
  timestamp: number;
  desk: {
    name: string;
    uuid: string;
  };
}
async function upsertEmployee(
  params: IEmployeeParams
): Promise<IEmployeeResult> {
  try {
    const data = {
      first_name: params.first_name,
      last_name: params.last_name,
      email: params.email,
      phone: params.phone,
      address: params.address,
      group_uuid: params.group_uuid,
    };
    if (params.uuid) {
      const response = await backend.put(
        `/office/${params.office_uuid}/employee/${params.uuid}`,
        data,
        {}
      );
      const result = response.data.data;
      return result;
    } else {
      const response = await backend.post(
        `/office/${params.office_uuid}/employee`,
        data,
        {}
      );
      const result = response.data.data;
      return result;
    }
  } catch (err: any) {
    const processedError = processError(err);
    throw processedError;
  }
}

export function useUpsertEmployee() {
  const queryClient = useQueryClient();
  return useMutation<IEmployeeResult, Error, IEmployeeParams>(upsertEmployee, {
    onSuccess: (data, variables) => {
      const office_uuid = variables.office_uuid;
      queryClient.invalidateQueries(["users", office_uuid]);
      queryClient.invalidateQueries(["user", office_uuid, data.uuid]);
      if (variables.updateDashboard) {
        queryClient.invalidateQueries(["dashboard", office_uuid]);
      }
    },
  });
}

export interface ICSVParams {
  office_uuid: string;
}
export interface ICSVPostResult {
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

export interface ICSVPostParams {
  data: ICSVParams;
  csv_uuid: File | string;
}

async function postCSV(params: ICSVPostParams): Promise<ICSVPostResult[]> {
  try {
    const formData = new FormData();
    if (params.csv_uuid instanceof File) {
      formData.append("file", params.csv_uuid);
    }

    const result = await backend.post(
      `/office/${params.data.office_uuid}/employee/import`,
      formData,
      {
        headers: (formData as any).getHeaders?.(),
      }
    );
    const finalResult = result.data.data.employees;
    return finalResult;
  } catch (err: any) {
    const processedError = processError(err);
    throw processedError;
  }
}

export function usePostCSV() {
  const queryClient = useQueryClient();
  return useMutation<ICSVPostResult[], Error, ICSVPostParams>(postCSV, {
    onSuccess: (_, variables) => {
      const office_uuid = variables.data.office_uuid;
      queryClient.invalidateQueries(["users", office_uuid]);
    },
  });
}

export interface IDeleteEmployeeParams {
  office_uuid: string;
  uuid: string;
}
async function deleteEmployee(params: IDeleteEmployeeParams): Promise<void> {
  try {
    const result = await backend.delete(
      `/office/${params.office_uuid}/employee/${params.uuid}`,
      {}
    );
    const deleteResult = result.data.data;
  } catch (err: any) {
    const processedError = processError(err);
    throw processedError;
  }
}

export function useDeleteEmployee() {
  const queryClient = useQueryClient();
  return useMutation<void, Error, IDeleteEmployeeParams>(deleteEmployee, {
    onSuccess: (_, variables) => {
      const office_uuid = variables.office_uuid;
      queryClient.invalidateQueries(["users", office_uuid]);
      queryClient.invalidateQueries(["user", office_uuid, variables.uuid]);
    },
  });
}

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

async function getEmployees(office_uuid: string): Promise<IEmployee[]> {
  if (!office_uuid) {
    throw "office_uuid should not be empty in getEmployee()";
  }
  try {
    const resp = await backend.get(`/office/${office_uuid}/employee`, {});
    const data = resp.data;
    let result = data?.data.users;
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

export function useEmployees(office_uuid: string) {
  return useQuery<IEmployee[], Error>(
    ["users", office_uuid],
    () => getEmployees(office_uuid),
    {
      refetchOnWindowFocus: false,
    }
  );
}

async function getEmployee(
  office_uuid: string,
  employee_uuid: string
): Promise<IEmployee> {
  if (!office_uuid) {
    throw "office_uuid and/or employee_uuid should not be empty in getEmployee()";
  }
  try {
    const resp = await backend.get(
      `/office/${office_uuid}/employee/${employee_uuid}`,
      {}
    );
    const data = resp.data;
    let result = data?.data;

    return result;
  } catch (err: any) {
    throw err;
  }
}

export function useEmployee(office_uuid: string, employee_uuid: any) {
  return useQuery<IEmployee, Error>(
    ["user", office_uuid],
    () => getEmployee(office_uuid, employee_uuid),
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
