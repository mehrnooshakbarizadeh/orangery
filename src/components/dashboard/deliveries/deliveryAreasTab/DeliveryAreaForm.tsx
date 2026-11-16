// contexts & globals
import { useGlobalState } from "../../../../Contexts & Globals/GlobalContext";

// react & next
import React from "react";

// external dependencies
import { Box } from "@mui/material";
import { makeAutoObservable } from "mobx";
import { Observer } from "mobx-react-lite";

// orangery elements & internal dependencies
import {
  FieldError,
  FormError,
  ValueState,
} from "../../../../states/mobx-form";
import DeliveryAreaRemoveForm from "./DeliveryAreaRemoveForm";
import {
  OrangeryToast,
  OrangeryTextField,
  OrangeryFormWrapper,
  OrangeryButton,
  OrangeryFormButton,
} from "../../../OrangeryElements";

// queries & backend
import {
  IDeliveryArea,
  useUpsertDeliveryArea,
} from "../../../../queries/delivery";

export class DeliveryAreaState {
  public uuid;
  public name;
  public office_uuid;

  public error = "";

  constructor(office_uuid: string, deliveryArea?: IDeliveryArea) {
    this.office_uuid = new ValueState(office_uuid);
    if (deliveryArea) {
      this.uuid = new ValueState(deliveryArea.uuid);
      this.name = new ValueState(deliveryArea.name);
    } else {
      this.uuid = new ValueState("");
      this.name = new ValueState("");
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
    this.name.clearError();
    this.error = "";
  }

  validate() {
    let valid = true;
    this.clearErrors();
    if (!this.name.value) {
      this.name.error = "Please fill your delivery area name";
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
    } else if (error.field === "name") {
      this.name.error = error.error;
    } else {
      // console.warn(
      //   `the field ${error.field} not found in the field list in DeliveryAreaForm.`
      // );
    }
  }
}

export default function DeliveryAreaForm({
  deliveryArea,
  handleClose,
  updateDashboard,
}: {
  deliveryArea?: IDeliveryArea;
  handleClose?: (e?: React.FormEvent) => void;
  updateDashboard?: boolean;
}) {
  const { office_uuid } = useGlobalState();
  const mutation = useUpsertDeliveryArea();
  const state = React.useMemo(
    () => new DeliveryAreaState(office_uuid, deliveryArea),
    [office_uuid, deliveryArea]
  );

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!state.validate()) {
      return;
    }
    try {
      await mutation.mutateAsync({ ...state.data, updateDashboard });
      if (handleClose) handleClose();

      OrangeryToast(
        `Successfully ${deliveryArea ? "edited" : "created"} ${
          state.data.name
        }`,
        "success"
      );
    } catch (err: any) {
      state.setupErrors(err);
    }
  }

  return (
    <OrangeryFormWrapper
      onSubmit={handleSubmit}
      onClose={handleClose}
      title={`${deliveryArea ? "Edit" : "Create"} Delivery Area`}
      withBorder
      style={{
        width: 601,
        height: 395,
      }}
      footer={
        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "center",
            width: "100%",
          }}
        >
          {deliveryArea && (
            <OrangeryFormButton
              variant="remove"
              Form={<DeliveryAreaRemoveForm deliveryArea={deliveryArea} />}
              caption
            />
          )}

          <Box
            sx={{
              display: "flex",
              gap: 2,
              ml: "auto",
            }}
          >
            <OrangeryButton variant="cancel" onClick={handleClose} />

            <OrangeryButton
              variant="submit"
              // onClick={handleClose}
              caption={deliveryArea ? "Save" : "Create"}
              disabled={mutation.isLoading}
            />
          </Box>
        </Box>
      }
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          width: "100%",
          rowGap: 3,
          my: "auto",
          px: 3,
          pt: 3,
        }}
      >
        <Box
          sx={{
            width: "100%",
          }}
        >
          <Observer>
            {() => (
              <OrangeryTextField
                label="NAME"
                name="name"
                // startIcon={<></>}
                placeholder="Delivery Area Name"
                error={!!state.name.error}
                value={state.name.value}
                helperText={state.name.error}
                onChange={(e: any) => (state.name.value = e.target.value)}
              />
            )}
          </Observer>
        </Box>
      </Box>
    </OrangeryFormWrapper>
  );
}
