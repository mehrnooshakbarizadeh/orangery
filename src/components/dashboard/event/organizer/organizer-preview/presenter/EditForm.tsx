import {
  IEvent,
  IOrganizerEvent,
  IPresenter,
  usePatchEvent,
  usePostEventModification,
  useUpsertEvent,
} from "../../../../../../queries/event";
import {
  OrangeryTextAreaField,
  OrangeryTextField,
  OrangeryToast,
} from "../../../../../OrangeryElements";
import { Observer } from "mobx-react-lite";
import CrossIcon from "../../../../../../assets/svg/cross.svg";
import { EventFieldsState } from "../../../EventForm";
import {
  OrganizerEventFieldsState,
  OrganizerOrganizerState,
} from "../OrganizerReviewPage";
import { Box, Button, Divider, IconButton, Typography } from "@mui/material";
import { AddOrganizer } from "../../../form3/add_organizer/AddOrganizer";
import OrganizersAutocomplete from "../../../form3/add_organizer/OrganizersAutocomplete";
import OrganizerRow from "../../../form3/add_organizer/OrganizerRow";
import { useGlobalState } from "../../../../../../Contexts & Globals/GlobalContext";
import { AddPresenter } from "../../../form3/add_presenter/AddPresenter";
import PresentersAutocomplete from "../../../form3/add_presenter/PresentersAutocomplete";
import { PresenterBox } from "../../../form3/add_presenter/PresenterBox";

export default function EditForm({
  state,
  handleClose,
  event,
}: {
  state: OrganizerEventFieldsState;
  handleClose: () => void;
  event: IOrganizerEvent;
}) {
  const mutation = usePostEventModification();
  const globalState = useGlobalState();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      const updateData = {
        uuid: event.uuid,
        office_uuid: globalState.office_uuid,
        presenter_uuids: state.presenter_uuids.values.map(
          (presenter) => presenter.value
        ),
      };
      const result = await mutation.mutateAsync(updateData);
      state.setResultPresenter(result);
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
          py: 3.5,
          gap: 4,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderBottom: "1px solid #EDEEF0",
        }}
      >
        <Typography sx={{ fontSize: 24, fontWeight: 600, color: "#000" }}>
          Edit Presenters
        </Typography>

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
          height: "73%",
          overflowY: "auto",
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
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 1,
            pl: 4,
            mt: 3,
            mb: 3,
          }}
        >
          <Typography fontSize={18} fontWeight={600} color="#A5AAB4">
            Current
          </Typography>
          {!event?.presenters?.length && "-"}
          {event?.presenters?.map((presenter) => (
            <Presenter key={presenter.uuid} presenter={presenter} />
          ))}
        </Box>

        <Divider />
        <Box sx={{ display: "flex", flexDirection: "column", gap: 1, p: 4 }}>
          <Typography fontSize={18} fontWeight={600} color="#A5AAB4" pb={4}>
            Your Suggestion
          </Typography>

          <Observer>
            {() => (
              <>{state.isAddPresenter && <AddPresenter state={state} />}</>
            )}
          </Observer>

          <Box>
            <Observer>
              {() => (
                <>
                  <Typography fontSize={16} fontWeight={700} sx={{ mb: 2 }}>
                    Presenters
                  </Typography>
                  {!state.isAddPresenter && (
                    <PresentersAutocomplete
                      sx={{ mb: 2 }}
                      label=""
                      state={state}
                      value={state.presenter_uuids.values.map((e) => e.value)}
                      onChange={(newValues) => {
                        newValues?.forEach((e) => {
                          const i = state.presenter_uuids.values.findIndex(
                            (v) => v.value === e
                          );
                          if (i === -1) {
                            state.presenter_uuids.pushElementValue(e);
                          }
                        });
                        [...state.presenter_uuids.values].forEach((v) => {
                          const i = newValues.findIndex((e) => v.value === e);
                          if (i === -1) {
                            const j = state.presenter_uuids.values.findIndex(
                              (t) => t === v
                            );
                            state.presenter_uuids.deleteElementValue(j);
                          }
                        });
                      }}
                    />
                  )}
                </>
              )}
            </Observer>
          </Box>
          <Observer>
            {() => (
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 1,
                  flexGrow: 1,
                  height: "150px",
                  overflow: "auto",
                  mb: 4,
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
                {state.presenter_uuids.values
                  .slice()
                  .reverse()
                  .map((pr) => (
                    <PresenterBox
                      key={pr.value}
                      presenter={pr.value}
                      values={state.presenterValues}
                      state={state}
                    />
                  ))}
              </Box>
            )}
          </Observer>
        </Box>
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
        <Button
          variant="text"
          onClick={handleClose}
          sx={{
            display: "flex",
            gap: 2,
            mr: 1,
            py: "12px",
            px: 5,
          }}
        >
          <Typography
            color="#2B2E33"
            sx={{
              "&.MuiTypography-root": {
                fontSize: "21px",
                fontWeight: 600,
              },
            }}
          >
            Cancel
          </Typography>
        </Button>
        <Button
          onClick={handleSubmit}
          type="submit"
          sx={{
            display: "flex",
            gap: 2,
            mr: 1,
            py: "12px",
            px: 3,
            "& .submit": {
              fontSize: "21px",
              fontWeight: 600,
            },
          }}
          color="primary"
          variant="contained"
          disabled={mutation.isLoading}
        >
          <Typography className="submit">Send Request</Typography>
        </Button>
      </Box>
    </>
  );
}

const Presenter = ({ presenter }: { presenter: IPresenter }) => {
  return (
    <>
      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
        <Typography fontSize={19} fontWeight={600} color="#55585C">
          {presenter.name}
        </Typography>
        <Typography fontSize={16} fontWeight={600} color="#A5AAB4">
          {presenter.email}
        </Typography>
      </Box>
    </>
  );
};
