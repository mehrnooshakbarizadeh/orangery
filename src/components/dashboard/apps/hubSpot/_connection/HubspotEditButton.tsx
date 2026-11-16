// react & next
import React from "react";

// external dependencies
import { Box, Button, Dialog, DialogContent, Typography } from "@mui/material";

// orangery elements & internal dependencies
import HubSpotConnectionForm from "./HubSpotConnectionForm";

// queries & backend
import { IApp } from "../../../../../queries/apps";

// icons, images & colors
import RemoveIcon from "../../../../../assets/svg/remove.svg";

export default function HubspotEditButton({ hubspot }: { hubspot: IApp }) {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  return hubspot.integrated ? (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Button
        onClick={handleOpen}
        sx={{
          height: 30,
          px: 1,
          // width: "fit-content",
          minWidth: 0,
          py: 0,
          // color: "#074EE8",
          // backgroundColor: (theme) => theme.palette.grey[200],
        }}
      >
        <Typography
          sx={{
            fontSize: 18,
            fontWeight: 600,
            whiteSpace: "nowrap",
            color: "primary",
            lineHeight: 0,
          }}
        >
          Edit
        </Typography>
      </Button>

      <Dialog
        open={open}
        onClose={handleClose}
        sx={{
          "& .MuiPaper-root": {
            maxWidth: 900,
            borderRadius: "15px",
          },
        }}
      >
        <DialogContent sx={{ p: 0 }}>
          {open && (
            <HubSpotConnectionForm hubspot={hubspot} handleClose={handleClose} editMode />
          )}
        </DialogContent>
      </Dialog>
    </Box>
  ) : (
    <></>
  );
}
