// contexts & globals
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
import CrossIcon from "../../../assets/svg/cross.svg";
import EuroIcon from "../../../assets/svg/euro.svg";
import { makeAutoObservable } from "mobx";
import { observer, Observer } from "mobx-react-lite";
import NumberFormat from "react-number-format";

// orangery elements & internal dependencies
import {
  FieldError,
  FormError,
  ValueState,
  ArrayValueState,
} from "../../../states/mobx-form";
import DeleteDeskButton from "./DeleteDeskButton";
import {
  OrangeryTextField,
  OrangerySwitch,
  OrangeryEmployeesAutocomplete,
  OrangeryFloorAutocomplete,
  OrangeryFormWrapper,
  OrangeryCoworkerAutocomplete,
  OrangeryDepartmentAutocomplete
} from "../../OrangeryElements";
import { OrangeryToast } from "../../OrangeryElements";

// queries & backend
import { IDesk, useUpsertDesk } from "../../../queries/desk";

// icons, images & colors
import CapacityIcon from "../../../assets/svg/capacity.svg";
import DeskIcon from "../../../assets/svg/dashboard/newMenuSVGs/desk.svg";
import CustomizedSwitches from "../../OrangeryElements/CustomizedSwitches";
import { SortState } from "./DesksList";
import SearchIcon from "../../../assets/svg/search.svg";

export class DeskState {
  public uuid;
  public name;
  public assigned_user_uuids;
  public flex;
  public active;
  public public;
  public price;
  public is_physical;
  public department_uuid;
  public capacity;
  public floor_uuid;
  public office_uuid;
  public error = "";

  constructor(office_uuid: string, desk?: IDesk) {
    this.office_uuid = new ValueState(office_uuid);
    if (desk) {
      this.name = new ValueState(desk.name);
      this.uuid = new ValueState(desk.uuid);
      this.assigned_user_uuids = new ArrayValueState(
        desk.assigned_users?.map((au) => au.uuid)
      );
      this.flex = new ValueState(desk.flex);
      this.active = new ValueState(desk.active);
      this.public = new ValueState(desk.public);
      this.is_physical = new ValueState(!desk.is_physical);
      this.price = new ValueState(desk.price);
      this.department_uuid = new ValueState(desk.department_obj?.uuid);
      this.capacity = new ValueState(desk.capacity);
      this.floor_uuid = new ValueState(desk.assigned_floor?.uuid ?? "");
    } else {
      this.name = new ValueState("");
      this.uuid = new ValueState("");
      this.assigned_user_uuids = new ArrayValueState([] as string[]);
      this.flex = new ValueState(false);
      this.active = new ValueState(true);
      this.public = new ValueState(true);
      this.price = new ValueState(0);
      this.is_physical = new ValueState(false);
      this.department_uuid = new ValueState("");
      this.capacity = new ValueState(0);
      this.floor_uuid = new ValueState("");
    }

    makeAutoObservable(this);
  }

  get data() {
    return {
      uuid: this.uuid.value,
      name: this.name.value,
      assigned_user_uuids: this.assigned_user_uuids.values.map((v) => v.value),
      flex: this.flex.value,
      active: this.active.value,
      public: this.public.value,
      is_physical: !this.is_physical.value,
      department_uuid: this.department_uuid.value,
      capacity: this.capacity.value,
      price: this.price.value,
      floor_uuid: this.floor_uuid.value,
      office_uuid: this.office_uuid.value,
    };
  }

  clearErrors() {
    this.name.clearError();
    this.assigned_user_uuids.clearError();
    this.flex.clearError();
    this.active.clearError();
    this.public.clearError();
    this.price.clearError();
    this.is_physical.clearError();
    this.department_uuid.clearError();
    this.capacity.clearError();
    this.floor_uuid.clearError();
    this.error = "";
  }

  validate() {
    let valid = true;
    this.clearErrors();
    if (!this.name.value) {
      this.name.error = "Please fill your desk name";
      valid = false;
    }
    return valid;
  }

  setupErrors(err: FormError) {
    this.clearErrors();
    err.errors?.forEach((error) => this.setupError(error));
  }

