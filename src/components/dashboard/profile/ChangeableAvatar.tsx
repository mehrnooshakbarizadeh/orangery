// react & next
import React from "react";

// external dependencies
import {
  Box,
  Button,
  DialogTitle,
  IconButton,
  Typography,
  Dialog,
  DialogContent,
} from "@mui/material";
import { useDropzone } from "react-dropzone";

// orangery elements & internal dependencies
import { OrangeryImg, OrangeryUserCircle } from "../../OrangeryElements";

// icons, images & colors
import PenCircleIcon from "../../../assets/svg/profile/pen-circle-solid.svg";
import CancleIcon from "../../../assets/svg/cancle.svg";

export default function ChangeableAvatar({
  sx,
  value,
  name,
  onChange,
  disabled,
}: {
  sx?: any;
  value: File | string;
  name: string;
  onChange: (value: File | null) => void;
  disabled?: boolean;
}) {
  const handleSelect = (file: File) => {
    onChange(file);
  };

  return (
    <>
      <Box
        sx={{
          ...sx,
          display: "flex",
          alignItems: "center",
          borderRadius: "50%",
          backgroundColor: "#F9D507",
          textAlign: "center",
          // mt: 2.9,
          width: 140,
          height: 140,
          border: "none",
          position: "relative",
        }}
      >
        <Box
          sx={{
            height: "100%",
            flexGrow: 1,
            overflow: "hidden",
            display: "absolute",
            top: 0,
            right: 0,
          }}
        >
          {value ? (
            <FileView file={value} />
          ) : (
            <Box
              sx={{
                display: "absolute",
                top: 0,
                right: 0,
              }}
            >
              <OrangeryUserCircle name={name} size={140} notHoverable />
            </Box>
          )}
          {!disabled && <FileSelect onSelect={handleSelect} />}
        </Box>
      </Box>
    </>
  );
}

function FileView({ file }: { file: File | string }) {
  return (
    <Box
      sx={{
        display: "absolute",
        // width: "110%",
        width: "100%",
        height: "100%",
        alignItems: "center",
        justifyContent: "start",
        top: 0,
        right: 0,
        "& .image": {
          width: "100%",
          height: "100%",
          objectFit: "cover",
          borderRadius: "50%",
        },
      }}
    >
      {file instanceof File && <ShowImageFile file={file} />}
      {typeof file === "string" && (
        // <OrangeryImg
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={`${process.env.NEXT_PUBLIC_CDN_URL}/${file}.jpg`}
          className="image"
          alt=""
        />
      )}
    </Box>
  );
}

function fileToUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.addEventListener(
      "load",
      function () {
        if (typeof reader.result === "string") {
          resolve(reader.result);
        } else {
          resolve("");
        }
      },
      false
    );

    reader.readAsDataURL(file);
  });
}

function ShowImageFile({ file }: { file: File }) {
  const [url, setUrl] = React.useState("");
  const [open, setOpen] = React.useState(false);

  const handleView = () => {
    setOpen(true);
  };

  const handleHide = () => {
    setOpen(false);
  };

  React.useEffect(() => {
    (async () => {
      const url = await fileToUrl(file);
      setUrl(url);
    })();
  }, [file, setUrl]);

  return (
    <>
      {url && (
        <Box
          sx={{
            width: "100%",
            height: "100%",
            display: "flex",
            borderRadius: "50%",
            position: "absolute",
            top: 0,
            right: 0,
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={url} className="image" alt="" />
        </Box>
      )}
    </>
  );
}

function FileSelect({ onSelect }: { onSelect: (file: File) => void }) {
  const onDrop = (acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      onSelect(acceptedFiles[0]);
    }
  };
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: ".png, .jpg, .jpeg",
    maxFiles: 1,
    maxSize: 10000000,
    multiple: false,
  });

  return (
    <Box
      {...getRootProps({ className: "dropzone" })}
      sx={{
        cursor: "pointer",
        width: "100%",
        height: "100%",
        display: "flex",
        borderRadius: "50%",
        position: "absolute",
        top: 0,
        right: 0,
      }}
    >
      <input {...getInputProps()} />
      <Box
        sx={{
          "& svg": {
            position: "absolute",
            top: 8,
            right: 8,
            width: "1.5rem",
            flexShrink: 0,
            color: "black",
            "& .selecting": { color: "grey.A200" },
          },
        }}
      >
        <PenCircleIcon />
      </Box>
    </Box>
  );
}
