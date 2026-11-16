// contexts & globals
import { useGlobalState } from "../../../../../Contexts & Globals/GlobalContext";

// react & next
import React from "react";

// external dependencies
import {
  Box,
  Button,
  Typography,
} from "@mui/material";
import { makeAutoObservable } from "mobx";
import { Observer } from "mobx-react-lite";

// orangery elements & internal dependencies
import {
  FieldError,
  FormError,
  ValueState,
  ArrayValueState,
} from "../../../../../states/mobx-form";
// import DeleteDoorAccessButton from "./DeleteDoorAccessButton";
import {
  OrangeryToast,
  OrangeryTextField,
  OrangeryCloseButton,
  OrangeryStringArrayAutocomplete,
  OrangeryNavigationContentLoader
} from "../../../../OrangeryElements";

// queries & backend
import {
  useConnect,
  useTest,
  useSlackMutation,
  ISlack
} from "../../../../../queries/apps/slack";
import {
  IApp,
  useAppsMutation
} from "../../../../../queries/apps";

// icons, images & colors
//

export class SlackFormState {
  public webhook;
  public username;
  public events;

  public error = "";

  private slack;

  constructor(
    slack: IApp,
    slackFromGet: ISlack | null
  ) {
    if (slackFromGet) {
      let events = Object.keys(slackFromGet.events).filter((key) => slackFromGet.events[key]).map((key => key))
      this.webhook = new ValueState<string>(slackFromGet.webhook);
      this.username = new ValueState<string>(slackFromGet.username);
      this.events = new ArrayValueState<string>(events);
    }
    else {
      this.webhook = new ValueState<string>("");
      this.username = new ValueState<string>("");
      this.events = new ArrayValueState<string>([]);
    }

    this.slack = slack
    makeAutoObservable(this);
  }

  get data() {
    let events = {} as any;
    this.slack.events?.forEach((event) => {
      events[event] = false
    })

    this.events.values.forEach((v) => {
      events[v.value] = true
    })

    return {
      webhook: this.webhook.value,
      username: this.username.value,
      events: events,
    };
  }

  clearErrors() {
    this.webhook.clearError();
    this.username.clearError();

    this.error = "";
  }

  validate() {
    let valid = true;
    this.clearErrors();
    if (!this.webhook.value) {
      this.webhook.error = "Please enter slack webhook";
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
    } else if (error.field === "webhook") {
      this.webhook.error = error.error;
    } else {
      // console.warn(
      //   `the field ${error.field} not found in the field list in DoorAccessForm.`
      // );
    }
  }
}

