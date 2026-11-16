// contexts & globals
import { useGlobalState } from "../../../Contexts & Globals/GlobalContext";

// react & next
import React from "react";

// external dependencies
import { Box, Button, Icon, IconButton, Typography } from "@mui/material";
import { makeAutoObservable } from "mobx";
import { observer, Observer } from "mobx-react-lite";
// orangery elements & internal dependencies
import { FieldError, FormError, ValueState } from "../../../states/mobx-form";
import { OrangeryToast, OrangeryTextField } from "../../OrangeryElements";
import CrossIcon from "../../../assets/svg/cross.svg";
// queries & backend
import {
  ICSVPostResult,
  useEmployees,
  usePostCSV,
} from "../../../queries/employee";

// icons, images & colors
import OrangeryCSV from "../../OrangeryElements/OrangeryCSV";
import CsvGuide from "./CsvGuide";

export class CsvUploadState {
  public office_uuid;
  public csv_uuid: ValueState<File | string>;
  public error = "";

  public result: ICSVPostResult[] | [] = [];

  constructor(office_uuid: string) {
    this.office_uuid = new ValueState(office_uuid);
    this.csv_uuid = new ValueState<File | string>("");
    makeAutoObservable(this);
  }

  get data() {
    return {
      data: {
        office_uuid: this.office_uuid.value,
      },
      csv_uuid: this.csv_uuid.value!,
    };
  }

  clearErrors() {
    this.csv_uuid.error = "";
    this.office_uuid.error = "";
    this.error = "";
  }

  validate() {
    let valid = true;
    this.clearErrors();
    if (!this.csv_uuid.value) {
      this.csv_uuid.error = "Please upload csv file";
      valid = false;
    }
    return valid;
  }

  setResult(value: ICSVPostResult[]) {
    this.result = value!;
  }

  setupErrors(err: FormError) {
    this.clearErrors();
    err.errors.forEach((error) => this.setupError(error));
  }

  setupError(error: FieldError) {
    if (error.field === "") {
      this.error = error.error;
    }
    if (error.field === "csv_uuid") {
      this.csv_uuid.error = error.error;
    }
  }
}

export const CSVForm = observer(
  ({ handleClose }: { handleClose: () => void }) => {
    const { office_uuid } = useGlobalState();
    const mutation = usePostCSV();
    const state = React.useMemo(
      () => new CsvUploadState(office_uuid),
      [office_uuid]
    );

    async function handleSubmit(e: React.FormEvent) {
      e.preventDefault();
      if (!state.validate()) {
        return;
      }
      try {
        const result = await mutation.mutateAsync(state.data);
        state.setResult(result);
        OrangeryToast(
          state.result?.length + " employees successfully added.",
          "success"
        );
        handleClose();
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
                  py: 2.5,
                  display: "flex",
                  justifyContent: "end",
                  alignItems: "center",
                  borderBottom: "1px solid #E8E9ED",
                }}
              >
                <Typography
                  sx={{
                    flexGrow: 1,
                    fontSize: 24,
                    fontWeight: 600,
                    color: "#000",
                  }}
                >
                  Upload CSV File
                </Typography>
                <IconButton
                  onClick={handleClose}
                  sx={{
                    display: "flex",
                    "& .cancel-icon": {
                      width: "1.3rem",
                      height: "1.3rem",
                      color: "black",
                    },
                  }}
                >
                  <CrossIcon className="cancel-icon" />
                </IconButton>
              </Box>
            )}
          </Observer>
          <Box sx={{ p: "2.16rem" }}>
            <CsvGuide />
            <Observer>
              {() => (
                <OrangeryCSV
                  value={state.csv_uuid.value ?? ""}
                  onChange={(file) => (state.csv_uuid.value = file ?? "")}
                />
              )}
            </Observer>
          </Box>
          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              alignItems: "center",
              px: 3,
              py: 2,
              borderTop: "1px solid #E8E9ED",
            }}
          >
            <Observer>
              {() => (
                <>
                  <Button
                    color="primary"
                    onClick={handleClose}
                    sx={{
                      width: 144,
                      height: 55,
                      fontSize: 20,
                      color: "#2B2E33",
                      mr: 2,
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="contained"
                    type="submit"
                    color="primary"
                    disabled={mutation.isLoading}
                    sx={{
                      width: 144,
                      height: 55,
                      fontSize: 20,
                      color: "#fff",
                    }}
                  >
                    Done
                  </Button>
                </>
              )}
            </Observer>
          </Box>
        </Box>
      </form>
    );
  }
);
