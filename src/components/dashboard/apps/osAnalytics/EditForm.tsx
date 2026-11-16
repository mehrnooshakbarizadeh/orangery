// contexts & globals
import { useGlobalState } from "../../../../Contexts & Globals/GlobalContext";

// react & next
import React from "react";

// external dependencies
import { Box, Button, Typography, IconButton } from "@mui/material";
import CrossIcon from "../../../../assets/svg/cross.svg";
import { makeAutoObservable } from "mobx";
import { observer, Observer } from "mobx-react-lite";

// orangery elements & internal dependencies
import {
  FieldError,
  FormError,
  ValueState,
} from "../../../../states/mobx-form";

import {
  OrangeryTextField,
  OrangeryToast,
} from "../../../OrangeryElements";

// queries & backend
import { useUpdateOsAnalyticsCard } from "../../../../queries/apps/osAnalytics";

// icons, images & colors
import DeskIcon from "../../../assets/svg/dashboard/newMenuSVGs/desk.svg";

export class EditFormState {
  public name;

  public error = "";

  constructor(office_uuid: string) {
    this.name = new ValueState("");

    makeAutoObservable(this);
  }

  get data() {
    return {
      name: this.name.value,
    };
  }

  clearErrors() {
    // this.name.clearError();

    this.error = "";
  }

  validate() {
    let valid = true;
    this.clearErrors();
    // if (!this.name.value) {
    //   this.name.error = "Please fill your desk name";
    //   valid = false;
    // }
    return valid;
  }

  setupErrors(err: FormError) {
    this.clearErrors();
    err.errors?.forEach((error) => this.setupError(error));
  }

  setupError(error: FieldError) {
    if (error.field === "") {
      this.error = error.error;
      // } else if (error.field === "floor_uuid") {
      //   this.floor_uuid.error = error.error;
    } else {
      // console.warn(
      //   `the field ${error.field} not found in the field list in EditForm.`
      // );
    }
  }
}

const EditForm = observer(({ handleClose }: { handleClose: () => void }) => {
  const { office_uuid } = useGlobalState();
  const mutation = useUpdateOsAnalyticsCard();
  const state = React.useMemo(
    () => new EditFormState(office_uuid),
    [office_uuid]
  );

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!state.validate()) {
      return;
    }
    try {
      await mutation.mutateAsync(state.data);
      handleClose();
      OrangeryToast("Successfully edited.", "success");
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
                py: 3,
                display: "flex",
                justifyContent: "end",
                alignItems: "center",
                borderBottom: "1px solid #E8E9ED",
              }}
            >
              <Typography
                sx={{ fontSize: 24, fontWeight: 600, flexGrow: 1 }}
                color={(theme) => theme.palette.primary.light}
              >
                Edit OS Analytics Card
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

        <Box sx={{ display: "flex", justifyContent: "end" }}>
          <Observer>
            {() => (
              <>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    flexGrow: 1,
                    gap: 3,
                    py: 5,
                    px: 5,
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <Box sx={{ width: "100%" }}>
                      <OrangeryTextField
                        label="NAME"
                        name="name"
                        startIcon={<DeskIcon />}
                        placeholder="Name"
                        error={!!state.name.error}
                        value={state.name.value}
                        helperText={state.name.error}
                        onChange={(e: any) =>
                          (state.name.value = e.target.value)
                        }
                      />
                    </Box>
                  </Box>
                </Box>
              </>
            )}
          </Observer>
        </Box>

        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "center",
            px: 3,
            pt: 2,
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
                    color: "black",
                    backgroundColor: "white",
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
                  Save
                </Button>
              </>
            )}
          </Observer>
        </Box>
      </Box>
    </form>
  );
});

export default EditForm;
