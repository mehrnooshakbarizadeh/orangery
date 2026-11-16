// contexts & globals
import { useGlobalState } from "../../../Contexts & Globals/GlobalContext";
import Search from "@mui/icons-material/Search";
import ArrowDownAZIcon from "../../../assets/svg/arrowDownAZ.svg";
import ArrowUpZAIcon from "../../../assets/svg/arrowUpZA.svg";
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

// orangery elements & internal dependencies
import EditRoomButton from "./EditRoomButton";
import RoomOverviewButton from "./RoomOverviewButton";
import AddNewRoomButton from "./AddNewRoomButton";
import {
  OrangeryUserCircle,
  OrangeryNavigationPlaceholder,
  OrangeryReadOnlySwitch,
  OrangeryNavigationContentLoader,
  OrangeryText,
  OrangeryTableCell,
} from "../../OrangeryElements";
import OrangeryShowQRCodeButton from "../../OrangeryElements/OrangeryShowQRCodeButton";

// queries & backend
import { IRoom, useRooms } from "../../../queries/room";

// icons, images & colors
import PlaceholderSvg from "../../../assets/svg/placeholders/room.svg";
import { makeAutoObservable } from "mobx";
import { Observer, observer } from "mobx-react-lite";
import SortRoomsAutocomplete from "./SortRoomsAutocomplete";
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
  keys: ["name", "floor", "department.name"],
};

export class RoomSortState {
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
  rooms: IRoom[],
  search: string,
  sortBy: string,
  asce: boolean
) {
  let sortedSearchedRoomList = [...rooms];
  if (search) {
    const fuse = new Fuse(sortedSearchedRoomList, options);
    sortedSearchedRoomList = fuse.search(search).map((r) => r.item);
  }
  sortedSearchedRoomList = sortRooms(sortedSearchedRoomList, sortBy, asce);
  return sortedSearchedRoomList;
}

function sortRooms(rooms: IRoom[], sortBy: string, asce: boolean) {
  if (sortBy) {
    switch (sortBy) {
      case "Floor":
        return sortByFloor(rooms, asce);
      case "Department":
        return sortByDepartment(rooms, asce);
      case "Customer":
        return sortByCustomer(rooms, asce);
    }
  }
  return rooms;
}

function sortByFloor(rooms: IRoom[], asce: boolean) {
  const roomlist = rooms?.map((room) => room) || [];
  if (asce) {
    return roomlist.sort((a, b) =>
      (a.floor?.name.toLocaleUpperCase() || "") <
        (b.floor?.name.toLocaleUpperCase() || "")
        ? 1
        : -1
    );
  } else {
    return roomlist.sort((a, b) =>
      (a.floor?.name.toLocaleUpperCase() || "") >
        (b.floor?.name.toLocaleUpperCase() || "")
        ? 1
        : -1
    );
  }
}

function sortByDepartment(rooms: IRoom[], asce: boolean) {
  if (!asce) {
    return rooms.sort((a, b) =>
      (a.department?.name?.toLocaleUpperCase() ?? "") < (b.department?.name?.toLocaleUpperCase() ?? "")
        ? 1
        : -1
    );
  } else {
    return rooms.sort((a, b) =>
      (a.department?.name?.toLocaleUpperCase() ?? "") > (b.department?.name?.toLocaleUpperCase() ?? "")
        ? 1
        : -1
    );
  }
}

function sortByCustomer(rooms: IRoom[], asce: boolean) {
  if (asce) {
    return rooms.sort((a, b) =>
      a?.customer?.name.toLocaleUpperCase() <
        b?.customer?.name.toLocaleUpperCase()
        ? 1
        : -1
    );
  } else {
    return rooms.sort((a, b) =>
      a?.customer?.name.toLocaleUpperCase() >
        b?.customer?.name.toLocaleUpperCase()
        ? 1
        : -1
    );
  }
}

export default function RoomsList() {
  const globalState = useGlobalState();
  const {
    data: rooms,
    isLoading,
    isError,
  } = useRooms({ office_uuid: globalState.office_uuid });
  const state = React.useMemo(() => new RoomSortState(), []);

  return (
    <>
      {isLoading ? (
        <OrangeryNavigationContentLoader />
      ) : rooms && rooms.length > 0 ? (
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
          }}
        >
          <Header button={<AddNewRoomButton />} state={state} />
          <Box
            sx={{
              overflowY: "auto",
              height: `calc(100vh - 16px)`,
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
                  rooms,
                  state.search,
                  state.sortBy,
                  state.asce
                );
                return sortedSearchedList && sortedSearchedList.length > 0 ? (
                  <RoomRows rooms={sortedSearchedList} state={state} />
                ) : (
                  <OrangeryNoSearchResultPlaceholder />
                );
              }}
            </Observer>
          </Box>
        </Box>
      ) : (
        <OrangeryNavigationPlaceholder
          title={"Build a room"}
          subtitle={
            "Wrap your desk and inventory in rooms and rent them out as private rooms."
          }
          PlaceholderSvg={PlaceholderSvg}
          AddNewButton={<AddNewRoomButton />}
          addNewButtonText={""}
        />
      )}
    </>
  );
}

const RoomRows = ({
  state,
  rooms,
}: {
  state: RoomSortState;
  rooms: IRoom[];
}) => {
  return (
    <>
      {rooms.map((room) => (
        <RoomRow key={room.uuid} room={room} />
      ))}
    </>
  );
};

