import {
  Box,
  Button,
  Dialog,
  DialogContent,
  Divider,
  IconButton,
  Typography,
} from "@mui/material";
import ArrowBackIcon from "../../../../../assets/svg/arrow-left.svg";
import {
  IEvent,
  IEventModification,
  IEventModificationResult,
  IOrganizerEvent,
  IOrganizerEventResult,
  useEventModifications,
  useEvents,
  useOrganizerEvents,
} from "../../../../../queries/event";
import { useGlobalState } from "../../../../../Contexts & Globals/GlobalContext";
import { useRouter } from "next/router";
import {
  OrangeryCarousel,
  OrangeryNavigationContentLoader,
  OrangeryNavigationPlaceholder,
  OrangeryText,
  OrangeryTextAreaField,
  OrangeryTextField,
} from "../../../../OrangeryElements";
import CrossIcon from "../../../../assets/svg/cross.svg";
import React, { useState } from "react";
import { Observer } from "mobx-react-lite";
import TitleAndDescriptionAcceptedState from "./title-and-description/AcceptedState";
import TitleAndDescriptionPendingState from "./title-and-description/PendingState";
import EditButton from "./title-and-description/EditButton";
import HandleTitleState from "./title-and-description/HandleTitleState";
import HandleAddressState from "./address/HandleAddressState";
import { EventFieldsState } from "../../EventForm";
import PlaceholderSvg from "../../../../../assets/svg/placeholders/event-empty-space.svg";
import {
  ArrayValueState,
  FieldError,
  FormError,
  StateClass,
  ValueState,
} from "../../../../../states/mobx-form";
import { makeAutoObservable } from "mobx";
import moment from "moment";
import HandleDateTimeState from "./date-and-time/HandleDateTimeState";
import HandleOrganizerState from "./organizer/HandleOrganizerState";
import HandlePresenterState from "./presenter/HandlePresenterState";
import HandleAttendeeState from "./attendee/HandleAttendeeState";
import HandleMeetingRoomState from "./meeting-room/HandleMeetingRoomState";
import HandleAssetState from "./asset/HandleAssetState";
import HandleServiceState from "./service/HandleServiceState";
import HandleNoteState from "./note/HandleNoteState";

interface IProps {
  eventModification: IEventModification;
}

export class OrganizerMeetingRoomState implements StateClass {
  public uuid;
  public name;
  public assets;
  public price;
  // public hours;

  constructor(
    uuid: string,
    name: string,
    assets: number,
    price: number
    // hours: number
  ) {
    this.uuid = new ValueState(uuid);
    this.name = new ValueState(name);
    this.assets = new ValueState(assets);
    this.price = new ValueState(price);
    // this.hours = new ValueState(hours);
    makeAutoObservable(this);
  }
  get data() {
    return {
      uuid: this.uuid.value,
      name: this.name.value,
      assets: this.assets.value,
      price: this.price.value,
      // hours: this.hours.value,
    };
  }
}
export class OrganizerAssetState implements StateClass {
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

export class OrganizerServiceState implements StateClass {
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

export class OrganizerOrganizerState implements StateClass {
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

export class OrganizerEventFieldsState {
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
  public assets_suggestion;
  public meeting_rooms_suggestion;
  public services_suggestion;
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

  public resultTitle: IEventModificationResult | null = null;
  public resultAddress: IEventModificationResult | null = null;
  public resultDateTime: IEventModificationResult | null = null;
  public resultOrganizer: IEventModificationResult | null = null;
  public resultPresenter: IEventModificationResult | null = null;
  public resulAttendee: IEventModificationResult | null = null;
  public resulMeetingRoom: IEventModificationResult | null = null;
  public resulAsset: IEventModificationResult | null = null;
  public resulService: IEventModificationResult | null = null;
  public resulNote: IOrganizerEventResult | null = null;

  public updateAll;

