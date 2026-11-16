// contexts & globals
import { useGlobalState } from "../../../Contexts & Globals/GlobalContext";
import Can from "../../../services/can";

// react & next
import React from "react";
import { useRouter } from "next/router";

// external dependencies
import { styled, useTheme, Theme, CSSObject } from "@mui/material/styles";
import Box from "@mui/material/Box";
import MuiAppBar, { AppBarProps as MuiAppBarProps } from "@mui/material/AppBar";
import MuiDrawer from "@mui/material/Drawer";
import MenuList from "@mui/material/MenuList";
// import Toolbar from "@mui/material/Toolbar";
// import CssBaseline from "@mui/material/CssBaseline";
import Typography from "@mui/material/Typography";
// import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";

// orangery elements & internal dependencies
import Menus from "./Menus";
import Footers from "./Footers";
import ProfileTopRight from "./ProfileTopRight";
import ProfileTopRightNew from "./ProfileTopRightNew";
import OfficeSelect from "./officeSelect/OfficeSelect";
import NotificationBadge from "./NotificationBadge";
import SetupGuideButton from "../overview/setupGuide/SetupGuideButton";
// icons, images & colors
import MenuIcon from "../../../assets/svg/menu.svg";

// others
/** detect my office for correct padding */
const drawerWidth = 230; // px
const drawerClosedWidth = 57; // px

const openedMixin = (theme: Theme): CSSObject => ({
  width: drawerWidth,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: "hidden",
});

const closedMixin = (theme: Theme): CSSObject => ({
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: "hidden",
  width: `calc(${theme.spacing(7)} + 1px)`,
});

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  // padding: theme.spacing(0, 1),
  padding: 0,
  ...theme.mixins.toolbar,
}));

interface AppBarProps extends MuiAppBarProps {
  open?: boolean;
}

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})<AppBarProps>(({ theme, open }) => ({
  backgroundColor: "white",
  color: "black",
  width: open
    ? `calc(100% - ${drawerWidth}px)`
    : `calc(100% - ${drawerClosedWidth}px)`,
  boxShadow: "2px 1px 3px #d7dbe1",
  zIndex: theme.zIndex.drawer - 1,
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
}));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  borderRight: "0px solid",
  ...(open && {
    ...openedMixin(theme),
    "& .MuiDrawer-paper": openedMixin(theme),
  }),
  ...(!open && {
    ...closedMixin(theme),
    "& .MuiDrawer-paper": closedMixin(theme),
  }),
}));

export default function DesktopDrawer({
  children,
  onPageChange,
  withoutHeader = false,
}: {
  children: React.ReactNode;
  onPageChange?: () => void;
  withoutHeader?: boolean;
}) {
  const theme = useTheme();
  const globalState = useGlobalState();
  const { showSetupGuide } = useGlobalState();
  const isOsMap = useRouter().pathname == "/dashboard/os-map";
  const isTenant = useRouter().pathname == "/dashboard/tenants";

  const [drawerOpen, setDrawerOpen] = React.useState(globalState.menu_toggle);
  const isDashboard = globalState.current_page_header == "Dashboard";

  React.useEffect(() => {
    setDrawerOpen(globalState.menu_toggle);
  }, [globalState.menu_toggle]);

  return (
    <Box sx={{ display: "flex", width: "100%", minHeight: "100%" }}>
      {!withoutHeader && (
        <AppBar id={"dashboard_top_header"} position="fixed" open={drawerOpen}>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Typography
              id={"page_header"}
              sx={{
                fontSize: 24,
                fontWeight: "700",
                fontColor: "#3d3d3d",
                m: 2,
                float: "left",
                marginLeft: "26px",
              }}
            >
              {globalState.current_page_header}
            </Typography>

            {isDashboard && showSetupGuide && (
              <Can I="view" a="SetupGuide">
                <SetupGuideButton />
              </Can>
            )}
          </Box>
          <Box sx={{ position: "fixed", right: 0 }}>
            <ProfileTopRightNew />
            <Can I="view" a="LocationMenu">
              <OfficeSelect />
            </Can>
            <Can I="view" a="HelpDesk">
              <NotificationBadge />
            </Can>
          </Box>
        </AppBar>
      )}
      <Box component="nav">
        <Drawer
          variant="permanent"
          open={drawerOpen}
          sx={{
            "& .MuiDrawer-paper": {
              display: "flex",
              justifyContent: "flex-end",
              borderRight: "none",
              boxShadow: "1px 1px 5px 0px #0000001f",
              // backgroundImage: "linear-gradient(45deg, #121212, #282828)",
              backgroundColor: "#121212", // "#2B2E33"
            },
          }}
        >
          <DrawerHeader sx={{ height: "78px", flexShrink: 0 }}>
            <Box
              sx={{
                ml: 1,
                width: "179px",
                height: "32px",
                ...(!drawerOpen && { display: "none" }),
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
                "&:hover": { backgroundColor: "unset" },
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
          </DrawerHeader>

          {/* <Divider /> */}

          <MenuList
            sx={{
              overflowY: "auto",
              overflowX: "hidden",
              display: "flex",
              flexDirection: "column",
              flexGrow: 1,
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
          <MenuList sx={{ display: "flex", flexDirection: "column" }}>
            <Footers open={drawerOpen} />
          </MenuList>
        </Drawer>
      </Box>

      <Box
        component="main"
        sx={{
          display: "flex",
          flexDirection: "column",
          flexGrow: 1,
          width: drawerOpen
            ? `calc(100% - ${drawerWidth}px)`
            : `calc(100% - ${drawerClosedWidth}px)`,
          padding: isOsMap ? 0 : theme.spacing(2),
          mt: withoutHeader ? 0 : 8,
          backgroundColor: isTenant ? "#fff" : "#F4F6F9",
          overflowY: "hidden",
        }}
      >
        {children}
      </Box>
    </Box>
  );
}
