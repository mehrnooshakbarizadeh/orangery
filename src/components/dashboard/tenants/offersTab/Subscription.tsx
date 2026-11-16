// react & next
import React from "react";

// external dependencies
import { Box, InputAdornment, TextField, Grid } from "@mui/material";
import NumberFormat from "react-number-format";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { Observer } from "mobx-react-lite";

// orangery elements & internal dependencies
import { OfferFieldsState } from "./HandleOfferForm";
import {
  OrangerySwitch,
  OrangeryDocumentsField,
} from "../../../OrangeryElements";

// icons, images & colors
import EuroIcon from "../../../../assets/svg/euro.svg";
import PercentIcon from "../../../../assets/svg/percent.svg";
import OrangeryUploadMultiPDF from "../../../OrangeryElements/OrangeryUploadMultiPDF";

export default function Subscription({
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
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 2,
            mb: 2,
            "& .column-align": { width: "180px" },
          }}
        >
          <Box className="column-align">
            <Observer>
              {() => (
                <Box sx={{ width: "100%", height: "85px" }}>
                  <NumberFormat
                    value={state.quantity.value.toString()}
                    customInput={TextField}
                    fullWidth
                    label="Quantity"
                    type="text"
                    // disabled={state.desks.values.length > 0 || state.assets.values.length > 0 || state.room_uuids.values.length > 0}
                    allowNegative={false}
                    error={!!state.quantity.error}
                    helperText={state.quantity.error}
                    onChange={(e: any) =>
                      (state.quantity.value = e.target.value)
                    }
                  />
                </Box>
              )}
            </Observer>
          </Box>
          <Box className="column-align">
            <Observer>
              {() => (
                <Box sx={{ width: "100%", height: "85px" }}>
                  <NumberFormat
                    disabled={state.offer_is_free.value}
                    thousandsGroupStyle="wan"
                    fixedDecimalScale={true}
                    value={
                      state.offer_is_free.value
                        ? 0
                        : state.price.value?.toString()
                    }
                    // prefix="$"
                    decimalSeparator="."
                    customInput={TextField}
                    fullWidth
                    label="Monthly Price"
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
                </Box>
              )}
            </Observer>
          </Box>

          <Box className="column-align">
            <Observer>
              {() => (
                <Box sx={{ width: "100%", height: "85px" }}>
                  <NumberFormat
                    disabled={state.offer_is_free.value}
                    thousandsGroupStyle="wan"
                    fixedDecimalScale={true}
                    value={
                      state.offer_is_free.value
                        ? 0
                        : state.deposit.value?.toString()
                    }
                    // prefix="$"
                    decimalSeparator="."
                    customInput={TextField}
                    fullWidth
                    label="Deposit"
                    name="deposit"
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
                    error={!!state.deposit.error}
                    // helperText={state.deposit.error}
                    onChange={(e: any) =>
                      (state.deposit.value = parseFloat(e.target.value))
                    }
                  />
                </Box>
              )}
            </Observer>
          </Box>

          <Box className="column-align">
            <Observer>
              {() => (
                <Box sx={{ width: "100%", height: "85px" }}>
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
                </Box>
              )}
            </Observer>
          </Box>
        </Box>

        <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: "38px" }}>
          <Box sx={{ width: "246px" }}>
            <Observer>
              {() => (
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DatePicker
                    inputFormat="dd.MM.yyyy"
                    mask="__.__.____"
                    disablePast={!editMode}
                    label="Contract Start Date"
                    value={state.contract_start_date.value}
                    onChange={(newValue: any) => {
                      state.contract_start_date.value = newValue;
                      // if (newValue) {
                      //   state.contract_end_date.value = new Date(
                      //     newValue.getTime() + 30 * 24 * 3600000
                      //   );
                      // }
                    }}
                    renderInput={(props) => <TextField {...props} fullWidth />}
                  />
                </LocalizationProvider>
              )}
            </Observer>
          </Box>

          <Box sx={{ width: "246px" }}>
            <Observer>
              {() => (
                <NumberFormat
                  value={state.minimum_contract_duration.value?.toString()}
                  customInput={TextField}
                  fullWidth
                  label="Min. contract duration (optional)"
                  type="text"
                  allowNegative={false}
                  error={!!state.minimum_contract_duration.error}
                  // helperText={state.minimum_contract_duration.error}
                  onChange={(e: any) =>
                    (state.minimum_contract_duration.value = parseInt(
                      e.target.value
                    ))
                  }
                />
              )}
            </Observer>
          </Box>

          <Box sx={{ width: "246px" }}>
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
      </Box>
    </>
  );
}
