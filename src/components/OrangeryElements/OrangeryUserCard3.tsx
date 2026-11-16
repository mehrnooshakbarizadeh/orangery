// react & next
import NextLink from "next/link";
import React from "react";

// external dependencies
import {
  Box,
  Typography,
  Link as MUILink,
  IconButton
} from "@mui/material";

// orangery elements & internal dependencies
import OrangeryUserCircle from "./OrangeryUserCircle";

// 
import PhoneIcon from "../../assets/svg/dashboard/phone.svg"
import EmailIcon from "../../assets/svg/dashboard/email.svg"
import LinkedInIcon from "../../assets/svg/dashboard/linkedin.svg"

export default function OrangeryUserCard3({
  user,
  size
}: any) {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        gap: 1,
        width: "100%",
        justifyContent: "space-between"
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          gap: 2,
          flex: 1,
          maxWidth: "50%"
        }}
      >
        <OrangeryUserCircle
          key={user?.uuid}
          name={user?.name ? user?.name : user?.first_name + " " + user?.last_name}
          fileName={user?.image}
          size={size ?? 32}
          noMargin
          withCheckinDot
          checkedIn={user.checked_in_at}
        />
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            // gap: 0.5,
          }}
        >
          <Typography
            sx={{
              fontSize: 15,
              fontWeight: 600,
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              maxWidth: 120
            }}
          >
            {user?.name ? user?.name : user?.first_name + " " + user?.last_name}
          </Typography>
          {user.email &&
            <Typography
              sx={{
                fontSize: 10,
                fontWeight: 400,
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
                maxWidth: 120
              }}
            >
              {user.email ?? "-"}
            </Typography>
          }
        </Box>
      </Box>

      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          gap: .5,
          alignItems: "center",
          justifySelf: "end",
          "& .icon": {
            height: 10,
            width: 10
          }
        }}
      >
        <MUILink
          href={user.phone ? `tel:${user.phone}` : ""}
          sx={{
            textDecoration: "none",
            color: "transparent",
            ...(!user.phone ? { pointerEvents: "none" } : {})
          }}
        >
          <IconButton
            disabled={!user.phone}
          >
            <PhoneIcon className="icon" />
          </IconButton>
        </MUILink>

        <MUILink
          href={user.email ? `mailto:${user.email}` : ""}
          sx={{
            textDecoration: "none",
            color: "transparent",
            ...(!user.email ? { pointerEvents: "none" } : {})
          }}
        >
          <IconButton
            disabled={!user.email}
          >
            <EmailIcon className="icon" />
          </IconButton>
        </MUILink>

        <MUILink
          target="_blank"
          href={user.linkedin ? `https://www.linkedin.com/in/${user.linkedin}` : ""}
          sx={{
            textDecoration: "none",
            color: "transparent",
            ...(!user.linkedin ? { pointerEvents: "none" } : {})
          }}
        >
          <IconButton
            disabled={!user.linkedin}
          >
            <LinkedInIcon className="icon" />
          </IconButton>
        </MUILink>
      </Box>
    </Box>
  );
}