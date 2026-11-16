// react & next
import { useState } from "react";

// external dependencies
import {
  Button,
  Dialog,
  DialogContent,
} from "@mui/material";

// orangery elements & internal dependencies
import ConnectIqForm from "./ConnectIqForm";

// queries & backend
import {
  IIq,
} from "../../../../../queries/apps/saltoKs";

// icons, images & colors
//

export default function ConnectIqButton({
  iq,
  disabled
}: {
  iq: IIq;
  disabled?: boolean;
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
      <Button
        color="primary"
        onClick={() => handleOpen()}
        sx={{
          width: 104,
          height: 35,
          fontSize: 20,
          color: "#074EE8",
          backgroundColor: "transparent",
          flex: "none"
        }}
        disabled={disabled}
      >
        Connect
      </Button>

      <Dialog
        open={open}
        onClose={handleClose}
        sx={{
          "& .MuiPaper-root": {
            maxWidth: 900,
            width: 429,
            borderRadius: "15px",
            pb: 3,
          },
        }}
      >
        <DialogContent sx={{ p: 0 }}>
          {open && <ConnectIqForm iq={iq} handleClose={handleClose} />}
        </DialogContent>
      </Dialog>
    </>
  );
}
