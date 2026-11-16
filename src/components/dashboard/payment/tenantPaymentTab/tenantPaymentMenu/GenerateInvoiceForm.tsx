// 
import { useGlobalState } from "../../../../../Contexts & Globals/GlobalContext";

// 
import React from "react";

// external dependencies
import {
  Box,
  Button,
  Typography,
  InputAdornment,
  TextField
} from "@mui/material";
import { makeAutoObservable } from "mobx";
import { Observer } from "mobx-react-lite";
import NumberFormat from "react-number-format";

// 
import { FieldError, FormError, ValueState } from "../../../../../states/mobx-form";
import { OrangeryToast } from "../../../../OrangeryElements";

// 
import { IBillingParams, useUpdateGenerateInvoice } from "../../../../../queries/billing";

// icons, images & colors
import PercentIcon from '../../../../../assets/svg/percent.svg';


export class GenerateInvoiceFormState {
  public office_uuid;

  public billing_uuid;
  public tax;
  public rabatt;

  public error = "";

  constructor(office_uuid: string, billing?: IBillingParams, taxRate?: number) {
    this.office_uuid = new ValueState(office_uuid);

    this.tax = new ValueState(taxRate ?? 19);
    this.rabatt = new ValueState<number>(0);

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
      tax: this.tax.value,
      rabatt: this.rabatt.value,
    };
  }

  clearErrors() {
    this.billing_uuid.clearError();
    this.tax.clearError();
    this.rabatt.clearError();

    this.error = "";
  }

  validate() {
    let valid = true;

    this.clearErrors();
    if (this.tax.value === null || this.tax.value === undefined || isNaN(this.tax.value)) {
      this.tax.error = "Please enter tax between 0 and 100";
      valid = false;
    }

    if ((this.tax.value > 100) || (this.tax.value < 0)) {
      this.tax.error = "Please enter tax between 0 and 100";
      valid = false;
    }

    if (this.rabatt.value === null || this.rabatt.value === undefined || isNaN(this.rabatt.value)) {
      this.rabatt.error = "Please enter rabatt between 0 and 100";
      valid = false;
    }

    if ((this.rabatt.value > 100) || (this.rabatt.value < 0)) {
      this.rabatt.error = "Please enter rabatt between 0 and 100";
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
    } else if (error.field === "tax") {
      this.tax.error = error.error;
    } else if (error.field === "rabatt") {
      this.rabatt.error = error.error;
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
  const { office_uuid, currentOffice } = useGlobalState();
  const mutation = useUpdateGenerateInvoice();
  const state = React.useMemo(
    () => new GenerateInvoiceFormState(office_uuid, { billing_uuid: billing?.billing_uuid ?? "" }, currentOffice.default_tax_rate),
    [office_uuid, billing?.billing_uuid, currentOffice.default_tax_rate]
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

      OrangeryToast("Successfully generated.", "success");
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
                {"Generate Invoice"}
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
                <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 3 }}>
                  <Box sx={{ width: '100%' }}>
                    <NumberFormat
                      customInput={TextField}
                      fullWidth
                      label="TAX"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment
                            position="start"
                            sx={{
                              "& .icon": {
                                width: "1.3rem",
                                color: "grey.A200",
                              },
                            }}
                          >
                            <PercentIcon className="icon" />
                          </InputAdornment>
                        ),
                      }}
                      type="text"
                      allowNegative={false}
                      value={state.tax.value?.toString()}
                      error={!!state.tax.error}
                      helperText={state.tax.error}
                      onChange={(e: any) =>
                        (state.tax.value = parseInt(e.target.value))
                      }
                    // sx={{ backgroundColor: "grey.200" }}
                    />
                  </Box>

                  <Box sx={{ width: '100%' }}>
                    <NumberFormat
                      customInput={TextField}
                      fullWidth
                      label="RABATT"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment
                            position="start"
                            sx={{
                              "& .icon": {
                                width: "1.3rem",
                                color: "grey.A200",
                              },
                            }}
                          >
                            <PercentIcon className="icon" />
                          </InputAdornment>
                        ),
                      }}
                      type="text"
                      allowNegative={false}
                      value={state.rabatt.value?.toString()}
                      error={!!state.rabatt.error}
                      helperText={state.rabatt.error}
                      onChange={(e: any) =>
                        (state.rabatt.value = parseInt(e.target.value))
                      }
                    // sx={{ backgroundColor: "grey.200" }}
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
                  {"GENERATE"}
                </Button>
              </>
            )}
          </Observer>
        </Box>
      </Box>
    </form>
  );
}