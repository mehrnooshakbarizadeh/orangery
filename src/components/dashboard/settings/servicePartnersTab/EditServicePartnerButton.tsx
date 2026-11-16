// react & next
import { useState } from "react";

// external dependencies
import { Box, Button, Dialog, DialogContent, IconButton } from "@mui/material";

// orangery elements & internal dependencies
import ServicePartnerForm from "./ServicePartnerForm";

// queries & backend
import { IServicePartner } from "../../../../queries/servicePartners";

// icons, images & colors
import EditPenIcon from "../../../../assets/svg/editPen.svg";
import { SortServicePartnerState } from "./ServicePartnersList";

export default function EditServicePartnerButton({
  servicePartner,
  state,
}: {
  state: SortServicePartnerState;
  servicePartner: IServicePartner;
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
          color: "grey.A700",
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
            maxWidth: 1263,
            width: 1263,
          },
        }}
      >
        <DialogContent sx={{ p: 0 }}>
          {open && (
            <ServicePartnerForm
              servicePartner={servicePartner}
              handleClose={handleClose}
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
