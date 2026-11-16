// contexts & globals
//

// react & next
import React from "react";

// external dependencies
import {
  Box,
  debounce,
  Typography,
} from "@mui/material";
import { observer, Observer } from "mobx-react-lite";
import { makeAutoObservable } from "mobx";
import Fuse from "fuse.js";

// orangery elements & internal dependencies
import {
  OrangeryUserCircle,
  OrangeryTag,
  OrangeryDateTime,
  OrangeryNavigationPlaceholder,
  OrangeryFilter,
  OrangeryText,
} from "../../../OrangeryElements";

// queries & backend
import { IIssue } from "../../../../queries/issue";

// icons, images & colors
import DepartmentIcon from "../../../../assets/svg/department.svg";
import RoomIcon from "../../../../assets/svg/room/VectorRoom.svg";
import LocationIcon from "../../../../assets/svg/location-dot-regular.svg";
import LayerIcon from "../../../../assets/svg/layer.svg";
import CalendarIcon from "../../../../assets/svg/calendar-icon.svg";
import PlaceholderSvg from "../../../../assets/svg/placeholders/issues.svg";

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
  keys: ["name", "description", "sale_price", "price", "payment_method"],
};

export class IssuesListState {
  public sortBy = "";
  public asce: boolean = true;
  public noFilter: boolean = false;
  public search: string = "";
  public filterByDate: string[] = [];
  public filterByStatus: string[] = [];

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

  // isSelected(filter: string) {
  //   return !!this.filterByDate.find((v) => v === filter);
  // }

  pushToFilterByDateList(value: string) {
    if (this.filterByDate.includes(value)) {
      return;
    }
    this.filterByDate.push(value);
  }

  deleteFromFilterByDateList(value: number) {
    this.filterByDate.splice(value, 1);
  }

  pushToFilterByStatusList(value: string) {
    if (this.filterByStatus.includes(value)) {
      return;
    }
    this.filterByStatus.push(value);
  }

  deleteFromFilterByStatusList(value: number) {
    this.filterByStatus.splice(value, 1);
  }
}

function getManipulatedList(
  issues: IIssue[],
  filterByDate: string[],
  filterByStatus: string[],
  search: string,
  sortBy: string,
  asce: boolean
) {
  let issuesList = [...issues]; ////////!!!!!!!! should be deep copy
  if (search) {
    const fuse = new Fuse(issuesList, options);
    issuesList = fuse.search(search).map((r) => r.item);
  }
  if (filterByDate) {
    issuesList = handleFilterByDate(issuesList, filterByDate);
  }
  if (filterByStatus) {
    issuesList = handleFilterByStatus(issuesList, filterByStatus);
  }
  issuesList = sortList(issuesList, sortBy, asce);
  return issuesList;
}

function handleFilterByDate(issues: IIssue[], filterByDate: string[]) {
  let filteredList = [...issues];
  filterByDate.forEach((v, j) => {
    if (v === "All Dates") {
    } else if (v === "Last Day")
      filteredList = filterByDateInterval(
        filteredList,
        calculateDate(-1),
        calculateDate(0)
      );
    // filteredList = filterByLastDay(filteredList)
    else if (v === "Last 7 Days")
      filteredList = filterByDateInterval(
        filteredList,
        calculateDate(-7),
        new Date()
      );
    // filteredList = filterByLast7Days(filteredList)
    else if (v === "Last 30 Days")
      filteredList = filterByDateInterval(
        filteredList,
        calculateDate(-30),
        new Date()
      );
    // filteredList = filterByLast30Days(filteredList)
    else if (v === "Last Month")
      filteredList = filterByDateInterval(
        filteredList,
        calculateDate(0, -1),
        calculateDate(0, 0)
      );
    // filteredList = filterByLastMonth(filteredList)
    else if (v === "Last Year")
      filteredList = filterByDateInterval(
        filteredList,
        calculateDate(0, 0, -1),
        calculateDate(0, 0, 0)
      );
    // filteredList = filterByLastYear(filteredList)
  });

  return filteredList;
}

function handleFilterByStatus(issues: IIssue[], filterByStatus: string[]) {
  let filteredList = [...issues];
  filterByStatus.forEach((v, j) => {
    if (v === "All Statuses") {
    } else
      filteredList = issues.filter((issue) => calculateStatus(issue) === v);
  });
  return filteredList;
}

