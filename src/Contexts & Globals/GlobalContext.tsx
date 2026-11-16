// contexts & globals
// import { ISubject } from "../services/ability";

// react & next
import React, { useContext, useState } from "react";

// queries & backend
import { hasToken, setBackendToken } from "../queries/backend";

interface IGlobalState {
  office_uuid: string;
  set_office_uuid: (value: string) => void;
  floor_uuid: string;
  set_floor_uuid: (value: string) => void;
  logedIn: boolean;
  set_logedIn: (value: boolean) => void;
  registered: boolean;
  set_registered: (value: boolean) => void;
  current_page_header: string;
  set_current_page_header: (value: string) => void;
  currentSubject: any;
  setCurrentSubject: (value: any) => void;
  menu_toggle: boolean;
  set_menu_toggle: (value: boolean) => void;
  currentUser: any;
  setCurrentUser: (value: any) => void;
  apps: any[];
  setApps: (value: any[]) => void;
  currentOffice: any | undefined;
  setCurrentOffice: (value: any) => void;
  offices: any[];
  setOffices: (value: any[]) => void;
  issues: any;
  setIssues: (value: any) => void;
  firstView: boolean;
  setFirstView: (value: boolean) => void;
  showSetupGuide: boolean;
  setShowSetupGuide: (value: boolean) => void;
  showOffersList: boolean;
  setShowOffersList: (value: boolean) => void;
}
export const GlobalStateContext = React.createContext<IGlobalState>({
  office_uuid: "",
  set_office_uuid: () => { },
  floor_uuid: "",
  set_floor_uuid: () => { },
  logedIn: false,
  set_logedIn: () => { },
  registered: false,
  set_registered: () => { },
  current_page_header: "Dashboard",
  set_current_page_header: () => { },
  currentSubject: "DashboardMenu",
  setCurrentSubject: () => { },
  menu_toggle: false,
  set_menu_toggle: () => { },
  currentUser: undefined,
  setCurrentUser: () => { },
  apps: [],
  setApps: () => { },
  currentOffice: undefined,
  setCurrentOffice: () => { },
  offices: [],
  setOffices: () => { },
  issues: undefined,
  setIssues: () => { },
  firstView: true,
  setFirstView: () => { },
  showSetupGuide: false,
  setShowSetupGuide: () => { },
  showOffersList: true,
  setShowOffersList: () => { },
});

