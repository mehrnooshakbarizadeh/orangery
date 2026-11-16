// 
//

// react & next
import React from "react";

// external dependencies
import { Box } from "@mui/material";

// orangery elements & internal dependencies
//

// queries & backend
//

// icons, images & colors
//

export default function Container({
  children,
  sx,
}: {
  children: React.ReactNode;
  sx?: any;
}) {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 3,
        px: 3,
        pt: 4,
        pb: 0,
        ...sx
      }}
    >
      {children}
    </Box>
  )
}