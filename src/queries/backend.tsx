// external dependencies
import axios from "axios";
// // eslint-disable-next-line @typescript-eslint/no-unused-vars
import AxiosRequestConfig from "axios";

// orangery elements & internal dependencies
import {
  OrangeryToast
} from "../components/OrangeryElements";

declare module "axios" {
  export interface AxiosRequestConfig {
    responseEncoding?: string;
  }
}

const baseURL = process.env.NEXT_PUBLIC_BASE_URL;
const TOKEN_KEY = "__token__";

// console.debug(`using ${baseURL} as base url for backend`);

export const backend = axios.create({
  baseURL,
});

backend.interceptors.response.use(
  (response) => response,
  (error) => {
    // const router = useRouter();
    // whatever you want to do with the error
    if (error.response != undefined) {
      if (error.response.data.msg != undefined) {
        if (error.response.data.error_code !== "48a39" && error.response.data.error_code !== "3464c")
          OrangeryToast(error.response.data.msg, "error");
        if (
          error.response.data.error_code &&
          error.response.data.error_code === "c3959"
        ) {
          // msg: "Bearer Token authentication required"
          // router.push("/auth/login");  ////////!!!!!!!!
          window.location.href = `${process.env.NEXT_PUBLIC_BASE_PATH}/auth/login`;
        }
      }
    }
  }
);

export function setBackendToken(token: string) {
  // console.debug(`using ${token} as authenticator for backend`);
  if (token) {
    backend.defaults.headers.common["Authorization"] = `bearer ${token}`;
  } else {
    backend.defaults.headers.common["Authorization"] = ``;
  }
  localStorage.setItem(TOKEN_KEY, token);
}

function loadToken() {
  if (typeof localStorage === "undefined") return;
  const token = localStorage.getItem(TOKEN_KEY);
  if (token) {
    backend.defaults.headers.common["Authorization"] = `bearer ${token}`;
  }
}
loadToken();

export function hasToken() {
  return !!backend.defaults.headers.common["Authorization"];
}
