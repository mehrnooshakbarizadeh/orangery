import {
  IAttendee,
  IEvent,
  IOrganizerEvent,
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
import { AddAttendee } from "../../../form3/add_attendees/AddAttendee";
import AttendeesAutocomplete from "../../../form3/add_attendees/AttendeesAutocomplete";
import AttendeeCounter from "../../../AttendeeCounter";
import { AttendeeBox } from "../../../form3/add_attendees/AttendeeBox";

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

  console.log(
    "state.organizer_uuids.values",
    state.organizer_uuids.values.map((c) => c.value)
  );
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      const updateData = {
        uuid: event.uuid,
        office_uuid: globalState.office_uuid,
        attendee_uuids: state.attendee_uuids.values.map(
          (attendee) => attendee.value
        ),
      };
      const result = await mutation.mutateAsync(updateData);
      console.log(result);
      state.setResultAttendee(result);
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
          // flexDirection: 'column',
          justifyContent: "space-between",
          alignItems: "center",
          borderBottom: "1px solid #EDEEF0",
        }}
      >
        <Typography sx={{ fontSize: 24, fontWeight: 600, color: "#000" }}>
          Edit Attendees
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
        {event?.attendees?.map((attendee) => (
          <Attendee key={attendee.uuid} attendee={attendee} />
        ))}
      </Box>

      <Divider />
      <Box sx={{ display: "flex", flexDirection: "column", gap: 1, p: 4 }}>
        <Typography fontSize={18} fontWeight={600} color="#A5AAB4" pb={4}>
          Your Suggestion
        </Typography>

        <Box>
          <Observer>
            {() => <>{state.isAddAttendee && <AddAttendee state={state} />}</>}
          </Observer>

          <Observer>
            {() => (
              <>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "end",
                  }}
                >
                  <Typography
                    fontSize={16}
                    fontWeight={700}
                    sx={{ mb: 2 }}
                    flexGrow={1}
                  >
                    Attendees
                  </Typography>
                  <AttendeeCounter
                    value={state.capacity.value}
                    onChange={(newValue: number) =>
                      (state.capacity.value = newValue)
                    }
                  />
                </Box>
                {!state.isAddAttendee && (
                  <AttendeesAutocomplete
                    sx={{ mb: 2 }}
                    label=""
                    state={state}
                    value={state.attendee_uuids.values.map((e) => e.value)}
                    onChange={(newValues) => {
                      if (newValues?.length <= state.capacity.value) {
                        newValues?.forEach((e) => {
                          const i = state.attendee_uuids.values.findIndex(
                            (v) => v.value === e
                          );
                          if (i === -1) {
                            state.attendee_uuids.pushElementValue(e);
                          }
                        });
                      } else {
                        state.attendee_uuids.error = `Error: The number of attendees is more than ${state.capacity.value}`;
                      }
                      [...state.attendee_uuids.values].forEach((v) => {
                        const i = newValues.findIndex((e) => v.value === e);
                        if (i === -1) {
                          const j = state.attendee_uuids.values.findIndex(
                            (t) => t === v
                          );
                          state.attendee_uuids.deleteElementValue(j);
                        }
                      });
                    }}
                  />
                )}
                <Typography
                  fontSize={16}
                  fontWeight={600}
                  color="red"
                  ml={1}
                  mb={1}
                >
                  {state.attendee_uuids.error}
                </Typography>
              </>
            )}
          </Observer>

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
            <Observer>
              {() => (
                <>
                  {state.attendee_uuids.values
                    .slice()
                    .reverse()
                    .map((pr) => (
                      <AttendeeBox
                        key={pr.value}
                        attendee={pr.value}
                        values={state.attendeeValues}
                        state={state}
                      />
                    ))}
                </>
              )}
            </Observer>
          </Box>
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

const Attendee = ({ attendee }: { attendee: IAttendee }) => {
  return (
    <>
      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
        <Typography fontSize={19} fontWeight={600} color="#55585C">
          {attendee.name}
        </Typography>
        <Typography fontSize={16} fontWeight={600} color="#A5AAB4">
          {attendee.email}
        </Typography>
      </Box>
    </>
  );
};
