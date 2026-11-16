// contexts & globals
import Search from "@mui/icons-material/Search";
import ArrowDownAZIcon from "../../../../assets/svg/arrowDownAZ.svg";
import ArrowUpZAIcon from "../../../../assets/svg/arrowUpZA.svg";
import Fuse from "fuse.js";
// react & next
import React from "react";
import ReviewIcon from "../../../../assets/svg/content-management-review.svg";

// external dependencies
import {
  Box,
  Button,
  debounce,
  Fade,
  Grid,
  IconButton,
  Input,
  InputAdornment,
  Tooltip,
  Typography,
} from "@mui/material";
import { useVirtualizer } from "@tanstack/react-virtual";
// orangery elements & internal dependencies
import {
  OrangeryNavigationPlaceholder,
  OrangeryUserCircle,
  OrangeryReadOnlySwitch,
  OrangeryNavigationContentLoader,
  OrangeryTooltip,
  OrangeryText,
  OrangerySortAutocomplete,
  OrangeryToast,
  OrangerySwitch,
} from "../../../OrangeryElements";

// icons, images & colors
import PlaceholderSvg from "../../../../assets/svg/placeholders/content-management.svg";
import FileIcon from "../../../assets/svg/file.svg";
import FileLockIcon from "../../../assets/svg/file-lock.svg";
import { makeAutoObservable } from "mobx";
import { observer, Observer } from "mobx-react-lite";
import OrangeryNoSearchResultPlaceholder from "../../../OrangeryElements/OrangeryNoSearchResultPlaceholder";
import { useGlobalState } from "../../../../Contexts & Globals/GlobalContext";
import {
  IPublishedContent,
  usePublishedContents,
  useUpsertBlockContent,
} from "../../../../queries/content-management";
import { ISort } from "../../../OrangeryElements/OrangerySortAutocomplete";
import PublishedOverviewDialog from "./PublishedOverviewDialog";
import { ValueState } from "../../../../states/mobx-form";
import FilterPublishedContent from "./FilterPublishedContent";

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
  keys: ["author.name"],
};

export class BlockState {
  public post_uuid;
  public publish;
  public office_uuid;
  public is_featured;

  constructor(office_uuid: string, content: IPublishedContent) {
    this.office_uuid = new ValueState(office_uuid);

    this.post_uuid = new ValueState(content.uuid);
    this.publish = new ValueState(content.published);
    this.is_featured = new ValueState(content.is_featured);

    makeAutoObservable(this);
  }

  get data() {
    return {
      post_uuid: this.post_uuid.value,
      publish: this.publish.value,
      office_uuid: this.office_uuid.value,
      is_featured: this.is_featured.value,
    };
  }
}
export class PublishedContentSortState {
  public sortBy = "";
  public filterBy: string[] = [];
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

  isSelected(filter: string) {
    return !!this.filterBy.find((v) => v === filter);
  }

  pushToFilterList(value: string) {
    if (this.filterBy.includes(value)) {
      return;
    }
    this.filterBy.push(value);
  }

  deleteFromFilterList(value: number) {
    this.filterBy.splice(value, 1);
  }
}

function getSortedSearchedList(
  publishedContent: IPublishedContent[],
  search: string,
  sortBy: string,
  filterBy: string[],
  asce: boolean
) {
  let sortedSearchedPublishedList = [...publishedContent];
  if (search) {
    const fuse = new Fuse(sortedSearchedPublishedList, options);
    sortedSearchedPublishedList = fuse.search(search).map((r) => r.item);
  }
  if (filterBy) {
    sortedSearchedPublishedList = OfferFilter(sortedSearchedPublishedList, filterBy);
  }
  sortedSearchedPublishedList = sortPublishedContents(
    sortedSearchedPublishedList,
    sortBy,
    asce
  );
  return sortedSearchedPublishedList;
}

function OfferFilter(publishedContents: IPublishedContent[], filterBy: string[]) {
  let filterList = [...publishedContents];
  filterBy.forEach((v, j) => {
    if (v === "Featured Post") {
      filterList = filterByFeatured(filterList);
    }
  });
  return filterList;
}

function filterByFeatured(publishedContents: IPublishedContent[]) {
  return publishedContents.filter((publishedContent) => publishedContent.is_featured);
}

function sortPublishedContents(
  publishedContent: IPublishedContent[],
  sortBy: string,
  asce: boolean
) {
  if (sortBy) {
    switch (sortBy) {
      case "Author Name":
        return sortByName(publishedContent, asce);
    }
  }
  return publishedContent;
}

function sortByName(publishedContents: IPublishedContent[], asce: boolean) {
  if (asce) {
    return publishedContents?.sort((a, b) =>
      a?.author.name.toLocaleUpperCase() < b?.author.name.toLocaleUpperCase()
        ? 1
        : -1
    );
  } else {
    return publishedContents?.sort((a, b) =>
      a.author.name.toLocaleUpperCase() > b.author.name.toLocaleUpperCase()
        ? 1
        : -1
    );
  }
}

export default function PublishedTab() {
  const globalState = useGlobalState();
  const state = React.useMemo(() => new PublishedContentSortState(), []);
  const { data: contents, isLoading } = usePublishedContents(
    globalState.office_uuid
  );
  const publishedContent = contents?.map((content) => content) || [];

  return (
    <>
      <Observer>
        {() => (
          <>
            {isLoading ? (
              <OrangeryNavigationContentLoader />
            ) : publishedContent && publishedContent.length > 0 ? (
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
                <Header state={state} />
                <Observer>
                  {() => {
                    const sortedSearchedList = getSortedSearchedList(
                      publishedContent,
                      state.search,
                      state.sortBy,
                      state.filterBy,
                      state.asce
                    );
                    return (
                      <>
                        {sortedSearchedList && sortedSearchedList.length > 0 ? (
                          <ContentRows
                            contents={sortedSearchedList}
                            state={state}
                          />
                        ) : (
                          <OrangeryNoSearchResultPlaceholder />
                        )}
                      </>
                    );
                  }}
                </Observer>
              </Box>
            ) : (
              <OrangeryNavigationPlaceholder
                vertical
                width="100.86px"
                height="81px"
                title={"No Content has been created yet"}
                subtitle={
                  "Content generated by users will be seen in this section."
                }
                PlaceholderSvg={PlaceholderSvg}
                AddNewButton={<></>}
                addNewButtonText={""}
              />
            )}
          </>
        )}
      </Observer>
    </>
  );
}

