// 
//

// react & next
import React from "react";
import { useRouter } from "next/router";

// external dependencies
import {
  Box,
  Button,
  CircularProgress,
  InputAdornment,
  TextField,
  Typography
} from "@mui/material";
import { makeAutoObservable } from "mobx";
import { Observer } from "mobx-react-lite";
import moment from "moment";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";

// orangery elements & internal dependencies
import {
  FieldError,
  FormError,
  ValueState,
} from "../../../../states/mobx-form";
import {
  OrangeryNavigationContentLoader,
  OrangeryNavigationPlaceholder,
  OrangeryPrice,
  OrangeryTimeRangeSelector
} from "../../../OrangeryElements";

// queries & backend
import {
  ICube,
  useCubeTimeSlots,
  useCubeTimeSlotsMutation,
} from "../../../../queries/_public/cube";
import { CalendarMonth } from "@mui/icons-material";
import Container from "../container";
import { useQueryClient } from "react-query";

// icons, images & colors
import PlaceholderSvg from "../../../../assets/svg/placeholders/default.svg";

export class CubeDateTimeFormState {
  public id;
  public pickedDate;
  public startIndex;
  public endIndex;

  public error = "";

  constructor(cubeId: string) {
    this.id = new ValueState(cubeId);

    this.pickedDate = new ValueState(new Date());

    this.startIndex = new ValueState<number | undefined>(undefined);
    this.endIndex = new ValueState<number | undefined>(undefined);

    makeAutoObservable(this);
  }

  get data() {
    return {
      id: this.id.value,
    };
  }

  clearErrors() {
    this.id.clearError();
    this.pickedDate.clearError();
    this.startIndex.clearError();
    this.endIndex.clearError();

    this.error = "";
  }

  validate() {
    let valid = true;
    this.clearErrors();
    if (!this.pickedDate.value) {
      this.pickedDate.error = "error";
      valid = false;
    }
    if (!this.startIndex.value) {
      this.startIndex.error = "error";
      valid = false;
    }
    if (!this.endIndex.value) {
      this.endIndex.error = "error";
      valid = false;
    }

    return valid;
  }

  setupErrors(err: FormError) {
    this.clearErrors();
    err.errors?.forEach((error) => this.setupError(error));
  }

  setupError(error: FieldError) {
    if (error.field === "") {
      this.error = error.error;
    } else {
      // console.warn(
      //   `the field ${error.field} not found in the field list in DeskForm.`
      // );
    }
  }
}

