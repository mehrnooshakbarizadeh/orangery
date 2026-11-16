import { Observer } from "mobx-react-lite";
import CrossIcon from "../../../../../assets/svg/cross.svg";
import { Box, Button, Divider, IconButton, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import {
  IEvent,
  IEventModification,
  usePatchEvent,
} from "../../../../../queries/event";
import { useGlobalState } from "../../../../../Contexts & Globals/GlobalContext";
import { OrangeryToast } from "../../../../OrangeryElements";
import LinkSection from "./EndTimeSection";
import LocationSection from "./StartTimeSection";
import ArrowRight from "../../ArrowRight";
import StartTimeSection from "./StartTimeSection";
import EndTimeSection from "./EndTimeSection";
import WeeksSection from "./WeeksSection";
import { ValueState } from "../../../../../states/mobx-form";
import { makeAutoObservable } from "mobx";
import { EventLogState } from "../HandleLogsRendering";

export default function EditForm({
  logDateTimeWeek,
  state,
  handleClose,
  event,
  startTimeValue,
  endTimeValue,
  weekValue,
}: {
  state: EventLogState;
  logDateTimeWeek: IEventModification[];
  handleClose: () => void;
  event: IEvent;
  startTimeValue: string;
  endTimeValue: string;
  weekValue: number;
}) {
  const mutation = usePatchEvent();
  const globalState = useGlobalState();

  async function handleSubmit(e: React.FormEvent) {
    const weeks = {
      office_uuid: globalState.office_uuid,
      uuid: event.uuid,
      weeks: state.weeks.value,
    };
    const start_time = {
      office_uuid: globalState.office_uuid,
      uuid: event.uuid,
      start_time: state.start_time.value,
    };
    const end_time = {
      office_uuid: globalState.office_uuid,
      uuid: event.uuid,
      end_time: state.end_time.value,
    };

    if (state.start_time.value !== "") {
      e.preventDefault();
      try {
        const result = await mutation.mutateAsync(start_time);
        handleClose();
        if (event) {
          OrangeryToast("Successfully " + event.name, "success");
        }
      } catch (err: any) {}
    }

    if (state.end_time.value !== "") {
      e.preventDefault();
      try {
        const result = await mutation.mutateAsync(end_time);
        handleClose();
        if (event) {
          OrangeryToast("Successfully " + event.name, "success");
        }
      } catch (err: any) {}
    }

    if (!state.weeks.value) return;
    {
      e.preventDefault();
      try {
        const result = await mutation.mutateAsync(weeks);
        handleClose();
        if (event) {
          OrangeryToast("Successfully " + event.name, "success");
        }
      } catch (err: any) {}
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
          Edit Date and Time
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
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Typography fontSize={25} fontWeight={700} color="#2B2E33">
            {new Date(event.start_time).toLocaleString("de-DE", {
              day: "numeric",
              month: "long",
              year: "numeric",
              hour: "numeric",
              minute: "numeric",
              hourCycle: "h24",
            })}
          </Typography>
          <ArrowRight />
          <Typography fontSize={25} fontWeight={700} color="#2B2E33">
            {new Date(event.end_time).toLocaleString("de-DE", {
              day: "numeric",
              month: "long",
              year: "numeric",
              hour: "numeric",
              minute: "numeric",
              hourCycle: "h24",
            })}
          </Typography>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 1,
              ml: "113px",
            }}
          >
            <Box>
              <Typography fontSize={18} fontWeight={600} color="#A5AAB4">
                Recurring
              </Typography>
              <Typography>
                {event?.is_weekly ? (
                  <Typography
                    fontSize={19}
                    fontWeight={600}
                    sx={{ "& .repeat": { fontSize: "12px", fontWeight: 400 } }}
                  >
                    Weekly
                    <span className="repeat">
                      {` (Repeat for ${event.weeks} week${
                        event.weeks! > 1 ? "s" : ""
                      })`}
                    </span>
                  </Typography>
                ) : (
                  "One time"
                )}
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>
      <Divider />
      <Box sx={{ display: "flex", flexDirection: "column", gap: 1, p: 4 }}>
        <Typography fontSize={18} fontWeight={600} color="#A5AAB4" pb={4}>
          Customer Suggestion
        </Typography>

        <Observer>
          {() => (
            <>
              {startTimeValue && (
                <StartTimeSection
                  state={state}
                  value={state.start_time.value}
                  onChange={(newValue) => (state.start_time.value = newValue)}
                  startTimeValue={startTimeValue}
                  event={event}
                  handleClose={handleClose}
                  isSelected={state.start_time.value === startTimeValue}
                  isDeclined={state.start_time.value === null}
                />
              )}
              {endTimeValue && (
                <EndTimeSection
                  state={state}
                  value={state.end_time.value}
                  onChange={(newValue) => (state.end_time.value = newValue)}
                  endTimeValue={endTimeValue}
                  event={event}
                  handleClose={handleClose}
                  isSelected={state.end_time.value === endTimeValue}
                  isDeclined={state.end_time.value === null}
                />
              )}
              {weekValue ? (
                <WeeksSection
                  state={state}
                  value={state.weeks.value}
                  onChange={(newValue) => (state.weeks.value = newValue)}
                  weekValue={weekValue}
                  event={event}
                  handleClose={handleClose}
                  isSelected={state.weeks.value === weekValue}
                  isDeclined={state.weeks.value === null}
                />
              ) : (
                ""
              )}
            </>
          )}
        </Observer>
      </Box>
      <Box
        sx={{
          pr: 3,
          py: 3.5,
          gap: 1,
          display: "flex",
          justifyContent: "end",
          alignItems: "center",
          borderTop: "1px solid #EDEEF0",
          position: "absolute",
          right: 0,
          bottom: 0,
          width: "100%",
          // bottom: "27px",
          // right: "40px",
        }}
      >
        <Button
          onClick={handleClose}
          sx={{ fontSize: "21px", fontWeight: "600" }}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          onClick={handleSubmit}
          disabled={mutation.isLoading}
          color="primary"
          variant="contained"
          sx={{ fontSize: "21px", fontWeight: "600" }}
        >
          Submit
        </Button>
      </Box>
    </>
  );
}
