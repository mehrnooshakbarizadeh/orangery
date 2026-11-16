//
import { useGlobalState } from "../../../Contexts & Globals/GlobalContext";

// react & next
import { useRouter } from "next/router";
import React from "react";

// external dependencies
import {
  Box,
  Button,
  Typography,
  TextField,
  InputAdornment,
  IconButton,
} from "@mui/material";
import { makeAutoObservable } from "mobx";
import { Observer } from "mobx-react-lite";
import NumberFormat from "react-number-format";

//
import { OrangeryTextField, OrangeryToast } from "../../OrangeryElements";
import { FieldError, FormError, ValueState } from "../../../states/mobx-form";

//
import { IMedia, useUpsertMedia } from "../../../queries/media";

// icons, images & colors
import CrossIcon from "../../../assets/svg/cross.svg";

export class MediaState {
  public uuid;
  public name;
  public office_uuid;
  public error = "";

  constructor(office_uuid: string, media?: IMedia) {
    this.office_uuid = new ValueState(office_uuid);
    if (media) {
      this.name = new ValueState(media.name);
      this.uuid = new ValueState(media.uuid);
    } else {
      this.name = new ValueState("");
      this.uuid = new ValueState("");
    }

    makeAutoObservable(this);
  }

  get data() {
    return {
      uuid: this.uuid.value,
      name: this.name.value,
      office_uuid: this.office_uuid.value,
    };
  }

  clearErrors() {
    this.name.clearError();
    this.error = "";
  }

  validate() {
    let valid = true;
    this.clearErrors();
    if (!this.name.value) {
      this.name.error = "Please fill your file name";
      valid = false;
    }
    return valid;
  }

  setupErrors(err: FormError) {
    this.clearErrors();
    err.errors.forEach((error) => this.setupError(error));
  }

  setupError(error: FieldError) {
    if (error.field === "") {
      this.error = error.error;
    } else if (error.field === "name") {
      this.name.error = error.error;
    } else {
    }
  }
}

export default function MediaForm({
  media,
  handleClose,
  noCancel,
  noRemove,
}: {
  media?: IMedia;
  handleClose: () => void;
  noCancel?: any;
  noRemove?: any;
}) {
  const { office_uuid } = useGlobalState();
  const mutation = useUpsertMedia();
  const state = React.useMemo(
    () => new MediaState(office_uuid, media),
    [office_uuid, media]
  );

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!state.validate()) {
      return;
    }
    try {
      await mutation.mutateAsync(state.data);
      handleClose();
      if (media) {
        OrangeryToast("Successfully edited " + state.data.name, "success");
      } else {
        OrangeryToast("Successfully created " + state.data.name, "success");
      }
    } catch (err: any) {
      state.setupErrors(err);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <Box>
        <Observer>
          {() => (
            <Box
              sx={{
                pr: 3,
                pl: 4,
                py: 1.8,
                // pb: 1,
                // pt: 2.5,
                mb: 3.5,
                display: "flex",
                justifyContent: "end",
                alignItems: "center",
                "& .cross-icon": { width: "1.3rem", height: '1.3rem', color: '#000' }
              }}
            >

              <Typography
                variant="h1"
                sx={{ flexGrow: 1 }}
                color="#000"
              >
                Edit Media
              </Typography>
              <IconButton onClick={handleClose}>
                <CrossIcon className="cross-icon" />
              </IconButton>

            </Box>
          )}
        </Observer>
        <Observer>
          {() => (
            <>
              <Box sx={{ display: "flex", alignItems: "center", gap: 2, "& .image": { width: '385px', height: '287px', borderRadius: 3, objectFit: "contain" } }}>
                <Box sx={{ mb: "32px", ml: 3, }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  {media?.is_image ? <img
                    src={`${process.env.NEXT_PUBLIC_CDN_URL}/${media?.uuid}.jpg`}
                    className="image"
                    alt=""
                  /> :
                    <Box sx={{
                      "& .scroll-align": {
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
                        height: "calc(100vh - 426px)"
                      },
                    }}>
                      <embed width="385px" height="calc(100vh - 426px)" className="scroll-align" src={`${process.env.NEXT_PUBLIC_CDN_URL}/${media?.uuid}.pdf`} type="application/pdf" />
                    </Box>
                  }
                </Box>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, width: '100%' }}>
                  <Box sx={{ width: "88%", mb: '99px', ml: '20px' }}>
                    <Observer>
                      {() => (
                        <OrangeryTextField
                          label="MEDIA NAME"
                          name="name"
                          error={!!state.name.error}
                          value={state.name.value}
                          helperText={state.name.error}
                          onChange={(e: any) => (state.name.value = e.target.value)}
                        />
                      )}
                    </Observer>
                  </Box>
                  <Observer>
                    {() => (
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, position: 'absolute', bottom: '40px', right: '30px' }}>
                        {!noCancel && (
                          <Button
                            color="primary"
                            onClick={handleClose}
                            sx={{
                              width: 170,
                              height: 55,
                              fontSize: 20,
                              color: (theme) => theme.palette.grey.A200,
                              backgroundColor: (theme) => theme.palette.grey[200],
                              mr: 2,
                            }}
                          >
                            Cancel
                          </Button>
                        )}
                        <Button
                          variant="contained"
                          type="submit"
                          color="primary"
                          disabled={mutation.isLoading}
                          sx={{
                            width: 170,
                            height: 55,
                            fontSize: 20,
                            color: "#fff",
                          }}
                        >
                          Save
                        </Button>
                      </Box>
                    )}
                  </Observer>
                </Box>
              </Box>
            </>
          )}
        </Observer>

        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "center",
            px: 3,
          }}
        >
          {/* {!noRemove && (
            <Box sx={{ flexGrow: 1 }}>
              {desk && (
                <DeleteDeskButton
                  handleCloseForm={handleClose}
                  desk={desk}
                  label="Remove"
                  sx={{ color: "red" }}
                />
              )}
            </Box>
          )} */}
          {/* <Observer>
            {() => (
              <>
                {!noCancel && (
                  <Button
                    color="primary"
                    onClick={handleClose}
                    sx={{
                      width: 170,
                      height: 55,
                      fontSize: 20,
                      color: (theme) => theme.palette.grey.A200,
                      backgroundColor: (theme) => theme.palette.grey[200],
                      mr: 2,
                    }}
                  >
                    Cancel
                  </Button>
                )}
                  <Button
                    variant="contained"
                    type="submit"
                    color="primary"
                    disabled={mutation.isLoading}
                    sx={{
                      width: 170,
                      height: 55,
                      fontSize: 20,
                      color: "#fff",
                    }}
                  >
                    Save
                  </Button>
              </>
            )}
          </Observer> */}
        </Box>
      </Box>
    </form>
  );
}
