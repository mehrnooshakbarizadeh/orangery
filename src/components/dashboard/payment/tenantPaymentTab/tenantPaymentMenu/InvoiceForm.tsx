// contexts & globals
import { useGlobalState } from "../../../../../Contexts & Globals/GlobalContext";

// react & next
import React from "react";

// external dependencies
import {
  Box,
  Button,
  Typography,
  TextField,
  InputAdornment,
} from "@mui/material";
import { makeAutoObservable } from "mobx";
import { Observer } from "mobx-react-lite";
import NumberFormat from "react-number-format";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";

// orangery elements & internal dependencies
import { FieldError, FormError, ValueState } from "../../../../../states/mobx-form";
import {
  OrangeryToast,
  OrangeryTextField,
  OrangeryOfferAutocomplete,
  OrangeryCustomerAutocomplete
} from "../../../../OrangeryElements";

// queries & backend
import { useInsertInvoice } from "../../../../../queries/billing";

// icons, images & colors
import EuroIcon from "../../../../../assets/svg/euro.svg";
import PercentIcon from "../../../../../assets/svg/percent.svg";
import LocalOfferIcon from '@mui/icons-material/LocalOffer';

export class InvoiceFormState {
  public office_uuid;

  public billing_date;

  public customer_uuid;

  public product_uuid;

  public billing_name;
  public billing_price;
  public discount;
  public tax;

  public error = "";

  constructor(office_uuid: string, taxRate?: number) {
    this.office_uuid = new ValueState<string>(office_uuid);

    this.billing_date = new ValueState<Date>(new Date());

    this.customer_uuid = new ValueState<string>("");

    this.product_uuid = new ValueState<string>("");

    this.billing_name = new ValueState<string>("");
    this.billing_price = new ValueState<number>(0);
    this.discount = new ValueState<number>(0);
    this.tax = new ValueState<number>(taxRate ?? 19);

    makeAutoObservable(this);
  }

  get data() {
    return {
      office_uuid: this.office_uuid.value,

      billing_date: this.billing_date.value,

      customer_uuid: this.customer_uuid.value,

      ...(this.product_uuid.value
        ? {
          product_uuid: this.product_uuid.value
        }
        : {}
      ),

      billing_name: this.billing_name.value,
      billing_price: this.billing_price.value,
      tax: this.tax.value,

      discount: this.discount.value,
    };
  }

  clearErrors() {
    this.office_uuid.clearError();

    this.customer_uuid.clearError();

    this.product_uuid.clearError();

    this.billing_name.clearError();
    this.billing_price.clearError();
    this.discount.clearError();
    this.tax.clearError();

    this.error = "";
  }

  validate() {
    let valid = true;

    this.clearErrors();
    if (!this.billing_date.value) {
      this.billing_date.error = "Please select a date";
      valid = false;
    }

    if (!this.customer_uuid.value) {
      this.customer_uuid.error = "Please select a customer";
      valid = false;
    }

    if (!this.product_uuid.value) {
      if (!this.billing_name.value || !this.billing_price.value || !this.tax.value) {
        this.product_uuid.error = "Please select a product";
        valid = false;
      }
    }

    if (!this.billing_name.value) {
      this.billing_name.error = "Please enter product name";
      valid = false;
    }
    if (!this.billing_price.value) {
      this.billing_price.error = "Please enter price";
      valid = false;
    }
    if (!this.tax.value) {
      this.tax.error = "Please enter tax";
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
      // } else if (error.field === "name") {
      //   this.name.error = error.error;
    } else {
      // console.warn(
      //   `the field ${error.field} not found in the field list in DeskForm.`
      // );
    }
  }
}

