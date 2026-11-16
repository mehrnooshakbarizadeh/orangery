// contexts & globals
import { useGlobalState } from "../../../../../Contexts & Globals/GlobalContext";

// react & next
import React, { useEffect } from "react";
import Router from "next/router";

// external dependencies
import { Box, Button, Typography, TextField, InputAdornment, IconButton, Divider } from "@mui/material";
import { makeAutoObservable } from "mobx";
import { Observer } from "mobx-react-lite";

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
import { productType, IProductType } from "../../../tenants/offersTab/ProductType";
import { AutomationFormState } from "../AutomationForm";

// queries & backend
import { useUpsertAutomation } from "../../../../../queries/apps/automations";

// icons, images & colors




export class OfferTypesFormState {

  public offer_types;
  public error = "";

  constructor(outerState?: AutomationFormState) {
    if (outerState?.offer_types.values) {
      this.offer_types = new ArrayValueState<string>(outerState.offer_types.values.map((offer_type) => offer_type.value) ?? []);
    } else {
      this.offer_types = new ArrayValueState<string>([]);
    }
    makeAutoObservable(this);
  }

  get data() {
    return {
      offer_types: this.offer_types.values.map((offer_type) => offer_type.value),
    };
  }

  clearErrors() {
    this.offer_types.clearError();
    this.error = "";
  }

  clear() {
    this.offer_types = new ArrayValueState<string>([]);
  }

  validate() {
    let valid = true;
    this.clearErrors();
    if (!this.offer_types.values.length) {
      this.offer_types.error = "Please add at least one offer type.";
      this.error = "Please add at least one offer type.";
      valid = false;
    }
    if (valid) {
      this.error = "";
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
    } else if (error.field === "offer_types") {
      this.offer_types.error = error.error;
    } else {
      // console.warn(
      //   `the field ${error.field} not found in the field list in DeskForm.`
      // );
    }
  }
}

export default function OfferTypesForm({
  state: outerState,
  index,
}: {
  state: AutomationFormState;
  index: number;
}) {

  const state = React.useMemo(() => new OfferTypesFormState(outerState), [outerState]);

  const handleNext = () => {
    if (state.validate()) {
      outerState.offer_types = new ArrayValueState<string>(state.offer_types.values.map((offer_type: any) => offer_type.value) ?? []);
      outerState.setStep(outerState.step.value + 1);
    }
  }

  const handlePrevious = () => {
    outerState.setStep(outerState.step.value - 1)
  }

  const handleSkip = () => {
    state.clear();
    outerState.clearOfferTypes();
    outerState.setStep(outerState.step.value + 1);
  }

  return (
    <>
      <Observer>
        {() => (
          <>
            {(outerState.mode(index) === 'done' || outerState.mode(index) === 'inactive')
              ? (<Header mode={outerState.mode(index)}
                title={'Add Offer Types'}
                index={index} state={outerState} />)
              : (
                <Box sx={{
                  maxWidth: 890, width: 890,
                  height: 350,
                  backgroundColor: '#F9F9FA',
                  borderRadius: '10px', pl: 8.5, pr: 3.3, pt: 9, pb: 3,
                  display: 'flex', flexDirection: 'column',
                  rowGap: 2, position: 'relative',
                }}>
                  <Box sx={{ position: 'absolute', left: 0, top: 15 }}>
                    <Header mode={outerState.mode(index)}
                      title={'Add Offer Types'}
                      index={index} state={outerState} />
                  </Box>
                  <form>
                    <Box
                      sx={{
                        display: 'flex', flexWrap: 'wrap', gap: 0.5,
                        overflowY: "scroll", height: 160,
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
                      }}>
                      {productType?.map((type, idx) => {
                        return (
                          <>
                            <OfferTypeCard
                              state={state}
                              key={idx}
                              handleClick={
                                () => {
                                  const i = state.offer_types.values.findIndex((v) => v.value === type.value);
                                  if (i === -1) {
                                    state.offer_types.pushElementValue(type.value);
                                  }
                                  else {
                                    state.offer_types.deleteElementValue(i);
                                  }
                                }

                              }
                              name={type.name}
                              typeValue={type.value}
                            />
                          </>
                        )
                      })}
                    </Box>
                  </form>
                  <Observer>
                    {() => (
                      <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }} >
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

const OfferTypeCard = ({ name, typeValue, state, handleClick }
  : {
    name: string,
    typeValue: string,
    state: OfferTypesFormState;
    handleClick:
    (event: React.MouseEvent<HTMLButtonElement>) => void;
  }) => {
  return (
    <>
      <Observer>
        {() => (
          <Box sx={{
            display: 'flex', alignItems: 'center', height: 51, width: 390, maxWidth: 390,
            borderRadius: '5px', justifyContent: 'space-between', p: 1.5,
            backgroundColor: '#fff',
          }}>
            <Typography
              sx={{ fontSize: 16, fontWeight: 700 }}>
              {name}
            </Typography>
            <Button
              onClick={handleClick}
              variant="outlined"
              sx={{
                backgroundColor: state.offer_types.values.findIndex((v) => v.value === typeValue) === -1 ? '#fff' : '#42B863', fontSize: 16,
                fontWeight: 600, borderRadius: '45px', width: 77,
                color: state.offer_types.values.findIndex((v) => v.value === typeValue) === -1 ? '#000' : '#fff',
                '&:hover': {
                  backgroundColor: state.offer_types.values.findIndex((v) => v.value === typeValue) === -1 ? 'unset' : '#000',
                }
              }}>
              {state.offer_types.values.findIndex((v) => v.value === typeValue) === -1 ? 'Add' : 'Added'}

            </Button>
          </Box>
        )}
      </Observer>
    </>
  )
}
