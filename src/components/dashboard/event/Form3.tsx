import { Observer } from "mobx-react-lite";
import { EventFieldsState, OrganizerState } from "./EventForm";
import { Box, Button, IconButton, Typography } from "@mui/material";
import PresentersAutocomplete from "./form3/add_presenter/PresentersAutocomplete";
import React from "react";
import { AddPresenter } from "./form3/add_presenter/AddPresenter";
import { PresenterBox } from "./form3/add_presenter/PresenterBox";
import AttendeesAutocomplete from "./form3/add_attendees/AttendeesAutocomplete";
import { AttendeeBox } from "./form3/add_attendees/AttendeeBox";
import { AddAttendee } from "./form3/add_attendees/AddAttendee";
import OrganizersAutocomplete from "./form3/add_organizer/OrganizersAutocomplete";
import OrganizerRow from "./form3/add_organizer/OrganizerRow";
import { AddOrganizer } from "./form3/add_organizer/AddOrganizer";
import PlusIcon from "../../../assets/svg/plus.svg";
import RemoveIcon from "@mui/icons-material/Remove";
import { error } from "console";
import { isError } from "react-query";

export default function Form3({ state }: { state: EventFieldsState }) {
  return (
    <>
      <form>
        <Box>
          <Observer>
            {() => (
              <>{state.isAddOrganizer && <AddOrganizer state={state} />}</>
            )}
          </Observer>

          <Observer>
            {() => (
              <>
                <Typography fontSize={16} fontWeight={700} sx={{ mb: 2 }}>
                  Organizers
                </Typography>
                {!state.isAddOrganizer && (
                  <OrganizersAutocomplete
                    sx={{ mb: 2 }}
                    label=""
                    state={state}
                    value={state.organizer_uuids.values.map(
                      (e) => e.value.uuid.value
                    )}
                    onChange={(newValues) => {
                      newValues?.forEach((e) => {
                        const i = state.organizer_uuids.values.findIndex(
                          (v) => v.value.uuid.value === e.uuid
                        );
                        if (i === -1) {
                          state.organizer_uuids?.pushElementValue(
                            new OrganizerState(
                              e.uuid,
                              e.name,
                              e.email,
                              e.image!,
                              ""
                            )
                          );
                        }
                      });
                    }}
                  />
                )}
              </>
            )}
          </Observer>

          <Observer>
            {() => (
              <>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 1,
                    flexGrow: 1,
                    height: "150px",
                    overflow: "auto",
                    mb: 4,
                    pt: 1,
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
                  {state.organizer_uuids.values?.map((e) => (
                    <OrganizerRow
                      key={e.value.uuid.value}
                      state={state}
                      organizer={e.value}
                    />
                  ))}
                </Box>
              </>
            )}
          </Observer>
        </Box>
        <Observer>
          {() => <>{state.isAddPresenter && <AddPresenter state={state} />}</>}
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
      </form>
    </>
  );
}

const AttendeeCounter = ({
  value,
  onChange,
}: {
  value: number;
  onChange: (value: number) => void;
}) => {
  const handleDec = () => {
    if (value > 0) {
      onChange(value - 1);
    }
  };
  const handleInc = () => {
    onChange(value + 1);
  };
  return (
    <>
      <Box
        sx={{
          mb: 2,
          width: "30%",
          backgroundColor: "#F9F9FA",
          borderRadius: "6px",
          display: "flex",
          alignItems: "center",
          gap: 1,
          px: 1.5,
          height: "55px",
          "& .plus-icon": {
            width: "0.8rem",
            height: "0.8rem",
            color: "#000",
          },
        }}
      >
        <Typography fontSize="13px" fontWeight={600} whiteSpace="nowrap">
          Number of Attendees
        </Typography>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <IconButton onClick={handleDec}>
            <RemoveIcon className="plus-icon" />
          </IconButton>
          <Typography fontSize="14px" fontWeight={700}>
            {value}
          </Typography>
          <IconButton onClick={handleInc}>
            <PlusIcon className="plus-icon" />
          </IconButton>
        </Box>
      </Box>
    </>
  );
};
