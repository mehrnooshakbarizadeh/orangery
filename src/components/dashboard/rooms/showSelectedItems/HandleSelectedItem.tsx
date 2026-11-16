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
import { IDoor } from "../../../../queries/door";

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
        variant="text"
        sx={{
          "&.MuiButton-root": { p: 0 },
          whiteSpace: "nowrap",
          width: "fit-content",
        }}
        onClick={() => handleOpen()}
      >
        <Typography
          variant="BUTTONTEXT"
          fontSize={16}
          fontWeight={400}
          color="#074EE8"
        >
          &nbsp;See Included Items
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
                    deskValue={state.desks.values.map((desk) => desk.value)}
                    assetValue={state.assets.values.map((asset) => asset.value)}
                    doorValue={state.doors.values?.map((door) => door.value)}
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
                    handleDoorChange={(newValues) => {
                      newValues.forEach((e) => {
                        const i = state.doors.values.findIndex(
                          (v) => v.value === e
                        );
                        if (i === -1) {
                          state.doors.pushElementValue(e);
                        }
                      });
                      state.doors.values.forEach((v, j) => {
                        const i = newValues.findIndex((e) => v.value === e);
                        if (i === -1) {
                          state.doors.deleteElementValue(j);
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
