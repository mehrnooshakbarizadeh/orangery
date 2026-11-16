// contexts & globals
import { useGlobalState } from "../../../Contexts & Globals/GlobalContext";

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
import { OrangeryText, OrangeryToast } from "../../OrangeryElements";

// queries & backend
import { IDesk, useDeleteDesk } from "../../../queries/desk";

// icons, images & colors
import RemoveIcon from "../../../assets/svg/remove.svg";
import { SortState } from "./DesksList";

export default function DeleteDeskButton({
  handleCloseForm,
  desk,
  sx,
  label,
}: {
  handleCloseForm: () => void;
  label?: React.ReactNode;
  desk: IDesk;
} & ButtonProps) {
  const { office_uuid } = useGlobalState();
  const mutation = useDeleteDesk();
  const [open, setOpen] = useState(false);

  const handleDelete = async () => {
    await mutation.mutateAsync({
      office_uuid: office_uuid,
      uuid: desk.uuid,
    });
    OrangeryToast("Deleted " + desk.name, "warning");
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
            height: 350,
            pt: 3,
            px: 2,
          },
        }}
      >
        <DialogTitle sx={{ fontSize: 30, fontWeight: 600 }}>
          Remove <OrangeryText text={desk.name} limit={20} />
        </DialogTitle>
        <DialogContent>
          <Typography>
            By removing this Desk, all its Desk will be changed to unassigned
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
