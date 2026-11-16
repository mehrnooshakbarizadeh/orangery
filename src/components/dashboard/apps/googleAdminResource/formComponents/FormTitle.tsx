// react & next
import { useState } from "react";

// external dependencies
import { Box, Typography } from "@mui/material";

// orangery elements & internal dependencies

// queries & backend
//

// icons, images & colors

export default function FormTitle({
  logo,
  title,
}: {
  logo: any;
  title: string;
}) {
  return (
    <>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          mb: 3,
        }}
      >
        <>
          {logo}
          <Typography variant="h2" sx={{ ml: 1.5 }}>
            {title}
          </Typography>
        </>
      </Box>
    </>
  );
}
