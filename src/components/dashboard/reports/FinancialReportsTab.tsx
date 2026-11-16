// contexts & globals
import { useGlobalState } from "../../../Contexts & Globals/GlobalContext";

// react & next
import React from "react";

// external dependencies
import { Box, Typography, Grid, Divider, Button } from "@mui/material";

// orangery elements & internal dependencies
import { OrangeryNavigationContentLoader } from "../../OrangeryElements";
import FinancialReportsCard from "./FinancialReportsCard";

// queries & backend
import { useFinancialReports } from "../../../queries/reports";

export default function FinancialReportsTab() {
  const globalState = useGlobalState();
  const {
    data: financialReports,
    isLoading,
    isError,
  } = useFinancialReports(globalState.office_uuid);

  return (
    <>
      {isLoading ? (
        <OrangeryNavigationContentLoader />
      ) : (
        <Box
          sx={{
            width: "100%",
            backgroundColor: "white",
            borderRadius: "12px",
            // boxShadow: { xs: "none", md: "1px 1px 3px #eaeaea" },
            padding: { xs: 0, sm: 2, md: 4 },
            flexGrow: 1,
            display: "flex",
            justifyContent: "center",
          }}
        >
          <Box
            sx={{
              p: 2,
              overflowY: "auto",
              height: "calc(100% - 64px)", ////////!!!!!!!! should revised
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
            {/* <Typography
              color="black"
              fontSize={28}
              fontWeight={700}
              sx={{ flexGrow: 1, mb: 4 }}
            >
              Location Reports
            </Typography> */}

            <Box
              sx={{
                mb: 1,
                mx: "auto",
                my: "auto",
                width: { xs: "100%", sm: "100%", md: "100%", lg: "100%" },
                overflowX: "hidden",
              }}
            >
              <Grid
                container
                spacing={2}
                // sx={{
                //   maxWidth: {
                //     xs: "100",
                //     sm: "100%",
                //     md: "100%",
                //   },
                // }}
              >
                <Grid item xs={12} sm={12} md={6} lg={6}>
                  <Box sx={{ justifyContent: "center", display: "flex" }}>
                    <FinancialReportsCard
                      hasPercentage={true}
                      title={"Total Sales"}
                      price={financialReports?.total_sales}
                    />
                  </Box>
                </Grid>
                <Grid item xs={12} sm={12} md={6} lg={6}>
                  <Box sx={{ justifyContent: "center", display: "flex" }}>
                    <FinancialReportsCard
                      title={"Current Month"}
                      price={financialReports?.current_month.value}
                      percentage={financialReports?.current_month.percentage}
                    />
                  </Box>
                </Grid>
                <Grid item xs={12} sm={12} md={6} lg={6}>
                  <Box sx={{ justifyContent: "center", display: "flex" }}>
                    <FinancialReportsCard
                      title={"Previous Month"}
                      price={financialReports?.previous_month.value}
                      percentage={financialReports?.previous_month.percentage}
                    />
                  </Box>
                </Grid>
                <Grid item xs={12} sm={12} md={6} lg={6}>
                  <Box sx={{ justifyContent: "center", display: "flex" }}>
                    <FinancialReportsCard
                      title={"Last 3 Months"}
                      price={financialReports?.last_three_months.value}
                      percentage={
                        financialReports?.last_three_months.percentage
                      }
                    />
                  </Box>
                </Grid>
              </Grid>
            </Box>
          </Box>
        </Box>
      )}
    </>
  );
}
