// contexts & globals
import { useGlobalState } from "../../../../../Contexts & Globals/GlobalContext";

// react & next
import React from "react";
import { useRouter } from "next/router";
// external dependencies
import { Box, Button, Typography } from "@mui/material";
import { makeAutoObservable } from "mobx";
import { Observer } from "mobx-react-lite";

// orangery elements & internal dependencies
import { FieldError, FormError } from "../../../../../states/mobx-form";
// import DeleteDoorAccessButton from "./DeleteDoorAccessButton";
import {
  OrangeryToast,
  OrangeryTextField,
  OrangeryCloseButton,
  OrangeryStringArrayAutocomplete,
  OrangeryNavigationContentLoader,
  OrangeryCircleLoading,
} from "../../../../OrangeryElements";

// queries & backend

// icons, images & colors
//

export class GoogleAdminFormState {
  public error = "";

  constructor() {
    makeAutoObservable(this);
  }

  get data() {
    return {};
  }

  clearErrors() {
    this.error = "";
  }

  validate() {
    let valid = true;
    return valid;
  }

  setupErrors(err: FormError) {
    this.clearErrors();
    err.errors?.forEach((error) => this.setupError(error));
  }

  setupError(error: FieldError) {
    if (error.field === "") {
      this.error = error.error;
    } else {
      // console.warn(
      //   `the field ${error.field} not found in the field list in DoorAccessForm.`
      // );
    }
  }
}

export default function GoogleAdminUsersConnectionForm({
  handleClose,
}: {
  handleClose: () => void;
}) {
  const globalState = useGlobalState();
  const router = useRouter();
  const user = globalState.currentUser;

  router.push(
    `${process.env.NEXT_PUBLIC_BASE_URL}/google/user/authorize${user ? `?state=${user.uuid}` : ""}`
  );
  return <></>;
}
