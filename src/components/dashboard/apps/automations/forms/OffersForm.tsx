// contexts & globals
import { useGlobalState } from "../../../../../Contexts & Globals/GlobalContext";

// react & next
import React, { useEffect } from "react";

// external dependencies
import { Box, Button, Typography, TextField, InputAdornment, IconButton, Divider, debounce, Input } from "@mui/material";
import { makeAutoObservable } from "mobx";
import { Observer, observer } from "mobx-react-lite";

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
import { AutomationFormState } from "../AutomationForm";
import Fuse from "fuse.js";
import Search from "@mui/icons-material/Search";
import OrangeryNoSearchResultPlaceholder from "../../../../OrangeryElements/OrangeryNoSearchResultPlaceholder";
import { useAllOffers, useUpsertAutomation } from "../../../../../queries/apps/automations";
import Router from "next/router";
import { IOffer, useOffers } from "../../../../../queries/tenant";



const options = {
  isCaseSensitive: false,
  findAllMatches: true,
  includeMatches: true,
  includeScore: true,
  useExtendedSearch: false,
  threshold: 0.4,
  location: 0,
  distance: 400,
  shouldSort: true,
  maxPatternLength: 32,
  minMatchCharLength: 1,
  keys: ["name"],
};

export class SearchFilterOffersState {
  public asce: boolean = true;
  public search: string = "";
  public selectedOfferList: string[] = [];

  constructor() {
    makeAutoObservable(this);
  }

  clearSelectedAutomation() {
    this.selectedOfferList.splice(0, this.selectedOfferList.length);
  }

  isSelected(uuid: string) {
    return !!this.selectedOfferList.find((v) => v === uuid);
  }

  setDesc(value: boolean) {
    this.asce = !value;
  }

  setSearch(value: string) {
    this.search = value;
    this.clearSelectedAutomation();
  }

}

function getSortedSearchedList(
  doors: IOffer[],
  search: string,
  asce: boolean
) {
  let sortedSearchedDoorList = [...doors];
  if (search) {
    const fuse = new Fuse(sortedSearchedDoorList, options);
    sortedSearchedDoorList = fuse.search(search).map((r) => r.item);
  }
  return sortedSearchedDoorList;
}

export class OfferFormState {

  public offers;
  public error = "";

  constructor(outerState?: AutomationFormState) {
    if (outerState?.offers.values) {
      this.offers = new ArrayValueState<string>(outerState.offers.values.map((offer) => offer.value) ?? []);
    } else {
      this.offers = new ArrayValueState<string>([]);
    }
    makeAutoObservable(this);
  }

  get data() {
    return {
      offers: this.offers.values.map((offer) => offer.value),
    };
  }

  clear() {
    this.offers = new ArrayValueState<string>([]);
  }

  clearErrors() {
    this.offers.clearError();
    this.error = "";
  }

  validate() {
    let valid = true;
    this.clearErrors();
    if (!this.offers.values.length) {
      this.offers.error = "Please add at least one offer.";
      this.error = "Please add at least one offer.";
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
    } else if (error.field === "offers") {
      this.offers.error = error.error;
    } else {
      // console.warn(
      //   `the field ${error.field} not found in the field list in DeskForm.`
      // );
    }
  }
}

