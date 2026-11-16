// contexts & globals
import Search from "@mui/icons-material/Search";
import ArrowDownAZIcon from "../../../../assets/svg/arrowDownAZ.svg";
import ArrowUpZAIcon from "../../../../assets/svg/arrowUpZA.svg";
import Fuse from "fuse.js";
// react & next
import React from "react";
import ReviewIcon from "../../../../assets/svg/content-management-review.svg";

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
import {
  OrangeryNavigationPlaceholder,
  OrangeryUserCircle,
  OrangeryReadOnlySwitch,
  OrangeryNavigationContentLoader,
  OrangeryTooltip,
  OrangeryText,
  OrangerySortAutocomplete,
  OrangeryToast,
} from "../../../OrangeryElements";

// icons, images & colors
import PlaceholderSvg from "../../../../assets/svg/placeholders/content-management.svg";
import FileIcon from "../../../assets/svg/file.svg";
import FileLockIcon from "../../../assets/svg/file-lock.svg";
import { makeAutoObservable } from "mobx";
import { observer, Observer } from "mobx-react-lite";
import OrangeryNoSearchResultPlaceholder from "../../../OrangeryElements/OrangeryNoSearchResultPlaceholder";
import { useGlobalState } from "../../../../Contexts & Globals/GlobalContext";
import { ISort } from "../../../OrangeryElements/OrangerySortAutocomplete";
import { ValueState } from "../../../../states/mobx-form";
import ContentRow from "./ContentRow";
import {
  IReportedUser,
  useReportedUser,
} from "../../../../queries/content-management";

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
  keys: ["name", "email", "reported_by.name", "reported_by.email"],
};
export class ReportedUserSortState {
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

function sortReportedUser(
  reportedUsers: IReportedUser[],
  sortBy: string,
  asce: boolean
) {
  if (sortBy) {
    switch (sortBy) {
      case "Reported By":
        return sortByReportedBy(reportedUsers, asce);
      case "Created Date":
        return sortByCreatedDate(reportedUsers, asce);
    }
  }
  return reportedUsers;
}

function sortByReportedBy(reportedUsers: IReportedUser[], asce: boolean) {
  if (asce) {
    return reportedUsers?.sort((a, b) =>
      a?.reported_by.name.toLocaleUpperCase() <
        b?.reported_by.name.toLocaleUpperCase()
        ? 1
        : -1
    );
  } else {
    return reportedUsers?.sort((a, b) =>
      a.reported_by.name.toLocaleUpperCase() >
        b.reported_by.name.toLocaleUpperCase()
        ? 1
        : -1
    );
  }
}

function sortByCreatedDate(reportedUsers: IReportedUser[], asce: boolean) {
  if (!asce) {
    return reportedUsers.sort((a, b) =>
      new Date(a.date) < new Date(b.date) ? 1 : -1
    );
  } else {
    return reportedUsers.sort((a, b) =>
      new Date(a.date) > new Date(b.date) ? 1 : -1
    );
  }
}

function getSortedSearchedList(
  reportedUsers: IReportedUser[],
  search: string,
  sortBy: string,
  asce: boolean
) {
  let sortedSearchedReportedUserList = [...reportedUsers];
  if (search) {
    const fuse = new Fuse(reportedUsers, options);
    sortedSearchedReportedUserList = fuse.search(search).map((r) => r.item);
  }
  sortedSearchedReportedUserList = sortReportedUser(
    sortedSearchedReportedUserList,
    sortBy,
    asce
  );
  return sortedSearchedReportedUserList;
}

export default function ReportedUserTab() {
  const globalState = useGlobalState();
  const state = React.useMemo(() => new ReportedUserSortState(), []);
  const { data: reported_users, isLoading } = useReportedUser(
    globalState.office_uuid
  );

  return (
    <>
      <Observer>
        {() => (
          <>
            {isLoading ? (
              <OrangeryNavigationContentLoader />
            ) : reported_users && reported_users.length > 0 ? (
              <Box
                sx={{
                  backgroundColor: "#fff",
                  display: "flex",
                  flexDirection: "column",
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
                <Header state={state} />
                <Observer>
                  {() => {
                    const sortedSearchedList = getSortedSearchedList(
                      reported_users,
                      state.search,
                      state.sortBy,
                      state.asce
                    );

                    return (
                      <>
                        {sortedSearchedList && sortedSearchedList.length > 0 ? (
                          <ContentRows
                            contents={sortedSearchedList}
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
                vertical
                width="100.86px"
                height="81px"
                title={"No Content has been created yet"}
                subtitle={
                  "Content generated by users will be seen in this section."
                }
                PlaceholderSvg={PlaceholderSvg}
                AddNewButton={<></>}
                addNewButtonText={""}
              />
            )}
          </>
        )}
      </Observer>
    </>
  );
}

const ContentRows = ({
  state,
  contents,
}: {
  state: ReportedUserSortState;
  contents: IReportedUser[];
}) => {
  return (
    <div
      style={{
        height: `calc(100vh - 72px)`,
        overflow: "auto",
      }}
      className="scroll-align"
    >
      {contents.map((content, index) => (
        <ContentRow key={index} content={content} />
      ))}
    </div>
  );
};

const Header = observer(
  ({
    button,
    state,
  }: {
    button?: JSX.Element;
    state: ReportedUserSortState;
  }) => {
    const handleFilter = debounce((value: string) => {
      state.setSearch(value);
    }, 500);

    const sortItems: ISort[] = [
      {
        name: "Reported By",
        value: "Reported By",
      },
      {
        name: "Created Date",
        value: "Created Date",
      },
    ];

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
              <OrangerySortAutocomplete
                sortItems={sortItems}
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
        </Box>
      </>
    );
  }
);
