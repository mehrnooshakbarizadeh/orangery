// react & next
import React from "react";

// external dependencies
import { Box, IconButton, Typography } from "@mui/material";

export default function OrangeryStatisticBox({
  label,
  icon,
  statistic,
}: {
  label: React.ReactNode;
  icon: React.ReactNode;
  statistic?: number;
}) {
  return (
    <>
      <Box sx={{ display: "flex", flexBasis: "33%", height: "100%" }}>
        <Box
          sx={{
            width: "100%",
            height: "100%",
            backgroundColor: "#2B2E33",
            borderRadius: 3,
          }}
        >
          <Box
            sx={{
              pt: 2,
              display: "flex",
              // gap: 1,
              color: "#fff",
              alignItems: "center",
              justifyContent: "center",
              "& .icon": {
                width: "1.3rem",
                height: "1.3rem",
                color: "#fff",
              },
            }}
          >
            <IconButton>
              <Box className="icon">{icon}</Box>
            </IconButton>
            <Typography variant="h4" color="#fff">
              {label}
            </Typography>
          </Box>
          <Typography
            sx={{
              // px: "100px",
              pt: "10px",
              // pb: "65px",
              height: "212px",
              color: "#F9D507",
              fontSize: "100px",
              fontWeight: 800,
              textAlign: "center",
            }}
          >
            {statistic}
          </Typography>
        </Box>
      </Box>
    </>
  );
}
