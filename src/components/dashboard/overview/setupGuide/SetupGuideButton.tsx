// react & next
import { useState } from "react";

// external dependencies
import {
  Box,
  Button,
  Dialog,
  DialogContent,
  IconButton,
  Typography,
} from "@mui/material";

// orangery elements & internal dependencies
import { useGlobalState } from "../../../../Contexts & Globals/GlobalContext";
// import ParkingSpotForm from "./ParkingSpotForm";
import OverviewNav from "..";
// queries & backend
// import { IParkingSpot } from "../../../queries/parkingSpot";

// icons, images & colors
import FlagIcon from "../../../../assets/svg/flag.svg";

export default function SetupGuideButton() {
  const { setFirstView, firstView } = useGlobalState();

  const handleOpen = () => {
    setFirstView(true);
  };

  return (
    <>
      <IconButton sx={{ width: 35, height: 35 }} onClick={handleOpen}>
        <FlagIcon className="flag-icon" style={{ height: 28, width: 24 }} />
      </IconButton>
    </>
  );
}
