import { useGlobalState } from "../../../Contexts & Globals/GlobalContext";
import React from "react";
import { Box, Button, Typography, IconButton } from "@mui/material";
import { makeAutoObservable } from "mobx";
import { Observer } from "mobx-react-lite";
import CrossIcon from "../../../assets/svg/cross.svg";
import ArrowLeftIcon from "../../../assets/svg/arrow-left.svg";
import {
  ArrayValueState,
  FieldError,
  FormError,
  StateClass,
  ValueState,
} from "../../../states/mobx-form";
import DeleteMeetingRoomButton from "./DeleteMeetingRoomButton";
import { OrangeryToast } from "../../OrangeryElements";
import {
  IMeetingRoom,
  useUpsertMeetingRoom,
} from "../../../queries/meetingRoom";
import ArrowRightIcon from "../../../assets/svg/arrow-right.svg";
import RoomStepper from "./RoomStepper";
import SidebarSwitchs from "./SidebarSwitchs";
import Form1 from "./Form1";
import Summary from "./Summary";
import { IMedia } from "../../../queries/media";

export class AssetState implements StateClass {
  public grouped_name;
  public asset_type;
  public quantity;
  public price;
  public stock;
  public stockNumber: number = 0;
  public values: number = 0;
  public id: string;
  public error = "";

  constructor(
    grouped_name: string,
    asset_type: string,
    quantity: number,
    price: number,
    stock: number
  ) {
    this.id =
      crypto?.randomUUID?.() || Math.round(Math.random() * 1000000).toString();
    this.grouped_name = new ValueState(grouped_name);
    this.asset_type = new ValueState(asset_type || "Included" || "Optional");
    this.quantity = new ValueState(quantity);
    this.price = new ValueState(price);
    this.stock = new ValueState(stock);
    makeAutoObservable(this);
  }

  setValues(values: number) {
    this.values = values;
  }

  get data() {
    return {
      grouped_name: this.grouped_name.value,
      asset_type: this.asset_type.value,
      quantity: this.quantity.value,
      price: this.price.value,
      stock: this.stock.value,
    };
  }

  clearErrors() {
    this.grouped_name.clearError();
    this.asset_type.clearError();
    this.quantity.clearError();
    this.price.clearError();
    this.stock.clearError();
    this.error = "";
  }
}

export class MeetingRoomState {
  public uuid;
  public name;
  public floor_uuid;
  public department_uuid;
  public capacity;
  public description;
  public image_uuids;
  public tag_uuids;
  public price;
  public daily_price;
  public number_of_hours_to_daily_price;
  public active;
  public payable_via_invoice;
  public office_uuid;
  public assets;
  public thirdlyStock: number = 0;
  public secondaryStock: number = 0;
  public initialStock: number = 0;
  public activeStep = 0;
  public stockNumber: number = 0;
  public result: number = 0;
  public quantityValue: number = 0;
  public error = "";

  constructor(office_uuid: string, meetingRoom?: IMeetingRoom) {
    this.office_uuid = new ValueState(office_uuid);
    if (meetingRoom) {
      this.uuid = new ValueState(meetingRoom.uuid);
      this.name = new ValueState(meetingRoom.name);
      this.floor_uuid = new ValueState(meetingRoom.assigned_floor?.uuid ?? "");
      this.tag_uuids = new ArrayValueState(
        meetingRoom.tags.map((au) => au.uuid)
      );
      this.description = new ValueState(meetingRoom.description);
      this.image_uuids = new ArrayValueState(
        meetingRoom.images?.map((image) => image.uuid)
      );
      this.department_uuid = new ValueState(meetingRoom.department_obj?.uuid);
      this.capacity = new ValueState(meetingRoom.capacity);
      this.price = new ValueState(meetingRoom.price);
      this.daily_price = new ValueState(meetingRoom.daily_price);
      this.number_of_hours_to_daily_price = new ValueState(
        meetingRoom.number_of_hours_to_daily_price
      );
      this.assets = new ArrayValueState<AssetState>(
        meetingRoom.assets?.map(
          (asset) =>
            new AssetState(
              asset.grouped_name,
              asset.asset_type,
              asset.quantity,
              asset.price,
              asset.stock
            )
        )
      );

      this.active = new ValueState(meetingRoom.active);
      this.payable_via_invoice = new ValueState(
        meetingRoom.payable_via_invoice
      );
    } else {
      this.uuid = new ValueState("");
      this.name = new ValueState("");
      this.floor_uuid = new ValueState("");
      this.tag_uuids = new ArrayValueState([]);
      this.description = new ValueState("");
      this.image_uuids = new ArrayValueState([]);
      this.department_uuid = new ValueState("");
      this.capacity = new ValueState(0);
      this.price = new ValueState(0);
      this.daily_price = new ValueState(0);
      this.assets = new ArrayValueState<AssetState>([]);
      this.number_of_hours_to_daily_price = new ValueState(0);
      this.active = new ValueState(true);
      this.payable_via_invoice = new ValueState(false);
    }

    makeAutoObservable(this);
  }

