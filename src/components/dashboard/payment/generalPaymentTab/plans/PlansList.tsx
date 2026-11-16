// contexts & globals
import { useGlobalState } from "../../../../../Contexts & Globals/GlobalContext";

// react & next
import React from "react";

// external dependencies
import { Box } from "@mui/material";

// orangery elements & internal dependencies
import PlanCard from "./PlanCard";
import { OrangeryNavigationContentLoader } from "../../../../OrangeryElements";

// queries & backend
import { IPlan, usePlan } from "../../../../../queries/plan";
import {
  IPaymentMethod,
  usePaymentMethod,
} from "../../../../../queries/paymentMethod";

export default function PlansList() {
  const globalState = useGlobalState();
  const { data: plans, isLoading: plansIsLoading } = usePlan();
  const { data: paymentMethod, isLoading: paymentMethodIsLoading } =
    usePaymentMethod();

  return (
    <>
      {plansIsLoading || paymentMethodIsLoading ? (
        <OrangeryNavigationContentLoader />
      ) : plans && Array.isArray(plans) && plans.length > 0 ? (
        <List data={plans} paymentMethod={paymentMethod} />
      ) : (
        "No plan is availabale."
      )}
    </>
  );
}

function List({
  data,
  paymentMethod,
}: {
  data: IPlan[];
  paymentMethod?: IPaymentMethod;
}) {
  const rows = data || [];

  return (
    <Box
      sx={{
        overflowY: "auto",
        borderRadius: 5,
        display: "flex",
        flexDirection: "row",
        "& .MuiBox-root > * + *": { ml: 2 },
      }}
    >
      {rows.map((row: any, index: number) => {
        ////////!!!!!!!!
        return (
          <Plan
            key={row.id?.toString() + index.toString() + ""}
            row={row}
            paymentMethod={paymentMethod}
          />
        );
      })}
    </Box>
  );
}

function Plan({
  row,
  paymentMethod,
}: {
  row: IPlan;
  paymentMethod?: IPaymentMethod;
}) {
  return (
    <>
      <PlanCard plan={row} paymentMethod={paymentMethod} />
    </>
  );
}
