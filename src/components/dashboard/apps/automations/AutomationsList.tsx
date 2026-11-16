// contexts & globals
import { useGlobalState } from "../../../../Contexts & Globals/GlobalContext";

// react & next
import React, { useState } from "react";

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
import AddNewAutomationButton from "./AddNewAutomationButton";
import EditAutomationButton from "./EditAutomationButton";
import Search from "@mui/icons-material/Search";
import ArrowDownAZIcon from "../../../../assets/svg/arrowDownAZ.svg";
import ArrowUpZAIcon from "../../../../assets/svg/arrowUpZA.svg";
import {
  OrangeryNavigationPlaceholder,
  OrangeryReadOnlySwitch,
  OrangeryNavigationContentLoader,
  OrangeryPrice,
  OrangeryText,
} from "../../../OrangeryElements";

// queries & backend
import { IAutomation, useAutomations } from "../../../../queries/apps/automations";

// icons, images & colors
// import ArrowDownAZIcon from "../../../assets/svg/arrowDownAZ.svg";
// import ArrowUpZAIcon from "../../../assets/svg/arrowUpZA.svg";
import PlaceholderSvg from "../../../../assets/svg/placeholders/automations-place-holder.svg";
import { makeAutoObservable } from "mobx";
import { Observer, observer } from "mobx-react-lite";
import SortAutomationAutocomplete from "./SortAutomationAutocomplete";
// import DeleteAllAutomationSelected from "./DeleteAllAutomationSelected";
import DeleteCheckBox from "../../desks/DeleteCheckBox";
import { width } from "@mui/system";
import OrangeryNoSearchResultPlaceholder from "../../../OrangeryElements/OrangeryNoSearchResultPlaceholder";
import OrangeryPreviewButton from "../../../OrangeryElements/OrangeryPreviewButton";
import AutomationOverviewDialog from "./overview/AutomationOverviewDialog";
import DeleteAutomationButton from "./DeleteAutomationButton";

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
  keys: ["name", "doors.length", "groups", "office.name", "active_from"],
};

export class SortAutomationState {
  public sortBy = "";
  public asce: boolean = true;
  public search: string = "";
  public selectedAutomationList: string[] = [];

  constructor() {
    makeAutoObservable(this);
  }

  setSelectedAll(uuids: string[]) {
    this.clearSelectedAutomation();
    this.selectedAutomationList.push(...uuids);
  }
  clearSelectedAutomation() {
    this.selectedAutomationList.splice(0, this.selectedAutomationList.length);
  }

  pushToSelectedList(uuid: string) {
    if (this.selectedAutomationList.includes(uuid)) {
      return;
    }
    this.selectedAutomationList.push(uuid);
  }

  deleteFromSelectedList(uuid: string) {
    const index = this.selectedAutomationList.findIndex((s) => s === uuid);
    if (index === -1) {
      return;
    }
    this.selectedAutomationList.splice(index, 1);
  }

  isSelected(uuid: string) {
    return !!this.selectedAutomationList.find((v) => v === uuid);
  }

  setSortBy(value: string) {
    this.sortBy = value;
  }

  setDesc(value: boolean) {
    this.asce = !value;
  }

  setSearch(value: string) {
    this.search = value;
    this.clearSelectedAutomation();
  }
}

function getSortedSearchedList(
  automation: IAutomation[],
  search: string,
  sortBy: string,
  asce: boolean
) {
  let sortedSearchedAutomationList = [...automation];
  if (search) {
    const fuse = new Fuse(sortedSearchedAutomationList, options);
    sortedSearchedAutomationList = fuse.search(search).map((r) => r.item);
  }
  sortedSearchedAutomationList = sortAutomations(
    sortedSearchedAutomationList,
    sortBy,
    asce
  );
  return sortedSearchedAutomationList;
}

