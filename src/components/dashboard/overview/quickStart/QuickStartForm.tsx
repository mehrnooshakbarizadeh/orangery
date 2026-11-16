import { Box, Button, Typography } from "@mui/material";
import { Observer } from "mobx-react-lite";
import { useRouter } from "next/router";
import { useEffect } from "react";
import PlusIcon from "../../../../assets/svg/plus.svg";
import ParkingIcon from "../../../../assets/svg/parking.svg";
import { FloorState, QuickStartState } from "./HandleFloorView";
import { usePostWizard } from "../../../../queries/quickStart";
import { OrangeryToast } from "../../../OrangeryElements";
import { QuickItem } from "./QuickItem";
import { Floors } from "./Floors";

export function QuickStartForm({
  handleClose,
  state,
}: {
  state?: QuickStartState;
  handleClose: () => void;
}) {
  useEffect(() => {
    const timerId = setTimeout(() => {
      state?.setWelcomeOrangeryState(false);
      state?.setCreateFloorState(true);
    }, 3000);

    return () => {
      clearTimeout(timerId);
    };
  }, [state?.createFloorState, state?.welcomeOrangeryState]);

  const mutation = usePostWizard();
  const router = useRouter();
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!state?.validate()) {
      return;
    }
    try {
      const data = state.data;
      state.setCreateFloorState(false);
      state.setBuildingState(true);
      if (data) {
        await mutation.mutateAsync(data);
        const timeID = setTimeout(() => {
          state.setBuildingState(false);
          handleClose();
          OrangeryToast("Successfully created ", "success");
          router.push("/dashboard/os-map");
        }, 4000);
        return () => {
          clearTimeout(timeID);
        };
      }
    } catch (err: any) {
      state.setupError(err);
      state.setErrorState(true);
    }
  }

  const handleAddFloor = () => {
    state?.floors.pushElementValue(new FloorState("", 0, 0, 0));
  };

  return (
    <form onSubmit={handleSubmit}>
      <Observer>
        {() => (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              pl: 5,
              py: 5,
              pr: 8,
            }}
          >
            <Box>
              <Typography fontSize={36} fontWeight={600} color={"#0E0F11"}>
                Quick Start
              </Typography>
              <Typography fontSize={16} fontWeight={400} color={"#0E0F11"}>
                Please determine how many of the following items you have in
                your office to start creating your 2D and 3D map.
              </Typography>
            </Box>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "end",
                pt: 5,
                pb: "20px",
              }}
            >
              <Box sx={{ flexGrow: 1 }}>
                <Observer>
                  {() => (
                    <QuickItem
                      sx={{ backgroundColor: "#fff" }}
                      icon={<ParkingIcon />}
                      name="parking spot"
                      value={state?.parking_spots!}
                      onChange={(newValue) => {
                        state?.setParkings(newValue);
                      }}
                    />
                  )}
                </Observer>
              </Box>
              <Button
                onClick={handleAddFloor}
                variant="contained"
                color="primary"
                sx={{
                  gap: "12px",
                  py: "11px",
                  pl: "22px",
                  pr: "12px",
                  "& .plus-icon": { width: "1.1rem", height: "1.1rem" },
                }}
              >
                <PlusIcon className="plus-icon" />
                <Typography className="add-btn">Add Floor</Typography>
              </Button>
            </Box>
            <Observer>
              {() => (
                <>
                  <Box
                    sx={{
                      height:
                        state!.floors.values.length > 0 ? "396px" : "148px",
                      transition: "800ms",
                      display: "flex",
                      flexDirection: "column",
                      gap: 1.5,
                      // overflow: "auto",
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 1.5,
                        height: "333px",
                        width: "100%",
                        overflow: "auto",
                        pr: 2,
                        pt: 2,
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
                      {state?.floors.values.map((floor, index) => (
                        <Floors key={index} state={state} floor={floor.value} />
                      ))}
                    </Box>
                  </Box>
                </>
              )}
            </Observer>

            <Observer>
              {() => (
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                  }}
                >
                  <Button
                    onClick={handleClose}
                    sx={{
                      // position: "absolute",
                      // left: "40px",
                      // bottom: "48px",
                      width: 50,
                      height: 55,
                      fontSize: 18,
                      fontWeight: 600,
                      color: "#000",
                    }}
                  >
                    Skip
                  </Button>
                  <Button
                    variant="contained"
                    type="submit"
                    color="primary"
                    disabled={mutation.isLoading || !state?.isReady()}
                    sx={{
                      // position: "absolute",
                      // right: "428px",
                      // bottom: "48px",
                      width: 144,
                      height: 55,
                      fontSize: 18,
                      fontWeight: 600,
                      color: "#fff",
                      "&.Mui-disabled": { backgroundColor: "#EDEEF0" },
                    }}
                  >
                    CREATE
                  </Button>
                </Box>
              )}
            </Observer>
          </Box>
        )}
      </Observer>
    </form>
  );
}
