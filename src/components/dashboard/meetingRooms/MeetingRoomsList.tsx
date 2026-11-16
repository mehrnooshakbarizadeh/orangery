// contexts & globals
import { useGlobalState } from "../../../Contexts & Globals/GlobalContext";

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
import Fuse from "fuse.js";

// orangery elements & internal dependencies
import EmbedMeetingRoomButton from "./EmbedMeetingRoomButton";
import AddNewMeetingRoomButton from "./AddNewMeetingRoomButton";
import EditMeetingRoomButton from "./EditMeetingRoomButton";
import Search from "@mui/icons-material/Search";
import ArrowDownAZIcon from "../../../assets/svg/arrowDownAZ.svg";
import ArrowUpZAIcon from "../../../assets/svg/arrowUpZA.svg";
import {
  OrangeryNavigationPlaceholder,
  OrangeryReadOnlySwitch,
  OrangeryNavigationContentLoader,
  OrangeryPrice,
  OrangeryText,
} from "../../OrangeryElements";
import OrangeryShowQRCodeButton from "../../OrangeryElements/OrangeryShowQRCodeButton";

// queries & backend
import { IMeetingRoom, useMeetingRooms } from "../../../queries/meetingRoom";

// icons, images & colors
// import ArrowDownAZIcon from "../../../assets/svg/arrowDownAZ.svg";
// import ArrowUpZAIcon from "../../../assets/svg/arrowUpZA.svg";
import PlaceholderSvg from "../../../assets/svg/placeholders/meeting_rooms.svg";
import { makeAutoObservable } from "mobx";
import { Observer, observer } from "mobx-react-lite";
import SortMeetingRoomAutocomplete from "./SortMeetingRoomAutocomplete";
import DeleteAllMeetingRoomSelected from "./DeleteAllMeetingRoomSelected";
import DeleteCheckBox from "../desks/DeleteCheckBox";
import { width } from "@mui/system";
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
  keys: ["name", "assigned_floor.name", "department", "capacity"],
};

export class SortMeetingRoomState {
  public sortBy = "";
  public asce: boolean = true;
  public search: string = "";
  public selectedMeetingRoomList: string[] = [];

  constructor() {
    makeAutoObservable(this);
  }

  setSelectedAll(uuids: string[]) {
    this.clearSelectedMeetingRoom();
    this.selectedMeetingRoomList.push(...uuids);
  }
  clearSelectedMeetingRoom() {
    this.selectedMeetingRoomList.splice(0, this.selectedMeetingRoomList.length);
  }

  pushToSelectedList(uuid: string) {
    if (this.selectedMeetingRoomList.includes(uuid)) {
      return;
    }
    this.selectedMeetingRoomList.push(uuid);
  }

  deleteFromSelectedList(uuid: string) {
    const index = this.selectedMeetingRoomList.findIndex((s) => s === uuid);
    if (index === -1) {
      return;
    }
    this.selectedMeetingRoomList.splice(index, 1);
  }

  isSelected(uuid: string) {
    return !!this.selectedMeetingRoomList.find((v) => v === uuid);
  }

  setSortBy(value: string) {
    this.sortBy = value;
  }

  setDesc(value: boolean) {
    this.asce = !value;
  }

  setSearch(value: string) {
    this.search = value;
    this.clearSelectedMeetingRoom();
  }
}

function getSortedSearchedList(
  desks: IMeetingRoom[],
  search: string,
  sortBy: string,
  asce: boolean
) {
  let sortedSearchedMeetingRoomList = [...desks];
  if (search) {
    const fuse = new Fuse(sortedSearchedMeetingRoomList, options);
    sortedSearchedMeetingRoomList = fuse.search(search).map((r) => r.item);
  }
  sortedSearchedMeetingRoomList = sortMeetingRooms(
    sortedSearchedMeetingRoomList,
    sortBy,
    asce
  );
  return sortedSearchedMeetingRoomList;
}

