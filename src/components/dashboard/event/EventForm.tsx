import React from "react";
import { Box, Button, IconButton, Typography } from "@mui/material";
import { makeAutoObservable } from "mobx";
import { Observer } from "mobx-react-lite";
import {
  ArrayValueState,
  FieldError,
  FormError,
  StateClass,
  ValueState,
} from "../../../states/mobx-form";
import { OrangeryToast } from "../../OrangeryElements";
import EventStepper from "./EventStepper";
import CrossIcon from "../../../assets/svg/cross.svg";
import ArrowRightIcon from "../../../assets/svg/arrow-right.svg";
import ArrowLeftIcon from "../../../assets/svg/arrow-left.svg";
import {
  IEvent,
  IEventMeetingRoom,
  IEventResult,
  IOrganizerEventResult,
  useUpsertEvent,
} from "../../../queries/event";
import DeleteEventButton from "./DeleteEventButton";
import { useGlobalState } from "../../../Contexts & Globals/GlobalContext";
import Form1 from "./Form1";
import SidebarSwitchs from "./SidebarSwitchs";
import EventOverviewDialog from "./overview/EventOverviewDialog";
import Form4 from "./Form4";
import Form5 from "./Form5";
import Form2 from "./Form2";
import Form3 from "./Form3";
import moment from "moment";

export class MeetingRoomState implements StateClass {
  public uuid;
  public name;
  public assets;
  public price;
  // public hours;

  constructor(
    uuid: string,
    name: string,
    assets: string[],
    price: number
    // hours: number
  ) {
    this.uuid = new ValueState(uuid);
    this.name = new ValueState(name);
    this.assets = new ArrayValueState(assets);
    this.price = new ValueState(price);
    // this.hours = new ValueState(hours);
    makeAutoObservable(this);
  }
  get data() {
    return {
      uuid: this.uuid.value,
      name: this.name.value,
      assets: this.assets.values.map((v) => v.value),
      price: this.price.value,
      // hours: this.hours.value,
    };
  }
}
export class AssetState implements StateClass {
  // public uuid?;
  public grouped_name;
  public asset_type;
  public quantity;
  public price;

  constructor(
    // uuid?: string,
    grouped_name: string,
    asset_type: string,
    quantity: number,
    price: number
  ) {
    // this.uuid = new ValueState(uuid);
    this.grouped_name = new ValueState(grouped_name);
    this.asset_type = new ValueState(asset_type || "Included" || "Optional");
    this.quantity = new ValueState(quantity);
    this.price = new ValueState(price);
    makeAutoObservable(this);
  }
  get data() {
    return {
      // uuid: this.uuid.value,
      grouped_name: this.grouped_name.value,
      asset_type: this.asset_type.value,
      quantity: this.quantity.value,
      price: this.price.value,
    };
  }
}

export class ServiceState implements StateClass {
  public uuid;
  public service_partner_uuid?;
  public service_name;
  public quantity;
  public price;
  public partner_name;

  constructor(
    uuid: string,
    service_partner_uuid: string,
    service_name: string,
    quantity: number,
    price: number,
    partner_name: string
  ) {
    this.uuid = new ValueState(uuid);
    this.service_partner_uuid = new ValueState(service_partner_uuid);
    this.service_name = new ValueState(service_name);
    this.quantity = new ValueState(quantity);
    this.price = new ValueState(price);
    this.partner_name = new ValueState(partner_name);
    makeAutoObservable(this);
  }
  get data() {
    return {
      uuid: this.uuid.value,
      service_partner_uuid: this.service_partner_uuid?.value,
      service_name: this.service_name.value,
      quantity: this.quantity.value,
      price: this.price.value,
      partner_name: this.partner_name.value,
    };
  }
}

export class OrganizerState implements StateClass {
  public uuid;
  public name;
  public email;
  public phone;
  public image;
  public organization;
  public social_link;

