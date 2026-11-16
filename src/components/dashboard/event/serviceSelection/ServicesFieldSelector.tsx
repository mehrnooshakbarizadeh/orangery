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
  useAvailableMeetingRooms,
  useMeetingRooms,
} from "../../../../queries/meetingRoom";
import { EventFieldsState } from "../EventForm";
import { Observer, observer } from "mobx-react-lite";
import {
  IServicePartner,
  useServicePartners,
} from "../../../../queries/servicePartners";
import ServicePartnerRow from "./ServicePartnerRow";
import { makeAutoObservable } from "mobx";
import Fuse from "fuse.js";
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

export class ServicesSearchState {
  public search: string = "";

  constructor() {
    makeAutoObservable(this);
  }

  setSearch(value: string) {
    this.search = value;
  }
}

function getSearchedList(services: IServicePartner[], search: string) {
  let serviceList = [...services];
  if (search) {
    const fuse = new Fuse(serviceList, options);
    serviceList = fuse.search(search).map((r) => r.item);
  }
  return serviceList;
}

export default function ServicesFieldSelector({
  state,
  handleClose,
}: {
  state: EventFieldsState;
  handleClose: () => void;
}) {
  const { isLoading, data: servicePartners } = useServicePartners();
  const servicePartnerList = servicePartners?.map((sp) => sp) || [];

  const searchState = React.useMemo(() => new ServicesSearchState(), []);

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
            Add Service Partner
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
            placeholder="Search Services ..."
            startAdornment={
              <InputAdornment position="start">
                <Search />
              </InputAdornment>
            }
          />
        </Box>

        {isLoading ? (
          <OrangeryNavigationContentLoader />
        ) : servicePartnerList && servicePartnerList.length > 0 ? (
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
                    servicePartnerList,
                    searchState.search
                  );
                  return searchedList && searchedList.length > 0 ? (
                    <ServiceRows
                      state={state}
                      servicePartnerList={searchedList}
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
                No Service Partner is available.
              </Typography>
            </Box>
          </>
        )}
      </Box>
    </>
  );
}

const ServiceRows = observer(
  ({
    servicePartnerList,
    state,
  }: {
    servicePartnerList: IServicePartner[];
    state: EventFieldsState;
  }) => {
    return (
      <>
        {servicePartnerList?.map((sp) => (
          <ServicePartnerRow
            state={state}
            key={sp.uuid}
            service={sp}
            selected={
              !!state.services.values?.find(
                (v) => v.value.data.uuid === sp.uuid
              )
            }
          />
        ))}
      </>
    );
  }
);
