// react & next
import React from "react";

// external dependencies
import InputBase from "@mui/material/InputBase";
import { Box } from "@mui/material";

// icons, images & colors
import SearchIcon from "../../assets/svg/search.svg";

export default function OrangerySearchInput({ fullWidth }: { fullWidth?: boolean }) {
  return (
    <Box
      sx={{
        borderRadius: 2,
        height: 44,
        backgroundColor: "#f4f6f9",
        display: "flex",
        alignItems: "center",
        gap: 3,
        px: 2,
        width: fullWidth ? '100%' : 380,
      }}
    >
      <Box
        sx={{
          width: 16,
          fonrWeight: 700,
          color: (theme) => theme.palette.grey.A400,
        }}
      >
        <SearchIcon />
      </Box>
      <InputBase sx={{ width: "100%" }} placeholder="Search..." />
    </Box>
  );
}
