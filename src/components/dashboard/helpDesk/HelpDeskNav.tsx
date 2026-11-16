// contexts & globals
import { useGlobalState } from "../../../Contexts & Globals/GlobalContext";

// react & next
import React from "react";

// external dependencies
import { Box } from "@mui/material";

// orangery elements & internal dependencies
import IssuesList from "./issuesList/IssuesList"
import IssuePreview from "./issuePreview/IssuePreview"
import {
  OrangeryNavigationContentLoader,
  OrangeryNavigationPlaceholder
} from "../../OrangeryElements";

// queries & backend
import {
  IIssue, useIssues,
} from "../../../queries/issue";

// icons, images & colors
import PlaceholderSvg from "../../../assets/svg/placeholders/issues.svg";

function HelpDeskNav() {
  const [selectedIssue, setSelectedIssue] = React.useState<IIssue | undefined>(undefined)

  const {
    data: issues,
    isLoading,
    isError,
  } = useIssues();
  // const { issues } = useGlobalState();

  function deepSetSelectedIssue(selectedIssue: IIssue) {
    if (selectedIssue.uuid) {
      setSelectedIssue(selectedIssue)
      localStorage.setItem("current_issue_uuid", selectedIssue.uuid)
    }
  }

  React.useEffect(() => {
    if (issues && issues.length > 0)
      if (localStorage.getItem("current_issue_uuid")) {
        let tempIssues = issues.filter((issue: IIssue) => issue.uuid === localStorage.getItem("current_issue_uuid"))
        if (tempIssues.length > 0)
          setSelectedIssue(tempIssues[0])
      } else
        deepSetSelectedIssue(issues[0])
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [issues])

  return (<>
    {isLoading
      ? <OrangeryNavigationContentLoader />
      : issues && issues.length > 0
        ? <Box
          sx={{
            // zoom: {
            //   xs: 1.25,
            //   // xl: 1.11
            // },
            backgroundColor: "#fff",
            height: {
              xs: "calc(100% - 32px)",
              sm: "100%"
            },
            display: "flex",
            flexDirection: {
              xs: "column",
              md: "row",
            },
            // justifyContent: "start",
            // minHeight: 666,
            borderRadius: 1.5,
            gap: 1,
            // overflowY: "auto",
            // "&::-webkit-scrollbar": {
            //   width: "0.4em",
            // },
            // "&::-webkit-scrollbar-track": {
            //   // boxShadow: "inset 0 0 6px rgba(0,0,0,0.00)",
            //   // webkitBoxShadow: "inset 0 0 6px rgba(0,0,0,0.00)",
            // },
            // "&::-webkit-scrollbar-thumb": {
            //   backgroundColor: "rgba(0,0,0,.1)",
            //   // outline: "1px solid slategrey",
            //   borderRadius: 5,
            // },
          }}
        >
          <Box
            sx={{
              width: {
                xs: "100%",
                md: 480,
              },
              borderBottom: {
                xs: "1px solid #E8E9ED",
                md: "unset"
              },
              height: "100%",
              maxHeight: {
                xs: 550,
                md: "unset",
              },
              mt: {
                xs: 1,
                md: 0
              },
              mb: {
                xs: 0,
                md: 0
              },
              // overflowY: "auto",
              // "&::-webkit-scrollbar": {
              //   width: "0.4em",
              // },
              // "&::-webkit-scrollbar-track": {
              //   // boxShadow: "inset 0 0 6px rgba(0,0,0,0.00)",
              //   // webkitBoxShadow: "inset 0 0 6px rgba(0,0,0,0.00)",
              // },
              // "&::-webkit-scrollbar-thumb": {
              //   backgroundColor: "rgba(0,0,0,.1)",
              //   // outline: "1px solid slategrey",
              //   borderRadius: 5,
              // },
            }}
          >
            <IssuesList
              issues={issues}
              selectedIssue={selectedIssue}
              setSelectedIssue={deepSetSelectedIssue}
            />
          </Box>

          {selectedIssue && selectedIssue.uuid &&
            <Box
              sx={{
                width: {
                  xs: "100%",
                  md: "calc(100% - 480px)",
                },
                borderTopLeftRadius: 8,
                borderTopRightRadius: 8,
                overflowX: "hidden",
                overflowY: "auto",
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
              <IssuePreview selectedIssue={selectedIssue} />
            </Box>
          }
        </Box >
        : <OrangeryNavigationPlaceholder
          vertical
          width={213}
          height={224}
          title={"No Issue!"}
          subtitle={""}
          PlaceholderSvg={PlaceholderSvg}
          AddNewButton={<></>}
          addNewButtonText={""}
        />
    }
  </>
  );
}

export default HelpDeskNav;