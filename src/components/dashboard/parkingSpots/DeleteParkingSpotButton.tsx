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
import { OrangeryToast } from "../../OrangeryElements";

// queries & backend
import {
  IParkingSpot,
  useDeleteParkingSpot,
} from "../../../queries/parkingSpot";

// icons, images & colors
import RemoveIcon from "../../../assets/svg/remove.svg";

export default function DeleteParkingSpotButton({
  sx,
  label,
  parkingSpot,
  handleCloseForm,
}: {
  handleCloseForm: () => void;
  label: string;
  parkingSpot: IParkingSpot;
} & ButtonProps) {
  const [open, setOpen] = useState(false);
  const mutation = useDeleteParkingSpot();
  const handleDelete = () => {
    mutation.mutate({
      office_uuid: parkingSpot.office_uuid,
      uuid: parkingSpot.uuid,
    });
    handleClose();
    handleCloseForm();
    OrangeryToast("Deleted " + parkingSpot.name, "warning");
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
        sx={{
          ...sx,
          gap: 1,
          "& .delete-icon": { width: "1.3rem", height: "1.3rem" },
        }}
      >
        <RemoveIcon className="delete-icon" />
        <Typography variant="h5" color="red">
          {label}
        </Typography>
      </Button>
      <Dialog
        maxWidth="xs"
        open={open}
        onClose={handleClose}
        sx={{
          "& .MuiDialog-paper": {
            borderRadius: 3.8,
            // width: 440,
            // height: 304,
            pt: 3,
            px: 2,
          },
        }}
      >
        <DialogTitle
          sx={{
            fontSize: 20,
            fontWeight: 600,
            wordBreak: "break-word",
            textOverflow: "ellipsis",
            width: "100%",
            overflow: "hidden",
            whiteSpace: "nowrap",
          }}
        >
          Remove {parkingSpot.name}
        </DialogTitle>
        <DialogContent>
          <Typography>
            By removing this parking spot, all its parking spot will be changed
            to unassigned mode.
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
