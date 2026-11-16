// 
import React from 'react'

// external dependencies
import {
  Box,
  Link,
  Typography,
  Dialog,
  DialogContent,
} from "@mui/material";
import OrangeryCloseButton from './OrangeryCloseButton';

// icons, images & colors
//

export default function OrangeryImage({
  image,
  noImageSrc,
  has_thumbnail,
  enlargeable,
  sx,
  alt,
  width,
  height,
  enlarged,
  setEnlarged,
}: {
  image?: string;
  noImageSrc?: string;
  has_thumbnail?: boolean;
  enlargeable?: boolean;
  sx?: any;  ////////!!!!!!!! any? fix type
  alt?: string;
  width?: number;
  height?: number;
  enlarged?: boolean;
  setEnlarged?: (enlarged: boolean) => void;
}) {
  const [open, setOpen] = React.useState(enlarged ?? false);
  const handleOpen = () => {
    setOpen(true);

    if (setEnlarged)
      setEnlarged(true)
  };

  const handleClose = () => {
    setOpen(false);

    if (setEnlarged)
      setEnlarged(false)
  };

  // @ts-ignore
  return (
    image
      ? <>
        <Link
          key={image}
          onClick={() => { if (enlargeable) handleOpen() }}
          sx={{
            cursor: enlargeable ? "pointer" : "default"
          }}
        >
          <Box
            sx={sx ?? {
              width: (width || 270) + "px",
              height: (height || 190) + "px",
              objectFit: "cover",
            }}
            component={"img"}
            src={has_thumbnail
              ? `${process.env.NEXT_PUBLIC_CDN_URL}/thumbnail/${image}.jpg`
              : `${process.env.NEXT_PUBLIC_CDN_URL}/${image}.jpg`
            }
            loading={"lazy"}
            alt={alt ?? ""}
          />
        </Link>
        <Dialog
          open={open}
          onClose={handleClose}
          sx={{
            "& .MuiPaper-root": {
              // maxWidth: 660,
              backgroundColor: "transparent",
              boxShadow: "none",
              width: "auto",
              maxWidth: "unset",
              height: "auto",
              maxHeight: "unset",
              // height: 444,
            },
          }}
        >
          <DialogContent
            sx={{
              // maxHeight: "95vh",
              backgroundColor: "white",
              py: 2,
              pl: 2,
              pr: 1,
              borderRadius: 4,
              position: "relative",
              overflow: "hidden"
            }}
          >
            <OrangeryCloseButton onClose={handleClose} white />

            <Box
              sx={{
                display: "flex",
                maxHeight: "calc(95vh - 8px)",
                overflowX: "hidden",
                overflowY: "auto",
                "&::-webkit-scrollbar": {
                  width: "0.4em",
                },
                "&::-webkit-scrollbar-track": {
                  marginLeft: "20px",
                },
                "&::-webkit-scrollbar-thumb": {
                  backgroundColor: "rgba(0,0,0,.1)",
                  borderRadius: 5,
                },
                pr: 1,
                mb: 0,
              }}
            >
              <Box
                sx={{
                  width: {
                    xs: "95vw",
                    sm: 800,
                  },
                  // height: 600,
                  height: "fit-content",
                  borderRadius: 3,
                  objectFit: "contain",
                }}
                component={"img"}
                src={`${process.env.NEXT_PUBLIC_CDN_URL}/${image}.jpg`}
                loading={"lazy"}
                alt={alt ?? ""}
              />
            </Box>
          </DialogContent>
        </Dialog>
      </>
      : noImageSrc
        ? <Box
          sx={sx ?? {
            width: (width || 270) + "px",
            height: (height || 190) + "px",
            objectFit: "cover",
          }}
          component={"img"}
          src={noImageSrc}
          loading={"lazy"}
          alt={alt ?? ""}
        />
        : <Box
          sx={{
            width: (width || 270) + "px",
            height: (height || 190) + "px",
            backgroundColor: "#f8f8f8",
            borderRadius: 3,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Typography variant="h5">No Image</Typography>
        </Box>
  );
}