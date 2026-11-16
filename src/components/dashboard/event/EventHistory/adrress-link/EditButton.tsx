import { useState } from "react";
import { Button, Dialog, DialogContent, Typography } from "@mui/material";
import { IEvent, IEventModification } from "../../../../../queries/event";
import EditForm from "./EditForm";
import { EventLogState } from "../HandleLogsRendering";

export default function EditButton({
  event,
  logAddressLink,
  state,
  disabled,
  locationValue,
  linkValue,
}: {
  disabled: boolean;
  state: EventLogState;
  event: IEvent;
  logAddressLink: IEventModification[];
  locationValue: string;
  linkValue: string;
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
        disabled={disabled}
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
            height: 600,
            borderRadius: "15px",
          },
        }}
      >
        <DialogContent sx={{ p: 0 }}>
          {openEdit && (
            <EditForm
              locationValue={locationValue}
              linkValue={linkValue}
              state={state}
              logAddressLink={logAddressLink}
              event={event}
              handleClose={handleCloseEdit}
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
