import React from "react";
import { Box, InputAdornment, TextField } from "@mui/material";
import NumberFormat from "react-number-format";
import { Observer } from "mobx-react-lite";
import { OfferFieldsState } from "./HandleOfferForm";
import {
  OrangerySwitch,
  OrangeryMultiDatepicker,
} from "../../../OrangeryElements";
import EuroIcon from "../../../../assets/svg/euro.svg";
import PercentIcon from "../../../../assets/svg/percent.svg";
import { ArrayValueState } from "../../../../states/mobx-form";
import moment from "moment";
import OrangeryUploadMultiPDF from "../../../OrangeryElements/OrangeryUploadMultiPDF";

export default function OneTimePayment({ state }: { state: OfferFieldsState }) {
  return (
    <>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 2,
          "& .line-heigh": { mb: 2 },
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
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Box sx={{ flexBasis: "27%", height: "85px", flexShrink: 0 }}>
            <Observer>
              {() => (
                <NumberFormat
                  disabled={state.offer_is_free.value}
                  thousandsGroupStyle="wan"
                  fixedDecimalScale={true}
                  value={
                    state.offer_is_free.value
                      ? 0
                      : state.price.value?.toString()
                  }
                  decimalSeparator="."
                  customInput={TextField}
                  fullWidth
                  label="Price"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment
                        position="start"
                        sx={{ "& .euro-icon": { width: "0.75rem" } }}
                      >
                        <EuroIcon className="euro-icon" />
                      </InputAdornment>
                    ),
                  }}
                  type="text"
                  thousandSeparator={false}
                  allowNegative={false}
                  decimalScale={2}
                  error={!!state.price.error}
                  helperText={state.price.error}
                  onChange={(e: any) =>
                    (state.price.value = parseFloat(e.target.value))
                  }
                />
              )}
            </Observer>
          </Box>

          <Box sx={{ flexBasis: "29%", height: "85px" }}>
            <Observer>
              {() => (
                <OrangerySwitch
                  label={{ checked: "Hourly rate", unchecked: "Hourly rate" }}
                  checkedLabels={{
                    checked: "Price will be calculated per hour",
                    unchecked: "",
                  }}
                  checked={
                    state.product_type.value === "cube"
                      ? true
                      : state.hourly_select.value
                  }
                  onChange={(e) => {
                    if (e.target.checked === true) {
                      state.date_picker.value = true;
                    }
                    state.hourly_select.value = e.target.checked;
                  }}
                  disabled={state.product_type.value === "cube" ? true : false}
                />
              )}
            </Observer>
          </Box>

          <Box sx={{ flexBasis: "27%", height: "85px" }}>
            <Observer>
              {() => (
                <OrangerySwitch
                  label={{ checked: "Date picker", unchecked: "Date picker" }}
                  checkedLabels={{
                    checked: "Needs date picker",
                    unchecked: "No Date picker",
                  }}
                  checked={
                    state.date_picker.value
                    // state.product_type.value === "cube" ||
                    //   state.product_type.value === "flex"
                    //   ? true
                    //   : state.date_picker.value
                  }
                  onChange={(e) => {
                    if (e.target.checked === false) {
                      state.hourly_select.value = false;
                    }
                    state.date_picker.value = e.target.checked;
                  }}
                  // disabled={
                  //   state.product_type.value === "cube" ||
                  //   state.product_type.value === "flex"
                  //     ? true
                  //     : false
                  // }
                />
              )}
            </Observer>
          </Box>
        </Box>

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 2,
            "& .field-aligned": {
              height: "85px",
              flexBasis: "24%",
              flexShrink: 0,
            },
          }}
        >
          <Box className="field-aligned">
            <Observer>
              {() => (
                <NumberFormat
                  disabled={state.offer_is_free.value}
                  value={
                    state.offer_is_free.value
                      ? 0
                      : state.tax_rate.value?.toString()
                  }
                  customInput={TextField}
                  fullWidth
                  label="TAX"
                  type="text"
                  allowNegative={false}
                  error={!!state.tax_rate.error}
                  // helperText={state.tax_rate.error}
                  onChange={(e: any) =>
                    (state.tax_rate.value = parseInt(e.target.value))
                  }
                  InputProps={{
                    endAdornment: (
                      <InputAdornment
                        position="start"
                        sx={{ "& .euro-icon": { width: "0.75rem" } }}
                      >
                        <PercentIcon className="euro-icon" />
                      </InputAdornment>
                    ),
                  }}
                />
              )}
            </Observer>
          </Box>
          <Box className="field-aligned">
            <Observer>
              {() => (
                <NumberFormat
                  disabled={state.offer_is_free.value}
                  thousandsGroupStyle="wan"
                  fixedDecimalScale={true}
                  value={
                    state.offer_is_free.value
                      ? 0
                      : state.sale_price.value?.toString()
                  }
                  // prefix="$"
                  decimalSeparator="."
                  customInput={TextField}
                  fullWidth
                  label="Sale Price (optional)"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment
                        position="start"
                        sx={{ "& .euro-icon": { width: "0.75rem" } }}
                      >
                        <EuroIcon className="euro-icon" />
                      </InputAdornment>
                    ),
                  }}
                  type="text"
                  thousandSeparator={false}
                  allowNegative={false}
                  decimalScale={2}
                  error={!!state.sale_price.error}
                  // helperText={state.sale_price.error}
                  onChange={(e: any) =>
                    (state.sale_price.value = parseFloat(e.target.value))
                  }
                />
              )}
            </Observer>
          </Box>

          <Box className="field-aligned">
            <Observer>
              {() => (
                <NumberFormat
                  value={state.quantity.value?.toString()}
                  customInput={TextField}
                  fullWidth
                  label="Quantity"
                  type="text"
                  // disabled={state.desks.values.length > 0 || state.assets.values.length > 0 || state.room_uuids.values.length > 0}
                  disabled={
                    state.product_type.value === "mobility" &&
                    state.hourly_select.value
                  }
                  allowNegative={false}
                  error={!!state.quantity.error}
                  helperText={state.quantity.error}
                  onChange={(e: any) => {
                    state.updateQuantity(parseInt(e.target.value));
                  }}
                />
              )}
            </Observer>
          </Box>
        </Box>

        <Box sx={{ width: "785px", mr: "8.5px" }}>
          <Observer>
            {() => (
              <OrangeryUploadMultiPDF
                documents={state.documents.values.map((v) => v.value)}
                onAdd={(uuid) => state.documents.pushElementValue(uuid)}
                onRemove={(uuid) => {
                  const i = state.documents.values.findIndex(
                    (v) => v.value === uuid
                  );
                  if (i !== -1) {
                    state.documents.deleteElementValue(i);
                  }
                }}
              />
            )}
          </Observer>
        </Box>

        <Box
          sx={{
            display: "flex",
            gap: 0,
            mt: 4,
            flexDirection: "row",
            width: "55%",
          }}
        >
          <Box
            sx={{
              flexBasis: "66.1%",
              "& .MuiFormHelperText-root": {
                mx: 0,
                fontWeight: 400,
              },
            }}
          >
            <Observer>
              {() => (
                <OrangeryMultiDatepicker
                  readOnly={false}
                  disabledDates={[]}
                  disablePast
                  withoutNote
                  error={!!state.block_days.error}
                  errorMessage={
                    "You can block an offer for a specific time period."
                  }
                  preventRemoveLast={false}
                  selectedDates={state.block_days.values.map(
                    (v) => new Date(v.value)
                  )}
                  onSubmit={(newValues: Date[]) => {
                    if (newValues.length === 0)
                      state.block_days = new ArrayValueState([]);
                    else {
                      newValues.forEach((e) => {
                        const i = state.block_days.values?.findIndex(
                          (v) => v.value === moment(e).format("YYYY-MM-DD")
                        );
                        if (i === -1) {
                          state.block_days.pushElementValue(
                            moment(e).format("YYYY-MM-DD")
                          );
                        }
                      });

                      state.block_days.values?.forEach((v, j) => {
                        const i = newValues.findIndex(
                          (e) => v.value === moment(e).format("YYYY-MM-DD")
                        );
                        if (i === -1) {
                          state.block_days.deleteElementValue(j);
                        }
                      });
                    }
                  }}
                  onCancel={() => {}}
                  onRemoveAll={() => {
                    let newValues = [moment(new Date()).format("YYYY-MM-DD")];
                    state.block_days = new ArrayValueState(newValues);
                  }}
                  selectedDatesTitle={"Block days"}
                  submitButtonText={"Done"}
                  cancelButtonText={"Cancel"}
                />
              )}
            </Observer>
          </Box>
        </Box>
      </Box>
    </>
  );
}
