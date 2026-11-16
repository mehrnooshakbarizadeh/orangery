// contexts & globals
import { useGlobalState } from "../../../../../Contexts & Globals/GlobalContext";

// react & next
import React, { useEffect } from "react";

// external dependencies
import { Box, Button, Typography, TextField, InputAdornment, IconButton, Divider, FormControl, Select, MenuItem, FormControlLabel } from "@mui/material";
import { makeAutoObservable } from "mobx";
import { Observer } from "mobx-react-lite";
import NumberFormat from "react-number-format";

// orangery elements & internal dependencies
import { ArrayValueState, FieldError, FormError, ValueState } from "../../../../../states/mobx-form";
import {
  OrangeryToast,
  OrangeryTextField,
  OrangerySwitch,
  OrangeryFloorAutocomplete,
  OrangeryTextAreaField,
  OrangeryFormWrapper,
  OrangeryImagesField,
  OrangeryText,
} from "../../../../OrangeryElements";


// queries & backend


// icons, images & colors
import CapacityIcon from "../../../../assets/svg/capacity.svg";
import MeetingRoomIcon from "../../../../assets/svg/dashboard/newMenuSVGs/meetingRoom.svg";
import EuroIcon from "../../../../assets/svg/euro.svg";
import ClockIcon from "../../../../assets/svg/clockNine.svg";
import { IAutomation, useUpsertAutomation } from "../../../../../queries/apps/automations";
import AutomationFormScaffold, { AutomationFlowPreview } from "../AutomationFormScaffold";
import { AutomationFormState } from "../AutomationForm";
import Router from "next/router";
import { useOffices } from "../../../../../queries/office";
import { DatePicker, DateTimePicker, LocalizationProvider, TimePicker } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";

export class ValidationDateTimeFormState {

  public activeFrom;
  public activeUntil;
  public error = "";

  constructor(outerState?: AutomationFormState) {
    if (outerState?.activeFrom.value && outerState?.activeFrom.value) {
      this.activeFrom = new ValueState(outerState?.activeFrom.value);
      this.activeUntil = new ValueState(outerState?.activeUntil.value);
    } else {
      this.activeFrom = new ValueState<string | null>("");
      this.activeUntil = new ValueState<string | null>("");
    }
    makeAutoObservable(this);
  }

  get data() {
    return {
      activeFromDate: new Date(this.activeFrom.value ?? '') ?? null,
      activeUntilDate: new Date(this.activeUntil.value ?? '') ?? null,
    };
  }

  clearDates() {
    this.activeFrom = new ValueState<string | null>("");
    this.activeUntil = new ValueState<string | null>("");
  }

  clearErrors() {
    this.activeFrom.error = "";
    this.activeUntil.error = "";
    this.error = "";
  }

  validate() {
    let valid = true;
    this.clearErrors();
    if (!this.activeFrom.value) {
      this.activeFrom.error = "Please select a date and time.";
      valid = false;
      this.error = "Please select a date and time.";
      return;
    }
    if (!this.activeUntil.value) {
      this.activeUntil.error = "Please select a date and time.";
      valid = false;
      this.error = "Please select a date and time.";
      return;
    }
    return valid;
  }

  setupErrors(err: FormError) {
    this.clearErrors();
    err.errors.forEach((error) => this.setupError(error));
  }

  setupError(error: FieldError) {
    if (error.field === "") {
      this.error = error.error;
    } else if (error.field === "activeFrom") {
      this.activeFrom.error = error.error;
    } else if (error.field === "activeUntil") {
      this.activeUntil.error = error.error;
    } else {
      // console.warn(
      //   `the field ${error.field} not found in the field list in DeskForm.`
      // );
    }
  }
}

