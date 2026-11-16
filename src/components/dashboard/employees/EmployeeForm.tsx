// contexts & globals
import { useGlobalState } from "../../../Contexts & Globals/GlobalContext";

// react & next
import React from "react";

// external dependencies
import {
  Box,
  Button,
  Typography,
} from "@mui/material";
import { makeAutoObservable } from "mobx";
import { observer, Observer } from "mobx-react-lite";
import Can from "../../../services/can";

// orangery elements & internal dependencies
import { FieldError, FormError, ValueState } from "../../../states/mobx-form";

// import MuiPhoneNumber from "mui-phone-number";
import PhoneInput from "react-phone-input-2";

// import "react-phone-input-2/lib/style.css";
import "react-phone-input-2/lib/bootstrap.css";
import {
  OrangeryToast,
  OrangeryTextField,
  OrangeryFormWrapper,
} from "../../OrangeryElements";
import RoleAutocomplete from "./RoleAutocomplete";
import DeleteEmployeeButton from "./DeleteEmployeeBtn";
import WhatAreRolesButton from "./WhatAreRolesButton";

// queries & backend
import { IEmployee, useUpsertEmployee } from "../../../queries/employee";

// icons, images & colors
import UserIcon from "../../../assets/svg/user.svg";
import EmailIcon from "../../../assets/svg/email.svg";
import AddressIcon from "../../../assets/svg/address-card-light.svg";

export class EmployeeState {
  public uuid;
  public first_name;
  public last_name;
  public email;
  public phone;
  public address;
  public group_uuid;
  public office_uuid;
  public error = "";

  constructor(office_uuid: string, employee?: IEmployee) {
    this.office_uuid = new ValueState(office_uuid);
    if (employee) {
      this.uuid = new ValueState(employee.uuid);
      this.first_name = new ValueState(employee.first_name);
      this.last_name = new ValueState(employee.last_name);
      this.email = new ValueState(employee.email);
      this.phone = new ValueState(employee.phone);
      this.address = new ValueState(employee.address ?? "");
      this.group_uuid = new ValueState(employee.group.uuid);
    } else {
      this.uuid = new ValueState("");
      this.first_name = new ValueState("");
      this.last_name = new ValueState("");
      this.email = new ValueState("");
      this.phone = new ValueState("");
      this.address = new ValueState("");
      this.group_uuid = new ValueState("");
    }

    makeAutoObservable(this);
  }

  get data() {
    return {
      uuid: this.uuid.value,
      first_name: this.first_name.value,
      last_name: this.last_name.value,
      email: this.email.value,
      phone: this.phone.value,
      address: this.address.value,
      group_uuid: this.group_uuid.value,
      office_uuid: this.office_uuid.value,
    };
  }

  clearErrors() {
    this.uuid.error = "";
    this.first_name.error = "";
    this.last_name.error = "";
    this.email.error = "";
    this.phone.error = "";
    this.address.error = "";
    this.group_uuid.error = "";
    this.office_uuid.error = "";
    this.error = "";
  }

  validate() {
    let valid = true;
    this.clearErrors();
    if (!this.first_name.value) {
      this.first_name.error = "Please fill your employee first name";
      valid = false;
    }
    if (!this.last_name.value) {
      this.last_name.error = "Please fill your employee last name";
      valid = false;
    }
    if (!this.email.value) {
      this.email.error = "Please fill your employee email";
      valid = false;
    }
    if (!this.group_uuid.value) {
      this.group_uuid.error = "Please fill your employee group_uuid";
      valid = false;
    }
    if (!this.office_uuid.value) {
      this.office_uuid.error = "Please select the office";
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
    }
    if (error.field === "first_name") {
      this.first_name.error = error.error;
    }
    if (error.field === "last_name") {
      this.last_name.error = error.error;
    }
    if (error.field === "email") {
      this.email.error = error.error;
    }
    if (error.field === "address") {
      this.address.error = error.error;
    }
    if (error.field === "group_uuid") {
      this.group_uuid.error = error.error;
    }
  }
}

