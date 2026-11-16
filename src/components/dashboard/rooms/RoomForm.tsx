// contexts & globals
import { useGlobalState } from "../../../Contexts & Globals/GlobalContext";

// react & next
import React from "react";

// external dependencies
import {
  Box,
  Button,
  Typography,
  TextField,
  InputAdornment,
  IconButton,
} from "@mui/material";
import { makeAutoObservable } from "mobx";
import { Observer } from "mobx-react-lite";
import NumberFormat from "react-number-format";
import CrossIcon from "../../../assets/svg/cross.svg";
import RoomIcon from "../../../assets/svg/room/VectorRoom.svg";

// orangery elements & internal dependencies
import {
  FieldError,
  FormError,
  ValueState,
  ArrayValueState,
} from "../../../states/mobx-form";
import HandleDeskFieldSelector from "./addDesk/HandleDeskFieldSelector";
import HandleAssetFieldSelector from "./addAsset/HandleAssetFieldSelector";
import HandleSelectedItem from "./showSelectedItems/HandleSelectedItem";
import DeleteRoomButton from "./DeleteRoomButton";
import {
  OrangeryTextField,
  OrangerySwitch,
  OrangeryFormWrapper,
  OrangeryDepartmentAutocomplete,
} from "../../OrangeryElements";
import {
  OrangeryToast,
  OrangeryEmployeesAutocomplete,
  OrangeryImagesField,
  OrangeryFloorAutocomplete,
} from "../../OrangeryElements";
// import CustomizedSwitches from "../../OrangeryElements/CustomizedSwitches";

// queries & backend
import { IRoom, useUpsertRoom } from "../../../queries/room";

// icons, images & colors
import CapacityIcon from "../../../assets/svg/capacity.svg";
import ChairOfficeIcon from "../../../assets/svg/chairOffice.svg";
import HandleDoorFieldSelector from "./addDoor/HandleDoorFieldSelector";
import { IDoor } from "../../../queries/door";
import { UploadImageComponent } from "../../OrangeryElements/OrangeryUploadImage";

export class RoomFormState {
  public office_uuid;

  public uuid;
  public name;
  public description;
  public capacity;
  public floor_uuid;
  public department_uuid;
  public images;

  public desks;
  public assets;
  public doors;
  public user_uuids;

  public active;

  public error = "";

  constructor(office_uuid: string, room?: IRoom) {
    this.office_uuid = new ValueState(office_uuid);
    if (room) {
      this.uuid = new ValueState(room.uuid);
      this.name = new ValueState(room.name);
      this.description = new ValueState(room.description);
      this.capacity = new ValueState(room.capacity);
      this.floor_uuid = new ValueState(room.floor?.uuid ?? "");
      this.department_uuid = new ValueState(room.department?.uuid ?? "");
      this.images = new ArrayValueState(room.images.map((image) => image.uuid));
      this.desks = new ArrayValueState(room.desks.map((desk) => desk.uuid));
      this.assets = new ArrayValueState(room.assets.map((asset) => asset.uuid));
      this.doors = new ArrayValueState(
        room.doors?.map((door) => door?.lock_id) || []
      );
      this.user_uuids = new ArrayValueState(
        room.users.map((user) => user.uuid)
      );
      this.active = new ValueState(room.active);
    } else {
      this.uuid = new ValueState("");
      this.name = new ValueState("");
      this.description = new ValueState("");
      this.capacity = new ValueState(1);
      this.floor_uuid = new ValueState("");
      this.department_uuid = new ValueState("");
      this.images = new ArrayValueState([]);
      this.desks = new ArrayValueState([]);
      this.assets = new ArrayValueState([]);
      this.doors = new ArrayValueState([]);
      this.user_uuids = new ArrayValueState([]);
      this.active = new ValueState(true);
    }

    makeAutoObservable(this);
  }

  get data() {
    return {
      office_uuid: this.office_uuid.value,

      uuid: this.uuid.value,
      name: this.name.value,
      description: this.description.value,
      capacity: this.capacity.value,
      floor_uuid: this.floor_uuid.value,
      department_uuid: this.department_uuid.value,
      images: this.images.values.map((v) => v.value),
      desks: this.desks.values.map((v) => v.value),
      assets: this.assets.values.map((v) => v.value),
      doors: this.doors.values.map((v) => v.value),
      user_uuids: this.user_uuids.values.map((v) => v.value),
      active: this.active.value,
    };
  }

  clearErrors() {
    this.uuid.clearError();

    this.name.clearError();
    this.description.clearError();
    this.capacity.clearError();
    this.floor_uuid.clearError();
    this.department_uuid.clearError();
    this.images.clearError();
    this.desks.clearError();
    this.assets.clearError();
    this.doors.clearError();
    this.user_uuids.clearError();
    this.active.clearError();

    this.error = "";
  }

