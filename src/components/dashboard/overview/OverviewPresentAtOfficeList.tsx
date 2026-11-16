// contexts & globals
import { useGlobalState } from "../../../Contexts & Globals/GlobalContext";

// react & next
import React from "react";

// external dependencies
import {
  Box,
  debounce,
  Input,
  InputAdornment,
  Typography,
} from "@mui/material";
import { observer, Observer } from "mobx-react-lite";
import { makeAutoObservable } from "mobx";
import Fuse from "fuse.js";

// orangery elements & internal dependencies
import {
  OrangeryUserCard3,
  OrangeryIconTitle2,
  OrangeryCloseButton,
  OrangeryCircleLoading,
} from "../../OrangeryElements";

// queries & backend
import { IUser, useDashboardUsers } from "../../../queries/dashboard";

// icons, images & colors
// import EmployeesIcon from "../../../assets/svg/dashboard/Employees.svg";
import UsersIcon from "../../../assets/svg/dashboard/usersOutline.svg";
import SearchIconNarrow from "../../../assets/svg/dashboard/searchIconNarrow.svg";
import UfoIcon from "../../../assets/svg/dashboard/ufo.svg";

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

export class OverviewPresentAtOfficeListState {
  public search: string = "";

  constructor() {
    makeAutoObservable(this);
  }

  setSearch(value: string) {
    this.search = value;
  }
}

function getSortedSearchedList(users: IUser[], search: string) {
  // let usersList = [...users];
  let usersList = JSON.parse(JSON.stringify(users));

  if (search) {
    const fuse = new Fuse(usersList, options);
    usersList = fuse.search(search).map((r) => r.item);
  }

  return usersList;
}

export default function OverviewPresentAtOffice() {
  const { office_uuid } = useGlobalState();

  const { data: users, isLoading } = useDashboardUsers(office_uuid);
  const state = React.useMemo(() => new OverviewPresentAtOfficeListState(), []);

  return (
    <Box
      sx={{
        backgroundColor: "white",
        borderRadius: 2.5,
        height: "100%",
        display: "flex",
        flexDirection: "column",
        p: 2,
        gap: 2,
      }}
    >
      <OrangeryIconTitle2
        title={(users && users.length > 0
          ? users.length + " "
          : ""
        )
          + "Present at Office"
        }
        sx={{
          mb: 4,
        }}
        icon={<UsersIcon />}
      />
      <Header state={state} />

      {isLoading ? (
        <Box
          sx={{
            my: "auto",
            mx: "auto",
          }}
        >
          <OrangeryCircleLoading />
        </Box>
      ) : users && users.length > 0 ? (
        <Box
          sx={{
            width: "100%",
            maxHeight: {
              xs: 550,
              sm: "unset",
            },
            height: "calc(100% - 12px)",
            pr: 3,
            overflowX: "hidden",
            overflowY: "auto",
            "&::-webkit-scrollbar": {
              width: "0.3em",
            },
            "&::-webkit-scrollbar-track": {
              marginLeft: "20px",
            },
            "&::-webkit-scrollbar-thumb": {
              backgroundColor: "rgba(0,0,0,.1)",
              borderRadius: 5,
            },
            "& > * + *": {
              mt: 2,
            },
          }}
        >
          <Observer>
            {() => {
              const sortedSearchedList = getSortedSearchedList(
                users,
                state.search
              );
              return sortedSearchedList && sortedSearchedList.length > 0 ? (
                <UsersRows users={sortedSearchedList} state={state} />
              ) : (
                <>No user is found.</>
              );
            }}
          </Observer>
        </Box>
      ) : (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            mx: "auto",
            justifyContent: "center",
            mt: "calc(100% - 300px)",
          }}
        >
          <UfoIcon style={{ width: 138, height: 123 }} />
          <Typography
            sx={{
              textAlign: "center",
              mt: 4,
              fontSize: "21px",
              fontWeight: 400,
            }}
          >
            No user is available.
          </Typography>
        </Box>
      )}
    </Box>
  );
}

const UsersRows = ({
  state,
  users,
}: {
  state: OverviewPresentAtOfficeListState;
  users: IUser[];
}) => {
  return (
    <>
      {users?.map((item, index) => (
        <OrangeryUserCard3
          key={index + (item.name ?? "")}
          user={item}
          size={32}
        />
      ))}
    </>
  );
};

const Header = observer(
  ({
    button,
    state,
  }: {
    button?: JSX.Element;
    state: OverviewPresentAtOfficeListState;
  }) => {
    const handleFilter = debounce((value: string) => {
      state.setSearch(value);
    }, 500);
    const { office_uuid } = useGlobalState();
    const { data: users, isLoading } = useDashboardUsers(office_uuid);
    return (
      <>
        {users && users.length > 0 ? (
          <Box
            sx={{
              borderRadius: 2,
              height: 42,
              display: "flex",
              alignItems: "center",
              gap: 3,
              px: 2,
              width: "100%",
              border: "1px solid #E8E9ED",
              flexShrink: 0,
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
                  backgroundColor: "white",
                },
                "& .icon": {
                  color: "#A5AAB4",
                  width: "1rem",
                  height: "1rem",
                },
              }}
              placeholder="Search users"
              startAdornment={
                <InputAdornment position="start">
                  <SearchIconNarrow className="icon" />
                </InputAdornment>
              }
            />
          </Box>
        ) : (
          <></>
        )}
      </>
    );
  }
);
