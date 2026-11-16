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

import Divider from "@mui/material/Divider";
import { makeAutoObservable } from "mobx";
import { Observer } from "mobx-react-lite";

// orangery elements & internal dependencies
import {
  FieldError,
  FormError,
  ValueState,
} from "../../../../states/mobx-form";
import { OrangeryToast, OrangeryTextField } from "../../../OrangeryElements";
import OrangeryTimeSelector from "../../../OrangeryElements/OrangeryTimeSelector";

// queries & backend
import {
  WeekDay,
  useUpdateOffice,
  IOfficeUpdateParams,
} from "../../../../queries/office";

// icons, images & colors
import EditPenIcon from "../../../../assets/svg/editPen.svg";
import BuildingIcon from "../../../../assets/svg/building.svg";
import LocationIcon from "../../../../assets/svg/location-dot-regular.svg";
import PercentIcon from "../../../../assets/svg/percent.svg";
import ClockIcon from "../../../../assets/svg/clockNine.svg";
import EmailIcon from "../../../../assets/svg/email.svg";
import PhoneIcon from "../../../../assets/svg/phone.svg";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import CopyLinkButton from "../../tenants/offersTab/CopyLinkButton";

export class OfficeState {
  public uuid;
  public name;
  public address;
  public phone;
  public communityManagerPhone;
  public email;
  public taxRate;
  public updateData;
  public openingTimes;
  public error = "";

  private office;

  constructor(office?: IOfficeUpdateParams) {
    this.office = office;
    if (office) {
      this.uuid = new ValueState(office.uuid);
      this.name = new ValueState(office.name);
      this.address = new ValueState(office.address);
      this.phone = new ValueState(office.phone);
      this.communityManagerPhone = new ValueState(
        office.community_manager_phone
      );
      this.email = new ValueState(office.email);
      this.taxRate = new ValueState(office.tax_rate);
      this.updateData = new ValueState(office.data);
      this.openingTimes = new ValueState(office.opening_times);
    } else {
      this.uuid = new ValueState("");
      this.name = new ValueState("");
      this.address = new ValueState("");
      this.phone = new ValueState("");
      this.communityManagerPhone = new ValueState("");
      this.email = new ValueState("");
      this.taxRate = new ValueState(0);
      this.updateData = new ValueState(null);
      this.openingTimes = new ValueState({
        "0": { closed: false, from_time: "", until_time: "" },
        "1": { closed: false, from_time: "", until_time: "" },
        "2": { closed: false, from_time: "", until_time: "" },
        "3": { closed: false, from_time: "", until_time: "" },
        "4": { closed: false, from_time: "", until_time: "" },
        "5": { closed: false, from_time: "", until_time: "" },
        "6": { closed: false, from_time: "", until_time: "" },
      });
    }

    makeAutoObservable(this);
  }

  reset = () => {
    let office = this.office;
    if (office) {
      this.uuid = new ValueState(office.uuid);
      this.name = new ValueState(office.name);
      this.address = new ValueState(office.address);
      this.phone = new ValueState(office.phone);
      this.communityManagerPhone = new ValueState(
        office.community_manager_phone
      );
      this.email = new ValueState(office.email);
      this.taxRate = new ValueState(office.tax_rate);
      this.updateData = new ValueState(office.data);
      this.openingTimes = new ValueState(office.opening_times);
    } else {
      this.uuid = new ValueState("");
      this.name = new ValueState("");
      this.address = new ValueState("");
      this.phone = new ValueState("");
      this.communityManagerPhone = new ValueState("");
      this.email = new ValueState("");
      this.taxRate = new ValueState(0);
      this.updateData = new ValueState(null);
      this.openingTimes = new ValueState({
        "0": { closed: false, from_time: "", until_time: "" },
        "1": { closed: false, from_time: "", until_time: "" },
        "2": { closed: false, from_time: "", until_time: "" },
        "3": { closed: false, from_time: "", until_time: "" },
        "4": { closed: false, from_time: "", until_time: "" },
        "5": { closed: false, from_time: "", until_time: "" },
        "6": { closed: false, from_time: "", until_time: "" },
      });
    }
  };

