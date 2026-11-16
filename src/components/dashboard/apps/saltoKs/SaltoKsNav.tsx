// contexts & globals
//

// react & next
import React from "react";

// external dependencies
//

// orangery elements & internal dependencies
import { OrangeryRoutedTabs } from "../../../OrangeryElements";
// import OrangeryShowQRCodeButton from "../../../OrangeryElements/OrangeryShowQRCodeButton";
import ActivityLogsList from "./activityLogsTab";
import DoorAccessesList from "./doorAccessesTab";
import DoorRequestList from "./doorRequestsTab";
import IqsList from "./iqsTab";
import LocksList from "./locksTab";
import SettingsTab from "./settingsTab";

// queries & backend
//

// icons, images & colors
//

export default function SaltoKsNav() {
  React.useEffect(() => {
    document.querySelector<HTMLInputElement>("main")!.style.backgroundColor =
      "white";
  }, []);

  const tabs = [
    {
      slug: "activity_logs",
      label: "Activity Logs",
      content: <ActivityLogsList />,
    },
    {
      slug: "door_accesses",
      label: "Door Accesses",
      content: <DoorAccessesList />,
    },
    {
      slug: "door_requests",
      label: "Door Requests",
      content: <DoorRequestList />,
    },
    {
      slug: "iqs",
      label: "IQs",
      content: <IqsList />,
    },
    {
      slug: "locks",
      label: "Locks",
      content: <LocksList />,
    },
    {
      slug: "settings",
      label: "Settings",
      content: <SettingsTab />,
    },
    // {
    //   label: "Door requests",
    //   content: <DoorRequestTab />,
    // },
  ];

  return <OrangeryRoutedTabs tabs={tabs} height={"calc(100% - 21px)"} />;
}
