import { useGlobalState } from "../../../../Contexts & Globals/GlobalContext";
import React from "react";
import {
  Box,
  IconButton,
  Input,
  InputAdornment,
  List,
  Typography,
  debounce,
} from "@mui/material";
import { OrangeryNavigationContentLoader } from "../../../OrangeryElements";
import CrossIcon from "../../../../assets/svg/cross.svg";
import EmptyStateIcon from "../../../../assets/svg/offer-empty-state.svg";
import Search from "@mui/icons-material/Search";
import {
  IMeetingRoom,
  useAvailableMeetingRooms,
  useMeetingRooms,
} from "../../../../queries/meetingRoom";
import Fuse from "fuse.js";
import MeetingRoomRow from "./MeetingRoomRow";
import { EventFieldsState } from "../EventForm";
import { Observer, observer } from "mobx-react-lite";
import { makeAutoObservable } from "mobx";
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
  keys: ["name"],
};

export class MeetingRoomSearchState {
  public search: string = "";

  constructor() {
    makeAutoObservable(this);
  }

  setSearch(value: string) {
    this.search = value;
  }
}

function getSearchedList(meetingRooms: IMeetingRoom[], search: string) {
  let meetingRoomList = [...meetingRooms];
  if (search) {
    const fuse = new Fuse(meetingRoomList, options);
    meetingRoomList = fuse.search(search).map((r) => r.item);
  }
  return meetingRoomList;
}

export default function MeetingRoomFieldsSelector({
  state,
  handleClose,
}: {
  state: EventFieldsState;
  handleClose: () => void;
}) {
  const globalState = useGlobalState();
  const { isLoading, data: meetingRooms } = useAvailableMeetingRooms(
    globalState.office_uuid,
    new Date(state.start_time.value).toISOString().slice(0, -1),
    new Date(state.end_time.value).toISOString().slice(0, -1),
    state.weeks.value
  );
  const meetingRoomList = meetingRooms?.map((meetingRoom) => meetingRoom) || [];
  const searchState = React.useMemo(() => new MeetingRoomSearchState(), []);

  const handleFilter = debounce((value: string) => {
    searchState.setSearch(value);
  }, 500);

  return (
    <>
      <Box
        sx={{
          display: "flex",
          height: "100%",
          flexDirection: "column",
          "& .cancel-icon": {
            width: "1.3rem",
            height: "1.3rem",
            color: "black",
          },
          "& .header": {
            display: "flex",
            justifyContent: "end",
            pt: "32px",
            pr: 2,
            pl: 6,
          },
          "& .empty-box": { flexGrow: 1 },
        }}
      >
        <Box className="header">
          <Typography className="empty-box" variant="h1">
            Add Meeting Rooms
          </Typography>
          <IconButton onClick={handleClose}>
            <CrossIcon className="cancel-icon" />
          </IconButton>
        </Box>

        <Box
          sx={{
            width: "92%",
            borderRadius: 2,
            height: 55,
            backgroundColor: (theme) => theme.palette.grey[200],
            display: "flex",
            alignItems: "center",
            gap: 3,
            px: 2,
            flexBasis: "10%",
            ml: 6,
            mt: 2,
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
            placeholder="Search Meeting Rooms ..."
            startAdornment={
              <InputAdornment position="start">
                <Search />
              </InputAdornment>
            }
          />
        </Box>

        {isLoading ? (
          <OrangeryNavigationContentLoader />
        ) : meetingRoomList && meetingRoomList.length > 0 ? (
          <Box
            sx={{
              backgroundColor: "#fff",
              display: "flex",
              flexDirection: "column",
              borderRadius: 1.5,
              mt: 2,
              mb: 2,
              pl: 6,
              pr: 1,
              mr: 3,
              height: `calc(100% - 112px)`,
              overflowY: "auto",
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
            <List
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: 1,
                width: "100%",
              }}
            >
              <Observer>
                {() => {
                  const searchedList = getSearchedList(
                    meetingRoomList,
                    searchState.search
                  );
                  return searchedList && searchedList.length > 0 ? (
                    <MeetingRoomRows
                      state={state}
                      meetingRooms={searchedList}
                    />
                  ) : (
                    <OrangeryNoSearchResultPlaceholder
                      width="100px"
                      height="424px"
                    />
                  );
                }}
              </Observer>
            </List>
          </Box>
        ) : (
          <>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                flexGrow: 1,
                mb: 15,
              }}
            >
              <EmptyStateIcon />
              <Typography sx={{ mt: 5, fontSize: 22, fontWeight: 600 }}>
                No meetingRoom is available.
              </Typography>
            </Box>
          </>
        )}
      </Box>
    </>
  );
}

const MeetingRoomRows = observer(
  ({
    meetingRooms,
    state,
  }: {
    meetingRooms: IMeetingRoom[];
    state: EventFieldsState;
  }) => {
    return (
      <>
        {meetingRooms?.map((mr) => (
          <MeetingRoomRow
            state={state}
            key={mr.uuid}
            meetingRoom={mr}
            selected={
              !!state.meeting_rooms.values?.find(
                (v) => v.value.data.uuid === mr.uuid
              )
            }
          />
        ))}
      </>
    );
  }
);
