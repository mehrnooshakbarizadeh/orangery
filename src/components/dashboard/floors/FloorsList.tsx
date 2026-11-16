// contexts & globals
import { useGlobalState } from "../../../Contexts & Globals/GlobalContext";

// react & next
import React from "react";

// external dependencies
import { Box, Grid, Typography } from "@mui/material";

// orangery elements & internal dependencies
import {
  // OrangeryGlobalFilter,
  OrangeryNavigationPlaceholder,
  OrangeryNavigationContentLoader,
  OrangeryText,
} from "../../OrangeryElements";

// queries & backend
import { IFloor, useFloors } from "../../../queries/floor";

// icons, images & colors
import PlaceholderSvg from "../../../assets/svg/placeholders/floors.svg";
import ArrowDownAZIcon from "../../../assets/svg/arrowDownAZ.svg";
import ArrowUpZAIcon from "../../../assets/svg/arrowUpZA.svg";
// others
import AddNewFloorButton from "./AddNewFloorButton";
import EditFloorButton from "./EditFloorButton";

export default function FloorsList() {
  const globalState = useGlobalState();
  const {
    data: floors,
    isLoading,
    isError,
  } = useFloors(globalState.office_uuid);

  return (
    <>
      {isLoading ? (
        <OrangeryNavigationContentLoader />
      ) : floors && floors.length > 0 ? (
        <Box
          sx={{
            backgroundColor: "#fff",
            display: "flex",
            flexDirection: "column",
            // justifyContent: "start",
            height: "100%",
            minHeight: 666,
            borderRadius: 1.5,
            py: 3,
            px: 2,
            "& .scroll-align": {
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
            },
          }}
        >
          <Header button={<AddNewFloorButton />} />
          <Box
            className="scroll-align"
            sx={{
              height: `calc(100vh - 16px)`,
              overflow: "auto", // Make it scroll!
            }}
          >
            {floors.map((floor) => (
              <FloorCard key={floor.uuid} floor={floor} />
            ))}
          </Box>
        </Box>
      ) : (
        <OrangeryNavigationPlaceholder
          title={"Start by adding some Floors!"}
          subtitle={
            "Add some Floors to build up your workstation and assign them to your employees."
          }
          PlaceholderSvg={PlaceholderSvg}
          AddNewButton={<AddNewFloorButton />}
          addNewButtonText={""}
        />
      )}
    </>
  );
}

function FloorCard({ floor }: { floor: IFloor }) {
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
          sm={10}
          item
          sx={{
            display: "flex",
            // alignItems: "center",
            gap: 1,
            flexDirection: "column",
          }}
        >
          <Typography variant="h6">Floor Name</Typography>
          <Typography variant="h4">
            <OrangeryText text={floor.name} limit={150} />
          </Typography>
        </Grid>
        <Grid item xs={6} sm={1} textAlign={"right"}>
          <EditFloorButton floor={floor} />
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
