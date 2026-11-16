// react & next
import { useState } from "react";

// external dependencies
import { Box, Button, Typography, Dialog, DialogContent } from "@mui/material";

// orangery elements & internal dependencies
import { OrangeryMediaCard } from "../OrangeryElements";

// queries & backend
import { IMedia } from "../../queries/media";

// icons, images & colors
import AttachmentsIcon from "../../assets/svg/attachments-icon.svg";

export default function OrangeryAttachmentsButton({
  media,
  caption = "Attachments",
  icon = <AttachmentsIcon className="icon" />,
  bigSize = false,
}: {
  media: IMedia[];
  caption?: string;
  icon?: JSX.Element;
  bigSize?: boolean;
}) {
  const [open, setOpen] = useState(false);
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
        // disableRipple
        sx={{
          color: "#074EE8",
          textDecoration: "none",
          display: "flex",
          alignItems: "center",
          py: 0,
          gap: 1,
          "& .icon": {
            width: "1.3rem",
            height: "1.3rem",
            color: "#1e60e9",
          },
          // "& :hover": {
          //   backgroundColor: "transparent"
          // }
        }}
      >
        {icon}
        <Typography
          sx={{
            fontSize: 16,
            fontWeight: 700,
            whiteSpace: "nowrap",
          }}
        >
          {caption}
        </Typography>
      </Button>

      <Dialog
        open={open}
        onClose={handleClose}
        sx={{
          "& .MuiPaper-root": {
            maxWidth: 660,
            backgroundColor: "transparent",
            boxShadow: "none",
            // height: 444,
          },
        }}
      >
        <DialogContent sx={{ p: 0 }}>
          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              flexDirection: "row",
              columnGap: 3,
              overflowX: "hidden",
              maxHeight: {
                xs: "unset",
                sm: 600,
              },
              overflowY: "auto",
              "&::-webkit-scrollbar": {
                width: "0.6em",
              },
              "&::-webkit-scrollbar-track": {
                // boxShadow: "inset 0 0 6px rgba(0,0,0,0.00)",
                // webkitBoxShadow: "inset 0 0 6px rgba(0,0,0,0.00)",
              },
              "&::-webkit-scrollbar-thumb": {
                backgroundColor: "rgba(0,0,0,.5)",
                // outline: "1px solid slategrey",
                borderRadius: 5,
              },
            }}
          >
            {media.map((medium) => (
              <Box key={medium.uuid}>
                <OrangeryMediaCard bigSize={bigSize} media={medium} readOnly />
              </Box>
            ))}
          </Box>
        </DialogContent>
      </Dialog>
    </>
  );
}
