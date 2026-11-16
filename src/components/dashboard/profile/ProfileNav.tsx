// contexts & globals
import { useGlobalState } from "../../../Contexts & Globals/GlobalContext";

// react & next
import React from "react";

// external dependencies
import { Box, Paper, Typography } from "@mui/material";

// orangery elements & internal dependencies
import ProfileForm from "./ProfileForm";

export default function ProfileNav() {
  const globalState = useGlobalState();

  const user = globalState.currentUser;
  // let dashboard = data;

  return user ? (
    <ProfileForm
      profile={{
        uuid: user?.uuid,
        first_name: user?.first_name,
        last_name: user?.last_name,
        email: user?.email,
        image: user?.image,
      }}
    />
  ) : (
    <></>
  );
}