  get data() {
    return {
      uuid: this.uuid.value,
      name: this.name.value,
      address: this.address.value,
      phone: this.phone.value,
      community_manager_phone: this.communityManagerPhone.value,
      email: this.email.value,
      tax_rate: this.taxRate.value,
      data: this.updateData.value,
      opening_times: this.openingTimes.value,
    };
  }

  clearErrors() {
    this.name.clearError();
    this.address.clearError();
    this.phone.clearError();
    this.communityManagerPhone.clearError();
    this.email.clearError();
    this.taxRate.clearError();
    this.openingTimes.clearError();
    this.error = "";
  }

  validate() {
    // const isValid = new RegExp(/[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,15}/g).test(
    //   "arulgetsolute@gmail.com"
    // );
    const regex1 =
      /(\+\d{1,3}\s?)?((\(\d{3}\)\s?)|(\d{3})(\s|-?))(\d{3}(\s|-?))(\d{4})(\s?(([E|e]xt[:|.|]?)|x|X)(\s?\d+))?/g;
    const regex2 =
      /(\+\d{1,3}\s?)?((\(\d{3}\)\s?)|(\d{3})(\s|-?))(\d{3}(\s|-?))(\d{4})(\s?(([E|e]xt[:|.|]?)|x|X)(\s?\d+))?/g;
    let valid = true;
    this.clearErrors();
    if (!this.name.value) {
      this.name.error = i18next.t(
        "settingsForm.Please fill your location name",
        { ns: "auth" }
      );
      valid = false;
    }
    if (this.name.value.length < 2) {
      this.name.error = i18next.t("settingsForm.Location Name is too short", {
        ns: "auth",
      });
      valid = false;
    }
    if (!this.address.value) {
      this.address.error = i18next.t(
        "settingsForm.Please fill your location address",
        { ns: "auth" }
      );
      valid = false;
    }
    if (this.address.value.length < 2) {
      this.address.error = i18next.t(
        "settingsForm.Location address is too short",
        { ns: "auth" }
      );
      valid = false;
    }
    if (this.phone.value && !regex1.test(this.phone.value)) {
      this.phone.error = i18next.t(
        "settingsForm.Please fill a valid phone number",
        {
          ns: "auth",
        }
      );
      valid = false;
    }
    if (
      this.communityManagerPhone.value &&
      !regex2.test(this.communityManagerPhone.value)
    ) {
      this.communityManagerPhone.error = i18next.t(
        "settingsForm.Please fill a valid phone number",
        {
          ns: "auth",
        }
      );
      valid = false;
    }
    if (!this.taxRate.value) {
      this.taxRate.value = 19;
      valid = true;
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
    } else if (error.field === "name") {
      this.name.error = error.error;
    } else if (error.field === "address") {
      this.address.error = error.error;
    } else if (error.field === "phone") {
      this.phone.error = error.error;
    } else if (error.field === "communityManagerPhone") {
      this.communityManagerPhone.error = error.error;
    } else if (error.field === "email") {
      this.email.error = error.error;
    } else if (error.field === "taxRate") {
      this.taxRate.error = error.error;
    } else if (error.field === "openingTimes") {
      this.openingTimes.error = error.error;
    } else {
      // console.warn(
      //   `the field ${error.field} not found in the field list in ProfileForm.`
      // );
    }
  }
}

