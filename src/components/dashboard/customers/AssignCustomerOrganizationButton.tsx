// contexts & globals
//

// react & next
import React from "react";

// external dependencies
import { Button, Dialog, DialogContent, Fab, Typography } from "@mui/material";

// orangery elements & internal dependencies
import CustomerOrganizationForm from "./CustomerOrganizationForm";

// 
import { ICustomerOrganizationInsertParams } from "../../../queries/customer";

// icons, images & colors
import PlusIcon from "../../../assets/svg/plus.svg";

export default function AssignCustomerOrganizationButton({
  customerOrganization
}: {
  customerOrganization: ICustomerOrganizationInsertParams
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
        onClick={() => handleOpen()}
        variant="text"
        sx={{
          color: "#074EE8",
          borderRadius: 1,
          textAlign: "right",
          pr: 1,
          pt: 0.75,
          pb: 1,
          pl: 0,
          justifyContent: "end",
          fontWeight: 700,
            fontSize: 16
        }}
      >
          Create organization
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
        sx={{
          "& .MuiPaper-root": {
            maxWidth: 900,
            width: 429,
            // height: 584,
            borderRadius: "15px",
          },
        }}
      >
        <DialogContent sx={{ p: 0 }}>
          {open &&
            <CustomerOrganizationForm
              customerOrganization={customerOrganization}
              handleClose={handleClose}
            // handleOrganizationChange={handleOrganizationChange}
            />
          }
        </DialogContent>
      </Dialog>
    </>
  );
}