  constructor(
    uuid: string,
    name: string,
    email: string,
    phone: string,
    image?: string,
    organization?: string,
    social_link?: string
  ) {
    this.uuid = new ValueState(uuid);
    this.name = new ValueState(name);
    this.email = new ValueState(email);
    this.phone = new ValueState(phone);
    this.image = new ValueState(image);
    this.organization = new ValueState(organization);
    this.social_link = new ValueState(social_link);
    makeAutoObservable(this);
  }
  get data() {
    return {
      uuid: this.uuid.value,
      name: this.name.value,
      email: this.email.value,
      phone: this.phone.value,
      image: this.image.value,
      organization: this.organization.value,
      social_link: this.social_link.value,
    };
  }
}

export class EventFieldsState {
  public uuid;
  public name;
  public description;
  public start_time;
  public end_time;
  public event_link;
  public location;
  public active;
  public mobile_view;
  public website_view;
  public pay_via_invoice;
  public featured;
  public price;
  public attendee_price;
  public weeks;
  public organizer_media;
  public organizer_uuids;
  public presenter_uuids;
  public attendee_uuids;
  public image_uuids;
  public assets;
  public meeting_rooms;
  public services;
  public organizer_note;
  public admin_note;
  public featured_in;
  public is_weekly;
  public is_free;
  public capacity;
  public is_free_event: boolean = false;
  public isLoading: boolean = false;
  public isAddPresenter: boolean = false;
  public isAddOrganizer: boolean = false;
  public isAddAttendee: boolean = false;
  // public event_type: string = "one_time";
  public totalPriceMeetingRooms: string = "";
  public totalPriceAssets: string = "";
  public totalPriceServices: string = "";
  public presenterValues: string[] = [];
  public attendeeValues: string[] = [];
  public organizerFirstName: string = "";
  public presenterFirstName: string = "";
  public presenterLastName: string = "";
  public attendeeFirstName: string = "";
  public attendeeLastName: string = "";
  public office_uuid;

  public error = "";

  public activeStep = 0;

  public result: IEventResult | null = null;

  public updateAll;

