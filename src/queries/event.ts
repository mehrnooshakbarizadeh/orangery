import { request } from "http";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { backend } from "./backend";
import {  processError } from "./commons";
import { IMedia } from "./media";

export interface IPresenter {
  uuid: string;
  name: string;
  email: string;
  phone: string;
  image: string[];
  organization: string;
}
export interface IEventParams {
  uuid?: string;
  name?: string;
  description: string;
  start_time: string,
  end_time: string,
  event_link: string;
  location: string;
  active: boolean;
  mobile_view: boolean;
  website_view: boolean;
  pay_via_invoice: boolean;
  // featured: boolean;
  price: number;
  attendee_price: number;
  weeks: number;
  capacity: number;
  organizer_media: string;
  organizer_uuids: string[];
  presenter_uuids: string[];
  attendee_uuids: string[];
  image_uuids: string[];
  assets: IEventAsset[];
  meeting_rooms: IMeetingRoom[];
  services: IEventService[];
  is_weekly?: string;
  featured_in: string[];
  organizer_note: string;
  admin_note: string;
  tenant_office_uuid?: string;
  office_uuid: string;
}
export interface IEventResult {
  // office_uuid: string;
  uuid: string;
  description: string;
  event_type: string;
  repeat_in_week: number;
  name: string;
  event_link: string;
  location: string;
  end_time: string;
  start_time: string;
  price: number;
  capacity: number;
  images: string[],
  organizer_media: string;
  organizer: IOrganizer;
  presenters: IPresenter[],
  attendees: string[],
  meeting_rooms: IMeetingRoom[];
  assets: IEventAsset[];
  services: IEventService[];
  organizers: IOrganizer[];
  created_date: string;
  active: boolean;
  featured_in: IFeaturedIn[];
  office_uuid: string;
  tenant_office_uuid: string
}

async function upsertEvent(params: IEventParams): Promise<IEventResult> {
  try {
    const data = {
      name: params.name,
      description: params.description,
      start_time: params.start_time,
      end_time: params.end_time,
      event_link: params.event_link,
      location: params.location,
      active: params.active,
      mobile_view: params.mobile_view,
      website_view: params.website_view,
      pay_via_invoice: params.pay_via_invoice,
      // featured: params.featured,
      price: params.price,
      attendee_price: params.attendee_price,
      weeks: params.weeks,
      capacity: params.capacity,
      organizer_media: params.organizer_media,
      organizer_uuids: params.organizer_uuids,
      presenter_uuids: params.presenter_uuids,
      attendee_uuids: params.attendee_uuids,
      image_uuids: params.image_uuids,
      meeting_rooms: params.meeting_rooms,
      assets: params.assets,
      services: params.services,
      featured_in: params.featured_in,
      organizer_note: params.organizer_note,
      admin_note: params.admin_note,
    };

    if (params.uuid) {
      const result = await backend.put(
        `/office/${params.office_uuid}/event/${params.uuid}`,
        data,
        {}
      );
      const finalResult = result.data.data;
      return finalResult.event;
    } else {
      const result = await backend.post(
        `/office/${params.office_uuid}/event`,
        data,
        {}
      );
      const finalResult = result.data.data;
      return finalResult.event;
    }
  } catch (err: any) {
    const processedError = processError(err);
    throw processedError;
  }
}

export function useUpsertEvent() {
  const queryClient = useQueryClient();
  return useMutation<IEventResult, Error, IEventParams>(upsertEvent, {
    onSuccess: (data, variables) => {
      const office_uuid = variables.office_uuid;
      queryClient.invalidateQueries(["events", office_uuid]);
      queryClient.invalidateQueries(["event", office_uuid, data.uuid]);
    },
  });
}