const ContentRows = ({
  state,
  contents,
}: {
  state: PublishedContentSortState;
  contents: IPublishedContent[];
}) => {
  return (
    <div
      style={{
        height: `calc(100vh - 72px)`,
        overflow: "auto",
      }}
      className="scroll-align"
    >
      {contents.map((content) => (
        <ContentRow key={content.uuid} content={content} />
      ))}
    </div>
  );
};

function ContentRow({ content }: { content: IPublishedContent }) {
  const globalState = useGlobalState();
  const blockState = React.useMemo(
    () => new BlockState(globalState.office_uuid, content),
    [globalState.office_uuid, content]
  );
  const mutation = useUpsertBlockContent();

  const handleBlock = (e: React.FormEvent) => {
    blockState.publish.value = true;
    handleSubmit(e);
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      await mutation.mutateAsync(blockState.data);
      // handleClose();
      OrangeryToast("Successfully unblocked " + content.title, "success");
    } catch (err: any) {
      // state.setupErrors(err);
    }
  }

  return (
    <>
      <Box
        sx={{
          display: "flex",
          py: 2.7,
          px: 2.4,
          boxShadow: "1px 1px 8px #0000000a",
          border: "1px solid rgb(210 215 221)",
          alignItems: "center",
          gap: 2,
          borderRadius: 1.5,
          mb: 1.2,
          mx: 0,
          fontSize: 16,
          fontWeight: 500,
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 3,
            flexBasis: "22%",
            "& .memo-icon": { width: "1.3rem" },
          }}
        >
          <OrangeryUserCircle
            name={content.author.name}
            fileName={
              typeof content.author?.image === "string"
                ? content.author?.image
                : undefined
            }
          />
          <Box
            sx={{
              display: "block",
              alignItems: "center",
              "& .visitor-name": { textTransform: "capitalize" },
            }}
          >
            <Typography fontSize={16} fontWeight={400} className="visitor-name">
              <OrangeryText text={content.author.name} limit={20} />
            </Typography>
          </Box>
        </Box>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 1,
            flex: 1,
            "& .host-name": { textTransform: "capitalize" },
          }}
        >
          <Typography fontSize={12} fontWeight={700}>
            {content.title}
          </Typography>
          <Box
            sx={{
              color: "#55585C",
              fontSize: "12",
              fontWeight: 400,
            }}
            className="host-name"
          >
            <OrangeryText text={content.body} limit={15} />
          </Box>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', columnGap: 3 }}>
          <Observer>
            {() => (
              <OrangerySwitch
                textOnRight
                label={{
                  checked: "Featured Post",
                  unchecked: "Featured Post",
                }}
                checked={blockState.is_featured.value}
                onChange={async (e) => {
                  blockState.is_featured.value = e.target.checked
                  e.preventDefault();
                  try {
                    await mutation.mutateAsync(blockState.data);
                    blockState.is_featured.value ?
                      OrangeryToast("The post was selected as the mobile Featured Post",
                        "success",) :
                      OrangeryToast("The post was removed from the Featured  list\n",
                        "error",)
                  } catch (err: any) {
                  }
                }}
              />
            )}
          </Observer>
          <Observer>
            {() => (
              <>
                {blockState.publish.value && (
                  <PublishedOverviewDialog
                    overview={content}
                    blockState={blockState}
                  />
                )}
                {!blockState.publish.value && (
                  <Button
                    sx={{
                      py: 1,
                      gap: 1,
                      height: "32px",
                      backgroundColor: "#FF3D00",
                      color: "#fff",
                      // flex: 1,
                      "&.MuiButton-root": { px: "10px" },
                      "& .icon": { width: "1rem", height: "1rem", color: "#fff" },
                      "&:hover": {
                        backgroundColor: "#FF3D00 !important",
                      },
                      "& .add-btn": {
                        fontSize: 14,
                        fontWeight: 600,
                        color: "#fff",
                      },
                    }}
                    variant="contained"
                    onClick={handleBlock}
                  >
                    <ReviewIcon className="icon" />
                    <Typography className="add-btn">unblock</Typography>
                  </Button>
                )}
              </>
            )}
          </Observer>
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
    state: PublishedContentSortState;
  }) => {
    const handleFilter = debounce((value: string) => {
      state.setSearch(value);
    }, 500);

    const sortItems: ISort[] = [
      {
        name: "Author Name",
        value: "Author Name",
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
                onChange={(e) => {
                  handleFilter(e.target.value.toLowerCase());
                }}
                sx={{ width: "100%" }}
                placeholder="search ..."
                endAdornment={
                  <InputAdornment position="end">
                    <Search />
                  </InputAdornment>
                }
              />
            </Box>
            <Box sx={{ minWidth: 264, maxWidth: 400 }}>
              <OrangerySortAutocomplete
                sortItems={sortItems}
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

                maxWidth: 400,
                "& .arrow-icon": { width: "1.2rem", height: "1.4rem" },
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
            <FilterPublishedContent state={state} />
          </Box>
        </Box>
      </>
    );
  }
);
