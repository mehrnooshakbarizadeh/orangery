// react & next
import React, { useState } from "react";

// external dependencies
import { Box, Typography } from "@mui/material";

// orangery elements & internal dependencies
import OrangeryUserCircle from "./OrangeryUserCircle";
import { OrangeryText } from ".";

export default function OrangeryUserCard6({
  user,
  size,
  labelsWithEmail,
  labelsWithRole,
}: any) {
  return (
    <Box
      sx={{
        width: "100%",
        display: "flex",
        flexDirection: "row",
        gap: 1,
        alignItems: "center",
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
          ...(labelsWithEmail && labelsWithRole && user.role ? {
            width: `calc(75% - ${size ?? 32}px - 16px)`
          }
            : {}
          ),
          // gap: 0.5,
        }}
      >
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

        {labelsWithEmail
          ? user.email &&
          <Typography
            variant="h6"
            sx={{
              fontSize: 10,
              fontWeight: 500,
              // whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            <OrangeryText text={user.email || "-"} limit={20} />
          </Typography>
          : labelsWithRole && user.role &&
          <Typography
            variant="h6"
            sx={{
              fontSize: 10,
              fontWeight: 500,
              // whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            <OrangeryText text={user.role?.replaceAll("_", " ")?.replace("owner", "super admin") || "-"} limit={20} />
          </Typography>
        }
      </Box>

      {labelsWithEmail && labelsWithRole && user.role &&
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            ml: "auto",
            textAlign: "right",
            width: "25%",
            flexShrink: 0,
            justifyContent: "end"
          }}
        >
          <Box
            sx={{
              py: 0.25,
              px: .75,
              borderRadius: 1,
              backgroundColor: "#F9F9FA",
              width: "fit-content"
            }}
          >
            <Typography
              sx={{
                fontSize: 10,
                fontWeight: 400,
                width: "100%",
                textAlign: "right",
              }}
            >
              {user.role?.replaceAll("_", " ")}
            </Typography>
          </Box>
        </Box>
      }
    </Box >
  );
}