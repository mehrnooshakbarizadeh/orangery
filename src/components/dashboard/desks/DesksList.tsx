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
} from "@mui/material";

// orangery elements & internal dependencies
import EditDeskButton from "./EditDeskButton";
import AddNewDeskButton from "./AddNewDeskButton";
import {
  OrangeryUserCircle,
  OrangeryNavigationPlaceholder,
  OrangeryReadOnlySwitch,
  OrangeryNavigationContentLoader,
  OrangeryText,
  OrangeryPrice,
} from "../../OrangeryElements";
import OrangeryShowQRCodeButton from "../../OrangeryElements/OrangeryShowQRCodeButton";
import Search from "@mui/icons-material/Search";

// queries & backend
import { IDesk, usePublicDesks } from "../../../queries/desk";

// icons, images & colors
import PlaceholderSvg from "../../../assets/svg/placeholders/desks2.svg";
import ArrowDownAZIcon from "../../../assets/svg/arrowDownAZ.svg";
import ArrowUpZAIcon from "../../../assets/svg/arrowUpZA.svg";
import { makeAutoObservable } from "mobx";
import { observer, Observer } from "mobx-react-lite";
import SortAutocomplete from "./SortAutocomplete";
import { setLogger } from "react-query";
import { DeskState } from "./DeskForm";
import { ClassNames } from "@emotion/react";
import { ArrayValueState } from "../../../states/mobx-form";
import DeleteAllSelected from "./DeleteAllSelected";
import DeleteCheckBox from "./DeleteCheckBox";
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
  keys: [
    "name",
    "department",
    "assigned_user.name",
    "assigned_floor.name",
    "capacity",
  ],
};

export class SortState {
  public sortBy = "";
  public asce: boolean = true;
  public search: string = "";
  public selectedDeskList: string[] = [];

  constructor() {
    makeAutoObservable(this);
  }

  setSelectedAll(uuids: string[]) {
    this.clearSelectedDesk();
    this.selectedDeskList.push(...uuids);
  }
  clearSelectedDesk() {
    this.selectedDeskList.splice(0, this.selectedDeskList.length);
  }

  pushToSelectedList(uuid: string) {
    if (this.selectedDeskList.includes(uuid)) {
      return;
    }
    this.selectedDeskList.push(uuid);
  }

  deleteFromSelectedList(uuid: string) {
    const index = this.selectedDeskList.findIndex((s) => s === uuid);
    if (index === -1) {
      return;
    }
    this.selectedDeskList.splice(index, 1);
  }

  isSelected(uuid: string) {
    return !!this.selectedDeskList.find((v) => v === uuid);
  }

  setSortBy(value: string) {
    this.sortBy = value;
  }

  setDesc(value: boolean) {
    this.asce = !value;
  }

  setSearch(value: string) {
    this.search = value;
    this.clearSelectedDesk();
  }
}

function getSortedDearchedList(
  desks: IDesk[],
  search: string,
  sortBy: string,
  asce: boolean
) {
  let sortedSearchedDeskList = [...desks];
  if (search) {
    const fuse = new Fuse(sortedSearchedDeskList, options);
    sortedSearchedDeskList = fuse.search(search).map((r) => r.item);
  }
  sortedSearchedDeskList = sortDesks(sortedSearchedDeskList, sortBy, asce);
  return sortedSearchedDeskList;
}

