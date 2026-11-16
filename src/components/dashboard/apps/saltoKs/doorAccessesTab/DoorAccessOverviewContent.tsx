// react & next
import React from "react";

// external dependencies
import {
  Box,
  Button,
  Divider,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import { Observer } from "mobx-react-lite";

// orangery elements & internal dependencies
//

// queries & backend
import {
  IDoorAccess,
} from "../../../../../queries/apps/saltoKs";

// icons, images & colors
import CrossIcon from "../../../../assets/svg/cross.svg";

export default function DoorAccessOverviewContent({
  doorAccess,
  handleClose,
}: {
  doorAccess: IDoorAccess;
  handleClose: () => void;
}) {
  return (
    <>

    </>
  );
}