// contexts & globals
import { useGlobalState } from "../../../../../Contexts & Globals/GlobalContext";

// react & next
import React, { useState } from "react";

// external dependencies
import { Box, Button, Dialog, DialogContent, Link, Typography } from "@mui/material";
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
  OrangeryNavigationContentLoader,
  OrangeryCheckBox2,
} from "../../../../OrangeryElements";

// queries & backend
import {
  useConnect,
  useHubSpotMutation,
  IHubSpot,
} from "../../../../../queries/apps/hubspot";
import { IApp, useAppsMutation } from "../../../../../queries/apps";

// icons, images & colors

export class HubSpotConnectionFormState {
  public accessToken;
  public contactIntegration;
  public ecommerceIntegration;

  public error = "";

  private hubSpot;

  constructor(hubSpot: IApp, hubSpotGet: IHubSpot | null) {
    if (hubSpotGet) {
      this.hubSpot = hubSpot;
      this.accessToken = new ValueState<string>("*****************");
      this.contactIntegration = new ValueState<boolean>(hubSpotGet.hubspot_contact_integration);
      this.ecommerceIntegration = new ValueState<boolean>(hubSpotGet.hubspot_ecommerce_integration);
    } else {
      this.accessToken = new ValueState<string>("") ?? "";
      this.contactIntegration = new ValueState<boolean>(false);
      this.ecommerceIntegration = new ValueState<boolean>(false);
    }


    // makeAutoObservable(this);
  }

  get data() {

    return {
      ...(this.hubSpot && (this.accessToken.value === ("*****************" || null || undefined)) ? {} : { accessToken: this.accessToken.value !== ("*****************" && null && undefined) ? this.accessToken.value : '' }),
      contactIntegration: this.contactIntegration.value,
      ecommerceIntegration: this.ecommerceIntegration.value,
    };
  }

  clearErrors() {
    this.accessToken.clearError();
    this.contactIntegration.clearError();
    this.ecommerceIntegration.clearError();
    this.error = "";
  }

  validate() {
    let valid = true;
    this.clearErrors();
    if (!this.accessToken.value) {
      this.accessToken.error = "Please enter HubSpot access token.";
      valid = false;
    }
    if (!this.contactIntegration.value && !this.ecommerceIntegration.value) {
      this.contactIntegration.error = "Please select at least one integration.";
      this.ecommerceIntegration.error = "Please select at least one integration.";
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
    } else if (error.field === "accessToken") {
      this.accessToken.error = error.error;
    } else if (
      error.field === "contactIntegration" || error.field === "ecommerceIntegration"
    ) {
      this.contactIntegration.error = error.error;
      this.ecommerceIntegration.error = error.error;
    }
    else {
      // console.warn(
      //   `the field ${error.field} not found in the field list in DoorAccessForm.`
      // );
    }
  }
}

export default function HubSpotConnectionForm({
  hubspot,
  handleClose,
  noCancel,
  editMode,
}: {
  hubspot: IApp;
  handleClose: () => void;
  noCancel?: any;
  editMode?: boolean;
}) {
  const globalState = useGlobalState();

  const mutation = useConnect();

  const [hubspotFormGet, setHubspotFormGet] = React.useState<IHubSpot | null>(null);
  const state = React.useMemo(
    () => new HubSpotConnectionFormState(hubspot, hubspotFormGet),
    [hubspot, hubspotFormGet]
  );

  const slackMutation = useHubSpotMutation();
  async function updateHubSpotFormGet() {
    if (editMode) {
      let tempHubSpot = await slackMutation.mutateAsync();
      setHubspotFormGet(tempHubSpot);
    }
  }
  React.useEffect(() => {
    updateHubSpotFormGet();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editMode]);

  const appsMutation = useAppsMutation();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!state.validate()) {
      return;
    }
    try {
      await mutation.mutateAsync(state.data);
      OrangeryToast(
        `Successfully ${editMode ? "edited" : "connected"}.`,
        "success"
      );
      handleClose();
      let apps = await appsMutation.mutateAsync();
      globalState.setApps(apps);
    } catch (err: any) {
      // let apps = await appsMutation.mutateAsync()
    }
  }

  return editMode && !hubspotFormGet ? (
    <Box
      sx={{
        height: "100%",
        width: 800,
      }}
    >
      <OrangeryNavigationContentLoader />
    </Box>
  ) : (
    <form
      onSubmit={handleSubmit}
      style={{
        height: "100%",
        width: 800,
        position: "relative",
      }}
    >
      <OrangeryCloseButton onClose={handleClose} />
      <Observer>
        {() => (
          <Box
            sx={{
              pr: 3,
              pl: 4,
              pt: 2.7,
              pb: 2,
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
              {editMode ? 'Hubspot - Edit' : 'Hubspot'}
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
                flexDirection: 'column',
                rowGap: 1,
              }}
            >
              <Box sx={{ flexBasis: "100%" }}>
                <OrangeryTextField
                  label="Access Token"
                  type="text"
                  name="accessToken"
                  fullWidth
                  value={state.accessToken.value}
                  error={!!state.accessToken.error}
                  helperText={state.accessToken.error}
                  onChange={(e) => (state.accessToken.value = e.target.value)}
                />
              </Box>
              <Link href="https://developers.hubspot.com/docs/api/private-apps"
                underline="always"
                sx={{ mb: 2 }}
                target="_blank"
              >
                How to find your Access Token?
              </Link>
              <Observer>
                {() => (
                  <Box>
                    <OrangeryCheckBox2
                      label="Contact Integration"
                      checked={state.contactIntegration.value}
                      onChange={(e: any) => (state.contactIntegration.value = e.target.checked)}
                    />
                    <Typography variant="caption" sx={{ fontSize: 12 }}>
                      Please be ensure that the Contact scope scope is enabled in the Hubspot dashboard
                    </Typography>
                  </Box>
                )}
              </Observer>
              <Observer>
                {() => (
                  <Box>
                    <OrangeryCheckBox2
                      label="E-Commerce Integration"
                      checked={state.ecommerceIntegration.value}
                      onChange={(e: any) => (state.ecommerceIntegration.value = e.target.checked)}
                    />
                    <Typography variant="caption" sx={{ fontSize: 12 }}>
                      Please be ensure that the E-Commerce scope is enabled in the Hubspot dashboard
                    </Typography>
                  </Box>
                )}
              </Observer>
            </Box>

            <Box
              sx={{
                display: "flex",
                flexDirection: {
                  xs: "column",
                  sm: "row",
                },
                gap: 2,
              }}
            >

            </Box>
          </Box>
        )}
      </Observer>
      <Observer>
        {() => (
          <>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                width: "100%",
                pl: 4,
                pr: 3,
                pb: 3,
              }}
            >
              {!!state.contactIntegration.error && !!state.ecommerceIntegration.error ? (
                <Typography color={'error.main'}>You didn’t select any options. No change will be made.</Typography>
              ) : (<Box></Box>)}
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
            </Box>
          </>
        )}
      </Observer>
    </form>
  );
}
