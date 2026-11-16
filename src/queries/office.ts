// external dependencies
import { AnyPointerEvent } from "framer-motion/types/gestures/PanSession";
import { useMutation, useQuery, useQueryClient } from "react-query";

// orangery elements & internal dependencies
import { FormError } from "../states/mobx-form";

// queries & backend
import { backend } from "./backend";
import { IFloor } from "./floor";

export interface IOfficeInsertParams {
  name: string;
  address: string;
  employee_estimate: number;
}

export interface IOfficeResult {
  uuid: string;
  name: string;
  address: string;
  lat: string;
  lon: string;
  data: null;
  employee_estimate: number;
  floors: IFloor[];
  meeting_rooms?: any; ////////!!!!!!!! []
  created_by: string | null;
  created_date: string;
  updated_by: string;
  timestamp: number;
  qr_code?: string;
}

async function insertOffice(
  params: IOfficeInsertParams
): Promise<IOfficeResult> {
  try {
    const data = {
      name: params.name,
      address: params.address,
      employee_estimate: params.employee_estimate,
    };

    const response = await backend.post(`/office`, data, {});
    const result = response.data?.data?.office; ////////!!!!!!!!
    return result;
  } catch (err: any) {
    const processedError = processError(err);
    throw processedError;
  }
}

export function useInsertOffice() {
  const queryClient = useQueryClient();
  return useMutation<IOfficeResult, Error, IOfficeInsertParams>(insertOffice, {
    onSuccess: (data, variables) => {
      const office_uuid = data.uuid;
      queryClient.invalidateQueries(["offices"]);
    },
  });
}

export interface IOffice {
  uuid: string;
  name: string;
  address: string;
  lat: string;
  lon: string;
  data: null;
  employee_estimate: number;
  floors: IFloor[];
  meeting_rooms?: any; ////////!!!!!!!! []
  created_by: string | null;
  created_date: string;
  updated_by: string;
  timestamp: number;
  qr_code?: string;
  default_tax_rate: number;
  view_token: string;

  is_customer?: boolean;
}

async function getOffices(): Promise<IOffice[]> {
  try {
    const resp = await backend.get("/office", {});
    const data = resp.data;
    return data.data?.offices;
  } catch (err: any) {
    throw err;
  }
}

export function useOffices() {
  return useQuery<IOffice[], Error>(["offices"], getOffices, {
    refetchOnWindowFocus: false,
  });
}

export function useOfficesMutation() {
  const queryClient = useQueryClient();
  return useMutation<IOffice[], Error>(getOffices, {
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries(["offices"]);
    },
  });
}

async function getOffice(office_uuid: string): Promise<IOffice> {
  if (!office_uuid) {
    throw "office_uuid should not be empty in getOffice()";
  }
  try {
    const resp = await backend.get(`/office/${office_uuid}`, {});
    const data = resp.data;
    return data.data;
  } catch (err: any) {
    throw err;
  }
}

export function useOffice(office_uuid: string) {
  return useQuery<IOffice, Error>(
    ["offices", office_uuid],
    () => getOffice(office_uuid),
    {
      refetchOnWindowFocus: false,
    }
  );
}

export interface WeekDay {
  closed: boolean;
  from_time: string;
  until_time: string;
}

export interface IOpeningTimes {
  "0": WeekDay;
  "1": WeekDay;
  "2": WeekDay;
  "3": WeekDay;
  "4": WeekDay;
  "5": WeekDay;
  "6": WeekDay;
}

export interface IOfficeUpdateParams {
  uuid?: string;
  name: string;
  address: string;
  phone: string;
  community_manager_phone: string;
  email: string;
  tax_rate: number;
  data?: any;
  opening_times: IOpeningTimes;
  view_token?: string;
}

async function updateOffice(params: IOfficeUpdateParams): Promise<IOffice> {
  try {
    const data = {
      name: params.name,
      address: params.address,
      phone: params.phone,
      community_manager_phone: params.community_manager_phone,
      email: params.email,
      tax_rate: params.tax_rate,
      opening_times: params.opening_times,
    };
    const result = await backend.put(`/office/${params.uuid}`, data, {
      headers: (data as any).getHeaders?.(),
    });
    const finalResult = result.data.data;
    return finalResult.office;
  } catch (err: any) {
    const processedError = processError(err);
    throw processedError;
  }
}

export function useUpdateOffice() {
  const queryClient = useQueryClient();
  return useMutation<IOffice, Error, IOfficeUpdateParams>(updateOffice, {
    onSuccess: (_, variables) => {
      const office_uuid = _.uuid;
      queryClient.invalidateQueries(["offices"]);
    },
  });
}

export interface INotificationEmail {
  uuid: string;
  emails: string[];
}

async function getNotificationEmail(
  office_uuid: string
): Promise<INotificationEmail> {
  if (!office_uuid) {
    throw "office_uuid should not be empty in getNotificationEmail()";
  }
  try {
    const resp = await backend.get(
      `/office/${office_uuid}/email-notifications`,
      {}
    );
    const data = resp.data;
    return data.data;
  } catch (err: any) {
    throw err;
  }
}

export function useNotificationEmail(office_uuid: string) {
  return useQuery<INotificationEmail, Error>(
    ["notificationEmails", office_uuid],
    () => getNotificationEmail(office_uuid),
    {
      refetchOnWindowFocus: false,
    }
  );
}
export interface INotificationEmailUpdate {
  uuid: string;
  emails: string[];
}

async function updateNotificationEmail(
  params: INotificationEmailUpdate
): Promise<INotificationEmail> {
  try {
    const data = {
      emails: params.emails,
    };
    const result = await backend.post(
      `office/${params.uuid}/email-notifications`,
      data,
      {
        // headers: (data as any).getHeaders?.(),
      }
    );
    const finalResult = result.data.data;

    return finalResult;
  } catch (err: any) {
    const processedError = processError(err);
    throw processedError;
  }
}

export function useUpdateNotificationEmail() {
  const queryClient = useQueryClient();
  return useMutation<INotificationEmail, Error, INotificationEmailUpdate>(
    updateNotificationEmail,
    {
      onSuccess: (_, variables) => {
        const office_uuid = _.uuid;
        queryClient.invalidateQueries(["notificationEmails"]);
      },
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
