// external dependencies
import { useMutation, useQuery, useQueryClient } from "react-query";

// orangery elements & internal dependencies
import { FormError } from "../states/mobx-form";

// queries & backend
import { backend } from "./backend";

export interface IMediaParams {
  uuid?: string;
  name?: string;
  office_uuid: string;
}
export interface IMediaResult {}
async function upsertMedia(params: IMediaParams): Promise<IMediaResult> {
  try {
    const data = {
      name: params.name,
    };

    if (params.uuid) {
      const result = await backend.put(
        `/office/${params.office_uuid}/media/${params.uuid}`,
        data,
        {}
      );
      const finalResult = result.data.data;
      return { finalResult };
    } else {
      const result = await backend.post(
        `/office/${params.office_uuid}/media`,
        data,
        {}
      );
      const finalResult = result.data.data;
      return { finalResult };
    }
  } catch (err: any) {
    const processedError = processError(err);
    throw processedError;
  }
}

export function useUpsertMedia() {
  const queryClient = useQueryClient();
  return useMutation<IMediaResult, Error, IMediaParams>(upsertMedia, {
    onSuccess: (_, variables) => {
      const office_uuid = variables.office_uuid;
      queryClient.invalidateQueries(["media", office_uuid]);
    },
  });
}

export interface IDeleteMediaParams {
  office_uuid: string;
  uuid: string;
}
async function deleteMedia(params: IDeleteMediaParams): Promise<void> {
  try {
    const result = await backend.delete(
      `/office/${params.office_uuid}/media/${params.uuid}`,
      {}
    );
    const deleteResult = result.data.data;
  } catch (err: any) {
    const processedError = processError(err);
    throw processedError;
  }
}

export function useDeleteMedia() {
  const queryClient = useQueryClient();
  return useMutation<void, Error, IDeleteMediaParams>(deleteMedia, {
    onSuccess: (_, variables) => {
      const office_uuid = variables.office_uuid;
      queryClient.invalidateQueries(["media", office_uuid]);
    },
  });
}

export interface IMedia {
  uuid: string;
  name?: string;
  size?: number;
  is_image: boolean;
  is_document: boolean;
  content_type?: File;
  created_by?: string;
  created_date?: string;
  updated_by?: string;
  timestamp?: number;
  office_uuid?: string;

  has_thumbnail?: boolean;
}

async function getMedia(office_uuid?: any, uuid?: any): Promise<IMedia> {
  if (!office_uuid || !uuid) {
    throw "office_uuid and/or uuid should not be empty in getMedia()";
  }
  try {
    const resp = await backend.get(`/office/${office_uuid}/media/${uuid}`, {});
    const data = resp.data;
    let result = data?.data.media;
    return result;
  } catch (err: any) {
    throw err;
  }
}

export function useMedia(office_uuid?: any, uuid?: any) {
  return useQuery<IMedia, Error>(
    ["media", office_uuid, uuid],
    () => getMedia(office_uuid, uuid),
    {
      refetchOnWindowFocus: false,
    }
  );
}

async function getFile(office_uuid?: any, uuid?: any): Promise<IMedia> {
  if (!office_uuid || !uuid) {
    throw "office_uuid and/or uuid should not be empty in getFile()";
  }
  try {
    const resp = await backend.get(`/file/${uuid}`, {});
    const data = resp.data;
    let result = data?.data.media;
    return result;
  } catch (err: any) {
    throw err;
  }
}

export function useFile(office_uuid?: any, uuid?: any) {
  return useQuery<IMedia, Error>(
    ["media", office_uuid, uuid],
    () => getFile(office_uuid, uuid),
    {
      refetchOnWindowFocus: false,
    }
  );
}

async function getMedias(office_uuid: string): Promise<IMedia[]> {
  if (!office_uuid) {
    throw "office_uuid should not be empty in getMedias()";
  }
  try {
    const resp = await backend.get(`/office/${office_uuid}/media`, {});
    const data = resp.data;
    let result = data?.data.media;
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

export function useMedias(office_uuid: string) {
  return useQuery<IMedia[], Error>(
    ["media", office_uuid],
    () => getMedias(office_uuid),
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
