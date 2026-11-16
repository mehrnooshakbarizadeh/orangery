// react & next
import React from "react";

// external dependencies
import { Box, Typography } from "@mui/material";

// orangery elements & internal dependencies
//

export default function OrangeryColorCard({
  color,
  size,
}: any) {
  return (
    <Box
      sx={{
        width: "100%",
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
      }}
    >
      <Typography>
        {color?.name}
      </Typography>

      <Box
        sx={{
          width: size,
          height: size,
          backgroundColor: color?.code,
          borderRadius: 9999,
          ml: "auto"
        }}
      />
    </Box>
  );
}