  constructor(office_uuid: string, event?: IEvent, updateAll?: boolean) {
    this.office_uuid = new ValueState(office_uuid);

    this.updateAll = new ValueState<boolean | undefined>(updateAll);

    if (event) {
      this.uuid = new ValueState(event.uuid);
      this.name = new ValueState(event.name);
      this.description = new ValueState(event.description);
      this.start_time = new ValueState(event.start_time);
      this.end_time = new ValueState(event.end_time);
      this.event_link = new ValueState(event.event_link);
      this.location = new ValueState(event.location);
      this.active = new ValueState(event.active);
      this.mobile_view = new ValueState(event.mobile_view);
      this.website_view = new ValueState(event.website_view);
      this.pay_via_invoice = new ValueState(event.pay_via_invoice);
      this.featured = new ValueState(event.is_recommended);
      this.price = new ValueState(event.price);
      this.attendee_price = new ValueState(event.attendee_price);
      this.weeks = new ValueState(event.weeks);
      this.is_weekly = new ValueState(event.is_weekly ? "weekly" : "one_time");
      this.is_free = new ValueState(event.is_free);
      this.capacity = new ValueState(event.capacity);
      this.organizer_media = new ValueState(event.organizer_media);
      this.organizer_uuids = new ArrayValueState<OrganizerState>(
        event.organizers?.map(
          (organizer) =>
            new OrganizerState(
              organizer.uuid,
              organizer.name,
              organizer.email,
              organizer.phone,
              organizer.image,
              organizer.organization,
              organizer.social_link
            )
        )
      );
      this.presenter_uuids = new ArrayValueState(
        event.presenters.map((presenter) => presenter.uuid)
      );
      this.attendee_uuids = new ArrayValueState(
        event.attendees.map((attendee) => attendee.uuid)
      );
      this.image_uuids = new ArrayValueState(
        event.images.map((image) => image.uuid)
      );
      this.assets = new ArrayValueState<AssetState>(
        event.assets?.map(
          (asset) =>
            new AssetState(
              // asset.uuid,
              asset.grouped_name,
              asset.asset_type,
              asset.quantity,
              asset.price
            )
        )
      );
      this.meeting_rooms = new ArrayValueState<MeetingRoomState>(
        event.meeting_rooms?.map(
          (meeting_room) =>
            new MeetingRoomState(
              meeting_room.uuid,
              meeting_room.name,
              meeting_room.assets.map((asset) => asset),
              meeting_room.price
              // meeting_room.hours
            )
        )
      );
      this.services = new ArrayValueState<ServiceState>(
        event.services?.map((service) => {
          // check if any required properties are undefined or null
          if (
            service.service_partner_uuid === undefined ||
            service.service_name === undefined ||
            service.price === undefined ||
            service.quantity === undefined ||
            service.partner_name === undefined
          ) {
            // return a default ServiceState instance with empty string or 0
            return new ServiceState(service.uuid, "", "", 0, 0, "");
          }

          // create a new ServiceState instance with provided values
          const servicePartnerUUID = service.service_partner_uuid || "";
          return new ServiceState(
            servicePartnerUUID,
            service.service_partner_uuid,
            service.service_name,
            service.price,
            service.quantity,
            service.partner_name
          );
        })
      );
      this.featured_in = new ArrayValueState(
        event.featured_in.map((f) => f.uuid)
      );
      this.organizer_note = new ValueState(event.organizer_note);
      this.admin_note = new ValueState(event.admin_note);
    } else {
      this.uuid = new ValueState("");
      this.name = new ValueState("");
      this.description = new ValueState("");
      this.start_time = new ValueState(new Date());
      this.end_time = new ValueState(new Date());
      this.event_link = new ValueState("");
      this.location = new ValueState("");
      this.active = new ValueState(true);
      this.mobile_view = new ValueState(true);
      this.website_view = new ValueState(true);
      this.pay_via_invoice = new ValueState(false);
      this.featured = new ValueState(false);
      this.price = new ValueState(0);
      this.attendee_price = new ValueState(0);
      this.weeks = new ValueState(1);
      this.organizer_media = new ValueState("");
      this.is_weekly = new ValueState("one_time");
      this.is_free = new ValueState(false);
      this.capacity = new ValueState(0);
      this.organizer_uuids = new ArrayValueState<OrganizerState>([]);
      this.presenter_uuids = new ArrayValueState<string>([]);
      this.attendee_uuids = new ArrayValueState<string>([]);
      this.image_uuids = new ArrayValueState<string>([]);
      this.assets = new ArrayValueState<AssetState>([]);
      this.meeting_rooms = new ArrayValueState<MeetingRoomState>([]);
      this.services = new ArrayValueState<ServiceState>([]);
      this.featured_in = new ArrayValueState([]);
      this.organizer_note = new ValueState("");
      this.admin_note = new ValueState("");
    }

    makeAutoObservable(this);
  }

  get data() {
    const start_date1 = moment(this.start_time.value, moment.ISO_8601)
      .format()
      .slice(0, -6);
    const end_date1 = moment(this.end_time.value, moment.ISO_8601)
      .format()
      .slice(0, -6);

    return {
      uuid: this.uuid.value,
      name: this.name.value,
      description: this.description.value,
      location: this.location.value,
      start_time: start_date1,
      end_time: end_date1,
      event_link: this.event_link.value,
      active: this.active.value,
      is_weekly: this.is_weekly.value,
      mobile_view: this.mobile_view.value,
      website_view: this.website_view.value,
      pay_via_invoice: this.pay_via_invoice.value,
      featured: this.featured.value,
      price: this.price.value,
      attendee_price: this.attendee_price.value,
      weeks: this.is_weekly.value === "one_time" ? 0 : this.weeks.value,
      organizer_media: this.organizer_media.value,
      capacity: this.capacity.value,
      presenter_uuids: this.presenter_uuids.values.map(
        (presenter) => presenter.value
      ),
      attendee_uuids: this.attendee_uuids.values.map(
        (attendee) => attendee.value
      ),
      image_uuids: this.image_uuids.values.map((image) => image.value),
      assets: this.assets.values.map((asset) => asset.value.data),
      meeting_rooms: this.meeting_rooms.values.map(
        (meeting_room) => meeting_room.value.data
      ),
      services: this.services.values.map((service) => service.value.data),
      organizer_uuids: this.organizer_uuids.values.map(
        (organizer) => organizer.value.data.uuid
      ),
      featured_in: this.featured_in.values.map((featured) => featured.value),
      admin_note: this.admin_note.value,
      organizer_note: this.organizer_note.value,
      office_uuid: this.office_uuid.value,
    };
  }

