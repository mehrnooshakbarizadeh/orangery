import { Observer } from "mobx-react-lite";
import CrossIcon from "../../../../../assets/svg/cross.svg";
import { Box, Button, Divider, IconButton, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import {
  IEvent,
  IEventModification,
  usePatchEvent,
} from "../../../../../queries/event";
import { useGlobalState } from "../../../../../Contexts & Globals/GlobalContext";
import { OrangeryToast } from "../../../../OrangeryElements";
import LinkSection from "./LinkSection";
import LocationSection from "./LocationSection";
import { EventLogState } from "../HandleLogsRendering";

export default function EditForm({
  logAddressLink,
  state,
  handleClose,
  event,
  locationValue,
  linkValue,
}: {
  state: EventLogState;
  logAddressLink: IEventModification[];
  handleClose: () => void;
  event: IEvent;
  locationValue: string;
  linkValue: string;
}) {
  console.log(logAddressLink);
  const mutation = usePatchEvent();
  const globalState = useGlobalState();

  async function handleSubmit(e: React.FormEvent) {
    console.log(state.location.value, state.event_link.value);
    const location = {
      office_uuid: globalState.office_uuid,
      uuid: event.uuid,
      location: state.location.value,
    };
    const event_link = {
      office_uuid: globalState.office_uuid,
      uuid: event.uuid,
      event_link: state.event_link.value,
    };
    if (state.location.value !== "") {
      e.preventDefault();
      try {
        const result = await mutation.mutateAsync(location);
        handleClose();
        if (event) {
          OrangeryToast("Successfully " + event.name, "success");
        }
      } catch (err: any) {}
    }
    if (state.event_link.value !== "") {
      e.preventDefault();
      try {
        const result = await mutation.mutateAsync(event_link);
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
          Edit Location
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
        }}
      >
        <Typography fontSize={18} fontWeight={600} color="#A5AAB4">
          Current
        </Typography>
        <Typography fontSize={25} fontWeight={700} color="#2B2E33">
          {event?.location ? event?.location : "-"}
        </Typography>
        <Typography fontSize={16} fontWeight={400} color="#2B2E33" mb={6}>
          {event?.event_link}
        </Typography>
      </Box>
      <Divider />
      <Box sx={{ display: "flex", flexDirection: "column", gap: 1, p: 4 }}>
        <Typography fontSize={18} fontWeight={600} color="#A5AAB4" pb={4}>
          Customer Suggestion
        </Typography>

        <Observer>
          {() => (
            <>
              {locationValue && (
                <LocationSection
                  state={state}
                  value={state.location.value}
                  onChange={(newValue) => (state.location.value = newValue)}
                  locationValue={locationValue}
                  event={event}
                  handleClose={handleClose}
                  isSelected={state.location.value === locationValue}
                  isDeclined={state.location.value === null}
                />
              )}
              {linkValue && (
                <LinkSection
                  state={state}
                  // value={state.event_link.value}
                  onChange={(newValue) => (state.event_link.value = newValue)}
                  linkValue={linkValue}
                  event={event}
                  handleClose={handleClose}
                  isSelected={state.event_link.value === linkValue}
                  isDeclined={state.event_link.value === null}
                />
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
        }}
      >
        <Button
          onClick={handleClose}
          sx={{
            display: "flex",
            "& .cancel-icon": { width: "1.3rem", height: "1.3rem" },
          }}
        >
          Cancel
        </Button>
        <Observer>
          {() => (
            <Button
              onClick={handleSubmit}
              disabled={mutation.isLoading}
              color="primary"
              variant="contained"
              sx={{
                display: "flex",
                "& .cancel-icon": { width: "1.3rem", height: "1.3rem" },
              }}
            >
              Submit
            </Button>
          )}
        </Observer>
      </Box>
    </>
  );
}
