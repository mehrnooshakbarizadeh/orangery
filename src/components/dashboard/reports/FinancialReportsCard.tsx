// contexts & globals
import { useGlobalState } from "../../../Contexts & Globals/GlobalContext";

// react & next
import React from "react";
import { useState } from "react";

// orangery elements & internal dependencies
import { OrangeryPrice } from "../../OrangeryElements";

// external dependencies
import {
  Box,
  Button,
  Typography,
  IconButton,
  DialogContent,
  Dialog,
} from "@mui/material";

// icons, images & colors
import EuroIcon from "../../../assets/svg/euro.svg";
import ArrowUpIcon from "../../../assets/svg/arrowUpFull.svg";
import ArrowDownIcon from "../../../assets/svg/arrowDownFull.svg";
import PercentIcon from "../../../assets/svg/percent.svg";

export default function FinancialReportsCard({
  title,
  price,
  percentage,
  hasPercentage,
}: {
  title: string;
  price?: number;
  percentage?: string;
  hasPercentage?: boolean;
}) {
  const globalState = useGlobalState();
  const office = globalState.currentOffice;
  const positiveOrNegative = percentage?.includes("-") ? false : true;
  return (
    <Box
      sx={{
        height: 176,
        width: 500,
        borderRadius: "10px",
        backgroundColor: "#F7F8FA",
        // border: "1px solid #E8E9ED",
        // boxShadow: "0px 10px 25px rgba(0, 0, 0, 0.07)",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-evenly",
        px: 3,
        py: 2,
        m: 2,
      }}
    >
      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
        <Typography
          sx={{
            fontSize: "26px",
            fontWeight: 600,
            color: "#9A9CA0",
            textTransform: "uppercase",
          }}
        >
          {title}
        </Typography>
        {hasPercentage || (
          <Box
            sx={{
              backgroundColor: "#FFF",
              display: "flex",
              borderRadius: "12.3158px",
              width: "fit-content",
              height: 41,
              justifyContent: "space-evenly",
              p: 1,
              // alignItems: "center",
            }}
          >
            <Box sx={{ alignSelf: "baseline", mt: "4px" }}>
              {positiveOrNegative ? (
                <ArrowUpIcon style={{ height: "18px" }} />
              ) : (
                <ArrowDownIcon style={{ height: "20px" }} />
              )}
            </Box>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Typography
                sx={{
                  color: positiveOrNegative ? "#09C176" : "#C10909",
                  fontSize: "22px",
                  fontWeight: 600,
                }}
              >
                {percentage}
              </Typography>
              <Box>
                <PercentIcon
                  style={{
                    height: "15px",
                    marginTop: "10px",
                    marginLeft: "5px",
                    color: positiveOrNegative ? "#09C176" : "#C10909",
                  }}
                />
              </Box>
            </Box>
          </Box>
        )}
      </Box>
      <Box sx={{ display: "flex" }}>
        <Box>
          <EuroIcon />
        </Box>
        <Typography sx={{ fontSize: "64px", fontWeight: 800 }}>
          {/* {price + " €"} */}
          <OrangeryPrice euro={price} germanFormat />
        </Typography>
      </Box>
    </Box>
  );
}
