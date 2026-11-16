// external dependencies
import { useMutation } from "react-query";
import mixpanel from "mixpanel-browser";

// orangery elements & internal dependencies
import { FormError } from "../states/mobx-form";
import { OrangeryToast } from "../components/OrangeryElements";

// queries & backend
import { backend, setBackendToken } from "./backend";

export interface ISignupParams {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
}

export interface ISignupResult {
  token: string;
}
async function postSignup(params: ISignupParams): Promise<ISignupResult> {
  try {
    const data = {
      first_name: params.first_name,
      last_name: params.last_name,
      email: params.email,
      password: params.password,
    };

    try {
      mixpanel.init(process.env.NEXT_PUBLIC_MIXPANEL_TOKEN || "", {
        debug: process.env.NEXT_PUBLIC_ENV_MODE !== "production",
      });
      const dId = await mixpanel.get_distinct_id();
      try {
        mixpanel.identify(params.email);
      } catch (e) {
        console.log(e);
      }

      mixpanel.people.set("name", params.first_name + " " + params.last_name);
      mixpanel.people.set("$first_name", params.first_name);
      mixpanel.people.set("$last_name", params.last_name);
      mixpanel.people.set("$name", params.first_name + " " + params.last_name);
      mixpanel.people.set("$email", params.email);
      // mixpanel.people.set('$avatar', CDN_URL + user?.image + '.jpg')
      // mixpanel.people.set('$created', user?.created_date)

      mixpanel.track("Dashboard:Signup", {
        current_user_email: params.email,
        current_user_name: params.first_name + " " + params.last_name,
        // current_user_uuid: "",
        // current_office_name: "",
        // current_office_uuid: "",
        current_service: "dashboard",
      });
    } catch (err: any) {
      console.warn(err?.response?.data?.msg || "error tracking by mixpanel");
    }

    const result = await backend.post(`/register`, data, {});
    const token = result.data.data.token;

    setBackendToken(token);

    return { token };
  } catch (err: any) {
    const processedError = processError(err);
    throw processedError;
  }
}

export function useSignup() {
  return useMutation<ISignupResult, Error, ISignupParams>(postSignup, {});
}

export interface IPasswordResetParams {
  email: string;
}
export interface IPasswordResetResult {
  data: {
    data: string;
  };
}
async function passwordReset(
  params: IPasswordResetParams
): Promise<IPasswordResetResult> {
  try {
    const data = {
      email: params.email,
    };

    const result = await backend.post(`/password-reset`, data, {});
    return result;
  } catch (err: any) {
    const processedError = processError(err);
    throw processedError;
  }
}

export function usePasswordReset() {
  return useMutation<IPasswordResetResult, Error, IPasswordResetParams>(
    passwordReset,
    {}
  );
}
export interface INewPasswordParams {
  password: string;
  session_uuid: string;
}
export interface INewPasswordResult {
  data: {
    data: string;
  };
}
async function newPassword(
  params: INewPasswordParams
): Promise<INewPasswordResult> {
  try {
    const data = {
      password: params.password,
      session_uuid: params.session_uuid,
    };

    const result = await backend.post(`/password-reset/new`, data, {});
    return result;
  } catch (err: any) {
    const processedError = processError(err);
    throw processedError;
  }
}

export function useNewPassword() {
  return useMutation<INewPasswordResult, Error, INewPasswordParams>(
    newPassword,
    {}
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
    if (err.response.data.error_code === "ce723") {
      const error: FormError = {
        errors: [
          {
            field: "",
            error: err.response.data.msg || "Name or Lastname is too short",
          },
        ],
      };
      throw error;
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

export interface ILoginParams {
  email: string;
  password: string;
}

export interface ILoginResult {
  token: string;
}

async function postLogin(params: ILoginParams): Promise<ILoginResult> {
  try {
    const data = {
      email: params.email,
      password: params.password,
    };
    const result = await backend.post(`/login`, data, {});
    const token = result.data.data;
    OrangeryToast("Successfully logged in", "success");

    try {
      mixpanel.init(process.env.NEXT_PUBLIC_MIXPANEL_TOKEN || "", {
        debug: process.env.NEXT_PUBLIC_ENV_MODE !== "production",
      });
      const dId = await mixpanel.get_distinct_id();
      try {
        mixpanel.identify(params.email);
      } catch (e) {
        console.log(e);
      }

      // mixpanel.people.set('name', params.first_name + " " + params.last_name)
      // mixpanel.people.set('$first_name', params.first_name)
      // mixpanel.people.set('$last_name', params.last_name)
      // mixpanel.people.set('$name', params.first_name + " " + params.last_name)
      mixpanel.people.set("$email", params.email);
      // mixpanel.people.set('$avatar', CDN_URL + user?.image + '.jpg')
      // mixpanel.people.set('$created', user?.created_date)

      mixpanel.track("Dashboard:Login", {
        current_user_email: params.email,
        // current_user_name: params.first_name + " " + params.last_name,
        // current_user_uuid: "",
        // current_office_name: "",
        // current_office_uuid: "",
        current_service: "dashboard",
      });
    } catch (err: any) {
      console.warn(err?.response?.data?.msg || "error tracking by mixpanel");
    }

    setBackendToken(token);

    return { token };
  } catch (err: any) {
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
        throw error;
      }
      // debugger;
      //TODO handle 400 / 500
      const error: FormError = {
        errors: [
          {
            field: "email",
            error: "bad name",
          },
        ],
      };
      throw error;
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
      throw error;
    } else {
      // debugger;
      //TODO something else
      const error: FormError = {
        errors: [
          {
            field: "",
            error: "Wrong email or password, please try again.",
          },
        ],
      };
      throw error;
    }
  }
}

export function useLoginMutation() {
  return useMutation<ILoginResult, Error, ILoginParams>(postLogin);
}
