// external dependencies
import { useMutation, useQuery, useQueryClient } from "react-query";

// orangery elements & internal dependencies
import { FormError } from "../states/mobx-form";

// queries & backend
import { backend } from "./backend";

export interface IImageParams {
  uuid?: string;
  file: File;
}

export interface IImageResult {
  uuid: string;
}

async function upsertImage(params: IImageParams): Promise<IImageResult> {
  try {
    const formData = new FormData();
    formData.append("file", params.file);

    if (params.uuid) {
      const result = await backend.put(`/file/image`, formData, {
        headers: (formData as any).getHeaders?.(),
      });
      const finalResult = result.data;
      return { uuid: finalResult };
    } else {
      const result = await backend.post(`/file/image`, formData, {
        headers: (formData as any).getHeaders?.(),
      });
      const finalResult = result.data;
      return { uuid: finalResult };
    }
  } catch (err: any) {
    const processedError = processError(err);
    throw processedError;
  }
}

////////!!!!!!!! not used till now
export function useUpsertImage() {
  const queryClient = useQueryClient();
  return useMutation<IImageResult, Error, IImageParams>(upsertImage, {
    onSuccess: (_, variables) => {
      const uuid = variables.uuid;
      queryClient.invalidateQueries(["images", uuid]);
    },
  });
}


export interface IDocumentParams {
  uuid?: string;
  document: File | string;
}
export interface IDocumentResult { }

let files: IDocumentParams[] = [];

async function upsertDocument(
  params: IDocumentParams
): Promise<IDocumentResult> {
  try {
    const formData = new FormData();
    if (params.document instanceof File) {
      // files = [...files, params.document]
      files = [...files, params];
      if (files instanceof File) {
        formData.append("document", files);
      }
    }

    if (params.uuid) {
      const result = await backend.put(`/file/document`, formData, {
        headers: (formData as any).getHeaders?.(),
      });
      const finalResult = result.data;
      return { finalResult };
    } else {
      const result = await backend.post(`/file/document`, formData, {
        headers: (formData as any).getHeaders?.(),
      });
      const finalResult = result.data;
      return { finalResult };
    }
  } catch (err: any) {
    const processedError = processError(err);
    throw processedError;
  }
}

////////!!!!!!!! not used till now
export function useUpsertDocument() {
  const queryClient = useQueryClient();
  return useMutation<IDocumentResult, Error, IDocumentParams>(upsertDocument, {
    onSuccess: (_, variables) => {
      const uuid = variables.uuid;
      queryClient.invalidateQueries(["documents", uuid]);
    },
  });
}

export interface IDocument {
  file: File;
}

async function getFile(uuid?: string): Promise<File> {
  if (!uuid) {
    throw "file uuid should not be empty in getDucument()";
  }
  try {
    const resp = await backend.get(`/file/${uuid}`, {
      responseType: 'arraybuffer',
      responseEncoding: 'binary'
    });
    const data = resp.data;

    return data;
  } catch (err: any) {
    throw err;
  }
}

////////!!!!!!!! not used till now
export function useFile(uuid?: string) {
  return useQuery<File, Error>(
    ["file", uuid],
    () => getFile(uuid),
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