function calculateDate(
  daysOffset: number,
  monthsOffset?: number,
  yearsOffset?: number
) {
  let temp: any = new Date();

  if (yearsOffset !== undefined) {
    temp = new Date(
      temp.getFullYear() + yearsOffset + "-" + "01" + "-" + "01" + " 00:00:00"
    );
    return temp;
  }

  if (monthsOffset !== undefined) {
    if (temp.getMonth() + 1 + monthsOffset > 0)
      temp = new Date(
        temp.getFullYear() +
        "-" +
        (temp.getMonth() + 1 + monthsOffset) +
        "-" +
        "01" +
        " 00:00:00"
      );
    else
      temp = new Date(
        temp.getFullYear() -
        1 +
        "-" +
        (temp.getMonth() + 1 + monthsOffset + 12) +
        "-" +
        "01" +
        " 00:00:00"
      );

    return temp;
  }

  temp = new Date(temp.getTime() + daysOffset * 24 * 3600 * 1000);
  temp = new Date(
    temp.getFullYear() +
    "-" +
    (temp.getMonth() + 1) +
    "-" +
    temp.getDate() +
    " 00:00:00"
  );
  return temp;
}

function filterByDateInterval(issues: IIssue[], minDate: Date, maxDate: Date) {
  return issues.filter(
    (issue) =>
      new Date(issue.created_date) >= minDate &&
      new Date(issue.created_date) <= maxDate
  );
}
// function filterByLastDay(issues: IIssue[]) {
//   return issues.filter(issue => new Date(issue.created_date) >= calculateDate(-1) && new Date(issue.created_date) <= calculateDate(0))
// }
// function filterByLast7Days(issues: IIssue[]) {
//   return issues.filter(issue => new Date(issue.created_date) >= calculateDate(-7))
// }
// function filterByLast30Days(issues: IIssue[]) {
//   return issues.filter(issue => new Date(issue.created_date) >= calculateDate(-30))
// }
// function filterByLastMonth(issues: IIssue[]) {
//   return issues.filter(issue => new Date(issue.created_date) >= calculateDate(0, -1) && new Date(issue.created_date) <= calculateDate(0, 0))
// }
// function filterByLastYear(issues: IIssue[]) {
//   return issues.filter(issue => new Date(issue.created_date) >= calculateDate(0, 0, -1) && new Date(issue.created_date) <= calculateDate(0, 0, 0))
// }

function sortList(issues: IIssue[], sortBy: string, asce: boolean) {
  if (sortBy) {
    switch (sortBy) {
      case "Date":
        return sortByDate(issues, asce);
    }
  }
  return issues;
}

function sortByDate(issue: IIssue[], asce: boolean) {
  if (!asce) {
    return issue.sort((a, b) =>
      new Date(a.created_date) < new Date(b.created_date) ? 1 : -1
    );
  } else {
    return issue.sort((a, b) =>
      new Date(a.created_date) > new Date(b.created_date) ? 1 : -1
    );
  }
}

let statusTagOptions = [
  {
    label: "New comment",
    colors: {
      dark: "#09ACD0",
      light: "#09ACD01A",
    },
  },
  {
    label: "New issue",
    colors: {
      dark: "#FF3D00",
      light: "#FF3D001A",
    },
  },
  {
    label: "In progress",
    colors: {
      dark: "#FF9900",
      light: "#FF99001A",
    },
  },
  {
    label: "Done",
    colors: {
      dark: "#42B863",
      light: "#42B8631A",
    },
  },
];

function calculateStatus(issue: IIssue): string {
  let status = "";
  if (!issue.active) return "Done";
  else if (
    !issue.seen
    // || !(issue.comments && issue.comments?.filter((comment) => issue.user?.uuid !== comment.uuid).length)
  )
    return "New issue";
  else if (issue.new_comments) return "New comment";
  else return "In progress";
}

