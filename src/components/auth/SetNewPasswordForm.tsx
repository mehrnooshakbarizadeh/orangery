// contexts & globals
import i18next from "i18next";
import AuthPageLayout from "./AuthPageLayout";
import { useTranslation } from "react-i18next";
import { useGlobalState } from "../../Contexts & Globals/GlobalContext";

// react & next
import { useRouter } from "next/router";
import React from "react";

// external dependencies
import {
  Box,
  Button,
  Grid,
  IconButton,
  InputAdornment,
  Link,
} from "@mui/material";
import { makeAutoObservable } from "mobx";
import { Observer } from "mobx-react-lite";

// orangery elements & internal dependencies
import { FieldError, FormError, ValueState } from "../../states/mobx-form";
import {
  OrangeryToast,
  OrangeryTextField
} from "../OrangeryElements";

// queries & backend
import { useNewPassword } from "../../queries/auth";

// icons, images & colors
import { Visibility, VisibilityOff } from "@mui/icons-material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

export class SetNewPasswordFormState {
  public password = new ValueState<string>("");
  public confirmPassword = new ValueState<string>("");
  public session_uuid = new ValueState<string>("");
  public error = "";

  constructor() {
    makeAutoObservable(this);
  }

  get data() {
    return {
      password: this.password.value,
      session_uuid: this.session_uuid.value,
    };
  }

  clearErrors() {
    this.password.error = "";
    this.confirmPassword.error = "";
  }

  get passwordError() {
    if (this.password.value === "" || this.password.value.length < 8)
      return i18next.t(
        "passsword.Your password length should be at least 8 characters",
        { ns: "auth" }
      );

    var matchedCase = "";
    // matchedCase = "[$@$!%*#?&]";  // Special Charector
    // if (!new RegExp(matchedCase).test(this.password.value)) {

    // }

    matchedCase = "[A-Z]";        // Uppercase Alpabates
    if (!new RegExp(matchedCase).test(this.password.value))
      return i18next.t(
        "passsword.Please use at least one capital letter",
        { ns: "auth" }
      );

    matchedCase = "[0-9]";        // Numbers
    if (!new RegExp(matchedCase).test(this.password.value))
      return i18next.t(
        "passsword.Please use at least one number",
        { ns: "auth" }
      );

    matchedCase = "[a-z]";        // Lowercase Alphabates
    if (!new RegExp(matchedCase).test(this.password.value))
      return i18next.t(
        "password.Please use at least one lower case letter",
        { ns: "auth" }
      );

    // // Check the conditions
    // var ctr = 0;
    // for (var i = 0; i < matchedCase.length; i++) {
    //   if (!new RegExp(matchedCase[i]).test(password)) {
    //     ctr++;
    //   }
    // }

    return "";
  }

  validate() {
    let valid = true;
    this.clearErrors();

    if (!this.password.value) {
      this.password.error = i18next.t(
        "setNewPasswordForm.Please fill your new password",
        { ns: "auth" }
      );
      valid = false;
    }

    if (this.password.value !== this.confirmPassword.value) {
      this.confirmPassword.error = i18next.t(
        "setNewPasswordForm.Confirm password doesn't match New password",
        { ns: "auth" }
      );
      valid = false;
    }

    if (this.password.value && this.passwordError) {
      this.password.error = this.passwordError
      valid = false;
    }

    if (!this.confirmPassword.value) {
      this.confirmPassword.error = i18next.t(
        "setNewPasswordForm.Please fill and confirm your new password",
        { ns: "auth" }
      );
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
    }
    if (error.field === "password") {
      this.password.error = error.error;
    }
    if (error.field === "confirmpassword") {
      this.confirmPassword.error = error.error;
    }
  }
}

