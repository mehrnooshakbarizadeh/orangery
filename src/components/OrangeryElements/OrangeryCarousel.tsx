// 
import React from 'react'

// external dependencies
import Carousel from "react-material-ui-carousel";
import {
  Box,
  Link,
  Typography,
  Dialog,
  DialogContent,
} from "@mui/material";

// icons, images & colors
import NextIcon from "../../assets/svg/NextIcon.svg";
import PrevIcon from "../../assets/svg/PrevIcon.svg";

export default function OrangeryCarousel({
  images,
  imageUrls,
  width,
  height,
}: {
  images?: string[];
  imageUrls?: string[];
  width?: number | string;
  height?: number | string;
}) {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const [activeSlide, setActiceSlide] = React.useState(0)

  const [imageSrcs, setImageSrcs] = React.useState([] as string[]);
  React.useEffect(() => {
    if (images && images.length > 0)
      setImageSrcs(images.map((image) => (`${process.env.NEXT_PUBLIC_CDN_URL}/${image}.jpg`)))
    if (imageUrls && imageUrls.length > 0)
      setImageSrcs(imageUrls)
  }, [images, imageUrls])

  // @ts-ignore
  return (
    imageSrcs && imageSrcs.length > 0
      ? <>
        <Carousel
          next={(next, active) => { setActiceSlide(next ?? 0) }}
          prev={(prev, active) => { setActiceSlide(prev ?? 0) }}
          index={activeSlide}
          NextIcon={imageSrcs.length > 1 ? <NextIcon /> : <></>}
          PrevIcon={imageSrcs.length > 1 ? <PrevIcon /> : <></>}
          autoPlay={false}
          sx={{
            width: (width || 270),
            height: (height || 190),
            borderRadius: 3,
            flexShrink: 0,
          }}
        >
          {imageSrcs?.map((imageSrc, index) => (
            <Link
              key={imageSrc}
              onClick={() => handleOpen()}
              sx={{
                cursor: "pointer"
              }}
            >
              <Box
                sx={{
                  width: (width || 270),
                  height: (height || 190),
                  objectFit: "cover",
                }}
                component={"img"}
                src={imageSrc}
                loading={"lazy"}
              />
            </Link>
          ))}
        </Carousel>
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
          <DialogContent>
            <Box
              sx={{
                display: "flex",
                flexWrap: "wrap",
                flexDirection: "row",
                columnGap: 3,
                overflowX: "hidden",
                // maxHeight: {
                //   xs: "unset",
                //   sm: 600,
                // },
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
              <Carousel
                next={(next, active) => { setActiceSlide(next ?? 0) }}
                prev={(prev, active) => { setActiceSlide(prev ?? 0) }}
                index={activeSlide}
                NextIcon={imageSrcs.length > 1 ? <NextIcon /> : <></>}
                PrevIcon={imageSrcs.length > 1 ? <PrevIcon /> : <></>}
                autoPlay={false}
                sx={{
                  width: 800,
                  maxWidth: "95vw",
                  maxHeight: "95vh",
                  height: 600,
                  borderRadius: 3,
                  flexShrink: 0,
                }}
              >
                {imageSrcs?.map((imageSrc, index) => (
                  <Box
                    key={imageSrc}
                    sx={{
                      width: 800,
                      height: 600,
                      borderRadius: 3,
                      objectFit: "contain",
                    }}
                    component={"img"}
                    src={imageSrc}
                    loading={"lazy"}
                  />
                ))}
              </Carousel>
            </Box>
          </DialogContent>
        </Dialog>
      </>
      : <Box
        sx={{
          width: (width || 270),
          height: (height || 190),
          backgroundColor: "#f8f8f8",
          borderRadius: 3,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Typography variant="h5">No Uploaded Image</Typography>
      </Box>
  );
}