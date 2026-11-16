// contexts & globals

// react & next
import { useRouter } from "next/router";
import React from "react";

// external dependencies
import { Box, Button, Typography, TextField, InputAdornment, IconButton } from "@mui/material";
import { makeAutoObservable } from "mobx";
import { Observer } from "mobx-react-lite";
import NumberFormat from "react-number-format";
import CapacityIcon from "../../../../assets/svg/capacity.svg";
import SearchIcon from "../../../../assets/svg/search.svg";
import CoinIcon from "../../../../assets/svg/coin.svg";
import CrossIcon from "../../../../assets/svg/cross.svg";
// icons, images & colors
import { ICredit, useUpsertCredit } from "../../../../queries/credit";
import { FieldError, FormError, ValueState } from "../../../../states/mobx-form";
import { useGlobalState } from "../../../../Contexts & Globals/GlobalContext";
import {
  OrangeryToast,
  OrangeryUserCircle,
  OrangeryCoworkerAutocomplete,
  OrangerySwitch,
  OrangeryText,
} from "../../../OrangeryElements";

export class CreditState {
  public employee_uuid;
  public name;
  public balance;
  public monthly_credit;
  public office_uuid;
  public error = "";

  constructor(office_uuid: string, credit?: ICredit) {
    this.office_uuid = new ValueState(office_uuid);
    if (credit) {
      this.name = new ValueState(credit.name);
      this.employee_uuid = new ValueState(credit.uuid);
      this.balance = new ValueState(credit.balance);
      this.monthly_credit = new ValueState(credit.monthly_credit);
    } else {
      this.name = new ValueState("");
      this.employee_uuid = new ValueState("");
      this.balance = new ValueState(0);
      this.monthly_credit = new ValueState(true);
    }

    makeAutoObservable(this);
  }

  get data() {
    return {
      employee_uuid: this.employee_uuid.value,
      name: this.name.value,
      balance: this.balance.value,
      monthly_credit: this.monthly_credit.value,
      office_uuid: this.office_uuid.value,
    };
  }

  clearErrors() {
    this.name.clearError();
    this.balance.clearError();
    this.monthly_credit.clearError();
    this.error = "";
  }

  validate() {
    let valid = true;
    this.clearErrors();

    if (!this.balance.value) {
      this.balance.error = "Please fill credit number";
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
    } else if (error.field === "monthly_credit") {
      this.monthly_credit.error = error.error;
    } else if (error.field === "balance") {
      this.balance.error = error.error;
    } else {
      // console.warn(
      //   `the field ${error.field} not found in the field list in DeskForm.`
      // );
    }
  }
}

export default function CreditForm({
  credit,
  handleClose,
  noCancel,
  noRemove,
}: {
  credit?: ICredit;
  handleClose: () => void;
  noCancel?: any;
  noRemove?: any;
}) {
  const { office_uuid } = useGlobalState();
  const mutation = useUpsertCredit();
  const state = React.useMemo(() => new CreditState(office_uuid, credit), [office_uuid, credit]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!state.validate()) {
      return;
    }
    try {
      await mutation.mutateAsync(state.data);
      handleClose();
      if (credit) {
        OrangeryToast("Successfully edited " + state.data.name, "success");
      } else {
        OrangeryToast("Successfully created " + state.data.name, "success");
      }
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
                {credit ? (
                  <Typography color="black" fontSize={30} fontWeight={700} sx={{ flexGrow: 1 }}>
                    Edit credit
                  </Typography>
                ) : (
                  <Typography sx={{ flexGrow: 1 }} color="black" fontSize={30} fontWeight={700}>
                    Assign new credit
                  </Typography>
                )}
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
                    {!credit ? (
                      <OrangeryCoworkerAutocomplete
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
                      />
                    ) : (
                      <Box
                        sx={{
                          display: "flex",
                          gap: 4,
                          alignItems: "center",
                          justifyContent: "start",
                        }}
                      >
                        <OrangeryUserCircle
                          name={credit.name}
                          fileName={credit.image}
                          notHoverable={1}
                          size={76}
                        />
                        <Box sx={{ display: "flex", flexDirection: "column" }}>
                          <Typography variant="h1" color="primary.main">
                            <OrangeryText text={credit.name} limit={22} />
                          </Typography>
                          <Typography color="primary.light" fontSize={20} fontWeight={600}>
                            <OrangeryText text={credit.email} limit={22} />
                          </Typography>
                        </Box>
                      </Box>
                    )}
                  </Box>

                  {state.employee_uuid.value ? (
                    <>
                      <Box sx={{ width: "100%" }}>
                        <NumberFormat
                          customInput={TextField}
                          label="Enter Credit"
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
                                <CoinIcon className="stock-icon" />
                              </InputAdornment>
                            ),
                          }}
                          type="text"
                          disabled={!state.employee_uuid.value}
                          placeholder="Enter Credit"
                          allowNegative={false}
                          value={state.balance.value?.toString()}
                          error={!!state.balance.error}
                          helperText={state.balance.error}
                          onChange={(e: any) => (state.balance.value = parseInt(e.target.value))}
                          sx={{ width: "100%" }}
                        />
                      </Box>
                      <Box sx={{ width: "100%", pt: 2 }}>
                        <OrangerySwitch
                          label={{
                            checked: "MONTHLY CREDIT",
                            unchecked: "MONTHLY CREDIT",
                          }}
                          checkedLabels={{
                            checked: "This Credit is assigned to the user on a monthly basis",
                            unchecked: "This Credit is assigned to the user on a monthly basis",
                          }}
                          checked={state.monthly_credit.value}
                          onChange={(e) => (state.monthly_credit.value = e.target.checked)}
                        />
                      </Box>
                    </>
                  ) : (
                    ""
                  )}
                </Box>
              </Box>
            </>
          )}
        </Observer>

        <Box
          sx={{
            position: "absolute",
            bottom: "60px",
            display: "flex",
            alignItems: "center",
            px: 3,
            justifyContent: "center",
            gap: 1,
            right: "8px",
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