  isReady() {
    let ready = true;
    if (this.services.values.length === 0) ready = false;
    const hasEmptyNameInService = this.services.values.find(
      (f) => !f.value.service_name.value
    );
    if (hasEmptyNameInService) ready = false;
    return ready;
  }
  setIsAddPresenter(value: boolean) {
    this.isAddPresenter = value;
  }

  setIsAddOrganizer(value: boolean) {
    this.isAddOrganizer = value;
  }

  setIsAddAttendee(value: boolean) {
    this.isAddAttendee = value;
  }

  pushToPresenterValues(uuid: ValueState<string>) {
    if (this.presenter_uuids.values.includes(uuid)) {
      return;
    }
    this.presenter_uuids.values.push(uuid);
  }

  setPresenterValues(uuids: string[]) {
    this.presenterValues = uuids;
  }

  pushToAttendeeValues(uuid: ValueState<string>) {
    if (this.attendee_uuids.values.includes(uuid)) {
      return;
    }
    this.attendee_uuids.values.push(uuid);
  }

  setAttendeeValues(uuids: string[]) {
    this.attendeeValues = uuids;
  }

  setPresenterFirstName(value: string) {
    this.presenterFirstName = value;
  }

  setOrganizerFirstName(value: string) {
    this.organizerFirstName = value;
  }

  setAttendeeFirstName(value: string) {
    this.attendeeFirstName = value;
  }

  setIsLoading(value: boolean) {
    this.isLoading = value;
  }
  clearErrors() {
    this.uuid.clearError();
    this.name.clearError();
    this.description.clearError();
    this.location.clearError();
    this.event_link.clearError();
    this.start_time.clearError();
    this.end_time.clearError();
    // this.is_free_event.clearError();
    this.active.clearError();
    this.organizer_uuids.clearError();
    this.organizer_media.clearError();
    this.presenter_uuids.clearError();
    this.attendee_uuids.clearError();
    this.image_uuids.clearError();
    this.error = "";
  }

  ValidateEventForm1() {
    let valid = true;
    this.clearErrors();
    if (!this.name.value) {
      this.name.error = "Please fill event name";
      valid = false;
    }
    if (!this.description.value) {
      this.description.error = "Please fill the description";
      valid = false;
    }

    if (!this.start_time.value) {
      this.start_time.error = "Please select you start time";
      valid = false;
      console.log(this.start_time.error);
    }
    if (!this.end_time.value) {
      this.end_time.error = "Please select you end time";
      valid = false;
    }
    return valid;
  }

  ValidateEventForm2() {
    let valid = true;
    this.clearErrors();

    return valid;
  }
  ValidateEventForm3() {
    let valid = true;
    this.clearErrors();

    return valid;
  }
  ValidateEventForm4() {
    let valid = true;
    this.clearErrors();

    return valid;
  }
  ValidateEventForm5() {
    let valid = true;
    this.clearErrors();

    return valid;
  }

  setupErrors(err: FormError) {
    this.clearErrors();
    err.errors.forEach((error: FieldError) => this.setupError(error));
  }

  setupError(error: FieldError) {
    if (error.field === "") {
      this.error = error.error;
    } else if (error.field === "name") {
      this.name.error = error.error;
    } else if (error.field === "description") {
      this.description.error = error.error;
    } else if (error.field === "location") {
      this.location.error = error.error;
    } else if (error.field === "event_link") {
      this.event_link.error = error.error;
    } else if (error.field === "start_time") {
      this.start_time.error = error.error;
    } else if (error.field === "end_time") {
      this.end_time.error = error.error;
    } else if (error.field === "organizer_uuid") {
      this.organizer_uuids.error = error.error;
    } else if (error.field === "organizer_media") {
      this.organizer_media.error = error.error;
    } else if (error.field === "presenter_uuids") {
      this.presenter_uuids.error = error.error;
    } else if (error.field === "attendee_uuids") {
      this.attendee_uuids.error = error.error;
    } else if (error.field === "image_uuids") {
      this.image_uuids.error = error.error;
    }
  }

