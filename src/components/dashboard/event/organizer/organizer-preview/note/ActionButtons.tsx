import { useState } from "react";
import {
  IEvent,
  IOrganizerEvent,
  usePatchEvent,
} from "../../../../../../queries/event";
import { Button, Dialog, DialogContent, Typography } from "@mui/material";
import { EventFieldsState } from "../../../EventForm";
import { OrganizerEventFieldsState } from "../OrganizerReviewPage";
import EditForm from "./EditForm";
import { useGlobalState } from "../../../../../../Contexts & Globals/GlobalContext";
import { OrangeryToast } from "../../../../../OrangeryElements";
import { Observer } from "mobx-react-lite";

export default function ActionButtons({
  event,
  state,
}: {
  event: IOrganizerEvent;
  state: OrganizerEventFieldsState;
}) {
  const [openEdit, setOpenEdit] = useState(false);
  const handleOpenEdit = () => setOpenEdit(true);
  const handleClose = () => {
    state.organizer_note.value = "";
  };

  const mutation = usePatchEvent();
  const globalState = useGlobalState();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      const updateData = {
        uuid: event.uuid,
        office_uuid: globalState.office_uuid,
        organizer_note: state.organizer_note.value,
      };
      const result = await mutation.mutateAsync(updateData);
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
      <Button
        variant="text"
        onClick={handleClose}
        sx={{
          borderRadius: "5px",
          py: 1.9,
          px: 3.4,
        }}
      >
        <Typography fontSize={16} fontWeight={600}>
          Cancel
        </Typography>
      </Button>
      <Observer>
        {() => (
          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={mutation.isLoading || !state.organizer_note.value}
            sx={{
              borderRadius: "5px",
              py: 1.9,
              px: 3.4,
            }}
          >
            <Typography fontSize={16} fontWeight={600}>
              Save
            </Typography>
          </Button>
        )}
      </Observer>
    </>
  );
}
