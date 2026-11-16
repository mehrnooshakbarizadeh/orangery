// contexts & globals
import { useGlobalState } from "../../../Contexts & Globals/GlobalContext";
import Can from "../../../services/can";
import { ISubject } from "../../../services/ability";

// react & next
import NextLink from "next/link";
import { useRouter } from "next/router";
import React from "react";

// external dependencies
import {
  Box,
  Collapse,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListSubheader,
} from "@mui/material";
import { Link as MUILink } from "@mui/material";
import AssessmentIcon from "@mui/icons-material/Assessment";

// icons, images & colors
import DashboardIcon from "../../../assets/svg/dashboard/newMenuSVGs/dashboard.svg";
import FilmIcon from "../../../assets/svg/film.svg";
import CubeIcon from "../../../assets/svg/cube.svg";
import BuildingsIcon from "../../../assets/svg/buildings.svg";
import DeskIcon from "../../../assets/svg/dashboard/newMenuSVGs/desk.svg";
import EmployeeIcon from "../../../assets/svg/dashboard/newMenuSVGs/employee.svg";
import VisitorIcon from "../../../assets/svg/dashboard/newMenuSVGs/visitor.svg";
import MeetingRoomIcon from "../../../assets/svg/dashboard/newMenuSVGs/meetingRoom.svg";
import RoomIcon from "../../../assets/svg/dashboard/newMenuSVGs/room.svg";
import LayerIcon from "../../../assets/svg/layer.svg";
import DatabaseIcon from "../../../assets/svg/database.svg";
import FolderUserIcon from "../../../assets/svg/folderUser.svg";
import UserTieIcon from "../../../assets/svg/user-tie.svg";
import UserClockIcon from "../../../assets/svg/user-clock.svg";
import PersonCarryBoxIcon from "../../../assets/svg/person-carry-box-regular.svg";
import AppsIcon from "../../../assets/svg/apps/apps-icon.svg";
import AngleDownIcon from "../../../assets/svg/angleDown.svg";
import AngleUpIcon from "../../../assets/svg/angleUp.svg";
import ContractIcon from "../../../assets/svg/dashboard/newMenuSVGs/contract.svg";
import SaltoKsIcon from "../../../assets/svg/apps/saltoKs/saltoKsIcon.svg";
import OsAnalyticsIcon from "../../../assets/svg/apps/osAnalytics/osAnalyticsIcon.svg";
import ScheduleIcon from "../../../assets/svg/schedule/ScheduleIcon.svg";
import ParkingIcon from "../../../assets/svg/dashboard/newMenuSVGs/parkingSpot.svg";
import EventMenuIcon from "../../../assets/svg/event-menu-icon.svg";
// import ParkingIcon from "../../../assets/svg/car.svg";
import ReportsIcon from "../../../assets/svg/reports.svg";
import ContentManagementMenuIcon from "../../../assets/svg/contentManagement.svg";
import AutomationIcon from "../../../assets/svg/dashboard/automations.svg";

export default function Menus({ open }: { open?: boolean }) {
  return (
    <Box>
      <List
        component="nav"
        sx={{ width: "100%" }}
        subheader={<ListSubheader component="div" id="nested-list-subheader" />}
      >
        {items.map((item) => (
          <Can key={item.name} I="view" a={item.subject ?? "null"}>
            <MenuItem item={item} />
          </Can>
        ))}
      </List>
    </Box>
  );
}

export function MenuItem({ item }: { item: IItem }) {
  const router = useRouter();
  const [open, setOpen] = React.useState(
    item.subItems &&
      item.subItems.filter((subItem) => subItem.path === router.pathname)
        .length > 0
  );

  return (
    <>
      {item.subItems && item.subItems.length > 0 ? (
        <>
          <Item
            item={item}
            open={open}
            setOpen={setOpen}
            animateOnHover
            showSelectedBar
          />
          {item.subItems && item.subItems.length > 0 && (
            <Collapse
              in={open}
              sx={{
                backgroundColor: "#0c0c0c", ////////!!!!!!!! #1D2228
              }}
            >
              {item.subItems?.map((subItem) => (
                <Can key={subItem.name} I="view" a={subItem.subject ?? "null"}>
                  <SubItem item={subItem} />
                </Can>
              ))}
            </Collapse>
          )}
        </>
      ) : (
        <SubItem item={item} />
      )}
    </>
  );
}

