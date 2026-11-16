import { useMutation, useQuery, useQueryClient } from "react-query";

// orangery elements & internal dependencies
import { FormError } from "../states/mobx-form";

// queries & backend
import { backend } from "./backend";
import { processError } from "./employee";
import { IMedia } from "./media";

export interface IImageData {
    uuid?: string;
    file?: File;
  }
  export interface IImageResult {
    uuid: string;
  }
  
  interface IImageUpload {
    uuid?: string;
    file: File;
    office_uuid: string;
    onUploadProgress: (progressEvent: any) => void;
  }
  
  async function uploadAssetFile(params: IImageUpload): Promise<IImageResult> {
    try {
      const formData = new FormData();
      formData.append("file", params.file);
      formData.append("office_uuid", params.office_uuid);
  
      if (params.uuid) {
        const result = await backend.put(`/file/image`, formData, {
          headers: (formData as any).getHeaders?.(),
          onUploadProgress: params.onUploadProgress,
        });
        const finalResult = result.data.data;
        return { uuid: finalResult };
      } else {
        const result = await backend.post(`/file/image`, formData, {
          headers: (formData as any).getHeaders?.(),
          onUploadProgress: params.onUploadProgress,
        });
        const finalResult = result.data.data;
        return { uuid: finalResult };
      }
    } catch (err: any) {
      const processedError = processError(err);
      throw processedError;
    }
  }

  export function useUploadFile() {
    const queryClient = useQueryClient();
    return useMutation<IImageResult, Error, IImageUpload>(uploadAssetFile, {
      onSuccess: (data, variables) => {
        // const office_uuid = variables.office_uuid;
        queryClient.invalidateQueries(["images"]);
        queryClient.invalidateQueries(["images", data.uuid]);
      },
    });
  }
  
  export interface IDeleteMediaParams {
    office_uuid: string;
    uuid: string;
  }
  async function deleteFile(params: IDeleteMediaParams): Promise<void> {
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

  export function useDeleteFile() {
    const queryClient = useQueryClient();
    return useMutation<void, Error, IDeleteMediaParams>(deleteFile, {
      onSuccess: (_, variables) => {
        const office_uuid = variables.office_uuid;
        queryClient.invalidateQueries(["image", office_uuid]);
      },
    });
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
      ["images", office_uuid],
      () => getMedias(office_uuid),
      {
        refetchOnWindowFocus: false,
      }
    );
  }