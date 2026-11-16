// contexts & globals
import { useGlobalState } from "../../../Contexts & Globals/GlobalContext";
import Search from "@mui/icons-material/Search";
import ArrowDownAZIcon from "../../../assets/svg/arrowDownAZ.svg";
import ArrowUpZAIcon from "../../../assets/svg/arrowUpZA.svg";
import Fuse from "fuse.js";
// react & next
import React, { useEffect } from "react";

// external dependencies
import {
  Box,
  Button,
  debounce,
  Fade,
  Grid,
  IconButton,
  Input,
  InputAdornment,
  Tooltip,
  Typography,
} from "@mui/material";
import { useVirtualizer } from "@tanstack/react-virtual";
// orangery elements & internal dependencies
import AddNewVisitorButton from "./AddNewVisitorButton";
import EditVisitorButton from "./EditVisitorButton";
import {
  OrangeryNavigationPlaceholder,
  OrangeryUserCircle,
  OrangeryReadOnlySwitch,
  OrangeryNavigationContentLoader,
  OrangeryTooltip,
  OrangeryText,
} from "../../OrangeryElements";

// queries & backend
import {
  IVisitor,
  IVisitorResult,
  IVisitorType,
  useVisitor,
  useVisitors,
} from "../../../queries/visitor";

// icons, images & colors
import PlaceholderSvg from "../../../assets/svg/placeholders/visitors.svg";
import FileIcon from "../../../assets/svg/file.svg";
import FileLockIcon from "../../../assets/svg/file-lock.svg";
import { makeAutoObservable } from "mobx";
import { observer, Observer } from "mobx-react-lite";
import SortVisitorsAutocomplete from "./SortVisitorsAutocomplete";
import { CopyToClipboard } from "react-copy-to-clipboard";
import CopyLinkButton from "./CopyLinkButton";
import OrangeryNoSearchResultPlaceholder from "../../OrangeryElements/OrangeryNoSearchResultPlaceholder";

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
  keys: ["visitor.name", "visitor.email", "visitor.host.name"],
};

export class VisitorSortState {
  public sortBy = "";
  public asce: boolean = true;
  public search: string = "";

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
}

function getSortedSearchedList(
  visitors: IVisitorType[],
  search: string,
  sortBy: string,
  asce: boolean
) {
  let sortedSearchedVisitorList = [...visitors];
  if (search) {
    const fuse = new Fuse(sortedSearchedVisitorList, options);
    sortedSearchedVisitorList = fuse.search(search).map((r) => r.item);
  }
  sortedSearchedVisitorList = sortVisitors(
    sortedSearchedVisitorList,
    sortBy,
    asce
  );
  return sortedSearchedVisitorList;
}

function sortVisitors(visitors: IVisitorType[], sortBy: string, asce: boolean) {
  if (sortBy) {
    switch (sortBy) {
      case "Name":
        return sortByName(visitors, asce);
      case "Email":
        return sortByEmail(visitors, asce);
      case "Host":
        return sortByHost(visitors, asce);
      case "Arrival Time":
        return sortByArrivalTime(visitors, asce);
      case "Created Date":
        return sortByCreatedDate(visitors, asce);
    }
  }
  return visitors;
}

function sortByName(visitor: IVisitorType[], asce: boolean) {
  if (asce) {
    return visitor?.sort((a, b) =>
      a?.visitor.name.toLocaleUpperCase() < b?.visitor.name.toLocaleUpperCase()
        ? 1
        : -1
    );
  } else {
    return visitor?.sort((a, b) =>
      a.visitor.name.toLocaleUpperCase() > b.visitor.name.toLocaleUpperCase()
        ? 1
        : -1
    );
  }
}
function sortByEmail(visitor: IVisitorType[], asce: boolean) {
  if (!asce) {
    return visitor.sort((a, b) =>
      a.visitor.email.toLocaleUpperCase() > b.visitor.email.toLocaleUpperCase()
        ? 1
        : -1
    );
  } else {
    return visitor.sort((a, b) =>
      a.visitor.email.toLocaleUpperCase() < b.visitor.email.toLocaleUpperCase()
        ? 1
        : -1
    );
  }
}
function sortByHost(visitor: IVisitorType[], asce: boolean) {
  if (!asce) {
    return visitor.sort((a, b) =>
      a.host?.name.toLocaleUpperCase() > b.host?.name.toLocaleUpperCase()
        ? 1
        : -1
    );
  } else {
    return visitor.sort((a, b) =>
      a.host?.name.toLocaleUpperCase() < b.host?.name.toLocaleUpperCase()
        ? 1
        : -1
    );
  }
}
function sortByArrivalTime(visitor: IVisitorType[], asce: boolean) {
  if (!asce) {
    return visitor.sort((a, b) =>
      new Date(a.arrival) > new Date(b.arrival) ? 1 : -1
    );
  } else {
    return visitor.sort((a, b) =>
      new Date(a.arrival) < new Date(b.arrival) ? 1 : -1
    );
  }
}
function sortByCreatedDate(visitor: IVisitorType[], asce: boolean) {
  if (!asce) {
    return visitor.sort((a, b) =>
      new Date(a.created_date) < new Date(b.created_date) ? 1 : -1
    );
  } else {
    return visitor.sort((a, b) =>
      new Date(a.created_date) > new Date(b.created_date) ? 1 : -1
    );
  }
}

