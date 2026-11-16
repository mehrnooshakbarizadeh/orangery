// react & next
import React from "react";

// external dependencies
import { Box, Button, Dialog, DialogContent, Typography } from "@mui/material";
import { Observer } from "mobx-react-lite";

// orangery elements & internal dependencies
import { OfferFieldsState } from "../HandleOfferForm";
import ListSelectedItems from "./ListSelectedItems";

// icons, images & colors
import ListCheckedIcon from "../../../../../assets/svg/list-checked.svg";

export default function HandleSelectedItem({
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
      <Box sx={{ display: "flex", flexDirection: "column", gap: 1, pt: 5 }}>
        <Typography variant="h2">Overview</Typography>
        <Typography variant="h3">
          You have selected{" "}
          <Observer>
            {() => (
              <>{state.desks.values.length + state.assets.values.length + state.room_uuids.values.length}</>
            )}
          </Observer>
          &nbsp;items
        </Typography>
        <Box sx={{ width: "33%", pt: 3 }}>
          <Button
            sx={{
              "& .list-icon": {
                color: "#000",
                width: "1.3rem",
                height: "1.3rem",
              },
              "& .list-btn": { fontSize: 22, fontWeight: 400, color: "#000" },
              py: "12px",
              whiteSpace: "nowrap",
              backgroundColor: "#fff",
              gap: 2,
              border: "1px solid black",
              borderRadius: 1,
              pl: 3,
              pr: 7,
              // width: "33%",
            }}
            onClick={() => handleOpen()}
          >
            <ListCheckedIcon className="list-icon" />
            <Typography className="list-btn">Plan Overview</Typography>
          </Button>
        </Box>
      </Box>
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
                    value={state.desks.values.map((desk) => desk.value)}
                    assetValue={state.assets.values.map((asset) => asset.value)}
                    roomValue={state.room_uuids.values.map((room) => room.value)}
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

                    handleRoomChange={(newValues) => {
                      newValues.forEach((e) => {
                        const i = state.room_uuids.values.findIndex(
                          (r) => r.value === e
                        );
                        if (i === -1) {
                          state.room_uuids.pushElementValue(e);
                        }
                      });
                      state.room_uuids.values.forEach((v, j) => {
                        const i = newValues.findIndex((e) => v.value === e);
                        if (i === -1) {
                          state.room_uuids.deleteElementValue(j);
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
