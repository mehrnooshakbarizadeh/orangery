import { useGlobalState } from "../../../Contexts & Globals/GlobalContext";

// react & next
import React, { useState, useMemo, useEffect } from "react";
import Fuse from "fuse.js";
// import * as Fuse from "fuse.js";
// import  Fuse  from "fuse.js";
// external dependencies
import { useVirtualizer } from "@tanstack/react-virtual";
import {
  Box,
  Button,
  Grid,
  debounce,
  Input,
  InputAdornment,
  Typography,
  IconButton,
  Dialog,
  DialogContent,
} from "@mui/material";

// orangery elements & internal dependencies
import EditDeskButton from "./EditEventButton";
import AddNewDeskButton from "./AddNewEventButton";
import { ISort } from "../../OrangeryElements/OrangerySortAutocomplete";
import {
  OrangeryPrice,
  OrangerySortAutocomplete,
} from "../../OrangeryElements";
import {
  OrangeryNavigationPlaceholder,
  OrangeryNavigationContentLoader,
  OrangeryText,
  OrangeryUserCircle,
} from "../../OrangeryElements";
import Search from "@mui/icons-material/Search";
import PlaceholderSvg from "../../../assets/svg/placeholders/event-empty-space.svg";
import ArrowDownAZIcon from "../../../assets/svg/arrowDownAZ.svg";
import ArrowUpZAIcon from "../../../assets/svg/arrowUpZA.svg";
import NoteIcon from "../../../assets/svg/organizer-note.svg";
import CrossIcon from "../../../assets/svg/cross.svg";
import PreviewIcon from "../../../assets/svg/preview.svg";
import { makeAutoObservable } from "mobx";
import { observer, Observer } from "mobx-react-lite";
import DeleteAllSelected from "./DeleteAllSelected";
import DeleteCheckBox from "./DeleteCheckBox";
import OrangeryNoSearchResultPlaceholder from "../../OrangeryElements/OrangeryNoSearchResultPlaceholder";
import { IEvent, useEvents, usePublicEvents } from "../../../queries/event";
import AddNewEventButton from "./AddNewEventButton";
import CopyLinkButton from "./CopyLinkButton";
import EventOverviewDialog from "./overview/EventOverviewDialog";
import EventHistoryPage from "./EventHistory/historyList";
import EventHistoryButton from "./EventHistory/EventHistoryButton";
import { EventFieldsState } from "./EventForm";
import OrganizerPreviewButton from "./organizer/organizer-preview/OrganizerReviewButton";

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
  keys: ["title", "location"],
};

export class SortState {
  public sortBy = "";
  public asce: boolean = true;
  public search: string = "";
  public selectedEventList: string[] = [];

  constructor() {
    makeAutoObservable(this);
  }

  setSelectedAll(uuids: string[]) {
    this.clearSelectedEvent();
    this.selectedEventList.push(...uuids);
  }
  clearSelectedEvent() {
    this.selectedEventList.splice(0, this.selectedEventList.length);
  }

  pushToSelectedList(uuid: string) {
    if (this.selectedEventList.includes(uuid)) {
      return;
    }
    this.selectedEventList.push(uuid);
  }

  deleteFromSelectedList(uuid: string) {
    const index = this.selectedEventList.findIndex((s) => s === uuid);
    if (index === -1) {
      return;
    }
    this.selectedEventList.splice(index, 1);
  }

  isSelected(uuid: string) {
    return !!this.selectedEventList.find((v) => v === uuid);
  }

  setSortBy(value: string) {
    this.sortBy = value;
  }

  setDesc(value: boolean) {
    this.asce = !value;
  }

  setSearch(value: string) {
    this.search = value;
    this.clearSelectedEvent();
  }
}

function getSortedSearchedList(
  events: IEvent[],
  search: string,
  sortBy: string,
  asce: boolean
) {
  let sortedSearchedEventList = [...events];
  if (search) {
    const fuse = new Fuse(sortedSearchedEventList, options);
    sortedSearchedEventList = fuse.search(search).map((r) => r.item);
  }
  sortedSearchedEventList = sortEvents(sortedSearchedEventList, sortBy, asce);
  return sortedSearchedEventList;
}

