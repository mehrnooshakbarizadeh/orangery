import React from "react";
import {
  Box,
  Typography,
  Button,
  Grid,
  debounce,
  Input,
  InputAdornment,
} from "@mui/material";
import { observer, Observer } from "mobx-react-lite";
import { makeAutoObservable } from "mobx";
import Fuse from "fuse.js";
// orangery elements & internal dependencies
import {
  OrangeryNavigationContentLoader,
  OrangeryUserCard2,
  OrangeryNavigationPlaceholder,
  OrangeryToast,
  OrangeryText,
} from "../../../../OrangeryElements";

// icons, images & colors
import PlaceholderSvg from "../../../../../assets/svg/placeholders/door_access.svg";
import ArrowDownAZIcon from "../../../../../assets/svg/arrowDownAZ.svg";
import ArrowUpZAIcon from "../../../../../assets/svg/arrowUpZA.svg";
import SearchIcon from "@mui/icons-material/Search";
import SortDoorRequestAutocomplete from "./SortDoorRequestAutocomplete";
// import { doorRequest } from "./DoorRequestSample";
import { ValueState } from "../../../../../states/mobx-form";
import ActionRequestButton from "./ActionRequestButton";
import {
  IDoorRequest,
  IDoorRequestResult,
  useDoorRequests,
  usePutDoorRequest,
} from "../../../../../queries/doorRequest";
import { useRequest } from "./GetRequeste";

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
    "door-requests.user.name",
    "user.email",
    "product.name",
    "lock.lock_name",
    "email",
  ],
};

export class DoorRequestState {
  public door_request_uuids: string[] = [];
  public door_request_uuid;
  public status;
  public result: IDoorRequestResult | null = null;

  constructor(door_request?: IDoorRequest) {
    if (door_request) {
      this.door_request_uuid = new ValueState(door_request.uuid);
      this.status = new ValueState<string>(door_request.status);
    } else {
      this.door_request_uuid = new ValueState<string>("");
      this.status = new ValueState<string>("pending");
    }
    makeAutoObservable(this);
  }

  get data() {
    return {
      door_request_uuids: this.door_request_uuids.map((r) => r),
      door_request_uuid: this.door_request_uuid.value,
      status: this.status.value,
    };
  }

  setResult(result: IDoorRequestResult) {
    this.result = result;
  }

  setRequestId(requestId: string) {
    this.door_request_uuid.value = requestId;
  }

  setRequestStatus(status: string) {
    this.status.value = status;
  }

  setSelectedAll(uuids: string[]) {
    this.clearSelectedRequests();
    this.door_request_uuids.push(...uuids);
  }

  clearSelectedRequests() {
    this.door_request_uuids.splice(0, this.door_request_uuids.length);
  }

  pushToSelectedList(id: string) {
    if (this.door_request_uuids.includes(id)) {
      return;
    }
    this.door_request_uuids.push(id);
  }

  removeFromSelectedList(id: string) {
    const index = this.door_request_uuids.findIndex((s) => s === id);
    if (index === -1) {
      return;
    }
    this.door_request_uuids.splice(index, 1);
  }

  isAccepted(uuid: string) {
    return !!this.door_request_uuids.find((v) => v === uuid);
  }
}

export class DoorRequestListState {
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
  doorRequest: IDoorRequest[],
  search: string,
  sortBy: string,
  asce: boolean
) {
  let doorRequestList = [...doorRequest];

  if (search) {
    const fuse = new Fuse(doorRequestList, options);
    doorRequestList = fuse.search(search).map((r) => r.item);
  }

  doorRequestList = DoorRequestSort(doorRequestList, sortBy, asce);
  return doorRequestList;
}

function DoorRequestSort(
  doorRequest: IDoorRequest[],
  sortBy: string,
  asce: boolean
) {
  if (sortBy) {
    switch (sortBy) {
      case "Offer name":
        return sortByOfferName(doorRequest, asce);
      case "Name":
        return sortByName(doorRequest, asce);
      case "Email":
        return sortByEmail(doorRequest, asce);
      case "Lock name":
        return sortByLockName(doorRequest, asce);
      case "Status":
        return sortByStatus(doorRequest, asce);
      default: {
      }
    }
  }
  return doorRequest;
}

function sortByOfferName(doorRequests: IDoorRequest[], asce: boolean) {
  if (!asce) {
    return doorRequests.sort((a, b) =>
      a.product.name.toLowerCase() > b.product.name.toLowerCase() ? 1 : -1
    );
  } else {
    return doorRequests.sort((a, b) =>
      a.product.name.toLowerCase() < b.product.name.toLowerCase() ? 1 : -1
    );
  }
}

