// contexts & globals
import { useGlobalState } from "../../../../Contexts & Globals/GlobalContext";

// react & next
import React from "react";

// external dependencies
import { Box, Button, } from "@mui/material";
import { makeAutoObservable } from "mobx";
import { Observer } from "mobx-react-lite";

// orangery elements & internal dependencies
import { ArrayValueState, FieldError, FormError, ValueState } from "../../../../states/mobx-form";
import DeleteServicePartnerButton from "./DeleteServicePartnerButton";
import {
  OrangeryToast,
  OrangeryTextField,
  OrangerySwitch,
  OrangeryTextAreaField,
  OrangeryFormWrapper,
} from "../../../OrangeryElements";
// queries & backend
import { IServicePartner, useUpsertServicePartner } from "../../../../queries/servicePartners";
// icons, images & colors

export class ServicePartnerState {
  public uuid;
  public name;
  public description;
  public category;
  public active;
  public email;
  public error = "";

  constructor(servicePartner?: IServicePartner) {
    if (servicePartner) {
      this.uuid = new ValueState(servicePartner.uuid);
      this.name = new ValueState(servicePartner.name);
      this.description = new ValueState(servicePartner.description);
      this.active = new ValueState(servicePartner.active);
      this.category = new ValueState(servicePartner.category);
      this.email = new ValueState(servicePartner.email);
    } else {
      this.uuid = new ValueState("");
      this.name = new ValueState("");
      this.active = new ValueState(true);
      this.description = new ValueState("");
      this.category = new ValueState("");
      this.email = new ValueState("");
    }
    makeAutoObservable(this);
  }

  get data() {
    return {
      uuid: this.uuid.value,
      name: this.name.value,
      description: this.description.value,
      category: this.category.value,
      active: this.active.value,
      email: this.email.value,
    };
  }

  clearErrors() {
    this.name.clearError();
    this.active.clearError();
    this.category.clearError();
    this.description.clearError();
    this.email.clearError();
    this.error = "";
  }

  validate() {
    let valid = true;
    this.clearErrors();
    if (!this.name.value) {
      this.name.error = "Please fill your service partner name";
      valid = false;
    }
    if (!this.description.value) {
      this.description.error = "Please fill your service partner description";
      valid = false;
    }
    if (!this.email.value) {
      this.email.error = "Please fill your service partner email";
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
    } else if (error.field === "active") {
      this.active.error = error.error;
    } else if (error.field === "description") {
      this.description.error = error.error;
    } else if (error.field === "email") {
      this.email.error = error.error;
    } else if (error.field === "category") {
      this.category.error = error.error;
    } else {
      // console.warn(
      //   `the field ${error.field} not found in the field list in DeskForm.`
      // );
    }
  }
}

export default function ServicePartnerForm({
  servicePartner,
  handleClose,
  noCancel,
  noRemove,
}: {
  servicePartner?: IServicePartner;
  handleClose: () => void;
  noCancel?: any;
  noRemove?: any;
}) {
  const mutation = useUpsertServicePartner();
  const state = React.useMemo(
    () => new ServicePartnerState(servicePartner),
    [servicePartner]
  );

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!state.validate()) {
      return;
    }
    try {
      await mutation.mutateAsync(state.data);
      handleClose();
      if (servicePartner) {
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
      title={`${servicePartner ? "Edit" : "Add a"} Service Partner`}
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
          {servicePartner?.uuid && (
            <Box sx={{ flexGrow: 1 }}>
              <Observer>
                {() => (
                  <>
                    {servicePartner && (
                      <DeleteServicePartnerButton
                        handleCloseForm={handleClose}
                        servicePartner={servicePartner}
                        label="Remove"
                        sx={{ color: "red" }}
                      />
                    )}
                  </>
                )}
              </Observer>
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
                      color: "#000",
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
                  {servicePartner ? "Save" : "Create"}
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
          height: "490px",
          width: "100%",
        }}
      >
        <Observer>
          {() => (
            <>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  flexGrow: 1,
                  height: "100%",
                  overflow: "auto",
                  pt: 4,
                  px: 4,
                  rowGap: 1,
                  width: "904px",
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

                <Box sx={{ width: "100%" }}>
                  <Observer>
                    {() => (
                      <OrangeryTextField
                        label="Service Partner Name *"
                        name="name"
                        placeholder="Enter Service Partner Name"
                        error={!!state.name.error}
                        value={state.name.value}
                        helperText={state.name.error}
                        onChange={(e: any) => (state.name.value = e.target.value)}
                      />
                    )}
                  </Observer>
                </Box>
                <Box sx={{ width: "100%", mb: 10 }}>
                  <Observer>
                    {() => (
                      <OrangeryTextAreaField
                        sx={{
                          height: "80px",
                          mb: 3,
                        }}
                        editorHeight="120px"
                        label="Service Partner Description *"
                        name="description"
                        multiline
                        placeholder="Write something about the Service Partner"
                        error={!!state.description.error}
                        value={state.description.value}
                        helperText={state.description.error}
                        onChange={(e: any) => (state.description.value = e.target.value)}
                      />
                    )}
                  </Observer>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', columnGap: 2, width: '100%' }}>
                  <Observer>
                    {() => (
                      <OrangeryTextField
                        label="Email Address"
                        name="email"
                        type="email"
                        placeholder="Enter Email Address"
                        error={!!state.email.error}
                        value={state.email.value}
                        helperText={state.email.error}
                        onChange={(e: any) => (state.email.value = e.target.value)}
                      />
                    )}
                  </Observer>

                  <Observer>
                    {() => (
                      <OrangeryTextField
                        label="Service Partner Category"
                        name="category"
                        placeholder="Enter Category of the Service"
                        error={!!state.category.error}
                        value={state.category.value}
                        helperText={state.category.error}
                        onChange={(e: any) => (state.category.value = e.target.value)}
                      />
                    )}
                  </Observer>
                </Box>
              </Box>
            </>
          )}
        </Observer>

        <Observer>
          {() => (
            <>
              <Box
                sx={{
                  width: "359px",
                  height: "490px",
                  backgroundColor: "#F7F8FA",
                  p: 2,
                  display: "flex",
                  flexDirection: "column",
                  gap: 2,
                }}
              >
                <OrangerySwitch
                  label={{
                    checked: "Enable",
                    unchecked: "Enable",
                  }}
                  checked={state.active.value}
                  onChange={(e) => (state.active.value = e.target.checked)}
                />
              </Box>
            </>
          )}
        </Observer>
      </Box>
    </OrangeryFormWrapper>
  );
}