export default function OfficeForm({
  office,
}: {
  office?: IOfficeUpdateParams;
}) {
  const mutation = useUpdateOffice();
  const state = React.useMemo(() => new OfficeState(office), [, office]);
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
        OrangeryToast("Office settings successfully edited", "success");
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
          // boxShadow: { xs: "none", md: "1px 1px 3px #eaeaea" },
          padding: { xs: 0, sm: 2, md: 2 },
          flexGrow: 1,
        }}
      >
        <Box
          sx={{
            px: 2,
            overflowY: "auto",
            height: "calc(100% - 12px)",
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
              editMode ? { xs: "60%", md: "30%" } : { xs: "60%", md: "30%" }
            }
            mb={{ xs: 3, md: 2 }}
            sx={{
              margin: "0 0 0 auto",
              display: "flex",
              gap: 3

              // "& > * + *": {
              //   ml: 4
              // }
            }}
          >
            {editMode ? (
              <Button
                color="primary"
                onClick={handleCancel}
                sx={{
                  flexGrow: 1,
                  flexShrink: 1,
                  height: 55,
                  fontSize: 20,
                  // mr: 3,
                  color: (theme) => theme.palette.grey.A200,
                  backgroundColor: "white",
                  border: "1px solid #2B2E33",
                }}
              >
                Cancel
              </Button>
            ) : (
              <CopyLinkButton
                text={`${process.env.NEXT_PUBLIC_COMMUNITY_LIST_URL}/tv/?id=${office?.uuid}&view_token=${office?.view_token}`}
                variant="button"
              />
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
              display: "flex",
              justifyContent: "space-evenly",
              flexDirection: {
                xs: "column",
                sm: "column",
                md: "column",
                lg: "row",
              },
              mt: 6,
              px: 3,
              width: { xs: "100%", sm: "100%", md: "100%" },
              // maxWidth: "600px",
              // "& > * + *": {
              //   mb: 3,
              // },
            }}
          >
            <form onSubmit={handleSubmit}>
              <>
                <Grid
                  container
                  spacing={1}
                  sx={{
                    maxWidth: {
                      xs: "100",
                      sm: "100%",
                      md: "100%",
                      lg: "75%",
                    },
                  }}
                >
                  <Grid item xs={12} sm={12}>
                    <Observer>
                      {() => (
                        <OrangeryTextField
                          id="location-name"
                          label={t("settingsForm.Location name") + ""}
                          type="text"
                          name="location-name"
                          placeholder={t("settingsForm.e.g. Orangery Solingen")}
                          fullWidth
                          autoComplete="location-name"
                          value={state.name.value}
                          error={!!state.name.error}
                          helperText={state.name.error}
                          onChange={(e) => (state.name.value = e.target.value)}
                          disabled={!editMode}
                          startIcon={<BuildingIcon />}
                        />
                      )}
                    </Observer>
                  </Grid>
                  <Grid item xs={12} sm={12}>
                    <Observer>
                      {() => (
                        <OrangeryTextField
                          id="address"
                          label={t("settingsForm.Address") + ""}
                          type="text"
                          name="address"
                          fullWidth
                          placeholder={t(
                            "settingsForm.e.g. Bürgermeister-Grabmeier-Straße 2, 94143 Solingen"
                          )}
                          autoComplete="address"
                          value={state.address.value}
                          error={!!state.address.error}
                          helperText={state.address.error}
                          onChange={(e) =>
                            (state.address.value = e.target.value)
                          }
                          disabled={!editMode}
                          startIcon={<LocationIcon />}
                        />
                      )}
                    </Observer>
                  </Grid>
                  <Grid item xs={12} sm={12}>
                    <Observer>
                      {() => (
                        <OrangeryTextField
                          id="email"
                          label={t("settingsForm.Email") + ""}
                          type="email"
                          name="email"
                          fullWidth
                          placeholder={t(
                            "settingsForm. e.g. example@company.com"
                          )}
                          autoComplete="email"
                          value={state.email.value}
                          error={!!state.email.error}
                          helperText={""}
                          onChange={(e) => (state.email.value = e.target.value)}
                          disabled={!editMode}
                          startIcon={<EmailIcon />}
                        />
                      )}
                    </Observer>
                  </Grid>
                  <Grid item xs={12} sm={12}>
                    <Observer>
                      {() => (
                        <OrangeryTextField
                          id="phone"
                          label={t("settingsForm.Phone") + ""}
                          type="tel"
                          name="phone"
                          fullWidth
                          placeholder={t("settingsForm.e.g. +49 30 901820")}
                          autoComplete="phone"
                          value={state.phone.value}
                          error={!!state.phone.error}
                          helperText={state.phone.error}
                          onChange={(e) => (state.phone.value = e.target.value)}
                          disabled={!editMode}
                          startIcon={<PhoneIcon />}
                        />
                      )}
                    </Observer>
                  </Grid>
                  <Grid item xs={12} sm={12}>
                    <Observer>
                      {() => (
                        <OrangeryTextField
                          id="communityManagerPhone"
                          label={t("settingsForm.Community Manager Phone") + ""}
                          type="tel"
                          name="communityManagerPhone"
                          fullWidth
                          placeholder={t("settingsForm.e.g. +49 30 901820")}
                          autoComplete="communityManagerPhone"
                          value={state.communityManagerPhone.value}
                          error={!!state.communityManagerPhone.error}
                          helperText={state.communityManagerPhone.error}
                          onChange={(e) =>
                            (state.communityManagerPhone.value = e.target.value)
                          }
                          disabled={!editMode}
                          startIcon={<PhoneIcon />}
                        />
                      )}
                    </Observer>
                  </Grid>
                  <Grid item xs={12}>
                    <Observer>
                      {() => (
                        <OrangeryTextField
                          label={t("settingsForm.Tax rate") + ""}
                          id="tax-rate"
                          type="text"
                          name="tax-rate"
                          autoComplete="tax-rate"
                          fullWidth
                          placeholder={t("settingsForm.e.g. 19")}
                          value={state.taxRate.value}
                          error={!!state.taxRate.error}
                          helperText={state.taxRate.error}
                          onChange={(e) =>
                            (state.taxRate.value = Number(e.target.value))
                          }
                          disabled={!editMode}
                          startIcon={<PercentIcon />}
                        />
                      )}
                    </Observer>
                  </Grid>
                </Grid>
              </>

              <FormErrorMessage state={state} />
            </form>

            {/* <Divider variant="middle" sx={{ margin: "20px auto" }} /> */}
            <Box
              sx={{
                backgroundColor: "#F9F9FA",
                boxShadow: "0px 0px 10px 1px #eaeaea",
                borderRadius: "6px",
                padding: "20px",
                minWidth: "45%",
                mt: { xs: 5, sm: 5, md: 5, lg: 0 },
              }}
            >
              <Box sx={{ display: "flex" }}>
                <ClockIcon />
                <Typography ml={2} variant="h2">
                  Opening Times:
                </Typography>
              </Box>
              <Observer>
                {() => (
                  <OrangeryTimeSelector
                    handleFromTimeChange={(e) => {
                      state.openingTimes.value["0"].from_time =
                        e.target.value.toString();
                    }}
                    handleUntilTimeChange={(e) => {
                      state.openingTimes.value["0"].until_time =
                        e.target.value.toString();
                    }}
                    defaultValueFromTime={
                      state.openingTimes.value["0"].from_time
                    }
                    defaultValueUntilTime={
                      state.openingTimes.value["0"].until_time
                    }
                    handleClosedChange={(e) => {
                      state.openingTimes.value["0"].closed = !e.target.checked;
                    }}
                    dayTitle="Monday"
                    editMode={editMode}
                    checked={!state.openingTimes.value!["0"].closed}
                  />
                )}
              </Observer>
              <Observer>
                {() => (
                  <OrangeryTimeSelector
                    handleFromTimeChange={(e) => {
                      state.openingTimes.value["1"].from_time =
                        e.target.value.toString();
                    }}
                    handleUntilTimeChange={(e) => {
                      state.openingTimes.value["1"].until_time =
                        e.target.value.toString();
                    }}
                    defaultValueFromTime={
                      state.openingTimes.value["1"].from_time
                    }
                    defaultValueUntilTime={
                      state.openingTimes.value["1"].until_time
                    }
                    handleClosedChange={(e) => {
                      state.openingTimes.value["1"].closed = !e.target.checked;
                    }}
                    dayTitle="Tuesday"
                    editMode={editMode}
                    checked={!state.openingTimes.value!["1"].closed}
                  />
                )}
              </Observer>
              <Observer>
                {() => (
                  <OrangeryTimeSelector
                    handleFromTimeChange={(e) => {
                      state.openingTimes.value["2"].from_time =
                        e.target.value.toString();
                    }}
                    handleUntilTimeChange={(e) => {
                      state.openingTimes.value["2"].until_time =
                        e.target.value.toString();
                    }}
                    defaultValueFromTime={
                      state.openingTimes.value["2"].from_time
                    }
                    defaultValueUntilTime={
                      state.openingTimes.value["2"].until_time
                    }
                    handleClosedChange={(e) => {
                      state.openingTimes.value["2"].closed = !e.target.checked;
                    }}
                    dayTitle="Wednesday"
                    editMode={editMode}
                    checked={!state.openingTimes.value!["2"].closed}
                  />
                )}
              </Observer>
              <Observer>
                {() => (
                  <OrangeryTimeSelector
                    handleFromTimeChange={(e) => {
                      state.openingTimes.value["3"].from_time =
                        e.target.value.toString();
                    }}
                    handleUntilTimeChange={(e) => {
                      state.openingTimes.value["3"].until_time =
                        e.target.value.toString();
                    }}
                    defaultValueFromTime={
                      state.openingTimes.value["3"].from_time
                    }
                    defaultValueUntilTime={
                      state.openingTimes.value["3"].until_time
                    }
                    handleClosedChange={(e) => {
                      state.openingTimes.value["3"].closed = !e.target.checked;
                    }}
                    dayTitle="Thursday"
                    editMode={editMode}
                    checked={!state.openingTimes.value!["3"].closed}
                  />
                )}
              </Observer>
              <Observer>
                {() => (
                  <OrangeryTimeSelector
                    handleFromTimeChange={(e) => {
                      state.openingTimes.value["4"].from_time =
                        e.target.value.toString();
                    }}
                    handleUntilTimeChange={(e) => {
                      state.openingTimes.value["4"].until_time =
                        e.target.value.toString();
                    }}
                    defaultValueFromTime={
                      state.openingTimes.value["4"].from_time
                    }
                    defaultValueUntilTime={
                      state.openingTimes.value["4"].until_time
                    }
                    handleClosedChange={(e) => {
                      state.openingTimes.value["4"].closed = !e.target.checked;
                    }}
                    dayTitle="Friday"
                    editMode={editMode}
                    checked={!state.openingTimes.value["4"].closed}
                  />
                )}
              </Observer>
              <Observer>
                {() => (
                  <OrangeryTimeSelector
                    handleFromTimeChange={(e) => {
                      state.openingTimes.value["5"].from_time =
                        e.target.value.toString();
                    }}
                    handleUntilTimeChange={(e) => {
                      state.openingTimes.value["5"].until_time =
                        e.target.value.toString();
                    }}
                    defaultValueFromTime={
                      state.openingTimes.value["5"].from_time
                    }
                    defaultValueUntilTime={
                      state.openingTimes.value["5"].until_time
                    }
                    handleClosedChange={(e) => {
                      state.openingTimes.value["5"].closed = !e.target.checked;
                    }}
                    dayTitle="Saturday"
                    editMode={editMode}
                    checked={!state.openingTimes.value["5"].closed}
                  />
                )}
              </Observer>
              <Observer>
                {() => (
                  <OrangeryTimeSelector
                    handleFromTimeChange={(e) => {
                      state.openingTimes.value["6"].from_time =
                        e.target.value.toString();
                    }}
                    handleUntilTimeChange={(e) => {
                      state.openingTimes.value["6"].until_time =
                        e.target.value.toString();
                    }}
                    defaultValueFromTime={
                      state.openingTimes.value["6"].from_time
                    }
                    defaultValueUntilTime={
                      state.openingTimes.value["6"].until_time
                    }
                    handleClosedChange={(e) => {
                      state.openingTimes.value["6"].closed = !e.target.checked;
                    }}
                    dayTitle="Sunday"
                    editMode={editMode}
                    checked={!state.openingTimes.value["6"].closed}
                  />
                )}
              </Observer>
            </Box>
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