export interface IOrganizerEventParams {
  uuid?: string;
  name?: string | null;
  description?: string | null;
  start_time?: string | null,
  end_time?: string | null,
  event_link?: string | null;
  location?: string | null;
  active?: boolean;
  mobile_view?: boolean;
  website_view?: boolean;
  pay_via_invoice?: boolean;
  // featured?: boolean;
  price?: number;
  attendee_price?: number;
  weeks?: number | string | null;
  capacity?: number;
  organizer_media?: string;
  organizer_uuids?: (string | null)[];
  presenter_uuids?: (string | null)[];
  attendee_uuids?: (string | null)[];
  image_uuids?: string[];
  assets?: IEventAsset[];
  meeting_rooms?: IMeetingRoom[];
  services?: IEventService[];
  is_weekly?: string;
  featured_in?: string[];
  organizer_note?: string;
  admin_note?: string;
  tenant_office_uuid?: string;
  office_uuid?: string;
}
export interface IOrganizerEventResult {
  // office_uuid: string;
  uuid?: string;
  description?: string | null;
  event_type?: string;
  repeat_in_week?: number;
  name?: string | null;
  event_link?: string;
  location?: string;
  end_time?: string;
  start_time?: string;
  price?: number;
  capacity?: number;
  images?: string[],
  organizer_media?: string;
  organizer?: IOrganizer;
  presenters?: IPresenter[],
  attendees?: string[],
  meeting_rooms?: IMeetingRoom[];
  assets?: IEventAsset[];
  services?: IEventService[];
  organizers?: IOrganizer[];
  created_date?: string;
  active?: boolean;
  featured_in?: IFeaturedIn[];
  office_uuid?: string;
  tenant_office_uuid?: string
}

async function patchEvent(params: IOrganizerEventParams): Promise<IOrganizerEventResult> {
  try {
    const data = {
      name: params.name,
      description: params.description,
      start_time: params.start_time,
      end_time: params.end_time,
      event_link: params.event_link,
      location: params.location,
      active: params.active,
      mobile_view: params.mobile_view,
      website_view: params.website_view,
      pay_via_invoice: params.pay_via_invoice,
      // featured: params.featured,
      price: params.price,
      attendee_price: params.attendee_price,
      weeks: params.weeks,
      capacity: params.capacity,
      organizer_media: params.organizer_media,
      organizer_uuids: params.organizer_uuids,
      presenter_uuids: params.presenter_uuids,
      attendee_uuids: params.attendee_uuids,
      image_uuids: params.image_uuids,
      meeting_rooms: params.meeting_rooms,
      assets: params.assets,
      services: params.services,
      featured_in: params.featured_in,
      organizer_note: params.organizer_note,
      admin_note: params.admin_note,
    };

    if (params.uuid) {
      const result = await backend.patch(
        `/office/${params.office_uuid}/event/${params.uuid}`,
        data,
        {}
      );
      const finalResult = result.data.data;
      return finalResult.event;
    } else {
      const result = await backend.post(
        `/office/${params.office_uuid}/event`,
        data,
        {}
      );
      const finalResult = result.data.data;
      return finalResult.event;
    }
  } catch (err: any) {
    const processedError = processError(err);
    throw processedError;
  }
}

export function usePatchEvent() {
  const queryClient = useQueryClient();
  return useMutation<IOrganizerEventResult, Error, IOrganizerEventParams>(patchEvent, {
    onSuccess: (data, variables) => {
      const office_uuid = variables.office_uuid;
      queryClient.invalidateQueries(["events", office_uuid]);
      queryClient.invalidateQueries(["event", office_uuid, data.uuid]);
    },
  });
}

export interface IDeleteEventParams {
  office_uuid: string;
  uuid: string;
}
async function deleteEvent(params: IDeleteEventParams): Promise<void> {
  try {
    const result = await backend.delete(
      `/office/${params.office_uuid}/event/${params.uuid}`,
      {}
    );
    result.data.data;
  } catch (err: any) {
    const processedError = processError(err);
    throw processedError;
  }
}

export function useDeleteEvent() {
  const queryClient = useQueryClient();
  return useMutation<void, Error, IDeleteEventParams>(deleteEvent, {
    onSuccess: (_, variables) => {
      const office_uuid = variables.office_uuid;
      queryClient.invalidateQueries(["events", office_uuid]);
      queryClient.invalidateQueries(["event", office_uuid, variables.uuid]);
    },
  });
}

export interface IDeleteMultiEventParams {
  office_uuid: string;
  uuids: string[];
}
async function deleteMultiEvent(params: IDeleteMultiEventParams): Promise<void> {
  try {
    const result = await backend.delete(
      `/office/${params.office_uuid}/event`,
      {
        data: {
          uuids: params.uuids
        }
      }
    );
    result.data.data;
  } catch (err: any) {
    const processedError = processError(err);
    throw processedError;
  }
}

