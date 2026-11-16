import {
  IEvent,
  IEventService,
  IMeetingRoom,
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
import { OrganizerEventFieldsState } from "../OrganizerReviewPage";
import { Box, Button, Divider, IconButton, Typography } from "@mui/material";
import { useEffect } from "react";
import { useGlobalState } from "../../../../../../Contexts & Globals/GlobalContext";

export default function EditForm({
  state,
  handleClose,
  event,
}: {
  state: OrganizerEventFieldsState;
  handleClose: () => void;
  event: IOrganizerEvent;
}) {
  const mutation = usePatchEvent();
  // const mutation = usePostEventModification();
  const globalState = useGlobalState();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    // debugger;
    try {
      const updateData = {
        uuid: event.uuid,
        office_uuid: globalState.office_uuid,
        organizer_note: state.organizer_note.value,
      };
      const result = await mutation.mutateAsync(updateData);
      state.setResultNote(result);
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
          Edit Optional Note
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
        {event?.organizer_note ? event?.organizer_note : "No note added"}
      </Box>
      <Divider />
      <Box sx={{ display: "flex", flexDirection: "column", gap: 1, p: 4 }}>
        <Typography fontSize={18} fontWeight={600} color="#A5AAB4" pb={4}>
          Your Suggestion
        </Typography>

        <Observer>
          {() => (
            <OrangeryTextAreaField
              sx={{
                width: "100%",
                height: "118px",
                mb: 4,
              }}
              editorHeight="5.9rem"
              label="Optional Note"
              name="organizer_note"
              multiline
              placeholder="Optional Note"
              error={!!state.organizer_note.error}
              value={state.organizer_note.value}
              helperText={state.organizer_note.error}
              onChange={(e: any) =>
                (state.organizer_note.value = e.target.value)
              }
            />
          )}
        </Observer>
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
