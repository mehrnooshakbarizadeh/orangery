// react & next
import React from "react";

// external dependencies
import { makeAutoObservable, observable } from "mobx";
import { useDropzone } from "react-dropzone";
import { Box, Button, IconButton, Typography } from "@mui/material";
import LinearProgress from "@mui/material/LinearProgress";
import { v4 as uuid_v4 } from "uuid";
import { Observer } from "mobx-react-lite";
import { useMutation, useQuery, useQueryClient } from "react-query";

// icons, images & colors
import UploadIcon from "../../assets/svg/upload.svg";
import CancleIcon from "../../assets/svg/cancle.svg";
import PlusIcon from "../../assets/svg/plus.svg";

type FileState = {
  id: string;
  file: File;
};

let files: FileState[] = [];

async function uploadAssetFile(file: FileState): Promise<void> {
  files = [...files, file];
}

async function deleteAssetFile(file: FileState): Promise<void> {
  files = files.filter((f) => f.id !== file.id);
}

async function getFiles(): Promise<FileState[]> {
  return files;
}

function useAssetFileList() {
  return useQuery<FileState[], Error>("asset-files", () => getFiles(), {
    refetchOnWindowFocus: true,
  });
}

function useUploadAssetFile() {
  const queryClient = useQueryClient();
  return useMutation<void, Error, FileState>(uploadAssetFile, {
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries("asset-files");
    },
  });
}
function useDeleteAssetFile() {
  const queryClient = useQueryClient();
  return useMutation<void, Error, FileState>(deleteAssetFile, {
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries("asset-files");
    },
  });
}

class FileUploadState {
  constructor(
    public id: string,
    public file: File,
    public started: boolean,
    public progress: number,
    private parent: UploadState
  ) {
    makeAutoObservable(this, {
      id: false,
      file: false,
    });
  }

  setProgress(value: number) {
    if (!this.started) this.started = true;
    this.progress = value;
  }

  remove() {
    this.parent.removeFile(this.id);
  }
}

class UploadState {
  public files = observable.array();
  public selectingFile = true;
  constructor() {
    makeAutoObservable(this);
  }

  addNewFile(file: File) {
    const fileUpload = new FileUploadState(uuid_v4(), file, false, 0, this);
    this.files.push(fileUpload);
    this.selectingFile = false;
  }

  removeFile(id: string) {
    const index = this.files.findIndex((f) => f.id === id);
    if (index === -1) return;
    this.files.splice(index, 1);
  }

  setSelectingFile(value: boolean) {
    this.selectingFile = value;
  }
}

export default function OrangeryFilesField() {
  const [uploadState] = React.useState(() => new UploadState());

  const handleAddMore = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    uploadState.setSelectingFile(true);
  };

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        borderRadius: 1.5,
        mt: 2.8,
        py: 0.3,
        px: 1.6,
        gap: 1,
        border: (theme) => `1px dotted ${theme.palette.info.main}`,
        cursor: "pointer",
        "& .icon svg": {
          width: "1.5rem",
          flexShrink: 0,
          color: "info.main",
          "&.selecting": { color: "grey.A200" },
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
        <UploadedFiles uploadState={uploadState} />

        <Observer>
          {() => (
            <>
              {uploadState.files.map((file) => (
                <FileUploader key={file.id} file={file} />
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
  );
}

function UploadedFiles({ uploadState }: { uploadState: UploadState }) {
  const { data: files, isLoading, isError } = useAssetFileList();

  React.useEffect(() => {
    if (files?.length === 0 && !isLoading && !isError) {
      uploadState.setSelectingFile(true);
    }
  }, [files, isLoading, isError, uploadState]);

  return (
    <>
      {files?.map((file) => (
        <FileView key={file.id} file={file} />
      ))}
    </>
  );
}

function FileView({ file }: { file: FileState }) {
  const mutation = useDeleteAssetFile();
  const handleDelete = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    mutation.mutate(file);
  };
  return (
    <Box
      sx={{
        display: "flex",
        width: "110%",
        alignItems: "center",
        justifyContent: "end",
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
        },
      }}
    >
      <Typography className="copy">{file.file.name}</Typography>
      <IconButton onClick={handleDelete} sx={{ width: 45 }}>
        <CancleIcon className="cancel-icon" />
      </IconButton>
    </Box>
  );
}

function FileUploader({ file }: { file: FileUploadState }) {
  const mutation = useUploadAssetFile();
  const interval = React.useRef<any>(null);

  const startUpload = () => {
    interval.current = setInterval(() => {
      const p = file.progress + 10;
      file.setProgress(p);
      if (p >= 100) {
        clearInterval(interval.current);
        mutation.mutate({ id: file.id, file: file.file });
        file.remove();
      }
    }, 200);
  };

  const handleCancel = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    clearInterval(interval.current);
    file.remove();
  };

  React.useEffect(() => {
    const timeout = setTimeout(startUpload, 2000);
    return () => clearTimeout(timeout);
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
    accept: ".png, .pdf, .jpg, .jpeg",
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
          Drag &#38; Drop or &nbsp;
          <span className="browse">Brows</span>
        </Typography>
      )}
    </div>
  );
}
