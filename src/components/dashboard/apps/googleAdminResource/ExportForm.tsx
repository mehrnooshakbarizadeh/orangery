import React from "react";
import { useRouter } from "next/router";
import { Box, Button, Typography } from "@mui/material";
import { useGlobalState } from "../../../../Contexts & Globals/GlobalContext";
import {
  ArrayValueState,
  FieldError,
  FormError,
  ValueState,
} from "../../../../states/mobx-form";
import { makeAutoObservable } from "mobx";
import { Observer } from "mobx-react-lite";
//Orangery elements & internal dependencies
import {
  OrangeryNavigationContentLoader,
  OrangeryNavigationPlaceholder,
  OrangeryText,
  OrangeryToast,
} from "../../../OrangeryElements";
import FormTitle from "./formComponents/FormTitle";
import {
  ResourceListCard,
  PreviewMeetingRoomsForm,
  PreviewMeetingRoomsListCard,
  PostSyncListCard,
} from "./GoogleAdminExportScaffold";
import { FormFooter } from "./formComponents/FormFooter";
import GoogleAdminExportScaffold from "./GoogleAdminExportScaffold";
// icons, images & colors
import PlaceholderSvg from "../../../../assets/svg/placeholders/default.svg";
import GoogleAdminLogo from "../../../../assets/svg/apps/googleAdminResources/googleAdminLogo.svg";
import OrangeryOSLogo from "../../../../assets/svg/apps/googleAdminResources/OrangeryOS-small.svg";
import GoogleLoading from "./formComponents/GoogleLoading";
//Queries & Backend
import {
  useGoogleAdminPreview,
  IGoogleExport,
  useGoogleExport,
  IOSItem,
} from "../../../../queries/apps/googleAdmin";
import { useOffices } from "../../../../queries/office";

export class GoogleExportState {
  public googleItems;
  public error = "";

  constructor(googleItems?: IOSItem[]) {
    if (googleItems) {
      this.googleItems = new ArrayValueState(
        googleItems?.map((item) => {
          return {
            office: item.office,
            meetingRooms: item.meeting_rooms.map((meetingRoom) => {
              return {
                id: meetingRoom.id,
                name: meetingRoom.name,
                synced: meetingRoom.synced,
                floors: meetingRoom.floor_names,
                selected: new ValueState(false),
              };
            }),
            building_id: new ValueState<string>(""),
            floor_name: new ValueState<string>(""),
            emptyOfficeFloor: new ValueState(false),
          };
        })
      );
    } else {
      this.googleItems = new ArrayValueState([] as any[]);
    }
    makeAutoObservable(this);
  }

  get data() {
    const osUnsyncedMeetingRooms = this.googleItems.values?.filter(
      (item) =>
        item.value.meetingRooms.filter(
          (meetingRoom: any) => meetingRoom.synced === false
        ).length > 0
    );
    return osUnsyncedMeetingRooms
      .map((item) => {
        if (
          item.value.meetingRooms.filter(
            (resource: any) => resource.selected.value
          ).length
        )
          return {
            building_id: item.value.emptyOfficeFloor.value
              ? null
              : item.value.building_id.value,
            floor_name: item.value.emptyOfficeFloor.value
              ? null
              : item.value.floor_name.value,
            meeting_rooms: item.value.meetingRooms
              .filter((meetingRoom: any) => meetingRoom.selected.value)
              .map((meetingRoom: any) => meetingRoom.id),
          };
      })
      .filter((item) => item !== undefined);
  }

  get validateExport() {
    return !(
      this.googleItems.values.filter(
        (resourceItem) =>
          resourceItem.value.meetingRooms.filter(
            (resource: any) => resource.selected.value
          ).length &&
          (resourceItem.value.emptyOfficeFloor.value ||
            (resourceItem.value.building_id.value &&
              resourceItem.value.floor_name.value))
      ).length > 0
    );
  }

  clearErrors() {
    this.error = "";
  }

  validate() {
    let valid = true;
    this.clearErrors();
    return valid;
  }

  setupErrors(err: FormError) {
    this.clearErrors();
    err.errors?.forEach((error) => this.setupError(error));
  }

  setupError(error: FieldError) {
    if (error.field === "") {
      this.error = error.error;
    }
  }
}

