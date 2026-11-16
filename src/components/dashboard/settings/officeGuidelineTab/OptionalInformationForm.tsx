// contexts & globals
import { useGlobalState } from "../../../../Contexts & Globals/GlobalContext";
import { useTranslation } from "react-i18next";
import i18next from "i18next";

// react & next
import React from "react";

// external dependencies
import {
  Box,
  Typography,
  Grid,
  Divider,
  Button,
  TextField,
} from "@mui/material";
import { makeAutoObservable } from "mobx";
import { Observer } from "mobx-react-lite";
// import NotificationEmailForm from "./NotificationEmailForm";
// import OfferTemplateForm from "./OfferTemplateForm";

// orangery elements & internal dependencies
import {
  FieldError,
  FormError,
  ValueState,
  ArrayValueState,
} from "../../../../states/mobx-form";
import {
  OrangeryTextField,
  OrangeryTextAreaField,
  OrangeryImagesField,
  OrangeryAttachmentsButton,
} from "../../../OrangeryElements";

// queries & backend
import {
  IOptionalInformation,
  IOptionalInformationUpdateParams,
  useOfficeGuideline,
} from "../../../../queries/officeGuideline";
// icons, images & colors

export class OptionalInformationState {
  public title;
  public description;
  public image_uuids;
  public error = "";

  private optionalInformation;

  constructor(optionalInformation?: IOptionalInformationUpdateParams) {
    this.optionalInformation = optionalInformation;
    if (optionalInformation) {
      this.title = new ValueState(optionalInformation.title);
      this.description = new ValueState(optionalInformation.description);
      this.image_uuids = new ArrayValueState(
        optionalInformation.image_uuids ?? ([] as string[])
      );
    } else {
      this.title = new ValueState("");
      this.description = new ValueState("");
      this.image_uuids = new ArrayValueState([] as string[]);
    }

    makeAutoObservable(this);
  }

  get data() {
    return {
      title: this.title.value,
      description: this.description.value,
      image_uuids: this.image_uuids.values.map((v) => v.value),
    };
  }

  clearErrors() {
    this.title.clearError();
    this.description.clearError();
    this.image_uuids.clearError();
    this.error = "";
  }

  validate() {
    let valid = true;
    this.clearErrors();
    if (!this.title.value) {
      this.title.error = "Please fill the title";
      valid = false;
    }
    if (!this.description.value) {
      this.description.error = "Please fill the description";
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
    } else if (error.field === "title") {
      this.title.error = error.error;
    } else if (error.field === "description") {
      this.description.error = error.error;
    } else {
      // console.warn(
      //   `the field ${error.field} not found in the field list in ProfileForm.`
      // );
    }
  }
}

export default function OptionalInformationForm({
  title,
  description,
  editMode,
  optionalInformation,
  onChange,
  onRemove,
}: {
  title?: string;
  description?: string;
  editMode: boolean;
  optionalInformation?: IOptionalInformationUpdateParams;
  onChange: (optionalInformation: IOptionalInformationUpdateParams) => void;
  onRemove: () => void;
}) {
  const globalState = useGlobalState();
  const { office_uuid } = useGlobalState();
  const { data: officeGuideline } = useOfficeGuideline(globalState.office_uuid);
  const state = React.useMemo(
    () => new OptionalInformationState(optionalInformation),
    [optionalInformation]
  );

  return (
    <>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          backgroundColor: "#F7F8FA",
          borderRadius: "15px",
          px: 2,
          py: 4,
          mt: 4,
        }}
      >
        <Observer>
          {() => (
            <OrangeryTextField
              disabled={!editMode}
              placeholder={"Enter title"}
              name="title"
              label="TITLE"
              rows={1}
              error={!!state.title.error}
              value={state.title.value}
              helperText={state.title.error}
              onChange={(e: any) => {
                state.title.value = e.target.value;
                onChange(state.data);
              }}
              sx={{
                mb: 5,
                "& .MuiOutlinedInput-input": {
                  backgroundColor: "white",
                  height: "10px !important",
                },
              }}
            />
          )}
        </Observer>
        <Observer>
          {() => (
            <OrangeryTextAreaField
              disabled={!editMode}
              placeholder={"Enter description"}
              name="description"
              label="DESCRIPTION"
              multiline
              rows={20}
              error={!!state.description.error}
              value={state.description.value}
              helperText={state.description.error}
              onChange={(e: any) => {
                state.description.value = e.target.value;
                onChange(state.data);
              }}
              sx={{
                mb: 5,
                backgroundColor: "white",
                "& .MuiOutlinedInput-input": {
                  height: "200px !important",
                },
              }}
            />
          )}
        </Observer>
        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          {editMode ? (
            <Observer>
              {() => (
                <OrangeryImagesField
                  images={state.image_uuids.values?.map((v) => v.value)}
                  onAdd={(uuid) => {
                    state.image_uuids.pushElementValue(uuid);
                    onChange(state.data);
                  }}
                  onRemove={(uuid) => {
                    const i = state.image_uuids.values.findIndex(
                      (v) => v.value === uuid
                    );
                    if (i !== -1) {
                      state.image_uuids.deleteElementValue(i);
                      onChange(state.data);
                    }
                  }}
                />
              )}
            </Observer>
          ) : state.image_uuids.values.length > 0 ? (
            <OrangeryAttachmentsButton
              media={state.image_uuids.values?.map((v) => ({
                uuid: v.value,
                is_image: true,
                is_document: false,
              }))}
            />
          ) : (
            <Typography sx={{ ml: 1 }}>No attachments</Typography>
          )}

          {editMode && (
            <Button
              onClick={onRemove}
              variant="contained"
              color="primary"
              aria-label="add"
              //  onClick={() => handleOpen()}
              sx={{
                "& .add-btn": {
                  fontSize: 13,
                  fontWeight: 400,
                  color: "#fff",
                },
                py: "12px",
                px: 2,

                gap: "10px",
                width: 120,
                alignSelf: "flex-end",
                // color: (theme) => theme.palette.grey[200],
              }}
            >
              {" "}
              <Typography className="add-btn">Remove Section</Typography>
            </Button>
          )}
        </Box>
      </Box>
    </>
  );
}
