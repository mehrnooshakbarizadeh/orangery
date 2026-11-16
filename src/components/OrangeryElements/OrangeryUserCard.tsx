// react & next
import React, { useState } from "react";

// external dependencies
import { Box, Typography } from "@mui/material";

// icons, images & colors
import LayerIcon from "../../assets/svg/layer.svg";
import ArrowRightRegular from "../../assets/svg/arrow-right-regular.svg";
import OrangeryUserCircle from "./OrangeryUserCircle";

function OrangeryUserCard({ user, withName, ref, expanded }: any) {
  return (
    <Box
      // ref={ref}
      sx={{
        textAlign: "center",
        width: expanded ? "100%" : 80,
        display: "flex",
        flexDirection: expanded ? "row" : "column",
        flex: "none",
      }}
    >
      <OrangeryUserCircle
        name={user?.first_name + " " + user?.last_name}
        fileName={
          typeof user?.image === "string" ? user?.image : undefined
        }
        size={35}
        noMargin
      />

      {withName &&
        <Box
          sx={{
            ml: expanded ? 1 : 0,
            my: expanded ? "auto" : "",
            mt: !expanded ? 1 : 0,
            width: !expanded ? "100%" : "fit-content",
            maxHeight: 46
          }}
        >
          <Typography
            sx={{
              fontSize: 14,
              fontWeight: 600,
              lineHeight: "21px",
              color: "#A5AAB4",
              textOverflow: !expanded ? "ellipsis" : "",
              overflow: !expanded ? "hidden" : ""
            }}
          >
            {user.name}
          </Typography>
        </Box>
      }
    </Box>
  );
}

export default OrangeryUserCard;
