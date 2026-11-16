// contexts & globals
//

// react & next
import React from "react";

// external dependencies
import {
  Box,
  Typography,
  Grid,
  Button,
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
  OrangeryTag,
  OrangeryDataOverviewButton,
  OrangeryShowQRCodeButton,
  OrangeryNavigationPlaceholder,
  OrangeryFilter,
  OrangerySortAutocomplete
} from "../../../../OrangeryElements";
import OpenLockButton from "./OpenLockButton"
import EditLockButton from "./EditLockButton"
import { ISort } from "../../../../OrangeryElements/OrangerySortAutocomplete";

// queries & backend
import {
  ILock,
  useLocks
} from "../../../../../queries/apps/saltoKs";

// icons, images & colors
import ArrowDownAZIcon from "../../../../../assets/svg/arrowDownAZ.svg";
import ArrowUpZAIcon from "../../../../../assets/svg/arrowUpZA.svg";
import PlaceholderSvg from "../../../../../assets/svg/placeholders/default.svg";
import SearchIcon from "@mui/icons-material/Search";

const searchOptions = {
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
  keys: [
    "lock_id",
    "lock_name",
    "lock_location",
    "iq.iq_name",
  ],
};

const sortItems: ISort[] = [
  {
    name: "Name",
    value: "Name",
  },
  {
    name: "Location",
    value: "Location",
  },
  {
    name: "Created Date",
    value: "Created Date",
  },
];

export class LocksListState {
  public sortBy = "";
  public asce: boolean = true;
  public noFilter: boolean = false;
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
  locks: ILock[],
  filterBy: string[],
  search: string,
  sortBy: string,
  asce: boolean
) {
  let locksList = [...locks];
  if (search) {
    const fuse = new Fuse(locksList, searchOptions);
    locksList = fuse.search(search).map((r) => r.item);
  }
  if (filterBy) {
    locksList = filter(locksList, filterBy);
  }
  locksList = sort(locksList, sortBy, asce);
  return locksList;
}

function filter(locks: ILock[], filterBy: string[]) {
  let filterList = [...locks];
  filterBy.forEach((v, j) => {
    if (v === "All Statuses") { }
    else if (v === "Online")
      filterList = filterByOnline(filterList);
    else if (v === "Offline")
      filterList = filterByOffline(filterList);
  });
  return filterList;
}

function filterByOnline(locks: ILock[]) {
  return locks.filter((lock) => lock.data?.online);
}

function filterByOffline(locks: ILock[]) {
  return locks.filter((lock) => !lock.data?.online);
}

function sort(locks: ILock[], sortBy: string, asce: boolean) {
  if (sortBy) {
    switch (sortBy) {
      case "Name":
        return sortByName(locks, asce);
      case "Location":
        return sortByLocation(locks, asce);
      case "Created Date":
        return sortByCreatedDate(locks, asce);
    }
  }
  return locks;
}

function sortByName(lock: ILock[], asce: boolean) {
  if (!asce) {
    return lock.sort((a, b) =>
      a?.lock_name.toLocaleUpperCase() > b.lock_name.toLocaleUpperCase() ? 1 : -1
    );
  } else {
    return lock.sort((a, b) =>
      a.lock_name.toLocaleUpperCase() < b.lock_name.toLocaleUpperCase() ? 1 : -1
    );
  }
}

function sortByLocation(lock: ILock[], asce: boolean) {
  if (!asce) {
    return lock.sort((a, b) =>
      a?.lock_location.toLocaleUpperCase() > b.lock_location.toLocaleUpperCase() ? 1 : -1
    );
  } else {
    return lock.sort((a, b) =>
      a.lock_location.toLocaleUpperCase() < b.lock_location.toLocaleUpperCase() ? 1 : -1
    );
  }
}

function sortByCreatedDate(lock: ILock[], asce: boolean) {
  if (!asce) {
    return lock.sort((a, b) =>
      new Date(a.created) > new Date(b.created) ? 1 : -1
    );
  } else {
    return lock.sort((a, b) =>
      new Date(a.created) < new Date(b.created) ? 1 : -1
    );
  }
}

export default function LocksList() {
  const {
    data: locks,
    isLoading
  } = useLocks();
  const listState = React.useMemo(() => new LocksListState(), []);

  return <>
    {isLoading
      ? <OrangeryNavigationContentLoader />
      : locks && locks.length > 0
        ? <Box
          sx={{
            backgroundColor: "#fff",
            display: "flex",
            flexDirection: "column",
            height: "100%",
            // minHeight: 666,
            borderRadius: 1.5,
            // py: 3,
          }}
        >
          <Header listState={listState} />

          <Box
            sx={{
              overflowY: "auto",
              height: "calc(100% - 12px)",
              pr: "12px",
              display: "flex",
              flexDirection: "column",
              gap: 1,
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
                  locks,
                  listState.filterBy,
                  listState.search,
                  listState.sortBy,
                  listState.asce
                );
                return manipulatedList && manipulatedList.length > 0
                  ? <LockRows
                    locks={manipulatedList}
                    listState={listState}
                  />
                  : <OrangeryNavigationPlaceholder
                    vertical
                    width={213}
                    height={224}
                    title={"No locks!"}
                    subtitle={"Please search or filter something else."}
                    PlaceholderSvg={PlaceholderSvg}
                    addNewButtonText={""}
                  />
              }}
            </Observer>
          </Box>
        </Box>
        : <OrangeryNavigationPlaceholder
          vertical
          width={213}
          height={224}
          title={"No lock is available!"}
          subtitle={""}
          PlaceholderSvg={PlaceholderSvg}
          AddNewButton={<></>}
          addNewButtonText={""}
        />
    }
  </>;
}