export function useDeleteMultiEvent() {
  const queryClient = useQueryClient();
  return useMutation<void, Error, IDeleteMultiEventParams>(deleteMultiEvent, {
    onSuccess: (_, variables) => {
      const office_uuid = variables.office_uuid;
      queryClient.invalidateQueries(['events', office_uuid]);
      variables.uuids.forEach(uuid => {
        queryClient.invalidateQueries(['event', office_uuid, uuid]);
      })
    },
  });
}


export interface IImage {
  uuid: string;
  name: string;
  size: number;
  is_image: boolean;
  is_document: boolean;
  content_type: string;
  created_by: string;
  created_date: string;
  updated_by: string;
  timestamp: number;
  has_thumbnail: boolean;
}

export interface IPerson {
  email: string;
  name: string;
  status: string;
  uuid: string;
}

export interface IOrganizer {
  uuid: string;
  name: string;
  email: string;
  phone: string;
  image?: string;
  organization?: string;
  social_link?: string;
}
export interface IAttendee {
  uuid: string;
  name: string;
  email: string;
  phone: string;
  image: string[];
  organization: string;
}
export interface IEmployeeInfo {
  uuid: string;
  name: string;
  image: string[];
  email: string;
}

export interface IEventMeetingRoom {
  name: string;
  uuid: string;
  price: number;
  assets: number;
  // hours: number;
}
export interface IEventAsset {
  // uuid: string;
  grouped_name: string;
  asset_type: string;
  quantity: number;
  price: number;
}

export interface IEventService {
  uuid: string;
  service_partner_uuid?: string;
  service_name: string;
  partner_name: string;
  quantity: number;
  price: number;
}

export interface IAsset {
      price: number;
      asset_type: string;
      grouped_name: string;
      uuid: string;
      quantity: number;
      uuids?: string[];
}

export interface IMeetingRoom 
    {
      uuid: string;
      price: number;
      name: string;
      assets: string[];
      // hours: number;
    }
export interface IOpeningTimes 
    {
      uuid: string,
      timestamp: number,
      created: string,
      day: number,
      closed: boolean,
      from_time: string,
      until_time: string,
    }
export interface IFeaturedIn 
    {
      uuid: string,
      name: string,
      address: string,
      phone: null,
      email: null,
      lat: string,
      lon: string,
      timezone: string,
      images: IMedia[],
      day_pass_price: number,
      opening_times: IOpeningTimes,
    }

export interface IEvent {
  office_uuid: string;
  uuid: string;
  name: string;
  description: string;
  office_name: string;
  location: string;
  event_link: string;
  start_time: string;
  end_time: string;
  weeks: number;
  is_weekly: string,
  price: number;
  attendee_price: number;
  event_is_free: boolean;
  is_free: boolean;
  active: boolean;
  featured_in: IFeaturedIn[];
  // featured: boolean;
  mobile_view: boolean;
  website_view: boolean;
  pay_via_invoice: boolean;
  expired: boolean;
  capacity: number;
  organizers: IOrganizer[];
  organizer: IOrganizer;
  organizer_media: string;
  images: IMedia[];
  attendees: IAttendee[];
  presenters: IPresenter[];
  is_booked: boolean;
  created_date: string;
  assets: IAsset[];
  meeting_rooms: IMeetingRoom[];
  services: IEventService[];
  organizer_note: string;
  admin_note: string;
  is_recommended: boolean;
  tenant_office_uuid: string;
}

async function getEvent(office_uuid?: any, event_uuid?: any): Promise<IEvent> {
  if (!office_uuid || !event_uuid) {
    throw "office_uuid and/or event_uuid should not be empty in getEvent()";
  }
  try {
    const resp = await backend.get(
      `/office/${office_uuid}/event/${event_uuid}`,
      {}
    );
    const data = resp.data;
    let result = data?.data.event;

    if (result)
      result.office_uuid = office_uuid
    return result;
  } catch (err: any) {
    throw err;
  }
}

export function useEvent(office_uuid?: any, event_uuid?: any) {
  return useQuery<IEvent, Error>(
    ["event", office_uuid, event_uuid],
    () => getEvent(office_uuid, event_uuid),
    {
      refetchOnWindowFocus: false,
    }
  );
}

