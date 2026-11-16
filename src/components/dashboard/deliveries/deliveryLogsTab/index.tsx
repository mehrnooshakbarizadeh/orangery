// contexts & globals
import { useGlobalState } from "../../../../Contexts & Globals/GlobalContext";
import theme from "../../../../Contexts & Globals/theme";

// react & next
import React from "react";

// external dependencies
import { Box, Button, Grid, Typography } from "@mui/material";

// orangery elements & internal dependencies
import {
  OrangeryGlobalFilter,
  OrangeryNavigationContentLoader,
  OrangeryNavigationPlaceholder,
  OrangeryText,
} from "../../../OrangeryElements";

// queries & backend
import { IDeliveryLog, useDeliveryLogs } from "../../../../queries/delivery";

// icons, images & colors
import ArrowDownAZIcon from "../../../../assets/svg/arrowDownAZ.svg";
import ArrowUpZAIcon from "../../../../assets/svg/arrowUpZA.svg";
import PlaceholderSvg from "../../../../assets/svg/placeholders/default.svg";

export default function DeliveryLogsTab() {
  const globalState = useGlobalState();
  const {
    data: deliveryLogs,
    isLoading,
    isError,
  } = useDeliveryLogs(globalState.office_uuid);
  return (
    <Box
      sx={{
        height: "100%",
      }}
    >
      {isLoading ? (
        <OrangeryNavigationContentLoader />
      ) : deliveryLogs && deliveryLogs.length > 0 ? (
        <Box
          sx={{
            height: "100%",
            backgroundColor: "#fff",
            display: "flex",
            flexDirection: "column",
            // justifyContent: "start",
            borderRadius: 1.5,
            py: 3,
            px: 2,
          }}
        >
          {/* <Header /> */}
          <Box
            sx={{
              height: "100%",
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
            {deliveryLogs?.map((deliveryLog) => (
              <DeliveriyLogCard
                key={deliveryLog.name + deliveryLog.pickup_at + Math.random()} ////////!!!!!!!!
                deliveryLog={deliveryLog}
              />
            ))}
          </Box>
        </Box>
      ) : (
        <OrangeryNavigationPlaceholder
          title={"No delivery logs!"}
          subtitle={"No delivery log is available."}
          PlaceholderSvg={PlaceholderSvg}
          width={314}
          height={330}
        />
      )}
    </Box>
  );
}

function DeliveriyLogCard({ deliveryLog }: { deliveryLog: IDeliveryLog }) {
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
          rowGap: 1,
          fontSize: 16,
          fontWeight: 500,
        }}
      >
        <Grid xs={4} sm={2} md={1} item>
          {deliveryLog.image ? (
            <Box
              sx={{
                // borderRadius: "50%",
                width: 80,
                height: 80,
                objectFit: "cover",
                borderRadius: 2,
                border: "1px solid rgb(210 215 221)",
              }}
              component={"img"}
              src={
                deliveryLog.has_thumbnail
                  ? `${process.env.NEXT_PUBLIC_CDN_URL}/thumbnail/${deliveryLog.image}.jpg`
                  : `${process.env.NEXT_PUBLIC_CDN_URL}/${deliveryLog.image}.jpg`
              }
              loading={"lazy"}
            />
          ) : (
            <Box
              sx={{
                width: 80,
                height: 80,
                objectFit: "cover",
              }}
              component={"img"}
              src={`${process.env.NEXT_PUBLIC_BASE_PATH}/assets/placeholder/noImage.png`}
              loading={"lazy"}
            />
          )}
        </Grid>
        <Grid
          xs={10}
          sm={10}
          md={3}
          item
          sx={{ display: "flex", flexDirection: "column", gap: 1 }}
        >
          <Typography variant="h6">PACKAGE NAME</Typography>
          <Typography variant="h4">
            <OrangeryText text={deliveryLog.name} limit={30} />
          </Typography>
        </Grid>
        <Grid
          item
          xs={4}
          sm={4}
          md={2}
          sx={{ display: "flex", flexDirection: "column", gap: 1 }}
        >
          <Typography variant="h6">EMPLOYEE NAME</Typography>
          <Typography variant="h4">
            <OrangeryText text={deliveryLog.employee?.name || "-"} limit={20} />
          </Typography>
        </Grid>
        <Grid
          item
          xs={4}
          sm={4}
          md={2}
          sx={{ display: "flex", flexDirection: "column", gap: 1 }}
        >
          <Typography variant="h6">PICKUP TIME</Typography>
          <Typography variant="h4">
            {deliveryLog.pickup_at
              ? new Date(deliveryLog.pickup_at).toLocaleString("de-DE", {
                month: "long",
                year: "numeric",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
                hourCycle: "h24",
              })
              : "Not picked up."}
          </Typography>
        </Grid>
        <Box
          sx={{
            flex: 1,
            display: {
              xs: "none",
              md: "flex",
            },
          }}
        />
        <Grid item xs={3} sm={2} md={2}>
          {deliveryLog.signature ? (
            <Box
              sx={{
                width: "180px",
                height: "80px",
                border: "1px solid gray",
                borderRadius: "8px",
              }}
              component={"img"}
              src={`${process.env.NEXT_PUBLIC_CDN_URL}/${deliveryLog.signature}.jpg`}
              // src={`${process.env.NEXT_PUBLIC_BASE_PATH}/assets/default-signature.png`}
              loading={"lazy"}
              alt={deliveryLog.employee?.name || "-"}
            />
          ) : (
            <Box
              sx={{
                width: "180px",
                height: "80px",
                border: "1px solid gray",
                borderRadius: "8px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Typography variant="h6">Not picked up.</Typography>
            </Box>
          )}
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
            <OrangeryGlobalFilter />
          </Box>
          <Box
            sx={{
              backgroundColor: (theme) => theme.palette.grey[200],
              py: 1.3,
              px: 1,
              borderRadius: 1,
              flexShrink: 0,
              "& .sort-icon": { width: "1.3rem", color: "grey.A400" },
              "& .sort-button": { minWidth: 46 },
            }}
          >
            <Button onClick={handleSort} className="sort-button">
              {desc ? (
                <ArrowDownAZIcon className="sort-icon" />
              ) : (
                <ArrowUpZAIcon className="sort-icon" />
              )}
            </Button>
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
