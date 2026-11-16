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
import { Box, Fade, IconButton, Tooltip, Typography } from "@mui/material";
//Orangery elements & internal dependencies
import {
  OrangeryNavigationContentLoader,
  OrangeryNavigationPlaceholder,
} from "../../../OrangeryElements";
import FormTitle from "./formComponents/FormTitle";
import {
  UserListCard,
  PreviewOSUsersListCard,
  PostSyncListCard,
  PreviewOSUsersForm,
} from "./GoogleAdminUsersImportScaffold";
import { FormFooter } from "./formComponents/FormFooter";
import GoogleAdminUsersImportScaffold from "./GoogleAdminUsersImportScaffold";
// icons, images & colors
import PlaceholderSvg from "../../../../assets/svg/placeholders/default.svg";
import GoogleAdminLogo from "../../../../assets/svg/apps/googleAdminResources/googleAdminLogo.svg";
import OrangeryOSLogo from "../../../../assets/svg/apps/googleAdminResources/OrangeryOS-small.svg";
import GoogleLoading from "./formComponents/GoogleLoading";
//Queries & Backend
import {
  useGoogleAdminUsersPreview,
  IGoogleUserImport,
  useGoogleUserImport,
  IGoogleUser,
} from "../../../../queries/apps/googleAdminUsers";
import { useOffices } from "../../../../queries/office";
import { IGroup, useGroups } from "../../../../queries/group";
import { useGlobalState } from "../../../../Contexts & Globals/GlobalContext";

export class GoogleUserImportState {
  public googleUsers;
  public error = "";

  constructor(
    googleUsers?: IGoogleUser[],
    officeUuid?: string,
    groupUuid?: string
  ) {
    if (googleUsers) {
      this.googleUsers = googleUsers?.map((user) => {
        return {
          firstName: user.first_name,
          lastName: user.last_name,
          email: user.email,
          group_uuid: new ValueState<string>(groupUuid ?? ""),
          office_id: new ValueState<string>(officeUuid ?? ""),
          selected: new ValueState<boolean>(false),
          // selectAll: new ValueState<boolean>(false),
        };
      });
    } else {
      this.googleUsers = [] as any[];
    }
    makeAutoObservable(this);
  }

  get data() {
    return this.googleUsers
      .filter((user) => user.selected.value)
      .map((user) => ({
        office_id: user.office_id.value,
        group_uuid: user.group_uuid.value,
        first_name: user.firstName,
        last_name: user.lastName,
        email: user.email,
      }));
  }

  get validateImport() {
    return !(this.googleUsers.filter((user) => user.selected.value).length > 0);
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

export default function GoogleUsersImportForm({
  googleUserSync,
}: {
  googleUserSync?: IGoogleUserImport;
}) {
  const { office_uuid } = useGlobalState();
  const { data: groups, isLoading: loadingGroups } = useGroups();
  const { data: offices, isLoading: isLoadingOffice, isError } = useOffices();
  const [afterSync, setAfterSync] = React.useState(false);
  const { data, isLoading, error } = useGoogleAdminUsersPreview();
  const [syncLoading, setSyncLoading] = React.useState(false);
  const router = useRouter();
  const mutation = useGoogleUserImport();
  const state = React.useMemo(() => {
    const employeeGroupUuid = groups?.find(
      (group: IGroup) => group.name === "employee"
    )?.uuid;
    return new GoogleUserImportState(data, office_uuid, employeeGroupUuid);
  }, [data, office_uuid, groups]);

  const afterSyncErrorCount = mutation.data?.filter(
    (user) => user.error !== null
  ).length;

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
        <Box
          sx={{
            backgroundColor: "#fff",
            display: "flex",
            flexDirection: "column",
            justifyContent: "start",
            height: "100%",
            // minHeight: 666,
            borderRadius: 1.5,
            pt: 3,
            // px: 2,
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
            }}
          >
            <GoogleAdminLogo />
            <Typography sx={{ ml: 2, fontSize: "26px", fontWeight: 600 }}>
              Google Admin Users
            </Typography>
          </Box>
          <Box
            sx={{
              pr: 1,
              overflowY: "auto",
              display: "flex",
              flexWrap: "wrap",
              alignContent: "flex-start",
              gap: 2.5,
              mt: 3,
              pt: 0.5,
              pb: 0.5,
              pl: 1,
              height: `calc(100% - 56px)`,
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
            <GoogleAdminUsersImportScaffold
              users={state.googleUsers}
              mainTitle={
                <FormTitle
                  logo={<GoogleAdminLogo style={{ height: 24, width: 24 }} />}
                  title={"Import Google Admin Users"}
                />
              }
              leftList={state.googleUsers.map((user, idx) => (
                <UserListCard
                  key={idx}
                  user={user}
                  offices={offices}
                  groups={groups}
                />
              ))}
              rightList={
                <Observer>
                  {() => (
                    <PreviewOSUsersForm
                      title={
                        "Preview of Orangery users list after sync with Google Admin Users"
                      }
                      subTitle={
                        <FormTitle
                          title={"Orangery".toUpperCase()}
                          logo={
                            <OrangeryOSLogo style={{ height: 24, width: 52 }} />
                          }
                        />
                      }
                      listCard={state.googleUsers.map((user, idx) => (
                        <PreviewOSUsersListCard
                          key={idx}
                          user={user}
                          offices={offices}
                          groups={groups}
                        />
                      ))}
                      emptyState={
                        state.googleUsers.filter(
                          (user) => user.selected.value === true
                        ).length === 0
                      }
                    />
                  )}
                </Observer>
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
          </Box>
        </Box>
      </>
    ) : (
      <GoogleAdminUsersImportScaffold
        mainTitle={
          <FormTitle
            logo={<GoogleAdminLogo style={{ height: 24, width: 24 }} />}
            title={"Import Google Admin Users"}
          />
        }
        rightList={
          <PreviewOSUsersForm
            title={
              "Preview of Orangery users list after sync with Google Admin Users"
            }
            subTitle={
              <FormTitle
                title={"Orangery".toUpperCase()}
                logo={<OrangeryOSLogo style={{ height: 24, width: 52 }} />}
              />
            }
            listCard={mutation.data?.map((user, idx) => (
              <PostSyncListCard
                key={idx}
                afterSyncUser={user}
                groups={groups}
              />
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
        afterSyncErrorCount={afterSyncErrorCount}
      />
    )
  ) : (
    <OrangeryNavigationPlaceholder
      vertical
      title={"No Data available!"}
      subtitle={""}
      PlaceholderSvg={PlaceholderSvg}
      width={213}
      height={224}
    />
  );
}
