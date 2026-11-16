import { Observer } from "mobx-react-lite";
import { useGlobalState } from "../../../../Contexts & Globals/GlobalContext";
import { IEvent, useEventModifications } from "../../../../queries/event";
import HandleNameDescription from "./name-description/HandleNameDescription";
import HandleAddressLink from "./adrress-link/HandleAddressLink";
import HandleDateTime from "./dateTime/HandleDateTime";
import HandleOrganizers from "./organizers/HandleOrganizers";
import HandlePresenter from "./presenter/HandlePresenter";
import HandleAttendee from "./attendee/HandleAttendee";
import HandleMeetingRoom from "./meeting-room/HandleMeetingRoom";
import HandleAsset from "./asset/HandleAsset";
import HandleService from "./service/HandleService";
import { ValueState } from "../../../../states/mobx-form";
import { makeAutoObservable } from "mobx";
import React from "react";

export class EventLogState {
  public start_time;
  public end_time;
  public weeks;
  public name;
  public description;
  public location;
  public event_link;
  public accepted: boolean = false;
  public isAccepted: boolean = false;
  public isDeclined: boolean = false;
  public office_uuid;

  constructor(office_uuid: string) {
    this.start_time = new ValueState<string | null>("");
    this.end_time = new ValueState<string | null>("");
    this.weeks = new ValueState<number | null>(0);
    this.name = new ValueState<string | null>("");
    this.description = new ValueState<string | null>("");
    this.location = new ValueState<string | null>("");
    this.event_link = new ValueState<string | null>("");
    this.office_uuid = new ValueState<string>(office_uuid);

    makeAutoObservable(this);
  }

  get data() {
    return {
      start_time: this.start_time.value,
      end_time: this.end_time.value,
      weeks: this.weeks.value,
      name: this.name.value,
      description: this.description.value,
      location: this.location.value,
      event_link: this.event_link.value,
      office_uuid: this.office_uuid.value,
    };
  }

  setIsAccepted(accepted: boolean) {
    this.isAccepted = accepted;
  }
  setIsDeclined(declined: boolean) {
    this.isDeclined = declined;
  }
}

export default function HandleLogsRendering({
  eventObject,
}: {
  eventObject: IEvent;
}) {
  const globalState = useGlobalState();
  const event_uuid = eventObject?.uuid ?? "";
  const { data: eventsModification, isLoading } = useEventModifications(
    globalState.office_uuid,
    event_uuid
  );
  const state = React.useMemo(
    () => new EventLogState(globalState.office_uuid),
    [globalState.office_uuid]
  );

  const modificationList = eventsModification?.map((m) => m) || [];

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
  const logDateTimeWeek = modificationList
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
      <Observer>
        {() => (
          <>
            <HandleNameDescription
              event={eventObject}
              state={state}
              logNameDescription={logNameDescription}
            />
            <HandleAddressLink
              event={eventObject}
              state={state}
              logAddressLink={logAddressLink}
            />
            <HandleDateTime
              event={eventObject}
              state={state}
              logDateTimeWeek={logDateTimeWeek}
            />
            <HandleOrganizers
              event={eventObject}
              // state={state}
              logOrganizers={logOrganizers}
            />
            <HandlePresenter
              event={eventObject}
              // state={state}
              logPresenter={logPresenter}
            />
            <HandleAttendee
              event={eventObject}
              // state={state}
              logAttendee={logAttendee}
            />
            <HandleMeetingRoom
              event={eventObject}
              // state={state}
              logMeetingRoom={logMeetingRoom}
            />
            <HandleAsset
              event={eventObject}
              // state={state}
              logAsset={logAsset}
            />
            <HandleService
              event={eventObject}
              // state={state}
              logService={logService}
            />
          </>
        )}
      </Observer>
    </>
  );
}
