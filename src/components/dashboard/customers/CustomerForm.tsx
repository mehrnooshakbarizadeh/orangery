// contexts & globals
import { useGlobalState } from "../../../Contexts & Globals/GlobalContext";

// react & next
import React from "react";

// external dependencies
import { Box, Button, IconButton, TextField, Typography } from "@mui/material";
import { makeAutoObservable } from "mobx";
import { Observer } from "mobx-react-lite";
import CrossIcon from "../../../assets/svg/cross.svg";
// orangery elements & internal dependencies
import {
  FieldError,
  FormError,
  ValueState,
  ArrayValueState,
} from "../../../states/mobx-form";
import {
  OrangeryToast,
  OrangeryTextField,
  OrangerySwitch,
  OrangeryOffersAutocomplete,
  OrangeryTextAreaField,
  OrangeryFormWrapper,
  OrangeryText,
} from "../../OrangeryElements";
import DeleteCustomerButton from "./DeleteCustomerButton";
import AssignCustomerOrganizationButton from "./AssignCustomerOrganizationButton";

// queries & backend
import {
  ICustomerUpsertParams,
  useUpsertCustomer,
  ICustomer,
} from "../../../queries/customer";

// icons, images & colors
import UserIcon from "../../../assets/svg/user.svg";
import EmailIcon from "../../../assets/svg/email.svg";
import AddressIcon from "../../../assets/svg/address-card-light.svg";
import NumberIcon from "../../../assets/svg/input-numeric-light.svg";
import BuildingIcon from "../../../assets/svg/building.svg";

export class CustomerFormState {
  public office_uuid;

  public uuid;
  public first_name;
  public last_name;
  public email;
  public invoice_email;
  public company_name;
  public address;
  public invoice_extra_info;
  public tax_id;
  public create_dashboard;
  public customer_number;

  public product_uuids;
  public remove_product_uuids;

  public error = "";

  constructor(office_uuid: string, customer?: ICustomer) {
    this.office_uuid = new ValueState(office_uuid);

    if (customer) {
      this.uuid = new ValueState(customer.uuid);
      this.first_name = new ValueState(customer.first_name);
      this.last_name = new ValueState(customer.last_name);
      this.email = new ValueState(customer.email);
      this.invoice_email = new ValueState(customer.invoice_email);
      this.company_name = new ValueState(customer.company_name);
      this.address = new ValueState(customer.address);
      this.invoice_extra_info = new ValueState(
        customer.invoice_extra_info ?? ""
      );
      this.tax_id = new ValueState(customer.tax_id);
      this.create_dashboard = new ValueState(
        customer.create_dashboard ?? false
      );
      this.customer_number = new ValueState(customer.customer_number);

      this.product_uuids = new ArrayValueState(
        customer.products?.map((product) => product.uuid) ?? []
      );
      this.remove_product_uuids = new ArrayValueState<string>([]);
    } else {
      this.uuid = new ValueState("");
      this.first_name = new ValueState("");
      this.last_name = new ValueState("");
      this.email = new ValueState("");
      this.invoice_email = new ValueState("");
      this.company_name = new ValueState("");
      this.address = new ValueState("");
      this.invoice_extra_info = new ValueState("");
      this.tax_id = new ValueState("");
      this.create_dashboard = new ValueState(false);
      this.customer_number = new ValueState("");

      this.product_uuids = new ArrayValueState([]);
      this.remove_product_uuids = new ArrayValueState<string>([]);
    }

    makeAutoObservable(this);
  }

  get data() {
    return {
      office_uuid: this.office_uuid.value,
      uuid: this.uuid.value,
      first_name: this.first_name.value,
      last_name: this.last_name.value,
      email: this.email.value,
      invoice_email: this.invoice_email.value,
      company_name: this.company_name.value,
      address: this.address.value,
      invoice_extra_info: this.invoice_extra_info.value,
      tax_id: this.tax_id.value,
      create_dashboard: this.create_dashboard.value,
      customer_number: this.customer_number.value,

      product_uuids: this.product_uuids.values.map((v) => v.value),
      remove_product_uuids: this.remove_product_uuids.values.map((v) => v.value),
    };
  }

