// contexts & globals
import { useGlobalState } from "../../../../Contexts & Globals/GlobalContext";

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
import AddNewServicePartnerButton from "./AddNewServicePartnerButton";
import EditServicePartnerButton from "./EditServicePartnerButton";
import Search from "@mui/icons-material/Search";
import ArrowDownAZIcon from "../../../../assets/svg/arrowDownAZ.svg";
import ArrowUpZAIcon from "../../../../assets/svg/arrowUpZA.svg";
import {
  OrangeryNavigationPlaceholder,
  OrangeryNavigationContentLoader,
  OrangeryText,
} from "../../../OrangeryElements";

// queries & backend
import { IServicePartner, useServicePartners } from "../../../../queries/servicePartners";
// icons, images & colors
import PlaceholderSvg from "../../../../assets/svg/placeholders/service-partner-empty-state.svg";
import { makeAutoObservable } from "mobx";
import { Observer, observer } from "mobx-react-lite";
import SortServicePartnerAutocomplete from "./SortServicePartnerAutocomplete";
import DeleteCheckBox from "../../desks/DeleteCheckBox";
import { width } from "@mui/system";
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
  keys: ["name", "description", "email", "category"],
};

export class SortServicePartnerState {
  public sortBy = "";
  public asce: boolean = true;
  public search: string = "";
  public selectedServicePartnerList: string[] = [];

  constructor() {
    makeAutoObservable(this);
  }

  setSelectedAll(uuids: string[]) {
    this.clearSelectedServicePartner();
    this.selectedServicePartnerList.push(...uuids);
  }
  clearSelectedServicePartner() {
    this.selectedServicePartnerList.splice(0, this.selectedServicePartnerList.length);
  }

  pushToSelectedList(uuid: string) {
    if (this.selectedServicePartnerList.includes(uuid)) {
      return;
    }
    this.selectedServicePartnerList.push(uuid);
  }

  deleteFromSelectedList(uuid: string) {
    const index = this.selectedServicePartnerList.findIndex((s) => s === uuid);
    if (index === -1) {
      return;
    }
    this.selectedServicePartnerList.splice(index, 1);
  }

  isSelected(uuid: string) {
    return !!this.selectedServicePartnerList.find((v) => v === uuid);
  }

  setSortBy(value: string) {
    this.sortBy = value;
  }

  setDesc(value: boolean) {
    this.asce = !value;
  }

  setSearch(value: string) {
    this.search = value;
    this.clearSelectedServicePartner();
  }
}

function getSortedSearchedList(
  servicePartners: IServicePartner[],
  search: string,
  sortBy: string,
  asce: boolean
) {
  let sortedSearchedServicePartnerList = [...servicePartners];
  if (search) {
    const fuse = new Fuse(sortedSearchedServicePartnerList, options);
    sortedSearchedServicePartnerList = fuse.search(search).map((r) => r.item);
  }
  sortedSearchedServicePartnerList = sortServicePartners(
    sortedSearchedServicePartnerList,
    sortBy,
    asce
  );
  return sortedSearchedServicePartnerList;
}

