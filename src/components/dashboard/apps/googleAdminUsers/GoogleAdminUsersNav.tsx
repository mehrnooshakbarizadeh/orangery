// contexts & globals
import { useGlobalState } from "../../../../Contexts & Globals/GlobalContext";

// react & next
import React, { useEffect } from "react";

// external dependencies
import { Box, Fade, IconButton, Tooltip, Typography } from "@mui/material";
// orangery elements & internal dependencies

// queries & backend
//SVG
import GoogleAdminLogo from "../../../../assets/svg/apps/googleAdminResources/googleAdminLogo.svg";

export default function GoogleAdminUsersNav() {
  const globalState = useGlobalState();

  const [selectedOfficeUuid, setSelectedOfficeUuid] = React.useState<string>(
    globalState.office_uuid
  );

  return (
    <Box
      sx={{
        backgroundColor: "#fff",
        display: "flex",
        flexDirection: "column",
        justifyContent: "start",
        height: "100%",
        // minHeight: 666,
        borderRadius: 1.5,
        py: 3,
        px: 2,
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
        }}
      >
        <GoogleAdminLogo />
        <Typography sx={{ ml: 2, fontSize: "26px", fontWeight: 600 }}>
          Google Admin Users
        </Typography>
      </Box>

      <Box
        sx={{
          pr: 1,
          overflowY: "auto",
          display: "flex",
          flexWrap: "wrap",
          alignContent: "flex-start",
          gap: 2.5,
          mt: 3,
          pt: 0.5,
          pb: 0.5,
          pl: 0.5,
          height: `calc(100% - 56px)`,
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
        }}
      ></Box>
    </Box>
  );
}