export default function ValidationDateTimeForm({
  state: outerState,
  index,
}: {
  state: AutomationFormState;
  index: number;
}) {
  const [open, setOpen] = React.useState(false);
  const state = React.useMemo(() => new ValidationDateTimeFormState(outerState), [outerState]);
  const mutation = useUpsertAutomation();

  const handlePrevious = () => {
    outerState.setStep(outerState.step.value - 1)
  }

  async function handleSkip() {
    state.clearDates();
    state.activeFrom = new ValueState(null);
    state.activeUntil = new ValueState(null);
    try {
      await mutation.mutateAsync(outerState.data);
      OrangeryToast("Successfully created " + outerState.data.name, "success");
      Router.push("/dashboard/apps/automations")
      // }
    } catch (err: any) {
      state.setupErrors(err);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (state.validate()) {
      outerState.activeFrom = new ValueState(state.activeFrom.value);
      outerState.activeUntil = new ValueState(state.activeUntil.value);

      try {
        await mutation.mutateAsync(outerState.data);

        OrangeryToast("Successfully created " + outerState.data.name, "success");
        Router.push("/dashboard/apps/automations")
        // }
      } catch (err: any) {
        state.setupErrors(err);
      }
    }
  }

  return (
    <>
      <Observer>
        {() => (
          <>
            {(outerState.mode(index) === 'done' || outerState.mode(index) === 'inactive')
              ? (<Header mode={outerState.mode(index)}
                title={'Validation Date and Time'}
                index={index} state={outerState} />)
              : (
                <Box sx={{
                  maxWidth: 890, width: 890,
                  backgroundColor: '#F9F9FA',
                  borderRadius: '10px', pl: 8.5, pr: 3.3, pt: 9, pb: 3,
                  display: 'flex', flexDirection: 'column',
                  rowGap: 2, position: 'relative',
                }}>
                  <Box sx={{ position: 'absolute', left: 0, top: 15 }}>
                    <Header mode={outerState.mode(index)}
                      title={'Validation Date and Time'}
                      index={index} state={outerState} />
                  </Box>
                  <Observer>
                    {() => (
                      <form>
                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', rowGap: 2.5 }}>
                          <FormControlLabel
                            labelPlacement="start"
                            label={'From'}
                            control={
                              <Box sx={{ ml: 2, columnGap: 2, display: 'flex' }}>
                                <LocalizationProvider dateAdapter={AdapterDateFns}>
                                  <DateTimePicker
                                    disablePast
                                    showToolbar
                                    label="Select Date and Time"
                                    value={state.activeFrom.value}
                                    onChange={(newValue: any) => {
                                      state.activeFrom.value = newValue;
                                    }}
                                    renderInput={(props) => <TextField {...props} fullWidth />}
                                  />
                                </LocalizationProvider>
                              </Box>}
                          />
                          <FormControlLabel
                            labelPlacement="start"
                            label={'To'}
                            control={
                              <Box sx={{ ml: 4.2, columnGap: 2, display: 'flex' }}>
                                <LocalizationProvider dateAdapter={AdapterDateFns}>
                                  <DateTimePicker
                                    disablePast
                                    showToolbar
                                    label="Select Date and Time"
                                    value={state.activeUntil.value}
                                    onChange={(newValue: any) => {
                                      state.activeUntil.value = newValue;
                                    }}
                                    renderInput={(props) => <TextField {...props} fullWidth />}
                                  />
                                </LocalizationProvider>
                              </Box>}
                          />
                        </Box>
                      </form>
                    )}
                  </Observer>
                  <Observer>
                    {() => (
                      <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', mt: 4 }} >
                        <Button sx={{ mr: 'auto', width: 117, height: 54, backgroundColor: '#FFF' }} variant="outlined" onClick={handlePrevious}>
                          Previous
                        </Button>
                        <Typography sx={{ mr: 2 }} color={'error.main'}>{state.error}</Typography>
                        <Button sx={{ width: 230, height: 54, mr: 1 }} variant="contained" onClick={handleSkip}>
                          Skip this step and Create Flow
                        </Button>
                        <Button sx={{ width: 141, height: 54 }} variant="contained" onClick={handleSubmit}>
                          Create Flow
                        </Button>
                      </Box>
                    )}
                  </Observer>
                </Box>
              )}

          </>
        )}
      </Observer >
    </>
  );
}

const Header = ({ title, index, state, mode }
  :
  { title: string; index: number; state: AutomationFormState; mode: string; }) => {
  return (
    <>
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'start', rowGap: 1, mb: 1, mt: mode !== 'active' ? 1 : 'unset' }}>
        <Box sx={{ display: 'flex', columnGap: 1.5, alignItems: 'center', pl: 1.5 }}>
          <Box
            sx={{
              height: 42,
              width: 42,
              borderRadius: '100%',
              backgroundColor: mode === 'done'
                ? '#2B2E33'
                : mode === 'active'
                  ? '#F9D507'
                  : '#fff',
              color: mode === 'done'
                ? '#fff'
                : mode === 'active'
                  ? '#000'
                  : '#A5AAB4',
              border: mode === 'done'
                ? 'none'
                : mode === 'active'
                  ? '2px solid #2B2E33'
                  : '2px solid #A5AAB4',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            {index + 1}
          </Box>
          <Typography
            sx={{
              fontSize: 20,
              fontWeight: mode === 'active'
                ? 700
                : 600
            }}>
            {title}
          </Typography>
          {mode === 'done' && (<Typography
            sx={{
              textDecoration: 'underline',
              color: '#A5AAB4',
              cursor: 'pointer'
            }}
            onClick={
              () => state.setStep(index)}>
            {'(Edit)'}
          </Typography>)}

        </Box>
        {/* <Box sx={{ ml: 3.8 }}>
          {
            (mode === 'done' || mode === 'inactive') &&
            <Divider orientation="vertical"
              sx={{
                height: 20, border: mode === 'done'
                  ? '1px solid #2B2E33'
                  : '1px solid #C9CCD2'
              }} />
          }
        </Box> */}
      </Box>
    </>
  )
}
