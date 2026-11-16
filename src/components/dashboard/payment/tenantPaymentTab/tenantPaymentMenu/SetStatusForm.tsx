// 
import { useGlobalState } from "../../../../../Contexts & Globals/GlobalContext";

// 
import React from "react";

// external dependencies
import {
  Box,
  Button,
  Typography,
  FormControlLabel,
  Radio,
  RadioGroup,
} from "@mui/material";
import { makeAutoObservable } from "mobx";
import { Observer } from "mobx-react-lite";

// 
import { FieldError, FormError, ValueState } from "../../../../../states/mobx-form";
import {
  OrangeryToast
} from "../../../../OrangeryElements";

// 
import { IBillingParams, useUpdateSetStatus } from "../../../../../queries/billing";

// icons, images & colors
//

export class SetStatusFormState {
  public office_uuid;

  public billing_uuid;
  public status;

  public error = "";

  constructor(office_uuid: string, billing?: IBillingParams) {
    this.office_uuid = new ValueState(office_uuid);

    this.status = new ValueState<string>("pending");

    if (billing) {
      this.billing_uuid = new ValueState(billing.billing_uuid);
    } else {
      this.billing_uuid = new ValueState("");
    }

    makeAutoObservable(this);
  }

  get data() {
    return {
      billing_uuid: this.billing_uuid.value,
      status: this.status.value,
    };
  }

  clearErrors() {
    this.billing_uuid.clearError();
    this.status.clearError();

    this.error = "";
  }

  validate() {
    let valid = true;
    this.clearErrors();
    if (!this.status.value) {
      this.status.error = "Please select status";
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
    } else if (error.field === "status") {
      this.status.error = error.error;
    }
  }
}

export default function SetStatusForm({
  billing,
  handleClose,
  noCancel,
}: {
  billing?: IBillingParams;
  handleClose?: () => void;
  noCancel?: any;
}) {
  const { office_uuid, currentOffice } = useGlobalState();
  const mutation = useUpdateSetStatus();
  const state = React.useMemo(
    () => new SetStatusFormState(office_uuid, { billing_uuid: billing?.billing_uuid ?? "" }),
    [office_uuid, billing?.billing_uuid]
  );

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!state.validate()) {
      return;
    }
    try {
      await mutation.mutateAsync(state.data);
      if (handleClose)
        handleClose();

      OrangeryToast("Status successfully set.", "success");
    } catch (err: any) {
      state.setupErrors(err);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <Box>
        <Observer>
          {() => (
            <Box
              sx={{
                pr: 3,
                pl: 4,
                py: 1,
                // pt: "12px",
                mb: 3.5,
                display: "flex",
                justifyContent: "end",
                alignItems: "center",
                borderBottom: (theme) => `1px solid ${theme.palette.grey[400]}`,
              }}
            >
              <Typography
                sx={{ flexGrow: 1, fontSize: 20, fontWeight: 800 }}
                color={(theme) => theme.palette.primary.light}
              >
                {"Set Status"}
              </Typography>
            </Box>
          )}
        </Observer>
        <Observer>
          {() => (
            <>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  py: 1,
                  px: 4,
                  mb: 4,
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <Box sx={{ width: '100%' }}>
                    <RadioGroup
                      row
                      name="status"
                      value={state.status.value}
                      onChange={(e) =>
                        (state.status.value = e.target.value)
                      }
                    >
                      <Observer>
                        {() => (
                          <FormControlLabel
                            className="form-control-label"
                            value="pending"
                            control={<Radio />}
                            label="Pending"
                          />
                        )}
                      </Observer>

                      <Observer>
                        {() => (
                          <FormControlLabel
                            className="form-control-label"
                            value="completed"
                            control={<Radio />}
                            label="Completed"
                          />
                        )}
                      </Observer>

                      <Observer>
                        {() => (
                          <FormControlLabel
                            className="form-control-label"
                            value="failed"
                            control={<Radio />}
                            label="Failed"
                          />
                        )}
                      </Observer>

                      <Observer>
                        {() => (
                          <FormControlLabel
                            className="form-control-label"
                            value="refunded"
                            control={<Radio />}
                            label="Refunded"
                          />
                        )}
                      </Observer>
                    </RadioGroup>
                  </Box>
                </Box>
              </Box>
            </>
          )}
        </Observer>

        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "center",
            px: 3,
          }}
        >
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
                      color: (theme) => theme.palette.grey.A200,
                      backgroundColor: (theme) => theme.palette.grey[200],
                      mr: 2,
                    }}
                  >
                    CANCEL
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
                  {"SET STATUS"}
                </Button>
              </>
            )}
          </Observer>
        </Box>
      </Box>
    </form>
  );
}