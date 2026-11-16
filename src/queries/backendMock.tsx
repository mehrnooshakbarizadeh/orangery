// external dependencies
import axios from "axios";
// // eslint-disable-next-line @typescript-eslint/no-unused-vars
import AxiosRequestConfig from "axios";

// orangery elements & internal dependencies
import { OrangeryToast } from "../components/OrangeryElements";

declare module "axios" {
  export interface AxiosRequestConfig {
    responseEncoding?: string;
  }
}

const baseURL = process.env.NEXT_PUBLIC_BASE_URL_MOCK;
const TOKEN_KEY = "__token__";

// console.debug(`using ${baseURL} as base url for backend`);

export const backendMock = axios.create({
  baseURL,
});

backendMock.interceptors.response.use(
  (response) => response,
  (error) => {
    // const router = useRouter();
    // whatever you want to do with the error
    if (error.response != undefined) {
      if (error.response.data.msg != undefined) {
        OrangeryToast(error.response.data.msg, "error");
        if (
          error.response.data.error_code &&
          error.response.data.error_code === "c3959"
        ) {
          // msg: "Bearer Token authentication required"
          // router.push("/auth/login");  ////////!!!!!!!!
          console.log("here");
          window.location.href = `${process.env.MOCK_NEXT_PUBLIC_BASE_PATH}/auth/login`;
        }
      }
    }
  }
);

export function setBackendToken(token: string) {
  // console.debug(`using ${token} as authenticator for backend`);
  if (token) {
    backendMock.defaults.headers.common["Authorization"] = `bearer ${token}`;
  } else {
    backendMock.defaults.headers.common["Authorization"] = ``;
  }
  localStorage.setItem(TOKEN_KEY, token);
}

function loadToken() {
  if (typeof localStorage === "undefined") return;
  const token = localStorage.getItem(TOKEN_KEY);
  if (token) {
    backendMock.defaults.headers.common["Authorization"] = `bearer ${token}`;
  }
}
loadToken();

export function hasToken() {
  return !!backendMock.defaults.headers.common["Authorization"];
}
