// contexts & globals
import { useGlobalState } from "../../../Contexts & Globals/GlobalContext";

// react & next
import React from "react";

// external dependencies
import {
  Box,
  Button,
  Typography,
  TextField,
  Checkbox,
  FormControlLabel,
} from "@mui/material";
import { makeAutoObservable } from "mobx";
import { Observer } from "mobx-react-lite";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DateTimePicker, LocalizationProvider } from "@mui/x-date-pickers";

// orangery elements & internal dependencies
import { FieldError, FormError, ValueState } from "../../../states/mobx-form";
import EmployeeAutocomplete from "../desks/EmployeeAutocomplete";
import DeleteVisitorButton from "./DeleteVisitorButton";
import {
  OrangeryToast,
  OrangeryTextField,
  OrangeryTextAreaField,
  OrangeryFormWrapper,
  OrangeryButton,
} from "../../OrangeryElements";

// queries & backend
import { IVisitorType, useUpsertVisitor } from "../../../queries/visitor";

// icons, images & colors
import UserIcon from "../../../assets/svg/user.svg";
import EmailIcon from "../../../assets/svg/email.svg";
import ClipbaordUserIcon from "../../../assets/svg/clipbaordUser.svg";
import { VisitorSortState } from "./VisitorsList";

export class VisitorState {
  public uuid;
  public visitor_name;
  public visitor_email;
  public host_uuid;
  public arrival;
  public private_note;
  public public_note;
  public send_email;
  public office_uuid;
  public error = "";

  constructor(office_uuid: string, visitor?: IVisitorType) {
    this.office_uuid = new ValueState(office_uuid);
    if (visitor) {
      this.visitor_name = new ValueState(visitor.visitor.name);
      this.uuid = new ValueState(visitor.uuid);
      this.host_uuid = new ValueState(visitor?.host?.uuid ?? "");
      this.visitor_email = new ValueState(visitor.visitor.email);
      this.arrival = new ValueState(visitor.arrival);
      this.private_note = new ValueState(visitor.private_note);
      this.public_note = new ValueState(visitor.public_note);
      this.send_email = new ValueState(visitor.send_email);
    } else {
      this.visitor_name = new ValueState("");
      this.uuid = new ValueState("");
      this.host_uuid = new ValueState("");
      this.visitor_email = new ValueState("");
      this.arrival = new ValueState(new Date());
      this.private_note = new ValueState("");
      this.public_note = new ValueState("");
      this.send_email = new ValueState(true);
    }

    makeAutoObservable(this);
  }

  get data() {
    let arrival = new Date(this.arrival.value);
    let formattedArrival = `${arrival.getFullYear()}-${arrival.getMonth() + 1}-${arrival.getDate()} ${arrival.getHours()}:${arrival.getMinutes()}`;
    return {
      uuid: this.uuid.value,
      visitor_name: this.visitor_name.value,
      host_uuid: this.host_uuid.value,
      visitor_email: this.visitor_email.value,
      arrival: formattedArrival, ////////!!!!!!!! should be revised
      private_note: this.private_note.value,
      public_note: this.public_note.value,
      send_email: this.send_email.value,
      office_uuid: this.office_uuid.value,
    };
  }

  clearErrors() {
    this.visitor_name.clearError();
    this.host_uuid.clearError();
    this.visitor_email.clearError();
    this.arrival.clearError();
    this.private_note.clearError();
    this.public_note.clearError();
    this.send_email.clearError();
    this.error = "";
  }

  validate() {
    let valid = true;
    this.clearErrors();
    if (!this.visitor_name.value) {
      this.visitor_name.error = "Please fill your visitor name";
      valid = false;
    }
    if (!this.visitor_email.value) {
      this.visitor_email.error = "Please write visitor email";
      valid = false;
    }
    if (!this.host_uuid.value) {
      this.host_uuid.error = "Please fill visitor host";
      valid = false;
    }
    return valid;
  }

  setupErrors(err: FormError) {
    this.clearErrors();
    err.errors.forEach((error) => this.setupError(error));
  }

  setupError(error: FieldError) {
    if (error.field === "") {
      this.error = error.error;
    } else if (error.field === "visitor_name") {
      this.visitor_name.error = error.error;
    } else if (error.field === "host_uuid") {
      this.host_uuid.error = error.error;
    } else if (error.field === "visitor_email") {
      this.visitor_email.error = error.error;
    } else if (error.field === "arrival") {
      this.arrival.error = error.error;
    } else if (error.field === "private_note") {
      this.private_note.error = error.error;
    } else if (error.field === "public_note") {
      this.public_note.error = error.error;
    } else {
      // console.warn(
      //   `the field ${error.field} not found in the field list in Visitor Form.`
      // );
    }
  }
}