function RoomRow({ room }: { room: IRoom }) {
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
          rowGap: 2,
          fontSize: 16,
          fontWeight: 500,
        }}
      >
        <Grid item xs={3} sm={3} md={2}
          sx={{ display: "flex", flexDirection: "column", gap: 0.25 }}
        >
          <OrangeryTableCell
            title={"FLOOR / ROOM NAME"}
            text={<OrangeryText
              text={
                (room.floor?.name ? room.floor?.name + " / " : "") + room.name
              }
              limit={20}
            />}
          />
        </Grid>
        <Grid item xs={3} sm={1.5} md={0.5}
          sx={{ display: "flex", flexDirection: "column", gap: 1 }}
        >
          <OrangeryTableCell
            title={"DESKS"}
            text={room.desks?.length ? room.desks?.length : "-"}
          />
        </Grid>
        <Grid item xs={3} sm={1.5} md={0.5}
          sx={{ display: "flex", flexDirection: "column", gap: 1 }}
        >
          <OrangeryTableCell
            title={"ASSETS"}
            text={room.assets?.length ? room.assets?.length : "-"}
          />
        </Grid>
        <Grid item xs={3} sm={1.5} md={1}
          sx={{ display: "flex", flexDirection: "column", gap: 1 }}
        >
          <OrangeryTableCell
            title={"CAPACITY"}
            text={room.capacity ?? "-"}
          />
        </Grid>
        <Grid item xs={3} sm={2} md={1}
          sx={{ display: "flex", flexDirection: "column", gap: 1 }}
        >
          <Typography
            sx={{
              fontSize: 13,
              fontWeight: 600,
              color: "#9A9CA0"
            }}
          >
            ASSIGNED TO
          </Typography>
          <Box
            sx={{
              display: "flex",
            }}
          >
            {room.users?.length ? (
              room.users.map((user) => (
                <OrangeryUserCircle
                  key={user.name}
                  name={user.name ?? user.first_name + " " + user.last_name}
                  fileName={
                    typeof user?.image === "string" ? user?.image : undefined
                  }
                  size={32}
                />
              ))
            ) : (
              <Typography
                sx={{
                  fontSize: 16,
                  fontWeight: 400,
                  color: "#2B2E33"
                }}
              >
                -
              </Typography>
            )}
          </Box>
        </Grid>
        <Grid item xs={3} sm={2.5} md={2}
          sx={{ display: "flex", flexDirection: "column", gap: 1 }}
        >
          <OrangeryTableCell
            title={"OFFER NAME"}
            text={<OrangeryText text={room.product?.name || "-"} limit={12} />}
          />
        </Grid>
        <Grid item xs={3} sm={3} md={1}
          sx={{ display: "flex", flexDirection: "column", gap: 1 }}
        >
          <Typography
            sx={{
              fontSize: 13,
              fontWeight: 600,
              color: "#9A9CA0"
            }}
          >
            CUSTOMER
          </Typography>
          <Box
            sx={{
              display: "flex",
            }}
          >
            {room.customer ? (
              <Box sx={{ display: "flex", gap: 0.5, alignItems: "center" }}>
                <OrangeryUserCircle
                  name={
                    room.customer?.name ??
                    room.customer?.first_name + " " + room.customer?.last_name
                  }
                  fileName={room.customer?.image ?? ""}
                  size={24}
                  noMargin
                />
                <Box
                  sx={{
                    mr: 2,
                    width: "100%",
                    textAlign: "left",
                    maxWidth: "70%",
                    "& .serial-number": {
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    },
                  }}
                >
                  <Typography fontSize={16} fontWeight={700}>
                    <OrangeryText
                      text={
                        room.customer?.name ??
                        `${room.customer?.first_name} ${room.customer?.last_name}`
                      }
                      limit={10}
                    />
                  </Typography>
                </Box>
              </Box>
            ) : (
              <Typography
                sx={{
                  fontSize: 16,
                  fontWeight: 400,
                  color: "#2B2E33"
                }}
              >
                -
              </Typography>
            )}
          </Box>
        </Grid>
        <Grid item xs={3} sm={3} md={1}
          sx={{ display: "flex", flexDirection: "column", gap: 1 }}
        >
          <OrangeryTableCell
            title={"DEPARTMENT"}
            text={<OrangeryText
              text={room.department?.name || "-"}
              limit={25}
            />}
          />
        </Grid>
        <Grid item xs={3} sm={3} md={1}
          sx={{
            ml: "auto",
          }}
        >
          <OrangeryReadOnlySwitch
            label={{ checked: "Active", unchecked: "Inactive" }}
            checked={room.active}
          />
        </Grid>
        <Grid item xs={3} sm={3} md={1}
          sx={{
            display: "flex",
            flexDirection: "row",
            flex: "none",
            textAlign: "right",
          }}
        >
          <OrangeryShowQRCodeButton
            assetType={"room"}
            uuid={room.uuid}
            name={room.name}
          />
          <RoomOverviewButton room={room} />
          <EditRoomButton room={room} />
        </Grid>
      </Grid>
    </>
  );
}

const Header = observer(
  ({ button, state }: { button?: JSX.Element; state: RoomSortState }) => {
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
              <SortRoomsAutocomplete
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