  setActiveStep(value: number) {
    this.activeStep = value;
  }

  setResult(value: IEventResult) {
    this.result = value;
  }
}

export default function HandleEventForm({
  event,
  handleClose,
  handleDone,
  updateAll,
}: {
  event?: IEvent;
  handleClose: () => void;
  handleDone?: () => void;
  updateAll?: boolean;
}) {
  const { office_uuid } = useGlobalState();
  const state = React.useMemo(
    () => new EventFieldsState(office_uuid, event, updateAll),
    [office_uuid, event, updateAll]
  );

  return (
    <>
      <Observer>
        {() => (
          <>
            {!state.result && (
              <BaseForm state={state} event={event} handleClose={handleClose} />
            )}
          </>
        )}
      </Observer>
    </>
  );
}

function BaseForm({
  state,
  event,
  handleClose,
}: {
  state: EventFieldsState;
  event?: IEvent;
  handleClose: () => void;
}) {
  const mutation = useUpsertEvent();

  const handleNext = (e: React.MouseEvent) => {
    e.preventDefault();

    let valid = true;
    if (state.activeStep === 0) {
      valid = state.ValidateEventForm1();
    }
    if (state.activeStep === 1) {
      valid = state.ValidateEventForm2();
    }
    if (state.activeStep === 2) {
      valid = state.ValidateEventForm3();
    }
    if (state.activeStep === 3) {
      valid = state.ValidateEventForm4();
    }
    if (state.activeStep === 4) {
      valid = state.ValidateEventForm5();
      if (valid) {
        handleSubmit();
        return;
      }
    }
    if (!valid) {
      return;
    }
    const newActiveStep = state.activeStep + 1;
    state.setActiveStep(newActiveStep);
  };

  const handleBack = (e: React.MouseEvent) => {
    e.preventDefault();
    if (state.activeStep <= 0) return;
    else state.setActiveStep(state.activeStep - 1);
  };

  async function handleSubmit() {
    if (!state.ValidateEventForm2()) {
      return;
    }
    try {
      const result = await mutation.mutateAsync(state.data);
      state.setResult(result);
      handleClose();
      if (event) {
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
          pl: 4,
          py: 1.8,
          gap: 4,
          display: "flex",
          // flexDirection: 'column',
          justifyContent: "space-between",
          alignItems: "center",
          borderBottom: "1px solid #EDEEF0",
        }}
      >
        <Typography sx={{ fontSize: 24, fontWeight: 600, color: "#000" }}>
          {event ? "Edit an Event" : "Create an Event"}
        </Typography>
        <Box sx={{ width: "71%" }}>
          <Observer>
            {() => <EventStepper state={state} activeStep={state.activeStep} />}
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
          display: "grid",
          gridTemplateColumns: "70% 30%",
          height: " calc(100% - 106px)",
        }}
      >
        <Observer>
          {() => (
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                flexGrow: 1,
                pr: state.activeStep === 4 ? 0 : 7,
                pt: state.activeStep === 4 ? 2 : 5,
                pl: state.activeStep === 4 ? 0 : 4,
                width: "100%",
                mr: 2,
                height: "86%",
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
              <React.Fragment>
                {state.activeStep === 0 && <Form1 state={state} />}
                {state.activeStep === 1 && <Form2 state={state} />}
                {state.activeStep === 2 && <Form3 state={state} />}
                {state.activeStep === 3 && <Form4 state={state} />}
                {state.activeStep === 4 && <Form5 state={state} />}
              </React.Fragment>
            </Box>
          )}
        </Observer>
        <SidebarSwitchs state={state} />
      </Box>
      <Box
        sx={{
          width: "100%",
          pt: 2,
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
          {event && (
            <DeleteEventButton
              handleCloseForm={handleClose}
              event={event}
              label="Remove"
              sx={{ color: "red" }}
            />
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
              {state.activeStep === 4 ? (
                <Typography className="add-letter">
                  {event ? "Save" : "Create"}
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