export default function IssuesList({
  selectedIssue,
  setSelectedIssue,
  issues,
}: {
  selectedIssue?: IIssue;
  setSelectedIssue: (selectedIssue: IIssue) => void;
  issues: IIssue[];
}) {
  const listState = React.useMemo(() => new IssuesListState(), []);

  return (
    <Box
      sx={{
        height: "100%",
        backgroundColor: "#fff",
        display: "flex",
        flexDirection: "column",
        width: "100%",
        overflowX: "hidden",
        borderRadius: 1.5,
        pb: 1,
        pt: {
          xs: 0,
          md: 0,
        },
        pr: 0.5,
      }}
    >
      <Header listState={listState} />

      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          gap: 0.5,
          pl: 1,
          alignContent: "flex-start",
          overflowY: "auto",
          height: "100%",
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
              issues,
              listState.filterByDate,
              listState.filterByStatus,
              listState.search,
              listState.sortBy,
              listState.asce
            );
            return manipulatedList && manipulatedList.length > 0 ? (
              <IssueRows
                issues={manipulatedList}
                listState={listState}
                selectedIssue={selectedIssue}
                setSelectedIssue={setSelectedIssue}
              />
            ) : (
              <OrangeryNavigationPlaceholder
                vertical
                width={213}
                height={224}
                minHeight={"unset"}
                title={"No issues found!"}
                subtitle={"Please filter somthing else"}
                PlaceholderSvg={PlaceholderSvg}
                // AddNewButton={<AddNewDoorAccessButton />}
                addNewButtonText={""}
              />
            );
          }}
        </Observer>
      </Box>
    </Box>
  );
}

const IssueRows = ({
  listState,
  issues,
  selectedIssue,
  setSelectedIssue,
}: {
  listState: IssuesListState;
  issues: IIssue[];
  selectedIssue?: IIssue;
  setSelectedIssue: (selectedIssue: IIssue) => void;
}) => {
  return (
    <>
      {issues?.map((issue) => (
        <IssueRow
          key={issue.uuid}
          issue={issue}
          setSelectedIssue={setSelectedIssue}
          selected={selectedIssue && selectedIssue.uuid === issue.uuid}
        />
      ))}
    </>
  );
};

function IssueRow({
  issue,
  setSelectedIssue,
  selected,
}: {
  issue: IIssue;
  setSelectedIssue: (selectedIssue: IIssue) => void;
  selected?: boolean;
}) {
  function handleIssueClick(e: React.FormEvent, selectedIssue: IIssue) {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    setSelectedIssue(selectedIssue);
  }

  return (
    <>
      <Box
        onClick={(e) => handleIssueClick(e, issue)}
        sx={{
          position: "relative",

          display: "flex",
          flexDirection: "column",
          borderBottom: "1px solid #E8E9ED",

          justifyContent: "center",
          // alignItems: "end",
          width: "100%",
          overflowX: "hidden",
          px: 2,
          py: 1,
          transition: "0.2s",
          backgroundColor: "white",
          borderRadius: 1,
          ...(selected ? { backgroundColor: "#F4F9FF" } : {}),
          "&:hover": {
            transitionTimingFunction: "ease-in-out",
            backgroundColor: "#F2F2F2 !important",
            transition: "0.2s",
            transitionDuration: "0.2s",
            cursor: "pointer",
          },
        }}
      >
        <Box
          sx={{
            position: "absolute",
            top: 6,
            right: 6,
          }}
        >
          <OrangeryTag
            options={statusTagOptions}
            selectedLabel={calculateStatus(issue)}
            height={22}
            minWidth={76}
          />
        </Box>
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            gap: 1.2,
          }}
        >
          <Box
            sx={{
              flex: "none",
            }}
          >
            <OrangeryUserCircle
              name={
                issue.user?.name ??
                issue.user?.first_name + " " + issue.user?.last_name
              }
              fileName={issue.user?.image || ""}
              size={35}
              notHoverable
              noMargin
            />
          </Box>

          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              width: "calc(100% - 42px)",
              gap: 0,
            }}
          >
            <Typography
              variant="subtitle2"
              sx={{
                mt: 1,
                // mb: .5
                // mb: 1
              }}
            >
              {issue.user?.name ??
                issue.user?.first_name + " " + issue.user?.last_name}
            </Typography>

            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                gap: 0.5,
                alignItems: "baseline",
              }}
            >
              <Typography sx={{}}>{issue.subject}</Typography>
              {issue.category && (
                <>
                  <Typography
                    sx={{
                      fontSize: 14,
                      fontWeight: 500,
                      color: "#A5AAB4",
                    }}
                  >
                    in
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: 14,
                      fontWeight: 500,
                      color: "#09ACD0",
                    }}
                  >
                    {issue.category}
                  </Typography>
                </>
              )}
            </Box>

            <Typography
              variant="CAPTION"
              sx={{
                whiteSpace: {
                  xs: "unset",
                  sm: "nowrap",
                },
                overflow: "hidden",
                textOverflow: "ellipsis",
                mb: 1,
              }}
            >
              {issue.description || "-"}
            </Typography>
          </Box>
        </Box>

        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "baseline",
          }}
        >
          <IssueLocationInfo issue={issue} />

          {issue.created_date && (
            <Typography
              sx={{
                fontSize: 14,
                fontWeight: 600,
              }}
            >
              <OrangeryDateTime dateTime={issue.created_date} />
            </Typography>
          )}
        </Box>
      </Box>
    </>
  );
}

