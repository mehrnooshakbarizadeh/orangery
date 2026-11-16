// react & next
import React from "react";

// external dependencies
import { Box, Button, Dialog, DialogContent, Typography } from "@mui/material";
import { Observer } from "mobx-react-lite";

// orangery elements & internal dependencies
import { RoomFormState } from "../RoomForm";
import AssetFieldsSelector from "./AssetFieldsSelector";

// icons, images & colors
import PlusIcon from "../../../../assets/svg/plus.svg";

export default function HandleAssetFieldSelector({
  state,
}: {
  state: RoomFormState;
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
      <Button
        aria-label="add"
        onClick={() => handleOpen()}
        sx={{
          "&:hover": { backgroundColor: "#52555afc" },
          "& .add-icon": { color: "#fff", width: "1.1rem" },
          py: 1,
          backgroundColor: "#2B2E33",
          gap: 1,
          border: "1px solid black",
          borderRadius: 1,
          px: 2,
          width: "fit-content",
        }}
      >
        <PlusIcon className="add-icon" />
        <Typography fontSize={13} fontWeight={600} color="#fff">
          Add Asset
        </Typography>
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
        sx={{
          "& .MuiPaper-root": {
            px: 0,
            maxWidth: 1100,
            width: 1051,
            height: 681,
            overflow: "hidden",
            borderRadius: "15px",
          },
          borderRadius: 2,
        }}
      >
        <DialogContent sx={{ p: 0 }}>
          {open && (
            <Observer>
              {() => (
                <AssetFieldsSelector
                  handleClose={handleClose}
                  value={state.assets.values.map((e) => e.value)}
                  handleChange={(newValues) => {
                    newValues.forEach((e) => {
                      const i = state.assets.values.findIndex(
                        (v) => v.value === e
                      );
                      if (i === -1) {
                        state.assets.pushElementValue(e);
                      }
                    });
                    state.assets.values.forEach((v, j) => {
                      const i = newValues.findIndex((e) => v.value === e);
                      if (i === -1) {
                        state.assets.deleteElementValue(j);
                      }
                    });
                  }}
                />
              )}
            </Observer>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