export default function MeetingRoomsList() {
  const globalState = useGlobalState();
  const state = React.useMemo(() => new SortMeetingRoomState(), []);
  const { data: meetingRooms, isLoading } = useMeetingRooms(
    globalState.office_uuid
  );

  const meetingRoomList = meetingRooms?.map((meetingRoom) => meetingRoom) || [];
  const deletable = meetingRooms?.filter(
    (meetingRoom) => !meetingRoom.tenant_office_uuid
  );

  const handleSelectAll = (e: any) => {
    let result = [...meetingRoomList];
    result = getSortedSearchedList(
      result,
      state.search,
      state.sortBy,
      state.asce
    );
    result =
      result?.filter((meetingRoom) => !meetingRoom.tenant_office_uuid) || [];
    if (!meetingRoomList || !result) return;
    if (state.selectedMeetingRoomList.length === result.length) {
      state.setSelectedAll([]);
    } else {
      const uuids = result.map((d) => d.uuid);
      state.setSelectedAll(uuids);
    }
  };

  return (
    <>
      <Observer>
        {() => (
          <>
            {isLoading ? (
              <OrangeryNavigationContentLoader />
            ) : meetingRooms && meetingRooms.length > 0 ? (
              <Box
                sx={{
                  backgroundColor: "#fff",
                  display: "flex",
                  flexDirection: "column",
                  // justifyContent: "start",
                  height: "100%",
                  minHeight: 666,
                  borderRadius: 1.5,
                  py: 1,
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
                <Header button={
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "row",
                      gap: 2,
                      alightItems: "center"
                    }}
                  >
                    <EmbedMeetingRoomButton />
                    <AddNewMeetingRoomButton />
                  </Box>
                } state={state} />

                <Observer>
                  {() => {
                    const sortedSearchedList = getSortedSearchedList(
                      meetingRooms,
                      state.search,
                      state.sortBy,
                      state.asce
                    );
                    const searchedDeletable =
                      sortedSearchedList?.filter(
                        (meetingRoom) => !meetingRoom.tenant_office_uuid
                      ) || [];
                    return sortedSearchedList.length > 0 ? (
                      <DeleteAllMeetingRoomSelected
                        meetingRooms={sortedSearchedList}
                        onSelectAll={handleSelectAll}
                        checked={
                          (deletable!.length > 0 &&
                            state.selectedMeetingRoomList.length ===
                            deletable!.length) ||
                          (searchedDeletable.length > 0 &&
                            state.selectedMeetingRoomList.length ===
                            searchedDeletable.length)
                        }
                        state={state}
                      />
                    ) : (
                      <span />
                    );
                  }}
                </Observer>

                <Observer>
                  {() => {
                    const sortedSearchedList = getSortedSearchedList(
                      meetingRooms,
                      state.search,
                      state.sortBy,
                      state.asce
                    );
                    return sortedSearchedList &&
                      sortedSearchedList.length > 0 ? (
                      <MeetingRoomRows
                        meetingRooms={sortedSearchedList}
                        state={state}
                      />
                    ) : (
                      <OrangeryNoSearchResultPlaceholder />
                    );
                  }}
                </Observer>
              </Box>
            ) : (
              <OrangeryNavigationPlaceholder
                title={"Start by adding some Meeting Rooms!"}
                subtitle={
                  "Add some meeting rooms to build up your workspace, and enable your members to book them."
                }
                PlaceholderSvg={PlaceholderSvg}
                AddNewButton={<AddNewMeetingRoomButton />}
                addNewButtonText={""}
              />
            )}
          </>
        )}
      </Observer>
    </>
  );
}

const MeetingRoomRows = ({
  state,
  meetingRooms,
}: {
  state: SortMeetingRoomState;
  meetingRooms: IMeetingRoom[];
}) => {
  return (
    <div
      style={{
        height: `calc(100vh - 72px)`,
        overflow: "auto", // Make it scroll!
      }}
      className="scroll-align"
    >
      {meetingRooms.map((mr) => (
        <MeetingRoomCard key={mr.uuid} meetingRoom={mr} state={state} />
      ))}
    </div>
  );
};

