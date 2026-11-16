// contexts & globals
import { useGlobalState } from "../../../../../Contexts & Globals/GlobalContext";

// react & next
import React from "react";

// external dependencies
import {
  Box,
  Typography,
  Button,
  Grid
} from "@mui/material";

// orangery elements & internal dependencies
import {
  OrangeryNavigationContentLoader,
  OrangeryUserCard2
} from "../../../../OrangeryElements";

// queries & backend
import {
  IActivityLog,
  useActivityLogs
} from "../../../../../queries/apps/saltoKs";

// icons, images & colors
//

export default function ActivityLogsList() {
  const {
    data: activityLogs,
    isLoading
  } = useActivityLogs();

  return <>
    {isLoading
      ? <OrangeryNavigationContentLoader />
      : activityLogs && activityLogs.length > 0
        ? <Box
          sx={{
            backgroundColor: "#fff",
            display: "flex",
            flexDirection: "column",
            // justifyContent: "start",
            // minHeight: 666,
            borderRadius: 1.5,
            py: 3,
            px: 2,
            height: `calc(100% - 12px)`,
            overflowY: "auto",
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
          <Header />

          {activityLogs.map((activityLog) => {
            return (
              <ActivityLogCard
                key={activityLog.uuid}
                activityLog={activityLog}
              />
            );
          })}
        </Box>
        : "No activity log is available!"
    }
  </>;
}

function ActivityLogCard({ activityLog }: { activityLog: IActivityLog }) {
  return (
    <>
      <Grid
        container
        sx={{
          display: "flex",
          justifyContent: "space-between",
          py: 2.7,
          px: 2.4,
          boxShadow: "1px 1px 8px #0000000a",
          border: "1px solid rgb(210 215 221)",
          alignItems: "center",
          borderRadius: 1.5,
          mb: 1.2,
          mx: 0,
          fontSize: 16,
          fontWeight: 500,
        }}
      >
        <Grid
          xs={6}
          sm={6}
          item
          sx={{
            display: "flex",
            // alignItems: "center",
            gap: 1,
            flexDirection: "column",
          }}
        >
          <Typography variant="h4">{activityLog.message}</Typography>
        </Grid>
        <Grid
          xs={6}
          sm={3}
          item
          sx={{
            display: "flex",
            // alignItems: "center",
            gap: 1,
            flexDirection: "column",
          }}
        >
          <OrangeryUserCard2 user={activityLog.user} />
        </Grid>
        <Grid
          xs={2}
          sm={2}
          item
          sx={{
            display: "flex",
            // alignItems: "center",
            gap: 1,
            flexDirection: "column",
          }}
        >
          {/* <Typography variant="h6">DATE</Typography> */}
          <Typography variant="h4">{new Date(activityLog.created).toLocaleString("de-DE", {
            month: "long",
            year: "numeric",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            hourCycle: "h24",
          })
          }</Typography>
        </Grid>
      </Grid>
    </>
  );
}

function Header({ button }: { button?: JSX.Element }) {
  const [desc, setDesc] = React.useState(false);

  const handleSort = () => {
    setDesc(!desc);
  };
  return (
    <>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "end",
          mb: 2,
          flexFlow: {
            sx: "column",
            sm: "row",
          },
        }}
      >
        <Box
          sx={{ flexGrow: 1, display: "flex", alignItems: "center", gap: 1 }}
        >
          <Box sx={{ minWidth: 300, maxWidth: 400 }}>
            {/* <OrangeryGlobalFilter /> */}
          </Box>
          <Box
          // sx={{
          //   backgroundColor: (theme) => theme.palette.grey[200],
          //   py: 1.3,
          //   px: 1,
          //   borderRadius: 1,
          //   flexShrink: 0,
          //   "& .sort-icon": { width: "1.3rem", color: "grey.A400" },
          //   "& .sort-button": { minWidth: 46 },
          // }}
          >
            {/* <Button onClick={handleSort} className="sort-button">
              {desc ? (
                <ArrowDownAZIcon className="sort-icon" />
              ) : (
                <ArrowUpZAIcon className="sort-icon" />
              )}
            </Button> */}
          </Box>
        </Box>
        <Box
          sx={{
            flexShrink: 0,
            ml: 3,
          }}
        >
          {button}
        </Box>
      </Box>
    </>
  );
}
