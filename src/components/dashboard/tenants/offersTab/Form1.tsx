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
import {
  OrangeryTextField,
  OrangeryTextAreaField,
  OrangeryImagesField,
  OrangeryMultiDatepicker,
} from "../../../OrangeryElements";
import ProductType from "./ProductType";
import { UploadImageComponent } from "../../../OrangeryElements/OrangeryUploadImage";

export default function Form1({ state }: { state: OfferFieldsState }) {
  const handleProductType = (productType: string) => {
    if (productType === "hybrid_office") {
      state.payment_method.value = "subscription";
    }
    if (productType === "mobility") {
      state.setMobility(true);
      state.offer_is_free.value = true;
      if (state.offer_is_free.value) {
        state.date_picker.value = true;
        state.hourly_select.value = true;
      } else {
        state.date_picker.value = false;
        state.hourly_select.value = false;
      }
    } else {
      state.setMobility(false);
      state.offer_is_free.value = false;
    }
  };

  return (
    <form>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          rowGap: 3,
          "& .header": { mb: 2 },
        }}
      >
        <Box className="header">
          <Typography variant="h1">Initial Step</Typography>
        </Box>
        <Box sx={{ width: "44%" }}>
          <Observer>
            {() => (
              <ProductType
                label="OFFER TYPE"
                name="product_type"
                // placeholder="%"
                error={!!state.product_type.error}
                value={state.product_type.value}
                helperText={state.product_type.error}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  state.setProducttype(e.target.value);
                  handleProductType(e.target.value);
                }}
              />
            )}
          </Observer>
        </Box>

        <Box sx={{ width: "44%" }}>
          <Observer>
            {() => (
              <OrangeryTextField
                name="name"
                label="Product Name"
                placeholder="Enter Product Name"
                value={state.name.value}
                error={!!state.name.error}
                helperText={state.name.error}
                onChange={(e) => (state.name.value = e.target.value)}
              />
            )}
          </Observer>
        </Box>

        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Box sx={{ width: "44%" }}>
            <Observer>
              {() => (
                <OrangeryTextAreaField
                  sx={{
                    height: "80px",
                    mb: 3,
                  }}
                  label="Description"
                  name="description"
                  multiline
                  placeholder="Enter Description"
                  error={!!state.description.error}
                  value={state.description.value}
                  helperText={state.description.error}
                  onChange={(e: any) =>
                    (state.description.value = e.target.value)
                  }
                />
              )}
            </Observer>
          </Box>
          <Box sx={{ width: "44%" }}>
            <Observer>
              {() => (
                <OrangeryTextAreaField
                  sx={{
                    height: "80px",
                    mb: 3,
                  }}
                  label="Instructions"
                  name="instructions"
                  multiline
                  placeholder="Enter Instructions"
                  error={!!state.instructions.error}
                  value={state.instructions.value}
                  helperText={state.instructions.error}
                  onChange={(e: any) =>
                    (state.instructions.value = e.target.value)
                  }
                />
              )}
            </Observer>
          </Box>
        </Box>

        <Box sx={{ width: "100%", mt: 3 }}>
          <Observer>
            {() => (
              <UploadImageComponent
                images={state.images.values?.map((v) => v.value)}
                handleChange={(newValues) => {
                  newValues.forEach((e) => {
                    const i = state.images.values.findIndex(
                      (v) => v.value === e
                    );
                    if (i === -1) {
                      state.images.pushElementValue(e);
                    }
                  });
                  state.images.values.forEach((v, j) => {
                    const i = newValues.findIndex((e) => v.value === e);
                    if (i === -1) {
                      state.images.deleteElementValue(j);
                    }
                  });
                }}
              />
            )}
          </Observer>
        </Box>
      </Box>
    </form>
  );
}
