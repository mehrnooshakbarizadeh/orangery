// react & next
import { useState } from "react";

// external dependencies
import { Typography, Button } from "@mui/material";

// icons, images & colors
import GoogleIcon from "../../../../assets/svg/apps/googleAdminResources/btn_google.svg";

//Button Style Customized for Google Admin Resource
export default function GoogleButton({
  handleClick,
}: {
  handleClick: (e: any) => void;
}) {
  return (
    <Button
      aria-label="sign in with google"
      onClick={handleClick}
      sx={{
        backgroundColor: "#fff",
        color: "#000",
        gap: "10px",
        py: -2,
      }}
    >
      <GoogleIcon />
      <Typography variant="googleButton">Sign in with Google</Typography>
    </Button>
  );
}
