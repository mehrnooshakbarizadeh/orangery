// 
import { useGlobalState } from "../../../../../Contexts & Globals/GlobalContext";

// 
import React from "react";

// external dependencies
import {
  Box,
  Button,
  Typography,
} from "@mui/material";
import { makeAutoObservable } from "mobx";
import { Observer } from "mobx-react-lite";

// 
import { FieldError, FormError, ValueState } from "../../../../../states/mobx-form";
import {
  OrangeryTextField,
  OrangeryToast
} from "../../../../OrangeryElements";

// 
import { IBillingParams, useUpdateSendDepositInvoice } from "../../../../../queries/billing";

// icons, images & colors
import EuroIcon from "../../../../../assets/svg/euro.svg";

export class SendDepositInvoiceFormState {
  public office_uuid;

  public billing_uuid;
  public amount;

  public error = "";

  constructor(office_uuid: string, billing?: IBillingParams) {
    this.office_uuid = new ValueState(office_uuid);

    this.amount = new ValueState(0);

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
      amount: this.amount.value,
    };
  }

  clearErrors() {
    this.billing_uuid.clearError();
    this.amount.clearError();

    this.error = "";
  }

  validate() {
    let valid = true;
    this.clearErrors();
    if (!this.amount.value) {
      this.amount.error = "Please fill amount";
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
    } else if (error.field === "amount") {
      this.amount.error = error.error;
    }
  }
}

export default function GenerateInvoiceForm({
  billing,
  handleClose,
  noCancel,
}: {
  billing?: IBillingParams;
  handleClose?: () => void;
  noCancel?: any;
}) {
  const { office_uuid } = useGlobalState();
  const mutation = useUpdateSendDepositInvoice();
  const state = React.useMemo(
    () => new SendDepositInvoiceFormState(office_uuid, { billing_uuid: billing?.billing_uuid ?? "" }),
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

      OrangeryToast("Successfully sent.", "success");
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
                {"Send Deposit Invoice"}
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
                    <OrangeryTextField
                      label="AMOUNT"
                      name="amount"
                      startIcon={<EuroIcon />}
                      placeholder="amount"
                      error={!!state.amount.error}
                      value={state.amount.value}
                      helperText={state.amount.error}
                      onChange={(e: any) => (state.amount.value = e.target.value)}
                    />
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
                  {"SEND"}
                </Button>
              </>
            )}
          </Observer>
        </Box>
      </Box>
    </form>
  );
}