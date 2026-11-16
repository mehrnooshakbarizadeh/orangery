// contexts & globals
// import { useGlobalState } from "../../../../../Contexts & Globals/GlobalContext";

// react & next
import React from "react";

// external dependencies
import {
  Box,
  Typography,
  Button,
  Grid,
  debounce,
  Input,
  InputAdornment,
} from "@mui/material";
import { observer, Observer } from "mobx-react-lite";
import { makeAutoObservable } from "mobx";
import Fuse from "fuse.js";

// orangery elements & internal dependencies
import {
  OrangeryNavigationContentLoader,
  OrangeryUserCard2,
  OrangeryNavigationPlaceholder
} from "../../../../OrangeryElements";
// import DoorAccessOverviewButton from "./DoorAccessOverviewButton"
import AddNewDoorAccessButton from "./AddNewDoorAccessButton"
import EditDoorAccessButton from "./EditDoorAccessButton"
import SortDoorAccessesAutocomplete from "./SortDoorAccessesAutocomplete";
import FilterDoorAccesses from "./FilterDoorAccesses";

// queries & backend
import {
  IDoorAccess,
  useDoorAccesses
} from "../../../../../queries/apps/saltoKs";
import { useOffices } from "../../../../../queries/office";

// icons, images & colors
import PlaceholderSvg from "../../../../../assets/svg/placeholders/door_access.svg";
import ArrowDownAZIcon from "../../../../../assets/svg/arrowDownAZ.svg";
import ArrowUpZAIcon from "../../../../../assets/svg/arrowUpZA.svg";
import SearchIcon from "@mui/icons-material/Search";

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
  keys: ["name", "email"],
};

export class DoorAccessesListState {
  public sortBy = "";
  public asce: boolean = true;
  public search: string = "";
  public filterBy: string[] = [];

  constructor() {
    makeAutoObservable(this);
  }

  setSortBy(value: string) {
    this.sortBy = value;
  }

  setDesc(value: boolean) {
    this.asce = !value;
  }