async function getPublicEvents(office_uuid: string): Promise<IEvent[]> {
  if (!office_uuid) {
    throw "office_uuid should not be empty in getEvents()";
  }
  try {
    const resp = await backend.get(`event`, {});
    const data = resp.data;
    let result = data?.data.events;
    result = result
      .map((f: any) => ({
        ...f,
        office_uuid,
      }))
      .sort((a: any, b: any) =>
        new Date(a.created_date).getTime() < new Date(b.created_date).getTime()
          ? 1
          : -1
      );
    return result;
  } catch (err: any) {
    throw err;
  }
}

export function usePublicEvents(office_uuid: string) {
  return useQuery<IEvent[], Error>(
    ["events", office_uuid],
    () => getPublicEvents(office_uuid),
    {
      refetchOnWindowFocus: false,
    }
  );
}

async function getEvents(office_uuid: string): Promise<IEvent[]> {
  if (!office_uuid) {
    throw "office_uuid should not be empty in getEvents()";
  }
  try {
    const resp = await backend.get(`/office/${office_uuid}/event`, {});
    const data = resp.data;
    let result = data?.data.events;
    result = result
      .map((f: any) => ({
        ...f,
        office_uuid,
      }))
      .sort((a: any, b: any) =>
        new Date(a.created_date).getTime() < new Date(b.created_date).getTime()
          ? 1
          : -1
      );
    return result;
  } catch (err: any) {
    throw err;
  }
}

export function useEvents(office_uuid: any) {
  return useQuery<IEvent[], Error>(
    ["events", office_uuid],
    () => getEvents(office_uuid),
    {
      refetchOnWindowFocus: false,
    }
  );
}

export interface IOrganizerEvent {
  office_uuid?: string;
  uuid?: string;
  name?: string;
  description?: string;
  office_name?: string;
  location?: string;
  event_link?: string;
  start_time?: string;
  end_time?: string;
  weeks?: number;
  is_weekly?: string,
  price?: number;
  attendee_price?: number;
  event_is_free?: boolean;
  is_free?: boolean;
  active?: boolean;
  featured_in?: IFeaturedIn[];
  // featured?: boolean;
  mobile_view?: boolean;
  website_view?: boolean;
  pay_via_invoice?: boolean;
  expired?: boolean;
  capacity?: number;
  organizers?: IOrganizer[];
  organizer?: IOrganizer;
  organizer_media?: string;
  images?: IMedia[];
  attendees?: IAttendee[];
  presenters?: IPresenter[];
  is_booked?: boolean;
  created_date?: string;
  assets?: IAsset[];
  meeting_rooms?: IMeetingRoom[];
  services?: IEventService[];
  organizer_note?: string;
  admin_note?: string;
  is_recommended?: boolean;
  tenant_office_uuid?: string;
}
async function getOrganizerEvents(office_uuid: string, isOrganizer: boolean): Promise<IOrganizerEvent[]> {
  if (!office_uuid) {
    throw "office_uuid should not be empty in getOrganizerEvents()";
  }
  try {
    const resp = await backend.get(`/office/${office_uuid}/event?organizer=${isOrganizer}`, {});
    const data = resp.data;
    let result = data?.data.events;
    result = result
      .map((f: any) => ({
        ...f,
        office_uuid,
      }))
      .sort((a: any, b: any) =>
        new Date(a.created_date).getTime() < new Date(b.created_date).getTime()
          ? 1
          : -1
      );
    return result;
  } catch (err: any) {
    throw err;
  }
}

export function useOrganizerEvents(office_uuid: any, isOrganizer: boolean) {
  return useQuery<IOrganizerEvent[], Error>(
    ["events", office_uuid, isOrganizer],
    () => getOrganizerEvents(office_uuid, isOrganizer),
    {
      refetchOnWindowFocus: false,
    }
  );
}

