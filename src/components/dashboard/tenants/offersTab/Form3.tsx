// react & next
import React from "react";

// external dependencies
import {
  Box,
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
  Typography,
} from "@mui/material";
import { Observer } from "mobx-react-lite";

// orangery elements & internal dependencies
import { OfferFieldsState } from "./HandleOfferForm";
import OneTimePayment from "./OneTimePayment";
import Subscription from "./Subscription";

export default function Form3({
  state,
  editMode,
}: {
  state: OfferFieldsState;
  editMode?: boolean;
}) {
  return (
    <>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 1,
          "& .line-heigh": { mb: 3, pt: "6px" },
          "& .radio-icon": { width: "1.3rem", height: "1.3rem" },
          "& .form-control": { mb: 2 },
          "& .form-control-label": {
            "& .MuiFormControlLabel-label": {
              fontSize: "19px",
              fontWeight: 600,
            },
          },
        }}
      >
        <Typography variant="h1">Payment details</Typography>
        <Typography variant="h3" className="line-heigh">
          Please create payment instructions for your plan
        </Typography>

        <FormControl className="form-control">
          <Observer>
            {() => (
              <>
                <RadioGroup
                  row
                  name="payment-method"
                  value={state.payment_method.value}
                  onChange={(e) =>
                    (state.payment_method.value = e.target.value)
                  }
                >
                  <Observer>
                    {() => (
                      <FormControlLabel
                        className="form-control-label"
                        value="one_time_payment"
                        control={<Radio />}
                        label="one time payment"
                        disabled={
                          state.product_type.value === "private_office" ||
                          state.product_type.value === "hybrid_office"
                        }
                      />
                    )}
                  </Observer>

                  <Observer>
                    {() => (
                      <FormControlLabel
                        className="form-control-label"
                        value="subscription"
                        control={<Radio />}
                        label="subscription"
                        disabled={
                          state.product_type.value === "cube" ||
                          state.offer_is_free.value
                        }
                      />
                    )}
                  </Observer>
                </RadioGroup>
              </>
            )}
          </Observer>
        </FormControl>

        <Observer>
          {() => (
            <>
              {state.payment_method.value === "subscription" && (
                <Subscription state={state} editMode={editMode} />
              )}
              {state.payment_method.value === "one_time_payment" && (
                <OneTimePayment state={state} />
              )}
            </>
          )}
        </Observer>
      </Box>
    </>
  );
}
