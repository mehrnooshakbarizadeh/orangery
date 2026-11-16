// react & next
import React from "react";

// external dependencies
import { Box, Typography } from "@mui/material";

export default function AddNewOfficeButton({
  onClick,
}: {
  onClick?: () => void;
}) {
  const handleClick = () => {
    if (onClick) onClick();
  };

  return (
    <Box
      sx={{
        zIndex: 2,
        height: "53px",
        borderRadius: "0px 0px 15px 15px",
        backgroundColor: "#F7F8FA",
        p: "10px",
        ":hover": {
          cursor: "pointer",
          backgroundColor: "#f3f3f3",
        },
      }}
      onClick={() => {
        handleClick();
      }}
    >
      <Typography
        className={"noselect"}
        sx={{
          color: "#074EE8",
          fontSize: "16px",
          ml: "20px",
          fontWeight: 600,
          mr: "70px",
          pl: "14px",
        }}
      >
        + Add New Location
      </Typography>
    </Box>
  );
}