  get data() {
    return {
      uuid: this.uuid.value,
      name: this.name.value,
      description: this.description.value,
      image_uuids: this.image_uuids.values?.map((im) => im.value),
      floor_uuid: this.floor_uuid.value,
      tag_uuids: this.tag_uuids.values.map((v) => v.value),
      department_uuid: this.department_uuid.value,
      capacity: this.capacity.value,
      price: this.price.value,
      assets: this.assets.values.map((asset) => asset.value.data),
      daily_price: this.daily_price.value,
      number_of_hours_to_daily_price: this.number_of_hours_to_daily_price.value,
      active: this.active.value,
      payable_via_invoice: this.payable_via_invoice.value,
      office_uuid: this.office_uuid.value,
    };
  }

  setActiveStep(value: number) {
    this.activeStep = value;
  }

  setInitialStock(value: number) {
    this.initialStock = value;
  }

  setResult(value: number) {
    this.result = value;
  }

  clearErrors() {
    this.name.clearError();
    this.active.clearError();
    this.payable_via_invoice.clearError();
    this.floor_uuid.clearError();
    this.description.clearError();
    this.assets.clearError();
    this.image_uuids.clearError();
    this.tag_uuids.clearError();
    this.department_uuid.clearError();
    this.capacity.clearError();
    this.price.clearError();
    this.daily_price.clearError();
    this.number_of_hours_to_daily_price.clearError();
    this.error = "";
  }

  validate() {
    let valid = true;
    this.clearErrors();
    if (!this.name.value) {
      this.name.error = "Please fill your meetingRoom name";
      valid = false;
    }
    return valid;
  }

  summaryValidate() {
    let valid = true;
    this.clearErrors();
    if (!this.name.value) {
      this.name.error = "Please fill your meetingRoom name";
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
    } else if (error.field === "active") {
      this.active.error = error.error;
    } else if (error.field === "payable_via_invoice") {
      this.payable_via_invoice.error = error.error;
    } else if (error.field === "department_uuid") {
      this.department_uuid.error = error.error;
    } else if (error.field === "description") {
      this.description.error = error.error;
    } else if (error.field === "image_uuids") {
      this.image_uuids.error = error.error;
    } else if (error.field === "capacity") {
      this.capacity.error = error.error;
    } else if (error.field === "floor_uuid") {
      this.floor_uuid.error = error.error;
    } else {
      // console.warn(
      //   `the field ${error.field} not found in the field list in DeskForm.`
      // );
    }
  }
}

export default function HandleRoomForm({
  meetingRoom,
  handleClose,
  asset,
  noCancel,
  noRemove,
}: {
  meetingRoom?: IMeetingRoom;
  handleClose: () => void;
  asset?: AssetState;
  noCancel?: boolean;
  noRemove?: boolean;
}) {
  const { office_uuid } = useGlobalState();
  const state = React.useMemo(
    () => new MeetingRoomState(office_uuid, meetingRoom),
    [office_uuid, meetingRoom]
  );

  return (
    <>
      <Observer>
        {() => (
          <>
            <BaseForm
              asset={asset}
              state={state}
              meetingRoom={meetingRoom}
              handleClose={handleClose}
            />
          </>
        )}
      </Observer>
    </>
  );
}

