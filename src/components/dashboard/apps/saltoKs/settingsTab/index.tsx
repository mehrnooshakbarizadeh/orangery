// contexts & globals
import { useGlobalState } from "../../../../../Contexts & Globals/GlobalContext";

// react & next
import React from "react";

// external dependencies
import {
  Box,
  Typography,
  Grid
} from "@mui/material";

// orangery elements & internal dependencies
import DisconnectSaltoKsButton from "./DisconnectSaltoKsButton"

// queries & backend
//

// icons, images & colors
//

export default function SettingsTab() {
  return <Box
    sx={{
      backgroundColor: "#fff",
      display: "flex",
      flexDirection: "column",
      // justifyContent: "start",
      height: "100%",
      minHeight: 666,
      borderRadius: 1.5,
      py: 3,
      px: 2,
      "& .scroll-align": {
        "&::-webkit-scrollbar": {
          width: "0.4em",
        },
        "&::-webkit-scrollbar-track": {
          marginLeft: "20px",
        },
        "&::-webkit-scrollbar-thumb": {
          backgroundColor: "rgba(0,0,0,.1)",
          borderRadius: 5,
        },
      },
    }}
  >
    <Grid
      container
      sx={{
        display: "flex",
        justifyContent: "space-between",
        py: 2.7,
        px: 2.4,
        backgroundColor: "#F9F9FA",
        alignItems: "center",
        borderRadius: 1.5,
        mb: 1.2,
        mx: 0,
        fontSize: 16,
        fontWeight: 500,
      }}
    >
      <Grid
        xs={10}
        sm={10}
        md={10}
        item
        sx={{
          display: "flex",
          // alignItems: "center",
          gap: 1,
          flexDirection: "column",
        }}
      >
        <Typography variant="h2">Reset All Settings</Typography>
        <Typography
          variant="h4"
          sx={{
            color: "#ff3d00"
          }}
        >
          By removing SaltoKS connection, the authentication, Door Acceses, all IQs, and Locks will be removed.
        </Typography>
      </Grid>
      <Box
        sx={{
          flex: 1,
          display: {
            xs: "none",
            sm: "flex"
          }
        }}
      />
      <Grid
        item
        xs={2}
        sm={2}
        md={2}
        sx={{
          display: "flex",
          flexDirection: "row",
          flex: "none",
          textAlign: "right",
          justifyContent: "end"
        }}
      >
        <DisconnectSaltoKsButton />
      </Grid>
    </Grid>
  </Box>;
}