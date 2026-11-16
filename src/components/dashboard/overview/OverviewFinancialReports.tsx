// contexts & globals
import { useGlobalState } from "../../../Contexts & Globals/GlobalContext";

// react & next
import React from "react";
import { useRouter } from "next/router";

// external dependencies
import { Box, Typography, Grid, Divider, Button } from "@mui/material";

// orangery elements & internal dependencies
import { OrangeryNavigationContentLoader } from "../../OrangeryElements";
import OverviewFinancialReportsCard from "./OverviewFinancialReportsCard";

// queries & backend
import { useFinancialReports } from "../../../queries/reports";

// icons, images & colors
import ArrowRightIcon from "../../../assets/svg/arrow-right.svg";

export default function OverviewFinancialReports() {
  const globalState = useGlobalState();

  const router = useRouter();

  const {
    data: financialReports,
    isLoading,
    isError,
  } = useFinancialReports(globalState.office_uuid);

  return (
    <Box
      sx={{
        backgroundColor: "#212B45",
        height: "100%",
        borderRadius: 2.5,
        position: "relative",
        overflow: "hidden"
      }}
    >
      <Box
        sx={{
          backgroundColor: "#ffffff1f",
          width: "68%",
          height: "143%",
          borderRadius: 9999,
          position: "absolute",
          top: "50%",
          left: "15%",
          filter: "blur(121px)"
        }}
      />
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          height: "100%",
          width: "100%",
          borderRadius: 2.5,
          gap: 2,
          p: 2,
          position: "absolute",
          top: 0,
          left: 0,
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "end",
          }}
        >
          <Typography
            sx={{
              fontWeight: 600,
              fontSize: 25,
              color: "white",
              flexGrow: 1
            }}
          >
            Financial Reports
          </Typography>
          <Button
            sx={{
              color: "white",
              "& .icon": { width: "1rem", height: "1rem" }
            }}
            onClick={() => {
              router.push("/dashboard/reports/")
            }}
            endIcon={<ArrowRightIcon className="icon" />}
          >
            View All
          </Button>
        </Box>

        <Grid
          container
          sx={{
            p: 0
          }}
        >
          <Grid
            item
            xs={6}
            sx={{
              borderRight: "1px solid #0D1325",
              borderBottom: "1px solid #0D1325"
            }}
          >
            <OverviewFinancialReportsCard
              title={"Total Revenue"}
              price={financialReports?.total_sales}
            />
          </Grid>
          <Grid
            item
            xs={6}
            sx={{
              borderBottom: "1px solid #0D1325"
            }}
          >
            <OverviewFinancialReportsCard
              title={"Current Month"}
              price={financialReports?.current_month.value}
              percentage={financialReports?.current_month.percentage}
            />
          </Grid>

          <Grid
            item
            xs={6}
            sx={{
              borderRight: "1px solid #0D1325",
            }}
          >
            <OverviewFinancialReportsCard
              title={"Previous Month"}
              price={financialReports?.previous_month.value}
              percentage={financialReports?.previous_month.percentage}
            />
          </Grid>
          <Grid
            item
            xs={6}
            sx={{
            }}
          >
            <OverviewFinancialReportsCard
              title={"Last 3 Months"}
              price={financialReports?.last_three_months?.value ?? 0}
              percentage={financialReports?.last_three_months?.percentage ?? "0"}
            />
          </Grid>
        </Grid>
      </Box>
    </Box>
  )
}