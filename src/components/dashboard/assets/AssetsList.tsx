// contexts & globals
import { useGlobalState } from "../../../Contexts & Globals/GlobalContext";
import theme from "../../../Contexts & Globals/theme";

// react & next
import React from "react";

// external dependencies
import {
  Button,
  Collapse,
  debounce,
  Divider,
  Grid,
  IconButton,
  Input,
  InputAdornment,
  Paper,
  Typography,
} from "@mui/material";
import { Box } from "@mui/system";

// orangery elements & internal dependencies
import ActionButton from "./ActionButton";
import AddNewAssetButton from "./AddNewAssetButton";
import {
  OrangeryReadOnlySwitch,
  OrangeryNavigationPlaceholder,
  OrangeryNavigationContentLoader,
  OrangeryPrice,
  OrangeryImage,
  OrangeryUserCard4,
  OrangeryText,
} from "../../OrangeryElements";
import { OrangeryGlobalFilter } from "../../OrangeryElements";
import OrangeryShowQRCodeButton from "../../OrangeryElements/OrangeryShowQRCodeButton";
import Fuse from "fuse.js";

import Search from "@mui/icons-material/Search";

// queries & backend
import { IAsset, IAssetGroup, useAssetGroups } from "../../../queries/asset";

// icons, images & colors
import AngleDownIcon from "../../../assets/svg/angleDown.svg";
import AngleUpIcon from "../../../assets/svg/angleUp.svg";
import ArrowDownAZIcon from "../../../assets/svg/arrowDownAZ.svg";
import ArrowUpZAIcon from "../../../assets/svg/arrowUpZA.svg";
import PlaceholderSvg from "../../../assets/svg/placeholders/search-empty-state.svg";
import { makeAutoObservable } from "mobx";
import { Observer, observer } from "mobx-react-lite";
import SortAssetAutocomplete from "./SortAssetAutocomplete";
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
  keys: ["name"],
};

export class AssetSortState {
  public sortBy = "";
  public asce: boolean = true;
  public search: string = "";
  public id: string;

