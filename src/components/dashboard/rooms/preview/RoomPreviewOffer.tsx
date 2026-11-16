// react & next
import React from "react";

// external dependencies
import { Box, Typography } from "@mui/material";

// orangery elements & internal dependencies
import {
  OrangeryPrice,
  OrangeryText,
  // OrangeryDownloadContractsButton,
  OrangeryUserCircle,
} from "../../../OrangeryElements";

// queries & backend
import { IOffer } from "../../../../queries/tenant";
import { ICustomer } from "../../../../queries/customer";

export default function RoomPreviewOffer({
  offer,
  customer,
}: {
  offer?: IOffer | null;
  customer?: ICustomer | null;
}) {
  return (
    <>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 4,
          justifyContent: "start",
          backgroundColor: "#F8F8F8",
          flexShrink: 0,
          borderRadius: 1,
          p: 2,
          minWidth: 270,
          flexGrow: 1,
          // height: "90%",
          "& .column-align": {
            display: "flex",
            flexDirection: "column",
          },
          "& .first-row": { display: "flex", alignItems: "center", gap: 3 },
          "& .second-row": {
            gap: 1,
            fontSize: 16,
            fontWeight: 700,
          },
        }}
      >
        <Box className="first-row">
          <Box className="column-align">
            <Typography variant="h6">OFFER NAME</Typography>
            <Typography variant="h4">
              <OrangeryText text={offer?.name} limit={20} />
            </Typography>
          </Box>
        </Box>
        <Box className="second-row">
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              gap: 3,
            }}
          >
            <Box className="column-align">
              <Typography variant="h6">PRICE</Typography>
              <Typography variant="h6">
                <OrangeryPrice euro={offer?.price} germanFormat />
                /m
              </Typography>
            </Box>
            <Box className="column-align">
              <Typography variant="h6">SALE PRICE</Typography>
              <Typography variant="h4">
                {offer?.sale_price ? (
                  <>
                    <OrangeryPrice euro={offer?.sale_price} germanFormat />
                    /m
                  </>
                ) : (
                  "-"
                )}
              </Typography>
            </Box>
          </Box>
        </Box>
        <Box className="second-row">
          <Box className="column-align">
            <Typography variant="h6">CONTRACT DATE</Typography>
            <Box sx={{ display: "flex", gap: 1 }}>
              <Typography fontSize={16} fontWeight={700}>
                {offer?.contract_start_date
                  ? new Date(offer?.contract_start_date ?? "").toLocaleString(
                    "de-DE",
                    {
                      month: "long",
                      year: "numeric",
                      day: "numeric",
                    }
                  )
                  : "-"}
              </Typography>
              {offer?.contract_end_date && (
                <>
                  -
                  <Typography fontSize={16} fontWeight={700}>
                    {new Date(offer?.contract_end_date ?? "").toLocaleString(
                      "de-DE",
                      {
                        month: "long",
                        year: "numeric",
                        day: "numeric",
                      }
                    )}
                  </Typography>
                </>
              )}
            </Box>
          </Box>
        </Box>
        {customer && (
          <Box className="second-row">
            <Box className="column-align">
              <Typography variant="h6">CUSTOMER</Typography>
              <Box sx={{ display: "flex", gap: 0.5, alignItems: "center" }}>
                <OrangeryUserCircle
                  name={
                    customer.name ??
                    customer.first_name + " " + customer.last_name
                  }
                  fileName={customer?.image ?? ""}
                  size={25}
                  noMargin
                />
                <Typography
                  fontSize={16}
                  fontWeight={700}
                  sx={{
                    wordBreak: "break-all",
                  }}
                >
                  <OrangeryText
                    text={
                      customer.name ??
                      `${customer.first_name} ${customer.last_name}`
                    }
                    limit={20}
                  />
                </Typography>
              </Box>
            </Box>
          </Box>
        )}
        {/* {offer?.documents && offer?.documents?.length > 0 &&
          <Box
            sx={{
              mt: "auto"
            }}
          >
            <OrangeryDownloadContractsButton documents={offer?.documents} />
          </Box>
        } */}
      </Box>
    </>
  );
}
