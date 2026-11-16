// react & next
import React from "react";

// external dependencies
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import Drawer from "@mui/material/Drawer";
import Typography from "@mui/material/Typography";
import { Button, IconButton } from "@mui/material";

// icons, images & colors
import FilterIcon from "../../../assets/svg/filter.svg";
import CrossIcon from "../../../assets/svg/cross.svg";

// others
const drawerWidth = 240;

export default function FilterDrawer() {
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const drawer = (
    <div>
      <DrawerHeader onDrawerToggle={handleDrawerToggle} />
      <DrawerBody />
    </div>
  );

  return (
    <>
      <CssBaseline />
      <Button
        onClick={handleDrawerToggle}
        sx={{
          backgroundColor: (theme) => theme.palette.grey[200],
          py: 2,
          px: 3,
          gap: 2.5,
          "& .filter-icon": { width: "1.3rem", height: "1.3rem" },
          "& .filter-typo": {
            fonSize: 17,
            fontWeight: 700,
            color: "primary.main",
          },
        }}
      >
        <FilterIcon className="filter-icon" />
        <Typography className="filter-typo">Filters</Typography>
      </Button>
      <Box>
        <Box
          component="nav"
          sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
          aria-label="mailbox folders"
        >
          <Drawer
            anchor="right"
            variant="temporary"
            open={mobileOpen}
            onClose={handleDrawerToggle}
            ModalProps={{
              keepMounted: true, // Better open performance on mobile.
            }}
            sx={{
              // display: { xs: "block", sm: "none" },
              "& .MuiDrawer-paper": {
                boxSizing: "border-box",
                width: drawerWidth,
              },
            }}
          >
            {drawer}
          </Drawer>
          {/* <Drawer
          anchor="right"
          variant="permanent"
          sx={{
            display: { xs: "none", sm: "block" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
            },
          }}
          open
        >
          {drawer}
        </Drawer> */}
        </Box>
      </Box>
    </>
  );
}

function DrawerHeader({ onDrawerToggle }: { onDrawerToggle: () => void }) {
  return (
    <>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "end",
          p: 3,
          "& .cross-icon": {
            width: "1.3rem",
            height: "1.3rem",
            color: "grey.A400",
          },
          "& .flter-typo": {
            flexGrow: 1,
            fontSize: 30,
            fontWeight: 700,
            color: "grey.A400",
          },
        }}
      >
        <Typography className="flter-typo">Filters</Typography>
        <IconButton onClick={onDrawerToggle}>
          <CrossIcon className="cross-icon" />
        </IconButton>
      </Box>
    </>
  );
}

function DrawerBody() {
  return <>{/* <Box>{column.render()}</Box> */}</>;
}
