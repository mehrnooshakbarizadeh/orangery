// contexts & globals
import { useGlobalState } from "../../../../Contexts & Globals/GlobalContext";

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
} from "../../../../states/mobx-form";
import {
  OrangeryTextField,
  OrangeryFormWrapper,
} from "../../../OrangeryElements";
import {
  OrangeryToast,
} from "../../../OrangeryElements";
// import CustomizedSwitches from "../../OrangeryElements/CustomizedSwitches";

// queries & backend
import {
  useOSAnalyticsSettingsUpdate,
  useOSAnalyticsSettings,
  ISettingsOSAnalytics,
} from "../../../../queries/apps/osAnalytics";
import { IOffice } from "../../../../queries/office";

// icons, images & colors
//

export class OSAnalyticsSettingsFormState {
  public office_uuid;

  public cost_per_month;
  public additional_desks;
  public additional_rented_desks;
  public additional_customers;
  public additional_revenue_per_month;

  public error = "";

  private osAnalyticsSettings;

  constructor(
    office_uuid?: string,
    osAnalyticsSettings?: ISettingsOSAnalytics
  ) {
    this.osAnalyticsSettings = osAnalyticsSettings;
    this.office_uuid = new ValueState(office_uuid);
    if (osAnalyticsSettings) {
      this.cost_per_month = new ValueState(osAnalyticsSettings.cost_per_month);
      this.additional_desks = new ValueState(
        osAnalyticsSettings.additional_desks
      );
      this.additional_rented_desks = new ValueState(
        osAnalyticsSettings.additional_rented_desks
      );
      this.additional_customers = new ValueState(
        osAnalyticsSettings.additional_customers
      );
      this.additional_revenue_per_month = new ValueState(
        osAnalyticsSettings.additional_revenue_per_month
      );
    } else {
      this.cost_per_month = new ValueState<number>(0);
      this.additional_desks = new ValueState<number>(0);
      this.additional_rented_desks = new ValueState<number>(0);
      this.additional_customers = new ValueState<number>(0);
      this.additional_revenue_per_month = new ValueState<number>(0);
    }
    makeAutoObservable(this);
  }

  get data() {
    return {
      office_uuid: this.office_uuid.value,
      cost_per_month: this.cost_per_month.value,
      additional_desks: this.additional_desks.value,
      additional_rented_desks: this.additional_rented_desks.value,
      additional_customers: this.additional_customers.value,
      additional_revenue_per_month: this.additional_revenue_per_month.value,
    };
  }

  clearErrors() {
    this.cost_per_month.clearError();
    this.additional_desks.clearError();
    this.additional_rented_desks.clearError();
    this.additional_customers.clearError();
    this.additional_revenue_per_month.clearError();
    this.error = "";
  }

  validate() {
    let valid = true;
    this.clearErrors();
    // if (!this.cost_per_month.value) {
    //   this.cost_per_month.error = "Please fill cost per month";
    //   valid = false;
    // }
    // if (!this.additional_desks.value) {
    //   this.additional_desks.error = "Please fill additional desks";
    //   valid = false;
    // }
    // if (!this.additional_rented_desks.value) {
    //   this.additional_rented_desks.error = "Please fill additional rented desks";
    //   valid = false;
    // }
    // if (!this.additional_customers.value) {
    //   this.additional_customers.error = "Please fill additional customers";
    //   valid = false;
    // }
    // if (!this.additional_revenue_per_month.value) {
    //   this.additional_revenue_per_month.error =
    //     "Please fill additional revenue per month";
    //   valid = false;
    // }
    return valid;
  }

  setupErrors(err: FormError) {
    this.clearErrors();
    err.errors.forEach((error: any) => this.setupError(error));
  }

  setupError(error: FieldError) {
    if (error.field === "") {
      this.error = error.error;
    } else if (error.field === "cost_per_month") {
      this.cost_per_month.error = error.error;
    } else if (error.field === "additional_desks") {
      this.additional_desks.error = error.error;
    } else if (error.field === "additional_customers") {
      this.additional_customers.error = error.error;
    } else if (error.field === "additional_revenue_per_month") {
      this.additional_revenue_per_month.error = error.error;
    } else {
      // console.warn(
      //   `the field ${error.field} not found in the field list in RoomForm.`
      // );
    }
  }
}