export default function InvoiceForm({
  handleClose,
  noCancel,
}: {
  handleClose: () => void;
  noCancel?: any;
}) {
  const { office_uuid, currentOffice } = useGlobalState();
  const mutation = useInsertInvoice();
  const state = React.useMemo(
    () => new InvoiceFormState(office_uuid, currentOffice.default_tax_rate),
    [office_uuid, currentOffice]
  );

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!state.validate()) {
      return;
    }
    try {
      await mutation.mutateAsync(state.data);
      handleClose();

      OrangeryToast("Invoice successfully created.", "success");

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
                py: 1.8,
                // pb: 1,
                // pt: 2.5,
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
                Create Invoice
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
                  flexDirection: "row",
                  flexWrap: "wrap",
                  py: 1,
                  px: 4,
                  mb: 2,
                }}
              >
                <Box
                  sx={{
                    width: '33%',
                    mb: 1,
                  }}
                >
                  <Observer>
                    {() => (
                      <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <DatePicker
                          inputFormat="dd.MM.yyyy"
                          label="INVOICE DATE"
                          value={state.billing_date.value}
                          onChange={(newValue: any) => {
                            state.billing_date.value = newValue;
                          }}
                          renderInput={(props) =>
                            <Box
                              sx={{
                                height: "85px"
                              }}
                            >
                              <TextField
                                {...props}
                                fullWidth
                              // error={!!state.billing_date.error}
                              // helperText={state.billing_date.error}
                              />
                            </Box>
                          }
                        />
                      </LocalizationProvider>
                    )}
                  </Observer>
                </Box>

                <Box
                  sx={{
                    flexBasis: "100%",
                    pb: 1,
                  }}
                >
                  <Observer>
                    {() => (
                      <OrangeryCustomerAutocomplete
                        label="CUSTOMER"
                        placeholder="Select a customer"
                        value={state.customer_uuid.value}
                        error={!!state.customer_uuid.error}
                        helperText={state.customer_uuid.error}
                        onChange={(newValue) => {
                          state.customer_uuid.value = newValue;
                        }}
                      />
                    )}
                  </Observer>
                </Box>

                <Typography
                  variant="h5"
                  sx={{
                    mb: 2
                  }}
                >
                  Select product
                </Typography>
                <Box
                  sx={{
                    flexBasis: "100%",
                    pb: 1,
                  }}
                >
                  <Observer>
                    {() => (
                      <OrangeryOfferAutocomplete
                        label="PRODUCT"
                        placeholder="Select a product"
                        value={state.product_uuid.value}
                        error={!!state.product_uuid.error}
                        helperText={state.product_uuid.error}
                        onChange={(newOffer) => {
                          state.product_uuid.value = newOffer.uuid;

                          if (newOffer.uuid) {
                            state.billing_name.value = newOffer.name;
                            state.billing_price.value = newOffer.price;
                            state.tax.value = newOffer.tax_rate;
                            state.validate()
                            // handleUpdateOffer(state.product_uuid.value)
                          }
                        }}
                      />
                    )}
                  </Observer>
                </Box>

                <Typography
                  variant="h5"
                  sx={{
                    mb: 2
                  }}
                >
                  — Or fill these fields —
                </Typography>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 2,
                    flexBasis: "100%",
                  }}
                >
                  <Box
                    sx={{
                      flexBasis: "25%",
                    }}
                  >
                    <Observer>
                      {() => (
                        <OrangeryTextField
                          name="name"
                          label="PRODUCT NAME"
                          placeholder="Enter billing name"
                          value={state.billing_name.value}
                          disabled={!!state.product_uuid.value}
                          error={!!state.billing_name.error}
                          helperText={state.billing_name.error}
                          onChange={(e) => (state.billing_name.value = e.target.value)}
                          sx={{
                            "& .icon": {
                              mr: 2,
                              // ml: 1,
                              position: "absolute",
                              width: "1.125rem",
                              height: "1.125rem",
                              color: "grey.A200",
                              // top: (theme) => theme.spacing(2.3),
                              // left: (theme) => theme.spacing(1),
                            },
                          }}
                          startIcon={<LocalOfferIcon className="icon" />}
                        />
                      )}
                    </Observer>
                  </Box>

                  <Box
                    sx={{
                      flexBasis: "25%",
                    }}
                  >
                    <Observer>
                      {() => (
                        <Box sx={{ width: "100%", height: "85px" }}>
                          <NumberFormat
                            value={state.billing_price.value?.toString()}
                            thousandsGroupStyle="wan"
                            fixedDecimalScale={true}
                            disabled={!!state.product_uuid.value}
                            decimalSeparator="."
                            customInput={TextField}
                            fullWidth
                            label="PRICE"
                            InputProps={{
                              startAdornment: (
                                <InputAdornment
                                  position="start"
                                  sx={{ "& .icon": { width: "0.75rem" } }}
                                >
                                  <EuroIcon className="icon" />
                                </InputAdornment>
                              ),
                            }}
                            type="text"
                            thousandSeparator={false}
                            allowNegative={false}
                            decimalScale={2}
                            error={!!state.billing_price.error}
                            helperText={state.billing_price.error}
                            onChange={(e: any) =>
                              (state.billing_price.value = parseFloat(e.target.value))
                            }
                          />
                        </Box>
                      )}
                    </Observer>
                  </Box>

                  <Box
                    sx={{
                      flexBasis: "25%",
                    }}
                  >
                    <Observer>
                      {() => (
                        <Box sx={{ width: "100%", height: "85px" }}>
                          <NumberFormat
                            value={state.tax.value?.toString()}
                            disabled={!!state.product_uuid.value}
                            customInput={TextField}
                            fullWidth
                            label="TAX"
                            type="text"
                            allowNegative={false}
                            error={!!state.tax.error}
                            // helperText={state.tax.error}
                            onChange={(e: any) =>
                              (state.tax.value = parseInt(e.target.value))
                            }
                            InputProps={{
                              endAdornment: (
                                <InputAdornment
                                  position="end"
                                  sx={{ "& .icon": { width: "0.75rem" } }}
                                >
                                  <PercentIcon className="icon" />
                                </InputAdornment>
                              ),
                            }}
                          />
                        </Box>
                      )}
                    </Observer>
                  </Box>

                  <Box
                    sx={{
                      flexBasis: "25%",
                    }}
                  >
                    <Observer>
                      {() => (
                        <Box sx={{ width: "100%", height: "85px" }}>
                          <NumberFormat
                            value={state.discount.value?.toString()}
                            customInput={TextField}
                            fullWidth
                            label="DISCOUNT"
                            type="text"
                            allowNegative={false}
                            error={!!state.discount.error}
                            // helperText={state.discount.error}
                            onChange={(e: any) =>
                              (state.discount.value = parseInt(e.target.value))
                            }
                            InputProps={{
                              endAdornment: (
                                <InputAdornment
                                  position="end"
                                  sx={{ "& .icon": { width: "0.75rem" } }}
                                >
                                  <PercentIcon className="icon" />
                                </InputAdornment>
                              ),
                            }}
                          />
                        </Box>
                      )}
                    </Observer>
                  </Box>
                </Box>
              </Box>
            </>
          )
          }
        </Observer >

        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "center",
            px: 3,
            pb: 3
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
                  {"Create"}
                </Button>
              </>
            )}
          </Observer>
        </Box>
      </Box >
    </form >
  );
}
