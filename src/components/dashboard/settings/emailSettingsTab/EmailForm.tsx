// contexts & globals
import { useGlobalState } from "../../../../Contexts & Globals/GlobalContext";

// react & next
import React, { useState } from "react";

// external dependencies
import { Box, Typography, Grid, Divider } from "@mui/material";

// orangery elements & internal dependencies
import NotificationEmailForm from "./NotificationEmailForm";
import OfferTemplateForm from "./OfferTemplateForm";
import { OrangeryCircleLoading } from "../../../OrangeryElements";

export default function EmailForm() {
  const globalState = useGlobalState();

  return (
    <>
      <Box
        sx={{
          width: "100%",
          backgroundColor: "white",
          borderRadius: "12px",
          // boxShadow: { xs: "none", md: "1px 1px 3px #eaeaea" },
          padding: { xs: 0, sm: 2, md: 4 },
          flexGrow: 1,
        }}
      >
        <Box
          sx={{
            p: 2,
            overflowY: "auto",
            height: "calc(100% - 12px)",
            "&::-webkit-scrollbar": {
              width: "0.4em",
            },
            "&::-webkit-scrollbar-track": {
              marginLeft: "20px",
            },
            "&::-webkit-scrollbar-thumb": {
              backgroundColor: "rgba(0,0,0,.1)",
              borderRadius: 5,
            },
          }}
        >
          <Box
            sx={{
              mb: 1,
              mx: "auto",
              my: "auto",
              width: { xs: "100%", sm: "100%", md: "100%", lg: "100%" },
              maxWidth: { xs: "100%", sm: "100%", md: "70%", lg: "50%" },
              "& > * + *": {
                mb: 3,
              },
            }}
          >
            <Typography variant="h3" sx={{ mb: 3 }}>
              Offer instructions template
            </Typography>
            <OfferTemplateForm loading={<OrangeryCircleLoading />} />
            <Divider variant="middle" sx={{ margin: "20px auto" }} />
            <Grid container spacing={3} sx={{ minWidth: "100%" }}>
              <Grid item xs={12} sm={12}>
                <Typography variant="h3" sx={{ mb: 3 }}>
                  Specify who should receive an email when an offer purchased
                </Typography>
                <NotificationEmailForm loading={<OrangeryCircleLoading />} />
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Box>
    </>
  );
}
