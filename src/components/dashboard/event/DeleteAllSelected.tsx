import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Typography,
} from "@mui/material";
import RemoveIcon from "../../../assets/svg/remove.svg";
import { useState } from "react";
import { SortState } from "./EventList";
import { useDeleteMultiDesk } from "../../../queries/desk";
import { useGlobalState } from "../../../Contexts & Globals/GlobalContext";
import { Observer } from "mobx-react-lite";
import DeleteCheckBox from "./DeleteCheckBox";
import {
  IEvent,
  IOrganizerEvent,
  useDeleteMultiEvent,
} from "../../../queries/event";

export default function DeleteAllSelected({
  onSelectAll,
  events,
  state,
  checked,
}: {
  state: SortState;
  events: IEvent[] | IOrganizerEvent[];
  onSelectAll: (e: any) => void;
  checked: boolean;
}) {
  const mutation = useDeleteMultiEvent();
  const { office_uuid } = useGlobalState();
  const [open, setOpen] = useState(false);

  const handleClose = () => {
    setOpen(false);
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const deleteSearchedList =
    events?.filter((event) => !event.tenant_office_uuid) || [];
  const handleDelete = async () => {
    const uuids = [...state.selectedEventList];
    await mutation.mutateAsync({
      office_uuid: office_uuid,
      uuids,
    });
    state.clearSelectedEvent();
    // OrangeryToast("Deleted ", "warning");
    handleClose();
  };
  return (
    <>
      <Observer>
        {() => (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              height: "40px",
              mb: "18px",
              mt: "10px",
              gap: 1,
            }}
          >
            <Button
              onClick={onSelectAll}
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                border: "1px solid #A5AAB4",
                py: "11px",
                pl: "18px",
                pr: "59px",
                borderRadius: 1.3,
              }}
            >
              <DeleteCheckBox checked={checked} />
              <Typography fontSize={16} fontWeight={600}>
                Select All
              </Typography>
            </Button>
            {checked ? (
              <Button
                variant="outlined"
                onClick={handleClickOpen}
                sx={{
                  width: "217px",
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  py: 2,
                  px: 3,
                  color: "red",
                  border: "1px solid #FF3D00",
                  "& .delete-icon": { width: "1.1rem", height: "1.1rem" },
                  "&.MuiButton-root:hover": {
                    backgroundColor: "white",
                    border: "1px solid #FF3D00",
                  },
                }}
              >
                <RemoveIcon className="delete-icon" />
                <Typography fontSize={16} fontWeight={600}>
                  Delete all
                </Typography>
              </Button>
            ) : state.selectedEventList.length > 0 &&
              state.selectedEventList.length !== deleteSearchedList.length ? (
              <Button
                variant="outlined"
                onClick={handleClickOpen}
                sx={{
                  width: "217px",
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  py: 2,
                  px: 3,
                  color: "red",
                  border: "1px solid #FF3D00",
                  "&.MuiButton-root:hover": {
                    backgroundColor: "white",
                    border: "1px solid #FF3D00",
                  },
                  "& .delete-icon": { width: "1.1rem", height: "1.1rem" },
                }}
              >
                <RemoveIcon className="delete-icon" />
                <Typography whiteSpace="nowrap" fontSize={16} fontWeight={600}>
                  Delete selected items
                </Typography>
              </Button>
            ) : (
              ""
            )}

            <Dialog
              maxWidth="xs"
              open={open}
              onClose={handleClose}
              sx={{
                "& .MuiDialog-paper": {
                  borderRadius: 3.8,
                  width: 440,
                  height: 304,
                  pt: 3,
                  px: 2,
                },
              }}
            >
              <DialogTitle sx={{ fontSize: 30, fontWeight: 600 }}>
                Removing {state.selectedEventList.length} event
                {state.selectedEventList.length > 1 ? "s" : ""}.
              </DialogTitle>
              <DialogContent>
                <Typography>Are you sure?</Typography>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "flex-end",
                    gap: 2,
                    pt: 7,
                  }}
                >
                  <Button
                    variant="contained"
                    sx={{
                      backgroundColor: "grey.200",
                      color: "grey.A200",
                      fontSize: 21,
                      fontWeight: 400,
                      flexGrow: 1,
                      width: 170,
                      height: 55,
                    }}
                    onClick={handleClose}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="contained"
                    color="warning"
                    sx={{
                      fontSize: 21,
                      fontWeight: 400,
                      color: "#fff",
                      width: 170,
                      height: 55,
                    }}
                    onClick={handleDelete}
                  >
                    Yes, Remove
                  </Button>
                </Box>
              </DialogContent>
            </Dialog>
          </Box>
        )}
      </Observer>
    </>
  );
}