export default function OffersForm({
  state: outerState,
  index,
}: {
  state: AutomationFormState;
  index: number;
}) {

  const state = React.useMemo(() => new OfferFormState(outerState), [outerState]);
  const searchState = new SearchFilterOffersState();

  const globalState = useGlobalState();
  const {
    data: offers,
    isLoading,
    isError,
  } = useAllOffers();

  const handleNext = () => {
    if (state.validate()) {
      outerState.offers = new ArrayValueState<string>(state.offers.values.map((offer) => offer.value) ?? []);
      outerState.setStep(outerState.step.value + 1);
    }
  }

  const handlePrevious = () => {
    outerState.setStep(outerState.step.value - 1)
  }

  const handleSkip = () => {
    state.clear();
    outerState.clearOffers();
    outerState.setStep(outerState.step.value + 1);
  }

  const handleFilter = debounce((value: string) => {
    searchState.setSearch(value);
  }, 500);

  return (
    <>
      <Observer>
        {() => (
          <>
            {(outerState.mode(index) === 'done' || outerState.mode(index) === 'inactive')
              ? (<Header mode={outerState.mode(index)}
                title={'Add Specific Offer'}
                index={index} state={outerState} />)
              : (
                <Box sx={{
                  maxWidth: 890, width: 890,
                  height: 406,
                  backgroundColor: '#F9F9FA',
                  borderRadius: '10px', pl: 8.5, pr: 3.3, pt: 9, pb: 3,
                  display: 'flex', flexDirection: 'column',
                  rowGap: 2, position: 'relative',
                }}>
                  <Box sx={{ position: 'absolute', left: 0, top: 15 }}>
                    <Header mode={outerState.mode(index)}
                      title={'Add Specific Offer'}
                      index={index} state={outerState} />
                  </Box>
                  <form>
                    <Box sx={{ display: 'flex', alignItems: 'center', columnGap: 1, mb: 1.5 }}>
                      <Box
                        sx={{
                          borderRadius: 2,
                          height: 45,
                          backgroundColor: (theme) => theme.palette.grey[200],
                          display: "flex",
                          alignItems: "center",
                          width: "100%",
                        }}
                      >
                        <Input
                          disableUnderline={true}
                          sx={{
                            width: "100%", height: 45, backgroundColor: '#FFF',
                            border: '1px solid #C9CCD2'
                          }}
                          onChange={(e) => {
                            handleFilter(e.target.value.toLowerCase());
                          }}
                          placeholder="Type here..."
                          startAdornment={
                            <InputAdornment sx={{ ml: 2 }} position="start">
                              <Search />
                            </InputAdornment>
                          }
                        />
                      </Box>
                    </Box>
                    <Box
                      sx={{
                        display: 'flex', flexDirection: 'column', rowGap: 0.5,
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
                      {offers && offers.length > 0
                        ? (<Observer>
                          {() => {
                            const sortedSearchedList = getSortedSearchedList(
                              offers,
                              searchState.search,
                              searchState.asce,
                            );
                            return sortedSearchedList &&
                              sortedSearchedList.length > 0 ? (
                              <OfferRows
                                state={state}
                                offers={sortedSearchedList}
                              />
                            ) : (
                              <OrangeryNoSearchResultPlaceholder automationSearchResult />
                            );
                          }}
                        </Observer>)
                        : (<>No Offers Available</>)}
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


const OfferRows = ({
  state,
  offers,
}: {
  state: OfferFormState;
  offers: IOffer[];
}) => {
  return (
    <>
      <Observer>
        {() => (
          <>
            {
              offers.map((offer) => (
                <OfferCard
                  handleClick={
                    () => {
                      const i = state.offers.values.findIndex((v) => v.value === offer.uuid);
                      if (i === -1) {
                        state.offers.pushElementValue(offer.uuid);
                        state.validate();
                      }
                      else {
                        state.offers.deleteElementValue(i);
                        state.validate();
                      }
                    }
                  }
                  name={offer.name}
                  key={offer.uuid}
                  selected={state.offers.values.findIndex((v) => v.value === offer.uuid) !== -1}
                />
              ))
            }
          </>
        )}
      </Observer>
    </>
  );
};

const OfferCard = ({ name, selected, handleClick }
  : {
    name?: string,
    selected?: boolean;
    handleClick?:
    (event: React.MouseEvent<HTMLButtonElement>) => void;
  }) => {
  return (
    <>
      <Observer>
        {() => (
          <Box sx={{
            display: 'flex', alignItems: 'center', height: 51, width: '100%',
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
                backgroundColor: !selected ? '#fff' : '#42B863', fontSize: 16,
                fontWeight: 600, borderRadius: '45px', width: 77,
                color: !selected ? '#000' : '#fff',
                '&:hover': {
                  backgroundColor: !selected ? 'unset' : '#000',
                }
              }}>
              {!selected ? 'Add' : 'Added'}
            </Button>
          </Box>
        )}
      </Observer>
    </>
  )
}
