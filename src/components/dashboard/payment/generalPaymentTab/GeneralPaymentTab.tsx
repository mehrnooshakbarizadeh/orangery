// contexts & globals
import { useGlobalState } from "../../../../Contexts & Globals/GlobalContext";

// react & next
import React, { useState } from "react";

// external dependencies
import { Box, Paper, Typography } from "@mui/material";

// orangery elements & internal dependencies
import PaymentMethodsList from "./paymentMethod/PaymentMethodsList";
import PlansList from "./plans/PlansList";
import BillingsList from "./BillingsList";
import {
  OrangeryHorizontalCard,
  OrangeryIconTitle
} from "../../../OrangeryElements"

// icons, images & colors
import PlansIcon from "../../../../assets/svg/payment/Plans.svg";
import BillingHistoryIcon from "../../../../assets/svg/payment/BillingHistory.svg";

export default function GeneralPaymentTab() {
  const globalState = useGlobalState();

  return (
    <>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          "& > * + *": {
            mt: 3
          },
          height: "calc(100% - 12px)",
          overflowY: "auto",
          pr: 1,
          "&::-webkit-scrollbar": {
            width: "0.4em",
            height: "0.4em",
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
            display: "flex",
            flexDirection: "row"
          }}
        >
          <Box
            sx={{
              flexGrow: 1,
              minHeight: "70vh"
            }}
          >
            <Box
              sx={{
                display: "flex",
              }}
            >
              <Box
                sx={{
                  color: "grey.A700",
                  marginTop: 1.2,
                  height: "fit-content",
                }}
              >
                <PlansIcon />
              </Box>
              <Typography
                sx={{
                  fontSize: 28,
                  fontWeight: 700,
                  color: "grey.A700",
                  marginLeft: 1.5,
                  marginBotton: 1
                }}
              >
                Plans
              </Typography>
            </Box>
            <Box
              sx={{
                mt: 2
              }}>
              <PlansList />
            </Box>
          </Box>

          <Box
            sx={{
              width: "content-fit",
              minHeight: "70vh",
              backgroundColor: "#F9F9FA",
              borderRadius: 5,
              px: 3,
              py: 2,
              height: "100%",
              display: "flex",
              flexFlow: "column"
            }}
          >
            <PaymentMethodsList />
          </Box>
        </Box>

        <OrangeryHorizontalCard
          title={<OrangeryIconTitle
            title={"Billing History"}
            icon={<BillingHistoryIcon />}
          />
          }
          rightButton={<></>}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <BillingsList />
          </Box>
        </OrangeryHorizontalCard>
      </Box>
    </>
  );
}