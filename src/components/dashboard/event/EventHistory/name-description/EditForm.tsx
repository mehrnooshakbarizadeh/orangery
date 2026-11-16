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
import NameSection from "./NameSection";
import DescriptionSection from "./DescriptionSection";
import { EventLogState } from "../HandleLogsRendering";

export default function EditForm({
  logNameDescription,
  state,
  handleClose,
  event,
  nameValue,
  descValue,
}: {
  state: EventLogState;
  logNameDescription: IEventModification[];
  handleClose: () => void;
  event: IEvent;
  nameValue: string;
  descValue: string;
}) {
  const mutation = usePatchEvent();
  const globalState = useGlobalState();

  async function handleSubmit(e: React.FormEvent) {
    const name = {
      office_uuid: globalState.office_uuid,
      uuid: event.uuid,
      name: state.name.value,
    };
    const description = {
      office_uuid: globalState.office_uuid,
      uuid: event.uuid,
      description: state.description.value,
    };
    if (state.name.value !== "") {
      e.preventDefault();
      try {
        const result = await mutation.mutateAsync(name);
        handleClose();
        if (event) {
          OrangeryToast("Successfully " + event.name, "success");
        }
      } catch (err: any) {}
    }
    if (state.description.value !== "") {
      e.preventDefault();
      try {
        const result = await mutation.mutateAsync(description);
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
          Edit Title and Descriptions
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
          {event?.name}
        </Typography>
        <Typography fontSize={16} fontWeight={400} color="#2B2E33" mb={6}>
          {event?.description}
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
              {nameValue && (
                <NameSection
                  state={state}
                  value={state.name.value}
                  onChange={(newValue) => (state.name.value = newValue)}
                  nameValue={nameValue}
                  event={event}
                  handleClose={handleClose}
                  isSelected={state.name.value === nameValue}
                  isDeclined={state.name.value === null}
                />
              )}
              {descValue && (
                <DescriptionSection
                  state={state}
                  value={state.description.value}
                  onChange={(newValue) => (state.description.value = newValue)}
                  descValue={descValue}
                  event={event}
                  handleClose={handleClose}
                  isSelected={state.description.value === descValue}
                  isDeclined={state.description.value === null}
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
        <Button
          onClick={handleSubmit}
          color="primary"
          variant="contained"
          sx={{
            display: "flex",
            "& .cancel-icon": { width: "1.3rem", height: "1.3rem" },
          }}
        >
          Submit
        </Button>
      </Box>
    </>
  );
}
