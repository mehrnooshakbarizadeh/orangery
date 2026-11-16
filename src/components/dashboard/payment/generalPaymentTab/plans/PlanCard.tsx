// react & next
import { useState } from "react";

// external dependencies
import { Box, Paper, Typography, Divider } from "@mui/material";

// orangery elements & internal dependencies
import SubscribePlanButton from "./SubscribePlanButton";
import UnsubscribePlanButton from "./UnsubscribePlanButton";
import { OrangeryPrice } from "../../../../OrangeryElements";

// queries & backend
import { IPlan } from "../../../../../queries/plan";
import { IPaymentMethod } from "../../../../../queries/paymentMethod";

export default function PlanCard({ plan, paymentMethod }: {
  plan: IPlan;
  paymentMethod?: IPaymentMethod
}) {
  return (
    <>
      <Paper
        sx={{
          width: 300,
          "&.MuiPaper-rounded": { borderRadius: 4 },
          boxShadow: "1px 1px 7px #0000002e",
          p: 2,
          minHeight: 400,
          mr: 2,
          my: 2,
          // display: "relative"
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Typography variant="h2">
          {plan.name}
        </Typography>
        <Box
          sx={{
            display: "flex",
            alignItems: "baseline",
            mt: 1
          }}>
          <Typography variant="h1">
            <OrangeryPrice euro={plan.price} germanFormat />
          </Typography>
          <Typography variant="h4">
            {"per User /month"}
          </Typography>
        </Box>
        <Typography sx={{ mt: 1, fontSize: 15, fontWeight: 600, color: "grey.A600" }}>
          {plan.description || "-"}
        </Typography>
        <Divider sx={{ my: 2 }} />
        {plan.features
          ? plan.features.map((feature: string, index: number) => (
            <Typography key={index} sx={{ mt: 1, fontSize: 17, fontWeight: 700, color: "grey.A600" }}>
              {feature}
            </Typography>
          ))
          : ""
        }
        <Box sx={{
          mt: "auto"
        }}>
          <Box sx={{
            mt: 3
          }}>
            {plan.aquired
              ? <UnsubscribePlanButton
                plan={{ uuid: plan.uuid, name: plan.name }}
                onDelete={() => { }}
              />
              : <SubscribePlanButton
                plan={plan}
                paymentMethod={paymentMethod}
              />
            }
          </Box>
        </Box>
      </Paper>
    </>
  );
}
