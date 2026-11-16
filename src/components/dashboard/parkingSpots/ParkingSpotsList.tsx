// contexts & globals
import { useGlobalState } from "../../../Contexts & Globals/GlobalContext";
import theme from "../../../Contexts & Globals/theme";

// react & next
import React from "react";

// external dependencies
import { Box, Grid, Typography } from "@mui/material";
import { useVirtualizer } from "@tanstack/react-virtual";

// orangery elements & internal dependencies
import AddNewParkingSpotButton from "./AddNewParkingSpotButton";
import EditParkingSpotButton from "./EditParkingSpotButton";
import {
  OrangeryGlobalFilter,
  OrangeryNavigationPlaceholder,
  OrangeryReadOnlySwitch,
  OrangeryNavigationContentLoader,
  OrangeryUserCircle,
  OrangeryText,
} from "../../OrangeryElements";
import OrangeryShowQRCodeButton from "../../OrangeryElements/OrangeryShowQRCodeButton";
import OrangeryStatusBadge from "../../OrangeryElements/OrangeryStatusBadge";

// queries & backend
import { IParkingSpot, useParkingSpots } from "../../../queries/parkingSpot";

// icons, images & colors
// import ArrowDownAZIcon from "../../../assets/svg/arrowDownAZ.svg";
// import ArrowUpZAIcon from "../../../assets/svg/arrowUpZA.svg";
import PlaceholderSvg from "../../../assets/svg/placeholders/parking-spot.svg";