export default function VisitorsList() {
  const globalState = useGlobalState();
  const state = React.useMemo(() => new VisitorSortState(), []);
  const { data: visitors, isLoading } = useVisitors(globalState.office_uuid);

  return (
    <>
      <Observer>
        {() => (
          <>
            {isLoading ? (
              <OrangeryNavigationContentLoader />
            ) : visitors && visitors.length > 0 ? (
              <Box
                sx={{
                  backgroundColor: "#fff",
                  display: "flex",
                  flexDirection: "column",
                  // justifyContent: "start",
                  height: "100%",
                  minHeight: 666,
                  borderRadius: 1.5,
                  py: 3,
                  px: 2,
                  "& .scroll-align": {
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
                  },
                }}
              >
                <Header
                  button={<AddNewVisitorButton />}
                  copyRegisterLink={
                    <CopyLinkButton
                      office_uuid={globalState.currentOffice.uuid}
                      host_uuid={globalState.currentUser.uuid}
                    />
                  }
                  state={state}
                />
                <Observer>
                  {() => {
                    const sortedSearchedList = getSortedSearchedList(
                      visitors,
                      state.search,
                      state.sortBy,
                      state.asce
                    );
                    return (
                      <>
                        <Typography variant="H6" component="h6">
                          {`${sortedSearchedList.length === visitors.length
                            ? "Total "
                            : ""
                            }visitors: ${sortedSearchedList.length} visitor${sortedSearchedList.length !== 0 &&
                              sortedSearchedList.length !== 1
                              ? "s"
                              : ""
                            }`}
                        </Typography>
                        {sortedSearchedList && sortedSearchedList.length > 0 ? (
                          <VisitorRows
                            visitors={sortedSearchedList}
                            state={state}
                          />
                        ) : (
                          <OrangeryNoSearchResultPlaceholder />
                        )}
                      </>
                    );
                  }}
                </Observer>
              </Box>
            ) : (
              <OrangeryNavigationPlaceholder
                title={"Deliver an exceptional visitor experience"}
                subtitle={
                  "Provide job candidates, clients, and other office guests with a seamless experience from start to finish."
                }
                PlaceholderSvg={PlaceholderSvg}
                AddNewButton={<AddNewVisitorButton />}
                CopyRegisterLink={
                  <CopyLinkButton
                    office_uuid={globalState.currentOffice.uuid}
                    host_uuid={globalState.currentUser.uuid}
                  />
                }
                addNewButtonText={""}
              />
            )}
          </>
        )}
      </Observer>
    </>
  );
}

const VisitorRows = ({
  state,
  visitors,
}: {
  state: VisitorSortState;
  visitors: IVisitorType[];
}) => {
  return (
    <div
      style={{
        height: `calc(100vh - 72px)`,
        overflow: "auto",
      }}
      className="scroll-align"
    >
      {visitors.map((visitor) => (
        <VisitorRow key={visitor.uuid} visitor={visitor} />
      ))}
    </div>
  );
};

