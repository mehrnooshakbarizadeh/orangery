//
import { useGlobalState } from "../../../Contexts & Globals/GlobalContext";

// react & next
import { useState } from "react";

// external dependencies
import {
  Box,
  Button,
  ButtonProps,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Typography,
} from "@mui/material";

//
import { OrangeryToast } from "../../OrangeryElements";

//
import { IMedia, useDeleteMedia } from "../../../queries/media";

// icons, images & colors
import TrashIcon from "../../../assets/svg/remove.svg";
import CircleXmarkIcon from "../../../assets/svg/circle-xmark.svg";

// export default function DeleteMediaButton({
//   handleCloseForm,
//   media,
//   sx,
//   label,
// }: {
//   handleCloseForm: () => void;
//   label?: React.ReactNode;
//   media: IMedia;
// } & ButtonProps) {
//   const { office_uuid } = useGlobalState();
//   const mutation = useDeleteMedia();
//   const [open, setOpen] = useState(false);
//   const handleDelete = () => {
//     mutation.mutate({
//       office_uuid: office_uuid,
//       uuid: media.uuid,
//     });
//     OrangeryToast("Deleted " + media.name, "warning");
//     handleCloseForm();
//     handleClose();
//   };
//   const handleClickOpen = () => {
//     setOpen(true);
//   };

//   const handleClose = () => {
//     setOpen(false);
//   };

//   return (
//     <>
//       <IconButton
//         onClick={handleClickOpen}
//         disabled={mutation.isLoading}
//         sx={{
//           "& .icon": { width: "0.7rem", height: "0.7rem" },
//           "&.MuiIconButton-root": {
//             backgroundColor: "#000",
//             color: "#fff",
//           },
//         }}
//       >
//         <RemoveIcon className="icon" />
//       </IconButton>
//       <Dialog
//         maxWidth="xs"
//         open={open}
//         onClose={handleClose}
//         sx={{
//           "& .MuiDialog-paper": {
//             borderRadius: 3.8,
//             width: 440,
//             pt: 3,
//             px: 2,
//           },
//         }}
//       >
//         <DialogTitle sx={{ fontSize: 30, fontWeight: 600, height: media.name.length < 40 ? "" : "100px", overflowY: 'auto' }} >
//           Remove {media.name}
//         </DialogTitle>
//         <DialogContent>
//           <Typography>
//             By removing this Media, all its Media will be changed to
//             unassigned mode.
//           </Typography>
//           <Box
//             sx={{ display: "flex", justifyContent: "flex-end", gap: 2, pt: 7 }}
//           >
//             <Button
//               variant="contained"
//               sx={{
//                 backgroundColor: "grey.200",
//                 color: "grey.A200",
//                 fontSize: 21,
//                 fontWeight: 400,
//                 flexGrow: 1,
//                 width: 170,
//                 height: 55,
//               }}
//               onClick={handleClose}
//             >
//               Cancel
//             </Button>
//             <Button
//               variant="contained"
//               color="warning"
//               sx={{
//                 fontSize: 21,
//                 fontWeight: 400,
//                 color: "#fff",
//                 width: 170,
//                 height: 55,
//               }}
//               onClick={handleDelete}
//             >
//               Yes, Remove it
//             </Button>
//           </Box>
//         </DialogContent>
//       </Dialog>
//     </>
//   );
// }

export default function DeleteMediaButton({
  handleCloseForm,
  media,
  sx,
  label,
}: {
  handleCloseForm: () => void;
  label?: React.ReactNode;
  media: IMedia;
} & ButtonProps) {
  const { office_uuid } = useGlobalState();
  const mutation = useDeleteMedia();
  const [open, setOpen] = useState(false);
  const handleDelete = () => {
    mutation.mutate({
      office_uuid: office_uuid,
      uuid: media.uuid,
    });
    OrangeryToast("Deleted " + media.name, "warning");
    handleCloseForm();
    handleClose();
  };
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <IconButton
        onClick={handleClickOpen}
        disabled={mutation.isLoading}
        sx={{
          "& .icon": { width: "0.7rem", height: "0.7rem" },
          "&.MuiIconButton-root": {
            backgroundColor: "#000",
            color: "#fff",
          },
        }}
      >
        <TrashIcon className="icon" />
      </IconButton>
      <Dialog
        maxWidth="xs"
        open={open}
        onClose={handleClose}
        sx={{
          "& .MuiDialog-paper": {
            borderRadius: 3.8,
            width: 440,
            pt: 3,
            px: 2,
          },
        }}
      >
        <Box sx={{ display: "flex", gap: 1, alignItems: "center", pl: 5 }}>
          <Box
            sx={{
              display: "flex",
              "& .file-icon": {
                width: "1.8rem",
                height: "1.8rem",
                color: "warning.main",
              },
            }}
          >
            <CircleXmarkIcon className="file-icon" />
          </Box>
          <DialogTitle
            sx={{ fontSize: 30, fontWeight: 600, color: "warning.main", pl: 0 }}
          >
            Remove media
          </DialogTitle>
        </Box>
        <DialogContent>
          <Typography
            fontSize={34}
            fontWeight={400}
            color="primary.light"
            sx={{ textAlign: "center", mb: 1 }}
          >
            Are you sure?
          </Typography>
          <Box
            sx={{ display: "flex", justifyContent: "flex-end", gap: 2, pt: 7 }}
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
              Yes, Remove it
            </Button>
          </Box>
        </DialogContent>
      </Dialog>
    </>
  );
}
