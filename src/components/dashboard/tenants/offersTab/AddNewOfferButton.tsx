// 
import { useGlobalState } from "../../../../Contexts & Globals/GlobalContext";

// react & next
import React from "react";

// external dependencies
import { Button, Dialog, DialogContent, Typography } from "@mui/material";

// orangery elements & internal dependencies
import HandleOfferForm from "./HandleOfferForm";

// icons, images & colors
import AddIcon from "@mui/icons-material/Add";

export default function AddNewOfferButton({
  showOffersList,
  updateAll
}: {
  updateAll?: boolean
  showOffersList?: boolean
}) {
  const [open, setOpen] = React.useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const { setShowOffersList } = useGlobalState();
  React.useEffect(() => {
    setShowOffersList(showOffersList === false ? false : true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showOffersList])
  const handleDone = () => {
    setOpen(false);
    setShowOffersList(true)
  }

  return (
    <>
      <Button
        variant="contained"
        color="primary"
        aria-label="add"
        onClick={() => handleOpen()}
        sx={{
          "& .add-btn": { fontSize: 18, fontWeight: 400, color: "#fff" },
          py: "12px",
          px: 5,
          gap: "10px"
        }}
      >
        <AddIcon sx={{ marginLeft: "-10px" }} />
        <Typography className="add-btn">Make an Offer</Typography>
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
        sx={{
          "& .MuiPaper-root": { minWidth: 1283, width: 1283, height: 845, minHeight: 845 },
        }}
      >
        <DialogContent sx={{ p: 0, position: "relative", height: 'calc(100% - 82px)' }}>
          {open && <HandleOfferForm handleClose={handleClose} handleDone={handleDone} updateAll={updateAll} />}
        </DialogContent>
      </Dialog>
    </>
  );
}
