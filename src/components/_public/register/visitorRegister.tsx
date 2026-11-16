import { Box, Button, TextField, Typography } from "@mui/material";
import { makeAutoObservable } from "mobx";
import { useRouter } from "next/router";
import OrangeryOsLogo from "../../../assets/svg/orangeryOsLogo/orangeryOSLogo.svg";
import Vector from "../../../assets/svg/registerVisitor.svg";
import { FieldError, FormError, ValueState } from "../../../states/mobx-form";
import { OrangeryTextField } from "../../OrangeryElements";
import UserIcon from "../../../assets/svg/user.svg";
import EmailIcon from "../../../assets/svg/email.svg";
import CalenderIcon from "../../../assets/svg/calender.svg";
import SuccessCircleTikIcon from "../../../assets/svg/successCircleTik.svg";
import IIcon from "../../../assets/svg/i.svg";
import React from "react";
import { Observer } from "mobx-react-lite";
import { DateTimePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import { AddToCalendarButton } from "add-to-calendar-button-react";
import {
  IRegisterVisitorResult,
  usePostVisitor,
} from "../../../queries/registerVisitor";
import { useOffices } from "../../../queries/office";
import Link from "next/link";

export class RegisterVisitorState {
  public uuid;
  public visitor_name;
  public visitor_email;
  public host_uuid;
  public arrival;
  public public_note;
  public office_uuid;
  public error = "";

  public result: IRegisterVisitorResult | null = null;

  constructor(office_uuid: string, host_uuid: string) {
    this.office_uuid = new ValueState(office_uuid);
    this.uuid = new ValueState("");
    this.visitor_name = new ValueState("");
    this.visitor_email = new ValueState("");
    this.host_uuid = new ValueState(host_uuid);
    this.arrival = new ValueState(new Date());
    this.public_note = new ValueState("");

    makeAutoObservable(this);
  }

  get data() {
    let arrival = new Date(this.arrival.value);
    let formattedArrival = `${arrival.getFullYear()}-${
      arrival.getMonth() + 1
    }-${arrival.getDate()} ${arrival.getHours()}:${arrival.getMinutes()}`;
    return {
      uuid: this.uuid.value,
      visitor_name: this.visitor_name.value,
      visitor_email: this.visitor_email.value,
      host_uuid: this.host_uuid.value,
      arrival: formattedArrival,
      public_note: this.public_note.value,
      office_uuid: this.office_uuid.value,
    };
  }

  setResult(value: IRegisterVisitorResult) {
    this.result = value;
  }

  clearErrors() {
    this.visitor_name.clearError();
    this.visitor_email.clearError();
    this.host_uuid.clearError();
    this.arrival.clearError();
    this.public_note.clearError();
    this.error = "";
  }

  validate() {
    let valid = true;
    this.clearErrors();
    if (!this.visitor_name.value) {
      this.visitor_name.error = "Please fill your desk name";
      valid = false;
    }
    if (!this.arrival.value) {
      this.arrival.error = "Please select your arrival time";
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
    } else if (error.field === "visitor_name") {
      this.visitor_name.error = error.error;
    } else if (error.field === "visitor_email") {
      this.visitor_email.error = error.error;
    } else if (error.field === "arrival") {
      this.arrival.error = error.error;
    } else {
      // console.warn(
      //   `the field ${error.field} not found in the field list in DeskForm.`
      // );
    }
  }
}

export default function VisitorRegister() {
  const query = useRouter();
  const office_uuid = query.query.office_uuid?.toString() || "";
  const host_uuid = query.query.host_uuid?.toString() || "";
  const office_name = query.query.o?.toString() || "";
  const user_name = query.query.u?.toString() || "";
  const state = React.useMemo(
    () => new RegisterVisitorState(office_uuid, host_uuid),
    [office_uuid, host_uuid]
  );
  return (
    <>
      <Box sx={{ p: 6 }}>
        <Header />
        <Observer>
          {() => (
            <HandleRegisterForm
              state={state}
              current_office={office_name}
              user_name={user_name}
            />
          )}
        </Observer>
      </Box>
    </>
  );
}
const Header = () => {
  return (
    <Box
      sx={{
        mb: "13.25rem",
        "&.orangeryOs-logo": {
          width: "13.125rem",
          height: "2.25rem",
        },
      }}
    >
      <OrangeryOsLogo className="orangeryOs-logo" />
    </Box>
  );
};

const HandleRegisterForm = ({
  state,
  current_office,
  user_name,
}: {
  state: RegisterVisitorState;
  current_office: string;
  user_name: string;
}) => {
  const mutation = usePostVisitor();
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!state.validate()) {
      return;
    }
    try {
      const result = await mutation.mutateAsync(state.data);
      state.setResult(result);
    } catch (err: any) {
      state.setupErrors(err);
    }
  }
  const mutationIsLoading = mutation.isLoading;

  return (
    <form onSubmit={handleSubmit}>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 2,
          "& .svg": { flex: 1 },
        }}
      >
        <Box
          sx={{
            flexGrow: 0,
            flexBasis: "45%",
            "& .text-field": { width: "35rem" },
            "& .svg-icon": { width: "1.12rem", height: "1.12rem" },
          }}
        >
          <Typography fontSize={34} fontWeight={600}>
            You are invited by&nbsp;
            {user_name.charAt(0).toUpperCase() + user_name.slice(1)}
            &nbsp;to register as a visitor to,&nbsp;
            {current_office.charAt(0).toUpperCase() + current_office.slice(1)}
          </Typography>

          <Observer>
            {() => (
              <>
                {!state.result && (
                  <RegisterForm state={state} isLoading={mutationIsLoading} />
                )}
                {state.result && (
                  <IsSuccess
                    result={state.result}
                    current_office={current_office}
                  />
                )}
              </>
            )}
          </Observer>
        </Box>

        <Vector className="svg" />
      </Box>
    </form>
  );
};

