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
} from "@mui/material";
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

// queries & backend
import {
  useUpdateSettings,
  ISettings,
  ISettingsUpdateParams,
} from "../../../../queries/settings";

// icons, images & colors
import EditPenIcon from "../../../../assets/svg/editPen.svg";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

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

export default function OfferInstructionForm({
  settings,
}: {
  settings?: ISettingsUpdateParams;
}) {
  const mutation = useUpdateSettings();
  const state = React.useMemo(
    () => new OfficeInstructionState(settings),
    [, settings]
  );
  const { t } = useTranslation("auth");
  const globalState = useGlobalState();

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
        OrangeryToast("Email settings successfully edited", "success");
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
  let test = false;
  return (
    <>
      <Box
        sx={{
          width: "100%",
          backgroundColor: "white",
          borderRadius: "12px",
          boxShadow: { xs: "none", md: "1px 1px 3px #eaeaea" },
          padding: { xs: 0, sm: 2, md: 4 },
          flexGrow: 1,
        }}
      >
        <Box
          sx={{
            p: 2,
            overflowY: "auto",
            height: "calc(100vh - 64px)",
            "&::-webkit-scrollbar": {
              width: "0.4em",
            },
            "&::-webkit-scrollbar-track": {
              marginLeft: "20px",
            },
            "&::-webkit-scrollbar-thumb": {
              backgroundColor: "rgba(0,0,0,.1)",
              borderRadius: 5,
            },
          }}
        >
          <Box
            width={
              editMode ? { xs: "60%", md: "30%" } : { xs: "30%", md: "15%" }
            }
            mb={{ xs: 3, md: 2 }}
            sx={{
              margin: "0 0 0 auto",
              display: "flex",

              // "& > * + *": {
              //   ml: 4
              // }
            }}
          >
            {editMode && (
              <Button
                color="primary"
                onClick={handleCancel}
                sx={{
                  flexGrow: 1,
                  flexShrink: 1,
                  height: 55,
                  fontSize: 20,
                  mr: 3,
                  color: (theme) => theme.palette.grey.A200,
                  backgroundColor: "white",
                  border: "1px solid #2B2E33",
                }}
              >
                Cancel
              </Button>
            )}

            <Button
              variant="contained"
              color="primary"
              sx={{
                "& > *:first-of-type": { mx: 0 },
                "& .edit-icon": { width: "1.3rem", height: "1.3rem" },
                "& .MuiButton-root": { minWidth: 40 },
                flexGrow: 1,
                flexShrink: 1,
                height: 55,
                justifyContent: "space-between",
              }}
              startIcon={editMode || <EditPenIcon className="edit-icon" />}
              endIcon={
                editMode || (
                  <ArrowForwardIcon
                    fontSize="large"
                    sx={{ visibility: "hidden" }}
                  />
                )
              }
              onClick={handleSubmit}
            >
              <Typography
                sx={{
                  fontSize: 18,
                  fontWeight: 400,
                  color: "#fff",
                }}
              >
                {editMode ? "Save" : "Edit"}
              </Typography>
            </Button>
          </Box>
          <Box
            sx={{
              mb: 1,
              mx: "auto",
              my: "auto",
              width: { xs: "100%", sm: "100%", md: "60%" },
              maxWidth: "600px",
              "& > * + *": {
                mb: 3,
              },
            }}
          >
            <form onSubmit={handleSubmit}>
              <Observer>
                {() => (
                  <>
                    <Grid container spacing={3} sx={{ minWidth: "100%" }}>
                      <Grid item xs={12} sm={12}>
                        <OrangeryTextAreaField
                          sx={{
                            height: "80px",
                            mb: 3,
                          }}
                          label={
                            t("offerInstructionForm.Offer Instruction Email") +
                            ""
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
                  </>
                )}
              </Observer>

              <FormErrorMessage state={state} />
            </form>
            {/* <hr
            style={{
              borderTop: "1px dashed #C9CCD2",
              margin: "20px auto",
            }}
          /> */}
          </Box>
        </Box>
      </Box>
    </>
  );
}

function FormErrorMessage({ state }: { state: { error: string } }) {
  return (
    <Observer>{() => <>{state.error && <div>{state.error}</div>}</>}</Observer>
  );
}
