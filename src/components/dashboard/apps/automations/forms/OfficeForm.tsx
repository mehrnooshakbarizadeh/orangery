// contexts & globals
import { useGlobalState } from "../../../../../Contexts & Globals/GlobalContext";

// react & next
import React, { useEffect } from "react";

// external dependencies
import { Box, Button, Typography, TextField, InputAdornment, IconButton, Divider, FormControl, Select, MenuItem } from "@mui/material";
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

export class OfficeFormState {

  public office;
  public error = "";

  constructor(outerState?: AutomationFormState) {
    if (outerState?.office.value) {
      this.office = new ValueState(outerState?.office.value);
    } else {
      this.office = new ValueState("");
    }
    makeAutoObservable(this);
  }

  get data() {
    return {
      office: this.office.value,
    };
  }

  clearOffice() {
    this.office = new ValueState("");
  }

  clearErrors() {
    this.office.clearError();
    this.error = "";
  }

  validate() {
    let valid = true;
    this.clearErrors();
    if (!this.office.value) {
      this.office.error = "Please select an office.";
      this.error = "Please select an office.";
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
    } else if (error.field === "office") {
      this.office.error = error.error;
    } else {
      // console.warn(
      //   `the field ${error.field} not found in the field list in DeskForm.`
      // );
    }
  }
}

export default function OfficeForm({
  state: outerState,
  index,
}: {
  state: AutomationFormState;
  index: number;
}) {
  const [open, setOpen] = React.useState(false);
  const state = React.useMemo(() => new OfficeFormState(outerState), [outerState]);
  const { data: offices, isLoading: isLoadingOffice, isError } = useOffices();
  const mutation = useUpsertAutomation();

  const handleNext = () => {
    if (state.validate()) {
      outerState.office.value = state.office.value;
      outerState.setStep(outerState.step.value + 1);
    }
  }

  const handleSkip = () => {
    state.clearOffice();
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
                title={'Add Office'}
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
                      title={'Add Office'}
                      index={index} state={outerState} />
                  </Box>
                  <form>
                    <FormControl>
                      <Observer>
                        {() => (
                          <Select
                            inputProps={{
                              MenuProps: {
                                MenuListProps: {
                                  sx: {
                                    backgroundColor: "#F9F9FA",
                                  },
                                },
                                PaperProps: {
                                  style: {
                                    // maxHeight: ITEM_HEIGHT * 9 + ITEM_PADDING_TOP,
                                    width: 400,
                                    borderTop: "none !important",
                                    borderLeft: "1px solid #C9CCD2",
                                    borderBottom: "1px solid #C9CCD2",
                                    borderRight: "1px solid #C9CCD2",
                                    boxShadow: "none",
                                    borderRadius: "0 0 15px 15px",
                                    overflowY: "scroll",
                                    maxHeight: "150px",
                                  },
                                },
                              },
                            }}
                            onOpen={() => setOpen(true)}
                            onClose={() => setOpen(false)}
                            MenuProps={{}}
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={state.office.value}
                            onChange={(e) => {
                              state.office.value = e.target.value;
                            }}
                            variant="standard"
                            renderValue={(selected) => {
                              return selected
                                ? offices?.find((item: any) => item.uuid === selected)
                                  ?.name
                                : "Select An Office";
                            }}
                            placeholder="Select"
                            displayEmpty
                            sx={{
                              width: 400,
                              "&::before": { borderBottom: "0px" },
                              "&::after": { borderBottom: "0px" },
                              "&:hover:before": { borderBottom: "none !important" },
                              "& .MuiSelect-select": {
                                backgroundColor: "#FFF !important",
                                height: "32px !important",
                                pt: 1.4,
                                px: 2,
                                borderTop: "1px solid #C9CCD2",
                                borderLeft: "1px solid #C9CCD2",
                                borderRight: "1px solid #C9CCD2",
                                borderBottom: "1px solid #C9CCD2",
                                borderRadius: "5px",
                                borderColor: "#C9CCD2",
                              },
                              "& .MuiSelect-select:focus": {
                                borderRadius: "5px",
                              },
                            }}
                          >
                            {offices &&
                              offices.length > 0 &&
                              offices.map((office: any, idx: number) => (
                                <MenuItem key={office.uuid} value={office.uuid}>
                                  <OrangeryText
                                    text={office.name}
                                    limit={40}
                                  />
                                </MenuItem>
                              ))}
                          </Select>
                        )}
                      </Observer>
                    </FormControl>
                  </form>
                  <Observer>
                    {() => (
                      <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', mt: 4 }} >
                        <Button sx={{ mr: 'auto', width: 117, height: 54, backgroundColor: '#FFF' }} variant="outlined" onClick={handlePrevious}>
                          Previous
                        </Button>
                        <Typography sx={{ mr: 2 }} color={'error.main'}>{state.error}</Typography>

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