  constructor() {
    this.id =
      crypto?.randomUUID?.() || Math.round(Math.random() * 1000000).toString();
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
  asset: IAssetGroup[],
  search: string,
  sortBy: string,
  asce: boolean
) {
  let assetList = [...asset];
  if (search) {
    const fuse = new Fuse(assetList, options);
    assetList = fuse.search(search).map((r) => r.item);
  }
  assetList = AssetsSort(assetList, sortBy, asce);
  return assetList;
}

function AssetsSort(asset: IAssetGroup[], sortBy: string, asce: boolean) {
  if (sortBy) {
    switch (sortBy) {
      case "Stock":
        return sortByStock(asset, asce);
    }
  }
  return asset;
}

function sortByStock(asset: IAssetGroup[], asce: boolean) {
  if (asce) {
    return asset?.sort((a, b) => (a?.stock < b?.stock ? 1 : -1));
  } else {
    return asset?.sort((a, b) => (a?.stock > b?.stock ? 1 : -1));
  }
}

export default function AssetsList() {
  const globalState = useGlobalState();
  const { data: assets, isLoading } = useAssetGroups(globalState.office_uuid);
  const state = React.useMemo(() => new AssetSortState(), []);
  const [open, setOpen] = React.useState(false);

  return (
    <>
      {isLoading ? (
        <OrangeryNavigationContentLoader />
      ) : assets && Array.isArray(assets) && assets.length > 0 ? (
        <Box
          sx={{
            py: 3,
            px: 2,
            backgroundColor: "#fff",
            borderRadius: "6px",
            height: "100%",
          }}
        >
          <Header button={<AddNewAssetButton />} state={state} />
          <Box
            sx={{
              overflowY: "auto",
              height: "calc(100% - 56px)",
              "&::-webkit-scrollbar": {
                width: "0.4em",
              },
              "&::-webkit-scrollbar-track": {
                // boxShadow: "inset 0 0 6px rgba(0,0,0,0.00)",
                // webkitBoxShadow: "inset 0 0 6px rgba(0,0,0,0.00)",
              },
              "&::-webkit-scrollbar-thumb": {
                backgroundColor: "rgba(0,0,0,.1)",
                // outline: "1px solid slategrey",
                borderRadius: 5,
              },
            }}
          >
            <Observer>
              {() => {
                const sortedSearchedList = getSortedSearchedList(
                  assets,
                  state.search,
                  state.sortBy,
                  state.asce
                );
                return sortedSearchedList && sortedSearchedList.length > 0 ? (
                  <AssetRows assets={sortedSearchedList} state={state} />
                ) : (
                  <OrangeryNoSearchResultPlaceholder />
                );
              }}
            </Observer>
            {/* {assets?.map((asset) => (
              <AssetRow key={asset.name} asset={asset} />
            ))} */}
          </Box>
        </Box>
      ) : (
        <OrangeryNavigationPlaceholder
          title={"No more worrying about managing your company inventories!"}
          subtitle={
            "Distribute and manage company assets among your employees."
          }
          PlaceholderSvg={PlaceholderSvg}
          AddNewButton={<AddNewAssetButton />}
          addNewButtonText={""}
        />
      )}
    </>
  );
}

function AssetRows({
  assets,
  state,
}: {
  assets: IAssetGroup[];
  state: AssetSortState;
}) {
  return (
    <>
      {assets.map((asset) => (
        <MainRow key={asset.name} asset={asset} />
      ))}
    </>
  );
}
function MainRow({ asset }: { asset: IAssetGroup }) {
  const [open, setOpen] = React.useState(false);

  const handleToggle = () => {
    setOpen(!open);
  };
  return (
    <>
      <Paper
        sx={{
          mb: 1,
          mx: 0,
          border: "1px solid rgb(210 215 221)",
          boxShadow: "1px 1px 8px #0000000a",
          px: 2,
        }}
      >
        <Grid
          container
          // onClick={handleToggle}
          sx={{
            display: "flex",
            // justifyContent: "space-between",
            alignItems: "center",
            textAlign: "center",
            m: 1,
            pl: 1,
            // "&:hover": { cursor: "pointer" },
          }}
        >
          <Grid
            item
            xs={4}
            sm={4}
            md={4}
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              flex: "1 1 17%",
            }}
          >
            <Box>
              {asset.image ? (
                <Box
                  sx={{
                    width: "80px",
                    height: "80px",
                    objectFit: "contain",
                  }}
                  component={"img"}
                  src={`${process.env.NEXT_PUBLIC_CDN_URL}/${asset.image}.jpg`}
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
            {/* <OrangeryImage
              image={asset.images?.map((image) => image)[0]}
              noImageSrc={`${process.env.NEXT_PUBLIC_BASE_PATH}/assets/placeholder/noImage.png`}
              has_thumbnail={asset.has_thumbnail}
              enlargeable
              sx={{
                width: "80px",
                height: "80px",
                objectFit: "contain",
              }}
            /> */}
            <Typography variant="h4">
              <OrangeryText text={asset.name} limit={40} />
            </Typography>
          </Grid>

          <Grid
            item
            xs={3}
            sm={3}
            md={2}
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 2,
              flex: "1 1 30%",
            }}
          >
            <Typography>Stock:</Typography>
            <Typography variant="h4">{asset.stock}</Typography>
          </Grid>

          <Grid
            item
            xs={4}
            sm={4}
            md={6}
            sx={{ flex: "2 1 40%", textAlign: "end", pr: "15px" }}
          >
            <IconButton
              onClick={handleToggle}
              sx={{
                "& .action-icon": {
                  width: "1.3rem",
                  height: "1.3rem",
                  cursor: "pointer",
                },
              }}
            >
              {!open ? (
                <AngleDownIcon className="action-icon" />
              ) : (
                <AngleUpIcon className="action-icon" />
              )}
            </IconButton>
          </Grid>
        </Grid>
        <Divider />
        <Collapse in={open}>
          <Box sx={{ px: 1 }}>
            {asset.assets?.map((asset: IAsset) => (
              <>
                <SubRow key={asset.uuid} asset={asset} />
                <Divider />
              </>
            ))}
          </Box>
        </Collapse>
      </Paper>
    </>
  );
}