function sortMeetingRooms(
  meetingRooms: IMeetingRoom[],
  sortBy: string,
  asce: boolean
) {
  if (sortBy) {
    switch (sortBy) {
      case "Name":
        return sortByName(meetingRooms, asce);
      case "Floor":
        return sortByFloor(meetingRooms, asce);
      case "Department":
        return sortByDepartment(meetingRooms, asce);
      case "Capacity":
        return sortByCapacity(meetingRooms, asce);
      case "Price":
        return sortByPrice(meetingRooms, asce);
      case "Active":
        return sortByActive(meetingRooms, asce);
    }
  }
  return meetingRooms;
}

function sortByName(meetingRooms: IMeetingRoom[], asce: boolean) {
  if (asce) {
    return meetingRooms.sort((a, b) =>
      a.name.toLocaleUpperCase() > b.name.toLocaleUpperCase() ? 1 : -1
    );
  } else {
    return meetingRooms.sort((a, b) =>
      a.name.toLocaleUpperCase() < b.name.toLocaleUpperCase() ? 1 : -1
    );
  }
}
function sortByFloor(meetingRooms: IMeetingRoom[], asce: boolean) {
  if (!asce) {
    return meetingRooms.sort((a, b) =>
      a.assigned_floor?.name.toLocaleUpperCase() <
        b.assigned_floor?.name.toLocaleUpperCase()
        ? 1
        : -1
    );
  } else {
    return meetingRooms.sort((a, b) =>
      a.assigned_floor?.name.toLocaleUpperCase() >
        b.assigned_floor?.name.toLocaleUpperCase()
        ? 1
        : -1
    );
  }
}
function sortByDepartment(meetingRooms: IMeetingRoom[], asce: boolean) {
  if (!asce) {
    return meetingRooms.sort((a, b) =>
      (a.department?.toLocaleUpperCase() ?? "") <
        (b.department?.toLocaleUpperCase() ?? "")
        ? 1
        : -1
    );
  } else {
    return meetingRooms.sort((a, b) =>
      (a.department?.toLocaleUpperCase() ?? "") >
        (b.department?.toLocaleUpperCase() ?? "")
        ? 1
        : -1
    );
  }
}
function sortByCapacity(meetingRooms: IMeetingRoom[], asce: boolean) {
  if (!asce) {
    return meetingRooms.sort((a, b) => (a.capacity < b.capacity ? 1 : -1));
  } else {
    return meetingRooms.sort((a, b) => (a.capacity > b.capacity ? 1 : -1));
  }
}
function sortByPrice(meetingRooms: IMeetingRoom[], asce: boolean) {
  const meetingRoomList = meetingRooms?.map((mr) => mr) || [];
  if (!asce) {
    return meetingRoomList.sort((a, b) => Number(b.price) - Number(a.price));
  } else {
    return meetingRoomList.sort((a, b) => Number(a.price) - Number(b.price));
  }
}
function sortByActive(meetingRooms: IMeetingRoom[], asce: boolean) {
  if (!asce) {
    return meetingRooms.sort((a, b) => (a.active > b.active ? 1 : -1));
  } else {
    return meetingRooms.sort((a, b) => (a.active < b.active ? 1 : -1));
  }
}

