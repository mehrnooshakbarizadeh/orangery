// external dependencies
import { useMutation, useQuery, useQueryClient } from "react-query";

// queries & backend
import { backend } from "../backend";
import { IUser } from "../dashboard";
import { processError } from "../commons";
export interface IConnectResult {
}
export interface IConnectParams {
  webhook: string;
  username: string;
  events: string[];
}

async function connect(params: IConnectParams): Promise<IConnectResult> {
  try {
    const data = {
      webhook: params.webhook,
      username: params.username,
      events: params.events,
    };
    const response = await backend.post(
      `/integration/slack`,
      data,
      {}
    );
    const result = response.data;
    return result;
  } catch (err: any) {
    throw err;
  }
}

export function useConnect() {
  const queryClient = useQueryClient();
  return useMutation<IConnectResult, Error, IConnectParams>(
    connect,
    {
      onSuccess: (_, variables) => {
        queryClient.invalidateQueries(["apps"]);
      },
    }
  );
}

export interface ITestParams {
  webhook: string
}

export interface ITestResult {
  data: boolean
}

async function test(params: ITestParams): Promise<ITestResult> {
  try {
    const data = {
      webhook: params.webhook,
    };
    const response = await backend.post(
      `/integration/slack/test-notification`,
      data,
      {}
    );
    const result = response.data;
    return result;
  } catch (err: any) {
    throw err;
  }
}

export function useTest() {
  const queryClient = useQueryClient();
  return useMutation<ITestResult, Error, ITestParams>(
    test,
    {
      onSuccess: (_, variables) => {
        // queryClient.invalidateQueries(["apps"]);
      },
    }
  );
}

async function deleteSlack(): Promise<void> {
  try {
    const result = await backend.delete(
      `/integration/slack`,
      {}
    );
    const deleteResult = result.data.data;
  } catch (err: any) {
    const processedError = processError(err);
    throw processedError;
  }
}

export function useDeleteSlack() {
  const queryClient = useQueryClient();
  return useMutation<void, Error, void>(deleteSlack, {
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries(["apps"]);
    },
  });
}

export interface ISlack {
  webhook: string;
  events: any,
  username: string;
}

async function getSlack(): Promise<ISlack> {
  try {
    const resp = await backend.get(`/integration/slack`, {});
    const data = resp.data;
    let result = data?.data;
    return result;
  } catch (err: any) {
    throw err;
  }
}

export function useSlackMutation() {
  const queryClient = useQueryClient();
  return useMutation<ISlack, Error>(
    getSlack,
    {
      onSuccess: (_, variables) => {
        queryClient.invalidateQueries(["slack"]);
      },
    }
  );
}