export default function ServicePartnersList() {
  const globalState = useGlobalState();
  const state = React.useMemo(() => new SortServicePartnerState(), []);

  const { data: servicePartners, isLoading: servicePartnersIsLoading } = useServicePartners();
  const servicePartnersList = servicePartners?.map((servicePartner) => servicePartner) || [];
  const deletable = servicePartners?.filter(
    (servicePartner) => !servicePartner.uuid
  );

  const handleSelectAll = (e: any) => {
    let result = [...servicePartnersList];
    result = getSortedSearchedList(
      result,
      state.search,
      state.sortBy,
      state.asce
    );
    result =
      result?.filter((servicePartner) => !servicePartner.uuid) || [];
    if (!servicePartnersList || !result) return;
    if (state.selectedServicePartnerList.length === result.length) {
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
            {servicePartnersIsLoading ? (
              <OrangeryNavigationContentLoader />
            ) : servicePartners && servicePartners.length > 0 ? (
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
                <Header button={<AddNewServicePartnerButton />} state={state} />

                {/* <Observer>
                  {() => {
                    const sortedSearchedList = getSortedSearchedList(
                      servicePartners,
                      state.search,
                      state.sortBy,
                      state.asce
                    );
                    const searchedDeletable =
                      sortedSearchedList?.filter(
                        (servicePartner) => !servicePartner.uuid
                      ) || [];
                    return sortedSearchedList.length > 0 ? (
                      <DeleteAllMeetingRoomSelected
                        meetingRooms={sortedSearchedList}
                        onSelectAll={handleSelectAll}
                        checked={
                          (deletable!.length > 0 &&
                            state.selectedServicePartnerList.length ===
                            deletable!.length) ||
                          (searchedDeletable.length > 0 &&
                            state.selectedServicePartnerList.length ===
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
                      servicePartners,
                      state.search,
                      state.sortBy,
                      state.asce
                    );
                    return sortedSearchedList &&
                      sortedSearchedList.length > 0 ? (
                      <ServicePartnerRows
                        servicePartners={sortedSearchedList}
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
                title={"There is no Service Partner."}
                subtitle={
                  "Add a service partner by clicking on the button below."
                }
                PlaceholderSvg={PlaceholderSvg}
                AddNewButton={<AddNewServicePartnerButton />}
                addNewButtonText={""}
                vertical
                height={56}
              />
            )}
          </>
        )}
      </Observer>
    </>
  );
}

const ServicePartnerRows = ({
  state,
  servicePartners,
}: {
  state: SortServicePartnerState;
  servicePartners: IServicePartner[];
}) => {
  return (
    <div
      style={{
        height: `calc(100vh - 72px)`,
        overflow: "auto", // Make it scroll!
      }}
      className="scroll-align"
    >
      {servicePartners.map((mr) => (
        <ServicePartnerCard key={mr.uuid} servicePartner={mr} state={state} />
      ))}
    </div>
  );
};

function sortServicePartners(
  servicePartners: IServicePartner[],
  sortBy: string,
  asce: boolean
) {
  if (sortBy) {
    switch (sortBy) {
      case "Name":
        return sortByName(servicePartners, asce);
      case "Email":
        return sortByEmail(servicePartners, asce);
      case "Category":
        return sortByCategory(servicePartners, asce);
    }
  }
  return servicePartners;
}

function sortByName(servicePartners: IServicePartner[], asce: boolean) {
  if (asce) {
    return servicePartners.sort((a, b) =>
      a.name.toLocaleUpperCase() > b.name.toLocaleUpperCase() ? 1 : -1
    );
  } else {
    return servicePartners.sort((a, b) =>
      a.name.toLocaleUpperCase() < b.name.toLocaleUpperCase() ? 1 : -1
    );
  }
}
function sortByEmail(servicePartners: IServicePartner[], asce: boolean) {
  if (!asce) {
    return servicePartners.sort((a, b) =>
      a.email.toLocaleUpperCase() < b.email.toLocaleUpperCase()
        ? 1
        : -1
    );
  } else {
    return servicePartners.sort((a, b) =>
      a.email.toLocaleUpperCase() > b.email.toLocaleUpperCase()
        ? 1
        : -1
    );
  }
}
function sortByCategory(servicePartners: IServicePartner[], asce: boolean) {
  if (!asce) {
    return servicePartners.sort((a, b) =>
      a.category.toLocaleUpperCase() < b.category.toLocaleUpperCase()
        ? 1
        : -1
    );
  } else {
    return servicePartners.sort((a, b) =>
      a.category.toLocaleUpperCase() > b.category.toLocaleUpperCase()
        ? 1
        : -1
    );
  }
}

function ServicePartnerCard({
  servicePartner,
  state,
}: {
  servicePartner: IServicePartner;
  state: SortServicePartnerState;
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

          position: "relative",
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
            flexBasis: "20%",
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
              {!servicePartner.uuid ? (
                <DeleteCheckBox
                  onChange={(e) => handleSelect(servicePartner.uuid, e)}
                  checked={state.isSelected(servicePartner.uuid)}
                />
              ) : (
                <Box sx={{ width: "33px" }} />
              )}
            </>
          )}
        </Observer>
        <Box
          sx={{
            flexBasis: "26%",
            // maxWidth: "16%",
            display: "flex",
            flexShrink: 0,
            flexDirection: "column",
            gap: "2px",
          }}
        >
          <Typography fontSize={13} fontWeight={600} color={"#9A9CA0"}>
            Service Partner Name
          </Typography>
          <Typography sx={{ fontSize: 16, fontWeight: 400 }}>
            <OrangeryText text={servicePartner.name} limit={20} />
          </Typography>
        </Box>
        {/* <Box className="column-align">
          <Typography fontSize={16} fontWeight={600} color={"#9A9CA0"}>
            DESCRIPTION
          </Typography>
          <Typography variant="h4">
            <OrangeryText
              text={servicePartner.description || "-"}
              limit={12}
            />
          </Typography>
        </Box> */}
        <Box className="column-align">
          <Typography fontSize={13} fontWeight={600} color={"#9A9CA0"}>
            EMAIL
          </Typography>

          <Typography sx={{ fontSize: 16, fontWeight: 400 }}>
            <OrangeryText text={servicePartner.email || "-"} limit={20} />
          </Typography>
        </Box>
        <Box className="column-align">
          <Typography fontSize={13} fontWeight={600} color={"#9A9CA0"}>
            Service Category
          </Typography>
          <Typography sx={{ fontSize: 16, fontWeight: 400 }}>{servicePartner.category || "-"}</Typography>
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
            }}
          >
            {/* <Box sx={{ flexBasis: "15%", mr: 2, ml: { md: 10, lg: 0 } }}>
              <OrangeryReadOnlySwitch
                label={{ checked: "Ready To Use", unchecked: "Disable" }}
                checked={servicePartner.active}
              />
            </Box> */}
            <EditServicePartnerButton servicePartner={servicePartner} state={state} />
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
    state: SortServicePartnerState;
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
                  <SortServicePartnerAutocomplete
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
