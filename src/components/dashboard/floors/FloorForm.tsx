// contexts & globals
import { useGlobalState } from "../../../Contexts & Globals/GlobalContext";

// react & next
import React from "react";

// external dependencies
import { Box, Button, Typography } from "@mui/material";
import { makeAutoObservable } from "mobx";
import { Observer } from "mobx-react-lite";

// orangery elements & internal dependencies
import { FieldError, FormError, ValueState } from "../../../states/mobx-form";
import DeleteFloorButton from "./DeleteFloorButton";
import {
  OrangeryToast,
  OrangeryTextField,
  OrangeryFormWrapper,
  OrangeryButton,
} from "../../OrangeryElements";

// queries & backend
import { IFloor, useUpsertFloor } from "../../../queries/floor";

// icons, images & colors
import LayerIcon from "../../../assets/svg/layer.svg";

export class FloorState {
  public name;
  public uuid;
  public office_uuid;
  public error = "";

  constructor(office_uuid: string, floor?: IFloor) {
    this.office_uuid = new ValueState(office_uuid);
    if (floor) {
      this.name = new ValueState(floor.name);
      this.uuid = new ValueState(floor.uuid);
    } else {
      this.name = new ValueState("");
      this.uuid = new ValueState("");
    }

    makeAutoObservable(this);
  }

  get data() {
    return {
      uuid: this.uuid.value,
      name: this.name.value,
      office_uuid: this.office_uuid.value,
    };
  }

  clearErrors() {
    this.name.error = "";
    this.uuid.error = "";
    this.office_uuid.error = "";
    this.error = "";
  }

  validate() {
    let valid = true;
    this.clearErrors();
    if (!this.name.value) {
      this.name.error = "Please fill your floor name";
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
    } else if (error.field === "name") {
      this.name.error = error.error;
    } else {
      // console.warn(
      //   `the field ${error.field} not found in the field list in FloorForm.`
      // );
    }
  }
}

export default function FloorForm({
  floor,
  officeUuid,
  handleClose,
  noCancel,
  noRemove,
}: {
  floor?: IFloor;
  officeUuid?: string;
  handleClose: () => void;
  noCancel?: any;
  noRemove?: any;
}) {
  const globalState = useGlobalState();
  const state = React.useMemo(
    () => new FloorState(officeUuid ?? globalState.office_uuid, floor),
    [globalState.office_uuid, floor, officeUuid]
  );
  const mutation = useUpsertFloor();
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!state.validate()) {
      return;
    }
    try {
      await mutation.mutateAsync(state.data);
      handleClose();
      if (floor) {
        OrangeryToast("Successfully edited " + state.data.name, "success");
      } else {
        OrangeryToast("Successfully created " + state.data.name, "success");
      }
    } catch (err: any) {
      state.setupError(err);
    }
  }

  return (
    <OrangeryFormWrapper
      onSubmit={handleSubmit}
      onClose={handleClose}
      title={`${floor ? "Edit" : "Create"} Floor`}
      withBorder
      // style={{
      //   width: 601,
      //   height: 395
      // }}
      footer={
        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "center",
            width: "100%",
          }}
        >
          {!noRemove && !floor?.tenant_office_uuid && (
            <Box sx={{ flexGrow: 1 }}>
              {floor && (
                <DeleteFloorButton
                  handleCloseForm={handleClose}
                  floor={floor}
                  label="Remove"
                  sx={{ color: "red" }}
                />
              )}
            </Box>
          )}
          <Observer>
            {() => (
              <Box
                sx={{
                  display: "flex",
                  gap: 2,
                  ml: "auto",
                }}
              >
                {!noCancel && (
                  <OrangeryButton variant="cancel" onClick={handleClose} />
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
                  {floor ? "Save" : "Create"}
                </Button>
              </Box>
            )}
          </Observer>
        </Box>
      }
    >
      <Box
        sx={{
          flex: "0 1 auto",
          pt: 4.5,
          pb: 1,
          px: 4,
          mb: 6,
          width: "100%",
        }}
      >
        <Observer>
          {() => (
            <>
              <OrangeryTextField
                label="FLOOR NAME"
                name="name"
                startIcon={<LayerIcon />}
                placeholder="Please Enter..."
                error={!!state.name.error}
                value={state.name.value}
                helperText={state.name.error}
                onChange={(e: any) => (state.name.value = e.target.value)}
              />
            </>
          )}
        </Observer>
      </Box>
    </OrangeryFormWrapper>
  );
}

function FormErrorMessage({ state }: { state: { error: string } }) {
  return (
    <Observer>{() => <>{state.error && <div>{state.error}</div>}</>}</Observer>
  );
}
