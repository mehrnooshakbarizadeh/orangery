// contexts & globals
//

// react & next
import React from "react";

// external dependencies
import {
  Box,
  Button,
  Typography,
  TextField,
} from "@mui/material";
import { makeAutoObservable } from "mobx";
import { Observer } from "mobx-react-lite";
import NumberFormat from "react-number-format";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";

// orangery elements & internal dependencies
import {
  ArrayValueState,
  FieldError,
  FormError,
  ValueState,
} from "../../../../states/mobx-form";
import { OrangeryTextField, OrangeryFormWrapper } from "../../../OrangeryElements";
import {
  OrangeryToast,
  OrangeryDocumentsField,
} from "../../../OrangeryElements";
// import CustomizedSwitches from "../../OrangeryElements/CustomizedSwitches";

// queries & backend
import { useUpsertTransaction } from "../../../../queries/apps/osAnalytics";
import { OrangeryCheckBox2 } from "../../../OrangeryElements";
import { IOffice } from "../../../../queries/office";
import OrangeryPdfField from "../../../OrangeryElements/OrangeryPdfField";

// icons, images & colors
//

export class TransactionFormState {
  public office_uuid;
  public uuid;

  public name;
  public amount;
  public date;
  public recurring;

  public invoice;

  public error = "";

  constructor(transaction?: any, office_uuid?: string) {
    this.office_uuid = new ValueState(office_uuid);

    if (transaction) {
      this.uuid = new ValueState(transaction.uuid);
      this.name = new ValueState(transaction.name);
      this.amount = new ValueState<number>(transaction.amount);
      this.date = new ValueState<Date>(new Date(transaction.date));
      this.recurring = new ValueState<boolean>(transaction.recurring);
      this.invoice = new ValueState<string>(transaction.invoice);
    } else {
      this.uuid = new ValueState(undefined);
      this.name = new ValueState("");
      this.amount = new ValueState<number>(0);
      this.date = new ValueState<Date>(new Date());
      this.recurring = new ValueState<boolean>(false);
      this.invoice = new ValueState<string>("");
    }

    makeAutoObservable(this);
  }

  get data() {
    return {
      office_uuid: this.office_uuid.value,
      ...(this.uuid.value ? { uuid: this.uuid.value } : {}),

      name: this.name.value,
      amount: this.amount.value,
      date: this.date.value,
      recurring: this.recurring.value,

      invoice: this.invoice.value,
    };
  }

  clearErrors() {
    this.name.clearError();
    this.amount.clearError();
    this.date.clearError();
    this.recurring.clearError();

    this.invoice.clearError();

    this.error = "";
  }

  validate() {
    let valid = true;
    this.clearErrors();
    if (!this.name.value) {
      this.name.error = "Please fill the name";
      valid = false;
    }
    // if (!this.amount.value) {
    //   this.amount.error = "Please fill amount";
    //   valid = false;
    // }
    if (!this.date.value) {
      this.date.error = "Please select a date";
      valid = false;
    }
    return valid;
  }

  setupErrors(err: FormError) {
    this.clearErrors();
    err.errors.forEach((error: any) => this.setupError(error));
  }

  setupError(error: FieldError) {
    if (error.field === "") {
      this.error = error.error;
    } else if (error.field === "name") {
      this.name.error = error.error;
    } else if (error.field === "amount") {
      this.amount.error = error.error;
    } else if (error.field === "date") {
      this.date.error = error.error;
    } else if (error.field === "recurring") {
      this.recurring.error = error.error;
    } else {
      // console.warn(
      //   `the field ${error.field} not found in the field list in RoomForm.`
      // );
    }
  }
}