function IsSuccess({
  result,
  current_office,
}: {
  result: IRegisterVisitorResult;
  current_office: string;
}) {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 2,
          mb: 4,
          mt: 8,
        }}
      >
        <SuccessCircleTikIcon />
        <Typography fontSize={24} fontWeight={600} color="#42B863">
          Success! Your registration has been completed.
          <br />
          Your visit details is sent to your email.
        </Typography>
      </Box>
      <Observer>
        {() => <Overview result={result} current_office={current_office} />}
      </Observer>
      <Typography fontSize={18} fontWeight={600}>
        Download Orangery App
      </Typography>
      <DownloadApp />
    </Box>
  );
}

function Overview({
  result,
  current_office,
}: {
  result: IRegisterVisitorResult;
  current_office: string;
}) {
  const arrivalDate = new Date(result.arrival).toISOString();
  const arrivalTime = new Date(result.arrival).toLocaleTimeString();

  return (
    <>
      <Box
        sx={{
          backgroundColor: "#F9F9FA",
          borderTop: "1px solid #C9CCD2",
          borderBottom: "1px solid #C9CCD2",
          display: "flex",
          flexDirection: "column",
          mb: 3,
          gap: 2.4,
          pl: 2.5,
          py: 3.5,
          "& .i-icon": { width: "1.5rem", height: "1.5rem", color: "#A5AAB4" },
          "& .gray-font": { fontSize: 18, fontWeight: 600, color: "#A5AAB4" },
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <IIcon className="i-icon" />
          <Typography className="gray-font">Your Visit Overview</Typography>
        </Box>

        <Box
          sx={{
            borderLeft: "1px solid #2B2E33",
            "& .date-format": {
              color: "#2B2E33",
              fontSize: 24,
              fontWeight: 600,
            },
          }}
        >
          <Observer>
            {() => (
              <Box sx={{ ml: 2 }}>
                <Typography fontSize={24} fontWeight={700} color="#2B2E33">
                  {result.visitor.name}
                </Typography>
                <Typography className="gray-font">
                  {result.visitor.email}
                </Typography>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    mt: 2.5,
                  }}
                >
                  <Typography fontSize={24} fontWeight={600} color="#A5AAB4">
                    Arrives at{" "}
                  </Typography>
                  <span className="date-format">
                    {new Date(result.arrival).toLocaleString("en-EN", {
                      month: "long",
                      year: "numeric",
                      day: "numeric",
                      hour: "numeric",
                      minute: "numeric",
                    })}
                  </span>

                  <AddToCalendarButton
                    name={`A visit to ${current_office}`}
                    startDate={arrivalDate}
                    startTime={arrivalTime}
                    options={["Google"]}
                  ></AddToCalendarButton>
                </Box>
              </Box>
            )}
          </Observer>
        </Box>
      </Box>
    </>
  );
}

const RegisterForm = ({
  state,
  isLoading,
}: {
  state: RegisterVisitorState;
  isLoading: boolean;
}) => {
  return (
    <>
      <Typography fontSize={24} fontWeight={600} color="#C9CCD2">
        Please add your full name, email, and arrival date and time to register.
      </Typography>
      <Box className="text-field" sx={{ mt: 5 }}>
        <Observer>
          {() => (
            <OrangeryTextField
              label="FULL NAME"
              name="visitor_name"
              startIcon={<UserIcon />}
              placeholder="Enter Your Name And Surname"
              error={!!state.visitor_name.error}
              value={state.visitor_name.value}
              helperText={state.visitor_name.error}
              onChange={(e: any) => (state.visitor_name.value = e.target.value)}
            />
          )}
        </Observer>
      </Box>

      <Box className="text-field">
        <Observer>
          {() => (
            <OrangeryTextField
              label="EMAIL"
              name="visitor_email"
              startIcon={<EmailIcon className="svg-icon" />}
              placeholder="Enter Your Email"
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

      <Box className="text-field">
        <Observer>
          {() => (
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DateTimePicker
                disablePast
                showToolbar
                components={{
                  OpenPickerIcon: EventAvailableIcon,
                }}
                label="ARRIVAL DATE AND TIME"
                value={state.arrival.value}
                onChange={(newValue: any) => {
                  state.arrival.value = newValue;
                }}
                renderInput={(props) => <TextField {...props} fullWidth />}
              />
            </LocalizationProvider>
          )}
        </Observer>
        <Button
          variant="contained"
          type="submit"
          color="primary"
          disabled={isLoading}
          sx={{
            width: "35rem",
            height: 55,
            fontSize: 20,
            mt: 3,
            color: "#fff",
          }}
        >
          Register
        </Button>
      </Box>
    </>
  );
};

const DownloadApp = () => {
  return (
    <>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1,
          py: 1,
          "& .app": { cursor: "pointer" },
        }}
      >
        <Link href="https://play.google.com/store/apps/details?id=com.orangeryos">
          <img
            src={`${process.env.NEXT_PUBLIC_BASE_PATH}/assets/png/googlePlay.png`}
            alt="Google play"
            className="app"
          />
        </Link>
        <Link href="https://apps.apple.com/tr/app/orangeryos/id1615709484">
          <img
            src={`${process.env.NEXT_PUBLIC_BASE_PATH}/assets/png/appleStore.png`}
            alt="Apple store"
            className="app"
          />
        </Link>
      </Box>
    </>
  );
};
