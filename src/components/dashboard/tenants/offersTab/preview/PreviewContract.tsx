// react & next
import React from "react";

// external dependencies
import { Box, Typography } from "@mui/material";

// orangery elements & internal dependencies
import {
  OrangeryPrice,
  OrangeryDownloadContractsButton,
} from "../../../../OrangeryElements";

// queries & backend
import { IOfferResult } from "../../../../../queries/tenant";

export default function PreviewContract({ offer }: { offer?: IOfferResult }) {
  return (
    <>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 4,
          justifyContent: "center",
          backgroundColor: "#F8F8F8",
          borderRadius: 1,
          p: 2,
          width: "100%",
          height: "90%",
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
        <Box
          sx={{
            mt: "auto",
          }}
        >
          <OrangeryDownloadContractsButton documents={offer?.documents} />
        </Box>
      </Box>
    </>
  );
}
