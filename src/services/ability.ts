// contexts & globals
import { useGlobalState } from "../Contexts & Globals/GlobalContext";

// external dependencies
import { AbilityBuilder, Ability, AbilityClass } from "@casl/ability";
import { useLocations } from "../queries/location";
import { useDashboard } from "../queries/dashboard";

type Actions = "manage" | "create" | "update" | "delete" | "view";
export type ISubject =
  | "DashboardMenu"
  | "OsMap"
  | "ParkingSpotMenu"
  | "DesksMenu"
  | "FloorsMenu"
  | "MeetingRoomsMenu"
  | "InventoryMenu"
  | "UserConsoleMenu"
  | "UserConsoleEmployeeSubMenu"
  | "Customer"
  | "UserConsoleVisitorsSubMenu"
  | "TenantsMenu"
  | "MyContractMenu"
  | "DeliveriesMenu"
  | "Apps"
  | "AppsSaltoKs"
  | "AppsOsAnalytics"
  | "LocationMenu"
  | "AddNewLocationButton"
  | "DashboardOverview"
  | "DashboardEmployeesList"
  | "DashboardFinancialReport"
  | "DashboardHelpDesk"
  | "DashboardPayments"
  | "DashboardReports"
  | "DashboardPresentAtOffice"
  | "SettingsMenu"
  | "OfficeSettings"
  | "EmailSettings"
  | "Media"
  | "Reports"
  | "Room"
  | "HelpDesk"
  | "WhatAreRolesButton"
  | "Schedule"
  | "Profile"
  | "Logout"
  | "SetupGuide"
  | "EventsMenu"
  | "ContentManagementMenu"
  | "AutomationsMenu"
  | "PaymentMenu"
  | "AddNewInvoiceButton"
  | "OrganizerEventsMenu"
  | "all"
  | "null";

export type AppAbility = Ability<[Actions, ISubject]>;
export const appAbility = Ability as AbilityClass<AppAbility>;