  clearErrors() {
    this.office_uuid.error = "";

    this.uuid.error = "";
    this.first_name.error = "";
    this.last_name.error = "";
    this.email.error = "";
    this.invoice_email.error = "";
    this.company_name.error = "";
    this.address.error = "";
    this.invoice_extra_info.error = "";
    this.tax_id.error = "";
    this.create_dashboard.error = "";
    this.customer_number.error = "";

    this.product_uuids.error = "";
    this.remove_product_uuids.error = "";

    this.error = "";
  }

  validate() {
    let valid = true;
    this.clearErrors();

    if (!this.office_uuid.value) {
      this.office_uuid.error = "Please select the office";
      valid = false;
    }

    if (!this.first_name.value) {
      this.first_name.error = "Please fill your customer first name";
      valid = false;
    }
    if (!this.last_name.value) {
      this.last_name.error = "Please fill your customer last name";
      valid = false;
    }
    if (!this.email.value) {
      this.email.error = "Please fill your customer email";
      valid = false;
    }
    if (!this.address.value) {
      this.address.error = "Please fill your customer address";
      valid = false;
    }
    if (this.create_dashboard.value && !this.company_name.value) {
      this.company_name.error = "Please fill your customer company name";
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
    if (error.field === "company_name") {
      this.company_name.error = error.error;
    }
    if (error.field === "address") {
      this.address.error = error.error;
    }
    if (error.field === "tax_id") {
      this.tax_id.error = error.error;
    }
    if (error.field === "customer_number") {
      this.customer_number.error = error.error;
    }
    if (error.field === "product_uuids") {
      this.product_uuids.error = error.error;
    }
    if (error.field === "remove_product_uuids") {
      this.remove_product_uuids.error = error.error;
    }
  }
}

export default function CustomerForm({
  customer,
  handleClose,
  noCancel,
  noRemove,
}: {
  customer?: ICustomer;
  handleClose: () => void;
  noCancel?: any;
  noRemove?: any;
}) {
  const { office_uuid } = useGlobalState();
  const mutation = useUpsertCustomer();
  const state = React.useMemo(
    () => new CustomerFormState(office_uuid, customer),
    [office_uuid, customer]
  );
  const globalState = useGlobalState();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!state.validate()) {
      return;
    }
    try {
      await mutation.mutateAsync({ ...state.data });
      handleClose();
      if (customer) {
        OrangeryToast("Successfully edited " + state.data.last_name, "success");
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
      title={`${customer ? "Edit" : "Add"} Customer`}
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
          {!noRemove && customer && (
            <Box sx={{ flexGrow: 1 }}>
              <DeleteCustomerButton
                handleCloseForm={handleClose}
                customer={customer}
                label="Remove"
                sx={{ color: "red" }}
              />
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
                  {customer ? "Save" : "Create"}
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
          height: "577px",
          width: "100%",
        }}
      >
        <Observer>
          {() => (
            <>
              <Box
                sx={{
                  width: "70%",
                  height: "100%",
                  overflow: "auto",
                  display: "flex",
                  flexDirection: "column",
                  pb: 1,
                  pt: 4.3,
                  px: 4,
                  rowGap: 1,
                  mb: 2,
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
                    alignItems: "center",
                    gap: 1,
                    justifyContent: "start",
                  }}
                >
                  <Box sx={{ flex: "0.5 1 auto", width: "33%" }}>
                    <Observer>
                      {() => (
                        <OrangeryTextField
                          type="text"
                          label="FIRST NAME"
                          name="first_name"
                          placeholder="Enter First Name"
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

                  <Box sx={{ flex: "0.5 1 auto", width: "33%" }}>
                    <Observer>
                      {() => (
                        <OrangeryTextField
                          type="text"
                          label="LAST NAME"
                          name="last_name"
                          autoComplete="given-name"
                          placeholder="Enter Last Name"
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

                  <Box sx={{ flex: "0.5 1 auto", width: "34%" }}>
                    <Observer>
                      {() => (
                        <OrangeryTextField
                          type="email"
                          label="EMAIL"
                          name="email"
                          autoComplete="email"
                          placeholder="Enter User Email"
                          value={state.email.value}
                          error={!!state.email.error}
                          helperText={state.email.error}
                          onChange={(e) => (state.email.value = e.target.value)}
                          startIcon={<EmailIcon />}
                        />
                      )}
                    </Observer>
                  </Box>
                </Box>

                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    justifyContent: "start",
                  }}
                >
                  <Box sx={{ flex: "0.5 1 auto", width: "66.3%" }}>
                    <Observer>
                      {() => (
                        <OrangeryTextField
                          type="text"
                          label="ADDRESS"
                          name="address"
                          placeholder="Type Address"
                          autoComplete="address"
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

                  <Box sx={{ flex: "0.5 1 auto", width: "33.7%" }}>
                    <Observer>
                      {() => (
                        <OrangeryTextField
                          type="invoice_email"
                          label="INVOICE EMAIL"
                          name="invoice_email"
                          autoComplete="invoice_email"
                          placeholder="Type Customer Email"
                          value={state.invoice_email.value}
                          error={!!state.invoice_email.error}
                          helperText={state.invoice_email.error}
                          onChange={(e) =>
                            (state.invoice_email.value = e.target.value)
                          }
                          startIcon={<EmailIcon />}
                        />
                      )}
                    </Observer>
                  </Box>
                </Box>

                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    justifyContent: "start",
                  }}
                >
                  <Box sx={{ flex: "0.5 1 auto", width: "100%" }}>
                    <Observer>
                      {() => (
                        <OrangeryTextAreaField
                          sx={{
                            height: "80px",
                            mb: 7,
                          }}
                          label="INVOICE EXTRA INFO"
                          name="invoice_extra_info"
                          multiline
                          placeholder="Enter invoice extra info"
                          error={!!state.invoice_extra_info.error}
                          value={state.invoice_extra_info.value}
                          helperText={state.invoice_extra_info.error}
                          onChange={(e: any) =>
                            (state.invoice_extra_info.value = e.target.value)
                          }
                        />
                      )}
                    </Observer>
                  </Box>
                </Box>

                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    justifyContent: "start",
                  }}
                >
                  <Box sx={{ flex: "0.5 1 auto", width: "33%" }}>
                    <Observer>
                      {() => (
                        <OrangeryTextField
                          type="text"
                          label="CUSTOMER NUMBER"
                          name="customer_number"
                          autoComplete="customer_number"
                          placeholder="Enter Customer Number"
                          value={state.customer_number.value}
                          error={!!state.customer_number.error}
                          helperText={state.customer_number.error}
                          onChange={(e) =>
                            (state.customer_number.value = e.target.value)
                          }
                          startIcon={<NumberIcon />}
                        />
                      )}
                    </Observer>
                  </Box>

                  <Box sx={{ flex: "0.5 1 auto", width: "33%" }}>
                    <Observer>
                      {() => (
                        <OrangeryTextField
                          type="text"
                          label="TAX ID"
                          name="tax_id"
                          autoComplete="tax_id"
                          placeholder="Enter Tax ID"
                          value={state.tax_id.value}
                          error={!!state.tax_id.error}
                          helperText={state.tax_id.error}
                          onChange={(e) =>
                            (state.tax_id.value = e.target.value)
                          }
                          startIcon={<AddressIcon />}
                        />
                      )}
                    </Observer>
                  </Box>

                  <Box sx={{ flex: "0.5 1 auto", width: "34%" }}>
                    <Observer>
                      {() => (
                        <OrangeryTextField
                          type="text"
                          label="COMPANY NAME"
                          name="company_name"
                          autoComplete="company_name"
                          placeholder="Enter Comapny Name"
                          value={state.company_name.value}
                          error={!!state.company_name.error}
                          helperText={state.company_name.error}
                          onChange={(e) =>
                            (state.company_name.value = e.target.value)
                          }
                          startIcon={<BuildingIcon />}
                        />
                      )}
                    </Observer>
                  </Box>
                </Box>

                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    justifyContent: "start",
                  }}
                >
                  <Box sx={{ flex: "0.5 1 auto", width: "100%" }}>
                    <Observer>
                      {() => (
                        <OrangeryOffersAutocomplete
                          label="OFFERS"
                          value={state.product_uuids.values.map((e) => e.value)}
                          onChange={(newValues) => {
                            // state.product_uuids = new ArrayValueState(newValues)
                            newValues.forEach((e) => {
                              const i = state.product_uuids.values.findIndex(
                                (v) => v.value === e
                              );
                              if (i === -1) {
                                state.product_uuids.pushElementValue(e);
                              }
                            });
                            state.product_uuids.values.forEach((v, j) => {
                              const i = newValues.findIndex(
                                (e) => v.value === e
                              );
                              if (i === -1) {
                                state.product_uuids.deleteElementValue(j);
                                state.remove_product_uuids.pushElementValue(
                                  v.value
                                );
                              }
                            });
                          }}
                        />
                      )}
                    </Observer>
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
                width: "359px",
                height: "577px",
                backgroundColor: "#F7F8FA",
                p: 3,
              }}
            >
              <Box sx={{ pt: 3, pb: 1 }}>
                <Box sx={{ borderBottom: "1px solid rgb(154, 156, 160)" }} />
                <Typography
                  sx={{
                    m: "-14px 0px 0px",
                    color: "rgb(154, 156, 160)",
                    backgroundColor: "rgb(247, 248, 250)",
                    width: "120px",
                    fontSize: "16px",
                    fontWeight: "700",
                  }}
                >
                  Main Functions
                </Typography>
              </Box>
              <Box>
                <Observer>
                  {() => (
                    <>
                      {!customer ? (
                        <OrangerySwitch
                          label={{
                            checked: "Assigne Dashboard",
                            unchecked: "Assigne Dashboard",
                          }}
                          checkedLabels={{
                            checked: "Show dashboard to user",
                            unchecked: "Show dashboard to user",
                          }}
                          checked={state.create_dashboard.value}
                          onChange={(e) => {
                            state.create_dashboard.value = e.target.checked;
                            if (!e.target.checked)
                              state.company_name.error = "";
                          }}
                        />
                      ) : (
                        ""
                      )}
                    </>
                  )}
                </Observer>
              </Box>

              {customer && (
                <Box
                  sx={{
                    display: "flex",
                    gap: 1,
                    alignItems: "center",
                    // justifyContent: 'end',
                    flexGrow: 1,
                  }}
                >
                  {customer?.organization !== null &&
                    customer?.organization !== undefined ? (
                    <Box
                      sx={{
                        mr: 2,
                        width: "100%",
                        textAlign: "left",
                        maxWidth: "80%",
                      }}
                    >
                      <Typography
                        sx={{
                          fontWeight: 700,
                          fontSize: 16,
                          pr: 1,
                          pt: 0.75,
                          pb: 1,
                        }}
                      >
                        <OrangeryText
                          text={`Organization: ${customer?.organization}`}
                          limit={40}
                        />
                      </Typography>
                    </Box>
                  ) : (
                    <AssignCustomerOrganizationButton
                      customerOrganization={{
                        office_uuid: state.office_uuid.value,
                        company_name: state.company_name.value,
                        email: state.email.value,
                        uuid: state.uuid.value,
                        tax_id: state.tax_id.value,
                      }}
                    />
                  )}
                </Box>
              )}
            </Box>
          )}
        </Observer>
      </Box>
    </OrangeryFormWrapper>
  );
}
