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
import { IAutomation, useUpsertAutomation } from "../../../../../queries/apps/automations";
import AutomationFormScaffold, { AutomationFlowPreview } from "../AutomationFormScaffold";
import { AutomationFormState } from "../AutomationForm";
import { useOffices } from "../../../../../queries/office";
import { DateTimePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";

export class DurationFormState {

  public accessFromTime;
  public accessUntilTime;
  public error = "";

  constructor(outerState?: AutomationFormState) {
    if (outerState?.accessFromTime.value && outerState?.accessUntilTime.value) {
      this.accessFromTime = new ValueState(outerState?.accessFromTime.value);
      this.accessUntilTime = new ValueState(outerState?.accessUntilTime.value);
    } else {
      this.accessFromTime = new ValueState(null);
      this.accessUntilTime = new ValueState(null);
    }
    makeAutoObservable(this);
  }

  get data() {
    return {
      accessFromTime: this.accessFromTime.value,
      accessUntilTime: this.accessUntilTime.value,
    };
  }

  clearDuration() {
    this.accessFromTime = new ValueState(null);
    this.accessUntilTime = new ValueState(null);
  }

  clearErrors() {
    this.accessFromTime.clearError();
    this.accessUntilTime.clearError();
    this.error = "";
  }

  validate() {
    let valid = true;
    this.clearErrors();
    if (!this.accessFromTime.value) {
      this.accessFromTime.error = "Please select a start date and time.";
      this.error = "Please select a start time.";
      valid = false;
      return;
    }
    if (!this.accessUntilTime.value) {
      this.accessUntilTime.error = "Please select an end date and time.";
      this.error = "Please select an end time.";
      valid = false;
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
    } else if (error.field === "accessFromTime") {
      this.accessFromTime.error = error.error;
    } else if (error.field === "accessUntilTime") {
      this.accessUntilTime.error = error.error;
    } else {
      // console.warn(
      //   `the field ${error.field} not found in the field list in DeskForm.`
      // );
    }
  }
}

export default function DurationForm({
  state: outerState,
  index,
}: {
  state: AutomationFormState;
  index: number;
}) {
  const state = React.useMemo(() => new DurationFormState(outerState), [outerState]);

  const mutation = useUpsertAutomation();

  const handleNext = () => {
    if (state.validate()) {
      outerState.accessFromTime.value = state.accessFromTime.value;
      outerState.accessUntilTime.value = state.accessUntilTime.value;
      outerState.setStep(outerState.step.value + 1);
    }
  }

  const handleSkip = () => {
    state.clearDuration();
    state.accessFromTime = new ValueState(null);
    state.accessUntilTime = new ValueState(null);
    outerState.setStep(outerState.step.value + 1);
  }

  const handlePrevious = () => {
    outerState.setStep(outerState.step.value - 1)
  }

  return (
    <>
      <Observer>
        {() => (
          <>
            {(outerState.mode(index) === 'done' || outerState.mode(index) === 'inactive')
              ? (<Header mode={outerState.mode(index)}
                title={'Door Access Duration'}
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
                      title={'Door Access Duration'}
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
                                    value={state.accessFromTime.value}
                                    onChange={(newValue: any) => {
                                      state.accessFromTime.value = newValue;
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
                                    value={state.accessUntilTime.value}
                                    onChange={(newValue: any) => {
                                      state.accessUntilTime.value = newValue;
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
                        <Button sx={{ mr: 1, width: 84, height: 54, backgroundColor: '#FFF' }} variant="outlined" onClick={handleSkip}>
                          Skip
                        </Button>
                        <Button sx={{ width: 86, height: 54 }} variant="contained" onClick={handleNext}>
                          Next
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
        <Box sx={{ ml: 3.8 }}>
          {
            (mode === 'done' || mode === 'inactive') &&
            <Divider orientation="vertical"
              sx={{
                height: 20, border: mode === 'done'
                  ? '1px solid #2B2E33'
                  : '1px solid #C9CCD2'
              }} />
          }
        </Box>
      </Box>
    </>
  )
}
