// contexts & globals
import { useTranslation } from "react-i18next";
import { useGlobalState } from "../../Contexts & Globals/GlobalContext";
import i18next from "i18next";
import AuthPageLayout from "./AuthPageLayout";

// react & next
import { useRouter } from "next/router";
import React, { useEffect } from "react";

// external dependencies
import { Box, Button, Grid, IconButton, InputAdornment, Link, Typography } from "@mui/material";
import { makeAutoObservable } from "mobx";
import { Observer } from "mobx-react-lite";

// orangery elements & internal dependencies
import { FieldError, FormError, ValueState } from "../../states/mobx-form";
import { OrangeryTextField } from "../OrangeryElements";

// queries & backend
import { useSignup } from "../../queries/auth";

// icons, images & colors
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { Visibility, VisibilityOff } from "@mui/icons-material";

export class SignupFormState {
  public first_name = new ValueState<string>("");
  public last_name = new ValueState<string>("");
  public email = new ValueState<string>("");
  public password = new ValueState<string>("");
  public terms = new ValueState<boolean>(true);
  public error = "";

  constructor() {
    makeAutoObservable(this);
  }

  get data() {
    return {
      first_name: this.first_name.value,
      last_name: this.last_name.value,
      email: this.email.value,
      password: this.password.value,
    };
  }

  clearErrors() {
    this.first_name.error = "";
    this.last_name.error = "";
    this.email.error = "";
    this.password.error = "";
    this.terms.error = "";
  }

