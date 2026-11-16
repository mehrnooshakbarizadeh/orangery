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
  OrangeryToast
} from "../../../../OrangeryElements";

// queries & backend
import {
  IPlanParams,
  useDeletePlan,
} from "../../../../../queries/plan";

// icons, images & colors
import RemoveIcon from "../../../../../assets/svg/remove.svg";

export default function UnsubscribePlanButton({
  plan,
  onDelete,
}: {
  onDelete: () => void;
  plan: IPlanParams;
} & ButtonProps) {
  const [open, setOpen] = useState(false);
  const mutation = useDeletePlan();
  const handleDelete = () => {
    mutation.mutate({
      uuid: plan.uuid,
    });
    handleClose();
    onDelete();
    if (!mutation.isError)
      OrangeryToast("Unsubscribed " + plan.name, "warning");
    else
      OrangeryToast("Unsubscription failed!", "warning");
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
        variant="contained"
        color="primary"
        disabled={mutation.isLoading}
        onClick={handleClickOpen}
        sx={{
          width: "100%",
          height: 55,
          fontSize: 20,
          color: "#fff",
        }}
      >
        UNSUBSCRIBE
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
        <DialogTitle sx={{ fontSize: 30, fontWeight: 600 }}>
          Remove {plan.name}
        </DialogTitle>
        <DialogContent>
          <Typography>
            By unsubscribing this plan, it will be inaccessible.
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
              Unsubscribe it
            </Button>
          </Box>
        </DialogContent>
      </Dialog>
    </>
  );
}
