// react & next
import { useState } from "react";
import { useRouter } from "next/router";
// external dependencies
import { Typography, Button, Dialog, DialogContent } from "@mui/material";
//Components
import UserPreviewErrorForm from "./UserPreviewErrorForm";
// icons, images & colors
import GoogleIcon from "../../../../assets/svg/apps/googleAdminResources/btn_google.svg";
//Backend
import { useGoogleAdminUsersPreviewCheckMutation } from "../../../../queries/apps/googleAdminUsers";

export default function GoogleAdminUsersSyncButton({}: {}) {
  const router = useRouter();
  const mutation = useGoogleAdminUsersPreviewCheckMutation();
  const [open, setOpen] = useState(false);

  const handleGoogleSync = async () => {
    const result = await mutation.mutateAsync();
    if (result.status === 403 || result.status === 400) {
      setOpen(true);
    } else {
      router.push("/dashboard/apps/google-admin-users");
    }
  };

  const handleClose = (): any => {
    setOpen(false);
  };

  return (
    <>
      <Button onClick={handleGoogleSync} sx={{ fontSize: 18, fontWeight: 600 }}>
        Sync
      </Button>
      <Dialog
        // maxWidth="xs"
        open={open}
        onClose={handleClose}
        sx={{
          "& .MuiDialog-paper": {
            borderRadius: 3.8,
            maxWidth: "30%",
            height: 464,
            pt: 3,
          },
        }}
      >
        <DialogContent sx={{ p: 0 }}>
          {open && <UserPreviewErrorForm handleClose={handleClose} />}
        </DialogContent>
      </Dialog>
    </>
  );
}