function sortByName(doorRequests: IDoorRequest[], asce: boolean) {
  if (!asce) {
    return doorRequests.sort((a, b) =>
      a?.user.name.toLowerCase() > b.user.name.toLowerCase() ? 1 : -1
    );
  } else {
    return doorRequests.sort((a, b) =>
      a?.user.name.toLowerCase() < b.user.name.toLowerCase() ? 1 : -1
    );
  }
}

function sortByEmail(doorRequests: IDoorRequest[], asce: boolean) {
  if (!asce) {
    return doorRequests.sort((a, b) =>
      a?.user.email.toLowerCase() > b.user.email.toLowerCase() ? 1 : -1
    );
  } else {
    return doorRequests.sort((a, b) =>
      a.user.email.toLowerCase() < b.user.email.toLowerCase() ? 1 : -1
    );
  }
}

function sortByLockName(doorRequests: IDoorRequest[], asce: boolean) {
  if (!asce) {
    return doorRequests.sort((a, b) =>
      a?.lock.lock_name.toLowerCase() > b.lock.lock_name.toLowerCase() ? 1 : -1
    );
  } else {
    return doorRequests.sort((a, b) =>
      a.lock.lock_name.toLowerCase() < b.lock.lock_name.toLowerCase() ? 1 : -1
    );
  }
}

function sortByStatus(doorRequests: IDoorRequest[], asce: boolean) {
  if (!asce) {
    return doorRequests.sort((a, b) =>
      a?.status.toLowerCase() > b.status.toLowerCase() ? 1 : -1
    );
  } else {
    return doorRequests.sort((a, b) =>
      a?.status.toLowerCase() < b.status.toLowerCase() ? 1 : -1
    );
  }
}

export default function DoorRequestList() {
  const request = useRequest();
  const { data: doorRequest, isLoading } = useDoorRequests();
  const state = React.useMemo(() => new DoorRequestListState(), []);
  const doorRequestState = React.useMemo(
    () => new DoorRequestState(request),
    [request]
  );

  return (
    <>
      {isLoading ? (
        <OrangeryNavigationContentLoader />
      ) : doorRequest && doorRequest.length > 0 ? (
        <Box
          sx={{
            backgroundColor: "#fff",
            display: "flex",
            flexDirection: "column",
            // justifyContent: "start",
            // minHeight: 666,
            height: "100%",
            borderRadius: 1.5,
            py: 3,
            px: 2,
          }}
        >
          <Header state={state} />

          <Box
            sx={{
              overflowY: "auto", // Make it scroll!
              height: `calc(100% - 12px)`,
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
                  doorRequest,
                  state.search,
                  state.sortBy,
                  state.asce
                );
                return sortedSearchedList && sortedSearchedList.length > 0 ? (
                  <DoorRequestRows
                    doorRequests={sortedSearchedList}
                    state={state}
                    doorRequestState={doorRequestState}
                  />
                ) : (
                  <OrangeryNavigationPlaceholder
                    vertical
                    width={213}
                    height={224}
                    title={"No door access found!"}
                    subtitle={"Please search or filter somthing else"}
                    PlaceholderSvg={PlaceholderSvg}
                    addNewButtonText={""}
                  />
                );
              }}
            </Observer>
          </Box>
        </Box>
      ) : (
        <OrangeryNavigationPlaceholder
          vertical
          width={213}
          height={224}
          title={"No door request is available!"}
          subtitle={"buy a product with room"}
          PlaceholderSvg={PlaceholderSvg}
          // AddNewButton={<AddNewDoorAccessButton />}
          addNewButtonText={""}
        />
      )}
    </>
  );
}

