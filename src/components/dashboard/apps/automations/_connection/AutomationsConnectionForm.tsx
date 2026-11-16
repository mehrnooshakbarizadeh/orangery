// contexts & globals
import { useGlobalState } from "../../../../../Contexts & Globals/GlobalContext";

// react & next
import React from "react";

// external dependencies
import {
  Box,
} from "@mui/material";
import { makeAutoObservable } from "mobx";

// orangery elements & internal dependencies
import {
  FieldError,
  FormError,
} from "../../../../../states/mobx-form";
// import DeleteDoorAccessButton from "./DeleteDoorAccessButton";
import {
  OrangeryToast,
  OrangeryCircleLoading
} from "../../../../OrangeryElements";

// queries & backend
import {
  useConnect,
} from "../../../../../queries/apps/automations";
import {
  useAppsMutation
} from "../../../../../queries/apps";

// icons, images & colors
//

export class AutomationsFormState {
  public error = "";

  constructor() {
    makeAutoObservable(this);
  }

  get data() {
    return {
    };
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

export default function AutomationsConnectionForm({
  handleClose,
}: {
  handleClose: () => void;
}) {
  const globalState = useGlobalState()

  const mutation = useConnect();

  const state = React.useMemo(
    () => new AutomationsFormState(),
    []
  );

  const appsMutation = useAppsMutation();
  async function handleSubmit(e?: React.FormEvent) {
    if (e)
      e.preventDefault();

    if (!state.validate()) {
      return;
    }
    try {
      await mutation.mutateAsync();
      handleClose();
      OrangeryToast(`Successfully connected.`, "success");

      let apps = await appsMutation.mutateAsync()
      globalState.setApps(apps)
    } catch (err: any) {
      // let apps = await appsMutation.mutateAsync()
    }
  }

  React.useEffect(() => {
    handleSubmit()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (<Box
    sx={{
      my: "auto",
      mx: "auto",
      // color: "white"
    }}
  >
    <OrangeryCircleLoading />
  </Box>
  );
} 