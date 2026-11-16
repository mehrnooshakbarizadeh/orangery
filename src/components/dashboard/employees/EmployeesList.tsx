// contexts & globals
import { useGlobalState } from "../../../Contexts & Globals/GlobalContext";
import Fuse from "fuse.js";
// react & next
import React from "react";

// external dependencies
import {
  Box,
  Button,
  debounce,
  Grid,
  Input,
  InputAdornment,
  Typography,
} from "@mui/material";
import ArrowDownAZIcon from "../../../assets/svg/arrowDownAZ.svg";
import ArrowUpZAIcon from "../../../assets/svg/arrowUpZA.svg";
import Search from "@mui/icons-material/Search";

// orangery elements & internal dependencies
import {
  OrangeryUserCircle,
  OrangeryNavigationContentLoader,
  OrangeryNavigationPlaceholder,
  OrangeryText,
} from "../../OrangeryElements";
import AddNewEmployeeButton from "./AddNewEmployeeButton";
import EditEmployeeButton from "./EditEmployeeButton";

// queries & backend
import { IEmployee, useEmployees } from "../../../queries/employee";

// icons, images & colors
import PlaceholderSvg from "../../../assets/svg/placeholders/user_console.svg";
import { makeAutoObservable } from "mobx";
import { Observer, observer } from "mobx-react-lite";
import SortEmployeeAutocomplete from "./SortEmployeeAutocomplete";
import UploadCSV from "./UploadCSV";
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
  keys: ["email", "first_name", "last_name", "group.display_name"],
};

export class EmployeeSortState {
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
  users: IEmployee[],
  search: string,
  sortBy: string,
  asce: boolean
) {
  let sortedSearchedEmployeeList = [...users];
  if (search) {
    const fuse = new Fuse(sortedSearchedEmployeeList, options);
    sortedSearchedEmployeeList = fuse.search(search).map((r) => r.item);
  }
  sortedSearchedEmployeeList = sortEmployees(
    sortedSearchedEmployeeList,
    sortBy,
    asce
  );
  return sortedSearchedEmployeeList;
}

function sortEmployees(employees: IEmployee[], sortBy: string, asce: boolean) {
  if (sortBy) {
    switch (sortBy) {
      case "Name":
        return sortByName(employees, asce);
      case "Email":
        return sortByEmail(employees, asce);
      case "Role":
        return sortByRole(employees, asce);
      case "Created Date":
        return sortByCreatedDate(employees, asce);
    }
  }
  return employees;
}

function sortByName(employees: IEmployee[], asce: boolean) {
  if (asce) {
    return employees.sort((a, b) =>
      a.name.toLocaleUpperCase() > b.name.toLocaleUpperCase() ? 1 : -1
    );
  } else {
    return employees.sort((a, b) =>
      a.name.toLocaleUpperCase() < b.name.toLocaleUpperCase() ? 1 : -1
    );
  }
}
function sortByEmail(employees: IEmployee[], asce: boolean) {
  if (!asce) {
    return employees.sort((a, b) =>
      a.email.toLocaleUpperCase() < b.email.toLocaleUpperCase() ? 1 : -1
    );
  } else {
    return employees.sort((a, b) =>
      a.email.toLocaleUpperCase() > b.email.toLocaleUpperCase() ? 1 : -1
    );
  }
}
function sortByRole(employees: IEmployee[], asce: boolean) {
  if (!asce) {
    return employees.sort((a, b) =>
      a.group.display_name?.toLocaleUpperCase() <
        b.group.display_name?.toLocaleUpperCase()
        ? 1
        : -1
    );
  } else {
    return employees.sort((a, b) =>
      a.group.display_name?.toLocaleUpperCase() >
        b.group.display_name?.toLocaleUpperCase()
        ? 1
        : -1
    );
  }
}

function sortByCreatedDate(employees: IEmployee[], asce: boolean) {
  if (!asce) {
    return employees.sort((a, b) =>
      new Date(a.created_date) > new Date(b.created_date) ? 1 : -1
    );
  } else {
    return employees.sort((a, b) =>
      new Date(a.created_date) < new Date(b.created_date) ? 1 : -1
    );
  }
}

