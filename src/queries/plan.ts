// external dependencies
import { useMutation, useQuery, useQueryClient } from "react-query";

// orangery elements & internal dependencies
import { FormError } from "../states/mobx-form";

// queries & backend
import { backend } from "./backend";

export interface IPlan {
  name: string;
  uuid: string;
  price: number;
  description?: string;
  features?: [];
  aquired?: boolean;
}

export interface IPlanParams {
  uuid: string;
  name?: string;
  aquired?: boolean;
}
export interface IPlanSubscriptionParams {
  uuid: string;
}
export interface IPlanResult {
  data: boolean;
}

async function updatePlan(
  params: IPlanSubscriptionParams
): Promise<IPlanResult> {
  try {
    const data = {
    };
    if (params.uuid) {
      const response = await backend.put(
        `/plan/${params.uuid}`,
        data,
        {}
      );
      const result = response.data;
      return result;
    } else {
      const result = { data: false }; ////////!!!!!!!!
      return result;
    }
  } catch (err: any) {
    const processedError = processError(err);
    throw processedError;
  }
}

export function useUpdatePlan() {
  const queryClient = useQueryClient();
  return useMutation<IPlanResult, Error, IPlanSubscriptionParams>(
    updatePlan,
    {
      onSuccess: (_, variables) => {
        queryClient.invalidateQueries(["plan",]);
      },
    }
  );
}

async function deletePlan(
  params: IPlanParams
): Promise<void> {
  try {
    const result = await backend.delete(
      `/plan/subscribed`,
      {}
    );
    const deleteResult = result.data.data;
  } catch (err: any) {
    const processedError = processError(err);
    throw processedError;
  }
}

export function useDeletePlan() {
  const queryClient = useQueryClient();
  return useMutation<void, Error, IPlanParams>(deletePlan, {
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries(["plan",]);
    },
  });
}

async function getPlan(): Promise<IPlan[]> {
  try {
    const resp = await backend.get(`/plan`, {});
    const data = resp.data;
    let result = data?.data.plans;
    return result;
  } catch (err: any) {
    throw err;
  }
}

export function usePlan() {
  return useQuery<IPlan[], Error>(
    ["plan",],
    () => getPlan(),
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
