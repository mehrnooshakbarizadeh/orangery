// external dependencies
import { useMutation, useQuery, useQueryClient } from "react-query";

// queries & backend
import { backend } from "./backend";
import { processError } from "./commons";

export interface IDepartmentUpsertParams {
  office_uuid: string;
  uuid?: string;
  name: string;
}

export interface IDepartmentResult { }

async function upsertDepartment(params: IDepartmentUpsertParams): Promise<IDepartmentResult> {
  try {
    const data = params;

    if (params.uuid) {
      const result = await backend.put(
        `/office/${params.office_uuid}/department/${params.uuid}`,
        data,
        {}
      );
      const finalResult = result.data.data;
      return finalResult.desk;
    } else {
      const result = await backend.post(
        `/office/${params.office_uuid}/department`,
        data,
        {}
      );
      const finalResult = result.data.data;
      return finalResult.desk;
    }
  } catch (err: any) {
    const processedError = processError(err);
    throw processedError;
  }
}

export function useUpsertDepartment() {
  const queryClient = useQueryClient();
  return useMutation<IDepartmentResult, Error, IDepartmentUpsertParams>(
    upsertDepartment,
    {
      onSuccess: (data, variables) => {
        const office_uuid = variables.office_uuid;
        queryClient.invalidateQueries(["departments", office_uuid]);
      },
    }
  );
}

export interface IDepartment {
  uuid: string;
  name: string;
}

async function getDepartments(office_uuid: string): Promise<IDepartment[]> {
  if (!office_uuid) {
    throw "office_uuid should not be empty in getDepartments()";
  }
  try {
    const resp = await backend.get(`/office/${office_uuid}/department`, {});
    const data = resp.data;
    let result = data?.data?.departments as IDepartment[];
    result = result.map((department: any) => ({
      ...department,
      office_uuid,
    }));

    return result;
  } catch (err: any) {
    throw err;
  }
}

export function useDepartments(office_uuid: string) {
  return useQuery<IDepartment[], Error>(
    ["departments", office_uuid],
    () => getDepartments(office_uuid),
    {
      refetchOnWindowFocus: false,
    }
  );
}
