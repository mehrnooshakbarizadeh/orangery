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
  // InputAdornment,
} from "@mui/material";
import { makeAutoObservable } from "mobx";
import { Observer } from "mobx-react-lite";
import NumberFormat from "react-number-format";

// orangery elements & internal dependencies
import {
  FieldError,
  FormError,
  ValueState,
} from "../../../../../states/mobx-form";
import {
  OrangeryToast,
  OrangeryTextField,
  OrangeryCloseButton,
  OrangeryReadOnlyTextField,
  OrangeryPrice,
} from "../../../../OrangeryElements";
import AddNewPaymentMethodButton from "../paymentMethod/AddNewPaymentMethodButton";

// queries & backend
import { IPlanParams, IPlan, useUpdatePlan } from "../../../../../queries/plan";
import {
  IPaymentMethod,
  usePaymentMethod,
} from "../../../../../queries/paymentMethod";

// icons, images & colors
import CreditCardIcon from "../../../../assets/svg/creditCard.svg";

export class PlanSubscriptionState {
  public uuid = new ValueState<string>("");
  public error = "";

  constructor(plan?: IPlanParams) {
    this.uuid.value = plan ? plan.uuid : "";

    makeAutoObservable(this);
  }

  get data() {
    return {
      uuid: this.uuid.value,
    };
  }

  clearErrors() {
    this.uuid.clearError();
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
    } else {
      // console.warn(
      //   `the field ${error.field} not found in the field list in PlanForm.`
      // );
    }
  }
}

