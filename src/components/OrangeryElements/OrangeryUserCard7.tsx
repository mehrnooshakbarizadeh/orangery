// react & next
import React, { useState } from "react";

// external dependencies
import { Box, IconButton, Typography } from "@mui/material";

// orangery elements & internal dependencies
import OrangeryUserCircle from "./OrangeryUserCircle";
import { OrangeryText } from ".";


// icons, images & colors
import CloseIcon from "@mui/icons-material/Close";

export default function OrangeryUserCard7({
  user,
  onDelete
}: any) {
  return (
    <Box
      sx={{
        width: "100%",
        display: "flex",
        backgroundColor: "#F5F5F5",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        textAlign: "left",
        py: 1,
        px: 1,
        borderRadius: 1
      }}
    >
      <Box
        sx={{
          width: "100%",
          display: "flex",
          backgroundColor: "#F5F5F5",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "start",
          gap: 1,
          textAlign: "left",
        }}
      >
        <OrangeryUserCircle
          key={user?.uuid}
          name={
            user?.name ? user?.name : user?.first_name + " " + user?.last_name
          }
          fileName={user?.image}
          size={32}
          noMargin
        />

        <Typography
          variant="h4"
          sx={{
            fontSize: 13,
            fontWeight: 700,
            // whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          <OrangeryText text={user?.name ?? `${user?.first_name} ${user?.last_name}`} limit={16} />
        </Typography>
      </Box>

      <IconButton
        sx={{
          color: "#55585C",
          ml: "auto",
        }}
        size="small"
        onClick={onDelete}
      >
        <CloseIcon />
      </IconButton>
    </Box>
  );
}