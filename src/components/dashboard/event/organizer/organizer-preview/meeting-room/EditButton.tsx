import { useState } from "react";
import { IEvent, IOrganizerEvent } from "../../../../../../queries/event";
import { Button, Dialog, DialogContent, Typography } from "@mui/material";
import { EventFieldsState } from "../../../EventForm";
import { OrganizerEventFieldsState } from "../OrganizerReviewPage";
import EditForm from "./EditForm";

export default function EditButton({
  event,
  state,
}: {
  event: IOrganizerEvent;
  state: OrganizerEventFieldsState;
}) {
  const [openEdit, setOpenEdit] = useState(false);
  const handleOpenEdit = () => setOpenEdit(true);
  const handleCloseEdit = () => {
    setOpenEdit(false);
  };
  return (
    <>
      <Button
        variant="outlined"
        onClick={handleOpenEdit}
        sx={{
          borderRadius: "45px",
          py: "4px",
          px: "26px",
        }}
      >
        <Typography fontSize={16} fontWeight={600}>
          Edit
        </Typography>
      </Button>
      <Dialog
        open={openEdit}
        onClose={handleCloseEdit}
        sx={{
          "& .MuiPaper-root": {
            width: 885,
            minWidth: 885,
            height: 640,
            borderRadius: "15px",
          },
        }}
      >
        <DialogContent sx={{ p: 0 }}>
          {openEdit && (
            <EditForm
              event={event}
              handleClose={handleCloseEdit}
              state={state}
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