export default function SetNewPasswordForm() {
  const globalState = useGlobalState();
  const router = useRouter();
  const { t } = useTranslation("auth");
  const state = React.useMemo(() => new SetNewPasswordFormState(), []);
  const mutation = useNewPassword();
  const { query } = useRouter();
  const [submitted, setSubmitted] = React.useState(false);

  // React.useEffect(() => {
  //   if (query.session) {
  //     if (typeof query.session === "string") {
  //       setSessionUuid(query.session);
  //     }
  //   }
  // }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!state.validate()) {
      return;
    }
    try {
      if (query.session) {
        if (typeof query.session === "string") {
          state.session_uuid.value = query.session;
        }
      }

      await mutation.mutateAsync(state.data);
      OrangeryToast(
        t("setNewPasswordForm.Successfully set new password for user"),
        "success"
      );
      setSubmitted(true);
    } catch (err: any) {
      state.setupErrors(err);
    }
  }

  const handleLogin = () => {
    router.push(`/auth/login`);
  };

  const [showPassword, setShowPassword] = React.useState(false);
  const toggleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);
  const toggleClickShowConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  return (
    <AuthPageLayout
      title={
        submitted
          ? t("setNewPasswordForm.Password reset")
          : t("setNewPasswordForm.Set new password")
      }
      subtitle={
        submitted
          ? t("setNewPasswordForm.Subtitle-2")
          : t("setNewPasswordForm.Subtitle")
      }
      image={`${process.env.NEXT_PUBLIC_BASE_PATH}/assets/forgot_password_reset.svg`}
      bottomLabel={
        <Grid
          container
          sx={{
            display: "flex",
            flexDirection: "column",
            alignContent: "stretch",
          }}
        >
          <Box>
            <Link
              href={`${process.env.NEXT_PUBLIC_BASE_PATH}/auth/login`}
              sx={{
                fontSize: "18px",
                textDecoration: "none",
                color: "black",
              }}
            >
              <ArrowBackIcon sx={{ pt: "7px", mr: "5px" }} />
              {t("setNewPasswordForm.Back to login")}
            </Link>
          </Box>
          <Box sx={{ mt: "10px" }}>
            {t("setNewPasswordForm.Don't have an account?")}&nbsp;
            <Link
              href={`${process.env.NEXT_PUBLIC_BASE_PATH}/auth/signup`}
              sx={{
                textDecoration: "none",
                color: "blue",
              }}
            >
              {t("setNewPasswordForm.Sign Up")}
            </Link>
          </Box>
        </Grid>
      }
    >
      <form onSubmit={handleSubmit}>
        <Observer>
          {() => (
            <>
              {submitted || (
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <OrangeryTextField
                      label={t("setNewPasswordForm.Password") + " *"}
                      id="new-password"
                      type={showPassword ? "text" : "password"}
                      name="new-password"
                      autoComplete="new-password"
                      fullWidth
                      placeholder={t(
                        "setNewPasswordForm.at least 8 characters"
                      )}
                      value={state.password.value}
                      error={!!state.password.error}
                      helperText={state.password.error}
                      onChange={(e) => (state.password.value = e.target.value)}
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
                      label={t("setNewPasswordForm.Confirm Password") + " *"}
                      id="confirm-password"
                      type={showConfirmPassword ? "text" : "password"}
                      name="confirm-password"
                      autoComplete="confirm-password"
                      fullWidth
                      placeholder={t(
                        "setNewPasswordForm.at least 8 characters"
                      )}
                      value={state.confirmPassword.value}
                      error={!!state.confirmPassword.error}
                      helperText={state.confirmPassword.error}
                      onChange={(e) =>
                        (state.confirmPassword.value = e.target.value)
                      }
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              aria-label="toggle password visibility"
                              onClick={toggleClickShowConfirmPassword}
                              edge="end"
                              sx={{
                                mr: "-5px",
                              }}
                            >
                              {showConfirmPassword ? (
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
              )}
            </>
          )}
        </Observer>

        <FormErrorMessage state={state} />

        <Box
          sx={{
            mt: submitted ? "0" : "100px",
          }}
        >
          <Grid
            container
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Grid
              item
              xs={12}
              sm={12}
              md={12}
              lg={12}
              sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                pb: 2,
              }}
            >
              {submitted ? (
                <Button
                  onClick={handleLogin}
                  type="button"
                  variant="contained"
                  // color= "primary"
                  disabled={mutation.isLoading}
                  sx={{
                    fontSize: "20px",
                    py: 2,
                    px: 4,
                    whiteSpace: "nowrap",
                    "&:disabled": {
                      backgroundColor: "grey",
                    },
                  }}
                >
                  {t("setNewPasswordForm.Continue")}
                </Button>
              ) : (
                <Button
                  type="submit"
                  variant="contained"
                  // color= "primary"
                  disabled={mutation.isLoading}
                  sx={{
                    fontSize: "20px",
                    py: 2,
                    px: 4,
                    whiteSpace: "nowrap",
                    "&:disabled": {
                      backgroundColor: "grey",
                    },
                  }}
                >
                  {t("setNewPasswordForm.Reset password")}
                </Button>
              )}
            </Grid>
          </Grid>
        </Box>
      </form>
    </AuthPageLayout>
  );
}

function FormErrorMessage({ state }: { state: { error: string } }) {
  return (
    <Observer>{() => <>{state.error && <div>{state.error}</div>}</>}</Observer>
  );
}