export default function CubeDateTimeForm({
  cube,
}: {
  cube: ICube;
}) {
  const state = React.useMemo(
    () => new CubeDateTimeFormState(cube.id),
    [cube.id]
  );

  const {
    data: cubeTimeSlots,
    isLoading
  } = useCubeTimeSlots({ id: cube.id, pickedDate: state.pickedDate.value });

  // const cubeTimeSlotsMutations = useCubeTimeSlotsMutation()
  const queryClient = useQueryClient();
  async function updateCubeTimeSlots() {
    // let cubeTimeSlots = await cubeTimeSlotsMutations.mutateAsync({ id: cube.id, pickedDate: state.pickedDate.value });
    // setCubeTimeSlots(cubeTimeSlots);
    queryClient.invalidateQueries(["cubeTimeSlots", cube.id, state.pickedDate.value])
  }
  React.useEffect(() => {
    updateCubeTimeSlots();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  const [pickedDate, setPickedDate] = React.useState<Date | undefined>(undefined)
  React.useEffect(() => {
    updateCubeTimeSlots();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pickedDate])

  const router = useRouter();

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!state.validate()) {
      return;
    }
    try {
      if (cubeTimeSlots)
        router.push(`${process.env.NEXT_PUBLIC_CHECKOUT_URL}/cube/?id=${cube.index
          }&date=${moment(state.pickedDate.value).format("YYYY-MM-DD")
          }&from=${moment(state.pickedDate.value).format("YYYY-MM-DD") + "-" + cubeTimeSlots[state.startIndex.value ?? 0].repr
          }&until=${(
            cubeTimeSlots[state.endIndex.value ?? 0].repr !== "23:30"
              ? moment(state.pickedDate.value).format("YYYY-MM-DD") + "-" + cubeTimeSlots[(state.endIndex.value ?? 0) + 1].repr
              : moment(new Date((state.pickedDate.value).setDate((state.pickedDate.value).getDate() + 1))).format("YYYY-MM-DD") + "-" + "00:00"
          )
          }&start=${cubeTimeSlots[state.startIndex.value ?? 0].repr
          }&end=${state.endIndex.value === cubeTimeSlots.length - 1
            ? "24:00"
            : cubeTimeSlots[(state.endIndex.value ?? 0) + 1].repr
          }&returnUrl=${window.location.href}`
        );
    } catch (err: any) {
      state.setupErrors(err);
    }
  }

  return <Container>
    <Box
      sx={{
        mt: 2
      }}
    >
      <Observer>
        {() => (
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            {/* <CalendarPicker
            date={state.pickedDate.value}
            onChange={(newValue: any) => {
              state.pickedDate.value = newValue;
              updateCubeTimeSlots();
              state.startIndex.value = undefined;
              state.endIndex.value = undefined;
            }}
            minDate={new Date()}
          /> */}
            <DatePicker
              inputFormat="dd.MM.yyyy"
              mask="__.__.____"
              disablePast
              label="BOOKING DATE"
              value={state.pickedDate.value}
              onChange={(newValue: any) => {
                state.pickedDate.value = newValue;
                console.log({ newValue })
                setPickedDate(newValue);
              }}
              renderInput={(props) => <TextField
                {...props}
                sx={{
                  "& .MuiInputBase-input": {
                    pl: 2
                  },
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment
                      position="start"
                      sx={{
                        width: "1.2rem",
                        height: "1.2rem",
                        gap: 0.5,
                        color: "#A5AAB4",
                      }}
                    >
                      <CalendarMonth className="icon" />
                    </InputAdornment>
                  ),
                }}
                fullWidth
              />}
            />
          </LocalizationProvider>
        )}
      </Observer>
    </Box>

    <Typography
      sx={{
        fontSize: 22,
        fontWeight: 700,
        mt: 3,
        ml: .5
      }}
    >
      Pick a time
    </Typography>
    {isLoading
      ? <OrangeryNavigationContentLoader />
      : cubeTimeSlots
        ? <Observer>
          {() => (
            <OrangeryTimeRangeSelector
              error={state.startIndex.error !== "" || state.endIndex.error !== ""}
              setError={(error: boolean) => {
                if (error) {
                  state.startIndex.error = "error";
                  state.endIndex.error = "error";
                } else {
                  state.startIndex.error = "";
                  state.endIndex.error = "";
                }
              }}
              timeSlots={cubeTimeSlots ?? []}
              startIndex={state.startIndex.value}
              setStartIndex={(startIndex: number) => {
                state.startIndex.value = startIndex
              }}
              endIndex={state.endIndex.value}
              setEndIndex={(endIndex: number) => {
                state.endIndex.value = endIndex
              }}
            // onChange={onSelectedHoursChange}
            // selectedDate={new Date(pickedDate)}
            // disabledIntervals={this.state.disabledIntervals}
            />
          )}
        </Observer>
        : <OrangeryNavigationPlaceholder
          vertical
          width={213}
          height={224}
          title={"No time slot is available!"}
          subtitle={""}
          PlaceholderSvg={PlaceholderSvg}
          AddNewButton={<></>}
          addNewButtonText={""}
        />
    }

    <Box
      sx={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        mt: "auto",
        pb: 4
      }}
    >
      <Observer>
        {() => (
          <Typography
            sx={{
              fontSize: 22,
              fontWeight: 700,
            }}
          >
            <OrangeryPrice euro={cube.pricing.price * ((state.endIndex.value ?? 0) - (state.startIndex.value ?? 1) + 1) / 2} />
          </Typography>
        )}
      </Observer>

      <Observer>
        {() => (
          <Button
            variant="contained"
            onClick={onSubmit}
            // color= "primary"
            disabled={!state.endIndex.value || !state.endIndex.value || (state.endIndex.value ?? 0) - (state.startIndex.value ?? 0) < 0 || state.endIndex.error !== "" || state.endIndex.error !== ""}
            sx={{
              fontSize: 19,
              fontWeight: 700,
              height: 61,
              width: 173,
              borderRadius: 999,
              "&:disabled": {
                backgroundColor: "grey",
              },
            }}
          >
            Next
          </Button>
        )}
      </Observer>
    </Box>
  </Container>
}