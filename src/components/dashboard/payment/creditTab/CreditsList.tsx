import AddNewCreditButton from "./AddNewCreditButton";

// react & next
import React, { useState } from "react";

// external dependencies
import {
  Box,
  Button,
  debounce,
  Grid,
  IconButton,
  Input,
  InputAdornment,
  Paper,
  Typography,
} from "@mui/material";
import PlaceholderSvg from "../../../../assets/svg/placeholders/desks2.svg";
import Search from "@mui/icons-material/Search";
import ArrowDownAZIcon from "../../../../assets/svg/arrowDownAZ.svg";
import ArrowUpZAIcon from "../../../../assets/svg/arrowUpZA.svg";
import Fuse from "fuse.js";

// icons, images & colors
import { ICredit, useCredits } from "../../../../queries/credit";
import { useGlobalState } from "../../../../Contexts & Globals/GlobalContext";
import {
  OrangeryNavigationContentLoader,
  OrangeryNavigationPlaceholder,
  OrangeryText,
  OrangeryUserCircle,
} from "../../../OrangeryElements";
import EditCreditButton from "./EditCreditButton";
import { observer, Observer } from "mobx-react-lite";
import DeleteCreditButton from "./DeleteCreditButton";
import { makeAutoObservable } from "mobx";
import SortCreditsAutocomplete from "./SortCreditsAutocomplete";
import FilterCredit from "./FilterCredit";
import OrangeryNoSearchResultPlaceholder from "../../../OrangeryElements/OrangeryNoSearchResultPlaceholder";

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

export class CreditSortState {
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
  credit: ICredit[],
  filterBy: string[],
  search: string,
  sortBy: string,
  asce: boolean
) {
  let CreditList = [...credit];
  if (search) {
    const fuse = new Fuse(CreditList, options);
    CreditList = fuse.search(search).map((r) => r.item);
  }
  if (filterBy) {
    CreditList = CreditFilter(CreditList, filterBy);
  }
  CreditList = CreditsSort(CreditList, sortBy, asce);
  return CreditList;
}

function CreditFilter(credit: ICredit[], filterBy: string[]) {
  if (filterBy.includes("Created Date")) {
    return credit.filter((credit) => new Date(credit.created));
  }

  return credit;
}
function CreditsSort(credit: ICredit[], sortBy: string, asce: boolean) {
  if (sortBy) {
    switch (sortBy) {
      case "Name":
        return sortByName(credit, asce);
      case "Email":
        return sortByEmail(credit, asce);
      case "Number of Credit":
        return sortByBalance(credit, asce);
      case "Created Date":
        return sortByCreatedDate(credit, asce);
    }
  }
  return credit;
}

function sortByName(credit: ICredit[], asce: boolean) {
  if (asce) {
    return credit?.sort((a, b) =>
      a?.name.toLocaleUpperCase() < b?.name.toLocaleUpperCase() ? 1 : -1
    );
  } else {
    return credit?.sort((a, b) =>
      a.name.toLocaleUpperCase() > b.name.toLocaleUpperCase() ? 1 : -1
    );
  }
}
function sortByEmail(credit: ICredit[], asce: boolean) {
  if (asce) {
    return credit?.sort((a, b) =>
      a?.email.toLocaleUpperCase() < b?.email.toLocaleUpperCase() ? 1 : -1
    );
  } else {
    return credit?.sort((a, b) =>
      a.email.toLocaleUpperCase() > b.email.toLocaleUpperCase() ? 1 : -1
    );
  }
}
function sortByBalance(credit: ICredit[], asce: boolean) {
  if (asce) {
    return credit?.sort((a, b) => (a?.balance < b?.balance ? 1 : -1));
  } else {
    return credit?.sort((a, b) => (a?.balance > b?.balance ? 1 : -1));
  }
}
function sortByCreatedDate(visitor: ICredit[], asce: boolean) {
  if (!asce) {
    return visitor.sort((a, b) =>
      new Date(a.created) > new Date(b.created) ? 1 : -1
    );
  } else {
    return visitor.sort((a, b) =>
      new Date(a.created) < new Date(b.created) ? 1 : -1
    );
  }
}

