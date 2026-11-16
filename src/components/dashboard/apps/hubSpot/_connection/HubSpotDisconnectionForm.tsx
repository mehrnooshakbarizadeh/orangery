// contexts & globals
import { useGlobalState } from "../../../../../Contexts & Globals/GlobalContext";

// react & next
import React from "react";

// external dependencies
import { Box, Button, Typography } from "@mui/material";

// orangery elements & internal dependencies
import {
  OrangeryToast,
  OrangeryCloseButton,
} from "../../../../OrangeryElements";

// queries & backend
import { useAppsMutation } from "../../../../../queries/apps";
import { useDeleteHubSpot } from "../../../../../queries/apps/hubspot";

// icons, images & colors
//

export default function HubSpotDisconnectionForm({
  handleClose,
}: {
  handleClose: () => void;
}) {
  const globalState = useGlobalState();
  const mutation = useDeleteHubSpot();

  const appsMutation = useAppsMutation();

  const handleDelete = async () => {
    await mutation.mutateAsync();
    OrangeryToast("Successfully disconnected!", "warning");

    let apps = await appsMutation.mutateAsync();
    globalState.setApps(apps);

    handleClose();
  };

  return (
    <form
      style={{
        height: "100%",
        width: "100%",
      }}
    >
      <OrangeryCloseButton onClose={handleClose} />
      <Typography
        sx={{
          fontSize: 30,
          fontWeight: 600,
          color: "warning.main",
        }}
      >
        Disconnect Hubspot
      </Typography>
      <Typography
        fontSize={22}
        fontWeight={400}
        color="primary.light"
        sx={{
          textAlign: "center",
          mt: 3,
        }}
      >
        Are you sure to disconnect?
      </Typography>
      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-end",
          gap: 2,
          pt: 4,
          pb: 3,
        }}
      >
        <Button
          variant="contained"
          sx={{
            backgroundColor: "grey.200",
            color: "grey.A200",
            fontSize: 21,
            fontWeight: 400,
            flexGrow: 1,
            width: 170,
            height: 55,
          }}
          onClick={handleClose}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          color="warning"
          onClick={handleDelete}
          disabled={mutation.isLoading}
          sx={{
            fontSize: 21,
            fontWeight: 400,
            flexGrow: 1,
            color: "#fff",
            width: 170,
            height: 55,
          }}
        >
          Yes, disconnect
        </Button>
      </Box>
    </form>
  );
}
