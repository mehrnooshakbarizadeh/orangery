// contexts & globals
import { useGlobalState } from "./GlobalContext";

// react & next
import { useRouter } from "next/router";
import React from "react";

// queries & backend
import { useOffices } from "../queries/office";
// import { useFloors } from "../../queries/floor";

export function Gateway() {
  const globalState = useGlobalState();
  const router = useRouter();

  // function handleLogout() {
  //   globalState.set_logedIn(false);
  //   localStorage.clear();
  //   // window.location.href = `${process.env.NEXT_PUBLIC_BASE_PATH}/auth/login`;
  // }

  if (router.route.indexOf("/auth/new_password") !== -1
    || router.route.indexOf("/auth/password_reset") !== -1) {
    // handleLogout()
    return <></>
  } else {
    if (globalState.registered)
      return <CompanySelector />
    else
      if (!globalState.logedIn) {
        if (router.route.indexOf("/auth/") === -1
          || router.route.indexOf("/auth/company_information") !== -1) {
          router.push("/auth/login")
        }
        return <></>
      } else {
        return <CompanySelector />
      }
  }

  // || globalState.registered) {
  //   return null;
  // }
}

function CompanySelector() {
  const globalState = useGlobalState();
  const router = useRouter();
  const {
    data: offices,
    isLoading,
    isError
  } = useOffices();

  React.useEffect(() => {
    if (!isLoading)
      if (offices && offices.length > 0) {
        if (localStorage.getItem("current_office_uuid")) {
          if (offices.filter((office) => office.uuid === localStorage.getItem("current_office_uuid")).length > 0)
            globalState.set_office_uuid(localStorage.getItem("current_office_uuid")!);
          else
            globalState.set_office_uuid(offices[0].uuid);
        } else {
          globalState.set_office_uuid(offices[0].uuid);
        }
      }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading, offices])

  if (!isLoading)
    if (offices && offices.length > 0) {
      if (router.route.indexOf("/dashboard") === -1)
        router.replace("/dashboard")
      return <></>
    } else {
      if (router.route.indexOf("/auth/company_information") === -1)
        router.push("/auth/company_information"); ////////!!!!!!!!
      return <></>
    }
  else
    return <></>

  return <></>;
}

// function FloorSelector() {
//   const globalState = useGlobalState();
//   const { data: floor, isLoading, isError } = useFloors(globalState.office_uuid);
//   const router = useRouter();
//   const floorCount = floor?.length ?? 0;
//   useEffect(() => {
//     if (!isLoading && !isError) {
//       globalState.set_registered(true);
//       // if (floorCount === 0) {
//       //   if (router.route.indexOf("/dashboard/floors") === -1) {
//       //     globalState.set_current_page_header("Floors")
//       //     router.replace("/dashboard/floors");
//       //   }
//       // } else {
//       if (router.route.indexOf("/auth/") !== -1) {
//         router.replace("/dashboard");
//       }
//       // }
//     }
//   }, [isLoading, isError, floorCount, router, globalState]);
//   // return <>{isLoading && "loading..."}</>;
//   return <></>;
// }
