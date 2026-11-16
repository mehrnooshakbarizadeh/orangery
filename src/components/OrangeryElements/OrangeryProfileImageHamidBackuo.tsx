// react & next
import React from "react";

// external dependencies
import { Box, Button, IconButton, Typography } from "@mui/material";
import { useDropzone } from "react-dropzone";
import LinearProgress from "@mui/material/LinearProgress";
import { makeAutoObservable, observable } from "mobx";
import { Observer } from "mobx-react-lite";
import { useMutation } from "react-query";

// queries & backend
import { backend } from "../../queries/backend";
import { processError } from "../../queries/asset";

// icons, images & colors
import UploadIcon from "../../assets/svg/upload.svg";
import CancleIcon from "../../assets/svg/cancle.svg";
import PlusIcon from "../../assets/svg/plus.svg";
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
  label,
  images,
  onAdd,
  onRemove,
}: {
  label?: React.ReactNode;
  images: string[];
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

  const handleAddMore = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    uploadState.setSelectingFile(true);
  };

  return (
    <>
      {label &&
        <Typography
          fontWeight={600}
          sx={{ color: "#575656", pb: "6px", fontSize: 14 }}
        >
          {label}
        </Typography>
      }
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          borderRadius: 1.5,
          py: 2,
          px: 1.6,
          gap: 1,
          backgroundColor: "#09acd012",
          border: (theme) => `1px dotted ${theme.palette.info.main}`,
          cursor: "pointer",
          "& .icon": {
            display: "flex",
            alignItems: "center",
            width: "1.5rem",
            flexShrink: 0,
            color: "grey.A200",
            "&.selecting": {
              color: "info.main",
              width: "1.5rem",
              flexShrink: 0,
            },
          },
          "& .inner-container": {
            flexGrow: 1,
            overflow: "hidden",
          },
          "& .container-action": {
            flexShrink: 0,
          },
        }}
      >
        <Observer>
          {() => (
            <>
              <div className="icon">
                <UploadIcon
                  className={`${uploadState.selectingFile ? "selecting" : ""}`}
                />
              </div>
            </>
          )}
        </Observer>
        <div className="inner-container">
          <UploadedFiles images={images} uploadState={uploadState} />

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
              <>
                {uploadState.selectingFile && (
                  <FileSelect uploadState={uploadState} />
                )}
              </>
            )}
          </Observer>
        </div>
        <div className="container-action">
          <Observer>
            {() => (
              <>
                {!uploadState.selectingFile && (
                  <IconButton onClick={handleAddMore}>
                    <Box sx={{ width: "1rem" }}>
                      <PlusIcon />
                    </Box>
                  </IconButton>
                )}
              </>
            )}
          </Observer>
        </div>
      </Box>
    </>
  );
}

function UploadedFiles({
  images,
  uploadState,
}: {
  images: string[];
  uploadState: UploadState;
}) {
  return (
    <>
      {images?.map((image) => (
        <FileView key={image} uuid={image} uploadState={uploadState} />
      ))}
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
    <Box
      sx={{
        px: 2,
        display: "flex",
        width: "110%",
        alignItems: "center",
        gap: 1,
        // justifyContent: "start",
        "& .copy": {
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
          fontSize: 15,
          fontWeight: 600,
          color: "grey.A200",
        },
        "& .cancel-icon": {
          width: "1rem",
          height: "1rem",
          borderRadius: "10%",
          // ml: 4,
        },
      }}
    >
      <ImageUuidViewer uuid={uuid} />
      <Typography variant="h6">completed.</Typography>
      <IconButton onClick={handleDelete} sx={{ width: 45, ml: 4 }}>
        <CancleIcon className="cancel-icon" />
      </IconButton>
    </Box>
  );
}

function ImageUuidViewer({ uuid }: { uuid: string }) {
  return (
    <Box sx={{ "& .image": { width: "1.3rem", height: "1.3rem" } }}>
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
          <Typography
            sx={{
              fontSize: 15,
              fontWeight: 600,
              color: "grey.A200",
            }}
          >
            Uploading...
          </Typography>
          <Observer>
            {() => (
              <LinearProgress variant="determinate" value={file.progress} />
            )}
          </Observer>
        </div>
        <Button className="cancel-action" onClick={handleCancel} variant="text">
          <CancleIcon />
        </Button>
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
    maxFiles: 10,
    maxSize: 10000000,
    multiple: true,
  });

  return (
    <div {...getRootProps({ className: "dropzone" })}>
      <input {...getInputProps()} />
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
              fontSize: "11px",
              fontWeight: "600",
              color: "#A5AAB4",
            },
          }}
        >
          <Typography
            sx={{
              fontSize: 15,
              fontWeight: 600,
              color: "grey.A200",
              "& .browse": {
                color: (theme) => theme.palette.info.main,
                fontSize: 15,
                fontWeight: 600,
                textDecoration: "underline",
              },
            }}
          >
            Drop Files here or&nbsp;
            <span className="browse">Browse</span>
          </Typography>
          <Typography className="max-size">Max file size: 10MB</Typography>
        </Box>
      )}
    </div>
  );
}
