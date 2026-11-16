// contexts & globals
import { useGlobalState } from "../../../../Contexts & Globals/GlobalContext";

// react & next
import { useState } from "react";

// external dependencies
import {
  Box,
  Button,
  ButtonProps,
  Dialog,
  DialogContent,
  DialogTitle,
  Typography,
} from "@mui/material";

// orangery elements & internal dependencies
import {
  OrangeryText,
  OrangeryToast
} from "../../../OrangeryElements";

// queries & backend
import { IOffer, useDeleteOffer } from "../../../../queries/tenant";

// icons, images & colors
import RemoveIcon from "../../../../assets/svg/remove.svg";

export default function DeleteOfferButton({
  handleCloseForm,
  offer,
  sx,
  label,
}: {
  handleCloseForm: () => void;
  label?: React.ReactNode;
  offer: IOffer;
} & ButtonProps) {
  const { office_uuid } = useGlobalState();
  const mutation = useDeleteOffer();
  const [open, setOpen] = useState(false);
  const handleDelete = () => {
    mutation.mutate({
      office_uuid: office_uuid,
      uuid: offer.uuid,
    });
    OrangeryToast("Deleted " + offer.name, "warning");
    handleCloseForm();
    handleClose();
  };
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <Button
        onClick={handleClickOpen}
        disabled={mutation.isLoading}
        // id={"desk_form_delete_div"}
        sx={{
          ...sx,
          gap: 1,
          "& .delete-icon": { width: "1.3rem", height: "1.3rem" },
        }}
      >
        <RemoveIcon className="delete-icon" />
        <Typography variant="h5">{label}</Typography>
      </Button>
      <Dialog
        maxWidth="xs"
        open={open}
        onClose={handleClose}
        sx={{
          "& .MuiDialog-paper": {
            borderRadius: 3.8,
            width: 440,
            minHeight: 304,
            pt: 3,
            px: 2,
          },
        }}
      >
        <DialogTitle sx={{ fontSize: 30, fontWeight: 600, display: "flex", alignItems: "baseline" }}>
          Remove&nbsp;<OrangeryText text={`${offer.name}`} limit={14} />
        </DialogTitle>
        <DialogContent>
          <Typography>
            By removing this offer, all its offer will be changed to unassigned
            mode.
          </Typography>
          <Box
            sx={{ display: "flex", justifyContent: "flex-end", gap: 2, pt: 7 }}
          >
            <Button
              variant="contained"
              sx={{
                backgroundColor: "grey.200",
                color: "grey.A200",
                fontSize: 21,
                fontWeight: 400,
                flexGrow: 1,
                width: 170,
                height: 55,
              }}
              onClick={handleClose}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              color="warning"
              sx={{
                fontSize: 21,
                fontWeight: 400,
                color: "#fff",
                width: 170,
                height: 55,
              }}
              onClick={handleDelete}
            >
              Yes, Remove it
            </Button>
          </Box>
        </DialogContent>
      </Dialog>
    </>
  );
}
function useTenant() {
  throw new Error("Function not implemented.");
}
