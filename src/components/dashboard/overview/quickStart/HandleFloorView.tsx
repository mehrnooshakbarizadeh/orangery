// contexts & globals
import { useGlobalState } from "../../../../Contexts & Globals/GlobalContext";

// react & next
import React from "react";

// external dependencies
import { Box } from "@mui/material";
import { makeAutoObservable, observable } from "mobx";
import { Observer } from "mobx-react-lite";

// orangery elements & internal dependencies
import {
  ArrayValueState,
  FieldError,
  FormError,
  StateClass,
  ValueState,
} from "../../../../states/mobx-form";
// queries & backend

// icons, images & colors
import { HandleStateAnimation } from "./HandleStateAnimation";
import { QuickStartForm } from "./QuickStartForm";

export class FloorState implements StateClass {
  public name;
  public rooms;
  public desks;
  public meeting_rooms;

  constructor(
    name: string,
    rooms: number,
    desks: number,
    meeting_rooms: number
  ) {
    this.name = new ValueState(name);
    this.rooms = new ValueState(rooms);
    this.desks = new ValueState(desks);
    this.meeting_rooms = new ValueState(meeting_rooms);
    makeAutoObservable(this);
  }

  get data() {
    return {
      name: this.name.value,
      rooms: this.rooms.value,
      desks: this.desks.value,
      meeting_rooms: this.meeting_rooms.value,
    };
  }
}

export class QuickStartState {
  public office_uuid;

  public parking_spots: number = 0;

  public floors;

  public welcomeOrangeryState: boolean = true;
  public createFloorState: boolean = false;
  public buildingState: boolean = false;
  public errorState: boolean = false;

  public error = "";

  constructor(office_uuid: string) {
    this.office_uuid = new ValueState(office_uuid);
    this.floors = new ArrayValueState<FloorState>([]);

    makeAutoObservable(this);
  }

  setParkings(value: number) {
    this.parking_spots = value;
  }

  setWelcomeOrangeryState(value: boolean) {
    this.welcomeOrangeryState = value;
  }

  setCreateFloorState(value: boolean) {
    this.createFloorState = value;
  }

  setBuildingState(value: boolean) {
    this.buildingState = value;
  }

  setErrorState(value: boolean) {
    this.errorState = value;
  }

  isReady() {
    let ready = true;
    if (this.floors.values.length === 0) ready = false;
    const hasEmptyNameInFloor = this.floors.values.find(
      (f) => !f.value.name.value
    );
    if (hasEmptyNameInFloor) ready = false;
    return ready;
  }

  get data() {
    return {
      office_uuid: this.office_uuid.value,
      parking_spots: this.parking_spots,
      floors: this.floors.values.map((f) => f.value.data),
    };
  }

  clearErrors() {
    this.office_uuid.error = "";
    this.error = "";
  }

  validate() {
    let valid = true;
    this.clearErrors();
    return valid;
  }

  setupErrors(err: FormError) {
    this.clearErrors();
    err.errors.forEach((error) => this.setupError(error));
  }

  setupError(error: FieldError) {}
}

export default function HandleFloorView({
  handleClose,
  noCancel,
  noRemove,
}: {
  handleClose: () => void;
  noCancel?: any;
  noRemove?: any;
}) {
  const globalState = useGlobalState();
  const state = React.useMemo(
    () => new QuickStartState(globalState.office_uuid),
    [globalState.office_uuid]
  );
  return (
    <>
      <Box sx={{ display: "flex", justifyContent: "end" }}>
        <Observer>
          {() => (
            <Box
              sx={{
                flexGrow: "1",
                width: state.createFloorState ? "66%" : 0,
                display:
                  state.welcomeOrangeryState || state.buildingState
                    ? "none"
                    : "block",
                transition: "2000ms",
              }}
            >
              <QuickStartForm state={state} handleClose={handleClose} />
            </Box>
          )}
        </Observer>
        <Observer>
          {() => (
            <>
              <Box
                sx={{
                  flexShrink: 1,
                  width:
                    state.buildingState || state.welcomeOrangeryState
                      ? "100%"
                      : "34%",
                  transitionProperty: "width",
                  transition: "400ms",
                }}
              >
                <HandleStateAnimation state={state} />
              </Box>
            </>
          )}
        </Observer>
      </Box>
    </>
  );
}
