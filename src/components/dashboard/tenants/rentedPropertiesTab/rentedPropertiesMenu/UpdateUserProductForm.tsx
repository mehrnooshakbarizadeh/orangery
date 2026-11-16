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
import { IOfferResult, IUserProductParams, useUpdateUserProduct } from "../../../../../queries/tenant";

// icons, images & colors
//

export class UpdateUserProductFormState {
  public userProductUuid;

  public business_payment;
  public canceled;
  public ignore_billing;
  public invoice_payment;

  public error = "";

  constructor(params: IUserProductParams) {
    this.userProductUuid = new ValueState(params.user_product_uuid)
    this.business_payment = new ValueState(params.business_payment)
    this.canceled = new ValueState(params.canceled)
    this.ignore_billing = new ValueState(params.ignore_billing)
    this.invoice_payment = new ValueState(params.invoice_payment)

    makeAutoObservable(this);
  }

  get data() {
    return {
      user_product_uuid: this.userProductUuid.value,
      business_payment: this.business_payment.value,
      canceled: this.canceled.value,
      ignore_billing: this.ignore_billing.value,
      invoice_payment: this.invoice_payment.value,
    };
  }

  clearErrors() {
    this.business_payment.clearError();
    this.canceled.clearError();
    this.ignore_billing.clearError();
    this.invoice_payment.clearError();

    this.error = "";
  }

  validate() {
    let valid = true;
    this.clearErrors();
    // if (!this.status.value) {
    //   this.status.error = "Please select status";
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
      // } else if (error.field === "status") {
      //   this.status.error = error.error;
    }
  }
}

export default function UpdateUserProductForm({
  params,
  handleClose,
  noCancel,
  title,
  message,
}: {
  params: IUserProductParams;
  handleClose?: () => void;
  noCancel?: any;
  title: string
  message: string
}) {
  const mutation = useUpdateUserProduct();
  const state = React.useMemo(
    () => new UpdateUserProductFormState(params),
    [params]
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
                {title}
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
                <Typography>
                  {message}
                </Typography>
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
                  {"YES"}
                </Button>
              </>
            )}
          </Observer>
        </Box>
      </Box>
    </form>
  );
}