export const GlobalStateProvider: React.FC = ({ children }) => {
  const [state, setState] = useState({
    office_uuid: "",
    floor_uuid: "",
    logedIn: hasToken(),
    registered: false,
    current_page_header:
      (typeof window !== "undefined" &&
        window.localStorage.getItem("current_page_header")) ||
      "Dashboard",
    currentSubject:
      (typeof window !== "undefined" &&
        window.localStorage.getItem("currentSubject")) ||
      "DashboardMenu",
    menu_toggle:
      (typeof window !== "undefined" &&
        window.localStorage.getItem("current_drawer_opened") === "true") ||
      false,
    currentUser:
      typeof window !== "undefined"
        ? window.localStorage.getItem("orangery-currentUser") && window.localStorage.getItem("orangery-currentUser") !== "undefined"
          ? JSON.parse(window.localStorage.getItem("orangery-currentUser") ?? "") as any
          : undefined
        : undefined,
    apps:
      typeof window !== "undefined"
        ? window.localStorage.getItem("orangery-apps") && window.localStorage.getItem("orangery-apps") !== "undefined"
          ? JSON.parse(window.localStorage.getItem("orangery-apps") ?? "") as any[]
          : []
        : [],
    currentOffice:
      typeof window !== "undefined"
        ? window.localStorage.getItem("orangery-currentOffice") && window.localStorage.getItem("orangery-currentOffice") !== "undefined"
          ? JSON.parse(window.localStorage.getItem("orangery-currentOffice") ?? "") as any
          : undefined
        : undefined,
    offices:
      typeof window !== "undefined"
        ? window.localStorage.getItem("orangery-offices") && window.localStorage.getItem("orangery-offices") !== "undefined"
          ? JSON.parse(window.localStorage.getItem("orangery-offices") ?? "") as any[]
          : []
        : [],
    issues: [],
    firstView:
      typeof window !== "undefined" &&
        window.localStorage.getItem("firstView") === "false"
        ? false
        : true,
    showSetupGuide:
      typeof window !== "undefined" &&
        window.localStorage.getItem("showSetupGuide") === "true"
        ? true
        : false,
    showOffersList:
      typeof window !== "undefined" &&
        window.localStorage.getItem("orangery-showOffersList") === "false"
        ? false
        : true,
  });

  React.useEffect(() => {
    setState((state) => ({
      ...state,
      menu_toggle:
        localStorage.getItem("current_drawer_opened") === "true",
      currentUser:
        localStorage.getItem("orangery-currentUser") && localStorage.getItem("orangery-currentUser") !== "undefined"
          ? JSON.parse(localStorage.getItem("orangery-currentUser") ?? "") as any
          : undefined,
      apps:
        localStorage.getItem("orangery-apps") && localStorage.getItem("orangery-apps") !== "undefined"
          ? JSON.parse(localStorage.getItem("orangery-apps") ?? "") as any[]
          : [],
      currentOffice:
        localStorage.getItem("orangery-currentOffice") && localStorage.getItem("orangery-currentOffice") !== "undefined"
          ? JSON.parse(localStorage.getItem("orangery-currentOffice") ?? "") as any
          : undefined,
      offices:
        localStorage.getItem("orangery-offices") && localStorage.getItem("orangery-offices") !== "undefined"
          ? JSON.parse(localStorage.getItem("orangery-offices") ?? "") as any[]
          : [],
      current_page_header:
        window.localStorage.getItem("current_page_header") ?? "Dashboard",
      currentSubject:
        window.localStorage.getItem("currentSubject") ?? "DashboardMenu",
      firstView:
        window.localStorage.getItem("firstView") === "false" ? false : true,
      showSetupGuide:
        window.localStorage.getItem("showSetupGuide") === "true" ? true : false,
      showOffersList:
        window.localStorage.getItem("orangery-showOffersList") === "false" ? false : true,
    }));
  }, []);

  const store = React.useMemo(
    () => ({
      ...state,
      set_current_page_header: (value: string) => {
        setState((state) => ({ ...state, current_page_header: value }));
        localStorage.setItem("current_page_header", value.toString());
      },
      setCurrentSubject: (value: any) => {
        setState((state) => ({ ...state, currentSubject: value }));
        localStorage.setItem("currentSubject", value.toString());
      },
      set_office_uuid: (value: string) =>
        setState((state) => ({ ...state, office_uuid: value })),
      set_floor_uuid: (value: string) =>
        setState((state) => ({ ...state, floor_uuid: value })),
      set_logedIn: (value: boolean) => {
        setState((state) => ({ ...state, logedIn: value }));
        if (!value) {
          setBackendToken("");
        }
      },
      set_menu_toggle: (value: boolean) => {
        setState((state) => ({ ...state, menu_toggle: value }));
        localStorage.setItem("current_drawer_opened", value.toString());
      },
      set_registered: (value: boolean) =>
        setState((state) => ({ ...state, registered: value })),
      setCurrentUser: (value: any) => {
        setState((state) => ({ ...state, currentUser: value }))
        localStorage.setItem("orangery-currentUser", JSON.stringify(value));
      },
      setApps: (value: any) => {
        setState((state) => ({ ...state, apps: value }))
        localStorage.setItem("orangery-apps", JSON.stringify(value));
      },
      setCurrentOffice: (value: any | undefined) => {
        setState((state) => ({ ...state, currentOffice: value }))
        localStorage.setItem("orangery-currentOffice", JSON.stringify(value));
      },
      setOffices: (value: any) => {
        setState((state) => ({ ...state, offices: value }))
        localStorage.setItem("orangery-offices", JSON.stringify(value));
      },
      setIssues: (value: any) =>
        setState((state) => ({ ...state, issues: value })),
      setFirstView: (value: boolean) => {
        setState((state) => ({ ...state, firstView: value }));
        localStorage.setItem("firstView", value.toString());
      },
      setShowSetupGuide: (value: boolean) => {
        setState((state) => ({ ...state, showSetupGuide: value }));
        localStorage.setItem("showSetupGuide", value.toString());
      },
      setShowOffersList: (value: boolean) => {
        setState((state) => ({ ...state, showOffersList: value }));
        localStorage.setItem("orangery-showOffersList", value.toString());
      },
    }),
    [state, setState]
  );

  return (
    <GlobalStateContext.Provider value={store}>
      {children}
    </GlobalStateContext.Provider>
  );
};

export const useGlobalState = () => {
  const store = useContext(GlobalStateContext);
  if (!store) {
    // console.warn("no global state");
  }
  return store;
};
