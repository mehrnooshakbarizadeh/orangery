import { useState } from "react";
import { Button, Dialog, DialogContent, Typography } from "@mui/material";
import { IEvent, IEventModification } from "../../../../../queries/event";
import EditForm from "./EditForm";

export default function EditButton({
  event,
  logPresenter,
  disabled,
}: {
  event: IEvent;
  logPresenter: IEventModification[];
  disabled: boolean;
}) {
  const [openEdit, setOpenEdit] = useState(false);
  const handleOpenEdit = () => setOpenEdit(true);
  const handleCloseEdit = () => {
    setOpenEdit(false);
  };
  return (
    <>
      <Button
        disabled={disabled}
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
            height: 740,
            borderRadius: "15px",
          },
        }}
      >
        <DialogContent sx={{ p: 0 }}>
          {openEdit && (
            <EditForm
              logPresenter={logPresenter}
              event={event}
              handleClose={handleCloseEdit}
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