export default function VisitorForm({
  visitor,
  handleClose,
  noCancel,
  noRemove,
  updateDashboard,
}: {
  visitor?: IVisitorType;
  handleClose: () => void;
  noCancel?: any;
  noRemove?: any;
  updateDashboard?: boolean;
}) {
  const { office_uuid } = useGlobalState();
  const mutation = useUpsertVisitor();
  const state = React.useMemo(
    () => new VisitorState(office_uuid, visitor),
    [office_uuid, visitor]
  );
  const globalState = useGlobalState();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!state.validate()) {
      return;
    }
    try {
      await mutation.mutateAsync({ ...state.data, updateDashboard });
      handleClose();
      if (visitor) {
        OrangeryToast(
          "Successfully edited " + state.data.visitor_name,
          "success"
        );
      } else {
        OrangeryToast(
          "Successfully created " + state.data.visitor_name,
          "success"
        );
      }
    } catch (err: any) {
      state.setupErrors(err);
    }
  }

  return (
    <OrangeryFormWrapper
      onSubmit={handleSubmit}
      onClose={handleClose}
      title={`${visitor ? "Edit" : "Add"} Visitor`}
      withBorder
      // style={{
      //   height: "100%"
      // }}
      footer={
        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "center",
            width: "100%",
          }}
        >
          <Observer>
            {() => (
              <>
                {!noRemove && (
                  <Box sx={{ flexGrow: 1 }}>
                    {visitor && (
                      <DeleteVisitorButton
                        handleCloseForm={handleClose}
                        visitor={visitor}
                        label="Remove"
                        sx={{ color: "red" }}
                      />
                    )}
                  </Box>
                )}
              </>
            )}
          </Observer>
          <Observer>
            {() => (
              <Box
                sx={{
                  display: "flex",
                  gap: 2,
                  ml: "auto",
                }}
              >
                {!noCancel && (
                  <OrangeryButton variant="cancel" onClick={handleClose} />
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
                  {visitor ? "Save" : "Create"}
                </Button>
              </Box>
            )}
          </Observer>
        </Box>
      }
    >
      <Observer>
        {() => (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              pt: 4,
              pb: 1,
              px: 4,
              gap: 1,
              rowGap: 2,
              width: "100%",
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Box sx={{ width: "33%" }}>
                <Observer>
                  {() => (
                    <OrangeryTextField
                      label="Visitor Full Name"
                      name="visitor_name"
                      startIcon={<UserIcon />}
                      placeholder="Enter Visitor's Name"
                      error={!!state.visitor_name.error}
                      value={state.visitor_name.value}
                      helperText={state.visitor_name.error}
                      onChange={(e: any) =>
                        (state.visitor_name.value = e.target.value)
                      }
                    />
                  )}
                </Observer>
              </Box>

              <Box sx={{ width: "33%" }}>
                <Observer>
                  {() => (
                    <OrangeryTextField
                      type="email"
                      label="Visitor Email"
                      name="visitor_email"
                      startIcon={<EmailIcon />}
                      placeholder="Enter Visitor's Email"
                      error={!!state.visitor_email.error}
                      value={state.visitor_email.value}
                      helperText={state.visitor_email.error}
                      onChange={(e: any) =>
                        (state.visitor_email.value = e.target.value)
                      }
                    />
                  )}
                </Observer>
              </Box>

              <Box sx={{ width: "33%" }}>
                <Observer>
                  {() => (
                    <EmployeeAutocomplete
                      sx={{ height: "85px" }}
                      name="host_uuid"
                      label="Host"
                      icon={<ClipbaordUserIcon />}
                      placeholder="Select Host"
                      error={!!state.host_uuid.error}
                      helperText={state.host_uuid.error}
                      value={state.host_uuid.value}
                      onChange={(newValue) => {
                        state.host_uuid.value = newValue;
                      }}
                    />
                  )}
                </Observer>
              </Box>
            </Box>

            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                // alignItems: "center",
                gap: 4,
              }}
            >
              <Box sx={{ width: "33%" }}>
                <Observer>
                  {() => (
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                      <DateTimePicker
                        label="Arrival Date"
                        value={state.arrival.value}
                        onChange={(newValue: any) => {
                          state.arrival.value = newValue;
                        }}
                        renderInput={(props) => (
                          <TextField {...props} fullWidth />
                        )}
                      />
                    </LocalizationProvider>
                  )}
                </Observer>
              </Box>
              <Box sx={{ width: "100%" }}>
                <Observer>
                  {() => (
                    <OrangeryTextAreaField
                      sx={{ height: "100px" }}
                      label="Note for Admin"
                      name="private_note"
                      multiline
                      error={!!state.private_note.error}
                      value={state.private_note.value}
                      helperText={state.private_note.error}
                      onChange={(e: any) =>
                        (state.private_note.value = e.target.value)
                      }
                    />
                  )}
                </Observer>
              </Box>

              <Box sx={{ width: "100%" }}>
                <Observer>
                  {() => (
                    <OrangeryTextAreaField
                      sx={{ height: "100px" }}
                      label="Note For Visitor"
                      name="public_note"
                      multiline
                      value={state.public_note.value}
                      onChange={(e) =>
                        (state.public_note.value = e.target.value)
                      }
                      error={!!state.public_note.error}
                      helperText={state.public_note.error}
                    />
                  )}
                </Observer>
              </Box>
            </Box>

            {visitor ? (
              <Box>
                <Observer>
                  {() => (
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={state.send_email.value}
                          onChange={(e) =>
                            (state.send_email.value = e.target.checked)
                          }
                        />
                      }
                      label="Resend an invitation email to this person?"
                    />
                  )}
                </Observer>
              </Box>
            ) : (
              <Box>
                <Observer>
                  {() => (
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={state.send_email.value}
                          onChange={(e) =>
                            (state.send_email.value = e.target.checked)
                          }
                        />
                      }
                      label="Send an invitation email to this person?"
                    />
                  )}
                </Observer>
              </Box>
            )}
          </Box>
        )}
      </Observer>
    </OrangeryFormWrapper>
  );
}
