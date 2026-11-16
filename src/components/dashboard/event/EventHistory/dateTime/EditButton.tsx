import { useState } from "react";
import { Button, Dialog, DialogContent, Typography } from "@mui/material";
import { IEvent, IEventModification } from "../../../../../queries/event";
import EditForm from "./EditForm";
import { EventLogState } from "../HandleLogsRendering";

export default function EditButton({
  event,
  state,
  logDateTimeWeek,
  disabled,
  startTimeValue,
  endTimeValue,
  weekValue,
}: {
  state: EventLogState;
  event: IEvent;
  logDateTimeWeek: IEventModification[];
  disabled: boolean;
  startTimeValue: string;
  endTimeValue: string;
  weekValue: number;
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
        disabled={disabled}
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
            height: 650,
            borderRadius: "15px",
          },
        }}
      >
        <DialogContent sx={{ p: 0 }}>
          {openEdit && (
            <EditForm
              state={state}
              logDateTimeWeek={logDateTimeWeek}
              event={event}
              handleClose={handleCloseEdit}
              startTimeValue={startTimeValue}
              endTimeValue={endTimeValue}
              weekValue={weekValue}
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