export default function EmployeesList() {
  const globalState = useGlobalState();
  const state = React.useMemo(() => new EmployeeSortState(), []);
  const { data: users, isLoading } = useEmployees(globalState.office_uuid);

  return (
    <>
      <Observer>
        {() => (
          <>
            {isLoading ? (
              <OrangeryNavigationContentLoader />
            ) : users && users.length > 0 ? (
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
                <Header button={<AddNewEmployeeButton />} state={state} />
                <Observer>
                  {() => {
                    const sortedSearchedList = getSortedSearchedList(
                      users,
                      state.search,
                      state.sortBy,
                      state.asce
                    );
                    return sortedSearchedList &&
                      sortedSearchedList.length > 0 ? (
                      <EmployeeRows users={sortedSearchedList} />
                    ) : (
                      <OrangeryNoSearchResultPlaceholder />
                    );
                  }}
                </Observer>
              </Box>
            ) : (
              <OrangeryNavigationPlaceholder
                title={"No employee has been added to the company yet!"}
                subtitle={
                  "Identify your employees, assign them desks, and encourage them to use your dedicated OrangeryOS app."
                }
                PlaceholderSvg={PlaceholderSvg}
                AddNewButton={<AddNewEmployeeButton />}
                AddCSVButton={<UploadCSV />}
                addNewButtonText={""}
              />
            )}
          </>
        )}
      </Observer>
    </>
  );
}

const EmployeeRows = ({ users }: { users: IEmployee[] }) => {
  return (
    <div
      style={{
        height: `calc(100vh - 16px)`,
        overflow: "auto", // Make it scroll!
      }}
      className="scroll-align"
    >
      {users.map((user) => (
        <EmployeeCard key={user.uuid} employee={user} />
      ))}
    </div>
  );
};

function EmployeeCard({ employee }: { employee: IEmployee }) {
  const globalState = useGlobalState();
  const user = globalState.currentUser;

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
          rowGap: 2,
          mx: 0,
          fontSize: 16,
          fontWeight: 500,
        }}
      >
        <Grid
          xs={12}
          sm={3}
          item
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 3,
            "& .memo-icon": { width: "1.3rem" },
          }}
        >
          <OrangeryUserCircle
            name={employee.first_name}
            fileName={
              typeof employee?.image === "string" ? employee?.image : undefined
            }
          />
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              mr: 2,
              width: "100%",
              maxWidth: "60%",
              "& .visitor-email": { textDecoration: "underline" },
              "& .employee-name": {
                textTransform: "capitalize",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              },
            }}
          >
            <Typography variant="h4">
              <OrangeryText
                text={`${employee.first_name} ${employee.last_name}`}
                limit={20}
              />
            </Typography>
          </Box>
        </Grid>
        <Grid
          item
          xs={3}
          sm={2}
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 1,
          }}
        >
          <Typography fontSize={16} fontWeight={600} color={"#9A9CA0"}>
            Email
          </Typography>
          <Typography variant="h4">
            <OrangeryText text={employee.email} limit={20} />
          </Typography>
        </Grid>

        <Grid
          item
          xs={3}
          sm={2}
          sx={{ display: "flex", flexDirection: "column", gap: 1 }}
        >
          <Typography fontSize={16} fontWeight={600} color={"#9A9CA0"}>
            Phone number
          </Typography>
          <Typography variant="h4">
            {employee.phone
              ? // ? employee.phone
              `${employee.phone.substring(0, 3)} ${employee.phone.substring(
                3,
                5
              )} ${employee.phone.substring(5)}`
              : "-"}
          </Typography>
        </Grid>

        <Grid
          item
          xs={3}
          sm={2}
          sx={{ display: "flex", flexDirection: "column", gap: 1 }}
        >
          <Typography fontSize={16} fontWeight={600} color={"#9A9CA0"}>
            Role
          </Typography>
          <Typography variant="h4">{employee.group?.display_name}</Typography>
        </Grid>
        <Grid item xs={1} textAlign={"right"}>
          <EditEmployeeButton
            disabled={
              (user?.group.name !== "owner" &&
                employee.group?.name === "owner") ||
              false
            }
            employee={employee}
          />
        </Grid>
      </Grid>
    </>
  );
}

const Header = observer(
  ({ button, state }: { button?: JSX.Element; state: EmployeeSortState }) => {
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
              <Observer>
                {() => (
                  <SortEmployeeAutocomplete
                    name="sortBy"
                    placeholder="Sort By..."
                    value={state.sortBy}
                    onChange={(newValue: string) => {
                      state.setSortBy(newValue);
                    }}
                  />
                )}
              </Observer>
            </Box>

            <Box
              sx={{
                minWidth: 300,
                maxWidth: 400,
                "& .arrow-icon": { width: "1.2rem", height: "1.2rem" },
              }}
            >
              <Observer>
                {() => (
                  <Button
                    onClick={() => state.setDesc(state.asce)}
                    sx={{
                      backgroundColor: "#F9F9FA",
                      p: 2,
                      borderRadius: "5px",
                    }}
                  >
                    {state.asce ? (
                      <ArrowDownAZIcon className="arrow-icon" />
                    ) : (
                      <ArrowUpZAIcon className="arrow-icon" />
                    )}
                  </Button>
                )}
              </Observer>
            </Box>
          </Box>
          <Box>
            {" "}
            <UploadCSV />{" "}
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
