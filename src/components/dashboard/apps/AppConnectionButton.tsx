// react & next
import React from "react";

// external dependencies
import { Button, Dialog, DialogContent, Typography } from "@mui/material";

// orangery elements & internal dependencies
import SaltoKsConnectionForm from "./saltoKs/_connection/SaltoKsConnectionForm";
import SlackForm from "./slack/_connection/SlackForm";
import HubSpotConnectionForm from "./hubSpot/_connection/HubSpotConnectionForm";
import OsAnalyticsForm from "./osAnalytics/_connection/OsAnalyticsForm";
import GoogleAdminConnectionForm from "./googleAdminResource/_connection/GoogleAdminConnectionForm";
import GoogleAdminUsersConnectionForm from "./googleAdminUsers/_connection/GoogleAdminUsersConnectionForm";
import GoogleButton from "./googleAdminResource/GoogleButton";
import AutomationsConnectionForm from "./automations/_connection/AutomationsConnectionForm";
// queries & backend
import { IApp } from "../../../queries/apps";

// icons, images & colors


export default function AppConnectionButton({ app }: { app: IApp }) {
  const [connectionForm, setConnectionForm] = React.useState(
    <>No connection implemented yet!</>
  );

  function handleConnectApp(e: any) {
    if (e) e.preventDefault();

    switch (app.uuid) {
      case "3ab6db63-168b-4745-a757-3e93a9fff0e1": // SaltoKS uuid in staging ////////!!!!!!!!
        setConnectionForm(<SaltoKsConnectionForm handleClose={handleClose} />);

        break;

      case "7109f6ae-014b-436b-9fa8-d5c694fd5123": // Slack uuid in staging ////////!!!!!!!!
        setConnectionForm(<SlackForm slack={app} handleClose={handleClose} />);

        break;

      case "9187def5-b0fe-47d4-a190-5b3127073fa3": // OS Analytics uuid in staging ////////!!!!!!!!
        setConnectionForm(<OsAnalyticsForm handleClose={handleClose} />);

        break;

      case "e77fc557-d50a-407c-8b68-e5ca70a55879": // Google Admin Resource uuid in staging ////////!!!!!!!!
        setConnectionForm(
          <GoogleAdminConnectionForm handleClose={handleClose} />
        );

        break;

      case "2e279a33-f6f8-40bb-892e-6da9a4c471eb": // Google Admin Users uuid in staging ////////!!!!!!!!
        setConnectionForm(
          <GoogleAdminUsersConnectionForm handleClose={handleClose} />
        );

        break;

      case "6cd2af06-4c1e-4e09-9bd3-4c6987a71849": // Automations uuid in staging ////////!!!!!!!!
        setConnectionForm(
          <AutomationsConnectionForm handleClose={handleClose} />
        );
        break;

      case "c11073a2-0e6d-486a-97e5-739c1cd34f95": // HubSpot uuid in staging ////////!!!!!!!!
        setConnectionForm(
          <HubSpotConnectionForm hubspot={app} handleClose={handleClose} />
        );

        break;

      default:
    }

    handleOpen();
  }

  const [open, setOpen] = React.useState(false);
  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      {app.uuid === "e77fc557-d50a-407c-8b68-e5ca70a55879" ||
        app.uuid === "2e279a33-f6f8-40bb-892e-6da9a4c471eb" ? (
        <GoogleButton handleClick={handleConnectApp} />
      ) : (
        <Button
          color="primary"
          onClick={handleConnectApp}
          sx={{
            fontSize: 18,
            fontWeight: 600,
            px: 1,
            color: "#074EE8",
            backgroundColor: (theme) => theme.palette.grey[200],
          }}
        >
          CONNECT
        </Button>
      )}

      <Dialog
        open={open}
        onClose={handleClose}
        sx={{
          "& .MuiPaper-root": {
            maxWidth: 900,
            borderRadius: "15px",
          },
        }}
      >
        <DialogContent sx={{ p: 0 }}>{open && connectionForm}</DialogContent>
      </Dialog>
    </>
  );
}
