// react & next
import React from "react";

// external dependencies
import { Box, Button, Dialog, DialogContent, Typography } from "@mui/material";
import { Observer } from "mobx-react-lite";

// orangery elements & internal dependencies
import { RoomFormState } from "../RoomForm";

// icons, images & colors
import PlusIcon from "../../../../assets/svg/plus.svg";
import DoorFieldsSelector from "./DoorFieldsSelector";

export default function HandleDoorFieldSelector({
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
          Add Door
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
                <DoorFieldsSelector
                  handleClose={handleClose}
                  value={state.doors.values.map((e) => e.value)}
                  handleChange={(newValues) => {
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
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
