// contexts & globals
//

// react & next
import React from "react";

// external dependencies
import {
  Box,
  Button,
  Typography,
  Divider
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
  OrangeryNavigationContentLoader,
  OrangeryTextField
} from "../../../../OrangeryElements";

// queries & backend
import {
  IIq,
  useRequestIqOldPinSms,
  useConnectIq
} from "../../../../../queries/apps/saltoKs";

// icons, images & colors
//

export class ConnectIqFormState {
  public iq_id;
  public old_pin;
  public new_pin;

  public error = "";

  constructor(iq?: IIq) {
    this.iq_id = new ValueState(iq?.iq_id ?? "");
    this.old_pin = new ValueState<string>("");
    this.new_pin = new ValueState<string>("");

    makeAutoObservable(this);
  }

  get data() {
    return {
      iq_id: this.iq_id.value,
      old_pin: this.old_pin.value,
      new_pin: this.new_pin.value,
    };
  }

  clearErrors() {
    this.iq_id.clearError();
    this.old_pin.clearError();
    this.new_pin.clearError();

    this.error = "";
  }

  validate() {
    let valid = true;
    this.clearErrors();
    if (!this.old_pin.value) {
      this.old_pin.error = "Please enter pin";
      valid = false;
    }
    if (!this.new_pin.value) {
      this.new_pin.error = "Please enter pin";
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
    } else if (error.field === "old_pin") {
      this.old_pin.error = error.error;
    } else if (error.field === "new_pin") {
      this.new_pin.error = error.error;
    } else {
      // console.warn(
      //   `the field ${error.field} not found in the field list in DoorAccessForm.`
      // );
    }
  }
}

export default function ConnectIqForm({
  iq,
  handleClose,
  noCancel,
  noRemove,
}: {
  iq: IIq;
  handleClose: () => void;
  noCancel?: any;
  noRemove?: any;
}) {
  const {
    data: requestIqOldPinSmsMutationReult,
    isLoading: requestIqOldPinSmsMutationIsLoading
  } = useRequestIqOldPinSms({ iq_id: iq.iq_id });

  const connectIqMutation = useConnectIq();
  const state = React.useMemo(
    () => new ConnectIqFormState(iq),
    [iq]
  );

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!state.validate()) {
      return;
    }
    try {
      await connectIqMutation.mutateAsync(state.data);
      handleClose();
      OrangeryToast(`Successfully connected.`, "success");
    } catch (err: any) {
      state.setupErrors(err);
    }
  }

  return (<>{
    requestIqOldPinSmsMutationIsLoading || !requestIqOldPinSmsMutationReult?.data
      ? <OrangeryNavigationContentLoader />
      : <form
        onSubmit={handleSubmit}
        style={{
          height: "100%"
        }}
      >
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
                Connect IQ
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
                pr: 2,
                mr: 2,
                rowGap: 2,
                mb: 5,
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
                    label="OLD PIN"
                    type="text"
                    name="old_pin"
                    fullWidth
                    value={state.old_pin.value}
                    error={!!state.old_pin.error}
                    helperText={state.old_pin.error}
                    onChange={(e) => (state.old_pin.value = e.target.value)}
                  />
                </Box>
              </Box>

              <Divider sx={{ mb: 3 }} />

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
                    label="NEW PIN"
                    type="text"
                    name="new_pin"
                    fullWidth
                    value={state.new_pin.value}
                    error={!!state.new_pin.error}
                    helperText={state.new_pin.error}
                    onChange={(e) => (state.new_pin.value = e.target.value)}
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
            px: 3,
            pb: 3
          }}
        >
          {/* {!noRemove && !iq?.tenant_office_uuid &&
          <Box sx={{ flexGrow: 1 }}>
            {iq && (
              <DeleteDoorAccessButton
                handleCloseForm={handleClose}
                iq={iq}
                label="Remove"
                sx={{ color: "red" }}
              />
            )}
          </Box>
        } */}
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
                  disabled={connectIqMutation.isLoading}
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
  }</>
  );
}