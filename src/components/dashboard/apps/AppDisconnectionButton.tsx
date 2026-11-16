// react & next
import React from "react";

// external dependencies
//

// orangery elements & internal dependencies
import SlackDisconnectionButton from "./slack/_connection/SlackDisconnectionButton";
import HubSpotDisconnectionButton from "./hubSpot/_connection/HubSpotDisconnectionButton";
import OsAnalyticsDisconnectionButton from "./osAnalytics/_connection/OsAnalyticsDisconnectionButton";
import GoogleAdminDisconnectionButton from "./googleAdminResource/_connection/GoogleAdminDisconnectionButton";
import GoogleAdminUsersDisconnectionButton from "./googleAdminUsers/_connection/GoogleAdminUsersDisconnectionButton";

// queries & backend
import { IApp } from "../../../queries/apps";
import AutomationsDisconnectionButton from "./automations/_connection/AutomationsDisconnectionButton";

// icons, images & colors
//

export default function AppDisconnectionButton({ app }: { app: IApp }) {
  const [disconnectionButton, setDisconnectionButton] = React.useState(<></>);

  React.useEffect(() => {
    switch (app.uuid) {
      case "7109f6ae-014b-436b-9fa8-d5c694fd5123": // Slack uuid in staging ////////!!!!!!!!
        setDisconnectionButton(<SlackDisconnectionButton slack={app} />);

        break;

      case "9187def5-b0fe-47d4-a190-5b3127073fa3": // OS Analytics uuid in staging ////////!!!!!!!!
        setDisconnectionButton(
          <OsAnalyticsDisconnectionButton osAnalytics={app} />
        );

        break;

      case "e77fc557-d50a-407c-8b68-e5ca70a55879": // Google Admin Resources uuid in staging ////////!!!!!!!!
        setDisconnectionButton(
          <GoogleAdminDisconnectionButton googleAdmin={app} />
        );

        break;

      case "2e279a33-f6f8-40bb-892e-6da9a4c471eb": // Google Admin Users uuid in staging ////////!!!!!!!!
        setDisconnectionButton(
          <GoogleAdminUsersDisconnectionButton googleAdminUsers={app} />
        );

        break;

      case "6cd2af06-4c1e-4e09-9bd3-4c6987a71849": // Automations uuid in staging ////////!!!!!!!!
        setDisconnectionButton(
          <AutomationsDisconnectionButton automations={app} />
        );
        break;

      case "c11073a2-0e6d-486a-97e5-739c1cd34f95": // HubSpot uuid in staging ////////!!!!!!!!
        setDisconnectionButton(<HubSpotDisconnectionButton hubSpot={app} />);

        break;

      default:
    }
  }, [app]);

  return <>{disconnectionButton}</>;
}
