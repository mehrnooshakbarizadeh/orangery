// contexts & globals
import { useGlobalState } from "../../../Contexts & Globals/GlobalContext";
import { useTranslation } from "react-i18next";
import i18next from "i18next";

// react & next
import React from "react";

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
import { FieldError, FormError, ValueState } from "../../../states/mobx-form";
import { OrangeryToast, OrangeryTextField } from "../../OrangeryElements";
import OrangeryProfileImage from "../../OrangeryElements/OrangeryProfileImage";
import ChangeableAvatar from "./ChangeableAvatar";

// queries & backend
import { IUser, useUpdateProfile } from "../../../queries/dashboard";

// icons, images & colors
import { Visibility, VisibilityOff } from "@mui/icons-material";

export class ProfileState {
  public uuid;
  public first_name;
  public last_name;
  public email;
  public password;
  public old_password;
  // public image: ValueState<File | string>;
  public image_uuid: ValueState<string>;
  public error = "";

  private profile;

  constructor(profile?: IUser) {
    this.profile = profile;
    if (profile) {
      this.uuid = new ValueState(profile.uuid);
      this.first_name = new ValueState(profile.first_name);
      this.last_name = new ValueState(profile.last_name);
      this.email = new ValueState(profile.email);
      this.password = new ValueState(profile.password ?? "");
      this.old_password = new ValueState(profile.old_password ?? "");
      // this.image = new ValueState<File | string>(profile.image ?? "");
      this.image_uuid = new ValueState<string>(profile.image ?? "");
    } else {
      this.uuid = new ValueState("");
      this.first_name = new ValueState("");
      this.last_name = new ValueState("");
      this.email = new ValueState("");
      this.password = new ValueState("");
      this.old_password = new ValueState("");
      // this.image = new ValueState<File | string>("");
      this.image_uuid = new ValueState<string>("");
    }

    makeAutoObservable(this);
  }

  reset = () => {
    let profile = this.profile;
    if (profile) {
      this.uuid = new ValueState(profile.uuid);
      this.first_name = new ValueState(profile.first_name);
      this.last_name = new ValueState(profile.last_name);
      this.email = new ValueState(profile.email);
      this.password = new ValueState(profile.password ?? "");
      this.old_password = new ValueState(profile.old_password ?? "");
      // this.image = new ValueState<File | string>(profile.image ?? "");
      this.image_uuid = new ValueState<string>(profile.image ?? "");
    } else {
      this.uuid = new ValueState("");
      this.first_name = new ValueState("");
      this.last_name = new ValueState("");
      this.email = new ValueState("");
      this.password = new ValueState("");
      this.old_password = new ValueState("");
      // this.image = new ValueState<File | string>("");
      this.image_uuid = new ValueState<string>("");
    }
  };

  get data() {
    return {
      uuid: this.uuid.value,
      first_name: this.first_name.value,
      last_name: this.last_name.value,
      email: this.email.value,
      password: this.password.value,
      old_password: this.old_password.value,
      image_uuid: this.image_uuid.value,
    };
  }

  clearErrors() {
    this.first_name.clearError();
    this.last_name.clearError();
    this.email.clearError();
    this.password.clearError();
    this.old_password.clearError();
    this.error = "";
  }

  validate() {
    // const isValid = new RegExp(/[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,15}/g).test(
    //   "arulgetsolute@gmail.com"
    // );
    let valid = true;
    this.clearErrors();
    if (!this.first_name.value) {
      this.first_name.error = i18next.t(
        "signupForm.Please fill your first name",
        { ns: "auth" }
      );
      valid = false;
    }
    if (this.first_name.value.length < 2) {
      this.first_name.error = i18next.t("signupForm.Name is too short", {
        ns: "auth",
      });
      valid = false;
    }
    if (!this.last_name.value) {
      this.last_name.error = i18next.t(
        "signupForm.Please fill your last name",
        { ns: "auth" }
      );
      valid = false;
    }
    if (this.last_name.value.length < 2) {
      this.last_name.error = i18next.t("signupForm.Last name is too short", {
        ns: "auth",
      });
      valid = false;
    }
    if (!this.email.value) {
      this.email.error = i18next.t("signupForm.Please fill your email", {
        ns: "auth",
      });
      valid = false;
    }
    if (this.password.value || this.old_password.value) {
      if (!this.password.value) {
        this.password.error = i18next.t(
          "signupForm.Please fill your password",
          { ns: "auth" }
        );
        valid = false;
      }
      if (!this.old_password.value) {
        this.old_password.error = i18next.t(
          "signupForm.Please fill your password",
          { ns: "auth" }
        );
        valid = false;
      }
    }
    // if (this.terms.value === false) {
    //   this.terms.error = i18next.t("signupForm.Please check Terms", { ns: "auth" });
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
    } else if (error.field === "first_name") {
      this.first_name.error = error.error;
    } else if (error.field === "last_name") {
      this.last_name.error = error.error;
    } else if (error.field === "email") {
      this.email.error = error.error;
    } else if (error.field === "password") {
      this.password.error = error.error;
    } else if (error.field === "old_password") {
      this.old_password.error = error.error;
    } else {
      // console.warn(
      //   `the field ${error.field} not found in the field list in ProfileForm.`
      // );
    }
  }
}