export default function CreditsList() {
  const globalState = useGlobalState();
  const {
    data: credits,
    isLoading,
    isError,
  } = useCredits(globalState.office_uuid);
  const state = React.useMemo(() => new CreditSortState(), []);

  return (
    <>
      {isLoading ? (
        <OrangeryNavigationContentLoader />
      ) : credits && credits.length > 0 ? (
        <Box
          sx={{
            backgroundColor: "#fff  ",
            display: "flex",
            flexDirection: "column",
            height: "100%",
            // minHeight: 666,
            borderRadius: 1.5,
            py: 3,
            px: 2,
          }}
        >
          <Header button={<AddNewCreditButton />} state={state} />
          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              pt: 2,
              columnGap: 1,
              alignContent: "flex-start",
              overflowY: "auto",
              height: "calc(100% - 76px)",
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
                const sortedSearchedList = getSortedSearchedList(
                  credits,
                  state.filterBy,
                  state.search,
                  state.sortBy,
                  state.asce
                );
                return sortedSearchedList && sortedSearchedList.length > 0 ? (
                  <CreditRows credits={sortedSearchedList} state={state} />
                ) : (
                  <OrangeryNoSearchResultPlaceholder />
                );
              }}
            </Observer>
          </Box>
        </Box>
      ) : (
        <OrangeryNavigationPlaceholder
          title={"Start by assigning credits to employee!"}
          subtitle={"Assign credits to your employee"}
          PlaceholderSvg={PlaceholderSvg}
          AddNewButton={<AddNewCreditButton />}
          addNewButtonText={""}
        />
      )}
    </>
  );
}

const CreditRows = ({
  state,
  credits,
}: {
  state: CreditSortState;
  credits: ICredit[];
}) => {
  return (
    <>
      {credits.map((credit) => (
        <CreditCard key={credit.uuid} credit={credit} />
      ))}
    </>
  );
};

function CreditCard({ credit }: { credit: ICredit }) {
  const [open, setOpen] = React.useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  const [hover, setHover] = useState(false);
  return (
    <>
      <Box
        onMouseOver={() => setHover(true)}
        onMouseOut={() => setHover(false)}
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          // alignItems: "end",
          position: "relative",
          width: "414px",
          borderRadius: "15px",
          height: "136px",
          px: 2,
          mx: 1,
          mt: 1.2,
          mb: 1.2,
          transition: "0.2s",
          backgroundColor: "white",
          boxShadow: "1px 1px 8px #0000002b",
          "&:hover": {
            boxShadow: "rgb(0 0 0 / 26%) 2px 3px 17px 0px",
            transitionTimingFunction: "ease-in-out",
            backgroundColor: "#fff !important",
            transition: "0.2s",
            transitionDuration: "0.2s",
            cursor: "pointer",
          },
        }}
      >
        <Box
          sx={{
            position: "absolute",
            top: "-22px",
            right: "27px",
            gap: 1,
            display: hover ? "flex" : "none",
            // display: "flex",
            cursor: hover ? "pointer" : "default",
            "& .icon": {
              width: "1rem",
              height: "1rem",
            },
          }}
        >
          <EditCreditButton credit={credit} />
          <DeleteCreditButton credit={credit} handleCloseForm={handleClose} />
        </Box>
        <Box sx={{ display: "flex" }}>
          <Box
            sx={{
              display: "flex",
              gap: 3,
              flexGrow: 1,
              alignItems: "center",
            }}
          >
            <OrangeryUserCircle
              name={credit.name}
              fileName={credit.image}
              notHoverable={1}
            />
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                width: 194,
              }}
            >
              <Typography variant="h4">
                <OrangeryText text={credit.name} limit={20} />
              </Typography>
              <Typography variant="h6" color="primary.light">
                <OrangeryText text={credit.email} limit={30} />
              </Typography>
            </Box>
          </Box>

          <Box
            sx={{
              width: "112px",
              height: "100px",
              borderRadius: 3,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              backgroundColor: "rgb(243 243 243)",
              flex: "none",
            }}
          >
            <Typography fontSize={40} fontWeight={700} color="#2B2E33">
              <Observer>{() => <>{credit.balance}</>}</Observer>
            </Typography>
            <Typography variant="h5" color="#A5AAB4" fontWeight={600}>
              Credit{credit.balance === 1 ? "" : "s"}
            </Typography>
          </Box>
        </Box>
      </Box>
    </>
  );
}

const Header = observer(
  ({ button, state }: { button?: JSX.Element; state: CreditSortState }) => {
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
                    <Search />
                  </InputAdornment>
                }
              />
            </Box>
            <Box sx={{ minWidth: 264, maxWidth: 400 }}>
              <SortCreditsAutocomplete
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
