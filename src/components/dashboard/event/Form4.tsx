import { Box } from "@mui/material";
import { Observer } from "mobx-react-lite";
import { OrangeryImagesField } from "../../OrangeryElements";

import { EventFieldsState } from "./EventForm";
import { UploadImageComponent } from "../../OrangeryElements/OrangeryUploadImage";

export default function Form4({ state }: { state: EventFieldsState }) {
  return (
    <>
      <Box sx={{ width: "100%" }}>
        <Observer>
          {() => (
            <UploadImageComponent
              sx={{ width: "100%" }}
              images={state.image_uuids.values?.map((v) => v.value)}
              handleChange={(newValues) => {
                newValues.forEach((e) => {
                  const i = state.image_uuids.values.findIndex(
                    (v) => v.value === e
                  );
                  if (i === -1) {
                    state.image_uuids.pushElementValue(e);
                  }
                });
                state.image_uuids.values.forEach((v, j) => {
                  const i = newValues.findIndex((e) => v.value === e);
                  if (i === -1) {
                    state.image_uuids.deleteElementValue(j);
                  }
                });
              }}
            />
          )}
        </Observer>
      </Box>
    </>
  );
}
