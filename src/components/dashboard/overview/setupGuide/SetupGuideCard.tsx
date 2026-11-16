// react & next
import { useState } from "react";

// external dependencies
import { Box, Typography, Link } from "@mui/material";

// orangery elements & internal dependencies

// import ParkingSpotForm from "./ParkingSpotForm";

// icons, images & colors
import ArrowRightIcon from "../../../../assets/svg/arrow-right.svg";

export default function SetupGuideCard({
  cardNumber,
  title,
  description,
  formLink,
}: {
  cardNumber: string;
  title: string;
  description: string;
  formLink: React.ReactElement[] | React.ReactElement;
}) {
  return (
    <Box
      sx={{
        borderRadius: "19px",
        border: "0.96509px solid #D7D7D7",
        display: "flex",
        flexDirection: "column",
        p: 2.5,
        backgroundColor: "#fff",
        height: "100%",
      }}
    >
      <Typography sx={{ fontSize: "46px", fontWeight: 600 }}>
        {cardNumber}
      </Typography>
      <Typography sx={{ fontSize: "23px", fontWeight: 600, mb: 1 }}>
        {title}
      </Typography>
      <Typography sx={{ fontSize: "16px", fontWeight: 400, mb: 3 }}>
        {description}
      </Typography>
      {formLink}
    </Box>
  );
}

export function LinkButton({
  icon,
  linkText,
  withArrow,
  clickHandler,
  sx,
  disabled,
  ...props
}: {
  icon: any;
  linkText?: string;
  withArrow?: boolean;
  disabled?: boolean;
  clickHandler: () => void;
  sx?: any;
}) {
  return (
    <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
      <Box sx={{ height: 20, width: 20 }}>{icon}</Box>
      <Link
        disabled={disabled}
        component="button"
        underline="none"
        sx={{
          ...sx,
          fontSize: "16px",
          fontWeight: 400,
          ml: 1,
        }}
        onClick={clickHandler}
        {...props}
      >
        {linkText} {withArrow && <ArrowRightIcon style={{ width: 10 }} />}
      </Link>
    </Box>
  );
}
