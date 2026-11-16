// react & next
import { useState } from "react";

// external dependencies
import { Box, Dialog, DialogContent, IconButton } from "@mui/material";

// orangery elements & internal dependencies
import VisitorForm from "./VisitorForm";

// queries & backend
import { IVisitorType } from "../../../queries/visitor";

// icons, images & colors
import EditPenIcon from "../../../assets/svg/editPen.svg";
import { VisitorSortState } from "./VisitorsList";

export default function EditVisitorButton({
  visitor,
}: {
  visitor: IVisitorType;
}) {
  const [open, setOpen] = useState(false);
  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  return (
    <>
      <IconButton
        onClick={() => handleOpen()}
        sx={{
          "& > *:first-of-type": { mx: 0 },
          "& .edit-icon": {
            width: "1.3rem",
            height: "1.3rem",
            color: "primary.main",
          },
          "& .MuiButton-root": { minWidth: 40 },
        }}
      >
        <EditPenIcon className="edit-icon" />
      </IconButton>
      <Dialog
        open={open}
        onClose={handleClose}
        sx={{
          "& .MuiPaper-root": {
            maxWidth: "1263px",
            width: "1263px",
            // height: 650
          },
        }}
      >
        <DialogContent sx={{ p: 0 }}>
          {open && <VisitorForm visitor={visitor} handleClose={handleClose} />}
        </DialogContent>
      </Dialog>
    </>
  );
}
