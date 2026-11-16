import React from "react";
import { useState } from "react";
import { Box, Button, Typography } from "@mui/material";
import { FileRejection, useDropzone } from "react-dropzone";
import { Observer } from "mobx-react-lite";
import UploadIcon from "../../assets/svg/upload-file-2.svg";
import { UploadState } from "./OrangeryUploadImage";

export default function OrangeryUplaodComponent({
  limit,
  uploadState,
  images,
  onAdd,
  onRemove,
}: {
  limit?: number;
  uploadState?: UploadState;
  images?: string[];
  onAdd?: (file: string) => void;
  onRemove?: (file: string) => void;
}) {
  return (
    <>
      <Box
        sx={{
          position: "relative",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: 1.5,
          py: 2,
          px: 1.6,
          gap: 3,
          backgroundColor: "#fff",
          cursor: "pointer",
          width: "100%",
          height: "123px",
          "& .icon": {
            color: "#074EE8",
          },
          "& .inner-container": {
            zIndex: 1,
          },
          "& .glow-container": {
            position: "absolute",
            width: "100%",
            height: "100%",
            inset: 0,
          },
          "& .glow-blur": {
            width: "100%",
            height: "100%",
            fill: "transparent",
            stroke: "#074EE8",
            strokeWidth: "3px",
            strokeDasharray: "10 7",
            rx: "8px",
          },
        }}
      >
        <svg className="glow-container">
          <rect pathLength={3000} className="glow-blur"></rect>
        </svg>
        <Observer>
          {() => (
            <>
              <div className="icon">
                <UploadIcon />
              </div>
            </>
          )}
        </Observer>
        <div className="inner-container">
          <Observer>
            {() => (
              <>
                <FileSelect uploadState={uploadState} limit={limit} />
              </>
            )}
          </Observer>
        </div>
      </Box>
    </>
  );
}

function FileSelect({
  uploadState,
  limit,
}: {
  uploadState?: UploadState;
  limit?: number;
}) {
  const [errors, setErrors] = useState<string>("");
  const onDrop = (acceptedFiles: File[], fileRejections: FileRejection[]) => {
    if (acceptedFiles.length) {
      acceptedFiles.forEach((file) => uploadState?.addNewFile(file));
    }
    if (fileRejections.length) {
      fileRejections.forEach((file) => {
        file.errors.forEach((err) => {
          if (err.code === "file-too-large") {
            setErrors(`Error: ${err.message}`);
          }

          if (err.code === "file-invalid-type") {
            setErrors(`Error: ${err.message}`);
          }
        });
      });
    } else {
      setErrors("");
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: ".png, .jpg, .jpeg",
    maxFiles: 10000,
    maxSize: 10000000,
    multiple: true,
  });

  return (
    <div {...getRootProps({ className: "dropzone" })}>
      <input {...getInputProps()} />
      <Typography color="#FF3D00">{errors}</Typography>

      {isDragActive ? (
        <Typography sx={{ fontSize: 15, fontWeight: 600, color: "grey.A200" }}>
          Drop your files here ...
        </Typography>
      ) : (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            "& .max-size": {
              fontSize: "15px",
              fontWeight: "600",
              color: "#2B2E33",
            },
          }}
        >
          <Typography
            sx={{
              fontSize: 18,
              fontWeight: 600,
              color: "#2B2E33",
            }}
          >
            {`Drop file${limit! > 1 ? "s" : ""} here or choose from below`}
          </Typography>
          <Typography className="max-size">Max file size: 10MB</Typography>
        </Box>
      )}
    </div>
  );
}