export interface IEventModificationParams {
  uuid?: string;
  name?: string;
  description?: string;
  start_time?: string,
  end_time?: string,
  event_link?: string;
  location?: string;
  active?: boolean;
  mobile_view?: boolean;
  website_view?: boolean;
  pay_via_invoice?: boolean;
  // featured?: boolean;
  price?: number;
  attendee_price?: number;
  weeks?: number;
  capacity?: number;
  organizer_media?: string;
  organizer_uuids?: string[];
  presenter_uuids?: string[];
  attendee_uuids?: string[];
  image_uuids?: string[];
  assets_suggestion?: string;
  meeting_rooms_suggestion?: string;
  services_suggestion?: string;
  is_weekly?: string;
  featured_in?: string[];
  organizer_note?: string;
  admin_note?: string;
  tenant_office_uuid?: string;
  office_uuid?: string;
}
export interface IEventModificationResult {
  uuid?: string;
  name?: string;
  description?: string;
  start_time?: string,
  end_time?: string,
  event_link?: string;
  location?: string;
  active?: boolean;
  mobile_view?: boolean;
  website_view?: boolean;
  pay_via_invoice?: boolean;
  // featured?: boolean;
  price?: number;
  attendee_price?: number;
  weeks?: number;
  capacity?: number;
  organizer_media?: string;
  organizer_uuids?: string[];
  presenter_uuids?: string[];
  attendee_uuids?: string[];
  image_uuids?: string[];
  assets?: IEventAsset[];
  meeting_rooms?: IMeetingRoom[];
  services?: IEventService[];
  is_weekly?: string;
  featured_in?: string[];
  organizer_note?: string;
  admin_note?: string;
  tenant_office_uuid?: string;
  office_uuid?: string;
}

async function postEventModification(params: IEventModificationParams): Promise<IEventModificationResult> {
  try {
    const data = {
      name: params.name,
      description: params.description,
      start_time: params.start_time,
      end_time: params.end_time,
      event_link: params.event_link,
      location: params.location,
      active: params.active,
      mobile_view: params.mobile_view,
      website_view: params.website_view,
      pay_via_invoice: params.pay_via_invoice,
      // featured: params.featured,
      price: params.price,
      attendee_price: params.attendee_price,
      weeks: params.weeks,
      capacity: params.capacity,
      organizer_media: params.organizer_media,
      organizer_uuids: params.organizer_uuids,
      presenter_uuids: params.presenter_uuids,
      attendee_uuids: params.attendee_uuids,
      image_uuids: params.image_uuids,
      meeting_rooms_suggestion: params.meeting_rooms_suggestion,
      assets_suggestion: params.assets_suggestion,
      services_suggestion: params.services_suggestion,
      featured_in: params.featured_in,
      organizer_note: params.organizer_note,
      admin_note: params.admin_note,
    };

      const result = await backend.post(
        `/event-modification/${params.uuid}`,
        data,
        {}
      );
      const finalResult = result.data.data;
      return finalResult.event_modifications;
  } catch (err: any) {
    const processedError = processError(err);
    throw processedError;
  }
}

export function usePostEventModification() {
  const queryClient = useQueryClient();
  return useMutation<IEventModificationResult, Error, IEventModificationParams>(postEventModification, {
    onSuccess: (data, variables) => {
      const office_uuid = variables.office_uuid;
      queryClient.invalidateQueries(["events", office_uuid]);
      queryClient.invalidateQueries(["event", office_uuid, data.uuid]);
    },
  });
}

export interface IEventModification {
  uuid: string;
  column_name: string;
  modified_by: string;
  old_value: string;
  new_value: string;
  modified_value: null;
  old_values: null;
  new_values: IPerson[] ;
  modified_values: null;
  suggestion: boolean;
  status: string;
  datetime: string;
}
async function getEventModifications(office_uuid: string, uuid: string): Promise<IEventModification[]> {
  if (!office_uuid) {
    throw "office_uuid should not be empty in getEventModifications()";
  }
  try {
    const resp = await backend.get(`/event-modification/${uuid}`, {});
    const data = resp.data;
    let result = data?.data.event_modifications;
    result = result
      .map((f: any) => ({
        ...f,
        office_uuid,
      }))
      .sort((a: any, b: any) =>
        new Date(a.created_date).getTime() < new Date(b.created_date).getTime()
          ? 1
          : -1
      );
      // if (result.length > 0) {
      //   result.office_uuid = office_uuid;
      //   result = result.map((item: any) => ({
      //     name: item.name,
      //     description: item.description,
      //     // Add other properties here in the desired order
      //   }))
      // }
    return result;
  } catch (err: any) {
    throw err;
  }
}

export function useEventModifications(office_uuid: any, uuid: string) {
  return useQuery<IEventModification[], Error>(
    ["events", office_uuid, uuid],
    () => getEventModifications(office_uuid, uuid),
    {
      refetchOnWindowFocus: false,
    }
  );
}