// contexts & globals
import { useGlobalState } from "../../../Contexts & Globals/GlobalContext";

// react & next
import React from "react";
import { useRouter } from "next/router";

// external dependencies
import { Box, IconButton } from "@mui/material";

// queries & backend
import { IIssue } from "../../../queries/issue";

//
import NotificationsIcon from "../../../assets/svg/notifications/helpdesk-icon.svg";

export default function NotificationBadge() {
  const { issues } = useGlobalState();
  const router = useRouter();

  function checkHasNotification(issues?: IIssue[] | []) {
    // if (issues && issues.length > 0)
    //   for (var i = 0; i < issues.length; i++)
    //     if (!issues[i].seen || issues[i].new_comments) {
    //       return true;
    //     }

    return false;
  }

  const [hasNotification, setHasNotification] = React.useState(
    checkHasNotification(issues)
  );

  React.useEffect(() => {
    setHasNotification(checkHasNotification(issues));
  }, [issues]);

  function handleClick() {
    router.push("/dashboard/help-desk");
  }

  return (
    <Box
      sx={{
        mr: 3,
        height: "68px",
        width: "68px",
        float: "right",
        display: "flex",
        alignItems: "center",
        flex: "none",
      }}
    >
      <IconButton
        onClick={handleClick}
        sx={{
          height: 56,
          width: 56,
          pr: 1.5,
          display: "flex",
          alignItems: "center",
          flex: "none",
        }}
      >
        <Box
          sx={{
            position: "relative",
          }}
        >
          <Box
            sx={{
              width: "34px",
              height: "27px",
              color: "black",
            }}
          >
            <NotificationsIcon />
          </Box>
          {hasNotification && (
            <Box
              sx={{
                width: 14,
                height: 14,
                borderRadius: "100%",
                backgroundColor: "red",
                position: "absolute",
                top: -4,
                right: -3,
                flex: "none",
              }}
            />
          )}
        </Box>
      </IconButton>
    </Box>
  );
}