export default function EventList() {
  const globalState = useGlobalState();
  const state = React.useMemo(() => new SortState(), []);

  const { data: events, isLoading } = useEvents(globalState.office_uuid);

  const eventList = events?.map((event) => event) || [];
  const deletable =
    eventList?.filter((event) => !event.tenant_office_uuid) || [];

  const handleSelectAll = () => {
    let result = [...eventList];
    result = getSortedSearchedList(
      result,
      state.search,
      state.sortBy,
      state.asce
    );
    result = result?.filter((event) => !event.tenant_office_uuid) || [];
    if (!eventList || !result) return;
    if (state.selectedEventList.length === result.length) {
      state.setSelectedAll([]);
    } else {
      const uuids = result.map((d) => d.uuid);
      state.setSelectedAll(uuids);
    }
  };

  const isOrganizer = true;
  return (
    <>
      {isLoading ? (
        <OrangeryNavigationContentLoader />
      ) : eventList && eventList.length > 0 ? (
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
          <Header button={<AddNewDeskButton />} state={state} />

          <Observer>
            {() => {
              const sortedSearchedList = getSortedSearchedList(
                eventList,
                state.search,
                state.sortBy,
                state.asce
              );
              const searchedDeletable =
                sortedSearchedList?.filter(
                  (event) => !event.tenant_office_uuid
                ) || [];

              return sortedSearchedList.length > 0 ? (
                <DeleteAllSelected
                  events={sortedSearchedList}
                  onSelectAll={handleSelectAll}
                  checked={
                    (deletable!.length > 0 &&
                      state.selectedEventList.length === deletable!.length) ||
                    (searchedDeletable.length > 0 &&
                      state.selectedEventList.length ===
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
                eventList,
                state.search,
                state.sortBy,
                state.asce
              );
              return sortedSearchedList && sortedSearchedList.length > 0 ? (
                <EventRows
                  events={sortedSearchedList}
                  state={state}
                  isOrganizer={isOrganizer}
                />
              ) : (
                <OrangeryNoSearchResultPlaceholder />
              );
            }}
          </Observer>
        </Box>
      ) : (
        <OrangeryNavigationPlaceholder
          title={"No event has been created yet"}
          subtitle={"Create an event by clicking on the button below."}
          PlaceholderSvg={PlaceholderSvg}
          width="5rem"
          height="5.6rem"
          AddNewButton={<AddNewEventButton />}
          addNewButtonText={""}
          vertical
        />
      )}
    </>
  );
}
function EventRows({
  events,
  state,
  isOrganizer,
}: {
  events: IEvent[];
  state: SortState;
  isOrganizer: boolean;
}) {
  return (
    <div
      style={{
        height: `calc(100vh - 72px)`,
        overflow: "auto", // Make it scroll!
        display: "flex",
        flexDirection: "column",
        gap: 2,
      }}
      className="scroll-align"
    >
      {events.map((event) => (
        <EventRow
          key={event.uuid}
          event={event}
          state={state}
          isOrganizer={isOrganizer}
          // isSelected={!!state.selectedEventList?.find((v) => v === event?.uuid)}
        />
      ))}
    </div>
  );
}

function sortEvents(events: IEvent[], sortBy: string, asce: boolean) {
  if (sortBy) {
    switch (sortBy) {
      case "Title":
        return sortByTitle(events, asce);
      case "Address":
        return sortByAddress(events, asce);
      case "Start date and time":
        return sortByStartDateAndTime(events, asce);
    }
  }
  return events;
}

function sortByTitle(events: IEvent[], asce: boolean) {
  if (asce) {
    return events.sort((a, b) =>
      a.name.toLocaleUpperCase() > b.name.toLocaleUpperCase() ? 1 : -1
    );
  } else {
    return events.sort((a, b) =>
      a.name.toLocaleUpperCase() < b.name.toLocaleUpperCase() ? 1 : -1
    );
  }
}
function sortByAddress(events: IEvent[], asce: boolean) {
  if (asce) {
    return events.sort((a, b) =>
      a.location.toLocaleUpperCase() > b.location.toLocaleUpperCase() ? 1 : -1
    );
  } else {
    return events.sort((a, b) =>
      a.location.toLocaleUpperCase() < b.location.toLocaleUpperCase() ? 1 : -1
    );
  }
}
function sortByStartDateAndTime(events: IEvent[], asce: boolean) {
  if (!asce) {
    return events.sort((a, b) =>
      new Date(a.start_time) > new Date(b.start_time) ? 1 : -1
    );
  } else {
    return events.sort((a, b) =>
      new Date(a.start_time) < new Date(b.start_time) ? 1 : -1
    );
  }
}

const EventRow = observer(
  ({
    isOrganizer,
    event,
    state,
  }: // isSelected,
  {
    isOrganizer: boolean;
    event: IEvent;
    state: SortState;
    // isSelected: boolean;
  }) => {
    const { office_uuid } = useGlobalState();
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
    const isSelected =
      !!state.selectedEventList?.find((v) => v === event?.uuid) || false;

    return (
      <>
        <Observer>
          {() => (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 2,
                boxShadow: "1px 1px 8px #0000000a",
                border: isSelected
                  ? "1px solid #2B2E33"
                  : "1px solid rgb(210 215 221)",
                backgroundColor: isSelected ? "#F9F9FA" : "#fff",
                transition: "0.2s",
                transitionTimingFunction: "ease-in-out",
                borderRadius: 1.5,
                mb: 1.2,
                mx: 0,
                py: 2.7,
                px: 2.4,
                flexWrap: "wrap",
                "&.column": { pb: 1 },
                "& .width-column": { flex: 1 },
              }}
            >
              <Observer>
                {() => (
                  <>
                    {!event.tenant_office_uuid ? (
                      <DeleteCheckBox
                        onChange={(e) => handleSelect(event.uuid, e)}
                        checked={state.isSelected(event.uuid)}
                      />
                    ) : (
                      <Box sx={{ width: "33px" }} />
                    )}
                  </>
                )}
              </Observer>
              <Box
                sx={{
                  width: "60px",
                  height: "60px",
                  flexBasis: "5%",
                  borderRadius: "5px",
                }}
                // className="width-column"
                component={"img"}
                src={
                  event.images && event.images.length > 0
                    ? event.images[0].has_thumbnail
                      ? `${process.env.NEXT_PUBLIC_CDN_URL}/thumbnail/${event.images[0].uuid}.jpg`
                      : `${process.env.NEXT_PUBLIC_CDN_URL}/${event.images[0].uuid}.jpg`
                    : `${process.env.NEXT_PUBLIC_BASE_PATH}/assets/placeholder/noImage.png`
                }
                loading={"lazy"}
              />
              <span className="width-column">
                <Typography
                  fontSize={16}
                  fontWeight="600"
                  color="grey.A200"
                  className="column"
                >
                  Title
                </Typography>
                <Box
                  sx={{
                    mr: 2,
                    width: "100%",
                    textAlign: "left",
                    maxWidth: "80%",
                    "& .serial-number": {
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    },
                  }}
                >
                  <Typography variant="h4">
                    <OrangeryText
                      text={event.name ? event.name : "-"}
                      limit={10}
                    />
                  </Typography>
                </Box>
              </span>
              <span className="width-column">
                <Typography fontSize={16} fontWeight="600" color="grey.A200">
                  Location
                </Typography>
                <Typography variant="h4">
                  <OrangeryText
                    text={event.location ? event.location : "-"}
                    limit={10}
                  />
                </Typography>
              </span>
              <span className="width-column">
                <Typography fontSize={16} fontWeight="600" color="grey.A200">
                  Start
                </Typography>
                <Typography variant="h4">
                  {new Date(event.start_time).toLocaleString("de-DE", {
                    month: "long",
                    year: "numeric",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                    hourCycle: "h12",
                  })}
                </Typography>
              </span>
              <span className="width-column">
                <Typography fontSize={16} fontWeight="600" color="grey.A200">
                  End
                </Typography>
                <Typography variant="h4">
                  {new Date(event.end_time).toLocaleString("de-DE", {
                    month: "long",
                    year: "numeric",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                    hourCycle: "h12",
                  })}
                </Typography>
              </span>
              <span className="width-column">
                <Typography fontSize={16} fontWeight="600" color="grey.A200">
                  Repeate
                </Typography>
                <Typography variant="h4">
                  {event.weeks !== 0
                    ? `Weekly (${event.weeks} Time${
                        event.weeks > 1 ? "s" : ""
                      })`
                    : "One time"}
                </Typography>
              </span>
              <span className="width-column">
                <Typography fontSize={16} fontWeight="600" color="grey.A200">
                  Price
                </Typography>
                <Typography variant="h4">
                  <Observer>
                    {() => <OrangeryPrice euro={event.price} germanFormat />}
                  </Observer>
                </Typography>
              </span>
              <span className="width-column">
                <Typography fontSize={16} fontWeight="600" color="grey.A200">
                  Status
                </Typography>
                <Typography variant="h4">
                  <Observer>{() => <>Requested</>}</Observer>
                </Typography>
              </span>
              <Box
                className="width-column"
                sx={{ display: "flex", alignItems: "center", gap: 1 }}
              >
                <CopyLinkButton
                  text1={`${process.env.NEXT_PUBLIC_ORANGERY_LANDING_URL}/location?id=${office_uuid}&eventId=${event.uuid}`}
                  text2={`${process.env.NEXT_PUBLIC_CHECKOUT_URL}/event/?id=${event.uuid}&org=true`}
                />
                {event.organizer_note && <OrganizerNote event={event} />}
                <EventHistoryButton event={event} />
                <EditDeskButton event={event} state={state} />
              </Box>
            </Box>
          )}
        </Observer>
      </>
    );
  }
);

