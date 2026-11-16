// external dependencies
import { useMutation, useQuery, useQueryClient } from "react-query";

// orangery elements & internal dependencies
import { FormError } from "../states/mobx-form";

// queries & backend
import { backend } from "./backend";
import { processError } from "./commons";
import { IDepartment } from "./department";
import { IFloor } from "./floor";
import { IMedia } from "./media";
import { IOffice } from "./office";
import { IRoom } from "./room";

export interface IIssueUpdateParams {
  issue_uuid?: string;

  active: boolean;
}

export interface IIssueUpdateResult { }

async function updateIssue(params: IIssueUpdateParams): Promise<IIssueUpdateResult> {
  try {
    const data = {
      active: params.active,
    };

    const result = await backend.put(
      `/issue/${params.issue_uuid}`,
      data,
      {}
    );
    return result.data?.data;
  } catch (err: any) {
    const processedError = processError(err);
    throw processedError;
  }
}

export function useUpdateIssue() {
  const queryClient = useQueryClient();
  return useMutation<IIssueUpdateResult, Error, IIssueUpdateParams>(updateIssue, {
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries(["issues"]);
    },
  });
}

export interface IIssueSeenParams {
  issue_uuid: string;
}

export interface IIssueSeenResult { }

async function seenIssue(params: IIssueSeenParams): Promise<IIssueSeenResult> {
  try {
    const data = {
    };

    const result = await backend.put(
      `/issue/${params.issue_uuid}/seen`,
      data,
      {}
    );
    return result.data?.data;
  } catch (err: any) {
    const processedError = processError(err);
    throw processedError;
  }
}

export function useSeenIssue() {
  const queryClient = useQueryClient();
  return useMutation<IIssueSeenResult, Error, IIssueSeenParams>(seenIssue, {
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries(["issues"]);
    },
  });
}

export interface IIssueCommentSeenParams {
  issue_uuid: string;
  comment_uuid: string;
}

export interface IIssueCommentSeenResult { }

async function seenIssueComment(params: IIssueCommentSeenParams): Promise<IIssueCommentSeenResult> {
  try {
    const data = {
    };

    const result = await backend.put(
      `/issue/${params.issue_uuid}/comment/${params.comment_uuid}/seen`,
      data,
      {}
    );
    return result.data?.data;
  } catch (err: any) {
    const processedError = processError(err);
    throw processedError;
  }
}

export function useSeenIssueComment() {
  const queryClient = useQueryClient();
  return useMutation<IIssueCommentSeenResult, Error, IIssueCommentSeenParams>(seenIssueComment, {
    onSuccess: (_, variables) => {
      const issue_uuid = variables.issue_uuid;
      queryClient.invalidateQueries(["issues"]);
      queryClient.invalidateQueries(["issues", issue_uuid]);
    },
  });
}

export interface ICommentIssueParams {
  issue_uuid: string;

  description: string;
  image_uuids?: string[];
  document_uuids?: string[];
}

export interface ICommentIssueResult { }

async function commentIssue(params: ICommentIssueParams): Promise<ICommentIssueResult> {
  try {
    const data = {
      description: params.description,
      image_uuids: params.image_uuids,
      document_uuids: params.document_uuids,
    };

    const result = await backend.post(
      `/issue/${params.issue_uuid}/comment`,
      data,
      {}
    );
    return result.data?.data;
  } catch (err: any) {
    const processedError = processError(err);
    throw processedError;
  }
}

export function useCommentIssue() {
  const queryClient = useQueryClient();
  return useMutation<ICommentIssueResult, Error, ICommentIssueParams>(commentIssue, {
    onSuccess: (_, variables) => {
      const issue_uuid = variables.issue_uuid;
      // queryClient.invalidateQueries(["issues"]);
      queryClient.invalidateQueries(["comments", issue_uuid]);
    },
  });
}

