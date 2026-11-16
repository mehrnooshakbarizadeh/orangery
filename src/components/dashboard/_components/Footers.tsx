// contexts & globals
import { useGlobalState } from "../../../Contexts & Globals/GlobalContext";
import Can from "../../../services/can";

// react & next
import { useRouter } from "next/router";
import NextLink from "next/link";
import React, { useState } from "react";

// external dependencies
import { Link as MUILink, Box, Button, List, ListItem, Typography } from "@mui/material";

// orangery elements & internal dependencies
import { IItem, MenuItem } from "./Menus";

// icons, images & colors
import CreditCardIcon from "../../../assets/svg/creditCard.svg";
import SettingIcon from "../../../assets/svg/setting.svg";
import HelpDeskIcon from "../../../assets/svg/help-desk.svg";
import PaymentIcon from "../../../assets/svg/dashboard/newMenuSVGs/payment.svg";

// export function Footer({
//   item,
//   toggle,
// }: {
//   item: any;
//   toggle: React.ReactNode;
// }) {
//   const router = useRouter();
//   const globalState = useGlobalState();
//   const [hover, setHover] = useState(false);

//   const selected = router.pathname === item.path;
//   React.useEffect(() => {
//     if (router.pathname === item.path) {
//       globalState.set_current_page_header(item.header ?? item.name);
//       globalState.setCurrentSubject(item.subject ?? "null");
//     }
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [])

//   return (
//     <>
//       <NextLink href={item.path} passHref>
//         <ListItem
//           button
//           selected={selected}
//           // onClick={() => globalState.set_current_page_header(item.name)}
//           key={item.name}
//           onMouseOver={() => setHover(true)}
//           onMouseOut={() => setHover(false)}
//           sx={{
//             overflow: "hidden",
//             "&.Mui-selected": {
//               "& .link-style": {
//                 color: (theme) => theme.palette.secondary.main,
//               },
//             },
//             transition: "0.2s",
//             "&:hover": {
//               ml: "5%",
//             },
//           }}
//         >
//           <MUILink
//             variant="body2"
//             underline="none"
//             className="link-style"
//             sx={{
//               fontSize: "16px",
//               fontWeight: "600",
//               cursor: "pointer",
//               transition: "0.2s",
//               color: hover
//                 ? (theme) => theme.palette.secondary.main
//                 : "#e3e3e3",
//               display: "flex",
//               gap: 4,
//               // py: 0.75,
//               pl: "4px",
//             }}
//           >
//             <Box sx={{ width: 18, display: "flex" }}>{item.icon}</Box>
//             <Box sx={{}}>{item.name}</Box>
//           </MUILink>
//         </ListItem>
//       </NextLink>
//     </>
//   );
// }

export default function Footers({ open }: { open?: boolean }) {
  return (
    <List component="nav" sx={{ width: "100%" }}>
      {items.map((item) => (
        <Can key={item.name} I="view" a={item.subject ?? "null"}>
          <MenuItem item={item} />
        </Can>
      ))}
    </List>
  );
}

export const items: IItem[] = [
  {
    name: "Help Desk",
    subject: "HelpDesk",
    path: "/dashboard/help-desk",
    icon: <HelpDeskIcon style={{ width: 20, height: 16 }} />,
    selected: false,
  },
  {
    name: "Payment",
    subject: "PaymentMenu",
    path: "/dashboard/payment",
    icon: <PaymentIcon style={{ width: 21.12, height: 19 }} />,
    selected: false,
  },
  {
    name: "Settings",
    subject: "SettingsMenu",
    path: "/dashboard/settings",
    icon: <SettingIcon style={{ width: 20, height: 20 }} />,
    selected: false,
  },
];