export default function SlackForm({
  slack,
  handleClose,
  noCancel,
  editMode,
}: {
  slack: IApp;
  handleClose: () => void;
  noCancel?: any;
  editMode?: boolean;
}) {
  const globalState = useGlobalState()

  const mutation = useConnect();

  const [slackFromGet, setSlackFromGet] = React.useState<ISlack | null>(null)
  const state = React.useMemo(
    () => new SlackFormState(slack, slackFromGet),
    [slack, slackFromGet]
  );

  const slackMutation = useSlackMutation();
  async function updateSlackFromGet() {
    if (editMode) {
      let tempSlack = await slackMutation.mutateAsync()
      setSlackFromGet(tempSlack)
    }
  }
  React.useEffect(() => {
    updateSlackFromGet();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editMode])

  const appsMutation = useAppsMutation();
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!state.validate()) {
      return;
    }
    try {
      await mutation.mutateAsync(state.data);
      handleClose();
      OrangeryToast(`Successfully ${editMode ? "edited" : "connected"}.`, "success");

      let apps = await appsMutation.mutateAsync()
      globalState.setApps(apps)
    } catch (err: any) {
      // let apps = await appsMutation.mutateAsync()
    }
  }

  const testMutation = useTest();
  async function handleTest(e: React.FormEvent) {
    e.preventDefault();
    if (!state.validate()) {
      return;
    }
    try {
      let result = await testMutation.mutateAsync(state.data);
      if (result.data)
        OrangeryToast(`Successfully tested.`, "success");
      else
        OrangeryToast(`Test failed.`, "warning");

    } catch (err: any) {
      // let apps = await appsMutation.mutateAsync()
    }
  }

  return (editMode && !slackFromGet
    ? <Box
      sx={{
        height: "100%",
        width: 800,
      }}>
      <OrangeryNavigationContentLoader />
    </Box>
    : <form
      onSubmit={handleSubmit}
      style={{
        height: "100%",
        width: 800,
        position: "relative"
      }}
    >
      <OrangeryCloseButton onClose={handleClose} />
      <Observer>
        {() => (
          <Box
            sx={{
              pr: 3,
              pl: 4,
              py: 1.8,
              // pb: 1,
              // pt: 2.5,
              mb: 3.5,
              display: "flex",
              justifyContent: "end",
              alignItems: "center",
              // borderBottom: (theme) => `1px solid ${theme.palette.grey[400]}`,
            }}
          >
            <Typography
              component="h4"
              variant="H4"
              sx={{ flexGrow: 1 }}
              color={(theme) => theme.palette.primary.light}
            >
              {editMode ? "Edit" : "Connect"}{" "}Slack
            </Typography>
          </Box>
        )}
      </Observer>

      <Observer>
        {() => (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              py: 1,
              pl: 4,
              pr: 3,
              rowGap: 2,
              mb: 0,
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: {
                  xs: "column",
                  sm: "row"
                },
                gap: 2
              }}
            >
              <Box sx={{ flexBasis: "100%" }}>
                <OrangeryTextField
                  label="WEBHOOK URL *"
                  type="text"
                  name="webhook"
                  fullWidth
                  value={state.webhook.value}
                  error={!!state.webhook.error}
                  helperText={state.webhook.error}
                  onChange={(e) => (state.webhook.value = e.target.value)}
                />
              </Box>
            </Box>

            <Box
              sx={{
                display: "flex",
                flexDirection: {
                  xs: "column",
                  sm: "row"
                },
                gap: 2
              }}
            >
              <Box sx={{ flexBasis: "100%" }}>
                <OrangeryTextField
                  label="USERNAME"
                  type="text"
                  name="username"
                  fullWidth
                  value={state.username.value}
                  error={!!state.username.error}
                  helperText={state.username.error}
                  onChange={(e) => (state.username.value = e.target.value)}
                />
              </Box>
            </Box>

            <Box
              sx={{
                display: "flex",
                flexDirection: {
                  xs: "column",
                  sm: "row"
                },
                gap: 2
              }}
            >
              <Box sx={{ flexBasis: "100%" }}>
                <Observer>
                  {() => (
                    <OrangeryStringArrayAutocomplete
                      options={slack.events ?? []}
                      label="EVENTS"
                      value={state.events.values.map(
                        (e) => e.value
                      )}
                      onChange={(newValues) => {
                        // state.events = new ArrayValueState(newValues)
                        newValues.forEach((e) => {
                          const i = state.events.values.findIndex(
                            (v) => v.value === e
                          );
                          if (i === -1) {
                            state.events.pushElementValue(e);
                          }
                        });
                        state.events.values.forEach((v, j) => {
                          const i = newValues.findIndex((e) => v.value === e);
                          if (i === -1) {
                            state.events.deleteElementValue(j);
                          }
                        });
                      }}
                    />
                  )}
                </Observer>
              </Box>
            </Box>
          </Box>
        )}
      </Observer>

      <Box
        sx={{
          display: "flex",
          gap: 2,
          justifyContent: "flex-end",
          alignItems: "center",
          pl: 4,
          pr: 3,
          pb: 3
        }}
      >
        <Observer>
          {() => (
            <>
              {/* {!noCancel && (
                <Button
                  color="primary"
                  onClick={handleClose}
                  sx={{
                    width: 170,
                    height: 55,
                    fontSize: 20,
                    color: (theme) => theme.palette.grey.A200,
                    backgroundColor: (theme) => theme.palette.grey[200],
                    mr: 2,
                  }}
                >
                  Cancel
                </Button>
              )} */}
              <Button
                sx={{
                  backgroundColor: "#fff",
                  border: "1px solid black",
                  borderRadius: 1,
                  width: 170,
                  height: 55,
                  fontSize: 20,
                }}
                onClick={handleTest}
              >
                <Typography
                  variant="BUTTONTEXT"
                >
                  Test Integration
                </Typography>
              </Button>

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
                Connect
              </Button>
            </>
          )}
        </Observer>
      </Box>
    </form>
  );
}