// react & next
import React from "react";

// external dependencies
//

// orangery elements & internal dependencies
import SlackEditButton from "./slack/_connection/SlackEditButton";
import HubSpotEditButton from "./hubSpot/_connection/HubspotEditButton";

// queries & backend
import {
  IApp,
} from "../../../queries/apps";

// icons, images & colors
//

export default function AppEditButton({ app }: { app: IApp }) {
  const [editButton, setEditButton] = React.useState(<></>)

  React.useEffect(() => {
    switch (app.uuid) {
      case "7109f6ae-014b-436b-9fa8-d5c694fd5123": // Slack uuid in staging ////////!!!!!!!!
        setEditButton(
          <SlackEditButton
            slack={app}
          />
        )

        break;

      case "c11073a2-0e6d-486a-97e5-739c1cd34f95": // HubSpot uuid in staging ////////!!!!!!!!
        setEditButton(
          <HubSpotEditButton
            hubspot={app}
          />
        )

        break;

      default:
    }
  }, [app])

  return (
    <>
      {editButton}
    </>
  );
}