// contexts & globals
import { useGlobalState } from "../../../Contexts & Globals/GlobalContext";

// react & next
import React from "react";

// external dependencies
import { Box, Button, Typography } from "@mui/material";
import { makeAutoObservable } from "mobx";
import { Observer } from "mobx-react-lite";
import {
  ArrayValueState,
  FieldError,
  FormError,
  ValueState,
} from "../../../states/mobx-form";
import DeleteParkingSpotButton from "./DeleteParkingSpotButton";
import {
  OrangeryToast,
  OrangeryTextField,
  OrangeryTextAreaField,
  OrangeryFormWrapper,
} from "../../OrangeryElements";

import {
  IParkingSpot,
  useUpsertParkingSpot,
} from "../../../queries/parkingSpot";
import { UploadImageComponent } from "../../OrangeryElements/OrangeryUploadImage";

export class ParkingSpotState {
  public uuid;
  public name;
  public description;
  public image_uuids;
  public office_uuid;
  public error = "";

  constructor(office_uuid: string, parkingSpot?: IParkingSpot) {
    this.office_uuid = new ValueState(office_uuid);
    if (parkingSpot) {
      this.uuid = new ValueState(parkingSpot.uuid);
      this.name = new ValueState(parkingSpot.name);
      this.description = new ValueState(parkingSpot.description);
      this.image_uuids = new ArrayValueState(
        parkingSpot.images?.map((image) => image.uuid) || []
      );
    } else {
      this.uuid = new ValueState("");
      this.name = new ValueState("");
      this.description = new ValueState("");
      this.image_uuids = new ArrayValueState([]);
    }

    makeAutoObservable(this);
  }

  get data() {
    return {
      uuid: this.uuid.value,
      name: this.name.value,
      description: this.description.value,
      image_uuids: this.image_uuids.values?.map((im) => im.value),
      office_uuid: this.office_uuid.value,
    };
  }

  clearErrors() {
    this.name.clearError();
    this.description.clearError();
    this.error = "";
  }

  validate() {
    let valid = true;
    this.clearErrors();
    if (!this.name.value) {
      this.name.error = "Please fill your parkingSpot name";
      valid = false;
    }
    return valid;
  }

  setupErrors(err: FormError) {
    this.clearErrors();
    err.errors?.forEach((error) => this.setupError(error));
  }

  setupError(error: FieldError) {
    if (error.field === "") {
      this.error = error.error;
    } else if (error.field === "name") {
      this.name.error = error.error;
    } else if (error.field === "description") {
      this.description.error = error.error;
    }
  }
}

export default function ParkingSpotForm({
  parkingSpot,
  handleClose,
  noCancel,
  noRemove,
}: {
  parkingSpot?: IParkingSpot;
  handleClose: () => void;
  noCancel?: any;
  noRemove?: any;
}) {
  const { office_uuid } = useGlobalState();
  const mutation = useUpsertParkingSpot();
  const state = React.useMemo(
    () => new ParkingSpotState(office_uuid, parkingSpot),
    [office_uuid, parkingSpot]
  );
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!state.validate()) {
      return;
    }
    try {
      await mutation.mutateAsync(state.data);
      handleClose();
      if (parkingSpot) {
        OrangeryToast("Successfully edited " + state.data.name, "success");
      } else {
        OrangeryToast("Successfully created " + state.data.name, "success");
      }
    } catch (err: any) {
      state.setupErrors(err);
    }
  }

  return (
    <OrangeryFormWrapper
      onSubmit={handleSubmit}
      onClose={handleClose}
      title={`${parkingSpot ? "Edit" : "Create"} Parking Spot`}
      withBorder
      footer={
        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "center",
            width: "100%",
          }}
        >
          {!noRemove && !parkingSpot?.tenant_office_uuid && (
            <Box sx={{ flexGrow: 1 }}>
              <Observer>
                {() => (
                  <>
                    {parkingSpot && (
                      <DeleteParkingSpotButton
                        handleCloseForm={handleClose}
                        parkingSpot={parkingSpot}
                        label="Remove"
                        sx={{ color: "red" }}
                      />
                    )}
                  </>
                )}
              </Observer>
            </Box>
          )}
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
                      color: "#000",
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
                  {parkingSpot ? "Save" : "Create"}
                </Button>
              </>
            )}
          </Observer>
        </Box>
      }
    >
      <Observer>
        {() => (
          <>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                pt: 4,
                px: 4,
                gap: 1,
                width: "100%",
                height: "463px",
              }}
            >
              <OrangeryTextField
                required
                label="NAME"
                name="name"
                placeholder="Enter Name"
                error={!!state.name.error}
                value={state.name.value}
                helperText={state.name.error}
                onChange={(e: any) => (state.name.value = e.target.value)}
              />
              <Box sx={{ height: "178px" }}>
                <OrangeryTextAreaField
                  multiline
                  required
                  editorHeight="127px"
                  label="DESCRIPTION"
                  name="description"
                  placeholder="Write Description..."
                  error={!!state.description.error}
                  value={state.description.value}
                  helperText={state.description.error}
                  onChange={(e: any) =>
                    (state.description.value = e.target.value)
                  }
                />
              </Box>
              <Observer>
                {() => (
                  <UploadImageComponent
                    limit={1}
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
        )}
      </Observer>
    </OrangeryFormWrapper>
  );
}
