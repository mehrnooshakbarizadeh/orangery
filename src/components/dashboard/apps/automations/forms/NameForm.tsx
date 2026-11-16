// contexts & globals
import { useGlobalState } from "../../../../../Contexts & Globals/GlobalContext";

// react & next
import React, { useEffect } from "react";

// external dependencies
import { Box, Button, Typography, TextField, InputAdornment, IconButton, Divider } from "@mui/material";
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
} from "../../../../OrangeryElements";


// queries & backend


// icons, images & colors
import CapacityIcon from "../../../../assets/svg/capacity.svg";
import MeetingRoomIcon from "../../../../assets/svg/dashboard/newMenuSVGs/meetingRoom.svg";
import EuroIcon from "../../../../assets/svg/euro.svg";
import ClockIcon from "../../../../assets/svg/clockNine.svg";
import { IAutomation } from "../../../../../queries/apps/automations";
import AutomationFormScaffold, { AutomationFlowPreview } from "../AutomationFormScaffold";
import { AutomationFormState } from "../AutomationForm";

export class NameFormState {

  public name;
  public error = "";

  constructor(outerState?: AutomationFormState) {
    if (outerState?.name.value) {
      this.name = new ValueState(outerState?.name.value);
    } else {
      this.name = new ValueState("");
    }
    makeAutoObservable(this);
  }

  get data() {
    return {
      name: this.name.value,
    };
  }

  clearErrors() {
    this.name.clearError();
    this.error = "";
  }

  validate() {
    let valid = true;
    this.clearErrors();
    if (!this.name.value) {
      this.name.error = "Please fill your automation name";
      valid = false;
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
    } else if (error.field === "name") {
      this.name.error = error.error;
    } else {
      // console.warn(
      //   `the field ${error.field} not found in the field list in DeskForm.`
      // );
    }
  }
}

export default function NameForm({
  state,
  index,
}: {
  state: AutomationFormState;
  index: number;
}) {
  const nameFormState = React.useMemo(() => new NameFormState(state), [state]);

  const handleNext = () => {
    if (nameFormState.validate()) {
      state.name.value = nameFormState.name.value;
      state.setStep(state.step.value + 1);
    }
  }

  return (
    <>
      <Observer>
        {() => (
          <>
            {state.mode(index) === 'done'
              ? (<Header mode={state.mode(index)}
                title={'Give your automation flow a name.'}
                index={index} state={state} />)
              : (
                <Box sx={{
                  maxWidth: 890, width: 890,
                  backgroundColor: '#F9F9FA',
                  borderRadius: '10px', pl: 8.5, pr: 3.3, pt: 9, pb: 3,
                  display: 'flex', flexDirection: 'column',
                  rowGap: 2, position: 'relative',
                }}>
                  <Box sx={{ position: 'absolute', left: 15, top: 15 }}>
                    <Header mode={state.mode(index)}
                      title={'Give your automation flow a name.'}
                      index={index} state={state} />
                  </Box>
                  <form>
                    {state.mode(index) === 'active' && (
                      <OrangeryTextField
                        fullWidth
                        label="Automation flow name"
                        name="name"
                        placeholder="Enter a name"
                        error={!!nameFormState.name.error}
                        value={nameFormState.name.value}
                        helperText={nameFormState.name.error}
                        onChange={(e: any) => (nameFormState.name.value = e.target.value)}
                      />
                    )}
                  </form>
                  <Box sx={{ display: 'flex', justifyContent: 'flex-end' }} >
                    <Button sx={{ width: 86, height: 54 }} variant="contained" onClick={handleNext}>
                      Next
                    </Button>
                  </Box>
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
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'start', rowGap: 1, mb: 1, pl: mode !== 'active' ? 1.5 : 'unset' }}>
        <Box sx={{ display: 'flex', columnGap: 1.5, alignItems: 'center' }}>
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
        <Box sx={{ ml: 2.4 }}>
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