function SubRow({ asset }: { asset: IAsset }) {
  return (
    <>
      <Grid
        container
        sx={{
          display: "flex",
          // justifyContent: "space-between",
          gap: 1,
          rowGap: 2,
          alignItems: "center",
          py: 3,
          textAlign: "center",
          "& .subrow-header": {},
          "& .column-flex": {
            width: "100%",
            display: "flex",
            alignItems: "center",
            gap: 1,
            flexGrow: 1,
          },
        }}
      >
        <Grid item xs={12} sm={6} md={3}>
          {asset.assigned_user ? (
            <OrangeryUserCard4 user={asset.assigned_user} size={40} />
          ) : (
            // (
            //             <Box
            //               sx={{
            //                 display: "flex",
            //                 alignItems: "center",
            //                 justifyContent: "start",
            //                 gap: 2,
            //                 flexGrow: 1,
            //               }}
            //             >
            //               <Box
            //                 sx={{
            //                   borderRadius: "100%",
            //                   width: "40px",
            //                   height: "40px",
            //                 }}
            //                 component={"img"}
            //                 src={
            //                   asset.assigned_user?.has_thumbnail
            //                     ? `${process.env.NEXT_PUBLIC_CDN_URL}/thumbnail/${asset.assigned_user?.image}.jpg`
            //                     : `${process.env.NEXT_PUBLIC_CDN_URL}/${asset.assigned_user?.image}.jpg`
            //                 }
            //                 loading={"lazy"}
            //               />
            //               <Typography variant="h5">{asset.assigned_user?.name}</Typography>
            //             </Box>
            //           ) : (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 2,
                flexGrow: 1,
              }}
            >
              <Box
                sx={{
                  backgroundColor: "#E6E6E6",
                  borderRadius: "100%",
                  width: 40,
                  height: 40,
                }}
              ></Box>
              <Typography variant="h4">Not Assigned</Typography>
            </Box>
          )}
        </Grid>
        <Grid item xs={6} sm={5} md={2} className="column-flex">
          <Typography>Serial Number:</Typography>
          {asset.serial_number ? (
            <>
              <Box
                sx={{
                  mr: 2,
                  width: "100%",
                  textAlign: "center",
                  maxWidth: "70%",
                  "& .serial-number": {
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  },
                }}
              >
                <Typography variant="h4">
                  <OrangeryText text={asset.serial_number} limit={10} />
                </Typography>
              </Box>
            </>
          ) : (
            <Typography className="subrow-header" variant="h4">
              -
            </Typography>
          )}
        </Grid>
        <Grid item xs={5} sm={3} md={1} className="column-flex">
          <Typography>Price:</Typography>
          {asset.price ? (
            <>
              <Box
                sx={{
                  width: "100%",
                  textAlign: "center",
                  maxWidth: "70%",
                  "& .serial-number": {
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  },
                }}
              >
                <Typography className="serial-number" variant="h4">
                  <OrangeryPrice euro={asset.price} germanFormat />
                </Typography>
              </Box>
            </>
          ) : (
            "-"
          )}
        </Grid>
        <Grid item xs={4} sm={4} md={2} className="column-flex">
          <Typography>Invoice:</Typography>
          {asset.invoice ? (
            <Box
              sx={{
                mr: 2,
                width: "100%",
                textAlign: "center",
                maxWidth: "66%",
                "& .invoce-file-name": {
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                },
              }}
            >
              <Typography className="invoce-file-name" variant="h4">
                {asset.invoice?.name}
              </Typography>
            </Box>
          ) : (
            <Typography variant="h4">Not Uploaded</Typography>
          )}
        </Grid>

        <Grid
          item
          xs={4}
          sm={2}
          md={1}
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            mr: 10,
          }}
        >
          <OrangeryReadOnlySwitch
            label={{ checked: "Active", unchecked: "Inactive" }}
            checked={asset.active}
          />
        </Grid>

        <Grid
          item
          xs={3}
          sm={2}
          md={1.6}
          sx={{
            display: "flex",
            flexDirection: "row",
            flex: "none",
            alignItems: "center",
            justifyContent: "flex-end",
          }}
        >
          <OrangeryShowQRCodeButton
            assetType={"asset"}
            uuid={asset.uuid}
            name={asset.name}
            sx={{ mr: 1 }}
          />
          <ActionButton asset={asset} />
        </Grid>
      </Grid>
    </>
  );
}

const Header = observer(
  ({ button, state }: { button?: JSX.Element; state: AssetSortState }) => {
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
                    <Search />
                  </InputAdornment>
                }
              />
            </Box>
            <Box sx={{ minWidth: 264, maxWidth: 400 }}>
              <SortAssetAutocomplete
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