export default function AutomationsList() {

  const globalState = useGlobalState();
  const state = React.useMemo(() => new SortAutomationState(), []);
  const { data: automations, isLoading } = useAutomations();

  const automationList = automations?.map((automation) => automation) || [];
  const deletable = automations?.filter(
    (automation) => !automation.uuid
  );

  const handleSelectAll = (e: any) => {
    let result = [...automationList];
    result = getSortedSearchedList(
      result,
      state.search,
      state.sortBy,
      state.asce
    );
    result =
      result?.filter((automation) => !automation.uuid) || [];
    if (!automationList || !result) return;
    if (state.selectedAutomationList.length === result.length) {
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
            ) : automations && automations.length > 0 ? (
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
                <Header button={<AddNewAutomationButton />} state={state} />

                {/* <Observer>
                  {() => {
                    const sortedSearchedList = getSortedSearchedList(
                      automations,
                      state.search,
                      state.sortBy,
                      state.asce
                    );
                    const searchedDeletable =
                      sortedSearchedList?.filter(
                        (meetingRoom) => !meetingRoom.uuid
                      ) || [];
                    return sortedSearchedList.length > 0 ? (
                      <DeleteAllAutomationSelected
                        automations={sortedSearchedList}
                        onSelectAll={handleSelectAll}
                        checked={
                          (deletable!.length > 0 &&
                            state.selectedAutomationList.length ===
                            deletable!.length) ||
                          (searchedDeletable.length > 0 &&
                            state.selectedAutomationList.length ===
                            searchedDeletable.length)
                        }
                        state={state}
                      />
                    ) : (
                      <span />
                    );
                  }}
                </Observer> */}

                <Observer>
                  {() => {
                    const sortedSearchedList = getSortedSearchedList(
                      automations,
                      state.search,
                      state.sortBy,
                      state.asce
                    );
                    return sortedSearchedList &&
                      sortedSearchedList.length > 0 ? (
                      <AutomationRows
                        automations={sortedSearchedList}
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
                height={70}
                vertical
                title={"No Automation Flow has been created yet"}
                subtitle={
                  "Create an automation flow by clicking on the button below."
                }
                PlaceholderSvg={PlaceholderSvg}
                AddNewButton={<AddNewAutomationButton />}
                addNewButtonText={""}
              />
            )}
          </>
        )}
      </Observer>
    </>
  );
}

const AutomationRows = ({
  state,
  automations,
}: {
  state: SortAutomationState;
  automations: IAutomation[];
}) => {
  return (
    <div
      style={{
        height: `calc(100vh - 72px)`,
        overflow: "auto", // Make it scroll!
      }}
      className="scroll-align"
    >
      {automations.map((automation) => (
        <AutomationCard key={automation.uuid} automation={automation} state={state} />
      ))}
    </div>
  );
};

function sortAutomations(
  automations: IAutomation[],
  sortBy: string,
  asce: boolean
) {
  if (sortBy) {
    switch (sortBy) {
      case "Name":
        return sortByName(automations, asce);
      case "Doors":
        return sortByDoor(automations, asce);
      case "Offer Type":
        return sortByOfferType(automations, asce);
      // case "Office":
      //   return sortByOffice(automations, asce);
      // case "Start Date":
      //   return sortByStartDate(automations, asce);

    }
  }
  return automations;
}

function sortByName(automations: IAutomation[], asce: boolean) {
  if (asce) {
    return automations.sort((a, b) =>
      a.name.toLocaleUpperCase() > b.name.toLocaleUpperCase() ? 1 : -1
    );
  } else {
    return automations.sort((a, b) =>
      a.name.toLocaleUpperCase() < b.name.toLocaleUpperCase() ? 1 : -1
    );
  }
}

// function sortByFloor(automations: IAutomation[], asce: boolean) {
//   if (!asce) {
//     return automations.sort((a, b) =>
//       a.assigned_floor?.name.toLocaleUpperCase() <
//         b.assigned_floor?.name.toLocaleUpperCase()
//         ? 1
//         : -1
//     );
//   } else {
//     return automations.sort((a, b) =>
//       a.assigned_floor?.name.toLocaleUpperCase() >
//         b.assigned_floor?.name.toLocaleUpperCase()
//         ? 1
//         : -1
//     );
//   }
// }

// function sortByDepartment(automations: IAutomation[], asce: boolean) {
//   if (!asce) {
//     return automations.sort((a, b) =>
//       a.department.toLocaleUpperCase() < b.department.toLocaleUpperCase()
//         ? 1
//         : -1
//     );
//   } else {
//     return automations.sort((a, b) =>
//       a.department.toLocaleUpperCase() > b.department.toLocaleUpperCase()
//         ? 1
//         : -1
//     );
//   }
// }
function sortByDoor(automations: IAutomation[], asce: boolean) {
  if (!asce) {
    return automations.sort((a, b) => (a.doors.length < b.doors.length ? 1 : -1));
  } else {
    return automations.sort((a, b) => (a.doors.length > b.doors.length ? 1 : -1));
  }
}