function BaseForm({
  state,
  asset,
  meetingRoom,
  handleClose,
  noRemove,
}: {
  state: MeetingRoomState;
  asset?: AssetState;
  meetingRoom?: IMeetingRoom;
  handleClose: () => void;
  noRemove?: any;
}) {
  const mutation = useUpsertMeetingRoom();

  const handleNext = (e: React.MouseEvent) => {
    e.preventDefault();

    let valid = true;
    if (state.activeStep === 0) {
      valid = state.validate();
      if (!valid) return;
    }
    if (state.activeStep === 1) {
      valid = state.summaryValidate();
      if (!valid) return;
      handleSubmit();
      return;
    }
    const newActiveStep = state.activeStep + 1;
    state.setActiveStep(newActiveStep);
  };

  const handleBack = (e: React.MouseEvent) => {
    e.preventDefault();
    if (state.activeStep <= 0) return;
    state.setActiveStep(state.activeStep - 1);
  };

  async function handleSubmit() {
    if (!state.summaryValidate()) {
      return;
    }
    try {
      const result = await mutation.mutateAsync(state.data);
      handleClose();

      if (meetingRoom) {
        OrangeryToast("Successfully edited " + state.data.name, "success");
      } else {
        OrangeryToast("Successfully created " + state.data.name, "success");
      }
    } catch (err: any) {
      state.setupErrors(err);
    }
  }

  return (
    <>
      <Box
        sx={{
          pr: 3,
          pl: 3,
          py: 3,
          gap: 4,
          display: "flex",
          // flexDirection: 'column',
          justifyContent: "space-between",
          alignItems: "center",
          borderBottom: "1px solid #EDEEF0",
        }}
      >
        <Typography sx={{ fontSize: 24, fontWeight: 600, color: "#000" }}>
          {`${meetingRoom ? "Edit" : "Create"} Meeting Room`}
        </Typography>
        <Box sx={{ width: "44%" }}>
          <Observer>
            {() => <RoomStepper state={state} activeStep={state.activeStep} />}
          </Observer>
        </Box>

        <IconButton
          onClick={handleClose}
          sx={{
            display: "flex",
            "& .cancel-icon": { width: "1.3rem", height: "1.3rem" },
          }}
        >
          <CrossIcon className="cancel-icon" />
        </IconButton>
      </Box>

      <Box
        sx={{
          display: "flex",
          justifyContent: "end",
          width: "100%",
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            flexGrow: 1,
            width: "100%",
            mr: 2,
            mt: 2,
            height: "733px",
            overflow: "auto",
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
              <React.Fragment>
                {state.activeStep === 0 && (
                  <Form1
                    state={state}
                    meetingRoom={meetingRoom}
                    asset={asset}
                  />
                )}
                {state.activeStep === 1 && <Summary state={state} />}
              </React.Fragment>
            )}
          </Observer>
        </Box>
        <Observer>
          {() => <SidebarSwitchs state={state} meetingRoom={meetingRoom} />}
        </Observer>
      </Box>
      <Box
        sx={{
          width: "100%",
          py: 2,
          borderTop: "1px solid #EDEEF0",
          display: "flex",
          gap: 2,
          pr: 2,
          position: "absolute",
          right: 0,
          bottom: "16px",
          justifyContent: "end",
          "& .add-btn": { width: "1.3rem", height: "1.3rem" },
        }}
      >
        <Box sx={{ flexGrow: 1, pl: 6 }}>
          {!noRemove && !meetingRoom?.tenant_office_uuid && (
            <Box sx={{ flexGrow: 1 }}>
              <Observer>
                {() => (
                  <>
                    {meetingRoom && (
                      <DeleteMeetingRoomButton
                        handleCloseForm={handleClose}
                        meetingRoom={meetingRoom}
                        label="Remove"
                        sx={{ color: "red" }}
                      />
                    )}
                  </>
                )}
              </Observer>
            </Box>
          )}
        </Box>
        <Observer>
          {() => (
            <>
              {state.activeStep !== 0 ? (
                <Button
                  variant="text"
                  disabled={state.activeStep === 0}
                  onClick={handleBack}
                  sx={{
                    display: "flex",
                    gap: 2,
                    mr: 1,
                    py: "12px",
                    px: 5,
                  }}
                >
                  <ArrowLeftIcon className="add-btn" />
                  <Typography variant="h5" color="#2B2E33">
                    Back
                  </Typography>
                </Button>
              ) : (
                <Button
                  variant="text"
                  // disabled={state.activeStep === 0}
                  onClick={handleClose}
                  sx={{
                    display: "flex",
                    gap: 2,
                    mr: 1,
                    py: "12px",
                    px: 5,
                  }}
                >
                  <Typography variant="h5" color="#2B2E33">
                    Cancel
                  </Typography>
                </Button>
              )}
            </>
          )}
        </Observer>

        <Observer>
          {() => (
            <Button
              onClick={handleNext}
              sx={{
                display: "flex",
                gap: 2,
                mr: 1,
                py: "12px",
                px: 5,
              }}
              color="primary"
              variant="contained"
              disabled={mutation.isLoading}
            >
              {state.activeStep === 1 ? (
                <Typography className="add-letter">
                  {meetingRoom ? "Save" : "Create"}
                </Typography>
              ) : (
                <>
                  <Typography className="add-letter">Next</Typography>
                  <ArrowRightIcon className="add-btn" />
                </>
              )}
            </Button>
          )}
        </Observer>
      </Box>
    </>
  );
}