  get passwordError() {
    if (this.password.value === "" || this.password.value.length < 8)
      return i18next.t("password.Your password length should be at least 8 characters", {
        ns: "auth",
      });

    var matchedCase = "";
    // matchedCase = "[$@$!%*#?&]";  // Special Charector
    // if (!new RegExp(matchedCase).test(this.password.value)) {

    // }

    matchedCase = "[A-Z]"; // Uppercase Alpabates
    if (!new RegExp(matchedCase).test(this.password.value))
      return i18next.t("password.Please use at least one capital letter", { ns: "auth" });

    matchedCase = "[0-9]"; // Numbers
    if (!new RegExp(matchedCase).test(this.password.value))
      return i18next.t("password.Please use at least one number", { ns: "auth" });

    matchedCase = "[a-z]"; // Lowercase Alphabates
    if (!new RegExp(matchedCase).test(this.password.value))
      return i18next.t("password.Please use at least one lower case letter", { ns: "auth" });

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
    // const isValid = new RegExp(/[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,15}/g).test(
    //   "arulgetsolute@gmail.com"
    // );
    let valid = true;
    this.clearErrors();
    if (!this.first_name.value) {
      this.first_name.error = i18next.t("signupForm.Please fill your first name", { ns: "auth" });
      valid = false;
    }
    if (this.first_name.value.length < 2) {
      this.first_name.error = i18next.t("signupForm.Name is too short", {
        ns: "auth",
      });
      valid = false;
    }
    if (!this.last_name.value) {
      this.last_name.error = i18next.t("signupForm.Please fill your last name", { ns: "auth" });
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

    if (!this.password.value) {
      this.password.error = i18next.t("signupForm.Please fill your password", { ns: "auth" });
      valid = false;
    }

    if (this.password.value && this.passwordError) {
      this.password.error = this.passwordError;
      valid = false;
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
    }
    if (error.field === "first_name") {
      this.first_name.error = error.error;
    }
    if (error.field === "last_name") {
      this.last_name.error = error.error;
    }
    if (error.field === "email") {
      this.email.error = error.error;
    }
    if (error.field === "password") {
      this.password.error = error.error;
    }
    if (error.field === "terms") {
      this.terms.error = error.error;
    }
  }
}

export default function SignupForm() {
  const globalState = useGlobalState();
  const router = useRouter();
  const { t } = useTranslation("auth");
  const state = React.useMemo(() => new SignupFormState(), []);
  const mutation = useSignup();

  const [showPassword, setShowPassword] = React.useState(false);

  // useEffect(() => {
  //   localStorage.setItem("first_name", state.data.first_name);
  //   localStorage.setItem("last_name", state.data.last_name);
  //   localStorage.setItem("email", state.data.email);
  //   localStorage.setItem("password", state.data.password);
  // }, [
  //   state.data.first_name,
  //   state.data.last_name,
  //   state.data.email,
  //   state.data.password,
  // ]);

  React.useEffect(() => {
    const queryString = window.location.search;

    const urlParams = new URLSearchParams(queryString);

    if (urlParams.get("email")) {
      state.email.value = urlParams.get("email") ?? "";
    }
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!state.validate()) {
      return;
    }
    try {
      localStorage.clear();
      await mutation.mutateAsync(state.data);

      try {
        if (window)
          // @ts-ignore
          window["handleGlobalSignup"]();
      } catch (err: any) {
        console.warn({ err });
        // state.setupErrors(err);
      }

      globalState.set_registered(true);
      router.push("/auth/company_information"); ////////!!!!!!!!
    } catch (err: any) {
      state.setupErrors(err);
    }
  }

  const toggleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <AuthPageLayout
      title={t("signupForm.Create Your Account")}
      image={`${process.env.NEXT_PUBLIC_BASE_PATH}/assets/Register.svg`}
      bottomLabel={
        <>
          {t("signupForm.Already a member?")}&nbsp;
          <Link
            href={`${process.env.NEXT_PUBLIC_BASE_PATH}/auth/login`}
            sx={{
              textDecoration: "none",
              color: "blue",
            }}
          >
            Login
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit}>
        <Observer>
          {() => (
            <>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <OrangeryTextField
                    id="outlined-name"
                    label={t("signupForm.First Name") + " *"}
                    type="text"
                    name="first-name"
                    fullWidth
                    autoComplete="given-name"
                    value={state.first_name.value}
                    error={!!state.first_name.error}
                    helperText={state.first_name.error}
                    onChange={(e) => (state.first_name.value = e.target.value)}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <OrangeryTextField
                    id="outlined-lastName"
                    label={t("signupForm.Last Name") + " *"}
                    type="text"
                    name="last-name"
                    fullWidth
                    autoComplete="family-name"
                    value={state.last_name.value}
                    error={!!state.last_name.error}
                    helperText={state.last_name.error}
                    onChange={(e) => (state.last_name.value = e.target.value)}
                  />
                </Grid>
                <Grid item xs={12}>
                  <OrangeryTextField
                    id="outlined-email"
                    label={t("signupForm.Email") + " *"}
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
                <Grid item xs={12}>
                  <OrangeryTextField
                    label={t("signupForm.Password") + " *"}
                    id="outlined-password"
                    type={showPassword ? "text" : "password"}
                    name="password"
                    autoComplete="new-password"
                    fullWidth
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
                  <Grid item xs={12} md={10}>
                    <Typography
                      variant="h5"
                      sx={{
                        color: "grey[200]",
                        mt: 1,
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
                </Grid>
              </Grid>
            </>
          )}
        </Observer>

        <FormErrorMessage state={state} />

        <Observer>
          {() => (
            <Box
              sx={{
                mt: "20px",
              }}
            >
              <Typography
                sx={{
                  mb: 1,
                  fontSize: {
                    xs: 14,
                    sm: 18,
                    md: 18,
                  },
                }}
              >
                {t("signupForm.By Clicking Next, you will")}:
              </Typography>

              <Grid
                container
                spacing={2}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <Grid item xs={12} sm={12} md={8}>
                  {/* <FormGroup>
                    <FormControlLabel
                      control={<Checkbox
                        size="small"
                        defaultChecked
                        sx={{
                          mt: 0
                        }}
                      />
                      }
                      label={ */}
                  <Typography
                    variant="h5"
                    sx={{
                      fontSize: 15,
                    }}
                  >
                    {t("signupForm.Orangery tips")}
                  </Typography>
                  {/* }
                    /> */}
                  <Typography
                    variant="h5"
                    sx={{
                      fontSize: 15,
                      mt: 1.5,
                    }}
                  >
                    {t("signupForm.And, you agree to our")}{" "}
                    <Link
                      href="https://orangeryos.de/agb.html"
                      sx={{ textDecoration: "none", color: "blue" }}
                    >
                      {t("signupForm.Terms of Use")}
                    </Link>{" "}
                    {t("signupForm.and")}{" "}
                    <Link
                      href="https://orangeryos.de/privacy-policy.html"
                      sx={{ textDecoration: "none", color: "blue" }}
                    >
                      {t("signupForm.Privacy Policy")}
                    </Link>
                  </Typography>
                  {/* 
                    <Typography sx={{ color: "red", fontSize: 12, ml: 3 }}>
                      {state.terms.error}
                    </Typography>
                  </FormGroup> */}
                </Grid>
                <Grid
                  item
                  xs={12}
                  sm={12}
                  md={4}
                  sx={{
                    display: "flex",
                    justifyContent: "flex-end",
                    alignItems: "start",
                    mb: "auto",
                  }}
                >
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    disabled={mutation.isLoading}
                    endIcon={<ArrowForwardIcon fontSize="large" sx={{ ml: 2 }} />}
                    sx={{
                      py: 2,
                      px: 4,
                      width: 179,
                      height: 70,
                      fontSize: 22,
                      fontWeight: 400,
                    }}
                  >
                    {t("signupForm.Next")}
                  </Button>
                </Grid>
              </Grid>
            </Box>
          )}
        </Observer>
      </form>

      {/* <!-- Event snippet for Registrierung conversion page --> */}
      <script
        dangerouslySetInnerHTML={{
          __html: `
          function handleGlobalSignup() {
            gtag('event', 'conversion', {'send_to': 'AW-615501991/f_L6COaH3ckDEKehv6UC'});
          }
          `,
        }}
      />
    </AuthPageLayout>
  );
}

function FormErrorMessage({ state }: { state: { error: string } }) {
  return <Observer>{() => <>{state.error && <div>{state.error}</div>}</>}</Observer>;
}