export const EmployeeForm = observer(
  ({
    employee,
    handleClose,
    noCancel,
    noRemove,
    updateDashboard,
  }: {
    employee?: IEmployee;
    handleClose: () => void;
    noCancel?: any;
    noRemove?: any;
    updateDashboard?: boolean;
  }) => {
    const { office_uuid } = useGlobalState();
    const mutation = useUpsertEmployee();
    const state = React.useMemo(
      () => new EmployeeState(office_uuid, employee),
      [office_uuid, employee]
    );
    const globalState = useGlobalState();

    async function handleSubmit(e: React.FormEvent) {
      e.preventDefault();
      if (!state.validate()) {
        return;
      }
      try {
        await mutation.mutateAsync({ ...state.data, updateDashboard });
        handleClose();
        if (employee) {
          OrangeryToast(
            "Successfully edited " + state.data.first_name,
            "success"
          );
        } else {
          OrangeryToast(
            "Successfully created " + state.data.last_name,
            "success"
          );
        }
      } catch (err: any) {
        state.setupErrors(err);
      }
    }
    return (
      <OrangeryFormWrapper
        onSubmit={handleSubmit}
        onClose={handleClose}
        title={`${employee ? "Edit" : "Add"} Employee`}
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
            {!noRemove && (
              <Box sx={{ flexGrow: 1 }}>
                {employee && (
                  <DeleteEmployeeButton
                    handleCloseForm={handleClose}
                    employee={employee}
                    label="Remove"
                    sx={{ color: "red" }}
                  />
                )}
              </Box>
            )}
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
                        color: "#2B2E33",
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
                    {employee ? "Save" : "Create"}
                  </Button>
                </>
              )}
            </Observer>
          </Box>
        }
      >
        <Observer>
          {() => (
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                pt: 4,
                pb: 9,
                px: 4,
                rowGap: 1,
                // mb: 2,
                width: "100%",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  justifyContent: "start",
                }}
              >
                <Box sx={{ flex: "0 1 auto", width: "23%" }}>
                  <Observer>
                    {() => (
                      <OrangeryTextField
                        type="text"
                        label="FIRST NAME"
                        name="first_name"
                        placeholder="Type User Name"
                        autoComplete="given-name"
                        value={state.first_name.value}
                        error={!!state.first_name.error}
                        helperText={state.first_name.error}
                        onChange={(e) =>
                          (state.first_name.value = e.target.value)
                        }
                        startIcon={<UserIcon />}
                      />
                    )}
                  </Observer>
                </Box>

                <Box sx={{ flex: "0 1 auto", width: "23%" }}>
                  <Observer>
                    {() => (
                      <OrangeryTextField
                        type="text"
                        label="LAST NAME"
                        name="last_name"
                        autoComplete="given-name"
                        placeholder="Type Last Name"
                        value={state.last_name.value}
                        error={!!state.last_name.error}
                        helperText={state.last_name.error}
                        onChange={(e) =>
                          (state.last_name.value = e.target.value)
                        }
                        startIcon={<UserIcon />}
                      />
                    )}
                  </Observer>
                </Box>

                <Box sx={{ flex: "0 1 auto", width: "23%" }}>
                  <Observer>
                    {() => (
                      <OrangeryTextField
                        type="email"
                        label="EMAIL"
                        name="email"
                        autoComplete="email"
                        placeholder="Type Email"
                        value={state.email.value}
                        error={!!state.email.error}
                        helperText={state.email.error}
                        onChange={(e) => (state.email.value = e.target.value)}
                        startIcon={<EmailIcon />}
                      />
                    )}
                  </Observer>
                </Box>

                <Box sx={{ flex: "0 1 auto", width: "23%" }}>
                  <Observer>
                    {() => (
                      <RoleAutocomplete
                        label="ROLE"
                        name="group_uuid"
                        error={!!state.group_uuid.error}
                        helperText={state.group_uuid.error}
                        placeholder="Select Role..."
                        value={state.group_uuid.value}
                        onChange={(newValue) => {
                          state.group_uuid.value = newValue;
                        }}
                      />
                    )}
                  </Observer>
                </Box>
              </Box>

              <Box
                sx={{
                  display: "flex",
                  alignItems: "start",
                  flexDirection: "column",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    width: "94%",
                  }}
                >
                  <Box
                    sx={{
                      flex: "0.5 1 auto",
                      width: "20%",
                      height: "85px",
                      position: "relative",
                    }}
                  >
                    <Observer>
                      {() => (
                        <PhonSelector
                          value={state.phone.value}
                          onChange={(value) => (state.phone.value = value)}
                        />
                      )}
                    </Observer>
                  </Box>
                  <Box sx={{ flex: "1 1 auto", width: "66%" }}>
                    <Observer>
                      {() => (
                        <OrangeryTextField
                          type="address"
                          label="ADDRESS"
                          name="address"
                          autoComplete="address"
                          placeholder="Type Address"
                          value={state.address.value}
                          error={!!state.address.error}
                          helperText={state.address.error}
                          onChange={(e) =>
                            (state.address.value = e.target.value)
                          }
                          startIcon={<AddressIcon />}
                        />
                      )}
                    </Observer>
                  </Box>
                </Box>
                <Can I="view" a={"WhatAreRolesButton" ?? "null"}>
                  <WhatAreRolesButton />
                </Can>
              </Box>
            </Box>
          )}
        </Observer>
      </OrangeryFormWrapper>
    );
  }
);

function PhonSelector({
  onChange,
  value,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  const handlePhone = (phone: string) => {
    return onChange(`+${phone}`);
  };

  return (
    <>
      <Box
        sx={{
          position: "relative",
          "& .react-tel-input .country-list": {
            width: "274px",
            mt: "4px",
          },
          "& .react-tel-input .form-control": {
            width: "100%",
            py: "17px",
            pl: "60px",
            pr: "14px",
          },
        }}
      >
        <Typography
          sx={{
            fontSize: "12px",
            fontWeight: "400",
            position: "absolute",
            top: "-9px",
            left: "13px",
            zIndex: "999",
            backgroundColor: "white",
          }}
        >
          PHONE NUMBER
        </Typography>
        <PhoneInput
          country={"de"}
          autoFormat={true}
          enableSearch={true}
          value={value}
          onChange={(value: any) => handlePhone(value)}
        />
      </Box>
    </>
  );
}
