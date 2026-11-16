// contexts & globals
import { useGlobalState } from "../../../../Contexts & Globals/GlobalContext";

// react & next
import React from "react";

// external dependencies
import { Box, Button, Typography } from "@mui/material";

// orangery elements & internal dependencies
import { OrangeryCloseButton } from "../../../OrangeryElements";
//SVG
import WarningIcon from "../../../../assets/svg/apps/googleAdminResources/warning-red.svg";

export default function UserPreviewErrorForm({
  handleClose,
}: {
  handleClose: () => void;
}) {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        height: "100%",
        justifyContent: "space-between",
        width: "100%",
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "justify-between",
          alignItems: "center",
          width: "100%",
          px: 3,
          pb: 3,
          borderBottom: "1px solid #EDEEF0",
        }}
      >
        <Typography
          sx={{
            fontSize: 24,
            fontWeight: 600,
            color: "primary.main",
          }}
        >
          Google Admin Users
        </Typography>
        <OrangeryCloseButton noAbsolute={true} onClose={handleClose} />
      </Box>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          px: 3,
        }}
      >
        <WarningIcon style={{ height: 48, width: 48 }} />
        <Typography
          fontSize={20}
          fontWeight={700}
          sx={{
            color: "#2B2E33",
            textAlign: "center",
            mt: 3,
          }}
        >
          No Google Admin access is available to your account.
        </Typography>
      </Box>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignSelf: "end",
          borderTop: "1px solid #EDEEF0",
          width: "100%",
          px: 3,
        }}
      >
        <Button
          variant="contained"
          sx={{
            backgroundColor: "primary.main",
            color: "#fff",
            fontSize: 18,
            fontWeight: 600,
            alignSelf: "end",
            width: 80,
            height: 55,
            mb: 3,
            mt: 3,
          }}
          onClick={handleClose}
        >
          OK
        </Button>
      </Box>
    </Box>
  );
}