const DoorRequestRows = ({
  state,
  doorRequests,
  doorRequestState,
}: {
  doorRequestState: DoorRequestState;
  state: DoorRequestListState;
  doorRequests: IDoorRequest[];
}) => {
  const mutation = usePutDoorRequest();

  const handleSelectAll = () => {
    let result = [...doorRequests];
    result = getSortedSearchedList(
      result,
      state.search,
      state.sortBy,
      state.asce
    );
    if (!doorRequests || !result) return;
    if (doorRequestState.door_request_uuids.length === result.length) {
      doorRequestState.setSelectedAll([]);
      doorRequestState.setRequestStatus("pending");
      OrangeryToast("Successfully unselected all", "success");
    } else {
      const uuids = result.map((d) => d.uuid);
      doorRequestState.setSelectedAll(uuids);
      doorRequestState.setRequestStatus("accepted");
      OrangeryToast("Successfully selected all", "success");
    }
    handleSubmit();
  };

  async function handleSubmit() {
    try {
      await mutation.mutateAsync(doorRequestState.data);
    } catch (err: any) {
      // state.setupErrors(err);
    }
  }

  return (
    <>
      <Observer>
        {() => (
          <>
            <Button
              onClick={handleSelectAll}
              variant="outlined"
              sx={{
                backgroundColor: "#fff",
                color: "#000",
                border: "1px solid #9A9CA0",
                "&.MuiButton-root:hover": {
                  backgroundColor: "#fff",
                  border: "1px solid #9A9CA0",
                },
                width: "95px",
                fontSize: 14,
                fontWeight: 500,
                whiteSpace: "nowrap",
                position: "absolute",
                right: "80px",
                top: "103px",
                py: "5px",
                px: "49px",
              }}
            >
              Accept all
            </Button>
            {doorRequests.map((doorRequest) => (
              <DoorRequestRow
                key={doorRequest.uuid}
                doorRequest={doorRequest}
                doorRequestState={doorRequestState}
              />
            ))}
          </>
        )}
      </Observer>
    </>
  );
};

function DoorRequestRow({
  doorRequest,
  doorRequestState,
}: {
  doorRequest: IDoorRequest;
  doorRequestState: DoorRequestState;
}) {
  return (
    <Observer>
      {() => (
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
            fontSize: 16,
            fontWeight: 500,
            "& .MuiTypography-root": {
              "&.sub-text": {
                fontsize: "19px",
                fontWeight: "700",
              },
              "&.title": {
                fontSize: "13px",
                fontWeight: "600",
              },
            },
          }}
        >
          <Grid
            xs={3}
            sm={2}
            item
            sx={{
              display: "flex",
              // alignItems: "center",
              gap: "2px",
              flexDirection: "column",
            }}
          >
            <Typography className="title">OFFER NAME</Typography>
            <OrangeryText
              text={doorRequest.product?.name ? doorRequest.product?.name : "-"}
              sx={{ fontSize: "19px", fontWeight: "700" }}
              limit={20}
            />
          </Grid>

          <Grid
            xs={4}
            sm={4}
            md={2}
            item
            sx={{
              display: "flex",
              // alignItems: "center",
              gap: 1,
              overflow: "hidden",
              flexDirection: "column",
            }}
          >
            <OrangeryUserCard2 size="46px" user={doorRequest.user} />
          </Grid>

          <Grid
            xs={4}
            sm={3}
            md={2}
            item
            sx={{
              display: "flex",
              // alignItems: "center",
              gap: 1,
              flexDirection: "column",
            }}
          >
            <Typography className="title">LOCK NAME</Typography>
            <OrangeryText
              text={doorRequest.lock.lock_name}
              limit={20}
              sx={{ fontSize: "19px", fontWeight: "700" }}
            />
          </Grid>

          <Grid
            xs={4}
            sm={4}
            md={3}
            item
            sx={{
              display: "flex",
              // alignItems: "center",
              gap: 1,
              flexDirection: "column",
            }}
          >
            <Typography className="title">STATUS</Typography>
            <Typography className="sub-text" color="#FF9900">
              {" "}
              Pending
            </Typography>
          </Grid>

          <Box
            sx={{
              flex: 1,
              display: {
                xs: "none",
                sm: "flex",
              },
            }}
          />
          <Grid
            item
            xs={2}
            sm={2}
            md={1}
            sx={{
              display: "flex",
              flexDirection: "row",
              flex: "none",
              textAlign: "right",
              justifyContent: "end",
              pr: 4.5,
            }}
          >
            <Observer>
              {() => (
                <ActionRequestButton
                  doorRequest={doorRequest}
                  doorRequestState={doorRequestState}
                  isAccepted={doorRequestState.isAccepted(doorRequest.uuid)}
                />
              )}
            </Observer>
          </Grid>
        </Grid>
      )}
    </Observer>
  );
}

const Header = observer(
  ({
    button,
    state,
  }: {
    button?: JSX.Element;
    state: DoorRequestListState;
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
            sx={{
              flexGrow: 1,
              display: "flex",
              alignItems: "center",
              gap: 1,
              pt: 1,
            }}
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
                sx={{
                  width: "100%",
                  "& .MuiInput-input": {
                    fontSize: "17px !important",
                    fontWeight: "400 !important",
                    color: "#505357 !important",
                  },
                }}
                placeholder="Type here ..."
                startAdornment={
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                }
              />
            </Box>
            <Box sx={{ minWidth: 264, maxWidth: 400 }}>
              <SortDoorRequestAutocomplete
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
                minWidth: 60,
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
