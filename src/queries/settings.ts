// external dependencies
import { AnyPointerEvent } from "framer-motion/types/gestures/PanSession";
import { useMutation, useQuery, useQueryClient } from "react-query";

// orangery elements & internal dependencies
import { FormError } from "../states/mobx-form";

// queries & backend
import { backend } from "./backend";

export interface ISettings {
  uuid?: string;
  default_instruction?: string;
}

async function getSettings(office_uuid: string): Promise<ISettings> {
  if (!office_uuid) {
    throw "office_uuid should not be empty in getSettings()";
  }
  try {
    const resp = await backend.get(`/office/${office_uuid}/settings`, {});
    const data = resp.data;
    return data.data.office;
  } catch (err: any) {
    throw err;
  }
}

export function useSettings(settings_uuid: string) {
  return useQuery<ISettings, Error>(
    ["settings", settings_uuid],
    () => getSettings(settings_uuid),
    {
      refetchOnWindowFocus: false,
    }
  );
}

export interface ISettingsUpdateParams {
  uuid?: string;
  default_instruction?: string;
}

async function updateSettings(
  params: ISettingsUpdateParams
): Promise<ISettings> {
  try {
    const data = {
      default_instruction: params.default_instruction,
    };
    const result = await backend.put(`/office/${params.uuid}/settings`, data, {
      headers: (data as any).getHeaders?.(),
    });
    const finalResult = result.data.data;
    return finalResult.office;
  } catch (err: any) {
    const processedError = processError(err);
    throw processedError;
  }
}

export function useUpdateSettings() {
  const queryClient = useQueryClient();
  return useMutation<ISettings, Error, ISettingsUpdateParams>(updateSettings, {
    onSuccess: (_, variables) => {
      const settings_uuid = _.uuid;
      queryClient.invalidateQueries(["settings"]);
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
