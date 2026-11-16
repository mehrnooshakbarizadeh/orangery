// contexts & globals
import { useGlobalState } from "../../../Contexts & Globals/GlobalContext";

// react & next
import React from "react";

// external dependencies
import { Box, Typography } from "@mui/material";

// orangery elements & internal dependencies
import {
  OrangeryUserCircle,
  OrangeryProfilePhotoMenu,
} from "../../OrangeryElements";

export default function ProfileTopRight() {
  const globalState = useGlobalState();

  const user = globalState.currentUser;
  // let dashboard = data;

  function handleLogout() {
    globalState.set_logedIn(false);
    localStorage.clear();
    window.location.href = `${process.env.NEXT_PUBLIC_BASE_PATH}/auth/login`;
  }

  return user ? (
    <OrangeryProfilePhotoMenu
      icon={
        <>
          {/* <Box
            sx={{
              width: "2px",
              position: "absolute",
              ml: "-8px",
              height: "50px",
              backgroundColor: "#f3f3f3",
            }}
          /> */}
          <Box className={"noselect"}>
            <OrangeryUserCircle
              name={user?.first_name + " " + user?.last_name}
              fileName={
                typeof user?.image === "string" ? user?.image : undefined
              }
            />
          </Box>
          {/* <Box>
          <Typography
            className={"noselect"}
            sx={{ fontSize: "22px", ml: "60px", fontWeight: 500, mr: "70px" }}
          >
            {user?.first_name + " " + user?.last_name}
          </Typography>
        </Box> */}
          {/* <Box>
          <Typography
            className={"noselect"}
            sx={{
              color: "#858585",
              fontSize: "19px",
              ml: "60px",
              mr: "70px",
              mt: "-8px",
              fontWeight: 400,
            }}
          >
            {user?.group?.display_name}
          </Typography>
        </Box> */}
        </>
      }
      options={[
        {
          subject: "Profile",
          title: "Profile",
          onClick: () => {
            window.location.href = `${process.env.NEXT_PUBLIC_BASE_PATH}/dashboard/profile`;
          },
        },
        {
          subject: "Logout",
          title: "Logout",
          onClick: () => handleLogout(),
        },
      ]}
    />
  ) : (
    <></>
  );
}
