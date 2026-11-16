// contexts & globals
import { useGlobalState } from "../../../Contexts & Globals/GlobalContext";

// react & next
import React from "react";
import { useRouter } from "next/router";

// external dependencies
import {
  Box,
  Typography,
  debounce,
  Input,
  InputAdornment,
  IconButton,
} from "@mui/material";
import { observer, Observer } from "mobx-react-lite";
import { makeAutoObservable } from "mobx";
import Fuse from "fuse.js";

// orangery elements & internal dependencies
import {
  OrangeryUserCircle,
  OrangeryTag,
  OrangeryDateTime,
  // OrangeryCircleLoading,
  OrangeryIconTitle2,
} from "../../OrangeryElements";

// queries & backend
import { IIssue } from "../../../queries/issue";

// icons, images & colors
import HelpDeskIcon from "../../../assets/svg/dashboard/helpdesk-icon.svg";
import SearchIconNarrow from "../../../assets/svg/dashboard/searchIconNarrow.svg";
import ArrowRightIcon from "../../../assets/svg/arrow-right.svg";
import MobileChatIcon from "../../../assets/svg/dashboard/mobile-chat.svg";

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
  keys: ["name", "subject", "description", "category"],
};

export class OverviewIssuesListState {
  public search: string = "";

  constructor() {
    makeAutoObservable(this);
  }

  setSearch(value: string) {
    this.search = value;
  }
}

function getSortedSearchedList(issues: IIssue[], search: string) {
  // let issuesList = [...issues];
  let issuesList = JSON.parse(JSON.stringify(issues));

  if (search) {
    const fuse = new Fuse(issuesList, options);
    issuesList = fuse.search(search).map((r) => r.item);
  }

  return issuesList;
}

export default function OverviewIssuesList() {
  const { issues } = useGlobalState();
  const state = React.useMemo(() => new OverviewIssuesListState(), []);

  const router = useRouter();

  return (
    <Box
      sx={{
        backgroundColor: "white",
        borderRadius: 2.5,
        height: "100%",
        display: "flex",
        flexDirection: "column",
        p: 2,
        gap: 2,
        position: "relative",
      }}
    >
      {issues && issues.length > 0 && (
        <IconButton
          onClick={() => {
            router.push("/dashboard/help-desk");
          }}
          sx={{
            position: "absolute",
            top: 12,
            right: 8,
            "& .icon": {
              color: "#074EE8",
              width: 13,
            },
          }}
        >
          <ArrowRightIcon className="icon" />
        </IconButton>
      )}

      <OrangeryIconTitle2
        title={"Help Desk"}
        sx={{
          mb: 4,
        }}
        icon={<HelpDeskIcon />}
      />
      <Header state={state} />

      {issues && issues.length > 0 ? (
        <Box
          sx={{
            width: "100%",
            maxHeight: {
              xs: 550,
              sm: "unset",
            },
            height: "calc(100% - 12px)",
            pr: 3,
            overflowX: "hidden",
            overflowY: "auto",
            "&::-webkit-scrollbar": {
              width: "0.3em",
            },
            "&::-webkit-scrollbar-track": {
              marginLeft: "20px",
            },
            "&::-webkit-scrollbar-thumb": {
              backgroundColor: "rgba(0,0,0,.1)",
              borderRadius: 5,
            },
            "& > * + *": {
              mt: 2,
            },
          }}
        >
          <Observer>
            {() => {
              const sortedSearchedList = getSortedSearchedList(
                issues,
                state.search
              );
              return sortedSearchedList && sortedSearchedList.length > 0 ? (
                <UsersRows issues={sortedSearchedList} state={state} />
              ) : (
                <>No issue is found.</>
              );
            }}
          </Observer>
        </Box>
      ) : (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            mx: "auto",
            alignItems: "center",
            justifyContent: "center",
            mt: "calc(100% - 300px)",
          }}
        >
          <MobileChatIcon style={{ width: 138, height: 123 }} />
          <Typography
            sx={{
              textAlign: "center",
              mt: 4,
              fontSize: "21px",
              fontWeight: 400,
            }}
          >
            No issue is available.
          </Typography>
        </Box>
      )}
    </Box>
  );
}

const UsersRows = ({
  state,
  issues,
}: {
  state: OverviewIssuesListState;
  issues: IIssue[];
}) => {
  return (
    <>
      {issues?.map((issue: IIssue) => (
        <IssueRow key={issue.uuid} issue={issue} />
      ))}
    </>
  );
};

