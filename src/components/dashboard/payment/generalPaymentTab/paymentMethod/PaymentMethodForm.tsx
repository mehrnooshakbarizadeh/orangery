// contexts & globals
import { useGlobalState } from "../../../../../Contexts & Globals/GlobalContext";
import theme from "../../../../../Contexts & Globals/theme";

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
import NumberFormat from "react-number-format";

// orangery elements & internal dependencies
import { FieldError, FormError, ValueState } from "../../../../../states/mobx-form";
import {
  OrangeryToast,
  OrangeryTextField,
  OrangeryCountryAutoComplete,
  OrangeryCloseButton
} from '../../../../OrangeryElements'

// queries & backend
import {
  IInsertPaymentMethodParams,
  useInsertPaymentMethod
} from "../../../../../queries/paymentMethod"

// icons, images & colors
import CreditCardIcon from "../../../../../assets/svg/creditCard.svg";
import SepaIcon from "../../../../../assets/svg/payment/sepa.svg";

// others
var IBAN = require('iban');

export class PaymentMethodFormState {
  public address = new ValueState<string>("");

  public card_name = new ValueState<string>("");
  public card_number = new ValueState<string>("");
  public card_cvc = new ValueState<string>("");
  public card_exp_year = new ValueState<string>("");
  public card_exp_month = new ValueState<string>("");

  public country = new ValueState<string>("");

  public iban = new ValueState<string>("");

  public is_sepa_payment = new ValueState<boolean>(false);

  public error = "";

  constructor() {
    makeAutoObservable(this);
  }

  get data() {
    return {
      address: this.address.value,

      name: this.card_name.value,
      number: this.card_number.value,
      cvc: this.card_cvc.value,
      exp_year: this.card_exp_year.value,
      exp_month: this.card_exp_month.value,

      country: this.country.value,

      iban: this.iban.value,

      is_sepa_payment: this.is_sepa_payment.value,
    };
  }

  clearErrors() {
    this.address.error = "";

    this.card_name.error = "";
    this.card_number.error = "";
    this.card_cvc.error = "";
    this.card_exp_year.error = "";
    this.card_exp_month.error = "";

    this.country.error = "";

    this.iban.error = "";

    this.is_sepa_payment.error = "";
  }

  validate() {
    // const isValid = new RegExp(/[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,15}/g).test(
    //   "arulgetsolute@gmail.com"
    // );
    let valid = true;
    this.clearErrors();
    if (!this.address.value) {
      this.address.error = "Please fill your address";
      valid = false;
    }

    if (!this.is_sepa_payment.value) {
      if (!this.card_number.value) {
        this.card_number.error = "Please fill card number";
        valid = false;
      }
      if (!this.card_cvc.value) {
        this.card_cvc.error = "Please fill card cvc";
        valid = false;
      }
      if (!this.card_exp_year.value) {
        this.card_exp_year.error = "Please fill card expiry year";
        valid = false;
      }
      if (!this.card_exp_month.value) {
        this.card_exp_month.error = "Please fill card expiry month";
        valid = false;
      }
    } else {
      if (!this.iban.value) {
        this.iban.error = "Please fill IBAN";
        valid = false;
      }
      if (!IBAN.isValid(this.iban.value)) {
        this.iban.error = "IBAN is not valid";
        valid = false;
      }
    }
    if (!this.card_name.value) {
      this.card_name.error = "Please fill holder name";
      valid = false;
    }
    if (!this.country.value) {
      this.country.error = "Please select a country";
      valid = false;
    }

    return valid;
  }

  setupErrors(err: FormError) {
    this.clearErrors();
    err.errors.forEach((error: any) => this.setupError(error));
  }

