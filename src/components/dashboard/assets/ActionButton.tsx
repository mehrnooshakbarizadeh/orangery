// react & next
import React from "react";

// external dependencies
import { Box, Dialog, DialogContent, IconButton } from "@mui/material";

// orangery elements & internal dependencies
import AssetForm from "./AssetForm";
import DeleteAssetButton from "./DeleteAssetButton";

// queries & backend
import { IAsset } from "../../../queries/asset";

// icons, images & colors
import EditPenIcon from "../../../assets/svg/editPen.svg";

export default function ActionButton({ asset }: { asset: IAsset }) {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <Box
        sx={{
          display: "flex",
          alignItems: "end",
          gap: 1,
          // width: 100,
          // flexGrow: 1,
          // overflow: "hidden",
          justifyContent: "center",
        }}
      >
        <IconButton
          onClick={() => handleOpen()}
          sx={{
            "& > *:first-of-type": { mx: 0 },
            "& .edit-icon": {
              width: "1.3rem",
              height: "1.3rem",
              color: "primary.main",
            },
            "& .MuiButton-root": { minWidth: 40 },
          }}
        >
          <EditPenIcon className="edit-icon" />
        </IconButton>
        <Dialog
          open={open}
          onClose={handleClose}
          sx={{
            pt: 1,
            "& .MuiPaper-root": { maxWidth: 1263, width: 1263, minWidth: 1263, borderRadius: '15px' },
            "& .form-container": { p: 0 },
          }}
        >
          <DialogContent className="form-container">
            {open && <AssetForm asset={asset} handleClose={handleClose} />}
          </DialogContent>
        </Dialog>
        <DeleteAssetButton handleCloseForm={handleClose} key={asset.uuid} asset={asset} />
      </Box>
    </>
  );
}
