import { Box, Button, Typography } from "@mui/material";
import { Observer } from "mobx-react-lite";
import { QuickStartState } from "./HandleFloorView";
import BuildingAnimation from "./BuildingAnimation";
import WelcomeOrangeryAnimation from "./WelcomeOrangeryAnimation";
import QStart from "../../../../assets/svg/qStart.svg";
import Logo from "../../../../assets/svg/logo.svg";
import ArrowLeftIcon from "../../../../assets/svg/arrow-left.svg";
import { useRouter } from "next/router";

export function HandleStateAnimation({ state }: { state: QuickStartState }) {
  return (
    <Observer>
      {() => (
        <Box
          sx={{
            backgroundColor: "#F9D507",
          }}
        >
          {state.welcomeOrangeryState && <WelcomeOrangeryAnimation />}
          {state.createFloorState && (
            <Box sx={{ display: state.buildingState ? "none" : "block" }}>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  position: "relative",
                  height: state.floors.values.length > 0 ? "741px" : "493px",
                  transitionProperty: "height",
                  transition: "800ms",
                  maxHeight: "900px",
                }}
              >
                <Box sx={{ "& .icon": { width: 322 } }}>
                  <QStart className="icon" />
                </Box>

                <Typography
                  fontWeight={800}
                  fontSize={16}
                  sx={{
                    position: "absolute",
                    bottom: "45px",
                    right: "128px",
                    "& .logo": { width: "7.8rem", height: "1.5rem" },
                  }}
                >
                  <Logo className="logo" />
                </Typography>
              </Box>
            </Box>
          )}
          {(state.buildingState || state.errorState) && (
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                height: state.buildingState ? "741px" : "493px",
              }}
            >
              {state.buildingState && <BuildingState state={state} />}
              {state.errorState && <ErrorState state={state} />}
            </Box>
          )}
        </Box>
      )}
    </Observer>
  );
}

function BuildingState({ state }: { state: QuickStartState }) {
  return (
    <>
      <Box sx={{ display: state.errorState ? "none" : "block" }}>
        <BuildingAnimation />
        <Typography
          fontSize={28}
          fontWeight={600}
          sx={{
            position: "absolute",
            bottom: "87px",
          }}
        >
          We are building your office in OS Map ...
        </Typography>
      </Box>
    </>
  );
}

function ErrorState({ state }: { state: QuickStartState }) {
  const handleBack = (e: React.MouseEvent) => {
    e.preventDefault();
    state.setCreateFloorState(true);
    state.setErrorState(false);
    state.setBuildingState(false);
  };

  return (
    <>
      <Typography fontSize={28} fontWeight={800}>
        Oops, something went wrong!
      </Typography>
      <Button
        onClick={handleBack}
        variant="contained"
        color="primary"
        sx={{
          position: "absolute",
          bottom: "44px",
          left: "44px",
          gap: "12px",
          py: "11px",
          pl: "22px",
          pr: "12px",
          "& .plus-icon": { width: "1.1rem", height: "1.1rem" },
        }}
      >
        <ArrowLeftIcon className="plus-icon" />
        <Typography className="add-btn">Go Back</Typography>
      </Button>
    </>
  );
}