  constructor(
    office_uuid: string,
    event?: IOrganizerEvent,
    updateAll?: boolean
  ) {
    this.office_uuid = new ValueState(office_uuid);

    this.updateAll = new ValueState<boolean | undefined>(updateAll);

    // if (event) {
    //   this.uuid = new ValueState(event.uuid);
    //   this.title = new ValueState(event.title);
    //   this.description = new ValueState(event.description);
    //   this.start_time = new ValueState(event.start_time);
    //   this.end_time = new ValueState(event.end_time);
    //   this.event_link = new ValueState(event.event_link);
    //   this.location = new ValueState(event.location);
    //   this.active = new ValueState(event.active);
    //   this.mobile_view = new ValueState(event.mobile_view);
    //   this.website_view = new ValueState(event.website_view);
    //   this.pay_via_invoice = new ValueState(event.pay_via_invoice);
    //   this.featured = new ValueState(event.is_recommended);
    //   this.price = new ValueState(event.price);
    //   this.attendee_price = new ValueState(event.attendee_price);
    //   this.weeks = new ValueState(event.weeks);
    //   this.is_weekly = new ValueState(event.is_weekly ? "weekly" : "one_time");
    //   this.is_free = new ValueState(event.is_free);
    //   this.capacity = new ValueState(event.capacity);
    //   this.organizer_media = new ValueState(event.organizer_media);
    //   this.organizer_uuids = new ArrayValueState<OrganizerOrganizerState>(
    //     event.organizers!.map(
    //       (organizer) =>
    //         new OrganizerOrganizerState(
    //           organizer.uuid,
    //           organizer.name,
    //           organizer.email,
    //           organizer.phone,
    //           organizer.image,
    //           organizer.organization,
    //           organizer.social_link
    //         )
    //     )
    //   );
    //   this.presenter_uuids = new ArrayValueState(
    //     event.presenters!.map((presenter) => presenter.uuid)
    //   );
    //   this.attendee_uuids = new ArrayValueState(
    //     event.attendees!.map((attendee) => attendee.uuid)
    //   );
    //   this.image_uuids = new ArrayValueState(
    //     event.images!.map((image) => image.uuid)
    //   );
    //   this.assets = new ArrayValueState<OrganizerAssetState>(
    //     event.assets!.map(
    //       (asset) =>
    //         new OrganizerAssetState(
    //           // asset.uuid,
    //           asset.grouped_name,
    //           asset.asset_type,
    //           asset.quantity,
    //           asset.price
    //         )
    //     )
    //   );
    //   this.meeting_rooms = new ArrayValueState<OrganizerMeetingRoomState>(
    //     event.meeting_rooms!.map(
    //       (meeting_room) =>
    //         new OrganizerMeetingRoomState(
    //           meeting_room.uuid,
    //           meeting_room.name,
    //           meeting_room.assets,
    //           meeting_room.price
    //           // meeting_room.hours
    //         )
    //     )
    //   );
    //   this.services = new ArrayValueState<OrganizerServiceState>(
    //     event.services!.map((service) => {
    //       // check if any required properties are undefined or null
    //       if (
    //         service.service_partner_uuid === undefined ||
    //         service.service_name === undefined ||
    //         service.price === undefined ||
    //         service.quantity === undefined ||
    //         service.partner_name === undefined
    //       ) {
    //         // return a default OrganizerServiceState instance with empty string or 0
    //         return new OrganizerServiceState(service.uuid, "", "", 0, 0, "");
    //       }

    //       // create a new ServiceState instance with provided values
    //       const servicePartnerUUID = service.service_partner_uuid || "";
    //       return new OrganizerServiceState(
    //         servicePartnerUUID,
    //         service.service_partner_uuid,
    //         service.service_name,
    //         service.price,
    //         service.quantity,
    //         service.partner_name
    //       );
    //     })
    //   );
    //   this.featured_in = new ArrayValueState(
    //     event.featured_in!.map((f) => f.uuid)
    //   );
    //   this.organizer_note = new ValueState(event.organizer_note);
    //   this.admin_note = new ValueState(event.admin_note);
    // } else {
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
    this.organizer_uuids = new ArrayValueState<OrganizerOrganizerState>([]);
    this.presenter_uuids = new ArrayValueState<string>([]);
    this.attendee_uuids = new ArrayValueState<string>([]);
    this.image_uuids = new ArrayValueState<string>([]);
    this.assets_suggestion = new ValueState<string>("");
    this.meeting_rooms_suggestion = new ValueState<string>("");
    this.services_suggestion = new ValueState<string>("");
    this.featured_in = new ArrayValueState<string>([]);
    this.organizer_note = new ValueState("");
    this.admin_note = new ValueState("");
    // }

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
      assets_suggestion: this.assets_suggestion.value,
      meeting_rooms_suggestion: this.meeting_rooms_suggestion.value,
      services_suggestion: this.services_suggestion.value,
      organizer_uuids: this.organizer_uuids.values.map(
        (organizer) => organizer.value.data.uuid
      ),
      featured_in: this.featured_in.values.map((featured) => featured.value),
      admin_note: this.admin_note.value,
      organizer_note: this.organizer_note.value,
      office_uuid: this.office_uuid.value,
    };
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
      this.name.error = "Please fill event title";
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