export default function ProfileForm({ profile }: { profile?: IUser }) {
  const { office_uuid } = useGlobalState();
  const mutation = useUpdateProfile();
  const state = React.useMemo(() => new ProfileState(profile), [, profile]);
  const { t } = useTranslation("auth");
  const globalState = useGlobalState();

  const [showPassword, setShowPassword] = React.useState(false);
  const [showOldPassword, setShowOldPassword] = React.useState(false);

  const toggleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const toggleClickShowOldPassword = () => {
    setShowOldPassword(!showOldPassword);
  };

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
        OrangeryToast("Profile successfully edited", "success");
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

  return (
    <>
      <Box
        sx={{
          width: "100%",
          backgroundColor: "white",
          borderRadius: "12px",
          boxShadow: "1px 1px 3px #eaeaea",
          padding: 4,
          flexGrow: 1,
        }}
      >
        <Box
          sx={{
            mb: 1,
            mx: "auto",
            my: "auto",
            width: "30%",
            maxWidth: "600px",
            minWidth: "500px",
            "& > * + *": {
              mb: 3,
            },
          }}
        >
          {/* <Observer>
            {() => (
              <ChangeableAvatar
                value={state.image.value ?? ""}
                name={state.first_name.value + " " + state.last_name.value}
                onChange={(file) => (state.image.value = file ?? "")}
                sx={{
                  mx: "auto",
                  mb: 6,
                }}
                disabled={!editMode}
              />
            )}
          </Observer> */}
          <Observer>
            {() => (
              <OrangeryProfileImage
                name={state.first_name.value + " " + state.last_name.value}
                images={[state.image_uuid.value]}
                onAdd={(uuid) => (state.image_uuid.value = uuid)}
                onRemove={(uuid) => (state.image_uuid.value = "")}
                disabled={!editMode}
                sx={{
                  mx: "auto",
                  mb: 6,
                }}
              />
            )}
          </Observer>
          <form onSubmit={handleSubmit}>
            <Observer>
              {() => (
                <>
                  <Grid container spacing={1}>
                    <Grid item xs={12} sm={6}>
                      <OrangeryTextField
                        id="outlined-name"
                        label={t("signupForm.First Name") + ""}
                        type="text"
                        name="first-name"
                        placeholder={t("signupForm.First Name")}
                        fullWidth
                        autoComplete="given-name"
                        value={state.first_name.value}
                        error={!!state.first_name.error}
                        helperText={state.first_name.error}
                        onChange={(e) =>
                          (state.first_name.value = e.target.value)
                        }
                        disabled={!editMode}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <OrangeryTextField
                        id="outlined-lastName"
                        label={t("signupForm.Last Name") + ""}
                        type="text"
                        name="last-name"
                        fullWidth
                        placeholder={t("signupForm.Last Name")}
                        autoComplete="family-name"
                        value={state.last_name.value}
                        error={!!state.last_name.error}
                        helperText={state.last_name.error}
                        onChange={(e) =>
                          (state.last_name.value = e.target.value)
                        }
                        disabled={!editMode}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <OrangeryTextField
                        id="outlined-email"
                        label={t("signupForm.Email") + ""}
                        type="email"
                        name="email"
                        autoComplete="email"
                        fullWidth
                        placeholder={t("signupForm.Email")}
                        value={state.email.value}
                        error={!!state.email.error}
                        helperText={state.email.error}
                        onChange={(e) => (state.email.value = e.target.value)}
                        disabled={!editMode}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <Grid item xs={12} md={10}>
                        <Typography
                          variant="h5"
                          sx={{
                            color: "grey[200]",
                            mb: 1,
                            fontSize: {
                              xs: 12,
                              sm: 14,
                              md: 14,
                            },
                          }}
                        >
                          {t("signupForm.password hint")}
                        </Typography>
                      </Grid>
                      <OrangeryTextField
                        label={"New password"}
                        id="outlined-password"
                        type={showPassword ? "text" : "password"}
                        name="password"
                        autoComplete="new-password"
                        fullWidth
                        placeholder={"To change, enter password"}
                        value={state.password.value}
                        error={!!state.password.error}
                        helperText={state.password.error}
                        onChange={(e) =>
                          (state.password.value = e.target.value)
                        }
                        disabled={!editMode}
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position="end">
                              <IconButton
                                aria-label="toggle password visibility"
                                onClick={toggleClickShowPassword}
                                edge="end"
                                sx={{
                                  mr: "-5px",
                                }}
                              >
                                {showPassword ? (
                                  <Visibility fontSize="small" />
                                ) : (
                                  <VisibilityOff fontSize="small" />
                                )}
                              </IconButton>
                            </InputAdornment>
                          ),
                        }}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <OrangeryTextField
                        label={"Old password" + ""}
                        id="outlined-old-password"
                        type={showOldPassword ? "text" : "password"}
                        name="old_password"
                        autoComplete="old-password"
                        fullWidth
                        placeholder={"To change, enter password"}
                        value={state.old_password.value}
                        error={!!state.old_password.error}
                        helperText={state.old_password.error}
                        onChange={(e) =>
                          (state.old_password.value = e.target.value)
                        }
                        disabled={!editMode}
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position="end">
                              <IconButton
                                aria-label="toggle old password visibility"
                                onClick={toggleClickShowOldPassword}
                                edge="end"
                                sx={{
                                  mr: "-5px",
                                }}
                              >
                                {showOldPassword ? (
                                  <Visibility fontSize="small" />
                                ) : (
                                  <VisibilityOff fontSize="small" />
                                )}
                              </IconButton>
                            </InputAdornment>
                          ),
                        }}
                      />
                    </Grid>
                  </Grid>
                </>
              )}
            </Observer>

            <FormErrorMessage state={state} />

            <Box
              sx={{
                width: "100%",
                mt: 2,
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
                // aria-label="add"
                onClick={handleSubmit}
                sx={{
                  flexGrow: 1,
                  flexShrink: 1,
                  height: 55,
                }}
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
          </form>
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
