// contexts & globals
import { useGlobalState } from "../../../../Contexts & Globals/GlobalContext";

// react & next
import React, { useEffect } from "react";

// external dependencies
import { Box, Button, Typography, TextField, InputAdornment, IconButton } from "@mui/material";
import { makeAutoObservable } from "mobx";
import { Observer } from "mobx-react-lite";
import NumberFormat from "react-number-format";

// orangery elements & internal dependencies
import { ArrayValueState, FieldError, FormError, ValueState } from "../../../../states/mobx-form";
import DeleteMeetingRoomButton from "./DeleteAutomationButton";
import {
  OrangeryToast,
  OrangeryTextField,
  OrangerySwitch,
  OrangeryFloorAutocomplete,
  OrangeryTextAreaField,
  OrangeryFormWrapper,
  OrangeryImagesField,
} from "../../../OrangeryElements";
import AutomationFormScaffold, { AutomationFlowPreview } from "./AutomationFormScaffold";

// queries & backend
import { IAutomation, useAutomation, useAutomations } from "../../../../queries/apps/automations";
import NameForm from "./forms/NameForm";
import DoorsForm from "./forms/DoorsForm";
import OfferTypesForm from "./forms/OfferTypesForm";
import OffersForm from "./forms/OffersForm";
import UserRolesForm from "./forms/UserRolesForm";
import OfficeForm from "./forms/OfficeForm";
import DurationForm from "./forms/DurationForm";
import ValidationDateTimeForm from "./forms/ValidationDateTimeForm";

// icons, images & colors




export class AutomationFormState {
  public uuid;
  public name;
  public doors;
  public offer_types;
  public offers;
  public groups;
  public office;
  public accessFromTime;
  public accessUntilTime;
  public activeFrom;
  public activeUntil;
  public step;
  public error = "";

  constructor(automation?: IAutomation, index?: number) {
    if (automation) {
      this.uuid = new ValueState(automation.uuid);
      this.name = new ValueState(automation.name);
      this.doors = new ArrayValueState<string>(automation.doors?.map((door) => door.lock_id) ?? []);
      this.offer_types = new ArrayValueState<string>(automation.offer_types?.map((offer_type) => offer_type) ?? []);
      this.offers = new ArrayValueState<string>(automation.products?.map((product) => product.uuid) ?? []);
      this.groups = new ArrayValueState<string>(automation.groups?.map((group) => group) ?? []);
      this.office = new ValueState(automation.office?.uuid);
      this.accessFromTime = new ValueState(automation.access_from_time);
      this.accessUntilTime = new ValueState(automation.access_until_time);
      this.activeFrom = new ValueState(automation.active_from);
      this.activeUntil = new ValueState(automation.active_until);
      this.step = new ValueState(index ?? 0);
    } else {
      this.uuid = new ValueState("");
      this.name = new ValueState("");
      this.doors = new ArrayValueState<string>([]);
      this.offer_types = new ArrayValueState<string>([]);
      this.offers = new ArrayValueState<string>([]);
      this.groups = new ArrayValueState<string>([]);
      this.office = new ValueState("");
      this.accessFromTime = new ValueState<string | null>(null);
      this.accessUntilTime = new ValueState<string | null>(null);
      this.activeFrom = new ValueState<string | null>(null);
      this.activeUntil = new ValueState<string | null>(null);
      this.step = new ValueState(index ?? 0);
    }
    makeAutoObservable(this);
  }

  get data() {
    return {
      uuid: this.uuid.value,
      name: this.name.value,
      doors: this.doors.values?.map((door) => door.value),
      offer_types: this.offer_types.values?.map((offer_type) => offer_type.value),
      products_uuids: this.offers.values?.map((offer) => offer.value),
      groups: this.groups.values?.map((group) => group.value),
      office_uuid: this.office.value,
      access_from_time: this.accessFromTime.value,
      access_until_time: this.accessUntilTime.value,
      active_from: this.activeFrom.value,
      active_until: this.activeUntil.value,
    };
  }

  private steps = [0, 1, 2, 3, 4, 5, 6, 7]

  setStep(step: number) {
    this.step.value = step;
  }

  mode(index: number) {
    const tempMode = index < this.step.value
      ? "done"
      : index === this.step.value
        ? "active"
        : "inactive"
    return tempMode
  }

  clearGroups() {
    this.groups = new ArrayValueState<string>([]);
  }

  clearOfferTypes() {
    this.offer_types = new ArrayValueState<string>([]);
  }

  clearOffers() {
    this.offers = new ArrayValueState<string>([]);
  }

  clearErrors() {
    this.name.clearError();
    this.doors.clearError();
    this.offer_types.clearError();
    this.offers.clearError();
    this.groups.clearError();
    this.office.clearError();
    this.accessFromTime.clearError();
    this.accessUntilTime.clearError();
    this.activeFrom.clearError();
    this.activeUntil.clearError();
    this.error = "";
  }

  validate() {
    let valid = true;
    this.clearErrors();
    if (!this.name.value) {
      this.name.error = "Please fill your Automation name";
      valid = false;
    }
    if (!this.doors.values.length) {
      this.doors.error = "Please add at least one door.";
      valid = false;
    }
    if (!this.office.value) {
      this.office.error = "Please add an office.";
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
    } else if (error.field === "doors") {
      this.doors.error = error.error;
    } else if (error.field === "offer_types") {
      this.offer_types.error = error.error;
    } else if (error.field === "offers") {
      this.offers.error = error.error;
    } else if (error.field === "groups") {
      this.groups.error = error.error;
    } else if (error.field === "office") {
      this.office.error = error.error;
    } else if (error.field === "access_from_time") {
      this.accessFromTime.error = error.error;
    } else if (error.field === "access_until_time") {
      this.accessUntilTime.error = error.error;
    } else if (error.field === "active_from") {
      this.activeFrom.error = error.error;
    } else if (error.field === "active_until") {
      this.activeUntil.error = error.error;
    } else {
      // console.warn(
      //   `the field ${error.field} not found in the field list in DeskForm.`
      // );
    }
  }
}

export default function AutomationForm({
  automationUuid,
  index,
}: {
  automationUuid?: string;
  index?: number;
}) {

  const { data: automation, isLoading } = useAutomation(automationUuid);
  const state = React.useMemo(() => new AutomationFormState(automation, index), [automation, index]);

  const forms = [
    <NameForm index={0} state={state} key={0} />,
    <DoorsForm index={1} state={state} key={1} />,
    <OfferTypesForm index={2} state={state} key={2} />,
    <OffersForm index={3} state={state} key={3} />,
    <UserRolesForm index={4} state={state} key={4} />,
    <OfficeForm index={5} state={state} key={5} />,
    <DurationForm index={6} state={state} key={6} />,
    <ValidationDateTimeForm index={7} state={state} key={7} />,
  ]

  return (
    <AutomationFormScaffold
      // mainTitle={'Automation'}
      leftList={
        <>
          {forms.map((form) => (
            <>{form}</>
          ))}
        </>
      }
      rightList={<AutomationFlowPreview editMode={automationUuid ? true : false} state={state} />}
    />

  );
}
