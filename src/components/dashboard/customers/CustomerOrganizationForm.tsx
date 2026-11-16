// contexts & globals
//

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
import CrossIcon from "../../../assets/svg/cross.svg";
// icons, images & colors
import {
  ICustomerOrganizationInsertParams,
  useInsertCustomerOrganization
} from "../../../queries/customer";
import {
  FieldError,
  FormError,
  ValueState,
} from "../../../states/mobx-form";
import { useGlobalState } from "../../../Contexts & Globals/GlobalContext";
import {
  OrangeryToast,
  OrangeryTextField,
} from "../../OrangeryElements";

export class CustomerOrganizationFormState {
  public office_uuid;

  public company_name;

  public email;
  public uuid;

  public tax_id;

  public error = "";

  constructor(office_uuid: string, customerOrganization: ICustomerOrganizationInsertParams) {
    this.office_uuid = new ValueState(office_uuid);
    this.company_name = new ValueState(customerOrganization.company_name && customerOrganization.company_name !== "-" ? customerOrganization.company_name : "");
    this.email = new ValueState(customerOrganization.email);
    this.uuid = new ValueState(customerOrganization.uuid);
    this.tax_id = new ValueState(customerOrganization.tax_id);

    makeAutoObservable(this);
  }

  get data() {
    return {
      office_uuid: this.office_uuid.value,
      company_name: this.company_name.value,
      email: this.email.value,
      uuid: this.uuid.value,
      tax_id: this.tax_id.value,
    };
  }

  clearErrors() {
    this.office_uuid.clearError();
    this.company_name.clearError();
    this.email.clearError();
    this.uuid.clearError();
    this.tax_id.clearError();

    this.error = "";
  }

  validate() {
    let valid = true;
    this.clearErrors();

    if (!this.company_name.value) {
      this.company_name.error = "Please fill company name";
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
    } else if (error.field === "company_name") {
      this.company_name.error = error.error;
    } else {
      // console.warn(
      //   `the field ${error.field} not found in the field list in DeskForm.`
      // );
    }
  }
}

export default function CustomerOrganizationForm({
  customerOrganization,
  handleClose,
  noCancel,
  noRemove,
}: {
  customerOrganization: ICustomerOrganizationInsertParams;
  handleClose: () => void;
  noCancel?: any;
  noRemove?: any;
}) {
  const { office_uuid } = useGlobalState();
  const mutation = useInsertCustomerOrganization();
  const state = React.useMemo(
    () => new CustomerOrganizationFormState(office_uuid, customerOrganization),
    [office_uuid, customerOrganization]
  );

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!state.validate()) {
      return;
    }
    try {
      await mutation.mutateAsync(state.data);
      handleClose();
      OrangeryToast("Successfully created " + state.data.company_name, "success");
    } catch (err: any) {
      state.setupErrors(err);
    }
  }

  return (
    <form>
      <Box>
        <Observer>
          {() => (
            <Box
              sx={{
                px: 3,
                py: 3,
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
                  fontSize={23}
                  fontWeight={600}
                  sx={{ flexGrow: 1 }}
                >
                  Create Organization
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
                  px: 3,
                  mb: 6
                }}
              >
                <Box sx={{ flexBasis: "100%" }}>
                  <OrangeryTextField
                    label="COMPANY NAME"
                    type="text"
                    name="company_name"
                    placeholder="Enter company name..."
                    fullWidth
                    value={state.company_name.value}
                    error={!!state.company_name.error}
                    helperText={state.company_name.error}
                    onChange={(e) => (state.company_name.value = e.target.value)}
                  />
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
            justifyContent: "space-between",
            gap: 1,
            pb: 3
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
                  // type="submit"
                  color="primary"
                  disabled={mutation.isLoading}
                  onClick={handleSubmit}
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