export default function TransactionForm({
  handleClose,
  selectedOffice,
  transaction,
  noCancel,
  noRemove,
}: {
  handleClose?: () => void;
  selectedOffice?: IOffice;
  transaction?: any;
  noCancel?: any;
  noRemove?: any;
}) {
  const mutation = useUpsertTransaction();
  const state = React.useMemo(
    () => new TransactionFormState(transaction, selectedOffice?.uuid),
    [transaction, selectedOffice?.uuid]
  );

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!state.validate()) {
      return;
    }
    try {
      await mutation.mutateAsync(state.data);
      if (handleClose)
        handleClose();
      OrangeryToast(`Successfully ${transaction ? "edited" : "created"} ${state.data.name}`, "success");
    } catch (err: any) {
      state.setupErrors(err);
    }
  }

  return (
    <OrangeryFormWrapper
      onSubmit={handleSubmit}
      onClose={handleClose}
      title={`Add New Transaction`}
      style={{
        width: 498,
        // height: 618
      }}
      footer={<Box
        sx={{
          display: "flex",
          justifyContent: "flex-end",
          alignItems: "center",
          width: "100%"
        }}
      >
        {!noRemove && (
          <Box sx={{ flexGrow: 1 }}>
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
                {"Done"}
              </Button>
            </>
          )}
        </Observer>
      </Box>}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "end",
          width: "100%"
        }}>
        <Box
          sx={{
            display: "flex",
            // flexGrow: 1,
            flexDirection: "column",
            pt: 2,
            // pb: 14,
            pl: 4,
            pr: 2,
            mr: 1,
            rowGap: 2,
            height: "100%",
            width: "100%"
          }}
        >
          <Box
            sx={{
              width: "100%",
              display: "flex",
              flexDirection: "column",
              gap: .5,
              pb: 4
            }}
          >
            <Typography
              sx={{
                fontSize: 16,
                fontWeight: 400
              }}
            >
              Selected location
            </Typography>
            <Typography
              sx={{
                fontSize: 16,
                fontWeight: 800
              }}
            >
              {selectedOffice?.name ?? "All locations"}
            </Typography>
          </Box>

          <Box sx={{ width: "100%", height: "85px" }}>
            <Observer>
              {() => (
                <OrangeryTextField
                  label="NAME"
                  name="name"
                  placeholder="Enter Name"
                  error={!!state.name.error}
                  value={state.name.value}
                  helperText={state.name.error}
                  onChange={(e: any) => (state.name.value = e.target.value)}
                />
              )}
            </Observer>
          </Box>

          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              gap: 1
            }}
          >
            <Box sx={{ width: '50%' }}>
              <Observer>
                {() => (
                  <NumberFormat
                    name="amount"
                    customInput={TextField}
                    fullWidth
                    label="AMOUNT"
                    type="text"
                    thousandsGroupStyle="wan"
                    decimalSeparator="."
                    decimalScale={2}
                    fixedDecimalScale={true}
                    allowNegative
                    value={state.amount.value?.toString()}
                    error={!!state.amount.error}
                    helperText={state.amount.error}
                    onChange={(e: any) =>
                      (state.amount.value = parseFloat(e.target.value))
                    }
                  />
                )}
              </Observer>
            </Box>
            <Box sx={{ width: '50%' }}>
              <Observer>
                {() => (
                  <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <DatePicker
                      inputFormat="dd.MM.yyyy"
                      // disablePast
                      label="DATE"
                      value={state.date.value}
                      onChange={(newValue: any) => {
                        state.date.value = newValue;
                      }}
                      renderInput={(props) => <TextField {...props} fullWidth />}
                    />
                  </LocalizationProvider>
                )}
              </Observer>
            </Box>
          </Box>

          <Box sx={{ width: '100%' }}>
            <Box sx={{
              pt: 1,
              pl: 1,
            }}>
              <Observer>
                {() => (
                  <OrangeryCheckBox2
                    label="Monthly recurring transaction"
                    checked={state.recurring.value}
                    onChange={(e: any) => (state.recurring.value = e.target.checked)}
                  />
                )}
              </Observer>
            </Box>
          </Box>

          <Box sx={{ width: '100%' }}>
            <Box
              sx={{
                pt: 0,
                pl: 0,
              }}
            >
              <Observer>
                {() => (
                  <OrangeryPdfField
                    label="Invoice"
                    // title="Invoice"
                    image={state.invoice.value}
                    onAdd={(uuid) => {
                      state.invoice.value = uuid;
                      // onChange(state.data);
                    }}
                    onRemove={(uuid) => {
                      state.invoice.value = "";
                    }}
                  />
                )}
              </Observer>
            </Box>
          </Box>
        </Box>
      </Box>
    </OrangeryFormWrapper>
  );
}
