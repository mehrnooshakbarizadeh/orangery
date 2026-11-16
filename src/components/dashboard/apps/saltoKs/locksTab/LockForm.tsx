// contexts & globals
// import { useGlobalState } from "../../../../../Contexts & Globals/GlobalContext";

// react & next
import React from "react";

// external dependencies
import {
  Box,
  Button,
  Typography,
  IconButton,
} from "@mui/material";
import { makeAutoObservable } from "mobx";
import { Observer } from "mobx-react-lite";
import CrossIcon from "../../../../../assets/svg/cross.svg";

// 
import {
  OrangeryToast,
  OrangeryOfficeAutocomplete,
} from "../../../../OrangeryElements";
import {
  FieldError,
  FormError,
  ValueState,
} from "../../../../../states/mobx-form";

// 
import {
  ILock,
  useUpdateLock
} from "../../../../../queries/apps/saltoKs";

// icons, images & colors
//

export class LockFormState {
  public lock_name;

  public office_uuid;
  public lock_id;

  public error = "";

  constructor(lock: ILock) {
    this.lock_name = new ValueState(lock.lock_name);

    this.office_uuid = new ValueState(lock.office?.uuid ?? "");
    this.lock_id = new ValueState(lock.lock_id);

    this.office_uuid = new ValueState<string>("");

    makeAutoObservable(this);
  }

  get data() {
    return {
      office_uuid: this.office_uuid.value,
      lock_id: this.lock_id.value,
    };
  }

  clearErrors() {
    this.office_uuid.clearError();

    this.error = "";
  }

  validate() {
    let valid = true;
    this.clearErrors();

    if (!this.office_uuid.value) {
      this.office_uuid.error = "Please select and office";
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
    } else if (error.field === "lock_id") {
      this.lock_id.error = error.error;
    } else if (error.field === "office_uuid") {
      this.office_uuid.error = error.error;
    } else {
      // console.warn(
      //   `the field ${error.field} not found in the field list in DeskForm.`
      // );
    }
  }
}

export default function LockForm({
  lock,
  handleClose,
  noCancel,
  noRemove,
}: {
  lock: ILock;
  handleClose: () => void;
  noCancel?: any;
  noRemove?: any;
}) {
  const mutation = useUpdateLock();
  const state = React.useMemo(
    () => new LockFormState(lock),
    [lock]
  );

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!state.validate()) {
      return;
    }
    try {
      await mutation.mutateAsync(state.data);
      handleClose();

      OrangeryToast("Successfully edited " + state.lock_name.value, "success");
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
                pl: 5,
                py: 5,
                // pb: 1,
                // pt: 2.5,
                display: "flex",
                justifyContent: "end",
                alignItems: "center",
                "& .cross-icon": {
                  width: "1.5rem",
                  height: "1.5rem",
                  color: "#000",
                },
              }}
            >
              <Box sx={{ flexGrow: 1 }}>
                <Typography
                  color="black"
                  fontSize={30}
                  fontWeight={700}
                  sx={{ flexGrow: 1 }}
                >
                  Assign office to lock
                </Typography>
              </Box>
              <IconButton onClick={handleClose}>
                <CrossIcon className="cross-icon" />
              </IconButton>
            </Box>
          )}
        </Observer>
        <Observer>
          {() => (
            <>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  py: 1,
                  px: 5,
                  rowGap: 3,
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "start",
                    gap: 4,
                  }}
                >
                  <Box sx={{ width: "100%" }}>
                    <Box
                      sx={{
                        display: "flex",
                        // alignItems: "center",
                        gap: 1,
                        flexDirection: "column",
                      }}
                    >
                      <Typography variant="h6">LOCK NAME</Typography>
                      <Typography
                        variant="h4"
                        sx={{
                          wordBreak: "break-word"
                        }}
                      >
                        {state.lock_name.value ?? "-"}
                      </Typography>
                    </Box>
                  </Box>

                  <Box sx={{ width: "100%" }}>
                    <OrangeryOfficeAutocomplete
                      label=""
                      error={!!state.office_uuid.error}
                      helperText={state.office_uuid.error}
                      placeholder="Search for office..."
                      // icon={<SearchIcon />}
                      value={state.office_uuid.value}
                      onChange={(newValue) => {
                        state.office_uuid.value = newValue;
                      }}
                    />
                  </Box>
                </Box>
              </Box>
            </>
          )}
        </Observer>

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            px: 3,
            justifyContent: "center",
            gap: 1,
            pb: 3
            // position: "absolute",
            // bottom: "60px",
            // right: "8px",
          }}
        >
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