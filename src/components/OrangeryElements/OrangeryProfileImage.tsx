// react & next
import React from "react";

// external dependencies
import { Box, Button, IconButton, Typography } from "@mui/material";
import { useDropzone } from "react-dropzone";
import { makeAutoObservable, observable } from "mobx";
import { Observer } from "mobx-react-lite";
import { useMutation } from "react-query";
import { OrangeryImg, OrangeryUserCircle } from "../OrangeryElements";

// queries & backend
import { backend } from "../../queries/backend";
import { processError } from "../../queries/asset";

// icons, images & colors
import PenCircleIcon from "../../assets/svg/profile/pen-circle-solid.svg";
import { useGlobalState } from "../../Contexts & Globals/GlobalContext";

export interface IImageData {
  uuid?: string;
  file?: File;
}
export interface IImageResult {
  uuid: string;
}

interface IImageUpload {
  uuid?: string;
  file: File;
  office_uuid: string;
  onUploadProgress: (progressEvent: any) => void;
}

async function uploadAssetFile(params: IImageUpload): Promise<IImageResult> {
  try {
    const formData = new FormData();
    formData.append("file", params.file);
    formData.append("office_uuid", params.office_uuid);

    if (params.uuid) {
      const result = await backend.put(`/file/image`, formData, {
        headers: (formData as any).getHeaders?.(),
        onUploadProgress: params.onUploadProgress,
      });
      const finalResult = result.data.data;
      return { uuid: finalResult };
    } else {
      const result = await backend.post(`/file/image`, formData, {
        headers: (formData as any).getHeaders?.(),
        onUploadProgress: params.onUploadProgress,
      });
      const finalResult = result.data.data;
      return { uuid: finalResult };
    }
  } catch (err: any) {
    const processedError = processError(err);
    throw processedError;
  }
}

async function deleteAssetFile(uuid: string): Promise<void> {
  //TODO the endpoint is not implemented yet
}

function useUploadAssetFile() {
  return useMutation<IImageResult, Error, IImageUpload>(uploadAssetFile);
}

function useDeleteAssetFile() {
  return useMutation<void, Error, string>(deleteAssetFile, {});
}

class FileUploadState {
  constructor(
    public file: File,
    public started: boolean,
    public progress: number,
    private parent: UploadState
  ) {
    makeAutoObservable(this, {
      file: false,
    });
  }

  setProgress(value: number) {
    if (!this.started) this.started = true;
    this.progress = value;
  }

  uploaded(uuid: string) {
    this.parent.onAdd?.(uuid);
    this.parent.removeFile(this);
  }

  remove() {
    this.parent.removeFile(this);
  }
}

class UploadState {
  public files = observable.array();
  public selectingFile = true;
  public onAdd?: (uuid: string) => void;
  public onRemove?: (uuid: string) => void;

  constructor() {
    makeAutoObservable(this, {
      onAdd: false,
      onRemove: false,
    });
  }

  addNewFile(file: File) {
    const fileUpload = new FileUploadState(file, false, 0, this);
    this.files.push(fileUpload);
    this.selectingFile = false;
  }

  removeFile(file: FileUploadState) {
    const index = this.files.findIndex((f) => f === file);
    if (index === -1) return;
    this.files.splice(index, 1);
  }

  setSelectingFile(value: boolean) {
    this.selectingFile = value;
  }
}