function SubItem({ item }: { item: IItem }) {
  const router = useRouter();
  const globalState = useGlobalState();

  const selected = router.pathname === item.path;
  React.useEffect(() => {
    if (router.pathname === item.path) {
      globalState.set_current_page_header(item.header ?? item.name);
      globalState.setCurrentSubject(item.subject ?? "null");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <NextLink href={item.path} passHref>
      <MUILink
        sx={{
          textDecoration: "none",
          color: "#e3e3e3",
          "&:hover": {
            color: (theme) => theme.palette.secondary.main,
          },
        }}
      >
        <Item item={item} selected={selected} animateOnHover showSelectedBar />
      </MUILink>
    </NextLink>
  );
}

function Item({
  item,
  open,
  setOpen,
  selected,
  showSelectedBar,
  animateOnHover,
}: {
  item: IItem;
  open?: boolean;
  setOpen?: (open: boolean) => void;
  selected?: boolean;
  showSelectedBar?: boolean;
  animateOnHover?: boolean;
}) {
  const handleToggle = () => {
    if (setOpen) setOpen(!open);
  };

  return (
    <ListItem
      // onClick={() => {
      //   // globalState.set_current_page_header(subItem.name);
      //   // globalState.setCurrentSubject(subItem.subject ?? "null");
      // }}
      onClick={handleToggle}
      selected={selected}
      sx={{
        pl: 0,
        flex: "none",
        "&.Mui-selected": {
          ...(showSelectedBar
            ? {
                "& ::before": {
                  content: '""',
                  position: "absolute",
                  height: "60%",
                  width: "4px",
                  left: 0,
                  top: "20%",
                  backgroundColor: (theme) => theme.palette.secondary.main,
                  borderTopRightRadius: "4px",
                  borderBottomRightRadius: "4px",
                },
              }
            : {}),
          color: (theme) => theme.palette.secondary.main,
          "& .list-icon": {
            color: (theme) => theme.palette.secondary.main,
          },
          position: "relative",
        },
        transition: "0.2s",
        // color: hover ? (theme) => theme.palette.secondary.main : "#e3e3e3",
        color: "#e3e3e3",
        "&:hover": {
          ...(animateOnHover ? { pl: "5%" } : {}),
          color: (theme) => theme.palette.secondary.main,
        },
        display: "flex",
        cursor: "pointer",
        "& .icon": {
          color: "inherit",
          width: "1.2rem",
          height: "1.2rem",
          display: "flex",
          justifyContent: "center",
        },
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          flexGrow: 1,
          gap: 1,
        }}
      >
        <ListItemIcon className="icon">{item.icon}</ListItemIcon>
        <ListItemText>{item.name}</ListItemText>
      </Box>
      {item.subItems && item.subItems.length > 0 && (
        <IconButton
          onClick={handleToggle}
          sx={{
            color: "inherit",
          }}
        >
          {!open ? (
            <AngleDownIcon className="icon" />
          ) : (
            <AngleUpIcon className="icon" />
          )}
        </IconButton>
      )}
    </ListItem>
  );
}

export interface IItem {
  name: string;
  header?: string;
  subject?: ISubject;
  path: string;
  selected: boolean;
  icon: React.ReactNode;
  subItems?: IItem[];
}

const items: IItem[] = [
  {
    name: "Dashboard",
    subject: "DashboardMenu",
    path: "/dashboard",
    selected: false,
    icon: (
      <DashboardIcon
        className="icon"
        style={{ width: 18, height: 18, mt: -0.25 }}
      />
    ),
    subItems: [],
  },
  {
    name: "OS Map",
    subject: "OsMap",
    path: "/dashboard/os-map",
    selected: false,
    icon: <CubeIcon style={{ height: 17.82, width: 18 }} />,
    subItems: [],
  },
  {
    name: "My Office",
    header: "Desks",
    subject: "ParkingSpotMenu",
    path: "/dashboard/desks",
    selected: false,
    icon: <BuildingsIcon style={{ height: 18, width: 18 }} />,
    subItems: [
      {
        name: "Desks",
        subject: "DesksMenu",
        path: "/dashboard/desks",
        selected: false,
        icon: (
          <DeskIcon
            className="icon"
            style={{ width: 18, height: 18, mt: -0.25 }}
          />
        ),
      },
      {
        name: "Floors",
        subject: "FloorsMenu",
        path: "/dashboard/floors",
        selected: false,
        icon: <LayerIcon style={{ height: 17, width: 17 }} />,
      },
      {
        name: "Rooms",
        subject: "Room",
        path: "/dashboard/rooms",
        selected: false,
        icon: <RoomIcon style={{ height: 14, width: 14 }} />,
      },
      {
        name: "Meeting Rooms",
        subject: "MeetingRoomsMenu",
        path: "/dashboard/meeting-room",
        selected: false,
        icon: <MeetingRoomIcon style={{ height: 14, width: 18 }} />,
      },
      {
        name: "Parking Spots",
        subject: "ParkingSpotMenu",
        path: "/dashboard/parking-spot",
        selected: false,
        icon: <ParkingIcon style={{ height: 18, width: 18 }} />,
      },
    ],
  },
  {
    name: "Schedule",
    subject: "Schedule",
    path: "/dashboard/schedule",
    selected: false,
    icon: (
      <Box
        sx={{
          "& .icon": {
            width: 23.5,
            height: 24,
            mt: -0.25,
            pl: 0.25,
          },
        }}
      >
        <ScheduleIcon className="icon" />
      </Box>
    ),
    subItems: [],
  },
  {
    name: "Inventory System",
    subject: "InventoryMenu",
    path: "/dashboard/inventory",
    selected: false,
    icon: <DatabaseIcon style={{ height: 17, width: 15 }} />,
    subItems: [],
  },
  {
    name: "User Console",
    header: "Employees",
    subject: "UserConsoleMenu",
    path: "/dashboard/user-console",
    selected: false,
    icon: <FolderUserIcon style={{ height: 17, width: 17 }} />,
    subItems: [
      {
        name: "Employees",
        subject: "UserConsoleEmployeeSubMenu",
        path: "/dashboard/user-console",
        icon: (
          <Box
            sx={{
              "& .icon": {
                width: 22,
                height: 24,
                mt: -0.25,
              },
            }}
          >
            <EmployeeIcon className="icon" />
          </Box>
        ),
        selected: false,
      },
      {
        name: "Customers",
        subject: "Customer",
        path: "/dashboard/customers",
        icon: <UserTieIcon />,
        selected: false,
      },
      {
        name: "Visitors",
        subject: "UserConsoleVisitorsSubMenu",
        path: "/dashboard/visitors",
        icon: <VisitorIcon />,
        selected: false,
      },
    ],
  },
  {
    name: "Tenants",
    subject: "TenantsMenu",
    path: "/dashboard/tenants",
    selected: false,
    icon: <UserClockIcon style={{ height: 16, width: 19 }} />,
    subItems: [],
  },
  {
    name: "My Contracts",
    subject: "MyContractMenu",
    path: "/dashboard/contracts",
    selected: false,
    icon: <ContractIcon style={{ height: 17, width: 19 }} />,
    subItems: [],
  },
  {
    name: "Deliveries",
    subject: "DeliveriesMenu",
    path: "/dashboard/deliveries",
    selected: false,
    icon: <PersonCarryBoxIcon style={{ width: 15, height: 20, mt: -0.5 }} />,
    subItems: [],
  },
  {
    name: "Apps",
    subject: "Apps",
    path: "/dashboard/apps",
    selected: false,
    icon: (
      <Box sx={{ pt: 0.1 }}>
        <AppsIcon style={{ width: 17, height: 16 }} />
      </Box>
    ),
    subItems: [],
  },
  {
    name: "SaltoKS",
    subject: "AppsSaltoKs",
    path: "/dashboard/apps/saltoks",
    selected: false,
    icon: (
      <Box
        sx={{
          "& .icon": {
            width: 22.5,
            height: 20,
          },
        }}
      >
        <SaltoKsIcon className="icon" />
      </Box>
    ),
    subItems: [],
  },
  {
    name: "OS Analytics",
    subject: "AppsOsAnalytics",
    path: "/dashboard/apps/os-analytics",
    selected: false,
    icon: (
      <Box
        sx={{
          "& .icon": {
            width: 22.5,
            height: 20,
          },
        }}
      >
        <OsAnalyticsIcon className="icon" />
      </Box>
    ),
    subItems: [],
  },
  {
    name: "Media",
    subject: "Media",
    path: "/dashboard/media",
    selected: false,
    icon: <FilmIcon style={{ width: 18, height: 15 }} />,
    subItems: [],
  },
  {
    name: "Reports",
    subject: "Reports",
    path: "/dashboard/reports",
    selected: false,
    icon: (
      <Box
        sx={{
          "& .icon": {
            width: 24.5,
            height: 24.5,
            mt: -0.25,
          },
        }}
      >
        <ReportsIcon className="icon" />
      </Box>
    ),
    subItems: [],
  },
  {
    name: "Events",
    subject: "EventsMenu",
    path: "/dashboard/events",
    selected: false,
    icon: <EventMenuIcon className="icon" />,
    subItems: [],
  },
  {
    name: "Organizer Events",
    subject: "OrganizerEventsMenu",
    path: "/dashboard/organizer-events",
    selected: false,
    icon: <EventMenuIcon className="icon" />,
    subItems: [],
  },
  {
    name: "Content Management",
    subject: "ContentManagementMenu",
    path: "/dashboard/content-management",
    selected: false,
    icon: <ContentManagementMenuIcon className="icon" />,
    subItems: [],
  },
  {
    name: "Automations",
    subject: "AutomationsMenu",
    path: "/dashboard/apps/automations",
    selected: false,
    icon: <AutomationIcon className="icon" />,
    subItems: [],
  },
];