  setSearch(value: string) {
    this.search = value;
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

function getManipulatedList(
  doorAccesses: IDoorAccess[],
  filterBy: string[],
  search: string,
  sortBy: string,
  asce: boolean
) {
  // let doorAccessesList = [...doorAccesses];
  let doorAccessesList = JSON.parse(JSON.stringify(doorAccesses));
  if (filterBy && filterBy.length > 0)
    doorAccessesList = doorAccessesFilterByLocation(doorAccessesList, filterBy)
  else
    doorAccessesList = [...doorAccesses]

  if (search) {
    const fuse = new Fuse(doorAccessesList, options);
    doorAccessesList = fuse.search(search).map((r) => r.item);
  }

  doorAccessesList = DoorAccessesSort(
    doorAccessesList,
    sortBy,
    asce
  );
  return doorAccessesList;
}

function doorAccessesFilterByLocation(doorAccesses: IDoorAccess[], filterBy: string[]) {
  // let filteredDoorAccesses = doorAccesses.filter(
  //   (doorAccess) =>
  //     doorAccess.door_accesses.filter(
  //       (lock) =>
  //         filterBy.find(
  //           (filterString) =>
  //             filterString === lock.office?.name
  //         )
  //     ).length
  // )

  let filteredDoorAccesses = [...doorAccesses]

  filteredDoorAccesses.forEach((filteredDoorAccess, index) => {
    let locks = [] as any[];
    filteredDoorAccess.door_accesses.forEach((lock) => {
      if (filterBy.find(
        (filterString) =>
          filterString === lock.office?.name
      ))
        locks.push(lock)
    })
    filteredDoorAccesses[index].door_accesses = locks
  })

  return filteredDoorAccesses.filter((doorAccess) => doorAccess.door_accesses.length);

  // if (filterBy.includes("On Marketplace")) {
  //   return doorAccesses.filter(doorAccess => doorAccess.marketplace)
  // }

  // if (filterBy.includes("Digital Contract")) {
  //   return doorAccesses.filter(doorAccess => doorAccess.documents.length > 0)
  // }


  // if (filterBy.includes("Subscription")) {
  //  return doorAccesses.filter(doorAccess => doorAccess.payment_method === "subscription")
  // }

  // if (filterBy.includes("One Time Payment")) {
  //  return doorAccesses.filter(doorAccess => doorAccess.payment_method === "one_time_payment")
  // }

  // return doorAccesses;
}

function DoorAccessesSort(doorAccesses: IDoorAccess[], sortBy: string, asce: boolean) {
  if (sortBy) {
    switch (sortBy) {
      case "Name":
        return sortByName(doorAccesses, asce);
      case "Number of Doors":
        return sortByNumberOfDoors(doorAccesses, asce);
      default: { }
    }
  }
  return doorAccesses;
}

function sortByName(doorAccess: IDoorAccess[], asce: boolean) {
  if (!asce) {
    return doorAccess.sort((a, b) => (a.name.toLowerCase() > b.name.toLowerCase() ? 1 : -1));
  } else {
    return doorAccess.sort((a, b) => (a.name.toLowerCase() < b.name.toLowerCase() ? 1 : -1));
  }
}

function sortByNumberOfDoors(doorAccess: IDoorAccess[], asce: boolean) {
  if (!asce) {
    return doorAccess.sort((a, b) => (a?.door_accesses.length > b.door_accesses.length ? 1 : -1));
  } else {
    return doorAccess.sort((a, b) => (a.door_accesses.length < b.door_accesses.length ? 1 : -1));
  }
}

export default function DoorAccessesList() {
  const {
    data: doorAccesses,
    isLoading
  } = useDoorAccesses();
  const state = React.useMemo(() => new DoorAccessesListState(), []);

  return <>
    {isLoading
      ? <OrangeryNavigationContentLoader />
      : doorAccesses && doorAccesses.length > 0
        ? <Box
          sx={{
            backgroundColor: "#fff",
            display: "flex",
            flexDirection: "column",
            // justifyContent: "start",
            // minHeight: 666,
            height: "100%",
            borderRadius: 1.5,
            py: 3,
            px: 2,
          }}
        >
          <Header button={<AddNewDoorAccessButton />} state={state} />

          <Box
            sx={{
              overflowY: "auto", // Make it scroll!
              height: `calc(100% - 12px)`,
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
            <Observer>
              {() => {
                const manipulatedList = getManipulatedList(
                  doorAccesses,
                  state.filterBy,
                  state.search,
                  state.sortBy,
                  state.asce
                );
                return (
                  manipulatedList && manipulatedList.length > 0
                    ? <DoorAccessesRows
                      doorAccesses={manipulatedList}
                    />
                    : <OrangeryNavigationPlaceholder
                      vertical
                      width={213}
                      height={224}
                      title={"No door access found!"}
                      subtitle={"Please search or filter somthing else"}
                      PlaceholderSvg={PlaceholderSvg}
                      // AddNewButton={<AddNewDoorAccessButton />}
                      addNewButtonText={""}
                    />
                );
              }}
            </Observer>
          </Box>
        </Box>
        : <OrangeryNavigationPlaceholder
          vertical
          width={213}
          height={224}
          title={"No door access is available!"}
          subtitle={"Assign doors to your employees"}
          PlaceholderSvg={PlaceholderSvg}
          AddNewButton={<AddNewDoorAccessButton />}
          addNewButtonText={""}
        />
    }
  </>;
}

const DoorAccessesRows = ({
  doorAccesses,
}: {
  doorAccesses: IDoorAccess[];
}) => {
  return (
    <>
      {doorAccesses.map(doorAccess => (
        <DoorAccessRow
          key={doorAccess.uuid}
          doorAccess={doorAccess}
        />
      ))}
    </>
  );
};

function DoorAccessRow({ doorAccess }: { doorAccess: IDoorAccess }) {
  return (
    <>
      <Grid
        container
        sx={{
          display: "flex",
          justifyContent: "space-between",
          py: 2.7,
          px: 2.4,
          boxShadow: "1px 1px 8px #0000000a",
          border: "1px solid rgb(210 215 221)",
          alignItems: "center",
          borderRadius: 1.5,
          mb: 1.2,
          mx: 0,
          fontSize: 16,
          fontWeight: 500,
        }}
      >
        <Grid
          xs={4}
          sm={4}
          md={3}
          item
          sx={{
            display: "flex",
            // alignItems: "center",
            gap: 1,
            flexDirection: "column",
          }}
        >
          <OrangeryUserCard2 user={doorAccess} size={40} />
        </Grid>
        <Grid
          xs={3}
          sm={2}
          item
          sx={{
            display: "flex",
            // alignItems: "center",
            gap: 1,
            flexDirection: "column",
          }}
        >
          <Typography variant="h6">TOTAL ACCESSES</Typography>
          <Typography variant="h4">{doorAccess.door_accesses.length ? doorAccess.door_accesses.length + " doors" : "no doors"}</Typography>
        </Grid>
        <Box
          sx={{
            flex: 1,
            display: {
              xs: "none",
              sm: "flex"
            }
          }}
        />
        <Grid
          item
          xs={2}
          sm={2}
          md={1}
          sx={{
            display: "flex",
            flexDirection: "row",
            flex: "none",
            textAlign: "right",
            justifyContent: "end"
          }}
        >
          {/* <OrangeryShowQRCodeButton
            assetType={"doorAccess"}
            uuid={doorAccess.uuid}
            name={doorAccess.name}
          /> */}
          {/* <DoorAccessOverviewButton doorAccess={doorAccess} /> */}
          <EditDoorAccessButton doorAccess={doorAccess} />
        </Grid>
      </Grid>
    </>
  );
}

const Header = observer(
  ({ button, state }: { button?: JSX.Element; state: DoorAccessesListState }) => {
    const handleFilter = debounce((value: string) => {
      state.setSearch(value);
    }, 500);

    const {
      data: offices,
      // isLoading,
      // isError
    } = useOffices();

    return (
      <>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "end",
            mb: 2,
            flexFlow: {
              sx: "column",
              sm: "row",
            },
          }}
        >
          <Box
            sx={{ flexGrow: 1, display: "flex", alignItems: "center", gap: 1, pt: 1 }}
          >
            <Box
              sx={{
                borderRadius: 2,
                height: 55,
                backgroundColor: (theme) => theme.palette.grey[200],
                display: "flex",
                alignItems: "center",
                gap: 3,
                px: 2,
                flexBasis: "22%",
              }}
            >
              <Input
                disableUnderline={true}
                onChange={(e) => {
                  handleFilter(e.target.value.toLowerCase());
                }}
                sx={{
                  width: "100%",
                  "& .MuiInput-input": { fontSize: '17px !important', fontWeight: "400 !important", color: '#505357 !important' },
                }}
                placeholder="Type here ..."
                startAdornment={
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                }
              />
            </Box>
            <Box sx={{ minWidth: 264, maxWidth: 400 }}>
              <SortDoorAccessesAutocomplete
                name="sortBy"
                placeholder="Sort By..."
                value={state.sortBy}
                onChange={(newValue: string) => {
                  state.setSortBy(newValue);
                }}
              />
            </Box>

            <Box
              sx={{
                minWidth: 60,
                maxWidth: 400,
                "& .arrow-icon": { width: "1.2rem", height: "1.2rem" },
              }}
            >
              <Button
                onClick={() => state.setDesc(state.asce)}
                sx={{ backgroundColor: "#F9F9FA", p: 2, borderRadius: "5px" }}
              >
                {state.asce ? (
                  <ArrowUpZAIcon className="arrow-icon" />
                ) : (
                  <ArrowDownAZIcon className="arrow-icon" />
                )}
              </Button>
            </Box>
            <FilterDoorAccesses
              state={state}
              filterOptions={offices?.map((office) => office.name) ?? [] as string[]}
            />
          </Box>
          <Box
            sx={{
              flexShrink: 0,
              ml: 3,
            }}
          >
            {button}
          </Box>
        </Box>
      </>
    );
  }
);