export default function DesksList() {
  const globalState = useGlobalState();
  const state = React.useMemo(() => new SortState(), []);

  const { data: desks, isLoading } = usePublicDesks(globalState.office_uuid);

  const deskList = desks?.map((desk) => desk) || [];
  const deletable = deskList?.filter((desk) => !desk.tenant_office_uuid) || [];

  const handleSelectAll = () => {
    let result = [...deskList];
    result = getSortedDearchedList(
      result,
      state.search,
      state.sortBy,
      state.asce
    );
    result = result?.filter((desk) => !desk.tenant_office_uuid) || [];
    if (!deskList || !result) return;
    if (state.selectedDeskList.length === result.length) {
      state.setSelectedAll([]);
    } else {
      const uuids = result.map((d) => d.uuid);
      state.setSelectedAll(uuids);
    }
  };
  return (
    <>
      {isLoading ? (
        <OrangeryNavigationContentLoader />
      ) : desks && desks.length > 0 ? (
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
              const sortedSearchedList = getSortedDearchedList(
                desks,
                state.search,
                state.sortBy,
                state.asce
              );
              const searchedDeletable =
                sortedSearchedList?.filter(
                  (desk) => !desk.tenant_office_uuid
                ) || [];

              return sortedSearchedList.length > 0 ? (
                <DeleteAllSelected
                  desks={sortedSearchedList}
                  onSelectAll={handleSelectAll}
                  checked={
                    (deletable!.length > 0 &&
                      state.selectedDeskList.length === deletable!.length) ||
                    (searchedDeletable.length > 0 &&
                      state.selectedDeskList.length ===
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
              const sortedSearchedList = getSortedDearchedList(
                desks,
                state.search,
                state.sortBy,
                state.asce
              );
              return sortedSearchedList && sortedSearchedList.length > 0 ? (
                <DeskRows desks={sortedSearchedList} state={state} />
              ) : (
                <OrangeryNoSearchResultPlaceholder />
              );
            }}
          </Observer>
        </Box>
      ) : (
        <OrangeryNavigationPlaceholder
          title={"Start by adding some Desks!"}
          subtitle={
            "Add some Desks to build up your workstation and assign them to your employees."
          }
          PlaceholderSvg={PlaceholderSvg}
          AddNewButton={<AddNewDeskButton />}
          addNewButtonText={""}
        />
      )}
    </>
  );
}
function DeskRows({ desks, state }: { desks: IDesk[]; state: SortState }) {
  return (
    <div
      style={{
        height: `calc(100vh - 72px)`,
        overflow: "auto", // Make it scroll!
      }}
      className="scroll-align"
    >
      {desks.map((desk) => (
        <DeskRow key={desk.uuid} desk={desk} state={state} />
      ))}
    </div>
  );
}

function sortDesks(desks: IDesk[], sortBy: string, asce: boolean) {
  if (sortBy) {
    switch (sortBy) {
      case "Name":
        return sortByName(desks, asce);
      case "Flex":
        return sortByType(desks, asce);
      case "Department":
        return sortByDepartment(desks, asce);
      case "Capacity":
        return sortByCapacity(desks, asce);
      case "Floor":
        return sortByFloor(desks, asce);
      case "Active":
        return sortByActive(desks, asce);
    }
  }
  return desks;
}

function sortByName(desks: IDesk[], asce: boolean) {
  if (asce) {
    return desks.sort((a, b) =>
      a.name.toLocaleUpperCase() > b.name.toLocaleUpperCase() ? 1 : -1
    );
  } else {
    return desks.sort((a, b) =>
      a.name.toLocaleUpperCase() < b.name.toLocaleUpperCase() ? 1 : -1
    );
  }
}
function sortByType(desks: IDesk[], asce: boolean) {
  if (!asce) {
    return desks.sort((a, b) => (a.flex > b.flex ? 1 : -1));
  } else {
    return desks.sort((a, b) => (a.flex < b.flex ? 1 : -1));
  }
}
function sortByDepartment(meetingRooms: IDesk[], asce: boolean) {
  if (!asce) {
    return meetingRooms.sort((a, b) =>
      (a.department?.toLocaleUpperCase() ?? "") < (b.department?.toLocaleUpperCase() ?? "")
        ? 1
        : -1
    );
  } else {
    return meetingRooms.sort((a, b) =>
      (a.department?.toLocaleUpperCase() ?? "") > (b.department?.toLocaleUpperCase() ?? "")
        ? 1
        : -1
    );
  }
}
function sortByCapacity(desks: IDesk[], asce: boolean) {
  if (!asce) {
    return desks.sort((a, b) => Number(b.capacity) - Number(a.capacity));
  } else {
    return desks.sort((a, b) => Number(a.capacity) - Number(b.capacity));
  }
}
function sortByFloor(desks: IDesk[], asce: boolean) {
  const desklist = desks?.map((desk) => desk) || [];
  if (!asce) {
    return desklist.sort((a, b) =>
      (a.assigned_floor?.name.toLocaleUpperCase() || "") <
        (b.assigned_floor?.name.toLocaleUpperCase() || "")
        ? 1
        : -1
    );
  } else {
    return desklist.sort((a, b) =>
      (a.assigned_floor?.name.toLocaleUpperCase() || "") >
        (b.assigned_floor?.name.toLocaleUpperCase() || "")
        ? 1
        : -1
    );
  }
}
function sortByActive(desks: IDesk[], asce: boolean) {
  if (!asce) {
    return desks.sort((a, b) => (a.active > b.active ? 1 : -1));
  } else {
    return desks.sort((a, b) => (a.active < b.active ? 1 : -1));
  }
}

function DeskRow({ desk, state }: { desk: IDesk; state: SortState }) {
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
        <Observer>
          {() => (
            <>
              {!desk.tenant_office_uuid ? (
                <DeleteCheckBox
                  onChange={(e) => handleSelect(desk.uuid, e)}
                  checked={state.isSelected(desk.uuid)}
                />
              ) : (
                <Box sx={{ width: "33px" }} />
              )}
            </>
          )}
        </Observer>
        <Grid
          xs={3}
          sm={2}
          md={1.25}
          item
          sx={{ display: "flex", flexDirection: "column", gap: 1 }}
        >
          <Typography variant="h6" color="grey.A200">
            NAME
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
              <OrangeryText text={desk.name} limit={10} />
            </Typography>
          </Box>
        </Grid>
        <Grid
          item
          xs={3}
          sm={2.5}
          md={0.75}
          sx={{ display: "flex", flexDirection: "column", gap: 1 }}
        >
          <Typography variant="h6" color="grey.A200">
            TYPE
          </Typography>
          <Typography variant="h4">
            {desk.flex ? "Flexible" : "Personal"}
          </Typography>
        </Grid>
        <Grid
          item
          xs={3}
          sm={2}
          md={0.65}
          sx={{ display: "flex", flexDirection: "column", gap: 1 }}
        >
          <Typography variant="h6" color="grey.A200">
            CAPACITY
          </Typography>
          <Typography variant="h4">{desk.capacity || 0}</Typography>
        </Grid>
        <Grid
          item
          xs={3}
          sm={2.5}
          md={0.75}
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 1,
            pr: 0.25,
          }}
        >
          <Typography variant="h6" color="grey.A200">
            FLOOR
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
              {desk.assigned_floor?.name ? (
                <OrangeryText text={desk.assigned_floor?.name} limit={10} />
              ) : (
                "-"
              )}
            </Typography>
          </Box>
        </Grid>
        <Grid
          item
          xs={3}
          sm={3}
          md={1.35}
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 1,
            pr: 0.25,
          }}
        >
          <Typography variant="h6" color="grey.A200">
            DEPARTMENT
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
              {desk.department ? (
                <OrangeryText text={desk.department} limit={10} />
              ) : (
                "-"
              )}
            </Typography>
          </Box>
        </Grid>
        <Grid
          item
          xs={2}
          sm={2}
          md={1.35}
          sx={{ display: "flex", flexDirection: "column", gap: 1 }}
        >
          <Typography variant="h6" color="grey.A200">
            ASSIGNED TO
          </Typography>
          <Box
            sx={{
              display: "flex",
            }}
          >
            {desk.assigned_users?.length ? (
              desk.assigned_users.map((u) => (
                <OrangeryUserCircle
                  key={u.name}
                  name={u.name}
                  fileName={typeof u?.image === "string" ? u?.image : undefined}
                  size={32}
                />
              ))
            ) : (
              <Typography variant="h4">-</Typography>
            )}
          </Box>
        </Grid>
        <Grid
          item
          xs={2}
          sm={2}
          md={1}
          sx={{ display: "flex", flexDirection: "column", gap: 1 }}
        >
          <Typography variant="h6" color="grey.A200">
            OFFER NAME
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
              {desk.product?.name ? (
                <OrangeryText text={desk.product?.name} limit={18} />
              ) : (
                "-"
              )}
            </Typography>
          </Box>
        </Grid>
        <Grid
          item
          xs={3}
          sm={3}
          md={1.35}
          sx={{ display: "flex", flexDirection: "column", gap: 1 }}
        >
          <Typography variant="h6" color="grey.A200">
            CUSTOMER
          </Typography>
          {desk.customer ? (
            <Box sx={{ display: "flex", gap: 0.5, alignItems: "center" }}>
              <OrangeryUserCircle
                name={
                  desk.customer?.name ??
                  desk.customer?.first_name + " " + desk.customer?.last_name
                }
                fileName={desk.customer?.image ?? ""}
                size={24}
                noMargin
              />
              <Box
                sx={{
                  mr: 2,
                  width: "100%",
                  textAlign: "left",
                  maxWidth: { md: "60%", lg: "80%" },
                  "& .serial-number": {
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  },
                }}
              >
                <Typography variant="h4">
                  {desk.customer?.name && (
                    <OrangeryText
                      text={
                        `${desk.customer?.first_name}` +
                        " " +
                        `${desk.customer?.last_name}`
                      }
                      limit={10}
                    />
                  )}
                </Typography>
              </Box>
            </Box>
          ) : (
            <Typography variant="h4">-</Typography>
          )}
        </Grid>

        <Grid
          item
          xs={1}
          sm={1}
          md={1}
          sx={{ display: "flex", flexDirection: "column", gap: 1 }}
        >
          <Typography variant="h6" color="grey.A200">
            PRICE
          </Typography>
          <Typography variant="h4">
            {<OrangeryPrice euro={desk.price} germanFormat />}
          </Typography>
          {/* <Typography variant="h4">{desk.price ? desk.price : "-"}</Typography> */}
        </Grid>

        <Grid item xs={2} sm={2} md={1}>
          <OrangeryReadOnlySwitch
            label={{ checked: "Ready To Use", unchecked: "Disable" }}
            checked={desk.active}
          />
        </Grid>
        <Grid item xs={3} sm={3} md={1} textAlign={"right"}>
          <OrangeryShowQRCodeButton
            assetType={"desk"}
            uuid={desk.uuid}
            name={desk.name}
          />
          <EditDeskButton desk={desk} state={state} />
        </Grid>
      </Grid>
    </>
  );
}

const Header = observer(
  ({ button, state }: { button?: JSX.Element; state: SortState }) => {
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
                  <SortAutocomplete
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