export default function SettingsForm({
  handleClose,
  selectedOffice,
  noCancel,
  noRemove,
}: {
  handleClose: () => void;
  selectedOffice?: IOffice;
  noCancel?: any;
  noRemove?: any;
}) {
  const globalState = useGlobalState();

  const { data, isLoading, error } = useOSAnalyticsSettings(
    selectedOffice?.uuid
  );
  const mutation = useOSAnalyticsSettingsUpdate();
  const state = React.useMemo(
    () => new OSAnalyticsSettingsFormState(selectedOffice?.uuid, data),
    [selectedOffice?.uuid, data]
  );

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!state.validate()) {
      return;
    }
    try {
      await mutation.mutateAsync(state.data);
      handleClose();
      OrangeryToast("Successfully settings updated", "success");
    } catch (err: any) {
      state.setupErrors(err);
    }
  }

  return (
    <OrangeryFormWrapper
      onSubmit={handleSubmit}
      onClose={handleClose}
      title={`Settings`}
      style={{
        width: 498,
        // height: 618
      }}
      footer={
        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "center",
            width: "100%",
          }}
        >
          {!noRemove && <Box sx={{ flexGrow: 1 }}></Box>}
          <Observer>
            {() => (
              <>
                {!noCancel && (
                  <Button
                    color="primary"
                    onClick={handleClose}
                    sx={{
                      width: 170,
                      height: 55,
                      fontSize: 20,
                      color: "#2B2E33",
                      mr: 2,
                    }}
                  >
                    Cancel
                  </Button>
                )}
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
                  {"Done"}
                </Button>
              </>
            )}
          </Observer>
        </Box>
      }
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "end",
          width: "100%",
        }}
      >
        <Observer>
          {() => (
            <Box
              sx={{
                display: "flex",
                // flexGrow: 1,
                flexDirection: "column",
                pt: 2,
                // pb: 14,
                pl: 4,
                pr: 2,
                mr: 1,
                rowGap: 2,
                height: "100%",
                width: "100%",
              }}
            >
              <Box
                sx={{
                  width: "100%",
                  display: "flex",
                  flexDirection: "column",
                  gap: 0.5,
                  pb: 4,
                }}
              >
                <Typography
                  sx={{
                    fontSize: 16,
                    fontWeight: 400,
                  }}
                >
                  Selected location
                </Typography>
                <Typography
                  sx={{
                    fontSize: 16,
                    fontWeight: 800,
                  }}
                >
                  {selectedOffice?.name ?? "All locations"}
                </Typography>
              </Box>

              <Box sx={{ width: "100%" }}>
                <OrangeryTextField
                  label="COST PER MONTH"
                  name="cost_per_month"
                  placeholder="Enter cost per month"
                  error={!!state.cost_per_month.error}
                  value={state.cost_per_month.value}
                  helperText={state.cost_per_month.error}
                  onChange={(e: any) =>
                    (state.cost_per_month.value = Number(e.target.value))
                  }
                />
              </Box>

              <Box sx={{ width: "100%" }}>
                <OrangeryTextField
                  label="ADDITIONAL DESKS"
                  name="additional_desks"
                  placeholder="Enter additional desks"
                  error={!!state.additional_desks.error}
                  value={state.additional_desks.value}
                  helperText={state.additional_desks.error}
                  onChange={(e: any) =>
                    (state.additional_desks.value = Number(e.target.value))
                  }
                />
              </Box>

              <Box sx={{ width: "100%" }}>
                <OrangeryTextField
                  label="ADDITIONAL RENTED DESKS"
                  name="additional_rented_desks"
                  placeholder="Enter additional rented desks"
                  error={!!state.additional_rented_desks.error}
                  value={state.additional_rented_desks.value}
                  helperText={state.additional_rented_desks.error}
                  onChange={(e: any) =>
                    (state.additional_rented_desks.value = Number(e.target.value))
                  }
                />
              </Box>

              <Box sx={{ width: "100%" }}>
                <OrangeryTextField
                  label="ADDITIONAL CUSTOMERS"
                  name="additional_customers"
                  placeholder="Enter additional customers"
                  error={!!state.additional_customers.error}
                  value={state.additional_customers.value}
                  helperText={state.additional_customers.error}
                  onChange={(e: any) =>
                    (state.additional_customers.value = Number(e.target.value))
                  }
                />
              </Box>
              <Box sx={{ width: "100%" }}>
                <OrangeryTextField
                  label="ADDITIONAL REVENUE PER MONTH"
                  name="additional_revenue_per_month"
                  placeholder="Enter additional revenue per month"
                  error={!!state.additional_revenue_per_month.error}
                  value={state.additional_revenue_per_month.value}
                  helperText={state.additional_revenue_per_month.error}
                  onChange={(e: any) =>
                  (state.additional_revenue_per_month.value = Number(
                    e.target.value
                  ))
                  }
                />
              </Box>
            </Box>
          )}
        </Observer>
      </Box>
    </OrangeryFormWrapper>
  );
}
