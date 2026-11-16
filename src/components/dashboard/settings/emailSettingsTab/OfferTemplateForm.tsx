// contexts & globals
import { useGlobalState } from "../../../../Contexts & Globals/GlobalContext";
import { useTranslation } from "react-i18next";
import i18next from "i18next";

// react & next
import React, { useState } from "react";

// external dependencies
import {
  Box,
  Button,
  Typography,
  IconButton,
  InputAdornment,
  Grid,
  Autocomplete,
  TextField,
  Chip,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import EditOffIcon from "@mui/icons-material/EditOff";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import { makeAutoObservable } from "mobx";
import { Observer } from "mobx-react-lite";

// orangery elements & internal dependencies
import {
  FieldError,
  FormError,
  ValueState,
} from "../../../../states/mobx-form";
import {
  OrangeryToast,
  OrangeryTextField,
  OrangeryTextAreaField,
} from "../../../OrangeryElements";
import NotificationEmailForm from "./NotificationEmailForm";

// queries & backend
import {
  useUpdateSettings,
  ISettings,
  ISettingsUpdateParams,
  useSettings,
} from "../../../../queries/settings";
import { useNotificationEmail } from "../../../../queries/office";
// icons, images & colors
import EditPenIcon from "../../../../assets/svg/editPen.svg";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { jsx } from "@emotion/react";

export class OfficeInstructionState {
  public uuid;
  public default_instruction;
  public error = "";

  private settings;

  constructor(settings?: ISettingsUpdateParams) {
    this.settings = settings;
    if (settings) {
      this.uuid = new ValueState(settings.uuid);
      this.default_instruction = new ValueState(settings.default_instruction);
    } else {
      this.uuid = new ValueState("");
      this.default_instruction = new ValueState("");
    }

    makeAutoObservable(this);
  }

  reset = () => {
    let settings = this.settings;
    if (settings) {
      this.uuid = new ValueState(settings.uuid);
      this.default_instruction = new ValueState(settings.default_instruction);
    } else {
      this.uuid = new ValueState("");
      this.default_instruction = new ValueState("");
    }
  };

  get data() {
    return {
      uuid: this.uuid.value,
      default_instruction: this.default_instruction.value,
    };
  }

  clearErrors() {
    this.default_instruction.clearError();
    this.error = "";
  }

  validate() {
    let valid = true;
    this.clearErrors();
    if (!this.default_instruction.value) {
      this.default_instruction.error = i18next.t(
        "offerInstructionForm.Please fill your offer instruction email",
        { ns: "auth" }
      );
      valid = false;
    }
    // if (this.default_instruction.value.length < 2) {
    //   this.default_instruction.error = i18next.t(
    //     "offerInstructionForm.The offer instruction email is too short",
    //     {
    //       ns: "auth",
    //     }
    //   );
    //   valid = false;
    // }
    return valid;
  }

  setupErrors(err: FormError) {
    this.clearErrors();
    err.errors.forEach((error) => this.setupError(error));
  }

  setupError(error: FieldError) {
    if (error.field === "") {
      this.error = error.error;
    } else if (error.field === "default_instruction") {
      this.default_instruction.error = error.error;
    } else {
      // console.warn(
      //   `the field ${error.field} not found in the field list in ProfileForm.`
      // );
    }
  }
}

export default function OfferTemplateForm({
  loading,
}: {
  loading?: JSX.Element;
}) {
  const globalState = useGlobalState();
  const { data: settings, isLoading } = useSettings(globalState.office_uuid);
  const mutation = useUpdateSettings();
  const state = React.useMemo(
    () => new OfficeInstructionState(settings),
    [, settings]
  );
  const { t } = useTranslation("auth");

  async function handleCancel(e: React.FormEvent) {
    e.preventDefault();

    state.reset();

    setEditMode(false);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (editMode) {
      if (!state.validate()) {
        return;
      }
      try {
        const result = await mutation.mutateAsync(state.data);
        globalState.setCurrentOffice(result);
        OrangeryToast(
          "Offer structure template settings successfully edited",
          "success"
        );
        setEditMode(false);
      } catch (err: any) {
        state.setupErrors(err);
        setEditMode(true);
      }
    } else {
      setEditMode(true);
    }
  }

  const [editMode, setEditMode] = React.useState(false);
  const handleEditIcon = () => {
    setEditMode(!editMode);
  };
  return (
    <>
      {isLoading ? (
        loading
      ) : (
        <form onSubmit={handleSubmit}>
          <Observer>
            {() => (
              <>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <Grid container spacing={3} sx={{ minWidth: "100%" }}>
                    <Grid item xs={12} sm={12} md={12} lg={12}>
                      <OrangeryTextAreaField
                        editMode={editMode}
                        endIcon={
                          <Box>
                            <Button
                              disableRipple={true}
                              color="primary"
                              sx={{
                                "&:hover": { backgroundColor: "transparent" },
                                "& > *:first-of-type": { mx: 0 },
                                "& .edit-icon": {
                                  width: "1rem",
                                  height: "1.3rem",
                                },
                              }}
                              startIcon={
                                editMode ? (
                                  <CheckIcon color={"success"} />
                                ) : (
                                  <EditPenIcon className="edit-icon" />
                                )
                              }
                              onClick={handleSubmit}
                            />
                            {editMode && (
                              <Button
                                disableRipple={true}
                                color="primary"
                                onClick={handleCancel}
                                sx={{
                                  display: "block",
                                  "&:hover": { backgroundColor: "transparent" },
                                  "& > *:first-of-type": { mx: 0 },
                                  "& .edit-icon": {
                                    width: "1rem",
                                    height: "1.3rem",
                                  },
                                }}
                                startIcon={<CloseIcon color={"warning"} />}
                              />
                            )}
                          </Box>
                        }
                        sx={{
                          outline: "none",
                          mb: 3,
                          "& .MuiFilledInput-root.Mui-disabled": {
                            backgroundColor: "#ebebee",
                          },
                          "& .MuiFilledInput-root": {
                            backgroundColor: "#f9f9fa",
                            borderRadius: "4px",
                            minHeight: 70,
                          },
                          "& .MuiOutlinedInput-root": {
                            backgroundColor: "#F9F9FA",
                          },
                          "& .MuiInputBase-input-MuiFilledInput-input": {
                            height: 100,
                          },
                        }}
                        placeholder={
                          "This is an instruction for an offer that is sent from the admin side for the target list that is created below. This is a test and editable text."
                        }
                        name="offer-instruction-email"
                        multiline
                        error={!!state.default_instruction.error}
                        value={state.default_instruction.value}
                        helperText={state.default_instruction.error}
                        onChange={(e: any) =>
                          (state.default_instruction.value = e.target.value)
                        }
                        disabled={!editMode}
                      />
                    </Grid>
                  </Grid>
                </Box>
              </>
            )}
          </Observer>
          <FormErrorMessage state={state} />
        </form>
      )}
    </>
  );
}

function FormErrorMessage({ state }: { state: { error: string } }) {
  return (
    <Observer>{() => <>{state.error && <div>{state.error}</div>}</>}</Observer>
  );
}