const LockRows = ({
  listState,
  locks,
}: {
  listState: LocksListState;
  locks: ILock[];
}) => {
  return (
    <>
      {locks.map((lock) => {
        return (
          <LockCard
            key={lock.lock_id}
            lock={lock}
          />
        );
      })
      }
    </>
  );
};

function LockCard({ lock }: { lock: ILock }) {
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
          xs={6}
          sm={4}
          // md={3}
          lg={3}
          item
          sx={{
            display: "flex",
            // alignItems: "center",
            gap: 1,
            flexDirection: "column",
          }}
        >
          <Typography variant="h6">DOOR NAME</Typography>
          <Typography variant="h4">{lock.lock_name}</Typography>
        </Grid>
        <Grid
          xs={6}
          sm={4}
          // md={2.5}
          lg={2}
          item
          sx={{
            display: "flex",
            // alignItems: "center",
            gap: 1,
            flexDirection: "column",
          }}
        >
          <Typography variant="h6">IQ NAME</Typography>
          <Typography variant="h4">{lock.iq?.iq_name ?? "-"}</Typography>
        </Grid>
        <Grid
          xs={6}
          sm={4}
          // md={2.5}
          lg={2}
          item
          sx={{
            display: "flex",
            // alignItems: "center",
            gap: 1,
            flexDirection: "column",
          }}
        >
          <Typography variant="h6">LOCATION</Typography>
          <Typography variant="h4">{lock.lock_location ?? "-"}</Typography>
        </Grid>
        <Grid
          xs={3}
          sm={2}
          // md={1}
          lg={1}
          item
          sx={{
            display: "flex",
            // alignItems: "center",
            gap: 1,
            flexDirection: "column",
          }}
        >
          <Typography variant="h6">BATTERY</Typography>
          <Typography variant="h4">{lock.data?.battery_level ?? "-"}</Typography>
        </Grid>
        <Box
          sx={{
            flex: 1,
            display: {
              xs: "none",
              lg: "flex"
            }
          }}
        />
        <Grid
          item
          xs={6}
          sm={6}
          // md={3}
          lg={2.5}
          sx={{
            display: "flex",
            flexDirection: "row",
            flex: "none",
            textAlign: "right",
            justifyContent: "end",
            alignItems: "center",
            gap: 1,
            ml: {
              xs: "auto",
              lg: "unset"
            },
            mt: {
              xs: 2,
              lg: 0
            },
          }}
        >
          {/* <DoorAccessOverviewButton lock={lock} /> */}
          <OrangeryTag
            options={[
              {
                label: "Online",
                colors: {
                  dark: "#42B863",
                  light: "#42B8631A"
                }
              },
              {
                label: "Offline",
                colors: {
                  dark: "#FF3D00",
                  light: "#FF3D001A"
                }
              },
            ]}
            selectedLabel={lock.data?.online ? "Online" : "Offline"}
            height={22}
            minWidth={76}
          />
          <OpenLockButton lock={lock} disabled={!lock.data?.online} />
          <OrangeryShowQRCodeButton
            assetType={"door"}
            uuid={lock.lock_id}
            name={lock.lock_name}
          />
          <OrangeryDataOverviewButton data={lock.data} codeStyle disabled={!lock.data} />
          <EditLockButton lock={lock} />
        </Grid>
      </Grid>
    </>
  );
}

const Header = observer(
  ({
    button,
    listState,
  }: {
    button?: JSX.Element;
    listState: LocksListState;
  }) => {
    const handleFilter = debounce((value: string) => {
      listState.setSearch(value);
    }, 500);

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
            sx={{
              flexGrow: 1,
              display: "flex",
              alignItems: "center",
              gap: 1,
              pt: 1,
            }}
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
                  "& .MuiInput-input": {
                    fontSize: "17px !important",
                    fontWeight: "400 !important",
                    color: "#505357 !important",
                  },
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
              <OrangerySortAutocomplete
                sortItems={sortItems}
                name="sortBy"
                placeholder="Sort By..."
                value={listState.sortBy}
                onChange={(newValue: string) => {
                  listState.setSortBy(newValue);
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
                onClick={() => listState.setDesc(listState.asce)}
                sx={{ backgroundColor: "#F9F9FA", p: 2, borderRadius: "5px" }}
              >
                {listState.asce ? (
                  <ArrowUpZAIcon className="arrow-icon" />
                ) : (
                  <ArrowDownAZIcon className="arrow-icon" />
                )}
              </Button>
            </Box>
            <OrangeryFilter
              // multiSelect
              width={300}
              selectedValues={listState.filterBy}
              options={[
                "All Statuses",
                "Online",
                "Offline",
              ]}
              onChange={(newValues) => {
                newValues.forEach((e: any) => {
                  const i = listState.filterBy.findIndex((v) => v === e);
                  if (i === -1) {
                    listState.pushToFilterList(e);
                  }
                });
                [...listState.filterBy].forEach((v) => {
                  const i = newValues.findIndex((e: any) => v === e);
                  if (i === -1) {
                    const j = listState.filterBy.findIndex((t) => t === v);
                    listState.deleteFromFilterList(j);
                  }
                });
              }}
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