  setupError(error: FieldError) {
    if (error.field === "") {
      this.error = error.error;
    }
    if (error.field === "address") {
      this.address.error = error.error;
    }
    if (error.field === "card_name") {
      this.card_name.error = error.error;
    }
    if (error.field === "card_number") {
      this.card_number.error = error.error;
    }
    if (error.field === "card_cvc") {
      this.card_cvc.error = error.error;
    }
    if (error.field === "card_exp_year") {
      this.card_exp_year.error = error.error;
    }
    if (error.field === "card_exp_month") {
      this.card_exp_month.error = error.error;
    }

    if (error.field === "iban") {
      this.iban.error = error.error;
    }
  }
}

export default function PaymentMethodForm(
  {
    paymentMethod,
    handleClose,
    buy
  }: {
    paymentMethod?: IInsertPaymentMethodParams;
    handleClose?: () => void;
    buy?: boolean
  }
) {
  const { office_uuid } = useGlobalState();
  const mutation = useInsertPaymentMethod();
  const state = React.useMemo(
    () => new PaymentMethodFormState(),
    []
  );

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!state.validate()) {
      return;
    }
    try {
      const result = await mutation.mutateAsync(state.data);
      if (state.is_sepa_payment.value)
        OrangeryToast("Successfully created " + state.iban.value, "success");
      else
        OrangeryToast("Successfully created " + state.card_number.value, "success");
      if (handleClose)
        handleClose();
    } catch (err: any) {
      state.setupErrors(err);
    }
  }

  return (
    <>
      <form onSubmit={handleSubmit}
        style={{ height: "100%", display: "flex", flexDirection: "column" }}
      >
        <OrangeryCloseButton
          onClose={handleClose ? handleClose : () => { }}
        />
        <Observer>
          {() => (
            <Box
              sx={{
                mb: 2,
                pb: 2,
                pt: 2.5,
                px: 3,
                display: "flex",
                justifyContent: "end",
                alignItems: "center",
                borderBottom: (theme) => `1px solid ${theme.palette.grey[400]}`,
              }}
            >
              <Typography
                sx={{ flexGrow: 1, fontSize: 20, fontWeight: 800, color: (theme) => theme.palette.primary.light }}
              >
                Enter Your Payment Method
              </Typography>
            </Box>
          )}
        </Observer>

        <Box
          sx={{
            py: 1,
            px: 3,
            overflowY: "auto",
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
          <Observer>
            {() => (
              <Box
                sx={{
                  // pr: 3,
                  py: 1,
                  mb: 2,
                  mt: 3,
                  // pb: 1,
                  // pt: 2.5,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column"
                  }}
                >
                  <Typography
                    sx={{ flexGrow: 1, fontSize: 17, fontWeight: 600, color: "#2B2E33" }}
                  >
                    Choose your payment method
                  </Typography>
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "row"
                  }}
                >
                  <Button
                    sx={{
                      borderRadius: 2,
                      flex: "none",
                      px: 2,
                      width: 179,
                      height: 61,
                      display: "flex",
                      alignItems: "center",
                      ml: "auto",
                      border: !state.is_sepa_payment.value ? "1px solid #F9D507" : "1px solid #EDEEF0",
                      backgroundColor: !state.is_sepa_payment.value ? "white" : "#EDEEF0",
                    }}
                    onClick={(e) => { if (e) e.preventDefault(); state.is_sepa_payment.value = false }}
                  >
                    <Box
                      sx={{
                        width: 20,
                        height: 20,
                        mr: 1
                      }}
                    >
                      <CreditCardIcon />
                    </Box>
                    <Typography
                      sx={{
                        fontSize: 14,
                        fontWeight: 600,
                      }}
                    >
                      Credit Card
                    </Typography>
                  </Button>
                  <Button
                    sx={{
                      borderRadius: 2,
                      flex: "none",
                      px: 2,
                      width: 179,
                      height: 61,
                      display: "flex",
                      flexDirection: "column",
                      textAlign: "left",
                      ml: 2,
                      border: state.is_sepa_payment.value ? "1px solid #F9D507" : "1px solid #EDEEF0",
                      backgroundColor: state.is_sepa_payment.value ? "white" : "#EDEEF0",
                    }}
                    onClick={(e) => { if (e) e.preventDefault(); state.is_sepa_payment.value = true }}
                  >
                    <Box
                      sx={{
                        mr: "auto"
                      }}
                    >
                      <SepaIcon
                        height="15px"
                      />
                    </Box>
                    <Typography
                      sx={{
                        fontSize: 11,
                        fontWeight: 600,
                        mr: "auto"
                      }}
                    >
                      SEPA debit charge
                    </Typography>
                  </Button>
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
                    flexWrap: "wrap"
                  }}
                >
                  {!state.is_sepa_payment.value &&
                    <>
                      <Box
                        sx={{
                          flexBasis: "100%",
                          pb: 3,
                        }}
                      >
                        <NumberFormat
                          customInput={OrangeryTextField}
                          label="NUMBER"
                          name="card_number"
                          // placeholder="Card Number"
                          fullWidth
                          format="#### #### #### ####"
                          // InputProps={{
                          //   startAdornment: (
                          //     <InputAdornment
                          //       position="start"
                          //       sx={{ "& .stock-icon": { width: "0.75rem" } }}
                          //    >
                          //       <CapacityIcon className="stock-icon" />
                          //     </InputAdornment>
                          //   ),
                          // }}
                          type="text"
                          // allowNegative={false}
                          value={state.card_number.value?.toString()}
                          error={!!state.card_number.error}
                          helperText={state.card_number.error}
                          onChange={(e: any) => (state.card_number.value = e.target.value)}
                          sx={{}}
                        />
                      </Box>
                      <Box
                        sx={{
                          flexBasis: "34%",
                          pb: 3,
                        }}
                      >
                        <NumberFormat
                          customInput={OrangeryTextField}
                          label="CVC"
                          name="card_cvc"
                          // placeholder="Card CVC"
                          fullWidth
                          format="###"
                          // InputProps={{
                          //   startAdornment: (
                          //     <InputAdornment
                          //       position="start"
                          //       sx={{ "& .stock-icon": { width: "0.75rem" } }}
                          //    >
                          //       <CreditCardIcon />
                          //     </InputAdornment>
                          //   ),
                          // }}
                          type="text"
                          // allowNegative={false}
                          value={state.card_cvc.value}
                          error={!!state.card_cvc.error
                          }
                          helperText={state.card_cvc.error}
                          onChange={(e: any) => (state.card_cvc.value = e.target.value)}
                          sx={{}}
                        />
                      </Box>
                      <Box
                        sx={{
                          flexBasis: "33%",
                          pb: 3,
                          pl: 3
                        }}
                      >
                        <NumberFormat
                          customInput={OrangeryTextField}
                          label="EXP. MONTH"
                          name="card_exp_month"
                          // placeholder="Card Exp. Month"
                          fullWidth
                          format="##"
                          // InputProps={{
                          //   startAdornment: (
                          //     <InputAdornment
                          //       position="start"
                          //       sx={{ "& .stock-icon": { width: "0.75rem" } }}
                          //    >
                          //       <CreditCardIcon />
                          //     </InputAdornment>
                          //   ),
                          // }}
                          type="text"
                          // allowNegative={false}
                          error={!!state.card_exp_month.error}
                          value={state.card_exp_month.value}
                          helperText={state.card_exp_month.error}
                          onChange={(e: any) => (state.card_exp_month.value = e.target.value)}
                          sx={{}}
                        />
                      </Box>
                      <Box
                        sx={{
                          flexBasis: "33%",
                          pb: 3,
                          pl: 3
                        }}
                      >
                        <NumberFormat
                          customInput={OrangeryTextField}
                          label="EXP. YEAR"
                          name="card_exp_year"
                          // placeholder="Card Exp. Year"
                          fullWidth
                          format="####"
                          // InputProps={{
                          //   startAdornment: (
                          //     <InputAdornment
                          //       position="start"
                          //       sx={{ "& .stock-icon": { width: "0.75rem" } }}
                          //    >
                          //       <CreditCardIcon />
                          //     </InputAdornment>
                          //   ),
                          // }}
                          type="text"
                          // allowNegative={false}
                          error={!!state.card_exp_year.error}
                          value={state.card_exp_year.value}
                          helperText={state.card_exp_year.error}
                          onChange={(e: any) => (state.card_exp_year.value = e.target.value)}
                          sx={{}}
                        />
                      </Box>
                    </>
                  }
                  {state.is_sepa_payment.value &&
                    <>
                      <Box
                        sx={{
                          flexBasis: "100%",
                          pb: 3,
                        }}
                      >
                        <OrangeryTextField
                          label="IBAN"
                          name="iban"
                          // startIcon={<CalenderUserIcon />}
                          // placeholder="Card holder name"
                          fullWidth
                          error={!!state.iban.error}
                          value={state.iban.value}
                          helperText={state.iban.error}
                          onChange={(e: any) => (state.iban.value = e.target.value)}
                        // InputProps={{
                        //   startAdornment: (
                        //     <InputAdornment
                        //       position="start"
                        //       sx={{ "& .stock-icon": { width: "0.75rem" } }}
                        //    >
                        //       <CapacityIcon className="stock-icon" />
                        //     </InputAdornment>
                        //   ),
                        // }}
                        />
                      </Box>
                    </>
                  }
                  <Box
                    sx={{
                      flexBasis: "50%",
                      pb: 3
                    }}
                  >
                    <OrangeryTextField
                      label={!state.is_sepa_payment.value ? "Card holder name" : "Holder name"}
                      name="card_name"
                      // startIcon={<CalenderUserIcon />}
                      // placeholder="Card holder name"
                      fullWidth
                      error={!!state.card_name.error}
                      value={state.card_name.value}
                      helperText={state.card_name.error}
                      onChange={(e: any) => (state.card_name.value = e.target.value)}
                    />
                  </Box>
                  <Box
                    sx={{
                      flexBasis: "50%",
                      pb: 3,
                      pl: 3
                    }}
                  >
                    <OrangeryCountryAutoComplete
                      label="Company/Region"
                      name="country"
                      placeholder="Choose a country/region"
                      value={state.country.value}
                      error={!!state.country.error}
                      helperText={state.country.error}
                      onChange={(newValue) => {
                        state.country.value = newValue;
                      }}
                    />
                  </Box>
                </Box>
              </>
            )}
          </Observer>

          <Observer>
            {() => (
              <>
                <Box
                  sx={{
                    display: "flex",
                    flexWrap: "wrap"
                  }}
                >
                  <Box
                    sx={{
                      flexBasis: "100%",
                      pb: 3,
                    }}
                  >
                    <OrangeryTextField
                      id="address"
                      label={"Address" + " *"}
                      type="text"
                      name="address"
                      autoComplete="address"
                      fullWidth
                      value={state.address.value}
                      error={!!state.address.error}
                      helperText={state.address.error}
                      onChange={(e) => (state.address.value = e.target.value)}
                    />
                  </Box>
                </Box>
              </>
            )}
          </Observer>

          <FormErrorMessage state={state} />
        </Box>

        <Observer>
          {() => (
            <Box
              sx={{
                mt: "auto",
                width: "100%",
                display: "flex",
                flexDirection: "row",
                pt: 2,
                justifyContent: "right",
                pb: 3,
                px: 3
              }}
            >
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
              {paymentMethod ? (
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
                  Save
                </Button>
              ) : (
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
                  {buy
                    ? "Buy"
                    : "Create"
                  }
                </Button>
              )}
            </Box>
          )}
        </Observer>
      </form>
    </>
  );
}

function FormErrorMessage({ state }: { state: { error: string } }) {
  return (
    <Observer>{() => <>{state.error && <div>{state.error}</div>}</>}</Observer>
  );
}
