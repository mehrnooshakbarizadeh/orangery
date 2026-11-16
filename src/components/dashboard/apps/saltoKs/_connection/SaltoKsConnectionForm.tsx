// contexts & globals
import { useGlobalState } from "../../../../../Contexts & Globals/GlobalContext";

// react & next
import React from "react";
import { useRouter } from "next/router";

// external dependencies
import {
  Box,
  Button,
  Typography,
} from "@mui/material";
import { makeAutoObservable } from "mobx";
import { Observer } from "mobx-react-lite";

// orangery elements & internal dependencies
import {
  FieldError,
  FormError,
  ValueState,
} from "../../../../../states/mobx-form";
// import DeleteDoorAccessButton from "./DeleteDoorAccessButton";
import {
  OrangeryToast,
  OrangeryTextField,
  OrangeryCloseButton
} from "../../../../OrangeryElements";

// queries & backend
import {
  useConnect
} from "../../../../../queries/apps/saltoKs";
import {
  useAppsMutation
} from "../../../../../queries/apps";

// icons, images & colors
//

export class SaltoKsConnectionFormState {
  public salto_api_admin_email;
  public salto_api_admin_password;

  public error = "";

  constructor() {
    this.salto_api_admin_email = new ValueState<string>("");
    this.salto_api_admin_password = new ValueState<string>("");

    makeAutoObservable(this);
  }

  get data() {
    return {
      salto_api_admin_email: this.salto_api_admin_email.value,
      salto_api_admin_password: this.salto_api_admin_password.value,
    };
  }

  clearErrors() {
    this.salto_api_admin_email.clearError();
    this.salto_api_admin_password.clearError();

    this.error = "";
  }

  validate() {
    let valid = true;
    this.clearErrors();
    if (!this.salto_api_admin_email.value) {
      this.salto_api_admin_email.error = "Please enter API admin email";
      valid = false;
    }
    if (!this.salto_api_admin_password.value) {
      this.salto_api_admin_password.error = "Please enter admin password";
      valid = false;
    }
    return valid;
  }

  setupErrors(err: FormError) {
    this.clearErrors();
    err.errors?.forEach((error) => this.setupError(error));
  }

  setupError(error: FieldError) {
    if (error.field === "") {
      this.error = error.error;
    } else if (error.field === "salto_api_admin_email") {
      this.salto_api_admin_email.error = error.error;
    } else if (error.field === "salto_api_admin_password") {
      this.salto_api_admin_password.error = error.error;
    } else {
      // console.warn(
      //   `the field ${error.field} not found in the field list in DoorAccessForm.`
      // );
    }
  }
}

export default function SaltoKsConnectionForm({
  handleClose,
  noCancel,
}: {
  handleClose: () => void;
  noCancel?: any;
}) {
  const globalState = useGlobalState()
  const router = useRouter();

  const mutation = useConnect();
  const state = React.useMemo(
    () => new SaltoKsConnectionFormState(),
    []
  );

  const appsMutation = useAppsMutation();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!state.validate()) {
      return;
    }
    try {
      await mutation.mutateAsync(state.data);
      handleClose();
      OrangeryToast(`Successfully connected.`, "success");

      let apps = await appsMutation.mutateAsync()
      globalState.setApps(apps)

      router.push("/dashboard/apps/saltoks")
    } catch (err: any) {
      // let apps = await appsMutation.mutateAsync()
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        height: "100%",
        width: 800,
        position: "relative"
      }}
    >
      <OrangeryCloseButton onClose={handleClose} />
      <Observer>
        {() => (
          <Box
            sx={{
              pr: 3,
              pl: 4,
              py: 1.8,
              // pb: 1,
              // pt: 2.5,
              mb: 3.5,
              display: "flex",
              justifyContent: "end",
              alignItems: "center",
              borderBottom: (theme) => `1px solid ${theme.palette.grey[400]}`,
            }}
          >
            <Typography
              component="h4"
              variant="H4"
              sx={{ flexGrow: 1 }}
              color={(theme) => theme.palette.primary.light}
            >
              Connect SaltoKS
            </Typography>
          </Box>
        )}
      </Observer>

      <Observer>
        {() => (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              py: 1,
              pl: 4,
              pr: 3,
              rowGap: 2,
              mb: 0,
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: {
                  xs: "column",
                  sm: "row"
                },
                gap: 2
              }}
            >
              <Box sx={{ flexBasis: "100%" }}>
                <OrangeryTextField
                  label="API ADMIN EMAIL"
                  type="text"
                  name="salto_api_admin_email"
                  fullWidth
                  value={state.salto_api_admin_email.value}
                  error={!!state.salto_api_admin_email.error}
                  helperText={state.salto_api_admin_email.error}
                  onChange={(e) => (state.salto_api_admin_email.value = e.target.value)}
                />
              </Box>
            </Box>

            <Box
              sx={{
                display: "flex",
                flexDirection: {
                  xs: "column",
                  sm: "row"
                },
                gap: 2
              }}
            >
              <Box sx={{ flexBasis: "100%" }}>
                <OrangeryTextField
                  label="API ADMIN PASSWORD"
                  type="text"
                  name="salto_api_admin_password"
                  fullWidth
                  value={state.salto_api_admin_password.value}
                  error={!!state.salto_api_admin_password.error}
                  helperText={state.salto_api_admin_password.error}
                  onChange={(e) => (state.salto_api_admin_password.value = e.target.value)}
                />
              </Box>
            </Box>
          </Box>
        )}
      </Observer>

      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-end",
          alignItems: "center",
          pl: 4,
          pr: 3,
          pb: 3
        }}
      >
        <Observer>
          {() => (
            <>
              {!noCancel && (
                <Button
                  color="primary"
                  onClick={handleClose}
                  sx={{
                    width: 170,
                    height: 55,
                    fontSize: 20,
                    color: (theme) => theme.palette.grey.A200,
                    backgroundColor: (theme) => theme.palette.grey[200],
                    mr: 2,
                  }}
                >
                  Cancel
                </Button>
              )}
              <Button
                variant="contained"
                type="submit"
                color="primary"
                disabled={mutation.isLoading}
                sx={{
                  width: 170,
                  height: 55,
                  fontSize: 20,
                  color: "#fff",
                }}
              >
                Connect
              </Button>
            </>
          )}
        </Observer>
      </Box>
    </form>
  );
}