export function IssueLocationInfo({
  issue,
  color,
  wide = false,
}: {
  issue: IIssue;
  color?: string;
  wide?: boolean;
}) {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "row",
        gap: wide ? 6 : 3,
        color: color ?? "#9A9CA0",
        alignItems: "center",
      }}
    >
      <Box
        sx={{
          // flexBasis: "25%",
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          gap: 1,
          "& .icon": {
            height: wide ? "15px" : "12px",
          },
        }}
      >
        <LocationIcon className="icon" />
        <Typography
          sx={{
            fontSize: wide ? 15 : 12,
            fontWeight: 600,
          }}
        >
          {<OrangeryText text={issue.office?.name || "-"} limit={12} />}
        </Typography>
      </Box>

      {issue.department?.name && (
        <Box
          sx={{
            // flexBasis: "25%",
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            gap: 1,
            "& .icon": {
              height: "12px",
            },
          }}
        >
          <DepartmentIcon className="icon" />
          <Typography
            sx={{
              fontSize: 9.5,
              fontWeight: 600,
            }}
          >
            {issue.department?.name || "-"}
          </Typography>
        </Box>
      )}

      <Box
        sx={{
          // flexBasis: "25%",
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          gap: 1,
          "& .icon": {
            height: wide ? "15px" : "12px",
          },
        }}
      >
        <LayerIcon className="icon" />
        <Typography
          sx={{
            fontSize: wide ? 15 : 12,
            fontWeight: 600,
          }}
        >
          {<OrangeryText text={issue.floor?.name || "-"} limit={10} />}
        </Typography>
      </Box>

      <Box
        sx={{
          // flexBasis: "25%",
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          gap: 1,
          "& .icon": {
            height: wide ? "15px" : "12px",
          },
        }}
      >
        <RoomIcon className="icon" />
        <Typography
          sx={{
            fontSize: wide ? 15 : 12,
            fontWeight: 600,
          }}
        >
          {<OrangeryText text={issue.room?.name || "-"} limit={10} />}
        </Typography>
      </Box>
    </Box>
  );
}

const Header = observer(
  ({
    button,
    listState,
  }: {
    button?: JSX.Element;
    listState: IssuesListState;
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
            mb: 2,
            pl: 1,
            pr: 1,
            flexDirection: {
              sx: "column",
              sm: "row",
            },
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexGrow: 1,
              alignItems: "center",
              gap: 1,
              pt: 1,
            }}
          >
            <OrangeryFilter
              selectedValues={listState.filterByDate}
              icon={<CalendarIcon className="icon" />}
              placeHolder={"All Dates"}
              options={[
                "All Dates",
                "Last Day",
                "Last 7 Days",
                "Last 30 Days",
                "Last Month",
                "Last Year",
              ]}
              onChange={(newValues) => {
                newValues.forEach((e: any) => {
                  const i = listState.filterByDate.findIndex((v) => v === e);
                  if (i === -1) {
                    listState.pushToFilterByDateList(e);
                  }
                });
                [...listState.filterByDate].forEach((v) => {
                  const i = newValues.findIndex((e: any) => v === e);
                  if (i === -1) {
                    const j = listState.filterByDate.findIndex((t) => t === v);
                    listState.deleteFromFilterByDateList(j);
                  }
                });
              }}
            />

            <OrangeryFilter
              selectedValues={listState.filterByStatus}
              placeHolder={"All Statuses"}
              options={[
                "All Statuses",
                ...statusTagOptions.map((option) => option.label),
              ]}
              onChange={(newValues) => {
                newValues.forEach((e: any) => {
                  const i = listState.filterByStatus.findIndex((v) => v === e);
                  if (i === -1) {
                    listState.pushToFilterByStatusList(e);
                  }
                });
                [...listState.filterByStatus].forEach((v) => {
                  const i = newValues.findIndex((e: any) => v === e);
                  if (i === -1) {
                    const j = listState.filterByStatus.findIndex(
                      (t) => t === v
                    );
                    listState.deleteFromFilterByStatusList(j);
                  }
                });
              }}
            />
          </Box>

          {button && (
            <Box
              sx={{
                flexShrink: 0,
                ml: 3,
              }}
            >
              {button}
            </Box>
          )}
        </Box>
      </>
    );
  }
);
