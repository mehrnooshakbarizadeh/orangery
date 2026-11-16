// react & next
import React from "react";

// external dependencies
import { Box, Button, Dialog, DialogContent, Typography } from "@mui/material";
import { Observer } from "mobx-react-lite";

// orangery elements & internal dependencies
import { RoomFormState } from "../RoomForm";
import DeskFieldsSelector from "./DeskFieldsSelector";

// icons, images & colors
import PlusIcon from "../../../../assets/svg/plus.svg";

export default function HandleDeskFieldSelector({
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
          borderRadius: "4px",
          px: 2,
          width: "fit-content",
        }}
      >
        <PlusIcon className="add-icon" />
        <Typography fontSize={13} fontWeight={600} color="#fff">
          Add Desk
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
            borderRadius: "15px",
          },
          borderRadius: 2,
        }}
      >
        <DialogContent sx={{ p: 0 }}>
          {open && (
            <Observer>
              {() => (
                <DeskFieldsSelector
                  handleClose={handleClose}
                  value={state.desks.values.map((e) => e.value)}
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
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