function MeetingRoomCard({
  meetingRoom,
  state,
}: {
  meetingRoom: IMeetingRoom;
  state: SortMeetingRoomState;
}) {
  const handleSelect = (
    uuid: string,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (e.target.checked) {
      state.pushToSelectedList(uuid);
    } else {
      state.deleteFromSelectedList(uuid);
    }
  };
  return (
    <>
      <Box
        sx={{
          display: "flex",
          py: 2.7,
          pr: 2.4,
          pl: 1,
          border: "1px solid #bdbec1",
          alignItems: "center",
          borderRadius: 1.5,
          mb: 1.2,
          mx: 0,
          gap: 1,
          fontSize: 16,
          fontWeight: 500,
          flexWrap: "wrap",
          "& .column-align": {
            display: "flex",
            flexDirection: "column",
            gap: "2px",
            flexBasis: "8%",
            flexShrink: 0,
            // maxWidth: "16%"
          },
          "& .capacity-align": {
            display: "flex",
            flexDirection: "column",
            gap: "2px",
            flexBasis: "5%",
            flexShrink: 0,
          },
        }}
      >
        <Observer>
          {() => (
            <>
              {!meetingRoom.tenant_office_uuid ? (
                <DeleteCheckBox
                  onChange={(e) => handleSelect(meetingRoom.uuid, e)}
                  checked={state.isSelected(meetingRoom.uuid)}
                />
              ) : (
                <Box sx={{ width: "33px" }} />
              )}
            </>
          )}
        </Observer>
        <Box>
          {meetingRoom.images.length ? (
            <Box
              sx={{
                width: "80px",
                height: "80px",
                objectFit: "contain",
              }}
              component={"img"}
              src={`${process.env.NEXT_PUBLIC_CDN_URL}/${meetingRoom.images[0].uuid}.jpg`}
              loading={"lazy"}
            />
          ) : (
            <Box
              sx={{
                width: "80px",
                height: "80px",
              }}
              component={"img"}
              src={`${process.env.NEXT_PUBLIC_BASE_PATH}/assets/placeholder/noImage.png`}
              loading={"lazy"}
            />
          )}
        </Box>
        <Box
          sx={{
            flexBasis: "12%",
            // maxWidth: "16%",
            display: "flex",
            flexShrink: 0,
            flexDirection: "column",
            gap: "2px",
          }}
        >
          <Typography fontSize={16} fontWeight={600} color={"#9A9CA0"}>
            NAME
          </Typography>
          <Typography variant="h4">
            <OrangeryText text={meetingRoom.name} limit={20} />
          </Typography>
        </Box>
        <Box className="column-align">
          <Typography fontSize={16} fontWeight={600} color={"#9A9CA0"}>
            FLOOR
          </Typography>
          <Typography variant="h4">
            <OrangeryText
              text={meetingRoom.assigned_floor?.name || "-"}
              limit={12}
            />
          </Typography>
        </Box>
        <Box className="column-align">
          <Typography fontSize={16} fontWeight={600} color={"#9A9CA0"}>
            DEPARTMENT
          </Typography>

          <Typography variant="h4">
            <OrangeryText
              text={meetingRoom.department_obj?.name || "-"}
              limit={12}
            />
          </Typography>
        </Box>
        <Box className="column-align">
          <Typography fontSize={16} fontWeight={600} color={"#9A9CA0"}>
            CAPACITY
          </Typography>
          <Typography variant="h4">{meetingRoom.capacity}</Typography>
        </Box>
        <Box className="column-align">
          <Typography fontSize={16} fontWeight={600} color={"#9A9CA0"}>
            PRICE
          </Typography>
          <Typography variant="h4">
            <OrangeryPrice euro={meetingRoom.price} germanFormat />
          </Typography>
        </Box>

        <Box
          sx={{
            flexBasis: "13%",
            display: "flex",
            flexShrink: 0,
            flexDirection: "column",
            gap: "2px",
          }}
        >
          <Typography fontSize={16} fontWeight={600} color={"#9A9CA0"}>
            INCLUDED ASSETS
          </Typography>
          <Box
            sx={{
              pt: "4px",
              display: "flex",
              alignItems: "center",
              gap: 1,
              flexWrap: "wrap",
            }}
          >
            {meetingRoom.assets
              ?.slice(0, 4)
              .filter((as) => as.asset_type === "Included")
              .map((asset, index) => (
                <Box
                  key={index}
                  sx={{
                    backgroundColor: "#DCF3F8",
                    py: "4px",
                    px: 1,
                    borderRadius: "5px",
                  }}
                >
                  <Typography fontSize="12px" fontWeight={600}>
                    {asset.grouped_name.charAt(0).toUpperCase() +
                      asset.grouped_name.slice(1)}
                  </Typography>
                </Box>
              ))}
            {!meetingRoom.assets?.filter((as) => as.asset_type === "Included")
              .length && "-"}
            {meetingRoom.assets?.filter((as) => as.asset_type === "Included")
              .length > 2 && (
                <Box
                  sx={{
                    backgroundColor: "#DCF3F8",
                    py: "1px",
                    px: 1,
                    borderRadius: "5px",
                  }}
                >
                  ...
                </Box>
              )}
          </Box>
        </Box>
        <Box
          sx={{
            flexBasis: "13%",
            display: "flex",
            flexShrink: 0,
            flexDirection: "column",
            gap: "2px",
          }}
        >
          <Typography fontSize={16} fontWeight={600} color={"#9A9CA0"}>
            OPTIONAL ASSETS
          </Typography>
          <Box
            sx={{
              pt: "4px",
              display: "flex",
              alignItems: "center",
              gap: 1,
              flexWrap: "wrap",
            }}
          >
            {meetingRoom.assets
              ?.slice(0, 4)
              .filter((as) => as.asset_type === "Optional")
              .map((asset, index) => (
                <Box
                  key={index}
                  sx={{
                    backgroundColor: "#EDEEF0",
                    py: "4px",
                    px: 1,
                    borderRadius: "5px",
                  }}
                >
                  <Typography fontSize="12px" fontWeight={600}>
                    {asset.grouped_name.charAt(0).toUpperCase() +
                      asset.grouped_name.slice(1)}
                  </Typography>
                </Box>
              ))}
            {!meetingRoom.assets?.filter((as) => as.asset_type === "Optional")
              .length && "-"}
            {meetingRoom.assets?.filter((as) => as.asset_type === "Optional")
              .length > 2 && (
                <Box
                  sx={{
                    backgroundColor: "#EDEEF0",
                    py: "1px",
                    px: 1,
                    borderRadius: "5px",
                  }}
                >
                  ...
                </Box>
              )}
          </Box>
        </Box>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 3,
          }}
        >
          <Grid
            item
            xs={2}
            sm={2}
            md={1}
            sx={{
              gap: "10px",
              display: "flex",
              flexDirection: "row",
              flex: "none",
              textAlign: "right",
            }}
          >
            <Box sx={{ flexBasis: "15%", mr: 2 }}>
              <OrangeryReadOnlySwitch
                label={{ checked: "Ready To Use", unchecked: "Disable" }}
                checked={meetingRoom.active}
              />
            </Box>

            <OrangeryShowQRCodeButton
              assetType={"meeting"}
              uuid={meetingRoom.uuid}
              name={meetingRoom.name}
            />
            <Observer>
              {() => (
                <EditMeetingRoomButton
                  meetingRoom={meetingRoom}
                  state={state}
                />
              )}
            </Observer>
          </Grid>
        </Box>
      </Box>
    </>
  );
}

const Header = observer(
  ({
    button,
    state,
  }: {
    button?: JSX.Element;
    state: SortMeetingRoomState;
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
                sx={{ width: "100%" }}
                onChange={(e) => {
                  handleFilter(e.target.value.toLowerCase());
                }}
                placeholder="search ..."
                startAdornment={
                  <InputAdornment position="start">
                    <Search />
                  </InputAdornment>
                }
              />
            </Box>
            <Box sx={{ minWidth: 264, maxWidth: 400 }}>
              <Observer>
                {() => (
                  <SortMeetingRoomAutocomplete
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
