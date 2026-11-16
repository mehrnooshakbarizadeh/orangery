import { useState } from "react";
import { Button, Dialog, DialogContent, Typography } from "@mui/material";
import { IEvent, IEventModification } from "../../../../../queries/event";
import EditForm from "./EditForm";

export default function EditButton({
  event,
  logAsset,
  disabled,
}: {
  event: IEvent;
  logAsset: IEventModification[];
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
          View
        </Typography>
      </Button>
      <Dialog
        open={openEdit}
        onClose={handleCloseEdit}
        sx={{
          "& .MuiPaper-root": {
            width: 885,
            minWidth: 885,
            height: 700,
            borderRadius: "15px",
          },
        }}
      >
        <DialogContent sx={{ p: 0 }}>
          {openEdit && (
            <EditForm
              logAsset={logAsset}
              event={event}
              handleClose={handleCloseEdit}
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
