// contexts & globals
import { useGlobalState } from "../../../../../Contexts & Globals/GlobalContext";

// react & next
import React from "react";
import Fuse from "fuse.js";
// external dependencies
import {
  Box,
  debounce,
  IconButton,
  Input,
  InputAdornment,
  List,
  ListItem,
  Typography,
} from "@mui/material";
import { Observer } from "mobx-react-lite";

// orangery elements & internal dependencies
import { OrangeryNavigationContentLoader } from "../../../../OrangeryElements";
import DeskRow from "./DeskRow";

// queries & backend
import { IDesk, useDesks } from "../../../../../queries/desk";
import Search from "@mui/icons-material/Search";

// icons, images & colors
import CrossIcon from "../../../../../assets/svg/cross.svg";
import EmptyStateIcon from "../../../../../assets/svg/offer-empty-state.svg";
import { makeAutoObservable } from "mobx";
import OrangeryNoSearchResultPlaceholder from "../../../../OrangeryElements/OrangeryNoSearchResultPlaceholder";

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
  keys: ["name", "assigned_floor.name"],
};

export class OfferDeskSearchState {
  public search: string = "";

  constructor() {
    makeAutoObservable(this);
  }

  setSearch(value: string) {
    this.search = value;
  }
}

function getSearchedList(desks: IDesk[], search: string) {
  let desksList = [...desks];
  if (search) {
    const fuse = new Fuse(desksList, options);
    desksList = fuse.search(search).map((r) => r.item);
  }
  return desksList;
}

export default function FieldsSelector({
  value,
  handleChange,
  handleClose,
}: {
  value: string[];
  handleChange: (value: string[]) => void;
  handleClose: () => void;
}) {
  const globalState = useGlobalState();
  const { isLoading, data: availableDesks } = useDesks({
    office_uuid: globalState.office_uuid,
  });
  const searchState = React.useMemo(() => new OfferDeskSearchState(), []);

  const desksList = availableDesks?.map((desk) => desk) || [];

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
            Add Desk
          </Typography>
          <IconButton onClick={handleClose}>
            <CrossIcon className="cancel-icon" />
          </IconButton>
        </Box>

        <Box
          sx={{
            width: "30%",
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
            placeholder="Search doors ..."
            startAdornment={
              <InputAdornment position="start">
                <Search />
              </InputAdornment>
            }
          />
        </Box>

        {isLoading ? (
          <OrangeryNavigationContentLoader />
        ) : desksList && desksList.length > 0 ? (
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
              height: `496px`,
            }}
          >
            <List
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: 1,
                width: "100%",
                height: "100%",
                overflow: "auto",
                mb: 2,
                "&.MuiList-root": { py: 0 },
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
                  const searchedList = getSearchedList(
                    desksList,
                    searchState.search
                  );
                  return searchedList && searchedList.length > 0 ? (
                    <DesksRows
                      desks={searchedList}
                      state={searchState}
                      value={value}
                      handleChange={handleChange}
                    />
                  ) : (
                    <OrangeryNoSearchResultPlaceholder
                      width="100px"
                      height="100px"
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
                No desk is available.
              </Typography>
            </Box>
          </>
        )}
      </Box>
    </>
  );
}

const DesksRows = ({
  state,
  desks,
  value,
  handleChange,
}: {
  value: string[];
  handleChange: (value: string[]) => void;
  state: OfferDeskSearchState;
  desks: IDesk[];
}) => {
  return (
    <>
      {desks?.map((desk) => (
        <DeskRow
          handleChange={handleChange}
          value={value}
          key={desk.uuid}
          desk={desk}
          selected={!!value.find((v) => v === desk.uuid)}
        />
      ))}
    </>
  );
};
