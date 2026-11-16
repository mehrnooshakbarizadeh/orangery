// contexts & globals
import { useGlobalState } from "../../../../../Contexts & Globals/GlobalContext";
import Fuse from "fuse.js";
// react & next
import React from "react";

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
import Search from "@mui/icons-material/Search";
// orangery elements & internal dependencies
import { OrangeryNavigationContentLoader } from "../../../../OrangeryElements";

// queries & backend
import { IAsset, IAssetGroup, useAssets } from "../../../../../queries/asset";

// icons, images & colors
import CrossIcon from "../../../../../assets/svg/cross.svg";
import EmptyStateIcon from "../../../../../assets/svg/offer-empty-state.svg";
import { makeAutoObservable } from "mobx";
import OrangeryNoSearchResultPlaceholder from "../../../../OrangeryElements/OrangeryNoSearchResultPlaceholder";
import AssetRow from "./AssetRow";

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

export class OfferAssetSearchState {
  public search: string = "";

  constructor() {
    makeAutoObservable(this);
  }

  setSearch(value: string) {
    this.search = value;
  }
}

function getSearchedList(assets: IAsset[], search: string) {
  let assetsList = [...assets];
  if (search) {
    const fuse = new Fuse(assetsList, options);
    assetsList = fuse.search(search).map((r) => r.item);
  }
  return assetsList;
}

export default function AssetFieldsSelector({
  value,
  handleChange,
  handleClose,
}: {
  value: string[];
  handleChange: (value: string[]) => void;
  handleClose: () => void;
}) {
  const globalState = useGlobalState();
  const { isLoading, data: availableAssets } = useAssets({
    office_uuid: globalState.office_uuid,
    status: "available",
    // status: "rentable",
  });
  const searchState = React.useMemo(() => new OfferAssetSearchState(), []);

  const assetsList = availableAssets?.map((asset) => asset) || [];

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
            Add Asset
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
        ) : assetsList && assetsList.length > 0 ? (
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
                    assetsList,
                    searchState.search
                  );
                  return searchedList && searchedList.length > 0 ? (
                    <AssetRows
                      assets={searchedList}
                      // state={searchState}
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
                No asset is available.
              </Typography>
            </Box>
          </>
        )}
      </Box>
    </>
  );
}

const AssetRows = ({
  assets,
  value,
  handleChange,
}: {
  value: string[];
  handleChange: (value: string[]) => void;
  assets: IAsset[];
}) => {
  return (
    <>
      {assets?.map((asset) => (
        <AssetRow
          handleChange={handleChange}
          value={value}
          key={asset.uuid}
          asset={asset}
          selected={!!value.find((v) => v === asset.uuid)}
        />
      ))}
    </>
  );
};
