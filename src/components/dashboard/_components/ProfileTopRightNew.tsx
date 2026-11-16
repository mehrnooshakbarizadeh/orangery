// contexts & globals
import { useGlobalState } from "../../../Contexts & Globals/GlobalContext";

// react & next
import React from "react";

// external dependencies
import { Box, Typography } from "@mui/material";
import Avatar from "@mui/material/Avatar";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";

// orangery elements & internal dependencies
import {
  OrangeryUserCircle,
  OrangeryProfilePhotoMenu,
} from "../../OrangeryElements";
//Svg
import UserIcon from "../../../assets/svg/user-profile-menu.svg";
import ArrowIcon from "../../../assets/svg/arrow-right-from-bracket.svg";
import AngleDownIcon from "../../../assets/svg/angle-down-narrow.svg";
import AngleUpIcon from "../../../assets/svg/angle-up-narrow.svg";

export default function ProfileTopRightNew() {
  const { currentUser: user, set_logedIn } = useGlobalState();
  // let dashboard = data;

  function handleLogout() {
    set_logedIn(false);
    localStorage.clear();
    window.location.href = `${process.env.NEXT_PUBLIC_BASE_PATH}/auth/login`;
  }

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return user
    ? <>
      <Box
        aria-haspopup="true"
        sx={{
          float: "right",
          mr: "10px",
          mt: "8px",
          ml: 3.5,
          cursor: "pointer",
          ":hover": {
            cursor: "pointer",
          },
        }}
        onClick={handleClick}
      >
        <Box sx={{ display: "flex", alignItems: "center", pr: 2 }}>
          <Divider
            orientation="vertical"
            flexItem
            sx={{ height: 38, mr: 3, mt: 1 }}
          />
          <OrangeryUserCircle
            noMargin={true}
            name={user?.first_name + " " + user?.last_name}
            fileName={typeof user?.image === "string" ? user?.image : undefined}
          />
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",

              mr: 2,
              ml: 3,
            }}
          >
            <Typography variant="officeSelect">
              {user?.first_name + " " + user?.last_name}
            </Typography>
            <Typography variant="profileSubtext" sx={{ color: "#A5AAB4" }}>
              {user?.group?.display_name}
            </Typography>
          </Box>
          {open ? (
            <AngleUpIcon style={{ width: 20 }} />
          ) : (
            <AngleDownIcon style={{ width: 20 }} />
          )}
        </Box>
      </Box>
      <Menu
        sx={{
          zoom: { sm: "127%", md: "126%", lg: "126%", xl: "112%" },
          // "& .MuiMenu-root": { left: "50" },
          // "& .MuiPaper-root": {
          //   width: "200px",
          //   backgroundColor: "red",
          //   right: 0,
          // },
        }}
        anchorEl={anchorEl}
        id="profile-menu"
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        MenuListProps={{ onMouseLeave: handleClose }}
        PaperProps={{
          elevation: 0,
          sx: {
            width: "200px",
            overflow: "visible",
            filter: "drop-shadow(0px 2px 6px rgba(0,0,0,0.32))",
            borderRadius: "0px 0px 15px 15px",
            "& .MuiAvatar-root": {
              width: 32,
              height: 32,
              ml: -0.5,
              mr: 1,
            },
            right: 5,
          },
        }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        <MenuItem
          onClick={() => {
            window.location.href = `${process.env.NEXT_PUBLIC_BASE_PATH}/dashboard/profile`;
          }}
        >
          <UserIcon style={{ marginRight: "10px" }} />{" "}
          <Typography variant="officeSelect">Profile</Typography>
        </MenuItem>
        <MenuItem onClick={() => handleLogout()}>
          <ArrowIcon style={{ marginRight: "10px" }} />
          <Typography variant="officeSelect">Logout</Typography>
        </MenuItem>
        <MenuItem
          selected={true}
          sx={{ display: "none" }}
          onClick={() => handleLogout()}
        >
          <ArrowIcon style={{ marginRight: "10px" }} />
          <Typography variant="officeSelect">Logout</Typography>
        </MenuItem>
      </Menu>
    </>
    : <></>;
}