function IssueRow({ issue }: { issue: IIssue }) {
  function handleIssueClick(e: React.FormEvent, selectedIssue: IIssue) {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
  }

  let tagOptions = [
    {
      label: "New comment",
      colors: {
        dark: "#09ACD0",
        light: "#09ACD01A",
      },
    },
    {
      label: "New issue",
      colors: {
        dark: "#FF3D00",
        light: "#FF3D001A",
      },
    },
    {
      label: "Done",
      colors: {
        dark: "#42B863",
        light: "#42B8631A",
      },
    },
    {
      label: "In progress",
      colors: {
        dark: "#FF9900",
        light: "#FF99001A",
      },
    },
  ];

  let status = "";
  if (!issue.active) status = "Done";
  else if (
    !issue.seen
    // || !(issue.comments && issue.comments?.filter((comment) => issue.user?.uuid !== comment.uuid).length)
  )
    status = "New issue";
  else if (issue.new_comments) status = "New comment";
  else status = "In progress";

  return (
    <>
      <Box
        onClick={(e) => handleIssueClick(e, issue)}
        sx={{
          position: "relative",

          display: "flex",
          flexDirection: "column",
          borderBottom: "1px solid #F7F8FA",

          justifyContent: "center",
          // alignItems: "end",
          width: "100%",
          overflowX: "hidden",
          overflowY: "unset",
          ml: 1,
          pt: 0,
          pb: 1,
          transition: "0.2s",
          backgroundColor: "white",
          borderRadius: 1,
          // ...(selected ? { backgroundColor: "#F4F9FF" } : {}),
          // "&:hover": {
          //   transitionTimingFunction: "ease-in-out",
          //   backgroundColor: "#F2F2F2 !important",
          //   transition: "0.2s",
          //   transitionDuration: "0.2s",
          //   cursor: "pointer",
          // }
        }}
      >
        <Box
          sx={{
            // position: "absolute",
            // top: -3,
            // right: 0,
            // overflowY: "show",
            ml: "auto",
          }}
        >
          <OrangeryTag
            options={tagOptions}
            selectedLabel={status}
            height={10}
            minWidth={58}
            small
          />
        </Box>
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            gap: 1.2,
          }}
        >
          <Box
            sx={{
              flex: "none",
            }}
          >
            <OrangeryUserCircle
              name={
                issue.user?.name ??
                issue.user?.first_name + " " + issue.user?.last_name
              }
              fileName={issue.user?.image || ""}
              size={35}
              notHoverable
              noMargin
            />
          </Box>

          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              width: "calc(100% - 42px)",
              gap: 0,
            }}
          >
            <Box
              sx={{
                // display: "flex",
                // flexDirection: "row",
                // gap: .5,
                // alignItems: "baseline"
                lineHeight: 0.25,
              }}
            >
              <Typography
                component="span"
                sx={{
                  fontSize: 13,
                  fontWeight: 400,
                }}
              >
                {issue.subject}
              </Typography>
              {issue.category && (
                <>
                  <Typography
                    component="span"
                    sx={{
                      fontSize: 10,
                      fontWeight: 400,
                      color: "#A5AAB4",
                    }}
                  >
                    {" "}
                    in{" "}
                  </Typography>
                  <Typography
                    component="span"
                    sx={{
                      fontSize: 10,
                      fontWeight: 400,
                      color: "#09ACD0",
                    }}
                  >
                    {issue.category}
                  </Typography>
                </>
              )}
            </Box>

            <Typography
              // variant="CAPTION"
              sx={{
                fontSize: 10,
                fontWeight: 400,
                whiteSpace: {
                  xs: "unset",
                  sm: "nowrap",
                },
                overflow: "hidden",
                textOverflow: "ellipsis",
                mb: 1,
              }}
            >
              {issue.description || "-"}
            </Typography>
          </Box>
        </Box>

        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "baseline",
          }}
        >
          {/* <IssueLocationInfo issue={issue} /> */}

          {issue.created_date && (
            <Typography
              sx={{
                fontSize: 8,
                fontWeight: 700,
                ml: "auto",
              }}
            >
              <OrangeryDateTime dateTime={issue.created_date} />
            </Typography>
          )}
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
    state: OverviewIssuesListState;
  }) => {
    const handleFilter = debounce((value: string) => {
      state.setSearch(value);
    }, 500);
    const { issues } = useGlobalState();
    return (
      <>
        {issues && issues.length > 0 && (
          <Box
            sx={{
              borderRadius: 2,
              height: 42,
              display: "flex",
              alignItems: "center",
              gap: 3,
              px: 2,
              width: "100%",
              border: "1px solid #E8E9ED",
              flexShrink: 0,
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
                  backgroundColor: "white",
                },
                "& .icon": {
                  color: "#A5AAB4",
                  width: "1rem",
                  height: "1rem",
                },
              }}
              placeholder="Search issues"
              startAdornment={
                <InputAdornment position="start">
                  <SearchIconNarrow className="icon" />
                </InputAdornment>
              }
            />
          </Box>
        )}
      </>
    );
  }
);
