// contexts & globals
import { useGlobalState } from "../../../../Contexts & Globals/GlobalContext";

// react & next
import React from "react";

// external dependencies
import { Box, Typography, Button } from "@mui/material";

// orangery elements & internal dependencies
import {
  OrangeryUserCircle,
  // OrangeryNavigationContentLoader,
  OrangeryCircleLoading,
  OrangeryAttachmentsButton,
  OrangeryToast,
  OrangeryTag,
  OrangeryDateTime,
} from "../../../OrangeryElements";
import { IssueLocationInfo } from "../issuesList/IssuesList";
import CommentForm from "./CommentForm";

// queries & backend
import {
  IIssue,
  IComment,
  useComments,
  useUpdateIssue,
  useSeenIssue,
  useSeenIssueComment,
} from "../../../../queries/issue";
import { processError } from "../../../../queries/commons";

// icons, images & colors
import EmailIcon from "../../../../assets/svg/email.svg";
import PhoneIcon from "../../../../assets/svg/phone.svg";
import IssueReopenButton from "./IssueReopenButton";

export default function IssuePreview({
  selectedIssue,
}: {
  selectedIssue: IIssue;
}) {
  const { currentUser } = useGlobalState();

  const {
    data: comments,
    isLoading,
    isError,
  } = useComments(selectedIssue.uuid);

  const updateIssueMutation = useUpdateIssue();
  const seenIssueMutation = useSeenIssue();
  const seenIssueCommentMutation = useSeenIssueComment();

  async function seen() {
    if (selectedIssue && !selectedIssue.seen)
      await seenIssueMutation.mutateAsync({
        issue_uuid: selectedIssue.uuid ?? "",
      });

    if (comments)
      for (var i = 0; i < comments.length; i++)
        if (!comments[i].seen)
          await seenIssueCommentMutation.mutateAsync({
            issue_uuid: selectedIssue.uuid ?? "",
            comment_uuid: comments[i].uuid ?? "",
          });
  }

  React.useEffect(() => {
    seen();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedIssue, comments]);

  async function handleCloseIssue(e: React.FormEvent) {
    e.preventDefault();
    try {
      await updateIssueMutation.mutateAsync({
        issue_uuid: selectedIssue.uuid,
        active: false,
      });
      OrangeryToast("Successfully closed.", "success");
    } catch (err: any) {
      const processedError = processError(err);
      throw processedError;
    }
  }

  const [lastCommentUuid, setLastCommentUuid] = React.useState("");

  React.useEffect(() => {
    let element = undefined;
    if (comments && comments.length > 0)
      element = document.getElementById(
        comments[comments.length - 1].uuid ?? ""
      );
    if (element) {
      element.scrollIntoView();
    }
  }, [comments]);

  return (
    <Box
      sx={{
        backgroundColor: "#fff",
        display: "flex",
        flexDirection: "column",
        // justifyContent: "start",
        height: "100%",
        // minHeight: 666,
        // borderRadius: 1.5,
        pb: 3,
      }}
    >
      <Box
        sx={{
          backgroundColor: "#F9D507",
          width: "100%",
          height: 70,
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          flex: "none",
          pl: 2,
          pr: 3,
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            gap: 1,
          }}
        >
          <OrangeryUserCircle
            name={
              selectedIssue.user?.name ??
              selectedIssue.user?.first_name +
              " " +
              selectedIssue.user?.last_name
            }
            fileName={selectedIssue.user?.image || ""}
            size={35}
            notHoverable
            noMargin
          />
          <Typography variant="subtitle2" sx={{}}>
            {selectedIssue.user?.name ??
              selectedIssue.user?.first_name +
              " " +
              selectedIssue.user?.last_name}
          </Typography>
        </Box>

        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            gap: 3,
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              gap: 1,
              "& .icon": {
                height: "12px",
              },
            }}
          >
            <EmailIcon className="icon" />
            <Typography
              variant="subtitle2"
              sx={{
                mb: 0.5,
                // mb: 1
              }}
            >
              {selectedIssue.user?.email || "-"}
            </Typography>
          </Box>

          {selectedIssue.user?.phone && (
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                gap: 1,
                "& .icon": {
                  height: "12px",
                },
              }}
            >
              <PhoneIcon className="icon" />
              <Typography
                variant="subtitle2"
                sx={{
                  mb: 0.5,
                  // mb: 1
                }}
              >
                {selectedIssue.user?.phone}
              </Typography>
            </Box>
          )}
        </Box>
      </Box>

      <Box
        sx={{
          height: {
            xs: "unset",
            md: "calc(100% - 113px)",
          },
          pt: 2,
          pl: 2,
          pr: 3,
          borderLeft: {
            xs: "unset",
            md: "1px solid #E8E9ED",
          },
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: {
              xs: "column",
              sm: "row",
            },
            justifyContent: {
              xs: "start",
              sm: "space-between",
            },
            gap: {
              xs: 2,
              sm: 4,
            },
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 0,
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                gap: 0.5,
                alignItems: "baseline",
              }}
            >
              <Typography component="h4" variant="H4">
                {selectedIssue.subject}
              </Typography>
              {selectedIssue.category && (
                <>
                  <Typography
                    sx={{
                      fontSize: 20,
                      fontWeight: 600,
                      color: "#A5AAB4",
                    }}
                  >
                    in
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: 20,
                      fontWeight: 600,
                      color: "#09ACD0",
                    }}
                  >
                    {selectedIssue.category}
                  </Typography>
                </>
              )}
            </Box>
            <Box
              sx={{
                mt: 1,
              }}
            >
              <IssueLocationInfo
                issue={selectedIssue}
                color={"#2B2E33"}
                wide={true}
              />
            </Box>
          </Box>

          {selectedIssue.active ? (
            <Button
              onClick={handleCloseIssue}
              sx={{
                backgroundColor: "#fff",
                border: "1px solid black",
                borderRadius: 1,
                py: 0,
                px: 2,
                height: 40,
                width: 130,
              }}
            >
              <Typography
                sx={{
                  fontSize: 15,
                  fontWeight: 600,
                  color: "#000",
                }}
              >
                Close Issue
              </Typography>
            </Button>
          ) : (
            <OrangeryTag
              options={[
                {
                  label: "Done",
                  colors: {
                    dark: "#42B863",
                    light: "#42B8631A",
                  },
                },
              ]}
              selectedLabel={"Done"}
              height={22}
              minWidth={76}
            />
          )}
        </Box>

        <Box
          sx={{
            mt: 3,
            pl: 1,
            mr: -1,
            pr: 1,
            display: "flex",
            flexDirection: "column",
            scrollBehavior: "smooth",
            height: {
              xs: "unset",
              sm: `calc(100% - ${selectedIssue.active ? 301 : 100}px)`, ///////!!!!!!! 357px?
            },
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
          <Comment
            comment={{
              description: selectedIssue.description,
              user: selectedIssue.user,
              created_date: selectedIssue.created_date,
              images: selectedIssue.images,
              documents: selectedIssue.documents,
            }}
            isMe={selectedIssue.user?.uuid === currentUser?.uuid}
          />
          {isLoading ? (
            // ? <OrangeryNavigationContentLoader />
            <OrangeryCircleLoading />
          ) : (
            comments?.map((comment) => (
              <Comment
                key={comment.uuid}
                comment={comment}
                isMe={comment.user?.uuid === currentUser.uuid}
              />
            ))
          )}
        </Box>

        {selectedIssue.uuid && (
          <Box
            sx={{
              mt: 0,
              pr: 1,
              pt: 2,
              pb: 1,
              borderTop: "1px solid #E8E9ED",
              height: {
                xs: "unset",
                sm: selectedIssue.active ? "235px" : "unset",
              },
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
            {selectedIssue.active
              ? <CommentForm selectedIssue={selectedIssue} showUser={false} />
              : <Box
                sx={{
                  mx: "auto",
                  width: "fit-content",
                }}
              >
                <IssueReopenButton selectedIssue={selectedIssue} />
              </Box>
            }
          </Box>
        )}
      </Box>
    </Box>
  );
}

function Comment({ comment, isMe }: { comment: IComment; isMe?: boolean }) {
  return (
    <Box
      id={comment.uuid}
      sx={{
        display: "flex",
        flexDirection: "row" + (isMe ? "" : "-reverse"),
        gap: 1,
        mb: 4,
        // maxWidth: 500,
        alignSelf: isMe ? "end" : "start",
      }}
    >
      <Box
        sx={{
          backgroundColor: isMe ? "#FAFAFA" : "#F4F9FF",
          borderTopRightRadius: 12,
          borderTopLeftRadius: 12,
          borderBottomRightRadius: isMe ? 0 : 12,
          borderBottomLeftRadius: isMe ? 12 : 0,
          flexGrow: 1,
        }}
      >
        <Box
          sx={{
            px: 3,
            pt: 3,
            pb: 1,
          }}
        >
          <Typography
            sx={{
              wordWrap: "break-word",
              overflowWrap: "break-word",
              maxWidth: {
                xs: "84vw",
                sm: "70vw",
                md: 500,
              },
            }}
          >
            {comment.name}
            {comment.description}
          </Typography>
        </Box>

        <Box
          sx={{
            px: 3,
            textAlign: isMe ? "right" : "left",
          }}
        >
          {comment.created_date && (
            <Typography
              sx={{
                fontSize: 14,
                fontWeight: 600,
              }}
            >
              <OrangeryDateTime dateTime={comment.created_date} />
            </Typography>
          )}
        </Box>

        <Box
          sx={{
            backgroundColor: isMe ? "#F2F2F2" : "#E8F2FF",
            px: 3,
            py: 0.5,
            borderBottomRightRadius: isMe ? 0 : 12,
            borderBottomLeftRadius: isMe ? 12 : 0,
            display: "flex",
            flexDirection: "row" + (isMe ? "-reverse" : ""),
            justifyContent: "space-between",
            alignItems: "center",
            gap: 8,
          }}
        >
          <Typography
            variant="subtitle2"
            sx={{
              wordWrap: "break-word",
              overflowWrap: "break-word",
              ...(isMe ? { ml: "auto" } : {}),
            }}
          >
            {comment.user?.name ??
              comment.user?.first_name + " " + comment.user?.last_name}
          </Typography>
          {((comment.images && comment.images.length > 0) ||
            (comment.documents && comment.documents.length > 0)) && (
              <OrangeryAttachmentsButton
                bigSize={true}
                media={[...(comment.images ?? []), ...(comment.documents ?? [])]}
              />
            )}
        </Box>
      </Box>

      <Box
        sx={{
          alignSelf: "end",
          mb: -0.25,
        }}
      >
        <OrangeryUserCircle
          name={
            comment.user?.name ??
            comment.user?.first_name + " " + comment.user?.last_name
          }
          fileName={comment.user?.image || ""}
          size={35}
          notHoverable
          noMargin
        />
      </Box>
    </Box>
  );
}