const OrganizerNote = ({ event }: { event: IEvent }) => {
  const [open, setOpen] = React.useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  return (
    <>
      <IconButton
        onClick={() => handleOpen()}
        sx={{ "& .note-icon": { width: "1.1rem", height: "1.1rem" } }}
      >
        <NoteIcon className="note-icon" />
      </IconButton>
      <Dialog
        open={open}
        onClose={handleClose}
        sx={{
          "& .MuiPaper-root": {
            width: 1263,
            minWidth: 1263,
            height: 890,
            borderRadius: "15px",
          },
        }}
      >
        <DialogContent sx={{ p: 0 }}>
          {open && <NoteDialog handleClose={handleClose} event={event} />}
        </DialogContent>
      </Dialog>
    </>
  );
};

const NoteDialog = ({
  handleClose,
  event,
}: {
  handleClose: () => void;
  event: IEvent;
}) => {
  return (
    <>
      <Box
        sx={{
          p: 4,
          gap: 4,
          display: "flex",
          // flexDirection: 'column',
          justifyContent: "end",
          alignItems: "center",
          borderBottom: "1px solid #EDEEF0",
        }}
      >
        <Typography
          sx={{ fontSize: 24, fontWeight: 600, color: "#000", flexGrow: 1 }}
        >
          Organizer’s Note
        </Typography>

        <IconButton
          onClick={handleClose}
          sx={{
            display: "flex",
            "& .cancel-icon": {
              width: "1.3rem",
              height: "1.3rem",
              color: "#2B2E33",
            },
          }}
        >
          <CrossIcon className="cancel-icon" />
        </IconButton>
      </Box>
      <Box sx={{ p: 4 }}>
        <Typography sx={{ fontSize: 16, fontWeight: 600, color: "#000" }}>
          {event.organizer_note ? event.organizer_note : "-"}
        </Typography>
      </Box>
    </>
  );
};

const Header = observer(
  ({ button, state }: { button?: JSX.Element; state: SortState }) => {
    const handleFilter = debounce((value: string) => {
      state.setSearch(value);
    }, 500);

    const sortItems: ISort[] = [
      {
        name: "Title",
        value: "Title",
      },
      {
        name: "Address",
        value: "Address",
      },
      {
        name: "Start date and time",
        value: "Start date and time",
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
                sx={{ width: "100%" }}
                onChange={(e) => {
                  handleFilter(e.target.value.toLowerCase());
                }}
                placeholder="Search ..."
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
                  <OrangerySortAutocomplete
                    sortItems={sortItems}
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
