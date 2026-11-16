// contexts & globals
import { useGlobalState } from "../../../../../Contexts & Globals/GlobalContext";

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

// 
import {
  OrangeryToast
} from "../../../../OrangeryElements";

// queries & backend
import {
  IBillingParams,
  useUpdateRefund
} from "../../../../../queries/billing";

// icons, images & colors
// import RefundIcon from "../../../../../assets/svg/refund.svg";

export default function RefundButton({
  billing,
  disabled,
  icon
}: {
  billing: IBillingParams;
  disabled?: boolean;
  icon?: JSX.Element
} & ButtonProps) {
  const { office_uuid } = useGlobalState();
  const mutation = useUpdateRefund();

  const [open, setOpen] = useState(false);

  const handleDelete = () => {
    mutation.mutate({
      billing_uuid: billing.billing_uuid
    });

    if (!mutation.isLoading)
      OrangeryToast("Refunded " + billing.invoice_number, "warning");

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
      {/* {!mutation.isLoading && mutation.isSuccess && } */}
      <Button
        onClick={handleClickOpen}
        disabled={mutation.isLoading || disabled}
        // id={"desk_form_delete_div"}
        sx={{
          color: "orange",
          width: "100%",
          px: 2,
          py: 1.5,
          "& .icon": { width: "1.3rem", height: "1.3rem" },
          gap: 1,
          display: "flex",
          flexDirection: "row",
          justifyContent: "left"
        }}
      >
        {/* <RefundIcon
          className="icon"
        /> */}
        {icon}
        <Typography variant="h5">Generate Storno</Typography>
      </Button>
      <Dialog
        maxWidth="xs"
        open={open}
        onClose={handleClose}
        sx={{
          "& .MuiDialog-paper": {
            borderRadius: 3.8,
            width: 440,
            height: 304,
            pt: 3,
            px: 2,
          },
        }}
      >
        <DialogTitle sx={{
          fontSize: 30,
          fontWeight: 600
        }}>
          Refund {billing.invoice_number}
        </DialogTitle>
        <DialogContent>
          <Typography>
            Do you sure for refunding?
          </Typography>
          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              gap: 2,
              pt: 7
            }}
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
              Yes, Refund it
            </Button>
          </Box>
        </DialogContent>
      </Dialog>
    </>
  );
}
