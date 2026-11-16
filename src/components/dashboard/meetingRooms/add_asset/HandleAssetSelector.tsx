import React from "react";
import { Box, Button, Dialog, DialogContent, Typography } from "@mui/material";
import { Observer } from "mobx-react-lite";
import PlusIcon from "../../../../assets/svg/plus.svg";
import AssetFieldsSelector from "./AssetFieldsSelector";
import { AssetState, MeetingRoomState } from "../HandleRoomForm";

export default function HandleAssetSelector({
  state,
  asset,
}: {
  asset?: AssetState;
  state: MeetingRoomState;
}) {
  const [open, setOpen] = React.useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <Box sx={{ display: "flex", gap: 2 }}>
        <Button
          aria-label="add"
          onClick={() => handleOpen()}
          sx={{
            "& .add-icon": { color: "#000", width: "1rem" },
            "& .add-btn": { fontSize: 18, fontWeight: 600, color: "#000" },
            py: "12px",
            backgroundColor: "#fff",
            gap: 1,
            border: "1px solid black",
            borderRadius: 1,
            pl: 1,
            pr: 1,
            whiteSpace: "nowrap",
            width: "208px",
          }}
        >
          <PlusIcon className="add-icon" />
          <Typography className="add-btn">Add Assets</Typography>
        </Button>
        <Dialog
          open={open}
          onClose={handleClose}
          sx={{
            "& .MuiPaper-root": {
              maxWidth: 1100,
              width: 1051,
              height: 681,
              overflow: "hidden",
            },
            borderRadius: 2,
          }}
        >
          <DialogContent sx={{ p: 0 }}>
            {open && (
              <Observer>
                {() => (
                  <AssetFieldsSelector
                    state={state}
                    assetValue={asset}
                    handleClose={handleClose}
                  />
                )}
              </Observer>
            )}
          </DialogContent>
        </Dialog>
      </Box>
    </>
  );
}
