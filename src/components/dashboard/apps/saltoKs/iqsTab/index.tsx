// contexts & globals
// import { useGlobalState } from "../../../../../Contexts & Globals/GlobalContext";

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
  OrangeryNavigationPlaceholder,
  OrangeryFilter,
  OrangerySortAutocomplete
} from "../../../../OrangeryElements";
import ConnectIqButton from "./ConnectIqButton"
import { ISort } from "../../../../OrangeryElements/OrangerySortAutocomplete";

// queries & backend
import {
  IIq,
  useIqs
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
    "iq_id",
    "iq_name",
    "location",
  ],
};

const sortItems: ISort[] = [
  {
    name: "Name",
    value: "Name",
  },
  {
    name: "Created Date",
    value: "Created Date",
  },
];

export class IqsListState {
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
  iqs: IIq[],
  filterBy: string[],
  search: string,
  sortBy: string,
  asce: boolean
) {
  let iqsList = [...iqs];
  if (search) {
    const fuse = new Fuse(iqsList, searchOptions);
    iqsList = fuse.search(search).map((r) => r.item);
  }
  if (filterBy) {
    iqsList = filter(iqsList, filterBy);
  }
  iqsList = sort(iqsList, sortBy, asce);
  return iqsList;
}

function filter(iqs: IIq[], filterBy: string[]) {
  let filterList = [...iqs];
  filterBy.forEach((v, j) => {
    if (v === "All Statuses") { }
    else if (v === "Connected")
      filterList = filterByConnected(filterList);
    else if (v === "Disconnected")
      filterList = filterByDisconnected(filterList);
    else if (v === "Online")
      filterList = filterByOnline(filterList);
    else if (v === "Offline")
      filterList = filterByOffline(filterList);
  });
  return filterList;
}

function filterByConnected(iqs: IIq[]) {
  return iqs.filter((iq) => iq.connected);
}

function filterByDisconnected(iqs: IIq[]) {
  return iqs.filter((iq) => !iq.connected);
}

function filterByOnline(iqs: IIq[]) {
  return iqs.filter((iq) => iq.data?.online);
}

function filterByOffline(iqs: IIq[]) {
  return iqs.filter((iq) => !iq.data?.online);
}

function sort(iqs: IIq[], sortBy: string, asce: boolean) {
  if (sortBy) {
    switch (sortBy) {
      case "Name":
        return sortByName(iqs, asce);
      case "Created Date":
        return sortByCreatedDate(iqs, asce);
    }
  }
  return iqs;
}

function sortByName(iq: IIq[], asce: boolean) {
  if (!asce) {
    return iq.sort((a, b) =>
      a?.iq_name.toLocaleUpperCase() > b.iq_name.toLocaleUpperCase() ? 1 : -1
    );
  } else {
    return iq.sort((a, b) =>
      a.iq_name.toLocaleUpperCase() < b.iq_name.toLocaleUpperCase() ? 1 : -1
    );
  }
}

function sortByCreatedDate(iq: IIq[], asce: boolean) {
  if (!asce) {
    return iq.sort((a, b) =>
      new Date(a.created) > new Date(b.created) ? 1 : -1
    );
  } else {
    return iq.sort((a, b) =>
      new Date(a.created) < new Date(b.created) ? 1 : -1
    );
  }
}

export default function IqsList() {
  const {
    data: iqs,
    isLoading
  } = useIqs();
  const listState = React.useMemo(() => new IqsListState(), []);

  return <>
    {isLoading
      ? <OrangeryNavigationContentLoader />
      : iqs && iqs.length > 0
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
                  iqs,
                  listState.filterBy,
                  listState.search,
                  listState.sortBy,
                  listState.asce
                );
                return manipulatedList && manipulatedList.length > 0
                  ? <IqRows
                    iqs={manipulatedList}
                    listState={listState}
                  />
                  : <OrangeryNavigationPlaceholder
                    vertical
                    width={213}
                    height={224}
                    title={"No IQs!"}
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
          title={"No IQ is available!"}
          subtitle={""}
          PlaceholderSvg={PlaceholderSvg}
          AddNewButton={<></>}
          addNewButtonText={""}
        />
    }
  </>;
}

const IqRows = ({
  listState,
  iqs,
}: {
  listState: IqsListState;
  iqs: IIq[];
}) => {
  return (
    <>
      {iqs.map((iq) => {
        return (
          <IqCard
            key={iq.uuid}
            iq={iq}
          />
        );
      })}
    </>
  );
};

function IqCard({ iq }: { iq: IIq }) {
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
          // gap: 1,
        }}
      >
        <Grid
          xs={12}
          sm={6}
          md={4}
          item
          sx={{
            display: "flex",
            // alignItems: "center",
            gap: 1,
            flexDirection: "column",
          }}
        >
          <Typography variant="h6">IQ NAME</Typography>
          <Typography variant="h4">{iq.iq_name ?? "-"}</Typography>
        </Grid>
        <Grid
          xs={12}
          sm={6}
          md={4}
          item
          sx={{
            display: "flex",
            // alignItems: "center",
            gap: 1,
            flexDirection: "column",
          }}
        >
          <Typography variant="h6">ID</Typography>
          <Typography variant="h4">{iq.iq_id ?? "-"}</Typography>
        </Grid>
        {/* {iq.location &&
          <Grid
            xs={2}
            sm={2}
            item
            sx={{
              display: "flex",
              // alignItems: "center",
              gap: 1,
              flexDirection: "column",
            }}
          >
            <Typography variant="h6">LOCATION</Typography>
            <Typography variant="h4">{iq.location ?? "-"}</Typography>
          </Grid>
        } */}
        <Box
          sx={{
            flex: 1,
            display: {
              xs: "none",
              md: "flex"
            }
          }}
        />
        <Grid
          item
          xs={6}
          sm={6}
          md={4}
          sx={{
            display: "flex",
            flexDirection: "row",
            flex: "none",
            textAlign: "right",
            justifyContent: "end",
            gap: 1,
            ml: {
              xs: "auto",
              md: "unset"
            },
            mt: {
              xs: 2,
              md: 0
            },
          }}
        >
          {/* <OrangeryShowQRCodeButton
            assetType={"iq"}
            uuid={iq.uuid}
            name={iq.name}
          /> */}
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
            selectedLabel={iq.data?.online ? "Online" : "Offline"}
            height={22}
            minWidth={76}
          />
          {iq.connected
            ? <OrangeryTag
              options={[
                {
                  label: "Connected",
                  colors: {
                    dark: "#42B863",
                    light: "#42B8631A"
                  }
                },
              ]}
              selectedLabel={"Connected"}
              height={22}
              minWidth={76}
            />
            : <ConnectIqButton iq={iq} />
          }
          <OrangeryDataOverviewButton data={iq.data} codeStyle disabled={!iq.data} />
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
    listState: IqsListState;
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
                "Connected",
                "Disconnected",
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