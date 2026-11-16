// contexts & globals
import { useGlobalState } from "../../../Contexts & Globals/GlobalContext";
import NoSsr from "../../../Contexts & Globals/NoSsr";
import { Gateway } from "../../../Contexts & Globals/Gateway";
import Can, { AbilityContext } from "../../../services/can";
import { buildAbilityFor } from "../../../services/ability";

// react & next
import React from "react";
import { useRouter } from "next/router";
import { useEffect } from "react";

// external dependencies
import { Breadcrumbs } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useCookies } from "react-cookie"

// orangery elements & internal dependencies
import DesktopDrawer from "./DesktopDrawer";
import MobileDrawer from "./MobileDrawer";
import useInterval from "../../../hooks/useInterval"

// queries & backend
import { useUser } from "../../../queries/dashboard";
import { IOffice, useOffice, useOfficesMutation } from "../../../queries/office";
import { IApp, useAppsMutation } from "../../../queries/apps";

export default function Scaffold({
  children: page,
  withoutHeader,
}: {
  children: React.ReactNode
  withoutHeader?: boolean
}) {
  const globalState = useGlobalState();
  const theme = useTheme();
  const small = useMediaQuery(theme.breakpoints.down("sm"));
  const router = useRouter();

  const { data: user } = useUser(globalState.office_uuid);

  const [cookies, setCookie] = useCookies()
  const [role, setRole] = React.useState(cookies.user_role)
  // useEffect(() => {
  //   setRole(localStorage.getItem("user_role") ?? "")
  // }, []);

  useEffect(() => {
    if (user?.group.name) {
      setRole(user?.group.name ?? "")
      // localStorage.setItem("user_role", user?.group.name ?? "")
      setCookie("user_role", user?.group.name)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.group.name]);

  const appsMutation = useAppsMutation();
  useEffect(() => {
    if (user) {
      globalState.setCurrentUser(user);
      updateApps()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  async function updateApps() {
    let apps = [] as IApp[]
    if (user?.group?.name === "owner")  ////////!!!!!!!! should do with roles/can/ability
      apps = await appsMutation.mutateAsync()

    globalState.setApps(apps);
  }

  const { data: office } = useOffice(globalState.office_uuid);
  useEffect(() => {
    if (office)
      globalState.setCurrentOffice(office);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [office]);


  useEffect(() => {
    updateOffices()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const officesMutation = useOfficesMutation();
  async function updateOffices() {
    let offices = [] as IOffice[]
    offices = await officesMutation.mutateAsync()
    globalState.setOffices(offices);
  }



  // const { data: apps } = useApps();
  // useEffect(() => {
  //   globalState.setApps(apps);
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [apps]);

  // const { data: issues } = useIssues();
  // useEffect(() => {
  //   globalState.setIssues(issues);
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [issues]);

  // const [pollingDelay, setPollingDelay] = React.useState(300000);
  // const [isRunning, setIsRunning] = React.useState(true);
  // useInterval(() => {
  //   updateIssues()
  // }, isRunning ? pollingDelay : null);

  // // useEffect(() => {
  // //   pollIssues();
  // //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // // }, []);

  // // async function pollIssues() {
  // //   return setTimeout(() => { updateIssues() }, pollingDelay);
  // // }

  // const issuesMutation = useIssuesMutation();
  // async function updateIssues() {
  //   let issues = await issuesMutation.mutateAsync()
  //   globalState.setIssues(issues);
  // }



  useEffect(() => {
    <Breadcrumbs>
      {/* {globalState.set_current_page_header(router.pathname.slice(11))}; */}
    </Breadcrumbs>;
  }, []);

  return (
    <AbilityContext.Provider value={buildAbilityFor(role)}>
      <NoSsr><Gateway /></NoSsr>

      {globalState.office_uuid
        ? small
          ? <MobileDrawer>
            <Can I="view" a={globalState.currentSubject}>
              {page}
            </Can>
          </MobileDrawer>
          : <DesktopDrawer withoutHeader={withoutHeader}>
            <Can I="view" a={globalState.currentSubject}>
              {page}
            </Can>
          </DesktopDrawer>
        : <></>
      }
    </AbilityContext.Provider>
  );
}
