// react & next
import React from "react";

// external dependencies
import { Box, Button, Dialog, DialogContent, Typography } from "@mui/material";
import { Observer } from "mobx-react-lite";

// orangery elements & internal dependencies
import { OfferFieldsState } from "../HandleOfferForm";
import AssetFieldsSelector from "./AssetFieldsSelector";

// icons, images & colors
import PlusIcon from "../../../../../assets/svg/plus.svg";

export default function HandleAssetFieldSelector({
  state,
}: {
  state: OfferFieldsState;
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
            "& .add-icon": { color: "#000", width: "1.3rem" },
            "& .add-btn": { fontSize: 22, fontWeight: 400, color: "#000" },
            py: "12px",
            backgroundColor: "#fff",
            gap: 2,
            border: "1px solid black",
            borderRadius: 1,
            pl: 3,
            pr: 7,
          }}
        >
          <PlusIcon className="add-icon" />
          <Typography className="add-btn">Add Asset</Typography>
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
      </Box>
    </>
  );
}
