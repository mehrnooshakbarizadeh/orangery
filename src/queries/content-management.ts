import { useMutation, useQuery, useQueryClient } from "react-query";
import { FormError } from "../states/mobx-form";
import { backend } from "./backend";


export interface IBlockContentParams {
  post_uuid: string;
  publish: boolean;
  office_uuid: string;
  is_featured?: boolean;
}
export interface IBlockContentResult {
  office_uuid: string;
  publish: boolean;
  post_uuid: string;
  is_featured?: boolean;
}
async function upsertBlockContent(params: IBlockContentParams): Promise<IBlockContentResult> {
  try {
    const data = {
      post_uuid: params.post_uuid,
      publish: params.publish,
      is_featured: params.is_featured,
    };

    if (params.post_uuid) {
      const result = await backend.put(
        `/office/${params.office_uuid}/report/post`,
        data,
        {}
      );
      const finalResult = result.data.data;
      return finalResult;
    } else {
      const result = await backend.post(
        `/office/${params.office_uuid}/report/post`,
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

export function useUpsertBlockContent() {
  const queryClient = useQueryClient();
  return useMutation<IBlockContentResult, Error, IBlockContentParams>(upsertBlockContent, {
    onSuccess: (data, variables) => {
      const office_uuid = variables.office_uuid;
      queryClient.invalidateQueries(["contents", office_uuid]);
      queryClient.invalidateQueries(["content", office_uuid, data.post_uuid]);
    },
  });
}



export interface IAuthor {
  uuid: string,
  name: string,
  first_name: string,
  last_name: string,
  email: string,
  job: string,
  role: string,
  image: null,
  remote: boolean,
  checked_in_at: null,
  checked_out_at: null,
  biography: string,
  linked_in: string,
  twitter: string,
  github: string,
  instagram: string,
  facebook: string,
  stackoverflow: string,
  followers: number,
  follows: number,
  skills: [],
  interests: [],
  i_follow: boolean,
  organization: string,
  created_date: string
}

export interface IImage {
  uuid: string
}

export interface IReported {
  email: string
  image: IImage;
  name: string
  phone: string
  uuid: string
}

export interface IPublishedContent {
  office_uuid: string;
  uuid: string,
  title: string,
  body: string,
  is_global: boolean,
  author: IAuthor,
  images: IImage[],
  reactions: {},
  user_reactions: [],
  created_date: string
  published: boolean;
  reported_by: IReported
  description: string;
  reported_date: string;
  user: IReportedUser[];
  is_featured: boolean;
}

export interface IReportedUser {
  date: string;
  description: string;
  email: string;
  image: IImage;
  name: string;
  phone: string;
  reported_by: IReported;
  uuid: string
}



async function getPublishedContents(office_uuid: string): Promise<IPublishedContent[]> {
  if (!office_uuid) {
    throw "office_uuid should not be empty in getContent()";
  }
  try {
    const resp = await backend.get(`/office/${office_uuid}/report/post/all`, {});
    const data = resp.data;
    let result = data?.data.posts;
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

export function usePublishedContents(office_uuid: string) {
  return useQuery<IPublishedContent[], Error>(
    ["contents", office_uuid],
    () => getPublishedContents(office_uuid),
    {
      refetchOnWindowFocus: false,
    }
  );
}

async function getReportedContents(office_uuid: string): Promise<IPublishedContent[]> {
  if (!office_uuid) {
    throw "office_uuid should not be empty in getReportedContent()";
  }
  try {
    const resp = await backend.get(`/office/${office_uuid}/report/post`, {});
    const data = resp.data;
    let result = data?.data.reported_posts;
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

export function useReportedContents(office_uuid: string) {
  return useQuery<IPublishedContent[], Error>(
    ["contents", office_uuid],
    () => getReportedContents(office_uuid),
    {
      refetchOnWindowFocus: false,
    }
  );
}

async function getReportedUser(office_uuid: string): Promise<IReportedUser[]> {
  if (!office_uuid) {
    throw "office_uuid should not be empty in getReportedUsers()";
  }
  try {
    const resp = await backend.get(`/office/${office_uuid}/report/user`, {});
    const data = resp.data;
    let result = data?.data.reported_users;
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

export function useReportedUser(office_uuid: string) {
  return useQuery<IReportedUser[], Error>(
    ["reportedUser", office_uuid],
    () => getReportedUser(office_uuid),
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