function VisitorRow({ visitor }: { visitor: IVisitorType }) {
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
          alignItems: "stretch",
          borderRadius: 1.5,
          mb: 1.2,
          mx: 0,
          fontSize: 16,
          fontWeight: 500,
        }}
      >
        <Grid
          xs={12}
          sm={4}
          md={2}
          item
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 3,
            "& .memo-icon": { width: "1.3rem" },
          }}
        >
          <OrangeryUserCircle
            name={visitor.visitor.name}
            fileName={
              typeof visitor.visitor?.image === "string"
                ? visitor.visitor?.image
                : undefined
            }
          />
          <Box
            sx={{
              display: "block",
              alignItems: "center",
              "& .visitor-email": { textDecoration: "underline" },
              "& .visitor-name": { textTransform: "capitalize" },
            }}
          >
            <Typography variant="h6">VISITOR NAME</Typography>
            <Typography variant="h4" className="visitor-name">
              <OrangeryText text={visitor.visitor.name} limit={10} />
            </Typography>
            <Typography variant="h6" className="visitor-email">
              <OrangeryText text={visitor.visitor.email} limit={20} />
            </Typography>
          </Box>
        </Grid>
        <Grid
          item
          xs={4}
          sm={4}
          md={2}
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 1,
            "& .host-name": { textTransform: "capitalize" },
          }}
        >
          <Typography variant="h6">Host</Typography>
          <Typography variant="h4" className="host-name">
            <OrangeryText text={visitor.host?.name} limit={15} />
          </Typography>
          {/* <Typography variant="h4">Maryam Koraee</Typography> */}
        </Grid>
        <Grid
          item
          xs={5}
          sm={3}
          md={2}
          sx={{ display: "flex", flexDirection: "column", gap: 1 }}
        >
          <Typography variant="h6">Arrival Time</Typography>
          <Typography variant="h4">
            {new Date(visitor.arrival).toLocaleString("de-DE", {
              month: "long",
              year: "numeric",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
              hourCycle: "h24",
            })}
          </Typography>
        </Grid>
        <Grid
          item
          xs={3}
          sm={4}
          md={1}
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 0,
            "& .memo-icon": { width: "1.3rem", height: "1.3rem" },
          }}
        >
          <Typography variant="h6">Notes</Typography>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Box>
              {visitor.private_note ? (
                <OrangeryTooltip
                  title={visitor.private_note}
                  placement="bottom-start"
                  TransitionComponent={Fade}
                  TransitionProps={{ timeout: 600 }}
                >
                  <Box>
                    <IconButton>
                      <FileLockIcon className="memo-icon" />
                    </IconButton>
                  </Box>
                </OrangeryTooltip>
              ) : (
                <OrangeryTooltip
                  title="No Note For Admin"
                  placement="bottom-start"
                  TransitionComponent={Fade}
                  TransitionProps={{ timeout: 600 }}
                >
                  <Box>
                    <IconButton disabled={!visitor.private_note}>
                      <FileLockIcon className="memo-icon" />
                    </IconButton>
                  </Box>
                </OrangeryTooltip>
              )}
            </Box>
            <Box>
              {visitor.public_note ? (
                <OrangeryTooltip
                  title={visitor.public_note}
                  placement="bottom-start"
                  TransitionComponent={Fade}
                  TransitionProps={{ timeout: 600 }}
                >
                  <Box>
                    <IconButton>
                      <FileIcon className="memo-icon" />
                    </IconButton>
                  </Box>
                </OrangeryTooltip>
              ) : (
                <OrangeryTooltip
                  title="No Note For Visitor"
                  placement="bottom-start"
                  TransitionComponent={Fade}
                  TransitionProps={{ timeout: 600 }}
                >
                  <Box>
                    <IconButton disabled={!visitor.public_note}>
                      <FileIcon className="memo-icon" />
                    </IconButton>
                  </Box>
                </OrangeryTooltip>
              )}
            </Box>
          </Box>
        </Grid>
        <Grid item xs={4} sm={4} md={2} sx={{ paddingTop: "15px" }}>
          <OrangeryReadOnlySwitch
            label={{ checked: "Checked In", unchecked: "Checked Out" }}
            checked={visitor.arrived}
          />
        </Grid>
        <Grid
          item
          xs={3}
          sm={3}
          md={1}
          textAlign={"right"}
          alignItems={"center"}
          sx={{ paddingTop: "15px" }}
        >
          <EditVisitorButton visitor={visitor} />
        </Grid>
      </Grid>
    </>
  );
}

const Header = observer(
  ({
    button,
    state,
    copyRegisterLink,
  }: {
    button?: JSX.Element;
    copyRegisterLink?: JSX.Element;
    state: VisitorSortState;
  }) => {
    const handleFilter = debounce((value: string) => {
      state.setSearch(value);
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
            sx={{ flexGrow: 1, display: "flex", alignItems: "center", gap: 1 }}
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
                sx={{ width: "100%" }}
                placeholder="search ..."
                endAdornment={
                  <InputAdornment position="end">
                    <Search />
                  </InputAdornment>
                }
              />
            </Box>
            <Box sx={{ minWidth: 264, maxWidth: 400 }}>
              <SortVisitorsAutocomplete
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
                minWidth: 300,
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
          </Box>
          {copyRegisterLink}

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