export default function ParkingSpotsList() {
  const globalState = useGlobalState();
  const {
    data: parkingSpots,
    isLoading,
    isError,
  } = useParkingSpots(globalState.office_uuid);
  const parentRef = React.useRef<HTMLDivElement>(null);

  // const rowVirtualizer = useVirtualizer({
  //   count: parkingSpots?.length,
  //   getScrollElement: () => parentRef.current,
  //   estimateSize: () => 150,
  //   getItemKey: (index: number) => parkingSpots?.[index].uuid,
  //   overcan: 5,
  // });

  return (
    <>
      {isLoading ? (
        <OrangeryNavigationContentLoader />
      ) : parkingSpots && parkingSpots.length > 0 ? (
        <Box
          sx={{
            backgroundColor: "#fff",
            display: "flex",
            flexDirection: "column",
            // justifyContent: "start",
            minHeight: 666,
            borderRadius: 1.5,
            py: 1,
            px: 2,
            overflowY: "auto", // Make it scroll!
            height: "100%",
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
          <Header button={<AddNewParkingSpotButton />} />

          {/* <div
            ref={parentRef}
            style={{
              height: `calc(100vh - 72px)`,
              overflow: "auto", // Make it scroll!
            }}
            className="scroll-align"
          >
            <div
              style={{
                height: `${rowVirtualizer.getTotalSize()}px`,
                width: "100%",
                position: "relative",
              }}
            > */}
          {/* {rowVirtualizer.getVirtualItems().map((virtualItem: any) => {
                return (
                  <div
                    key={virtualItem.key}
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      width: "100%",
                      height: `${virtualItem.size}px`,
                      transform: `translateY(${virtualItem.start}px)`,
                    }}
                  > */}
          {parkingSpots.map((parkingSpot: IParkingSpot) => {
            return (
              <ParkingSpotCard
                key={parkingSpot.uuid}
                parkingSpot={parkingSpot}
              />
            );
          })}
          {/* </div> */}
          {/* //   );
              // })} */}
          {/* </div>
          </div> */}
        </Box>
      ) : (
        <OrangeryNavigationPlaceholder
          title={"No parking spot!"}
          subtitle={"Assign parking space to your employees and manage them."}
          PlaceholderSvg={PlaceholderSvg}
          AddNewButton={<AddNewParkingSpotButton />}
          addNewButtonText={""}
        />
      )}
    </>
  );
}

function ParkingSpotCard({ parkingSpot }: { parkingSpot: IParkingSpot }) {
  return (
    <>
      <Box
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
          "& .column-align": {
            display: "flex",
            flexDirection: "column",
            gap: 1,
            flexBasis: "20%",
          },
        }}
      >
        <Box
          sx={{
            flexBasis: "30%",
            display: "flex",
            flexDirection: "column",
            gap: 1,
            width: "30%",
          }}
        >
          <Typography variant="h6" color="grey.A200">
            NAME
          </Typography>
          <Typography
            variant="h4"
            sx={{
              // textOverflow: "ellipsis",
              //
              width: {
                xl: "400px",
                lg: "300px",
                md: "200px",
                sm: "100px",
              },
              // overflow: "hidden",
              // whiteSpace: "nowrap",
              // "&:hover": {
              //   overflow: "visible",
              //   whiteSpace: "normal",
              //   height: "auto",
              // },
            }}
          >
            <OrangeryText text={parkingSpot.name} limit={40} />
            {/* {parkingSpot.name} */}
          </Typography>
        </Box>
        <Box
          sx={{
            flexBasis: "30%",
            flexGrow: 3,
            gap: 3,
            display: "flex",
            alignItems: "center",
            width: "30%",
            overflow: "hidden",
          }}
        >
          <Box>
            <Typography variant="h6" color="grey.A200">
              DESCRIPTION
            </Typography>
            <Typography
              variant="h4"
              sx={{
                // wordBreak: "break-word",
                // textOverflow: "ellipsis",
                width: {
                  xl: "800px",
                  lg: "600px",
                  md: "400px",
                  sm: "300px",
                  xs: "200px",
                },
                // overflow: "hidden",
                // whiteSpace: "nowrap",
                // "&:hover": {
                //   overflow: "visible",
                //   whiteSpace: "normal",
                //   height: "auto",
                //   wordBreak: "break-all",
                // },
              }}
            >
              <OrangeryText text={parkingSpot.description || "-"} limit={80} />
              {/* {parkingSpot.description || "-"} */}
            </Typography>
          </Box>
          {/* <Box className="column-align">
            <Typography variant="h6" color="grey.A200">
              ASSIGNED TO
            </Typography>
            <Box
              sx={{
                display: "flex",
              }}
            >
              {parkingSpot.assigned_user ? (
                <OrangeryUserCircle
                  name={
                    parkingSpot.assigned_user.name ??
                    parkingSpot.assigned_user.first_name +
                      " " +
                      parkingSpot.assigned_user.last_name
                  }
                  fileName={
                    typeof parkingSpot.assigned_user?.image === "string"
                      ? parkingSpot.assigned_user?.image
                      : undefined
                  }
                  size={32}
                />
              ) : (
                <Typography variant="h4">-</Typography>
              )}
            </Box>
          </Box> */}
          {/* <Box className="column-align">
            <Typography variant="h6" color="grey.A200">
              BOOKING DATE
            </Typography>
            <Typography variant="h4">
              {parkingSpot.created_date
                ? new Date(parkingSpot.created_date).toLocaleString("de-DE", {
                    month: "long",
                    year: "numeric",
                    day: "numeric",
                  })
                : "-"}
            </Typography>
          </Box> */}
          {/* <Box className="column-align">
            <Typography variant="h6" color="grey.A200">
              BOOKING DATE
            </Typography>
            <Typography variant="h4">
              {parkingSpot.created_date
                ? new Date(parkingSpot.created_date).toLocaleString("de-DE", {
                    hour: "numeric",
                    minute: "numeric",
                    second: "numeric",
                  })
                : "-"}
            </Typography>
          </Box> */}
        </Box>
        <Box>
          {parkingSpot.images?.length ? (
            <Box
              sx={{
                width: "80px",
                height: "80px",
                objectFit: "contain",
              }}
              component={"img"}
              src={`${process.env.NEXT_PUBLIC_CDN_URL}/${parkingSpot.images[0]?.uuid}.jpg`}
              loading={"lazy"}
            />
          ) : (
            <Box
              sx={{
                width: "80px",
                height: "80px",
              }}
              component={"img"}
              src={`${process.env.NEXT_PUBLIC_BASE_PATH}/assets/placeholder/noImage.png`}
              loading={"lazy"}
            />
          )}
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", gap: 3 }}>
          {/* <Box sx={{ flexBasis: "15%" }}>
            <OrangeryStatusBadge status={parkingSpot.status} />
          </Box> */}

          <Grid
            item
            xs={2}
            sm={2}
            md={1}
            sx={{
              display: "flex",
              flexDirection: "row",
              flex: "none",
              textAlign: "right",
            }}
          >
            <OrangeryShowQRCodeButton
              assetType={"parking"}
              uuid={parkingSpot.uuid}
              name={parkingSpot.name}
            />
            <EditParkingSpotButton parkingSpot={parkingSpot} />
          </Grid>
        </Box>
      </Box>
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
