// react & next
import React, { useState } from "react";

// external dependencies
import {
  Box,
  Fade,
} from "@mui/material";

// orangery elements & internal dependencies
import OrangeryTooltip from "./OrangeryTooltip"

// icons, images & colors
import LayerIcon from "../../assets/svg/layer.svg";
import ArrowRightRegular from "../../assets/svg/arrow-right-regular.svg";

function OrangeryStatusCircle({
  status,
  labels,
  empty,
  small
}: {
  status?: boolean
  labels?: {
    active: string;
    deactive: string;
  };
  empty?: boolean
  small?: boolean
}) {
  return (
    <OrangeryTooltip
      title={!empty
        ? status
          ? (labels?.active ?? "Active")
          : (labels?.deactive ?? "Deactive")
        : ""
      }
      placement="bottom"
      TransitionComponent={Fade}
      TransitionProps={{ timeout: 600 }}
    >
      <Box sx={{
        flex: "none",
        borderRadius: "100%",
        backgroundColor:
          !empty
            ? status
              ? "green"
              : "red"
            : "transparent",
        width: small ? "1rem" : "1.3rem",
        height: small ? "1rem" : "1.3rem",
        mr: "12px"
      }} />
    </OrangeryTooltip>
  );
}

export default OrangeryStatusCircle;
