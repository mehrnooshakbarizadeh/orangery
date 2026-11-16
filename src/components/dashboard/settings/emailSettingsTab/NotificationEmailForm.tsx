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
import CloseIcon from "@mui/icons-material/Close";
import { makeAutoObservable, toJS } from "mobx";
import { Observer } from "mobx-react-lite";

// orangery elements & internal dependencies
import {
  FieldError,
  FormError,
  ValueState,
} from "../../../../states/mobx-form";
import { OrangeryToast } from "../../../OrangeryElements";

// queries & backend
import {
  useNotificationEmail,
  useUpdateNotificationEmail,
  INotificationEmail,
  INotificationEmailUpdate,
} from "../../../../queries/office";

// icons, images & colors
import EditPenIcon from "../../../../assets/svg/editPen.svg";
import CheckIcon from "@mui/icons-material/Check";

export class NotificationEmailState {
  public uuid;
  public emails;
  public error = "";

  private office;

  constructor(office?: INotificationEmailUpdate) {
    this.office = office;
    if (office) {
      this.uuid = new ValueState(office.uuid);
      this.emails = new ValueState(office.emails);
    } else {
      this.uuid = new ValueState("");
      this.emails = new ValueState([]);
    }

    makeAutoObservable(this);
  }

  reset = () => {
    let office = this.office;
    if (office) {
      this.uuid = new ValueState(office.uuid);
      this.emails = new ValueState(office.emails);
    } else {
      this.uuid = new ValueState("");
      this.emails = new ValueState([]);
    }
  };

  get data() {
    return {
      uuid: this.uuid.value,
      emails: toJS(this.emails.value),
    };
  }

  clearErrors() {
    this.emails.clearError();
    this.error = "";
  }

  setupErrors(err: FormError) {
    this.clearErrors();
    err.errors.forEach((error) => this.setupError(error));
  }

  setupError(error: FieldError) {
    if (error.field === "") {
      this.error = error.error;
    } else if (error.field === "emails") {
      this.emails.error = error.error;
    } else {
    }
  }
}

export default function NotificationEmailForm({
  loading,
}: {
  loading?: JSX.Element;
}) {
  const globalState = useGlobalState();
  const { data: notificationEmail, isLoading } = useNotificationEmail(
    globalState.office_uuid
  );

  const mutation = useUpdateNotificationEmail();
  const state = React.useMemo(
    () => new NotificationEmailState(notificationEmail),
    [, notificationEmail]
  );
  const { t } = useTranslation("auth");

  const [error, setError] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const regex =
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  async function handleChange(emails: string[]) {
    const errorEmail = emails.find((email) => !regex.test(email));

    if (errorEmail) {
      // set value displayed in the textbox
      setInputValue(errorEmail);
      setError(true);
    } else {
      setError(false);
      state.emails.value = emails.filter((email) => regex.test(email));
      state.uuid.value = globalState.office_uuid;
      try {
        const result = await mutation.mutateAsync(state.data);
        OrangeryToast(
          "Notification Email settings successfully edited",
          "success"
        );
      } catch (err: any) {
        state.setupErrors(err);
      }
    }
  }

  async function handleCancel(e: React.FormEvent) {
    e.preventDefault();
    state.reset();
    setInputValue("");
    setError(false);
    setEditMode(false);
  }

  const handleEditIcon = () => {
    setEditMode(!editMode);
    if (editMode && inputValue !== "") {
      setError(true);
      setEditMode(editMode);
    } else if (editMode && inputValue === "") {
      setError(false);
      setEditMode(!editMode);
    }
  };

  function onInputChange(e: any, newValue: string) {
    setInputValue(newValue);
  }

  const [editMode, setEditMode] = React.useState(false);

  return (
    <>
      {isLoading ? (
        loading
      ) : (
        <Box
          sx={{
            mb: 1,
            mx: "auto",
            my: "auto",
            width: { xs: "100%", sm: "100%", md: "100%", lg: "100%" },
            minWidth: { xs: "100%", sm: "100%", md: "70%", lg: "50%" },
            "& > * + *": {
              mb: 3,
            },
          }}
        >
          <Observer>
            {() => (
              <>
                <Box sx={{ display: "flex", alignItems: "center", mt: 3 }}>
                  <Autocomplete
                    sx={{
                      "& .MuiFilledInput-root": {
                        backgroundColor: "#f9f9fa",
                        borderRadius: "4px",
                      },
                      "& .MuiFilledInput-root.Mui-disabled": {
                        backgroundColor: "#ebebee",
                      },
                      width: "100%",
                    }}
                    value={state.data.emails}
                    onChange={(_, newValue: string[]) => {
                      handleChange(newValue);
                    }}
                    inputValue={inputValue}
                    onInputChange={onInputChange}
                    disabled={!editMode}
                    multiple
                    id="tags-filled"
                    options={[]}
                    freeSolo
                    renderTags={(value: readonly string[], getTagProps) =>
                      value.map((option: string, index: number) => (
                        <Chip
                          {...getTagProps({ index })}
                          variant="outlined"
                          label={option}
                          key={option}
                          sx={{
                            color: "#074EE8",
                            backgroundColor: "#fff",
                            "&.MuiChip-root": {
                              borderRadius: "5px",
                              border: "none",
                              mt: 1,
                              mb: 1,
                            },
                          }}
                        />
                      ))
                    }
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        type={"email"}
                        error={error}
                        helperText={
                          error && "Please enter a valid email address"
                        }
                        variant="filled"
                        label="List of email recipients"
                        placeholder="Enter emails"
                        InputProps={{
                          style: {
                            padding: "20px 30px 10px 10px",
                          },
                          ...params.InputProps,
                          disableUnderline: true,
                          endAdornment: (
                            <InputAdornment
                              position="end"
                              sx={{
                                width: "1.3rem",
                                gap: 0.5,
                                color: "grey.A200",
                                position: "absolute",
                                top: 15,
                                right: 10,
                                paddingTop: 0,
                              }}
                            >
                              <Box
                                width={
                                  editMode
                                    ? { xs: "60%", md: "30%" }
                                    : { xs: "30%", md: "15%" }
                                }
                                sx={{
                                  ml: -3,
                                  height: 30,
                                }}
                              >
                                <Button
                                  // variant="contained"
                                  disableRipple={true}
                                  color="primary"
                                  sx={{
                                    "&:hover": {
                                      backgroundColor: "transparent",
                                    },
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
                                  onClick={handleEditIcon}
                                />
                                {editMode && (
                                  <Button
                                    disableRipple={true}
                                    color="primary"
                                    onClick={handleCancel}
                                    sx={{
                                      display: "block",
                                      "&:hover": {
                                        backgroundColor: "transparent",
                                      },
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
                            </InputAdornment>
                          ),
                        }}
                      />
                    )}
                  />
                </Box>
              </>
            )}
          </Observer>
          <FormErrorMessage state={state} />
        </Box>
      )}
    </>
  );
}

function FormErrorMessage({ state }: { state: { error: string } }) {
  return (
    <Observer>{() => <>{state.error && <div>{state.error}</div>}</>}</Observer>
  );
}
