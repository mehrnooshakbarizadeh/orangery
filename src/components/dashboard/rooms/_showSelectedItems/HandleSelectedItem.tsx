// react & next
import React from "react";

// external dependencies
import { Box, Button, Dialog, DialogContent, Typography } from "@mui/material";
import { Observer } from "mobx-react-lite";

// orangery elements & internal dependencies
import { RoomFormState } from "../RoomForm";
import ListSelectedItems from "./ListSelectedItems";

// icons, images & colors
import ListCheckedIcon from "../../../../assets/svg/list-checked.svg";

export default function HandleSelectedItem({
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
        sx={{
          py: 1,
          whiteSpace: "nowrap",
          backgroundColor: "#fff",
          gap: 1,
          border: "1px solid black",
          borderRadius: 1,
          px: 2,
          width: "fit-content",
          "& .icon": {
            color: "#000",
            width: "1.3rem",
            height: "1.3rem",
          },
        }}
        onClick={() => handleOpen()}
      >
        <ListCheckedIcon className="icon" />
        <Typography
          variant="BUTTONTEXT"
        >
          Included Items
        </Typography>
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
            <>
              <Observer>
                {() => (
                  <ListSelectedItems
                    handleClose={handleClose}
                    value={state.desks.values.map((e) => e.value)}
                    assetValue={state.assets.values.map((e) => e.value)}
                    handleAssetChange={(newValues) => {
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
                    handleChange={(newValues) => {
                      newValues.forEach((e) => {
                        const i = state.desks.values.findIndex(
                          (v) => v.value === e
                        );
                        if (i === -1) {
                          state.desks.pushElementValue(e);
                        }
                      });
                      state.desks.values.forEach((v, j) => {
                        const i = newValues.findIndex((e) => v.value === e);
                        if (i === -1) {
                          state.desks.deleteElementValue(j);
                        }
                      });
                    }}
                  />
                )}
              </Observer>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
