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
  Icon,
  IconButton,
  Typography,
} from "@mui/material";

import TrashIcon from "../../../../assets/svg/trash.svg";
import CircleXmarkIcon from "../../../../assets/svg/circle-xmark.svg";

// icons, images & colors
import { ICredit, useDeleteCredit } from "../../../../queries/credit";
import { useGlobalState } from "../../../../Contexts & Globals/GlobalContext";
import { OrangeryToast } from "../../../OrangeryElements";

export default function DeleteCreditButton({
  handleCloseForm,
  credit,
  sx,
  label,
}: {
  handleCloseForm: () => void;
  label?: React.ReactNode;
  credit: ICredit;
} & ButtonProps) {
  const { office_uuid } = useGlobalState();
  const mutation = useDeleteCredit();
  const [open, setOpen] = useState(false);
  const handleDelete = () => {
    mutation.mutate({
      office_uuid: office_uuid,
      employee_uuid: credit.uuid,
    });
    OrangeryToast("Deleted " + credit.name, "warning");
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
      <IconButton
        onClick={handleClickOpen}
        disabled={mutation.isLoading}
        sx={{
          "& .icon": { width: "1.3rem", height: "1.3rem" },
          "&.MuiIconButton-root": {
            backgroundColor: "#000",
            color: "#fff",
          },
        }}
      >
        <TrashIcon className="icon" />
      </IconButton>
      <Dialog
        maxWidth="xs"
        open={open}
        onClose={handleClose}
        sx={{
          "& .MuiDialog-paper": {
            borderRadius: 3.8,
            width: 440,
            pt: 3,
            px: 2,
          },
        }}
      >
        <Box sx={{ display: "flex", gap: 1, alignItems: "center", pl: 5 }}>
          <Box
            sx={{
              display: "flex",
              "& .file-icon": {
                width: "1.8rem",
                height: "1.8rem",
                color: "warning.main",
              },
            }}
          >
            <CircleXmarkIcon className="file-icon" />
          </Box>
          <DialogTitle
            sx={{ fontSize: 30, fontWeight: 600, color: "warning.main", pl: 0 }}
          >
            Remove Credit
          </DialogTitle>
        </Box>
        <DialogContent>
          <Typography
            fontSize={34}
            fontWeight={400}
            color="primary.light"
            sx={{ textAlign: "center", mb: 1 }}
          >
            Are you sure?
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
