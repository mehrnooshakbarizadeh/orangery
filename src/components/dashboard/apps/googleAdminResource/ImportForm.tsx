import React from "react";
import { useRouter } from "next/router";
import { Button } from "@mui/material";
import MenuItem from "@mui/material/MenuItem";
import {
  ArrayValueState,
  FieldError,
  FormError,
  ValueState,
} from "../../../../states/mobx-form";
import { Observer } from "mobx-react-lite";
import { makeAutoObservable } from "mobx";
//Orangery elements & internal dependencies
import {
  OrangeryNavigationContentLoader,
  OrangeryNavigationPlaceholder,
} from "../../../OrangeryElements";
import FormTitle from "./formComponents/FormTitle";
import {
  ResourceListCard,
  PreviewMeetingRoomsListCard,
  PostSyncListCard,
  PreviewMeetingRoomsForm,
} from "./GoogleAdminImportScaffold";
import { FormFooter } from "./formComponents/FormFooter";
import GoogleAdminScaffold from "./GoogleAdminImportScaffold";
import AddNewOfficeDialog from "../../_components/officeSelect/AddNewOfficeDialog";
// icons, images & colors
import PlaceholderSvg from "../../../../assets/svg/placeholders/default.svg";
import GoogleAdminLogo from "../../../../assets/svg/apps/googleAdminResources/googleAdminLogo.svg";
import OrangeryOSLogo from "../../../../assets/svg/apps/googleAdminResources/OrangeryOS-small.svg";
import GoogleLoading from "./formComponents/GoogleLoading";
//Queries & Backend
import {
  useGoogleAdminPreview,
  IGoogleImport,
  useGoogleImport,
  IGoogleItem,
} from "../../../../queries/apps/googleAdmin";
import { useOffices } from "../../../../queries/office";

export class GoogleImportState {
  public googleItems;
  public error = "";

  constructor(googleItems?: IGoogleItem[]) {
    if (googleItems) {
      this.googleItems = new ArrayValueState(
        googleItems?.map((item) => {
          return {
            building: item.building,
            resources: item.resources.map((resource) => {
              return {
                id: resource.id,
                name: resource.name,
                synced: resource.synced,
                selected: new ValueState(false),
              };
            }),
            // allSelected: new ValueState(false),
            office_id: new ValueState<string>(""),
            floor_id: new ValueState<string>(""),
          };
        })
      );
    } else {
      this.googleItems = new ArrayValueState([] as any[]);
    }
    makeAutoObservable(this);
  }

  get data() {
    const googleUnsyncedMeetingRooms = this.googleItems.values?.filter(
      (item) =>
        item.value.resources.filter(
          (meetingRoom: any) => meetingRoom.synced === false
        ).length > 0
    );
    return googleUnsyncedMeetingRooms
      .map((item) => ({
        office_id: item.value.office_id.value,
        floor_id: item.value.floor_id.value,
        resources: item.value.resources
          .filter((resource: any) => resource.selected.value)
          .map((resource: any) => resource.id),
      }))
      .filter((item) => item.office_id !== "");
  }

  get validateImport() {
    return !(
      this.googleItems.values.filter(
        (resourceItem) =>
          resourceItem.value.resources.filter(
            (resource: any) => resource.selected.value
          ).length &&
          resourceItem.value.office_id.value !== "" &&
          resourceItem.value.floor_id.value !== ""
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

export default function ImportForm({
  googleSync,
}: {
  googleSync?: IGoogleImport;
}) {
  const { data: offices, isLoading: isLoadingOffice, isError } = useOffices();
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [afterSync, setAfterSync] = React.useState(false);
  const { data, isLoading, error } = useGoogleAdminPreview();
  const [syncLoading, setSyncLoading] = React.useState(false);
  const router = useRouter();
  const mutation = useGoogleImport();
  const state = React.useMemo(
    () => new GoogleImportState(data?.google_resources),
    [data]
  );

  const googleUnsyncedMeetingRooms = state.googleItems.values?.filter(
    (item) =>
      item.value.resources.filter(
        (meetingRoom: any) => meetingRoom.synced === false
      ).length > 0
  );

  const osResources = data?.os_meeting_rooms;

  function handleAddNewOfficeButtonClick() {
    setDialogOpen(true);
  }

  async function handleImport(e: React.FormEvent) {
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
        <GoogleAdminScaffold
          mainTitle={
            <FormTitle
              logo={<GoogleAdminLogo style={{ height: 24, width: 24 }} />}
              title={"Import Google Admin Buildings and Meeting Rooms"}
            />
          }
          leftList={googleUnsyncedMeetingRooms?.map((item, idx) => (
            <ResourceListCard
              key={idx}
              resource={item}
              offices={offices}
              addNewOfficeButton={
                <Observer>
                  {() => (
                    <MenuItem>
                      <Button
                        sx={{
                          backgroundColor: "#F9D507",
                          width: "100%",
                          borderRadius: "10px",
                          fontSize: item.value.office_id.value !== "" ? 12 : 14,
                          fontWeight: 700,
                          color: "#2B2E33",
                        }}
                        onClick={handleAddNewOfficeButtonClick}
                      >
                        Create New Office
                      </Button>
                    </MenuItem>
                  )}
                </Observer>
              }
            />
          ))}
          rightList={
            <PreviewMeetingRoomsForm
              title={
                "Preview of Orangery Meeting Rooms list after sync with Google Admin Resources"
              }
              subTitle={
                <FormTitle
                  title={"Orangery".toUpperCase()}
                  logo={<OrangeryOSLogo style={{ height: 24, width: 52 }} />}
                />
              }
              listCard={googleUnsyncedMeetingRooms?.map((item, idx) => (
                <PreviewMeetingRoomsListCard
                  key={idx}
                  card={item}
                  offices={offices}
                  osResources={osResources}
                />
              ))}
              emptyState={googleUnsyncedMeetingRooms}
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
                      variant="contained"
                      color="primary"
                      aria-label="sync"
                      disabled={state.validateImport}
                      sx={{ width: "144px" }}
                      onClick={handleImport}
                    >
                      Import
                    </Button>
                  )}
                </Observer>
              }
            />
          }
        />
        <AddNewOfficeDialog open={dialogOpen} setOpen={setDialogOpen} />
      </>
    ) : (
      <GoogleAdminScaffold
        mainTitle={
          <FormTitle
            logo={<GoogleAdminLogo style={{ height: 24, width: 24 }} />}
            title={"Import Google Admin Buildings and Meeting Rooms"}
          />
        }
        rightList={
          <PreviewMeetingRoomsForm
            title={
              "Preview of Orangery Meeting Rooms list after sync with Google Admin Resources"
            }
            subTitle={
              <FormTitle
                title={"Orangery".toUpperCase()}
                logo={<OrangeryOSLogo style={{ height: 24, width: 52 }} />}
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
        afterSyncImport
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
