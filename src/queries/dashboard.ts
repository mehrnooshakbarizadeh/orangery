// external dependencies
import { useMutation, useQuery, useQueryClient } from "react-query";

// orangery elements & internal dependencies
import { FormError } from "../states/mobx-form";

// queries & backend
import { backend } from "./backend";

export interface IUser {
  uuid: string;
  name?: string;
  group?: any;
  first_name: string;
  last_name: string;
  email: string;
  password?: string;
  old_password?: string;
  // image?: File | string;
  image?: string;
  role?: string;
  phone?: string;
  checked_in?: boolean;
  checked_in_at?: string;
  created_by?: string;
  created_date?: string; ////////!!!!!!!!
  updated_by?: string;
  timestamp?: number;
}

export interface IUserUpdateParams {
  uuid: string;
  first_name: string;
  last_name: string;
  email: string;
  password?: string;
  old_password?: string;
}

export interface IProfileResult {
  // uuid: string;
  // first_name: string;
  // last_name: string;
  // email: string;
}

// export interface IUser {
//   uuid: string,
//   name: string,
//   group?: any,
//   first_name: string,
//   last_name: string,
//   email: string,
//   role: string,
//   phone: string,
//   checked_in: boolean,
//   created_by: string,
//   created_date: string, ////////!!!!!!!!
//   updated_by: string,
//   timestamp: number
// }

async function getUser(office_uuid: string): Promise<IUser> {
  if (!office_uuid) {
    throw "office_uuid should not be empty in getUser()";
  }
  try {
    const resp = await backend.get(`office/${office_uuid}/dashboard`, {});
    const data = resp.data;
    let result = data?.data?.user;
    return result;
  } catch (err: any) {
    throw err;
  }
}

export function useUser(office_uuid: string) {
  return useQuery<IUser, Error>(
    ["user", office_uuid],
    () => getUser(office_uuid),
    {
      refetchOnWindowFocus: false,
    }
  );
}

async function getDashboardUsers(office_uuid: string): Promise<IUser[]> {
  if (!office_uuid) {
    throw "office_uuid should not be empty in getDashboardUsers()";
  }
  try {
    const resp = await backend.get(`office/${office_uuid}/dashboard/users`, {});
    const data = resp.data;
    let result = data?.data?.users;
    return result;
  } catch (err: any) {
    throw err;
  }
}

export function useDashboardUsers(office_uuid: string) {
  return useQuery<IUser[], Error>(
    ["dashboardUsers", office_uuid],
    () => getDashboardUsers(office_uuid),
    {
      refetchOnWindowFocus: false,
    }
  );
}

// export interface IProfileImageUpdate{

// }

export interface IProfileUpdateParams {
  uuid: string;
  first_name: string;
  last_name: string;
  email: string;
  old_password: string;
  password: string;
  image_uuid: string;
}

async function updateProfile(
  params: IProfileUpdateParams
): Promise<IProfileResult> {
  try {
    const data = {
      uuid: params.uuid,
      first_name: params.first_name,
      last_name: params.last_name,
      email: params.email,
      old_password: params.old_password,
      password: params.password,
      image_uuid: params.image_uuid,
    };
    // const formData = new FormData();
    // formData.append("data", JSON.stringify(data));
    // if (params.image instanceof File) {
    //   formData.append("image", params.image);
    // }
    const result = await backend.put(`/profile`, data, {
      headers: (data as any).getHeaders?.(),
    });
    const finalResult = result.data.data;
    return { finalResult };
  } catch (err: any) {
    const processedError = processError(err);
    throw processedError;
  }
}

export function useUpdateProfile() {
  const queryClient = useQueryClient();
  return useMutation<IProfileResult, Error, IProfileUpdateParams>(
    updateProfile,
    {
      onSuccess: (_, variables) => {
        queryClient.invalidateQueries(["user"]);
      },
    }
  );
}

export interface IDashboard {
  user: IUser;
  assigned_desks: any;
  booked_desks: any;
  display_quick_start: boolean;
  has_delivery_areas: boolean;
  has_assets: boolean;
  has_visitors: boolean;
  is_organizer: boolean;
  number_of_employees: number;
}

async function getDashboard(office_uuid: string): Promise<IDashboard> {
  if (!office_uuid) {
    throw "office_uuid should not be empty in getDashboard()";
  }
  try {
    const resp = await backend.get(`office/${office_uuid}/dashboard`, {});
    const data = resp.data;
    let result = data?.data;
    return result;
  } catch (err: any) {
    throw err;
  }
}

export function useDashboard(office_uuid: string) {
  return useQuery<IDashboard, Error>(
    ["dashboard", office_uuid],
    () => getDashboard(office_uuid),
    {
      refetchOnWindowFocus: false,
    }
  );
}

export interface IDashboardStatistics {
  users?: number;
  checked_in?: number;
  tenants?: number;
  visitors?: number;
  assets?: number;
  upcomming_meetings?: number;
  desks_in_use?: number;
  free_desks?: number;

  floors?: number;
}

export async function getDashboardStatistics(
  params: IDashboardStatisticsGetParams
): Promise<IDashboardStatistics> {
  if (!params.office_uuid) {
    throw "office_uuid should not be empty in getDashboardStatistics()";
  }
  try {
    const resp = await backend.get(
      `office/${params.office_uuid}/dashboard/statistics`,
      {}
    );
    const data = resp.data;
    let result = data?.data;
    return result;
  } catch (err: any) {
    throw err;
  }
}

export interface IDashboardStatisticsGetParams {
  office_uuid: string;
}

// export function useDashboardStatistics(office_uuid: string) {
//   return useQuery<IDashboardStatistics, Error>(
//     ["dashboardStatistics", office_uuid],
//     () => getDashboardStatistics(office_uuid),
//     {
//       refetchOnWindowFocus: false,
//     }
//   );
// }

export function useDashboardStatistics() {
  const queryClient = useQueryClient();
  return useMutation<
    IDashboardStatistics,
    Error,
    IDashboardStatisticsGetParams
  >(getDashboardStatistics, {
    onSuccess: (_, variables) => {
      const office_uuid = variables.office_uuid;
      queryClient.invalidateQueries(["dashboardStatistics", office_uuid]);
    },
    retry: 3,
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
          error: "", // Something went wrong!
        },
      ],
    };
    return error;
  }
}
