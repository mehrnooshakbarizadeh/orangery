// contexts & globals
import { useGlobalState } from "../../../Contexts & Globals/GlobalContext";

// react & next
import React from "react";

// orangery elements & internal dependencies
import { OrangeryPrice } from "../../OrangeryElements";

// external dependencies
import {
  Box,
  Typography,
} from "@mui/material";

// icons, images & colors
import EuroIcon from "../../../assets/svg/euro.svg";
import ArrowUpIcon from "../../../assets/svg/arrowUpFull.svg";
import ArrowDownIcon from "../../../assets/svg/arrowDownFull.svg";
import PercentIcon from "../../../assets/svg/percent.svg";

export default function OverviewFinancialReportsCard({
  title,
  price,
  percentage,
}: {
  title: string;
  price?: number;
  percentage?: string;
}) {
  const positiveOrNegative = percentage?.includes("-") ? false : true;

  return (
    <Box
      sx={{
        // height: 176,
        // width: 412,
        // border: "1px solid #E8E9ED",
        // boxShadow: "0px 10px 25px rgba(0, 0, 0, 0.07)",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-evenly",
        px: 2,
        py: 2,
        flexGrow: 1,
        flexShrink: 0
      }}
    >
      <Typography
        sx={{
          fontSize: "19px",
          fontWeight: 400,
          color: "white",
        }}
      >
        {title}
      </Typography>
      <Box sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center"
      }}>
        <Box
          sx={{
            display: "flex",
            color: "white"
          }}
        >
          <Typography
            sx={{
              fontSize: 28,
              fontWeight: 700
            }}
          >
            {/* {price + " €"} */}
            <OrangeryPrice euro={price} germanFormat />
          </Typography>
        </Box>
        {percentage !== undefined && percentage !== "" && (
          <Box
            sx={{
              backgroundColor: "#FFF",
              display: "flex",
              alignItems: "center",
              borderRadius: 99999,
              pl: .75,
              pr: .5,
              py: 0.25,
              height: "fit-content"
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Typography
                sx={{
                  color: positiveOrNegative ? "#09C176" : "#C10909",
                  fontSize: 14,
                  fontWeight: 400,
                }}
              >
                {percentage}
              </Typography>
              <Box>
                <PercentIcon
                  style={{
                    height: 10,
                    color: positiveOrNegative ? "#09C176" : "#C10909",
                  }}
                />
              </Box>
            </Box>
            {positiveOrNegative ? (
              <ArrowUpIcon style={{ height: 10 }} />
            ) : (
              <ArrowDownIcon style={{ height: 10 }} />
            )}
          </Box>
        )}
      </Box>
    </Box>
  );
}