  setupError(error: FieldError) {
    if (error.field === "") {
      this.error = error.error;
    } else if (error.field === "name") {
      this.name.error = error.error;
    } else if (error.field === "assigned_user_uuids") {
      this.assigned_user_uuids.error = error.error;
    } else if (error.field === "flex") {
      this.flex.error = error.error;
    } else if (error.field === "price") {
      this.price.error = error.error;
    } else if (error.field === "active") {
      this.active.error = error.error;
    } else if (error.field === "public") {
      this.public.error = error.error;
    } else if (error.field === "department_uuid") {
      this.department_uuid.error = error.error;
    } else if (error.field === "capacity") {
      this.capacity.error = error.error;
    } else if (error.field === "floor_uuid") {
      this.floor_uuid.error = error.error;
    } else {
      // console.warn(
      //   `the field ${error.field} not found in the field list in DeskForm.`
      // );
    }
  }
}

export const DeskForm = observer(
  ({
    desk,
    handleClose,
    noCancel,
    noRemove,
  }: {
    desk?: IDesk;
    handleClose: () => void;
    noCancel?: any;
    noRemove?: any;
  }) => {
    const { office_uuid } = useGlobalState();
    const mutation = useUpsertDesk();
    const state = React.useMemo(
      () => new DeskState(office_uuid, desk),
      [office_uuid, desk]
    );

    async function handleSubmit(e: React.FormEvent) {
      e.preventDefault();
      if (!state.validate()) {
        return;
      }
      try {
        await mutation.mutateAsync(state.data);
        handleClose();
        if (desk) {
          OrangeryToast("Successfully edited " + state.data.name, "success");
        } else {
          OrangeryToast("Successfully created " + state.data.name, "success");
        }
      } catch (err: any) {
        state.setupErrors(err);
      }
    }
    return (
      <OrangeryFormWrapper
        onSubmit={handleSubmit}
        onClose={handleClose}
        title={`${desk ? "Edit" : "Create"} Desk`}
        withBorder
        // style={{
        //   width: 601,
        //   height: 395
        // }}
        footer={
          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              alignItems: "center",
              width: "100%",
            }}
          >
            <Observer>
              {() => (
                <>
                  {!noRemove && !desk?.tenant_office_uuid && (
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
                  )}
                </>
              )}
            </Observer>

            <Observer>
              {() => (
                <>
                  {!noCancel && (
                    <Button
                      color="primary"
                      onClick={handleClose}
                      sx={{
                        width: 144,
                        height: 55,
                        fontSize: 20,
                        color: "black",
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
                      width: 144,
                      height: 55,
                      fontSize: 20,
                      color: "#fff",
                    }}
                  >
                    {desk ? "Save" : "Create"}
                  </Button>
                </>
              )}
            </Observer>
          </Box>
        }
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "end",
            height: "406px",
            width: "100%",
          }}
        >
          <Observer>
            {() => (
              <>
                <Box sx={{ width: "70%" }}>
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      flexGrow: 1,
                      mr: 1,
                      height: "100%",
                      overflow: "auto",
                      width: "100%",
                      gap: 2,
                      py: 5,
                      px: 5,
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
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                      <Box sx={{ width: "33%" }}>
                        <OrangeryTextField
                          label="NAME"
                          name="name"
                          startIcon={<DeskIcon />}
                          placeholder="Desk Name"
                          error={!!state.name.error}
                          value={state.name.value}
                          helperText={state.name.error}
                          onChange={(e: any) =>
                            (state.name.value = e.target.value)
                          }
                        />
                      </Box>

                      <Box sx={{ width: "33%" }}>
                        <OrangeryFloorAutocomplete
                          label="FLOOR"
                          placeholder="Choose/Create Floor"
                          value={state.floor_uuid.value}
                          onChange={(newValue) => {
                            state.floor_uuid.value = newValue;
                          }}
                        />
                      </Box>

                      <Box sx={{ width: "33%" }}>
                        <OrangeryDepartmentAutocomplete
                          label="DEPARTMENT"
                          placeholder="Select/Create Department"
                          value={state.department_uuid.value}
                          onChange={(newValue) => {
                            state.department_uuid.value = newValue;
                          }}
                        />
                      </Box>
                    </Box>

                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 2,
                        justifyContent: "start",
                      }}
                    >
                      <Box sx={{ width: "32%", height: "85px" }}>
                        <NumberFormat
                          customInput={TextField}
                          label="CAPACITY"
                          InputProps={{
                            startAdornment: (
                              <InputAdornment
                                position="start"
                                sx={{
                                  "& .stock-icon": {
                                    width: "1.3rem",
                                    color: "grey.A200",
                                  },
                                }}
                              >
                                <CapacityIcon className="stock-icon" />
                              </InputAdornment>
                            ),
                          }}
                          type="text"
                          allowNegative={false}
                          value={state.capacity.value?.toString()}
                          error={!!state.capacity.error}
                          helperText={state.capacity.error}
                          onChange={(e: any) =>
                            (state.capacity.value = parseInt(e.target.value))
                          }
                          sx={{ width: "100%" }}
                        />
                      </Box>
                      <Box sx={{ width: "32%", height: "85px" }}>
                        <Observer>
                          {() => (
                            <NumberFormat
                              thousandsGroupStyle="wan"
                              fixedDecimalScale={true}
                              value={state.price.value?.toString()}
                              // prefix="$"
                              decimalSeparator="."
                              customInput={TextField}
                              fullWidth
                              label="PRICE"
                              InputProps={{
                                startAdornment: (
                                  <InputAdornment
                                    position="start"
                                    sx={{
                                      "& .euro-icon": { width: "0.75rem" },
                                    }}
                                  >
                                    <EuroIcon className="euro-icon" />
                                  </InputAdornment>
                                ),
                              }}
                              type="text"
                              thousandSeparator={false}
                              allowNegative={false}
                              decimalScale={2}
                              error={!!state.price.error}
                              // helperText={state.price.error}
                              onChange={(e: any) =>
                                (state.price.value = parseFloat(e.target.value))
                              }
                              sx={{ width: "100%" }}
                            />
                          )}
                        </Observer>
                      </Box>
                    </Box>

                    <Box>
                      <OrangeryEmployeesAutocomplete
                        withoutVisitors
                        withCoworker
                        label="COWORKER"
                        value={state.assigned_user_uuids.values.map(
                          (e) => e.value
                        )}
                        onChange={(newValues) => {
                          newValues.forEach((e) => {
                            const i =
                              state.assigned_user_uuids.values.findIndex(
                                (v) => v.value === e
                              );
                            if (i === -1) {
                              state.assigned_user_uuids.pushElementValue(e);
                            }
                          });
                          state.assigned_user_uuids.values.forEach((v, j) => {
                            const i = newValues.findIndex((e) => v.value === e);
                            if (i === -1) {
                              state.assigned_user_uuids.deleteElementValue(j);
                            }
                          });
                        }}
                      />
                      {/* <OrangeryCoworkerAutocomplete
                        withoutVisitors
                        label=""
                        name="user_uuid"
                        error={!!state.name.error}
                        helperText={state.name.error}
                        placeholder="Search for customer..."
                        icon={<SearchIcon />}
                        value={state.employee_uuid.value}
                        onChange={(newValue) => {
                          state.employee_uuid.value = newValue;
                        }}
                      /> */}
                    </Box>
                  </Box>
                </Box>
              </>
            )}
          </Observer>

          <Observer>
            {() => (
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 2,
                  width: "359px",
                  height: "406px",
                  backgroundColor: "#F7F8FA",
                  p: 3,
                }}
              >
                <OrangerySwitch
                  label={{
                    checked: "Bookable for all",
                    unchecked: "Bookable for all",
                  }}
                  checked={state.public.value}
                  onChange={(e) => (state.public.value = e.target.checked)}
                />
                {!desk?.tenant_office_uuid && (
                  <OrangerySwitch
                    label={{
                      checked: "Ready to use",
                      unchecked: "Ready to use",
                    }}
                    checked={state.active.value}
                    onChange={(e) => (state.active.value = e.target.checked)}
                  />
                )}
                <OrangerySwitch
                  label={{
                    checked: "Desk is flex",
                    unchecked: "Desk is flex",
                  }}
                  checked={state.flex.value}
                  onChange={(e) => (state.flex.value = e.target.checked)}
                />
                <OrangerySwitch
                  label={{
                    checked: "Desk is Virtual",
                    unchecked: "Desk is Virtual",
                  }}
                  checked={state.is_physical.value ? true : false}
                  onChange={(e) => (state.is_physical.value = e.target.checked)}
                />
              </Box>
            )}
          </Observer>
        </Box>
      </OrangeryFormWrapper>
    );
  }
);
