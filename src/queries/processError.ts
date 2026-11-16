import { FormError } from "../states/mobx-form";

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
  