export default function PlanSubscriptionForm({
  plan,
  paymentMethod,
  handleClose,
}: {
  plan: IPlan;
  paymentMethod?: IPaymentMethod;
  handleClose: () => void;
}) {
  const { office_uuid } = useGlobalState();
  const mutation = useUpdatePlan();
  const state = React.useMemo(() => new PlanSubscriptionState(plan), [plan]);
  const globalState = useGlobalState();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!state.validate()) {
      return;
    }
    try {
      await mutation.mutateAsync(state.data);
      handleClose();
      OrangeryToast("Successfully subscribed", "success");
    } catch (err: any) {
      state.setupErrors(err);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <Box>
        <OrangeryCloseButton onClose={handleClose} />
        <Box
          sx={{
            pr: 3,
            pl: 3,
            py: 1.8,
            // pb: 1,
            // pt: 2.5,
            display: "flex",
            flexDirection: "column",
            justifyContent: "end",
            alignItems: "start",
          }}
        >
          <Typography variant="h2">Order Confirmation</Typography>
        </Box>

        <Observer>
          {() => (
            <Box
              sx={{
                pr: 3,
                pl: 3,
                py: 1,
                // pb: 1,
                // pt: 2.5,
                display: "flex",
                justifyContent: "end",
                alignItems: "center",
              }}
            >
              <Typography
                sx={{ flexGrow: 1, fontSize: 20, fontWeight: 800 }}
                color={(theme) => theme.palette.primary.light}
              >
                Order Summary
              </Typography>
            </Box>
          )}
        </Observer>
        <Observer>
          {() => (
            <Box
              sx={{
                pr: 3,
                pl: 3,
                py: 1,
                // pb: 1,
                // pt: 2.5,
                mb: 2,
                display: "flex",
                flexDirection: "column",
                justifyContent: "end",
                alignItems: "start",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  width: "100%",
                }}
              >
                <Typography variant="h4">{plan.name} License</Typography>
                <Typography variant="h4">
                  <OrangeryPrice euro={plan.price} germanFormat />
                  {" per User /month"}
                </Typography>
              </Box>
            </Box>
          )}
        </Observer>
      </Box>
      <Box>
        <Observer>
          {() => (
            <Box
              sx={{
                pr: 3,
                pl: 3,
                py: 1,
                // pb: 1,
                // pt: 2.5,
                display: "flex",
                justifyContent: "end",
                alignItems: "center",
              }}
            >
              <Typography
                sx={{ flexGrow: 1, fontSize: 20, fontWeight: 800 }}
                color={(theme) => theme.palette.primary.light}
              >
                Payment Method:{" "}
                {paymentMethod
                  ? paymentMethod.is_sepa_payment
                    ? "SEPA"
                    : "Credit Card"
                  : ""}
              </Typography>

              <AddNewPaymentMethodButton
                editMode={!!paymentMethod}
                buy={true}
              />
            </Box>
          )}
        </Observer>
        <Observer>
          {() =>
            paymentMethod ? (
              paymentMethod.is_sepa_payment ? (
                <>
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      py: 1,
                      px: 3,
                      rowGap: 3,
                    }}
                  >
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                      <Box sx={{ flex: "0.5 1 auto", width: "100%" }}>
                        <OrangeryTextField
                          label="IBAN HOLDER NAME"
                          name="name"
                          // startIcon={<CalenderUserIcon />}
                          placeholder="Your Name"
                          value={paymentMethod.name}
                          disabled={true}
                        />
                      </Box>

                      <Box sx={{ flex: "0.5 1 auto", width: "100%" }}>
                        <NumberFormat
                          customInput={OrangeryTextField}
                          label="IBAN"
                          name="iban"
                          placeholder="IBAN"
                          disabled={true}
                          // InputProps={{
                          //   startAdornment: (
                          //     <InputAdornment
                          //       position="start"
                          //       sx={{ "& .stock-icon": { width: "0.75rem" } }}
                          //     >
                          //       <CreditCardIcon />
                          //     </InputAdornment>
                          //   ),
                          // }}
                          type="text"
                          // allowNegative={false}
                          format={paymentMethod.country + " **** " + "####"}
                          value={
                            paymentMethod.country +
                            " **** " +
                            paymentMethod.last4
                          }
                          sx={{}}
                        />

                        {/* {!editMode
                      ?: <OrangeryReadOnlyTextField
                      sx={{
                        width: "100%"
                      }}
                      label="NUMBER"
                      icon={<></>}
                      placeholder="Card Number"
                      value={"**** **** **** " + state.last4.value?.toString()}
                    />
                    } */}
                      </Box>
                    </Box>
                  </Box>
                </>
              ) : (
                <>
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      py: 1,
                      px: 3,
                      rowGap: 3,
                    }}
                  >
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                      <Box sx={{ flex: "0.5 1 auto", width: "100%" }}>
                        <OrangeryTextField
                          label="CARD HOLDER NAME"
                          name="name"
                          // startIcon={<CalenderUserIcon />}
                          placeholder="Your Name"
                          value={paymentMethod.name}
                          disabled={true}
                        />
                      </Box>

                      <Box sx={{ flex: "0.5 1 auto", width: "100%" }}>
                        <NumberFormat
                          customInput={OrangeryTextField}
                          label="NUMBER"
                          name="number"
                          placeholder="Card Number"
                          format={"**** **** **** ####"}
                          disabled={true}
                          // InputProps={{
                          //   startAdornment: (
                          //     <InputAdornment
                          //       position="start"
                          //       sx={{ "& .stock-icon": { width: "0.75rem" } }}
                          //     >
                          //       <CreditCardIcon />
                          //     </InputAdornment>
                          //   ),
                          // }}
                          type="text"
                          // allowNegative={false}
                          value={"**** **** **** " + paymentMethod.last4}
                          sx={{}}
                        />

                        {/* {!editMode
                      ?: <OrangeryReadOnlyTextField
                      sx={{
                        width: "100%"
                      }}
                      label="NUMBER"
                      icon={<></>}
                      placeholder="Card Number"
                      value={"**** **** **** " + state.last4.value?.toString()}
                    />
                    } */}
                      </Box>
                    </Box>

                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 2,
                        rowGap: 5,
                      }}
                    >
                      <Box sx={{ flex: "0.5 1 auto", width: "100%" }}>
                        <NumberFormat
                          customInput={OrangeryTextField}
                          label="CVC"
                          name="cvc"
                          placeholder="Card CVC"
                          format="###"
                          // InputProps={{
                          //   startAdornment: (
                          //     <InputAdornment
                          //       position="start"
                          //       sx={{ "& .stock-icon": { width: "0.75rem" } }}
                          //     >
                          //       <CreditCardIcon />
                          //     </InputAdornment>
                          //   ),
                          // }}
                          disabled={true}
                          type="text"
                          // allowNegative={false}
                          value={"***"}
                          sx={{}}
                        />
                      </Box>

                      <Box sx={{ flex: "0.5 1 auto", width: "100%" }}>
                        <NumberFormat
                          customInput={OrangeryTextField}
                          label="EXP. MONTH"
                          name="exp_month"
                          placeholder="Card Exp. Month"
                          format="##"
                          // InputProps={{
                          //   startAdornment: (
                          //     <InputAdornment
                          //       position="start"
                          //       sx={{ "& .stock-icon": { width: "0.75rem" } }}
                          //     >
                          //       <CreditCardIcon />
                          //     </InputAdornment>
                          //   ),
                          // }}
                          type="text"
                          // allowNegative={false}
                          value={paymentMethod.exp_month}
                          disabled={true}
                          sx={{}}
                        />
                      </Box>

                      <Box sx={{ flex: "0.5 1 auto", width: "100%" }}>
                        <NumberFormat
                          customInput={OrangeryTextField}
                          label="EXP. YEAR"
                          name="exp_year"
                          placeholder="Card Exp. Year"
                          format="####"
                          // InputProps={{
                          //   startAdornment: (
                          //     <InputAdornment
                          //       position="start"
                          //       sx={{ "& .stock-icon": { width: "0.75rem" } }}
                          //     >
                          //       <CreditCardIcon />
                          //     </InputAdornment>
                          //   ),
                          // }}
                          type="text"
                          // allowNegative={false}
                          value={paymentMethod.exp_year}
                          disabled={true}
                          sx={{}}
                        />
                      </Box>
                    </Box>
                  </Box>
                </>
              )
            ) : (
              <></>
            )
          }
        </Observer>

        <Observer>
          {() => (
            <Box
              sx={{
                width: "100%",
                display: "flex",
                pr: 3,
                pl: 3,
                mt: 4,
              }}
            >
              <Button
                onClick={handleClose}
                sx={{
                  width: 170,
                  height: 55,
                  fontSize: 20,
                  color: (theme) => theme.palette.grey.A200,
                  backgroundColor: (theme) => theme.palette.grey[200],
                  mr: 2,
                  ml: "auto",
                }}
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                type="submit"
                color="primary"
                disabled={mutation.isLoading || !paymentMethod}
                sx={{
                  width: 170,
                  height: 55,
                  fontSize: 20,
                  color: "#fff",
                }}
              >
                Buy
              </Button>
            </Box>
          )}
        </Observer>
      </Box>
    </form>
  );
}
