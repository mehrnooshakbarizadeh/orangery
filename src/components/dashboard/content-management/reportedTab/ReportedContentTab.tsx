import Search from "@mui/icons-material/Search";
import ArrowDownAZIcon from "../../../../assets/svg/arrowDownAZ.svg";
import ArrowUpZAIcon from "../../../../assets/svg/arrowUpZA.svg";
import Fuse from "fuse.js";
import ReviewIcon from "../../../../assets/svg/content-management-review.svg";
import React from "react";
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
import {
  OrangeryNavigationPlaceholder,
  OrangeryUserCircle,
  OrangeryNavigationContentLoader,
  OrangeryText,
  OrangerySortAutocomplete,
  OrangeryToast,
} from "../../../OrangeryElements";
import PlaceholderSvg from "../../../../assets/svg/placeholders/content-management.svg";
import { makeAutoObservable } from "mobx";
import { observer, Observer } from "mobx-react-lite";
import OrangeryNoSearchResultPlaceholder from "../../../OrangeryElements/OrangeryNoSearchResultPlaceholder";
import { useGlobalState } from "../../../../Contexts & Globals/GlobalContext";
import {
  IPublishedContent,
  useReportedContents,
  useUpsertBlockContent,
} from "../../../../queries/content-management";
import { ISort } from "../../../OrangeryElements/OrangerySortAutocomplete";
import ReportedOverviewDialog from "./ReportedOverviewDialog";
import { ValueState } from "../../../../states/mobx-form";

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
  keys: ["author.name", "reported_by.name", "reported_by.email"],
};

export class BlockReportedState {
  public post_uuid;
  public publish;
  public office_uuid;

  constructor(office_uuid: string, content: IPublishedContent) {
    this.office_uuid = new ValueState(office_uuid);

    this.post_uuid = new ValueState(content.uuid);
    this.publish = new ValueState(content.published);

    makeAutoObservable(this);
  }

  get data() {
    return {
      post_uuid: this.post_uuid.value,
      publish: this.publish.value,
      office_uuid: this.office_uuid.value,
    };
  }
}
export class ReportedContentSortState {
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
  publishedContent: IPublishedContent[],
  search: string,
  sortBy: string,
  asce: boolean
) {
  let sortedSearchedPublishedList = [...publishedContent];
  if (search) {
    const fuse = new Fuse(sortedSearchedPublishedList, options);
    sortedSearchedPublishedList = fuse.search(search).map((r) => r.item);
  }
  sortedSearchedPublishedList = sortPublishedContents(
    sortedSearchedPublishedList,
    sortBy,
    asce
  );
  return sortedSearchedPublishedList;
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

export default function ReportedContentTab() {
  const globalState = useGlobalState();
  const state = React.useMemo(() => new ReportedContentSortState(), []);
  const { data: reportedContent, isLoading } = useReportedContents(
    globalState.office_uuid
  );

  return (
    <>
      <Observer>
        {() => (
          <>
            {isLoading ? (
              <OrangeryNavigationContentLoader />
            ) : reportedContent && reportedContent.length > 0 ? (
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
                      reportedContent,
                      state.search,
                      state.sortBy,
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
  state: ReportedContentSortState;
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
      {contents.map((content, index) => (
        <ContentRow key={index} content={content} />
      ))}
    </div>
  );
};

function ContentRow({ content }: { content: IPublishedContent }) {
  const globalState = useGlobalState();
  const blockState = React.useMemo(
    () => new BlockReportedState(globalState.office_uuid, content),
    [globalState.office_uuid, content.uuid]
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
      OrangeryToast("Successfully unblocked " + content.title, "success");
      // handleClose();
    } catch (err: any) {
      // state.setupErrors(err);
      console.log("error");
    }
  }
  return (
    <form onSubmit={handleBlock}>
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
            // alignItems: "center",
            flexDirection: "column",
            gap: "2px",
            flexBasis: "22%",
            "& .memo-icon": { width: "1.3rem" },
          }}
        >
          <Typography fontSize={12} fontWeight={600} color="#A5AAB4">
            Author
          </Typography>
          <Box sx={{ display: "flex", alignItems: "center", gap: 3 }}>
            <OrangeryUserCircle
              name={content.author?.name}
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
              <Box
                sx={{
                  fontSize: "16",
                  fontWeight: 400,
                }}
                className="visitor-name"
              >
                <OrangeryText text={content.author?.name} limit={20} />
              </Box>
            </Box>
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
          <Typography fontSize={12} fontWeight={600} color="#A5AAB4">
            Article
          </Typography>
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
        <Box
          sx={{
            display: "flex",
            // alignItems: "center",
            flexDirection: "column",
            gap: "2px",
            flexBasis: "22%",
            "& .memo-icon": { width: "1.3rem" },
          }}
        >
          <Typography fontSize={12} fontWeight={600} color="#A5AAB4">
            Reporter
          </Typography>
          <Box sx={{ display: "flex", alignItems: "center", gap: 3 }}>
            <OrangeryUserCircle
              name={content.reported_by?.name}
              fileName={
                typeof content.reported_by?.image === "string"
                  ? content.reported_by?.image
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
              <Box
                sx={{
                  fontSize: "16",
                  fontWeight: 400,
                }}
                className="visitor-name"
              >
                <OrangeryText text={content.reported_by?.name} limit={20} />
              </Box>
              <Box
                sx={{
                  fontSize: "16",
                  fontWeight: 400,
                }}
                className="visitor-name"
              >
                <OrangeryText text={content.reported_by?.email} limit={20} />
              </Box>
            </Box>
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
          <Typography fontSize={12} fontWeight={600} color="#A5AAB4">
            Reason
          </Typography>
          <Typography fontSize={12} fontWeight={700}>
            <OrangeryText text={content.description} limit={50} />
          </Typography>
        </Box>
        <Observer>
          {() => (
            <>
              {blockState.publish.value && (
                <ReportedOverviewDialog
                  overview={content}
                  blockState={blockState}
                />
              )}
              {!blockState.publish.value && (
                <Button
                  type="submit"
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
                // onClick={handleBlock}
                >
                  <ReviewIcon className="icon" />
                  <Typography className="add-btn">unblock</Typography>
                </Button>
              )}
            </>
          )}
        </Observer>
      </Box>
    </form>
  );
}

const Header = observer(
  ({
    button,
    state,
  }: {
    button?: JSX.Element;
    state: ReportedContentSortState;
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
                minWidth: 300,
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
        </Box>
      </>
    );
  }
);
