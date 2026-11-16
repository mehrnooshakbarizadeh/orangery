// contexts & globals
import i18next from 'i18next'
import { useTranslation } from "react-i18next";
import { useGlobalState } from "../../../../Contexts & Globals/GlobalContext";

// react & next
import React from "react";

// external dependencies
import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Typography,
  Grid,
  // IconButton,
} from "@mui/material";
import { makeAutoObservable } from "mobx";
import { Observer } from "mobx-react-lite";

// orangery elements & internal dependencies
import { FieldError, FormError, ValueState } from "../../../../states/mobx-form";
import {
  OrangeryToast,
  OrangeryTextField
} from '../../../OrangeryElements'

// queries & backend
import {
  IOffice,
  IOfficeResult,
  useInsertOffice,
  useOfficesMutation,
} from "../../../../queries/office";

// icons, images & colors
// import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
// import ArrowBackIcon from "@mui/icons-material/ArrowBack";

export class OfficeFormState {
  public name = new ValueState<string>("");
  public address = new ValueState<string>("");
  public employee_estimate = new ValueState<number>(0);

  constructor() {
    makeAutoObservable(this);
  }

  get data() {
    return {
      name: this.name.value,
      address: this.address.value,
      employee_estimate: this.employee_estimate.value,
    };
  }

  clearErrors() {
    this.name.error = "";
    this.address.error = "";
    this.employee_estimate.error = "";
  }

  validate() {
    let valid = true;
    this.clearErrors();
    if (!this.address.value) {
      this.address.error = i18next.t("OfficeForm.Please fill your company address", { ns: "auth" });
      valid = false;
    }
    if (!this.name.value) {
      this.name.error = i18next.t("officeForm.Please fill your company name", { ns: "auth" });
      valid = false;
    }
    if (!this.employee_estimate.value) {
      this.employee_estimate.error = i18next.t("officeForm.Please fill your company size", { ns: "auth" });
      valid = false;
    }

    return valid;
  }

  setupErrors(err: FormError) {
    this.clearErrors();
    if (err.errors && Array.isArray(err.errors))
      err.errors.forEach((error) => this.setupError(error));
  }

  setupError(error: FieldError) {
    if (error.field === "address") {
      this.address.error = error.error;
    }
    if (error.field === "name") {
      this.name.error = error.error;
    }
    if (error.field === "employee_estimate") {
      this.employee_estimate.error = error.error;
    }
  }
}

export default function OfficeForm({
  submitButtonText,
  spaceBetween,
  onClose,
  onSubmit,
}: {
  submitButtonText?: string;
  spaceBetween?: boolean;
  onClose?: () => void;
  onSubmit?: (office?: IOfficeResult) => void;
}) {
  const globalState = useGlobalState();
  const { t } = useTranslation("auth");
  const state = React.useMemo(() => new OfficeFormState(), []);
  const mutation = useInsertOffice();

  const officesMutation = useOfficesMutation();
  async function updateOffices() {
    let offices = [] as IOffice[]
    offices = await officesMutation.mutateAsync()
    globalState.setOffices(offices);
  }
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!state.validate()) {
      return;
    }
    try {
      const office = await mutation.mutateAsync(state.data);

      OrangeryToast("Successfully added " + state.data.name, "success");

      if (office) {
        globalState.set_office_uuid(office.uuid);
        updateOffices();

        localStorage.setItem("current_office_name", office.name);
        localStorage.setItem("current_office_uuid", office.uuid);
        localStorage.setItem("current_office_address", office.address);
      } else {
        localStorage.setItem("current_office_name", "");
        localStorage.setItem("current_office_uuid", "");
        localStorage.setItem("current_office_address", "");
      }

      if (onSubmit)
        onSubmit(office)

    } catch (err: any) {
      state.setupErrors(err);
    }
  }
  return (
    <form
      onSubmit={handleSubmit}
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100%"
      }}
    >
      <Observer>
        {() => (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <OrangeryTextField
                id="Company-name"
                label={t("officeForm.Company Name") + " *"}
                type="text"
                name="Company-name"
                autoComplete="Company-name"
                fullWidth
                value={state.name.value}
                error={!!state.name.error}
                helperText={state.name.error}
                onChange={(e) => (state.name.value = e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <OrangeryTextField
                id="Company-address"
                label={t("officeForm.Company Address") + " *"}
                type="text"
                name="Company-address"
                fullWidth
                autoComplete="Company-address"
                value={state.address.value}
                error={!!state.address.error}
                helperText={state.address.error}
                onChange={(e) => (state.address.value = e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel id="employee_estimate">
                  {t("officeForm.Company Size")}
                </InputLabel>

                <Select
                  labelId="employee_estimate"
                  id="employee_estimate"
                  label={t("officeForm.Company Size")}
                  value={state.employee_estimate.value.toString()}
                  error={!!state.employee_estimate.error}
                  onChange={(e) =>
                  (state.employee_estimate.value = parseInt(
                    e.target.value
                  ))
                  }
                  sx={{
                    backgroundColor: "white",
                    borderRadius: "4px"
                  }}
                >
                  <MenuItem value={0}>{t("officeForm.Please Select") + "..."}</MenuItem>
                  <MenuItem value={1}>{"1 - 49 " + t("officeForm.employees")}</MenuItem>
                  <MenuItem value={50}>{"50 - 250 " + t("officeForm.employees")}</MenuItem>
                  <MenuItem value={251}>{"251 - 1500 " + t("officeForm.employees")}</MenuItem>
                  <MenuItem value={1501}>{"1501 - 5000 " + t("officeForm.employees")}</MenuItem>
                  <MenuItem value={5000}>{"5000+ " + t("officeForm.employees")}</MenuItem>
                </Select>
                <Typography
                  sx={{
                    color: "orange",
                    fontSize: "0.75rem",
                    fontWeight: 400,
                    mx: 1.5,
                    mt: 0.5,
                  }}
                >
                  {state.employee_estimate.error}
                </Typography>
              </FormControl>
            </Grid>
          </Grid>
        )}
      </Observer>
      {spaceBetween
        ? <Box
          sx={{
            height: 70
          }}
        />
        : <Box
          sx={{
            flexGrow: 1,
            maxHeight: 70
          }}
        />
      }

      <Observer>
        {() => (
          <Grid container spacing={2}>
            <Grid
              item
              xs={3}
              sm={3}
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-start",
              }}
            >
              {/* <IconButton
                  onClick={() => router.back()}
                  color="primary"
                  sx={{ borderRadius: 0 }}
                >
                  <ArrowBackIcon />
                  <Typography variant="h4" color="primary" sx={{ pl: 1 }}>
                    Back
                  </Typography>
                </IconButton> */}
            </Grid>
            <Grid
              item
              xs={12}
              sm={12}
              sx={{ display: "flex", justifyContent: "flex-end" }}
            >
              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={mutation.isLoading}
                // endIcon={<ArrowForwardIcon fontSize="large" />}
                sx={{
                  fontSize: "20px",
                  py: 2,
                  px: 4,
                  whiteSpace: "nowrap",
                  width: "100%",
                  "&:disabled": {
                    backgroundColor: "grey",
                  },
                }}
              >
                {submitButtonText ?? "Submit"}
              </Button>
            </Grid>
          </Grid>
        )}
      </Observer>
    </form>
  );
}
