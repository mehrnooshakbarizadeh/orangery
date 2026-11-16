// react & next
import React from "react";

// external dependencies
import { Box, Typography } from "@mui/material";

// queries & backend
import { IOfferResult } from "../../../../../queries/tenant";
import { OrangeryText } from "../../../../OrangeryElements";

export default function PreviewContent({
  offer,
  noQuantity,
}: {
  offer?: IOfferResult;
  noQuantity?: boolean;
}) {
  return (
    <>
      <Box
        sx={{
          "& .first-row": {
            display: "flex",
            flexDirection: "column",
            pb: 2,
          },
          "& .second-row": {
            display: "flex",
            flexDirection: "column",
            pb: 4,
          },
          "& .column-align": {
            display: "flex",
            flexDirection: "column",
            pb: 4,
          },
          "& .content-second-row": { display: "flex", gap: 5 },
        }}
      >
        <Box className="first-row">
          <Typography variant="h6">Offer Name</Typography>
          <Box
            sx={{
              mr: 2,
              width: "100%",
              textAlign: "left",
              maxWidth: "80%",
              // "& .name-long": {
              //   whiteSpace: "nowrap",
              //   overflow: "hidden",
              //   textOverflow: "ellipsis",
              // },
            }}
          >
            <Typography variant="h2">
              <OrangeryText text={offer?.name} limit={30} />
            </Typography>
          </Box>
        </Box>
        <Box className="second-row">
          <Typography variant="h6">DESCRIPTION</Typography>
          <Typography variant="h6">
            {offer?.description ? (
              <OrangeryText text={offer?.description} limit={150} />
            ) : (
              "-"
            )}
          </Typography>
        </Box>
        <Box className="content-second-row">
          {/* <Box className="column-align">
            <Typography variant="h6">Rentable To Another</Typography>
            <Typography variant="h4">Yes</Typography>
          </Box> */}
          <Box className="column-align">
            <Typography variant="h6">PAYMENT METHOD</Typography>
            {offer?.payment_method === "subscription" ? (
              <Typography variant="h4">Subscription</Typography>
            ) : (
              <Typography variant="h4">One Time Payment</Typography>
            )}
          </Box>
          {!noQuantity && (
            <Box className="column-align">
              <Typography variant="h6">QUANTITY</Typography>
              <Typography variant="h4">{offer?.quantity}</Typography>
            </Box>
          )}
        </Box>
      </Box>
    </>
  );
}
