// external dependencies
import { useMutation, useQuery, useQueryClient } from "react-query";

// orangery elements & internal dependencies
import { FormError } from "../states/mobx-form";

// queries & backend
import { backend } from "./backend";

export interface ICreditParams {
  employee_uuid: string;
  name: string;
  balance: number;
  monthly_credit: boolean;
  office_uuid: string;
}
export interface ICreditResult {}
async function upsertCredit(params: ICreditParams): Promise<ICreditResult> {
  try {
    const data = {
      balance: params.balance,
      name: params.name,
      monthly_credit: params.monthly_credit,
      employee_uuid: params.employee_uuid,
    };

    const result = await backend.post(
      `/office/${params.office_uuid}/credit`,
      data,
      {}
    );
    const finalResult = result.data.data;
    return { finalResult };
  } catch (err: any) {
    const processedError = processError(err);
    throw processedError;
  }
}

export function useUpsertCredit() {
  const queryClient = useQueryClient();
  return useMutation<ICreditResult, Error, ICreditParams>(upsertCredit, {
    onSuccess: (_, variables) => {
      const office_uuid = variables.office_uuid;
      queryClient.invalidateQueries(["balance", office_uuid]);
    },
  });
}

export interface IDeleteCreditParams {
  office_uuid: string;
  employee_uuid: string;
}
async function deleteCredit(params: IDeleteCreditParams): Promise<void> {
  try {
    const result = await backend.delete(
      `/office/${params.office_uuid}/credit/${params.employee_uuid}`,
      {}
    );
    const deleteResult = result.data.data;
  } catch (err: any) {
    const processedError = processError(err);
    throw processedError;
  }
}

export function useDeleteCredit() {
  const queryClient = useQueryClient();
  return useMutation<void, Error, IDeleteCreditParams>(deleteCredit, {
    onSuccess: (_, variables) => {
      const office_uuid = variables.office_uuid;
      queryClient.invalidateQueries(["balance", office_uuid]);
    },
  });
}

export interface ICredit {
  office_uuid: string;
  uuid: string;
  name: string;
  email: string;
  image: string;
  balance: number;
  monthly_credit: boolean;
  created: Date;
}

async function getCredit(office_uuid?: any, employee_uuid?: any): Promise<ICredit> {
  if (!office_uuid || !employee_uuid) {
    throw "office_uuid and/or uuid should not be empty in getCredit()";
  }
  try {
    const resp = await backend.get(`/office/${office_uuid}/credit/${employee_uuid}`, {});
    const data = resp.data;
    let result = data?.data.balance;
    return result;
  } catch (err: any) {
    throw err;
  }
}

export function useCredit(office_uuid?: any, employee_uuid?: any) {
  return useQuery<ICredit, Error>(
    ["balance", office_uuid, employee_uuid],
    () => getCredit(office_uuid, employee_uuid),
    {
      refetchOnWindowFocus: false,
    }
  );
}

async function getCredits(office_uuid: string): Promise<ICredit[]> {
  if (!office_uuid) {
    throw "office_uuid should not be empty in getCredits()";
  }
  try {
    const resp = await backend.get(`/office/${office_uuid}/credit`, {});
    const data = resp.data;
    let result = data?.data.credit;
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

export function useCredits(office_uuid: string) {
  return useQuery<ICredit[], Error>(
    ["balance", office_uuid],
    () => getCredits(office_uuid),
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
