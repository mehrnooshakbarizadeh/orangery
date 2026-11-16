// contexts & globals
import { useGlobalState } from "../../../../../Contexts & Globals/GlobalContext";

// react & next
import React from "react";

// external dependencies
import {
  Box,
  Button,
  Typography,
  Divider,
} from "@mui/material";
import { makeAutoObservable } from "mobx";
import { Observer } from "mobx-react-lite";

// orangery elements & internal dependencies
import {
  FieldError,
  FormError,
  ValueState,
  ArrayValueState,
} from "../../../../../states/mobx-form";
// import DeleteDoorAccessButton from "./DeleteDoorAccessButton";
import {
  OrangeryToast,
  OrangeryCoworkerAutocomplete2,
  OrangeryLocksAutocomplete,
  OrangeryCloseButton,
} from "../../../../OrangeryElements";

// queries & backend
import { IDoorAccess, useInsertDoorAccess } from "../../../../../queries/apps/saltoKs";

// icons, images & colors
import SearchIcon from "../../../../../assets/svg/search.svg";
import { globalState } from "mobx/dist/internal";
import OrangeryLocksSelector from "../../../../OrangeryElements/OrangeryLocksSelector";

export class DoorAccessFormState {
  public user_uuid;
  public lock_ids;
  public remove_lock_ids;

  public error = "";

  constructor(doorAccess?: IDoorAccess) {
    this.remove_lock_ids = new ArrayValueState([] as string[]);
    if (doorAccess) {
      this.user_uuid = new ValueState(doorAccess.uuid);
      this.lock_ids = new ArrayValueState(
        doorAccess.door_accesses.map((doorAccess) => doorAccess.lock_id)
      );
    } else {
      this.user_uuid = new ValueState("");
      this.lock_ids = new ArrayValueState([]);
    }

    makeAutoObservable(this);
  }

  get data() {
    return {
      user_uuid: this.user_uuid.value,
      lock_ids: this.lock_ids.values.map((v) => v.value),
      remove_lock_ids: this.remove_lock_ids.values.map((v) => v.value),
    };
  }

  clearErrors() {
    this.user_uuid.clearError();
    this.lock_ids.clearError();
    this.remove_lock_ids.clearError();

    this.error = "";
  }

  validate() {
    let valid = true;
    this.clearErrors();
    if (!this.user_uuid.value) {
      this.user_uuid.error = "Please select user";
      valid = false;
    }
    // if (this.lock_ids.values.length === 0) {
    //   this.lock_ids.error = "Please select at least one lock";
    //   valid = false;
    // }
    return valid;
  }

  setupErrors(err: FormError) {
    this.clearErrors();
    err.errors.forEach((error) => this.setupError(error));
  }

  setupError(error: FieldError) {
    if (error.field === "") {
      this.error = error.error;
    } else if (error.field === "user_uuid") {
      this.user_uuid.error = error.error;
    } else if (error.field === "lock_ids") {
      this.lock_ids.error = error.error;
    } else {
      // console.warn(
      //   `the field ${error.field} not found in the field list in DoorAccessForm.`
      // );
    }
  }
}

export default function DoorAccessForm({
  doorAccess,
  handleClose,
  noCancel,
}: {
  doorAccess?: IDoorAccess;
  handleClose: () => void;
  noCancel?: any;
}) {
  const mutation = useInsertDoorAccess();
  const state = React.useMemo(() => new DoorAccessFormState(doorAccess), [doorAccess]);

  const { currentUser } = useGlobalState();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!state.validate()) {
      return;
    }
    try {
      await mutation.mutateAsync(state.data);
      handleClose();
      OrangeryToast(`Successfully ${doorAccess ? "edited" : "created"}.`, "success");
    } catch (err: any) {
      state.setupErrors(err);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        height: "100%",
        position: "relative",
      }}
    >
      <OrangeryCloseButton onClose={handleClose} />
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
              borderBottom: "1px solid #EDEEF0",
            }}
          >
            <Typography
              sx={{
                flexGrow: 1,
                fontSize: 24,
                fontWeight: 600
              }}
            >
              {`${doorAccess ? "" : ""}Door Access`}
            </Typography>
          </Box>
        )}
      </Observer>

      <Observer>
        {() => (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              py: 1,
              pl: 4,
              pr: 2,
              mr: 2,
              rowGap: 2,
              mb: 2,
              pb: 2,
              overflowY: "auto",
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
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: {
                  xs: "column",
                  sm: "row",
                },
                gap: 2,
              }}
            >
              <Box sx={{
                flexBasis: "100%",
                maxWidth: "320px",
                display: "flex",
                felxDirextion: "column",
                gap: 0
              }}>
                <OrangeryCoworkerAutocomplete2
                  preUsers={[currentUser]}
                  labelsWithEmail
                  withoutVisitors
                  label="Users"
                  name="user_uuid"
                  error={!!state.user_uuid.error}
                  helperText={state.user_uuid.error}
                  placeholder="Search User"
                  icon={<SearchIcon />}
                  value={state.user_uuid.value}
                  onChange={(newValue) => {
                    state.user_uuid.value = newValue;
                  }}
                />
              </Box>
            </Box>

            <Divider />

            <Box
              sx={{
                display: "flex",
                flexDirection: {
                  xs: "column",
                  sm: "row",
                },
                gap: 2,
              }}
            >
              <Box sx={{ flexBasis: "100%" }}>
                <OrangeryLocksSelector
                  values={state.lock_ids.values.map(
                    (e) => e.value
                  )}
                  initialValues={
                    doorAccess?.door_accesses.map((doorAccess) => doorAccess.lock_id) ?? [] as string[]
                  }
                  onChange={(newValues) => {
                    // state.lock_ids = new ArrayValueState(newValues)
                    newValues.forEach((e) => {
                      const i = state.lock_ids.values.findIndex((v) => v.value === e);
                      if (i === -1) {
                        state.lock_ids.pushElementValue(e);
                      }
                    });
                    state.lock_ids.values.forEach((v, j) => {
                      const i = newValues.findIndex((e) => v.value === e);
                      if (i === -1) {
                        state.lock_ids.deleteElementValue(j);
                        state.remove_lock_ids.pushElementValue(v.value);
                      }
                    });

                    state.remove_lock_ids.values.forEach((v, j) => {
                      const i = state.lock_ids.values.findIndex((e) => e.value === v.value);
                      if (i !== -1) {
                        state.remove_lock_ids.deleteElementValue(j);
                      }
                    });
                  }}
                />
              </Box>
            </Box>
          </Box>
        )}
      </Observer>

      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-end",
          alignItems: "center",
          px: 3,
          pb: 3,
        }}
      >
        {/* {!noRemove && !doorAccess?.tenant_office_uuid &&
          <Box sx={{ flexGrow: 1 }}>
            {doorAccess && (
              <DeleteDoorAccessButton
                handleCloseForm={handleClose}
                doorAccess={doorAccess}
                label="Remove"
                sx={{ color: "red" }}
              />
            )}
          </Box>
        } */}
        <Observer>
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
                {doorAccess ? "Save" : "Create"}
              </Button>
            </>
          )}
        </Observer>
      </Box>
    </form>
  );
}
