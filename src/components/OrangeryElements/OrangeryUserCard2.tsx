// react & next
import React, { useState } from "react";

// external dependencies
import { Box, Typography } from "@mui/material";

// orangery elements & internal dependencies
import OrangeryUserCircle from "./OrangeryUserCircle";
import OrangeryText from "./OrangeryText";

function OrangeryUserCard2({ user, size }: any) {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "row",
        gap: 1,
        alignItems: "center",
        height: size ?? 32,
        overflowY: "hidden",
        flexShrink: 0,
        justifyContent: "start",
        textAlign: "left",
      }}
    >
      {user ? (
        <OrangeryUserCircle
          key={user?.uuid}
          name={
            user?.name ? user?.name : user?.first_name + " " + user?.last_name
          }
          fileName={user?.image}
          size={size ?? 32}
          noMargin
        />
      ) : (
        "-"
      )}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          // gap: 0.5,
        }}
      >
        <Typography
          variant="h4"
          sx={
            {
              // whiteSpace: "nowrap",
              // overflow: "hidden",
              // textOverflow: "ellipsis",
            }
          }
        >
          <OrangeryText
            text={
              user?.name ? user?.name : user?.first_name + " " + user?.last_name
            }
            limit={10}
          />
        </Typography>
        {user.email && (
          <Typography
            variant="h6"
            sx={{
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            <OrangeryText text={user.email ?? "-"} limit={20} />
          </Typography>
        )}
      </Box>
    </Box>
  );
}

export default OrangeryUserCard2;