function sortByOfferType(automations: IAutomation[], asce: boolean) {
  if (!asce) {
    return automations.sort((a, b) => (a.offer_types.length < b.offer_types.length ? 1 : -1));
  } else {
    return automations.sort((a, b) => (a.offer_types.length > b.offer_types.length ? 1 : -1));
  }
}

// function sortByPrice(automations: IAutomation[], asce: boolean) {
//   const meetingRoomList = automations?.map((mr) => mr) || [];
//   if (!asce) {
//     return meetingRoomList.sort((a, b) => Number(b.price) - Number(a.price));
//   } else {
//     return meetingRoomList.sort((a, b) => Number(a.price) - Number(b.price));
//   }
// }

// function sortByActive(automations: IAutomation[], asce: boolean) {
//   if (!asce) {
//     return automations.sort((a, b) => (a.active > b.active ? 1 : -1));
//   } else {
//     return automations.sort((a, b) => (a.active < b.active ? 1 : -1));
//   }
// }

function AutomationCard({
  automation,
  state,
}: {
  automation: IAutomation;
  state: SortAutomationState;
}) {

  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <Box
        sx={{
          display: "flex",
          position: "relative",
          py: 2.7,
          pr: 3,
          pl: 3,
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
            flexBasis: "10%",
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
        {/* <Observer>
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
        </Observer> */}
        <Box
          sx={{
            flexBasis: "25%",
            // maxWidth: "16%",
            display: "flex",
            flexShrink: 0,
            flexDirection: "column",
            gap: "2px",
          }}
        >
          <Typography fontSize={13} fontWeight={600} color={"#9A9CA0"}>
            Automation Flow name
          </Typography>
          <Typography fontSize={16} fontWeight={400}>
            <OrangeryText text={automation.name} limit={30} />
          </Typography>
        </Box>
        <Box className="column-align">
          <Typography fontSize={13} fontWeight={600} color={"#9A9CA0"}>
            Doors
          </Typography>
          <Typography fontSize={16} fontWeight={400}>
            <OrangeryText
              text={automation.doors?.length.toString() + " " + (automation.doors?.length === 1 ? "Door" : "Doors") || "-"}
              limit={12}
            />
          </Typography>
        </Box>
        <Box className="column-align">
          <Typography fontSize={13} fontWeight={600} color={"#9A9CA0"}>
            Offer Types
          </Typography>
          <Typography fontSize={16} fontWeight={400}>
            <OrangeryText text={automation.offer_types.length.toString() + " " + (automation.offer_types?.length <= 1 ? "Type" : "Types") || "-"} limit={10} />
          </Typography>
        </Box>
        <Box className="column-align">
          <Typography fontSize={13} fontWeight={600} color={"#9A9CA0"}>
            User Roles
          </Typography>
          <Typography fontSize={16} fontWeight={400}>
            {automation.groups.length ?
              (automation.groups.length + ' ' + (automation.groups.length === 1
                ? "Role"
                : "Roles"))
              : "-"}
          </Typography>
        </Box>
        <Box className="column-align" sx={{ mr: 8 }}>
          <Typography fontSize={13} fontWeight={600} color={"#9A9CA0"}>
            Office
          </Typography>
          <Typography fontSize={16} fontWeight={400}>
            <OrangeryText text={automation.office?.name || "-"} limit={20} />
          </Typography>
        </Box>
        <Box className="column-align">
          <Typography fontSize={13} fontWeight={600} color={"#9A9CA0"}>
            Start Date / Time
          </Typography>
          <Typography fontSize={16} fontWeight={400}>
            {automation.active_from && new Date(automation.active_from).toLocaleString("de-DE", {
              month: "short",
              year: "numeric",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
              hourCycle: "h24",
            }) || "-"}
          </Typography>

        </Box>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 3,
            position: "absolute",
            right: "24px",
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
              alignItems: "center",
            }}
          >
            <Box sx={{ flexBasis: "15%", mr: 2, ml: { md: 10, lg: 0 } }}>
              <OrangeryPreviewButton onClick={handleOpen} />
            </Box>
            <EditAutomationButton automation={automation} />
            <DeleteAutomationButton automation={automation} />
          </Grid>
        </Box>
      </Box>
      <AutomationOverviewDialog automation={automation}
        automationResult={automation}
        open={open} handleClose={handleClose} />
    </>
  );
}

const Header = observer(
  ({
    button,
    state,
  }: {
    button?: JSX.Element;
    state: SortAutomationState;
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
                placeholder="Type here..."
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
                  <SortAutomationAutocomplete

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
