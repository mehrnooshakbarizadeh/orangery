// contexts & globals
import { useGlobalState } from "../../Contexts & Globals/GlobalContext";

// react & next
import React from "react";

// external dependencies
import { Box, Button, Typography } from "@mui/material";

// icons, images & colors
import Grid4 from "../../assets/svg/grid4.svg";

export default function OrangeryDownloadQRCodeButton() {
  const globalState = useGlobalState();
  const office = globalState.currentOffice;

  function handleDownloadQRCode() {
    window.open(
      `${process.env.NEXT_PUBLIC_CDN_URL}/${office?.qr_code}.jpg`,
      "_blank"
    );
  }

  return (
    <>
      {office ? (
        <Button
          variant="contained"
          color="primary"
          onClick={handleDownloadQRCode}
          sx={{
            // width: 170,
            height: 40,
            fontSize: 20,
            color: "#fff",
            display: "flex",
            flexDirection: "row",
          }}
        >
          <Box
            sx={{
              color: "white",
              marginTop: "auto",
              marginBottom: "auto",
              // height: "fit-content",
              height: "100%",
              width: 16,
            }}
          >
            <Grid4 />
          </Box>
          <Typography sx={{ color: "white", pl: 1.5 }}>
            Download your QR
          </Typography>
        </Button>
      ) : (
        <></>
      )}
    </>
  );
}
