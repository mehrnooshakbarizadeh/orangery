// external dependencies
import { useMutation, useQuery, useQueryClient } from "react-query";

// orangery elements & internal dependencies
import { FormError } from "../states/mobx-form";

// queries & backend
import { backend } from "./backend";
import { processError } from "./commons";

export interface ITagParams {
  name: string;
  uuid?: string;
  office_uuid: string;
}
export interface ITagResult {
  uuid: string;
  name: string;
}
async function upsertTag(params: ITagParams): Promise<ITagResult> {
  try {
    const data = {
      name: params.name,
    };
    if (params.uuid) {
      const response = await backend.put(
        `/office/${params.office_uuid}/tag/${params.uuid}`,
        data,
        {}
      );
      const result = response.data.data;
      return result;
    } else {
      const response = await backend.post(
        `/office/${params.office_uuid}/tag`,
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

export function useUpsertTag() {
  const queryClient = useQueryClient();
  return useMutation<ITagResult, Error, ITagParams>(upsertTag, {
    onSuccess: (_, variables) => {
      const office_uuid = variables.office_uuid;
      queryClient.invalidateQueries(["tags", office_uuid]);
    },
  });
}

export interface IDeleteTagParams {
  office_uuid: string;
  uuid: string;
}
async function deleteTag(params: IDeleteTagParams): Promise<void> {
  try {
    const result = await backend.delete(
      `/office/${params.office_uuid}/tag/${params.uuid}`,
      {}
    );
    const deleteResult = result.data.data;
  } catch (err: any) {
    const processedError = processError(err);
    throw processedError;
  }
}

export function useDeleteTag() {
  const queryClient = useQueryClient();
  return useMutation<void, Error, IDeleteTagParams>(deleteTag, {
    onSuccess: (_, variables) => {
      const office_uuid = variables.office_uuid;
      queryClient.invalidateQueries(["tags", office_uuid]);
    },
  });
}

export interface ITag {
  uuid: string;
  office_uuid: string;
  name: string;
  active: boolean;
}

async function getTag(office_uuid?: any, tag_uuid?: any): Promise<ITag> {
  if (!office_uuid || !tag_uuid) {
    throw "office_uuid and/or tag_uuid should not be empty in getTag()";
  }
  try {
    const resp = await backend.get(`/office/${office_uuid}/tag/${tag_uuid}`, {});
    const data = resp.data;
    let result = data?.data.tags;
    return result;
  } catch (err: any) {
    throw err;
  }
}

export function useTag(office_uuid?: any, tag_uuid?: any) {
  return useQuery<ITag, Error>(
    ["tag", office_uuid, tag_uuid],
    () => getTag(office_uuid, tag_uuid),
    {
      refetchOnWindowFocus: false,
    }
  );
}

async function getTags(office_uuid: string): Promise<ITag[]> {
  if (!office_uuid) {
    throw "office_uuid should not be empty in getTags()";
  }
  try {
    const resp = await backend.get(`/office/${office_uuid}/tag`, {});
    const data = resp.data;
    let result = data?.data.tags;
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

export function useTags(office_uuid: any) {
  return useQuery<ITag[], Error>(
    ["tags", office_uuid],
    () => getTags(office_uuid),
    {
      refetchOnWindowFocus: false,
    }
  );
}

