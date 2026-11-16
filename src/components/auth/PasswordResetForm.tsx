// contexts & globals
import { useTranslation } from "react-i18next";
import { useGlobalState } from "../../Contexts & Globals/GlobalContext";
import i18next from "i18next";
import AuthPageLayout from "./AuthPageLayout";

// react & next
import { useRouter } from "next/router";
import React from "react";

// external dependencies
import {
  Box,
  Button,
  Grid,
  Link,
} from "@mui/material";
import { makeAutoObservable } from "mobx";
import { Observer } from "mobx-react-lite";
import { FieldError, FormError, ValueState } from "../../states/mobx-form";

// orangery elements & internal dependencies
import {
  OrangeryToast,
  OrangeryTextField
} from "../OrangeryElements";

// queries & backend
import { usePasswordReset } from "../../queries/auth";

// icons, images & colors
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

export class PasswordResetFormState {
  public email = new ValueState<string>("");
  public error = "";

  constructor() {
    makeAutoObservable(this);
  }

  get data() {
    return {
      email: this.email.value,
    };
  }

  clearErrors() {
    this.email.error = "";
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
  }
}

export default function PasswordResetForm() {
  const globalState = useGlobalState();
  const router = useRouter();
  const { t } = useTranslation("auth");
  const state = React.useMemo(() => new PasswordResetFormState(), []);
  const mutation = usePasswordReset();
  const [submitted, setSubmitted] = React.useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!state.validate()) {
      return;
    }
    try {
      await mutation.mutateAsync(state.data);
      OrangeryToast(
        t("passwordResetForm.Password request sent successfully"),
        "success"
      );
      setSubmitted(true);
    } catch (err: any) {
      state.setupErrors(err);
    }
  }

  return (
    <AuthPageLayout
      title={
        submitted
          ? t("passwordResetForm.Check your email")
          : t("passwordResetForm.Forgot password?")
      }
      subtitle={
        submitted
          ? t("passwordResetForm.We sent a password reset link to you")
          : t("passwordResetForm.Subtitle")
      }
      secondSubtitle={
        submitted ? (
          <>
            {t("passwordResetForm.Didn’t receive the email?")}&nbsp;
            <Link
              onClick={handleSubmit}
              href="#"
              sx={{
                textDecoration: "none",
                color: "blue",
              }}
            >
              {t("passwordResetForm.Click to resend")}
            </Link>
          </>
        ) : (
          ""
        )
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
              {t("passwordResetForm.Back to login")}
            </Link>
          </Box>
          <Box sx={{ mt: "10px" }}>
            {t("passwordResetForm.Don't have an account?")}&nbsp;
            <Link
              href={`${process.env.NEXT_PUBLIC_BASE_PATH}/auth/signup`}
              sx={{
                textDecoration: "none",
                color: "blue",
              }}
            >
              {t("passwordResetForm.Sign Up")}
            </Link>
          </Box>
        </Grid>
      }
    >
      {submitted || (
        <form onSubmit={handleSubmit}>
          <Observer>
            {() => (
              <>
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <OrangeryTextField
                      id="outlined-email"
                      label={t("passwordResetForm.Email") + " *"}
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
                  {t("passwordResetForm.Send link")}
                </Button>
              </Grid>
            </Grid>
          </Box>
        </form>
      )}
    </AuthPageLayout>
  );
}

function FormErrorMessage({ state }: { state: { error: string } }) {
  return (
    <Observer>{() => <>{state.error && <div>{state.error}</div>}</>}</Observer>
  );
}
