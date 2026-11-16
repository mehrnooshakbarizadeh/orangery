// react & next
import React from "react";

// external dependencies
import {
  Box,
  Dialog,
  DialogContent,
  Typography,
} from "@mui/material";

// orangery elements & internal dependencies
import {
  OrangeryCloseButton,
} from "../../../OrangeryElements";
import OfficeForm from "./OfficeForm"

// queries & backend
import {
  IOfficeResult
} from "../../../../queries/office";

export default function AddNewOfficeDialog({
  open,
  setOpen,
  onOfficeChange
}: {
  open: boolean,
  setOpen: (open: boolean) => void
  onOfficeChange?: (office: IOfficeResult) => void
}) {
  const handleClose = () => {
    setOpen(false);
  };

  function handleOfficeFormSubmit(office?: IOfficeResult) {
    setOpen(false)

    if (office && onOfficeChange)
      onOfficeChange(office)
  }

  return <Dialog
    open={open}
    onClose={handleClose}
    sx={{ "& .MuiPaper-root": { maxWidth: 1100, width: 1100, height: 490 } }}
  >
    <DialogContent
      sx={{
        p: 0,
        position: "relative",
      }}
    >
      {open &&
        <Box
          sx={{
            width: "100%",
            height: "100%",
            display: "flex",
            flexDirection: "row",
            p: 3
          }}
        >
          <OrangeryCloseButton onClose={handleClose} />
          <Box
            sx={{
              width: "100%",
              height: "100%",
              display: "flex",
              flexDirection: "column"
            }}
          >
            <Box
              sx={{
                pb: 1.8,
                // pb: 1,
                // pt: 2.5,
                mb: 3.5,
                display: "flex",
                justifyContent: "end",
                alignItems: "center",
                // borderBottom: (theme) => `1px solid ${theme.palette.grey[400]}`,
              }}
            >
              <Typography
                sx={{ flexGrow: 1, fontSize: 20, fontWeight: 800 }}
                color={(theme) => theme.palette.primary.light}
              >
                Add your new Location
              </Typography>
            </Box>

            <OfficeForm
              submitButtonText="Add Location"
              onSubmit={handleOfficeFormSubmit}
              onClose={handleClose}
            />
          </Box>

          <Box
            className={"noselect"}
            sx={{ width: "590px", mt: "-19px", ml: "16px" }}
            src={`${process.env.NEXT_PUBLIC_BASE_PATH}/assets/undraw_my_current_location_re_whmt.svg`}
            component={"img"}
            loading="lazy"
          />
        </Box>
      }
    </DialogContent>
  </Dialog>
}