  setResultTitle(value: IEventModificationResult) {
    this.resultTitle = value;
  }
  setResultAddress(value: IEventModificationResult) {
    this.resultAddress = value;
  }
  setResultDateTime(value: IEventModificationResult) {
    this.resultDateTime = value;
  }
  setResultOrganizer(value: IEventModificationResult) {
    this.resultOrganizer = value;
  }
  setResultPresenter(value: IEventModificationResult) {
    this.resultPresenter = value;
  }
  setResultAttendee(value: IEventModificationResult) {
    this.resulAttendee = value;
  }
  setResultMeetingRoom(value: IEventModificationResult) {
    this.resulMeetingRoom = value;
  }
  setResultAsset(value: IEventModificationResult) {
    this.resulAsset = value;
  }
  setResultServices(value: IEventModificationResult) {
    this.resulService = value;
  }
  setResultNote(value: IOrganizerEventResult) {
    this.resulNote = value;
  }
}
export default function OrganizerReviewPage() {
  const globalState = useGlobalState();
  const { data: events } = useOrganizerEvents(globalState.office_uuid, true);
  const eventList = events?.map((event) => event) || [];
  const router = useRouter();
  const { id } = router.query;
  const eventObject = eventList?.find((event) => {
    if (!event) return;
    if (event.uuid === id) {
      return event;
    }
  })!;

  const state = React.useMemo(
    () => new OrganizerEventFieldsState(globalState.office_uuid, eventObject),
    [globalState.office_uuid, eventObject]
  );

  const event_uuid = eventObject?.uuid ?? "";
  const { data: eventsModification, isLoading } = useEventModifications(
    globalState.office_uuid,
    event_uuid
  );

  const handleBack = () => {
    window.history.back();
  };

  return (
    <>
      {isLoading ? (
        <OrangeryNavigationContentLoader />
      ) : eventList && eventList.length > 0 ? (
        <Box
          sx={{
            backgroundColor: "#fff",
            p: 3,
            display: "flex",
            flexDirection: "column",
            gap: 2,
            height: "100%",
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
            "& .title": { fontSize: 31, fontWeight: 700, color: "#2B2E33" },
            "& .sub-title": { fontSize: 16, fontWeight: 400, color: "#2B2E33" },
          }}
        >
          <Button
            onClick={handleBack}
            sx={{ justifyContent: "start", width: "12%" }}
          >
            <Typography
              sx={{
                color: "#55585C",
                fontsize: "16px",
                fontWeight: "600",
                whiteSpace: "nowrap",
              }}
            >
              <IconButton
                sx={{
                  mr: 1,
                  "& .arrow-icon": { width: "1.1rem", height: "1.1rem" },
                }}
              >
                <ArrowBackIcon className="arrow-icon" />
              </IconButton>
              Back to Events
            </Typography>
          </Button>
          <Observer>
            {() => (
              <>
                <HandleLogOrganizer eventObject={eventObject} state={state} />
              </>
            )}
          </Observer>
        </Box>
      ) : (
        <OrangeryNavigationPlaceholder
          title={"No event has been created yet"}
          subtitle={"Create an event by clicking on the button below."}
          PlaceholderSvg={PlaceholderSvg}
          width="5rem"
          height="5.6rem"
          addNewButtonText={""}
          vertical
        />
      )}
    </>
  );
}

const HandleLogOrganizer = ({
  eventObject,
  state,
}: {
  eventObject: IOrganizerEvent;
  state: OrganizerEventFieldsState;
}) => {
  const globalState = useGlobalState();
  const event_uuid = eventObject?.uuid ?? "";
  const { data: modification } = useEventModifications(
    globalState.office_uuid,
    event_uuid
  );
  const modificationList = modification?.map((m) => m) || [];

  const logNameDescription = modificationList
    .filter(
      (item) =>
        item.column_name === "name" || item.column_name === "description"
    )
    .map((log) => log);

  const logAddressLink = modificationList
    .filter(
      (item) =>
        item.column_name === "location" || item.column_name === "event_link"
    )
    .map((log) => log);

  const logDateTime = modificationList
    .filter(
      (item) =>
        item.column_name === "start_time" ||
        item.column_name === "end_time" ||
        item.column_name === "weeks"
    )
    .map((log) => log);

  const logOrganizers = modificationList
    .filter((item) => item.column_name === "organizers")
    .map((log) => log);

  const logPresenter = modificationList
    .filter((item) => item.column_name === "presenters")
    .map((log) => log);

  const logAttendee = modificationList
    .filter((item) => item.column_name === "attendees")
    .map((log) => log);

  const logMeetingRoom = modificationList
    .filter((item) => item.column_name === "meeting_rooms")
    .map((log) => log);

  const logAsset = modificationList
    .filter((item) => item.column_name === "assets")
    .map((log) => log);

  const logService = modificationList
    .filter((item) => item.column_name === "services")
    .map((log) => log);

  return (
    <>
      <HandleTitleState
        event={eventObject}
        state={state}
        logNameDescription={logNameDescription}
        // logDesciptions={logDesciptions}
      />

      <HandleAddressState
        event={eventObject}
        state={state}
        logAddressLink={logAddressLink}
      />

      <HandleDateTimeState
        event={eventObject}
        state={state}
        logDateTime={logDateTime}
      />

      <HandleOrganizerState
        event={eventObject}
        state={state}
        logOrganizers={logOrganizers}
      />

      <HandlePresenterState
        event={eventObject}
        state={state}
        logPresenter={logPresenter}
      />

      <HandleAttendeeState
        event={eventObject}
        state={state}
        logAttendee={logAttendee}
      />

      <HandleMeetingRoomState
        event={eventObject}
        state={state}
        logMeetingRoom={logMeetingRoom}
      />

      <HandleAssetState event={eventObject} state={state} logAsset={logAsset} />

      <HandleServiceState
        event={eventObject}
        state={state}
        logService={logService}
      />

      <HandleNoteState
        event={eventObject}
        state={state}
        // logService={logService}
      />
    </>
  );
};
