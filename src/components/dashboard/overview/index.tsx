//React and Next
import { useEffect } from "react";
// contexts & globals
import { useGlobalState } from "../../../Contexts & Globals/GlobalContext";
import Can from "../../../services/can";
// external dependencies
import { Box, Grid, Typography } from "@mui/material";

// orangery elements & internal dependencies
import OverviewTenantPaymentsList from "./OverviewTenantPaymentsList";
import OverviewFinancialReports from "./OverviewFinancialReports";
import OverviewPresentAtOfficeList from "./OverviewPresentAtOfficeList";
import OverviewIssuesList from "./OverviewIssuesList";
import OverviewReports from "./OverviewReports";

import SetupGuideNav from "./setupGuide/SetupGuideNav";
//
import EmptyStateIcon from "../../../assets/svg/offer-empty-state.svg";
import { useDashboard } from "../../../queries/dashboard";
import { Observer } from "mobx-react-lite";
import QuickstartDialog from "./quickStart/QuickstartDialog";

export default function OverviewNav() {
  const globalState = useGlobalState();
  // const user = globalState.currentUser;
  const { data: dashboard } = useDashboard(globalState.office_uuid);
  const isQuick = dashboard?.display_quick_start;
  const isQuickTrue = isQuick ? true : false;

  const {
    currentUser: user,
    firstView,
    currentOffice,
    office_uuid,
    showSetupGuide,
    setShowSetupGuide,
  } = useGlobalState();
  const { data, isLoading } = useDashboard(office_uuid);

  useEffect(() => {
    if (
      data?.number_of_employees &&
      data?.number_of_employees > 6 &&
      data?.has_visitors &&
      data?.has_delivery_areas &&
      data?.has_assets
    ) {
      setShowSetupGuide(false);
    } else {
      setShowSetupGuide(true);
    }
  }, [data]);

  return (
    <>
      <Observer>
        {() => <QuickstartDialog isQuickTrue={isQuickTrue} />}
      </Observer>

      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          height: "100%",
          overflowY: firstView ? "auto" : "hidden",
          "&::-webkit-scrollbar": {
            width: "0.3em",
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
        {firstView && (
          <Can I="view" a="SetupGuide">
            <SetupGuideNav data={data} />
          </Can>
        )}
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            height: "100%",
          }}
        >
          {user?.group?.name === "employee" ? (
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                flexGrow: 1,
                mb: 15,
              }}
            >
              <EmptyStateIcon />
              <Typography sx={{ mt: 5, fontSize: 22, fontWeight: 600 }}>
                No data is available
              </Typography>
            </Box>
          ) : (
            <>
              <Grid
                container
                sx={{
                  height: 300,
                  overflowY: "hidden",
                  display:
                    user?.group?.name === "front_desk_admin" ||
                    user?.group?.name === "security_admin" ||
                    user?.group?.name === "warehouse_admin"
                      ? "none"
                      : "flex",
                }}
              >
                <Can I="view" a="DashboardPayments">
                  <Grid
                    item
                    xs={12}
                    sm={currentOffice?.is_customer ? 12 : 6}
                    sx={{
                      height: "100%",
                      pr: {
                        xs: 0,
                        sm: 1,
                      },
                    }}
                  >
                    <OverviewTenantPaymentsList />
                  </Grid>
                </Can>
                <Can I="view" a="DashboardFinancialReport">
                  <Grid
                    item
                    xs={12}
                    sm={6}
                    sx={{
                      height: "100%",
                      pl: {
                        xs: 0,
                        sm: 1,
                      },
                    }}
                  >
                    <OverviewFinancialReports />
                  </Grid>
                </Can>
              </Grid>

              <Grid
                container
                sx={{
                  mt: 2,
                  height:
                    user?.group?.name === "front_desk_admin" ||
                    user?.group?.name === "security_admin" ||
                    user?.group?.name === "warehouse_admin"
                      ? "100%"
                      : "calc(100% - 320px)",
                  overflowY: "hidden",
                }}
              >
                <Can I="view" a="DashboardPresentAtOffice">
                  <Grid
                    item
                    xs={12}
                    sm={
                      user?.group?.name === "front_desk_admin" ||
                      user?.group?.name === "security_admin" ||
                      user?.group?.name === "warehouse_admin" ||
                      currentOffice?.is_customer
                        ? 4
                        : 3
                    }
                    sx={{
                      height: "100%",
                      pr: {
                        xs: 0,
                        sm: 1,
                      },
                    }}
                  >
                    <OverviewPresentAtOfficeList />
                  </Grid>
                </Can>
                <Can I="view" a="DashboardHelpDesk">
                  <Grid
                    item
                    xs={12}
                    sm={user?.group?.name === "front_desk_admin" ? 4 : 3}
                    sx={{
                      height: "100%",
                      pl: {
                        xs: 0,
                        sm: 1,
                      },
                      pr: {
                        xs: 0,
                        sm: 1,
                      },
                    }}
                  >
                    <OverviewIssuesList />
                  </Grid>
                </Can>
                <Can I="view" a="DashboardReports">
                  <Grid
                    item
                    xs={12}
                    sm={
                      user?.group?.name === "front_desk_admin"
                        ? 4
                        : currentOffice?.is_customer ||
                          user?.group?.name === "security_admin" ||
                          user?.group?.name === "warehouse_admin"
                        ? 8
                        : 6
                    }
                    sx={{
                      height: "100%",
                      pl: {
                        xs: 0,
                        sm: 1,
                      },
                    }}
                  >
                    <OverviewReports />
                  </Grid>
                </Can>
              </Grid>
            </>
          )}
        </Box>
      </Box>
    </>
  );
}
