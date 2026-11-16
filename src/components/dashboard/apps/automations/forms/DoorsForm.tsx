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
import { IDoor, ILock, useDoors, useLocks } from "../../../../../queries/apps/saltoKs";
import Fuse from "fuse.js";
import Search from "@mui/icons-material/Search";
import OrangeryNoSearchResultPlaceholder from "../../../../OrangeryElements/OrangeryNoSearchResultPlaceholder";
import FilterDoors from "./FilterDoors";
import { useOffices } from "../../../../../queries/office";


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
  keys: ["lock_name", "doors.length", "office", "office.name", "active_from"],
};

export class SearchFilterDoorsState {
  public asce: boolean = true;
  public search: string = "";
  public filterBy: string[] = [];
  public selectedDoorList: string[] = [];

  constructor() {
    makeAutoObservable(this);
  }

  clearSelectedAutomation() {
    this.selectedDoorList.splice(0, this.selectedDoorList.length);
  }

  setDesc(value: boolean) {
    this.asce = !value;
  }

  setSearch(value: string) {
    this.search = value;
    this.clearSelectedAutomation();
  }

  isSelected(filter: string) {
    return !!this.filterBy.find((v) => v === filter);
  }

  pushToFilterList(value: string) {
    if (this.filterBy.includes(value)) {
      return;
    }
    this.filterBy.push(value);
  }

  deleteFromFilterList(value: number) {
    this.filterBy.splice(value, 1);
  }
}

function getSortedSearchedList(
  doors: IDoor[],
  search: string,
  filterBy: string[],
  asce: boolean
) {
  let sortedSearchedDoorList = [...doors];
  if (search) {
    const fuse = new Fuse(sortedSearchedDoorList, options);
    sortedSearchedDoorList = fuse.search(search).map((r) => r.item);
  }
  if (filterBy) {

    sortedSearchedDoorList = DoorFilter(sortedSearchedDoorList, filterBy);
  }
  return sortedSearchedDoorList;
}

function DoorFilter(doors: IDoor[], filterBy: string[]) {
  let filterList = [...doors];

  if (filterList && filterList.length > 0)
    filterList = filterByLocation(filterList, filterBy)
  else
    filterList = [...doors]
  // filterBy.forEach((v, j) => {
  //   if (v === "Locations") {
  //     filterList = filterByLocation(filterList);
  //   }
  // });
  return filterList;
}

function filterByLocation(doors: IDoor[], filterBy: string[]) {

  let filterList = [...doors];
  if (filterBy.length === 0) {
    return filterList;
  }
  filterBy.forEach((v, j) => {
    filterList = [...doors.filter((filteredDoor) => {
      return filteredDoor.lock_location === v
    }
    )];

  });
  return filterList;
}
export class DoorsFormState {

  public doors;
  public error = "";

  constructor(outerState?: AutomationFormState) {
    if (outerState?.doors.values) {
      this.doors = new ArrayValueState<string>(outerState.doors.values.map((door) => door.value) ?? []);
    } else {
      this.doors = new ArrayValueState<string>([]);
    }
    makeAutoObservable(this);
  }

  get data() {
    return {
      doors: this.doors.values.map((door) => door.value),
    };
  }

  clearErrors() {
    this.doors.clearError();
    this.error = "";
  }

  validate() {
    let valid = true;
    this.clearErrors();
    if (!this.doors.values.length) {
      this.doors.error = "Please add at least one door.";
      this.error = "Please add at least one door.";
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
    } else if (error.field === "doors") {
      this.doors.error = error.error;
    } else {
      // console.warn(
      //   `the field ${error.field} not found in the field list in DeskForm.`
      // );
    }
  }
}

export default function DoorsForm({
  state: outerState,
  index,
}: {
  state: AutomationFormState;
  index: number;
}) {

  const { data: offices, isLoading: isLoadingOffice, isError } = useOffices();
  const state = React.useMemo(() => new DoorsFormState(outerState), [outerState]);
  const searchState = new SearchFilterDoorsState();
  const {
    data: locks,
    isLoading: locksLoading,
  } = useDoors();

  const handleNext = () => {
    if (state.validate()) {
      outerState.doors = new ArrayValueState<string>(state.doors.values.map((door) => door.value) ?? []);
      outerState.setStep(outerState.step.value + 1);
    }
  }

  const handlePrevious = () => {
    outerState.setStep(outerState.step.value - 1)
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
                title={'Add Doors'}
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
                      title={'Add Doors'}
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
                          width: "50%",
                        }}
                      >
                        <Input
                          disableUnderline={true}
                          sx={{
                            width: "100%", height: 45, backgroundColor: '#FFF',
                            border: '1px solid #C9CCD2',
                            borderRadius: '5px',
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
                      <FilterDoors state={searchState}
                        filterOptions={offices?.map((office) => office.name) ?? [] as string[]} />
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
                      {locks && locks.length > 0
                        ? (<Observer>
                          {() => {
                            const sortedSearchedList = getSortedSearchedList(
                              locks,
                              searchState.search,
                              searchState.filterBy,
                              searchState.asce,
                            );
                            return sortedSearchedList &&
                              sortedSearchedList.length > 0 ? (
                              <DoorsRows
                                state={state}
                                doors={sortedSearchedList}
                              />
                            ) : (
                              <OrangeryNoSearchResultPlaceholder automationSearchResult />
                            );
                          }}
                        </Observer>)
                        : (<>No Doors Available</>)}
                    </Box>
                  </form>
                  <Observer>
                    {() => (
                      <Box sx={{ alignItems: 'center', display: 'flex', width: '100%' }} >
                        <Button sx={{ mr: 'auto', width: 117, height: 54, backgroundColor: '#FFF' }} variant="outlined" onClick={handlePrevious}>
                          Previous
                        </Button>
                        <Typography color={'error.main'}>{state.error}</Typography>
                        <Button sx={{ ml: 2, width: 86, height: 54 }} variant="contained" onClick={handleNext}>
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
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'start', rowGap: 1, mb: 1, mt: mode !== 'active' ? 1.5 : 'unset' }}>
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


const DoorsRows = ({
  state,
  doors,
}: {
  state: DoorsFormState;
  doors: IDoor[];
}) => {
  return (
    <>
      <Observer>
        {() => (
          <>
            {
              doors.map((door, idx) => (
                <DoorCard
                  handleClick={
                    () => {
                      const i = state.doors.values.findIndex((v) => v.value === door.lock_id);
                      if (i === -1) {
                        state.doors.pushElementValue(door.lock_id);
                        state.validate();
                      }
                      else {
                        state.doors.deleteElementValue(i);
                        state.validate();
                      }
                    }
                  }
                  officeName={door.lock_location}
                  name={door.lock_name}
                  key={door.uuid + idx}
                  selected={state.doors.values.findIndex((v) => v.value === door.lock_id) !== -1}
                />
              ))
            }
          </>
        )}
      </Observer>
    </>
  );
};

const DoorCard = ({ name, officeName, selected, handleClick }
  : {
    name?: string,
    officeName?: string;
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
            <Typography
              sx={{ fontSize: 16, fontWeight: 400 }}>
              {officeName}
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
