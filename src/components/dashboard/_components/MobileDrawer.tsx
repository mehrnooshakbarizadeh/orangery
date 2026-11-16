// contexts & globals
import { useGlobalState } from "../../../Contexts & Globals/GlobalContext";

// react & next
import React from "react";

// external dependencies
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
// import Divider from "@mui/material/Divider";
import Drawer from "@mui/material/Drawer";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import { IconButton, MenuList, useMediaQuery } from "@mui/material";
import { styled, useTheme } from "@mui/material/styles";

// orangery elements & internal dependencies
import Menus from "./Menus";
import Footers from "./Footers";
import SetupGuideButton from "../overview/setupGuide/SetupGuideButton";

// icons, images & colors
import MenuIcon from "../../../assets/svg/menu.svg";

// others
const drawerWidth = 230;

export default function MobileDrawer({
  children,
}: {
  children: React.ReactNode;
}) {
  const globalState = useGlobalState();
  const { showSetupGuide } = globalState;
  const theme = useTheme();
  const small = useMediaQuery(theme.breakpoints.down("xs"));

  const [drawerOpen, setDrawerOpen] = React.useState(globalState.menu_toggle);

  React.useEffect(() => {
    setDrawerOpen(globalState.menu_toggle);
  }, [globalState.menu_toggle]);

  const DrawerHeader = styled("div")(({ theme }) => ({
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    // padding: theme.spacing(0, 1),
    padding: 0,
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
  }));

  const isDashboard = globalState.current_page_header == "Dashboard";

  return (
    <Box sx={{ display: "flex", width: "100%" }}>
      <AppBar
        position="fixed"
        sx={{
          backgroundColor: "white",
          color: "black",
          boxShadow: "0px 1px #dedcdc",
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
        }}
      >
        <Toolbar>
          <IconButton
            aria-label="open drawer"
            edge="start"
            onClick={() => {
              let opened = drawerOpen;
              globalState.set_menu_toggle(!opened);
              setDrawerOpen(!opened);
            }}
            sx={{
              display: { sm: "none" },
              "& .header-menu-icon": {
                width: "1.5rem",
                color: "grey.A200",
                flexShrink: 0,
              },
              "& .header-title": { color: "grey.200", flexGrow: 1 },
            }}
          >
            <MenuIcon className="header-menu-icon" />
          </IconButton>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Typography sx={{ fontWeight: 800 }} className="header-title">
              {globalState.current_page_header}
            </Typography>
            {isDashboard && showSetupGuide && <SetupGuideButton />}
          </Box>
        </Toolbar>
      </AppBar>
      <Box
        component="nav"
        sx={{
          width: { sm: drawerWidth },
          flexShrink: { sm: 0 },
        }}
        aria-label="mailbox folders"
      >
        <Drawer
          variant="temporary"
          open={drawerOpen}
          onClose={() => {
            let opened = drawerOpen;
            globalState.set_menu_toggle(!opened);
            setDrawerOpen(!opened);
          }}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            display: { xs: "block", sm: "none" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
              display: "flex",
              justifyContent: "flex-end",
              boxShadow: "1px 1px 5px 0px #0000001f",
              // backgroundImage: "linear-gradient(45deg, #121212, #282828)",
              backgroundColor: "#2B2E33",
            },
          }}
        >
          <DrawerHeader>
            <Box
              sx={{
                width: "179px",
                height: "32px",
              }}
              component={"img"}
              src={`${process.env.NEXT_PUBLIC_BASE_PATH}/assets/Orangery-OS-white.png`}
              loading={"lazy"}
            />
            <IconButton
              onClick={() => {
                let opened = drawerOpen;
                globalState.set_menu_toggle(!opened);
                setDrawerOpen(!opened);
              }}
              sx={{
                m: "0px auto",
                // "&:hover": { backgroundColor: "unset" },
                "& .menu-icon": {
                  color: "grey.A100",
                  width: "1.3rem",
                  height: "1.3rem",
                  justifyContent: "center",
                },
              }}
            >
              {drawerOpen ? (
                <Box className="menu-icon">
                  <MenuIcon />
                </Box>
              ) : (
                <Box className="menu-icon">
                  <MenuIcon />
                </Box>
              )}
            </IconButton>
            {/* <Typography
              className={"dashboard_top_left_logo"}
              sx={{ flexGrow: 1 }}
            ></Typography>
            <IconButton onClick={handleDrawerToggle}>
              {theme.direction === "rtl" ? <MenuIcon /> : <MenuIcon />}
            </IconButton> */}
          </DrawerHeader>

          {/* <Divider /> */}

          <MenuList
            sx={{
              display: "flex",
              flexDirection: "column",
              flexGrow: 1,
              overflowY: "auto",
              "&::-webkit-scrollbar": {
                width: "0.4em",
              },
              "&::-webkit-scrollbar-track": {
                marginLeft: "20px",
              },
              "&::-webkit-scrollbar-thumb": {
                backgroundColor: "rgba(255,255,255,.3)",
                borderRadius: 5,
              },
            }}
          >
            <Menus open={drawerOpen} />
          </MenuList>

          <Footers open={drawerOpen} />
        </Drawer>
      </Box>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
        }}
      >
        <Toolbar />
        {children}
      </Box>
    </Box>
  );
}