export interface IComment {
  uuid?: string;
  description?: string;
  name?: string;  ////////!!!!!!!! name!?
  user?: IUser;
  seen?: boolean;
  created_date?: string;
  image_uuids?: string[];
  document_uuids?: string[];
  images?: IMedia[]
  documents?: IMedia[]
}

interface IUser {
  uuid?: string;
  name: string;
  first_name: string;
  last_name: string;
  image: string;
  email: string;
  phone?: string;
}

export interface IIssue {
  uuid?: string;
  subject?: string;

  description?: string;
  user?: IUser;
  seen?: boolean;
  created_date: string;
  image_uuids?: string[];
  document_uuids?: string[];

  office?: IOffice;
  department?: IDepartment;
  floor?: IFloor;
  room?: IRoom;

  active?: boolean;

  category?: string;

  number_of_comments?: number;

  comments?: IComment[];

  new_comments?: boolean;

  images?: IMedia[];
  documents?: IMedia[]
}

async function getComments(issue_uuid?: string): Promise<IComment[]> {
  if (!issue_uuid) {
    throw "issue_uuid should not be empty in getComments()";
  }
  try {
    const resp = await backend.get(
      `/issue/${issue_uuid}`,
      {}
    );
    const data = resp.data;
    let result = data?.data.issues?.comments; ////////!!!!!!!! issues!?
    return result;
  } catch (err: any) {
    // return [
    //   {
    //     "description": "skdjhfkjsdh bahman@live.com skjdhfkjdshfkjhdsjkhf ksjdhfkjshdfk kjdhfjkshdfj ksjdhfkjsdh f",
    //     "user": {
    //       "uuid": "5c969a71-9e70-48da-bb31-53e57fc98737",
    //       name: "H. M. 111",
    //       first_name: "H.",
    //       last_name: "M. 111",
    //       image_uuid: "null",
    //       email: "email",
    //       phone: "78634-298374"
    //     },
    //     "created_date": "Fri, 04 Mar 2022 14:27:33 GMT",
    //     image_uuids: ["null"],
    //     document_uuids: ["null"],
    //     "seen": true
    //   },
    //   {
    //     "description": "skdjhfkjsdh bahman@live.com skjdhfkjdshfkjhdsjkhf ksjdhfkjshdfk kjdhfjkshdfj ksjdhfkjsdh f",
    //     "user": {
    //       "uuid": "5c969a71-9e70-48da-bb31-53e57fc98737_2",
    //       "first_name": "name",
    //       "last_name": "name",
    //       "name": "name name",
    //       image_uuid: "null",
    //       "email": "bahman@live.com",
    //       "phone": "3456-455"
    //     },
    //     "created_date": "Fri, 04 Mar 2022 14:27:33 GMT",
    //     image_uuids: ["null"],
    //     document_uuids: ["null"],
    //     "seen": true
    //   }
    // ]

    throw err;
  }
}

export function useComments(issue_uuid?: string) {
  return useQuery<IComment[], Error>(
    ["comments", issue_uuid],
    () => getComments(issue_uuid),
    {
      refetchOnWindowFocus: false,
    }
  );
}