export default function DefineRulesFor(role: string) {
  const { can, cannot, rules } = new AbilityBuilder(appAbility);
  const globalState = useGlobalState();
  const { data: dashboard } = useDashboard(globalState.office_uuid);
  const { data: locations } = useLocations(globalState.office_uuid);
  const locationsOrangery = locations?.map((l) => l) || [];
  let isOrangeryOffice = !!(locationsOrangery.find(office => office.uuid === globalState.currentOffice?.uuid) || "");


  switch (role) {
    case "employee":
      can("view", "DashboardMenu");
      can("view", "DashboardOverview");
      can("view", "Profile");
      can("view", "Logout");
      can("view", "LocationMenu");
      cannot("view", "DashboardOverview");
      cannot("view", "DashboardHelpDesk");
      cannot("view", "DashboardFinancialReport");
      cannot("view", "DashboardPayments");
      cannot("view", "DashboardEmployeesList");
      cannot("view", "DashboardReports");
      cannot("view", "DashboardPresentAtOffice");
      if (dashboard?.is_organizer) can("view", "OrganizerEventsMenu");
      break;

    case "finance_admin":
      can("view", "DashboardMenu");

      can("view", "PaymentMenu");
      if (!globalState.currentOffice?.is_customer) can("view", "AddNewInvoiceButton");

      if (!globalState.currentOffice?.is_customer) can("view", "TenantsMenu");
      if (!globalState.currentOffice?.is_customer) can("view", "Customer");
      
      can("view", "Room");

      // can("view", "Reports");
      cannot("view", "Reports");

      can("view", "Profile");
      can("view", "Logout");
      can("view", "LocationMenu");
      can("view", "DashboardOverview");
      can("view", "DashboardFinancialReport");
      can("view", "DashboardPayments");
      can("view", "DashboardHelpDesk");
      can("view", "DashboardEmployeesList");
      can("view", "DashboardReports");
      can("view", "DashboardPresentAtOffice");
      break;

    case "security_admin":
      can("view", "DashboardMenu");
      can("view", "UserConsoleMenu");
      can("view", "UserConsoleVisitorsSubMenu");
      can("view", "Profile");
      can("view", "Logout");
      can("view", "LocationMenu");
      can("view", "DashboardOverview");
      can("view", "DashboardReports");
      can("view", "DashboardPresentAtOffice");
      cannot("view", "UserConsoleEmployeeSubMenu");
      cannot("view", "DashboardFinancialReport");
      cannot("view", "DashboardPayments");
      cannot("view", "DashboardHelpDesk");
      break;

    case "warehouse_admin":
      can("view", "DashboardMenu");
      can("view", "UserConsoleMenu");
      can("view", "UserConsoleVisitorsSubMenu");
      can("view", "UserConsoleEmployeeSubMenu");
      can("view", "InventoryMenu");
      can("view", "DeliveriesMenu");
      can("view", "Profile");
      can("view", "Logout");
      can("view", "LocationMenu");
      can("view", "DashboardOverview");
      can("view", "DashboardEmployeesList");
      can("view", "DashboardReports");
      can("view", "DashboardPresentAtOffice");
      cannot("view", "DashboardFinancialReport");
      cannot("view", "DashboardPayments");
      cannot("view", "DashboardHelpDesk");
      break;

    case "front_desk_admin":
      can("view", "DashboardMenu");
      can("view", "UserConsoleMenu");
      can("view", "UserConsoleVisitorsSubMenu");
      can("view", "UserConsoleEmployeeSubMenu");
      can("view", "DeliveriesMenu");
      can("view", "Profile");
      can("view", "Logout");
      can("view", "Schedule");
      can("view", "LocationMenu");
      can("view", "DashboardOverview");
      can("view", "DashboardEmployeesList");
      can("view", "DashboardHelpDesk");
      can("view", "DashboardReports");
      can("view", "DashboardPresentAtOffice");
      cannot("view", "DashboardFinancialReport");
      cannot("view", "DashboardPayments");
      break;

    case "space_admin":
      can("view", "DashboardMenu");
      can("view", "OsMap");
      can("view", "ParkingSpotMenu");
      can("view", "DesksMenu");
      can("view", "FloorsMenu");
      can("view", "MeetingRoomsMenu");

      can("view", "PaymentMenu");
      if (!globalState.currentOffice?.is_customer) can("view", "AddNewInvoiceButton");

      if (!globalState.currentOffice?.is_customer) can("view", "TenantsMenu");
      if (!globalState.currentOffice?.is_customer) can("view", "Customer");

      can("view", "InventoryMenu");
      can("view", "UserConsoleMenu");
      can("view", "DeliveriesMenu");
      can("view", "MyContractMenu");
      can("view", "UserConsoleVisitorsSubMenu");
      can("view", "UserConsoleEmployeeSubMenu");
      can("view", "SettingsMenu");
      can("view", "EmailSettings");
      if (!globalState.currentOffice?.is_customer) can("view", "EventsMenu");
      can("view", "Room");

      // can("view", "Reports");
      cannot("view", "Reports");

      can("view", "Profile");
      can("view", "Logout");
      can("view", "WhatAreRolesButton");
      can("view", "HelpDesk");
      can("view", "Schedule");
      can("view", "LocationMenu");
      can("view", "DashboardOverview");
      can("view", "SetupGuide");
      can("view", "DashboardEmployeesList");
      can("view", "DashboardReports");
      can("view", "DashboardFinancialReport");
      can("view", "DashboardPayments");
      can("view", "DashboardPresentAtOffice");
      can("view", "EventsMenu");
      if (isOrangeryOffice) can("view", "ContentManagementMenu");
      if (globalState.currentOffice?.is_customer) cannot("view", "HelpDesk");
      if (globalState.currentOffice?.is_customer) {
        cannot("view", "DashboardHelpDesk");
      } else {
        can("view", "DashboardHelpDesk");
      }
      break;

    case "owner":
      can("view", "DashboardMenu");
      can("view", "OsMap");
      can("view", "ParkingSpotMenu");
      can("view", "DesksMenu");
      can("view", "FloorsMenu");
      can("view", "MeetingRoomsMenu");
      if (dashboard?.is_organizer) can("view", "OrganizerEventsMenu");

      can("view", "PaymentMenu");
      if (!globalState.currentOffice?.is_customer) can("view", "AddNewInvoiceButton");

      if (!globalState.currentOffice?.is_customer) can("view", "TenantsMenu");

      can("view", "InventoryMenu");
      can("view", "UserConsoleMenu");
      can("view", "DeliveriesMenu");
      can("view", "MyContractMenu");
      can("view", "UserConsoleVisitorsSubMenu");
      can("view", "UserConsoleEmployeeSubMenu");
      can("view", "DashboardOverview");
      can("view", "SetupGuide");
      can("view", "DashboardEmployeesList");
      can("view", "DashboardReports");
      can("view", "DashboardPresentAtOffice");
      can("view", "LocationMenu");
      if (!globalState.currentOffice?.is_customer) can("view", "Customer");
      can("view", "SettingsMenu");
      can("view", "OfficeSettings");
      can("view", "EmailSettings");
      can("view", "Media");
      can("view", "EventsMenu");
      if (isOrangeryOffice) can("view", "ContentManagementMenu");
      if (!globalState.currentOffice?.is_customer) can("view", "EventsMenu");

      // can("view", "Reports");
      cannot("view", "Reports");

      can("view", "Room");
      can("view", "HelpDesk");
      can("view", "Profile");
      can("view", "Logout");
      can("view", "WhatAreRolesButton");
      can("view", "AddNewLocationButton");
      can("view", "DashboardFinancialReport");
      can("view", "DashboardPayments");
      can("view", "DashboardHelpDesk");
      if (!globalState.currentOffice?.is_customer) can("view", "Apps");
      if (globalState.currentOffice?.is_customer) cannot("view", "HelpDesk");
      if (globalState.currentOffice?.is_customer)
        cannot("view", "DashboardHelpDesk");
      if (globalState.currentOffice?.is_customer)
        cannot("view", "DashboardFinancialReport");
      if (
        globalState.apps?.filter(
          (app: any) =>
            app.uuid === "3ab6db63-168b-4745-a757-3e93a9fff0e1" &&
            app.integrated
        ).length
      )
        // SaltoKS uuid in staging ////////!!!!!!!!
        can("view", "AppsSaltoKs"); ////////!!!!!!!!

      if (
        globalState.apps?.filter(
          (app: any) =>
            app.uuid === "9187def5-b0fe-47d4-a190-5b3127073fa3" &&
            app.integrated
        ).length
      )
        // OS Analytics uuid in staging ////////!!!!!!!!
        can("view", "AppsOsAnalytics"); ////////!!!!!!!!

      if (
        globalState.apps?.filter(
          (app: any) =>
            app.uuid === "6cd2af06-4c1e-4e09-9bd3-4c6987a71849" &&
            app.integrated
        ).length
      )
        // Automations uuid in staging ////////!!!!!!!!
        can("view", "AutomationsMenu"); ////////!!!!!!!!

      can("view", "Schedule");

      break;

    default:
      break;
  }

  return rules;
}

export function buildAbilityFor(role: string): AppAbility {
  return new appAbility(DefineRulesFor(role), {
    detectSubjectType: (object) => {
      return object!;
    },
  });
}