  validate() {
    let valid = true;
    this.clearErrors();
    if (!this.name.value) {
      this.name.error = "Please fill your room name";
      valid = false;
    }
    // if (!this.capacity.value) {
    //   this.capacity.error = "Please assign a capacity";
    //   valid = false;
    // }
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
    } else if (error.field === "description") {
      this.description.error = error.error;
    } else if (error.field === "capacity") {
      this.capacity.error = error.error;
    } else if (error.field === "floor_uuid") {
      this.floor_uuid.error = error.error;
    } else if (error.field === "department_uuid") {
      this.department_uuid.error = error.error;
    } else if (error.field === "images") {
      this.images.error = error.error;
    } else if (error.field === "desks") {
      this.desks.error = error.error;
    } else if (error.field === "doors") {
      this.doors.error = error.error;
    } else if (error.field === "assets") {
      this.assets.error = error.error;
    } else if (error.field === "user_uuids") {
      this.user_uuids.error = error.error;
    } else if (error.field === "active") {
      this.active.error = error.error;
    } else {
      // console.warn(
      //   `the field ${error.field} not found in the field list in RoomForm.`
      // );
    }
  }
}

export default function RoomForm({
  room,
  handleClose,
  noCancel,
  noRemove,
}: {
  room?: IRoom;
  handleClose: () => void;
  noCancel?: any;
  noRemove?: any;
}) {
  const globalState = useGlobalState();
  // const { office_uuid } = useGlobalState();
  const mutation = useUpsertRoom();
  const state = React.useMemo(
    () => new RoomFormState(globalState.office_uuid, room),
    [globalState.office_uuid, room]
  );
  const isTennant = !!globalState.currentOffice.parent_office_uuid;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!state.validate()) {
      return;
    }
    try {
      await mutation.mutateAsync(state.data);
      handleClose();
      OrangeryToast(
        `Successfully ${room ? "edited" : "created"} ${state.data.name}`,
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
      title={`${room ? "Edit" : "Create"} Room`}
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
          {!noRemove && !room?.tenant_office_uuid && (
            <Box sx={{ flexGrow: 1 }}>
              {room && (
                <DeleteRoomButton
                  handleCloseForm={handleClose}
                  room={room}
                  label="Remove"
                  sx={{ color: "red" }}
                />
              )}
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
                      color: "#2B2E33",
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
                  {room ? "Save" : "Create"}
                </Button>
              </>
            )}
          </Observer>
        </Box>
      }
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "end",
          height: "575px",
          width: "100%",
        }}
      >
        <Observer>
          {() => (
            <Box
              sx={{
                display: "flex",
                flexBasis: "70%",
                // flexGrow: 1,
                flexDirection: "column",
                pt: 6,
                // pb: 14,
                pl: 4,
                pr: 2,
                mr: 1,
                rowGap: 2,
                height: "100%",
                overflowY: "auto",
                "&::-webkit-scrollbar": {
                  width: "0.4em",
                },
                "&::-webkit-scrollbar-track": {
                  // boxShadow: "inset 0 0 6px rgba(0,0,0,0.00)",
                  // webkitBoxShadow: "inset 0 0 6px rgba(0,0,0,0.00)",
                },
                "&::-webkit-scrollbar-thumb": {
                  backgroundColor: "rgba(0,0,0,.1)",
                  // outline: "1px solid slategrey",
                  borderRadius: 5,
                },
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  flexDirection: {
                    xs: "column",
                    sm: "row",
                  },
                  gap: 2,
                }}
              >
                <Box sx={{ flexBasis: "25%" }}>
                  <OrangeryTextField
                    label="NAME"
                    name="name"
                    startIcon={<RoomIcon />}
                    placeholder="Enter Room Name"
                    error={!!state.name.error}
                    value={state.name.value}
                    helperText={state.name.error}
                    onChange={(e: any) => (state.name.value = e.target.value)}
                  />
                </Box>

                <Box sx={{ flexBasis: "25%" }}>
                  <OrangeryFloorAutocomplete
                    label="FLOOR"
                    placeholder="Select/Create Floor"
                    value={state.floor_uuid.value}
                    onChange={(newValue) => {
                      state.floor_uuid.value = newValue;
                    }}
                  />
                </Box>

                <Box sx={{ flexBasis: "25%" }}>
                  <OrangeryDepartmentAutocomplete
                    label="DEPARTMENT"
                    placeholder="Select/Create Department"
                    value={state.department_uuid.value}
                    onChange={(newValue) => {
                      state.department_uuid.value = newValue;
                    }}
                  />
                </Box>

                <Box sx={{ flexBasis: "25%" }}>
                  <NumberFormat
                    customInput={OrangeryTextField}
                    label="CAPACITY"
                    startIcon={<CapacityIcon className="stock-icon" />}
                    type="text"
                    allowNegative={false}
                    value={state.capacity.value?.toString()}
                    error={!!state.capacity.error}
                    helperText={state.capacity.error}
                    onChange={(e: any) =>
                      (state.capacity.value = parseInt(e.target.value))
                    }
                  />
                </Box>
              </Box>
              <Box>
                <OrangeryEmployeesAutocomplete
                  sx={{ mb: 2 }}
                  label="COWORKERS"
                  value={state.user_uuids.values.map((e) => e.value)}
                  onChange={(newValues) => {
                    newValues.forEach((e) => {
                      const i = state.user_uuids.values.findIndex(
                        (v) => v.value === e
                      );
                      if (i === -1) {
                        state.user_uuids.pushElementValue(e);
                      }
                    });
                    state.user_uuids.values.forEach((v, j) => {
                      const i = newValues.findIndex((e) => v.value === e);
                      if (i === -1) {
                        state.user_uuids.deleteElementValue(j);
                      }
                    });
                  }}
                />
              </Box>

              <Box sx={{ width: "100%" }}>
                <Observer>
                  {() => (
                    <UploadImageComponent
                      sx={{ width: "100%" }}
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

              <Box
                sx={{
                  display: "flex",
                  flexWrap: "wrap",
                  mt: 2,
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    flexBasis: {
                      xs: "100%",
                      sm: "52%",
                    },
                    gap: 1,
                  }}
                >
                  <Typography component="h6" variant="H6">
                    Include items (optional)
                  </Typography>
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "row",
                      alignItems: "center",
                      gap: 2,
                      pt: 1,
                    }}
                  >
                    <Observer>
                      {() => <HandleDeskFieldSelector state={state} />}
                    </Observer>
                    <Observer>
                      {() => <HandleAssetFieldSelector state={state} />}
                    </Observer>
                    {isTennant ? (
                      ""
                    ) : (
                      <Observer>
                        {() => <HandleDoorFieldSelector state={state} />}
                      </Observer>
                    )}
                  </Box>
                  <Observer>
                    {() => (
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          pt: 1,
                          whiteSpace: "nowrap",
                        }}
                      >
                        <Typography fontSize={16} fontWeight={400}>
                          {state.desks.values.length === 0 &&
                          state.assets.values.length === 0 &&
                          state.doors.values.length === 0
                            ? `You added nothing to the room.`
                            : `You added ${state.desks.values.length} desk${
                                state.desks.values.length > 1 ? "s" : ""
                              } and ${state.assets.values.length} asset${
                                state.assets.values.length > 1 ? "s" : ""
                              } and ${state.doors.values.length} door${
                                state.doors.values.length > 1 ? "s" : ""
                              } to the room,`}
                        </Typography>
                        {state.desks.values.length > 0 ||
                        state.assets.values.length > 0 ||
                        state.doors.values.length > 0 ? (
                          <HandleSelectedItem state={state} />
                        ) : (
                          ""
                        )}
                      </Box>
                    )}
                  </Observer>
                </Box>
              </Box>
            </Box>
          )}
        </Observer>

        <Observer>
          {() => (
            <Box
              sx={{
                width: "359px",
                height: "575px",
                backgroundColor: "#F7F8FA",
                p: 3,
              }}
            >
              <Box sx={{ pt: 3, pb: 1 }}>
                <Box sx={{ borderBottom: "1px solid rgb(154, 156, 160)" }} />
                <Typography
                  sx={{
                    m: "-14px 0px 0px",
                    color: "rgb(154, 156, 160)",
                    backgroundColor: "rgb(247, 248, 250)",
                    width: "120px",
                    fontSize: "16px",
                    fontWeight: "700",
                  }}
                >
                  Main Functions
                </Typography>
              </Box>
              {!room?.tenant_office_uuid ? (
                <Box>
                  <OrangerySwitch
                    label={{ checked: "Enable", unchecked: "Disable" }}
                    checkedLabels={{ checked: "Ready to use", unchecked: "" }}
                    checked={state.active.value}
                    onChange={(e) => (state.active.value = e.target.checked)}
                  />
                </Box>
              ) : (
                <Typography
                  sx={{
                    fontSize: "16px",
                    fontWeight: "700",
                    color: "#000",
                  }}
                >
                  There is no main function.
                </Typography>
              )}
            </Box>
          )}
        </Observer>
      </Box>
    </OrangeryFormWrapper>
  );
}