export default function OrangeryImagesField({
  images,
  name,
  sx,
  disabled,
  onAdd,
  onRemove,
}: {
  images: string[];
  name: string;
  sx?: any;
  disabled?: boolean;
  onAdd: (uuid: string) => void;
  onRemove: (uuid: string) => void;
}) {
  const [uploadState] = React.useState(() => new UploadState());

  React.useEffect(() => {
    if (images.length === 0) {
      uploadState.setSelectingFile(true);
    }
  }, [images, uploadState]);

  React.useEffect(() => {
    uploadState.onAdd = onAdd;
    uploadState.onRemove = onRemove;
  });

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
          <div className="inner-container">
            <UploadedFiles
              name={name}
              images={images}
              uploadState={uploadState}
            />

            <Observer>
              {() => (
                <>
                  {uploadState.files.map((file, index) => (
                    <FileUploader key={index} file={file} />
                  ))}
                </>
              )}
            </Observer>
            <Observer>
              {() => (
                <>{!disabled && <FileSelect uploadState={uploadState} />}</>
              )}
            </Observer>
          </div>
        </Box>
      </Box>
    </>
  );
}

function UploadedFiles({
  images,
  uploadState,
  name,
}: {
  images: string[];
  uploadState: UploadState;
  name: string;
}) {
  return (
    <>
      {images[0] !== "" ? (
        images?.map((image) => (
          <FileView key={image} uuid={image} uploadState={uploadState} />
        ))
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
    </>
  );
}

function FileView({
  uuid,
  uploadState,
}: {
  uuid: string;
  uploadState: UploadState;
}) {
  const mutation = useDeleteAssetFile();
  const handleDelete = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    try {
      await mutation.mutateAsync(uuid);
      uploadState.onRemove?.(uuid);
    } catch (err: any) {
      //TODO handle the error
    }
  };
  return (
    <Box>
      <ImageUuidViewer uuid={uuid} />
    </Box>
  );
}

function ImageUuidViewer({ uuid }: { uuid: string }) {
  return (
    <Box
      sx={{
        display: "absolute",
        width: "100%",
        height: "100%",
        alignItems: "center",
        justifyContent: "start",
        top: 0,
        right: 0,
        "& .image": {
          width: "140px",
          height: "140px",
          objectFit: "cover",
          borderRadius: "50%",
        },
      }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={`${process.env.NEXT_PUBLIC_CDN_URL}/${uuid}.jpg`}
        className="image"
        alt=""
      />
    </Box>
  );
}

function FileUploader({ file }: { file: FileUploadState }) {
  const mutation = useUploadAssetFile();
  const { office_uuid } = useGlobalState();

  const startUpload = async () => {
    const result = await mutation.mutateAsync({
      file: file.file,
      office_uuid: office_uuid,
      onUploadProgress: (progressEvent) => {
        const { loaded, total } = progressEvent;
        const precentage = Math.floor((loaded * 100) / total);
        file.setProgress(precentage);
      },
    });
    file.uploaded(result.uuid);
  };

  const handleCancel = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
  };

  React.useEffect(() => {
    if (!mutation.isLoading) {
      const timeout = setTimeout(startUpload, 2000);
      return () => clearTimeout(timeout);
    }
  });

  return (
    <>
      <Box
        sx={{
          display: "flex",
          width: "100%",
          "& .upload-container": {
            flexGrow: 1,
          },
          "& .cancel-action svg": {
            width: "1rem",
            height: "1rem",
            flexShrink: 0,
            color: "grey.A200",
          },
          "& .cancel-action": {
            minWidth: 30,
          },
        }}
      >
        <div className="upload-container">
          {/* <Typography
            sx={{
              fontSize: 15,
              fontWeight: 600,
              color: "grey.A200",
            }}
          >
            Uploading...
          </Typography> */}
          {/* <Observer>
            {() => (
              <LinearProgress variant="determinate" value={file.progress} />
            )}
          </Observer> */}
        </div>
        {/* <Button className="cancel-action" onClick={handleCancel} variant="text">
          <CancleIcon />
        </Button> */}
      </Box>
    </>
  );
}

function FileSelect({ uploadState }: { uploadState: UploadState }) {
  const onDrop = (acceptedFiles: File[]) => {
    if (acceptedFiles.length) {
      acceptedFiles.forEach((file) => uploadState.addNewFile(file));
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
    <div {...getRootProps({ className: "dropzone" })}>
      <Box
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
    </div>
  );
}
