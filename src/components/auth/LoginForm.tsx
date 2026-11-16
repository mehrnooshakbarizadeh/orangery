// contexts & globals
import { useGlobalState } from "../../Contexts & Globals/GlobalContext";
import i18next from "i18next";
import { useTranslation } from "react-i18next";
import AuthPageLayout from "./AuthPageLayout";

// react & next
import React from "react";
import { useRouter } from "next/router";

// external dependencies
import {
  Alert,
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  Grid,
  IconButton,
  InputAdornment,
  Link,
  Typography,
} from "@mui/material";
import { makeAutoObservable } from "mobx";
import { Observer } from "mobx-react-lite";

// orangery elements & internal dependencies
import { FieldError, FormError, ValueState } from "../../states/mobx-form";
import { OrangeryTextField } from "../OrangeryElements";

// queries & backend
import { useLoginMutation } from "../../queries/auth";

// icons, images & colors
import { Visibility, VisibilityOff } from "@mui/icons-material";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

export class LoginFormState {
  public email = new ValueState<string>("");
  public password = new ValueState<string>("");
  public error = "";

  constructor() {
    makeAutoObservable(this);
  }

  get data() {
    return {
      email: this.email.value,
      password: this.password.value,
    };
  }

  clearErrors() {
    this.email.error = "";
    this.password.error = "";
  }

  validate() {
    let valid = true;
    this.clearErrors();
    if (!this.email.value) {
      this.email.error = i18next.t("loginForm.Please fill your email", {
        ns: "auth",
      });
      valid = false;
    }
    if (!this.password.value) {
      this.password.error = i18next.t("loginForm.Please fill your password", {
        ns: "auth",
      });
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
    if (error.field === "email") {
      this.email.error = error.error;
    }
    if (error.field === "password") {
      this.password.error = error.error;
    }
  }
}

export default function LoginForm() {
  const globalState = useGlobalState();
  const router = useRouter();
  const { t } = useTranslation("auth");
  const state = React.useMemo(() => new LoginFormState(), []);
  const mutation = useLoginMutation();

  const [showPassword, setShowPassword] = React.useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!state.validate()) {
      return;
    }
    try {
      localStorage.clear()
      await mutation.mutateAsync(state.data);
      globalState.set_logedIn(true);
      router.push("/dashboard");
    } catch (err: any) {
      state.setupErrors(err);
    }
  }

  const toggleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleResetPassword = () => {
    router.push("/auth/password_reset");
  };

  let rememberMeLabel = t("loginForm.Remember me");

  return (
    <AuthPageLayout
      title={t("loginForm.Login")}
      image={`${process.env.NEXT_PUBLIC_BASE_PATH}/assets/Login.svg`}
      bottomLabel={
        <>
          {t("loginForm.Don't have an account?")}&nbsp;
          <Link
            href={`${process.env.NEXT_PUBLIC_BASE_PATH}/auth/signup`}
            sx={{
              textDecoration: "none",
              color: "blue",
            }}
          >
            {t("loginForm.Sign Up")}
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit}>
        <Observer>
          {() => (
            <>
              <Grid
                container
                spacing={1}
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "strech",
                }}
              >
                <Grid item xs={12} sm={12} md={12} lg={12} sx={{ mb: 2 }}>
                  <OrangeryTextField
                    id="outlined-email"
                    label={t("loginForm.Email") + " *"}
                    type="email"
                    name="email"
                    autoComplete="email"
                    fullWidth
                    value={state.email.value}
                    error={!!state.email.error}
                    helperText={state.email.error}
                    onChange={(e) => (state.email.value = e.target.value)}
                  />
                </Grid>
                <Grid item xs={12} sm={12} md={12} lg={12}>
                  <OrangeryTextField
                    label={t("loginForm.Password") + " *"}
                    id="outlined-password"
                    type={showPassword ? "text" : "password"}
                    name="password"
                    autoComplete="current-password"
                    fullWidth
                    placeholder={t("loginForm.at least 8 characters")}
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
                              mr: "5px",
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
                <Grid item sx={{ alignSelf: "flex-end" }}>
                  <Button
                    onClick={handleResetPassword}
                    disableRipple
                    sx={{
                      whiteSpace: "nowrap",
                      color: "blue",
                      fontSize: {
                        xs: 20,
                      },
                      p: 0,
                      bgcolor: "transparent",
                      "&:hover": {
                        bgcolor: "transparent",
                      },
                      "&:focus": {
                        bgcolor: "transparent",
                      },
                    }}
                  >
                    {t("loginForm.Forgot Password?")}
                  </Button>
                </Grid>
              </Grid>
            </>
          )}
        </Observer>

        <FormErrorMessage state={state} />

        <Box
          sx={{
            mt: "100px",
          }}
        >
          <Grid
            container
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
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
              <FormControlLabel
                control={
                  <Checkbox defaultChecked color="primary" size="small" />
                }
                sx={{
                  alignSelf: "flex-end",
                  fontSize: "17px",
                  "& .MuiTypography-root": {
                    whiteSpace: "nowrap",
                  },
                }}
                label={rememberMeLabel}
              />
              <Button
                type="submit"
                variant="contained"
                // color= "primary"
                disabled={mutation.isLoading}
                startIcon={
                  <ArrowForwardIcon
                    fontSize="large"
                    sx={{ visibility: "hidden" }}
                  />
                }
                endIcon={<ArrowForwardIcon fontSize="large" />}
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  fontSize: "20px",
                  py: 2,
                  px: 4,
                  whiteSpace: "nowrap",
                  "&:disabled": {
                    backgroundColor: "grey",
                  },
                }}
              >
                {t("loginForm.Log in")}
              </Button>
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