export default function ExportForm({
  googleSync,
}: {
  googleSync?: IGoogleExport;
}) {
  const { data: offices, isLoading: isLoadingOffice, isError } = useOffices();
  const [afterSync, setAfterSync] = React.useState(false);
  const { data, isLoading, error } = useGoogleAdminPreview();
  const router = useRouter();
  const mutation = useGoogleExport();
  const state = React.useMemo(
    () => new GoogleExportState(data?.os_meeting_rooms),
    [data]
  );

  const OSUnsyncedMeetingRooms = state.googleItems.values.filter(
    (item) =>
      item.value.meetingRooms.filter(
        (meetingRoom: any) => meetingRoom.synced === false
      ).length > 0
  );

  const googleResources = data?.google_resources;

  const totalErrorsCount = mutation.data
    ?.map(
      (item) =>
        item.resources.filter((resourceError) => resourceError.error).length
    )
    .reduce((a, b) => a + b, 0);

  async function handleExport(e: React.FormEvent) {
    e.preventDefault();
    if (!state.validate()) {
      return;
    }
    try {
      await mutation.mutateAsync(state.data);
      setAfterSync(true);
    } catch (err: any) {
      state.setupErrors(err);
    }
  }

  return isLoading ? (
    <OrangeryNavigationContentLoader />
  ) : data ? (
    !afterSync ? (
      <>
        <GoogleAdminExportScaffold
          mainTitle={
            <FormTitle
              logo={<OrangeryOSLogo style={{ height: 24, width: 52 }} />}
              title={"Export Orangery Offices and Meeting Rooms"}
            />
          }
          leftList={OSUnsyncedMeetingRooms?.map((item, idx) => (
            <ResourceListCard
              key={idx}
              resource={item}
              offices={offices}
              buildings={data.google_resources.filter((item) => item.building)}
            />
          ))}
          rightList={
            <PreviewMeetingRoomsForm
              title={"Preview of Google Admin lists after sync with Orangery"}
              subTitle={
                <FormTitle
                  title={"Google admin".toUpperCase()}
                  logo={<GoogleAdminLogo style={{ height: 32, width: 32 }} />}
                />
              }
              listCard={OSUnsyncedMeetingRooms?.map((item, idx) => (
                <PreviewMeetingRoomsListCard
                  key={idx}
                  card={item}
                  offices={offices}
                  googleResources={googleResources}
                />
              ))}
              emptyState={OSUnsyncedMeetingRooms}
            />
          }
          formFooter={
            <FormFooter
              buttonLeft={
                <Button
                  sx={{ width: "144px", backgroundColor: "#fff" }}
                  onClick={() => {
                    router.push("/dashboard/apps");
                  }}
                >
                  Cancel
                </Button>
              }
              buttonRight={
                <Observer>
                  {() => (
                    <Button
                      disabled={state.validateExport}
                      variant="contained"
                      color="primary"
                      aria-label="sync"
                      sx={{ width: "144px" }}
                      onClick={handleExport}
                    >
                      Export
                    </Button>
                  )}
                </Observer>
              }
            />
          }
        />
      </>
    ) : (
      <GoogleAdminExportScaffold
        mainTitle={
          <FormTitle
            logo={<OrangeryOSLogo style={{ height: 24, width: 52 }} />}
            title={"Export Orangery Offices and Meeting Rooms"}
          />
        }
        rightList={
          <PreviewMeetingRoomsForm
            title={"Preview of Google Admin lists after sync with Orangery"}
            subTitle={
              <FormTitle
                title={"Google admin".toUpperCase()}
                logo={<GoogleAdminLogo style={{ height: 32, width: 32 }} />}
              />
            }
            listCard={mutation.data?.map((item, idx) => (
              <PostSyncListCard responseCard={item} key={idx} />
            ))}
          />
        }
        formFooter={
          <FormFooter
            buttonRight={
              <Observer>
                {() => (
                  <Button
                    variant="contained"
                    color="primary"
                    aria-label="done"
                    sx={{ width: "144px" }}
                    onClick={() => {
                      router.push("/dashboard/apps");
                    }}
                  >
                    Done
                  </Button>
                )}
              </Observer>
            }
          />
        }
        totalErrorsCount={totalErrorsCount}
        afterSyncExport
      />
    )
  ) : (
    <OrangeryNavigationPlaceholder
      vertical
      title={"No Meeting Rooms!"}
      subtitle={""}
      PlaceholderSvg={PlaceholderSvg}
      width={213}
      height={224}
    />
  );
}
