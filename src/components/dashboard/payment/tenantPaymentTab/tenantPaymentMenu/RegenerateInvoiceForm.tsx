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
import { OrangeryToast } from "../../../../OrangeryElements";

// 
import { IBillingParams, useUpdateRegenerateInvoice } from "../../../../../queries/billing";

// icons, images & colors
//

export class RegenerateInvoiceFormState {
  public office_uuid;

  public billing_uuid;

  public error = "";

  constructor(office_uuid: string, billing?: IBillingParams) {
    this.office_uuid = new ValueState(office_uuid);

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
    };
  }

  clearErrors() {
    this.billing_uuid.clearError();

    this.error = "";
  }

  validate() {
    let valid = true;
    this.clearErrors();

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
  }
}

export default function RegenerateInvoiceForm({
  billing,
  handleClose,
  noCancel,
}: {
  billing?: IBillingParams;
  handleClose?: () => void;
  noCancel?: any;
}) {
  const { office_uuid } = useGlobalState();
  const mutation = useUpdateRegenerateInvoice();
  const state = React.useMemo(
    () => new RegenerateInvoiceFormState(office_uuid, { billing_uuid: billing?.billing_uuid ?? "" }),
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
                {"Regenerate Invoice"}
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
                  Are you sure to regenerate new invoice?
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
                  {"REGENERATE"}
                </Button>
              </>
            )}
          </Observer>
        </Box>
      </Box>
    </form>
  );
}