async function getIssue(issue_uuid?: string): Promise<IIssue> {
  if (!issue_uuid) {
    throw "issue_uuid should not be empty in getIssue()";
  }
  try {
    const resp = await backend.get(
      `/issue/${issue_uuid}`,
      {}
    );
    const data = resp.data;
    let result = data?.data.issues;
    return result;
  } catch (err: any) {
    // return {
    //   "uuid": "5c969a71-9e70-48da-bb31-53e57fc98737",
    //   "subject": "Bahman Shams",
    //   "description": "bahman@live.com skjdhfkjdshfkjhdsjkhf ksjdhfkjshdfk kjdhfjkshdfj ksjdhfkjsdh f",
    //   "user": {
    //     "uuid": "5c969a71-9e70-48da-bb31-53e57fc98737",
    //     name: "H. M. 111",
    //     first_name: "H.",
    //     last_name: "M. 111",
    //     image_uuid: "null",
    //     email: "email",
    //     phone: "78634-298374"
    //   },
    //   "created_date": "Fri, 12 Aug 2022 14:27:33 GMT",
    //   "image_uuids": ["null"],
    //   document_uuids: ["null"],
    //   "office_name": "",
    //   "department_name": "",
    //   "floor_name": "",
    //   "room_name": "",
    //   "active": true,
    //   "seen": true,
    //   "comments": [
    //     {
    //       "description": "skdjhfkjsdh bahman@live.com skjdhfkjdshfkjhdsjkhf ksjdhfkjshdfk kjdhfjkshdfj ksjdhfkjsdh f",
    //       "user": {
    //         "uuid": "5c969a71-9e70-48da-bb31-53e57fc98737",
    //         name: "H. M. 111",
    //         first_name: "H.",
    //         last_name: "M. 111",
    //         image_uuid: "null",
    //         email: "email",
    //         phone: "78634-298374"
    //       },
    //       "created_date": "Fri, 04 Mar 2022 14:27:33 GMT",
    //       "image_uuids": ["null"],
    //       document_uuids: ["null"],
    //       "seen": true
    //     },
    //     {
    //       "description": "skdjhfkjsdh bahman@live.com skjdhfkjdshfkjhdsjkhf ksjdhfkjshdfk kjdhfjkshdfj ksjdhfkjsdh f",
    //       "user": {
    //         "uuid": "5c969a71-9e70-48da-bb31-53e57fc98737_2",
    //         "first_name": "name",
    //         "last_name": "name",
    //         "name": "name name",
    //         image_uuid: "null",
    //         "email": "bahman@live.com",
    //         "phone": "3456-455"
    //       },
    //       "created_date": "Fri, 04 Mar 2022 14:27:33 GMT",
    //       "image_uuids": ["null"],
    //       document_uuids: ["null"],
    //       "seen": true
    //     }
    //   ]
    // }

    throw err;
  }
}

export function useIssue(issue_uuid?: string) {
  return useQuery<IIssue, Error>(
    ["issue", issue_uuid],
    () => getIssue(issue_uuid),
    {
      refetchOnWindowFocus: false,
    }
  );
}

async function getIssues(): Promise<IIssue[]> {
  // if (!office_uuid) {
  //   throw "office_uuid should not be empty in getIssue()";
  // }
  try {
    const resp = await backend.get(`/issue`, {});
    const data = resp?.data;
    let result = data?.data?.issues;
    result = result
      // .map((f: any) => ({
      //   ...f,
      //   office_uuid,
      // }))
      ?.sort((a: any, b: any) =>
        new Date(a.created_date).getTime() < new Date(b.created_date).getTime()
          ? 1
          : -1
      );
    return result;
  } catch (err: any) {
    throw err;
  }
}

export function useIssues() {
  return useQuery<IIssue[], Error>(
    ["issues"],
    () => getIssues(),
    {
      refetchOnWindowFocus: false,
    }
  );
}

export function useIssuesMutation() {
  const queryClient = useQueryClient();
  return useMutation<IIssue[], Error>(
    getIssues,
    {
      onSuccess: (_, variables) => {
        queryClient.invalidateQueries(["issues"]);
      },
    }
  );
}

export interface IIssueDeleteParams {
  issue_uuid: string;
}

async function deleteIssue(params: IIssueDeleteParams): Promise<void> {
  try {
    const result = await backend.delete(
      `/issue/${params.issue_uuid}`,
      {}
    );
    return result.data?.data;
  } catch (err: any) {
    const processedError = processError(err);
    throw processedError;
  }
}

export function useDeleteIssue() {
  const queryClient = useQueryClient();
  return useMutation<void, Error, IIssueDeleteParams>(deleteIssue, {
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries(["issues"]);
    },
  });
}