// react & next
import { useState } from "react";
import { useRouter } from "next/router";

// external dependencies
import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Typography,
} from "@mui/material";

//
import { OrangeryToast } from "../../../../OrangeryElements";

//
import { useDeleteSaltoKs } from "../../../../../queries/apps/saltoKs";

// icons, images & colors
import CircleXmarkIcon from "../../../../../assets/svg/circle-xmark.svg";

export default function DisconnectSaltoKsButton() {
  const router = useRouter();
  const mutation = useDeleteSaltoKs();

  const [open, setOpen] = useState(false);

  const handleDelete = async () => {
    await mutation.mutateAsync();
    OrangeryToast("Successfully disconnected!", "warning");
    router.push("/dashboard/apps");
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
        variant="contained"
        color="warning"
        aria-label="remove"
        onClick={handleClickOpen}
        disabled={mutation.isLoading}
        sx={{
          // color: (theme) => theme.palette.grey[200],
          py: "12px",
          px: 5,
        }}
      >
        <Typography
          sx={{
            fontSize: 18,
            fontWeight: 600,
            color: "#fff",
            whiteSpace: "nowrap",
          }}
        >
          Disconnect SaltoKS
        </Typography>
      </Button>

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
            Remove SaltoKS
          </DialogTitle>
        </Box>
        <DialogContent>
          <Typography
            fontSize={22}
            fontWeight={400}
            color="primary.light"
            sx={{ textAlign: "center", mb: 1 }}
          >
            By removing SaltoKS connection, the authentication, Door Acceses,
            all IQs, and Locks will be removed. Are you sure to remove?
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
              Yes, remove it
            </Button>
          </Box>
        </DialogContent>
      </Dialog>
    </>
  );
}
