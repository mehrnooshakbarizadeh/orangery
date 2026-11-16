import React from "react";

// external dependencies
import {
  Box,
  Button,
  Typography,
  TextField,
  InputAdornment,
  MenuItem,
  TextFieldProps,
  IconButton,
} from "@mui/material";
import { makeAutoObservable } from "mobx";
import { Observer } from "mobx-react-lite";
import NumberFormat from "react-number-format";
import CrossIcon from "../../../../assets/svg/cross.svg";

// icons, images & colors
import BarcodeIcon from '../../../../assets/svg/barcode.svg';
import PercentIcon from '../../../../assets/svg/percent.svg';
import LayerIcon from '../../../../assets/svg/layer.svg';
import { ICoupon, useUpsertCoupon } from "../../../../queries/coupon";
import { ArrayValueState, FieldError, FormError, ValueState } from "../../../../states/mobx-form";
import { OrangeryOffersAutocomplete, OrangerySwitch, OrangeryTextField, OrangeryToast } from "../../../OrangeryElements";
import { useGlobalState } from "../../../../Contexts & Globals/GlobalContext";
import EmployeesAutocomplete from "../../desks/EmployeesAutocomplete";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import CustomizedCheckbox from "../../../OrangeryElements/OrangeryCheckBox";
import DeleteCouponButton from "./DeleteCouponButton";
import CouponAutocomplete from "./CouponAutocomplete";

export class CouponState {
  public uuid;
  public discount_code;
  public discount_type;
  public amount;
  public user_uuids;
  public quantity;
  public active;
  public expire_date;
  public multi_use;
  public office_uuid;

  public product_uuids;
  public remove_product_uuids;

  public error = "";

  constructor(office_uuid: string, coupon?: ICoupon) {
    this.office_uuid = new ValueState(office_uuid);
    if (coupon) {
      this.uuid = new ValueState(coupon.uuid);
      this.discount_code = new ValueState(coupon.discount_code);
      this.discount_type = new ValueState(coupon.discount_type);
      this.amount = new ValueState(coupon.amount);
      this.user_uuids = new ArrayValueState(
        coupon.users?.map((user) => user.uuid)
      );
      this.quantity = new ValueState(coupon.quantity);
      this.active = new ValueState(coupon.active);
      this.expire_date = new ValueState(coupon.expire_date);
      this.multi_use = new ValueState(coupon.multi_use);

      this.product_uuids = new ArrayValueState(
        coupon.products?.map((product) => product.uuid) ?? []
      );
      this.remove_product_uuids = new ArrayValueState<string>([]);
    } else {
      this.uuid = new ValueState("");
      this.discount_code = new ValueState("");
      this.discount_type = new ValueState("%");
      this.amount = new ValueState(0);
      this.active = new ValueState(true);
      this.user_uuids = new ArrayValueState([]);
      this.quantity = new ValueState(1);
      this.expire_date = new ValueState(null);
      this.multi_use = new ValueState(true);

      this.product_uuids = new ArrayValueState([]);
      this.remove_product_uuids = new ArrayValueState<string>([]);
    }

    makeAutoObservable(this);
  }

  get data() {
    return {
      uuid: this.uuid.value,
      discount_code: this.discount_code.value,
      discount_type: this.discount_type.value,
      amount: this.amount.value,
      active: this.active.value,
      user_uuids: this.user_uuids.values.map((v) => v.value),
      quantity: this.quantity.value,
      expire_date: this.expire_date.value,
      multi_use: this.multi_use.value,
      office_uuid: this.office_uuid.value,

      product_uuids: this.product_uuids.values.map((v) => v.value),
      remove_product_uuids: this.remove_product_uuids.values.map((v) => v.value),
    };
  }

  clearErrors() {
    this.discount_code.clearError();
    this.discount_type.clearError();
    this.amount.clearError();
    this.user_uuids.clearError();
    this.active.clearError();
    this.quantity.clearError();
    this.expire_date.clearError();
    this.multi_use.clearError();

    this.product_uuids.error = "";
    this.remove_product_uuids.error = "";

    this.error = "";
  }

  validate() {
    let valid = true;
    this.clearErrors();
    if (!this.discount_code.value) {
      this.discount_code.error = "Please fill your discount code";
      valid = false;
    }
    if (!this.discount_type.value) {
      this.discount_type.error = "Please fill your type";
      valid = false;
    }
    if (!this.amount.value) {
      this.amount.error = "Please fill your discount";
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
    } else if (error.field === "discount_code") {
      this.discount_code.error = error.error;
    } else if (error.field === "discount_type") {
      this.discount_type.error = error.error;
    } else if (error.field === "amount") {
      this.amount.error = error.error;
    } else if (error.field === "user_uuids") {
      this.user_uuids.error = error.error;
    } else if (error.field === "quantity") {
      this.quantity.error = error.error;
    } else if (error.field === "expire_date") {
      this.expire_date.error = error.error;
    } else if (error.field === "multi_use") {
      this.multi_use.error = error.error;
    }
    if (error.field === "product_uuids") {
      this.product_uuids.error = error.error;
    }
    if (error.field === "remove_product_uuids") {
      this.remove_product_uuids.error = error.error;
    }
  }
}

export default function CouponForm({
  coupon,
  handleClose,
  noCancel,
  noRemove,
}: {
  coupon?: ICoupon;
  handleClose: () => void;
  noCancel?: any;
  noRemove?: any;
}) {
  const { office_uuid } = useGlobalState();
  const mutation = useUpsertCoupon();
  const state = React.useMemo(
    () => new CouponState(office_uuid, coupon),
    [office_uuid, coupon]
  );

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!state.validate()) {
      return;
    }
    try {
      await mutation.mutateAsync(state.data);
      handleClose();
      if (coupon) {
        OrangeryToast("Successfully edited " + state.data.discount_code, "success");
      } else {
        OrangeryToast("Successfully created " + state.data.discount_code, "success");
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
                pl: 4,
                py: 3,
                display: "flex",
                justifyContent: "end",
                alignItems: "center",
                borderBottom: "1px solid #E8E9ED",
              }}
            >
              <Typography
                sx={{ flexGrow: 1, fontSize: 24, fontWeight: 600, color: '#000' }}
              >
                {coupon ? "Edit Coupon" : "Add Coupon"}
              </Typography>
              <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
                <IconButton
                  onClick={handleClose}
                  sx={{
                    display: "flex",
                    "& .cancel-icon": { width: "1.3rem", height: "1.3rem", color: 'black' },
                  }}
                >
                  <CrossIcon className="cancel-icon" />
                </IconButton>
              </Box>
            </Box>
          )}
        </Observer>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'end', height: 450 }}> {/* , height: '500px' */}
          <Observer>
            {() => (
              <>
                <Box
                  sx={{
                    flexGrow: 1,
                    display: "flex",
                    width: '70%',
                    height: '100%',
                    overflow: 'auto',
                    flexDirection: "column",
                    pt: 2,
                    pb: 1,
                    px: 4,
                    mr: 1,
                    "&::-webkit-scrollbar": {
                      width: "0.4em",
                    },
                    "&::-webkit-scrollbar-track": {
                      // boxShadow: "inset 0 0 6px rgba(0,0,0,0.00)",
                      // webkitBoxShadow: "inset 0 0 6px rgba(0,0,0,0.00)",
                    },
                    "&::-webkit-scrollbar-thumb": {
                      backgroundColor: "rgba(0,0,0,.1)",
                      // outline: "1px solid slategrey",
                      borderRadius: 5,
                    },
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <Box sx={{ width: '55%' }}>
                      <OrangeryTextField
                        label="DISCOUNT CODE"
                        name="discount_code"
                        startIcon={<BarcodeIcon />}
                        placeholder="Blackfriday50"
                        error={!!state.discount_code.error}
                        value={state.discount_code.value}
                        helperText={state.discount_code.error}
                        onChange={(e: any) => (state.discount_code.value = e.target.value)}
                      />
                    </Box>
                    <Box sx={{ width: "25%" }}>
                      <Observer>
                        {() => (
                          <DiscountType
                            label="DISCOUNT TYPE"
                            name="discount_type"
                            icon={<PercentIcon />}
                            error={!!state.discount_type.error}
                            value={state.discount_type.value}
                            helperText={state.discount_type.error}
                            onChange={(e: any) => (state.discount_type.value = e.target.value)} />
                        )}
                      </Observer>
                    </Box>
                    <Box sx={{ width: '20%', height: "85px" }}>
                      <NumberFormat
                        name="amount"
                        customInput={TextField}
                        fullWidth
                        label="DISCOUNT"
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
                              <LayerIcon className="stock-icon" />
                            </InputAdornment>
                          ),
                        }}
                        type="text"
                        allowNegative={false}
                        value={state.amount.value?.toString()}
                        error={!!state.amount.error}
                        helperText={state.amount.error}
                        onChange={(e: any) =>
                          (state.amount.value = parseInt(e.target.value))
                        }
                      />
                    </Box>
                  </Box>

                  <Box sx={{ width: '100%' }}>
                    <EmployeesAutocomplete
                      label="COWORKER"
                      value={state.user_uuids.values?.map(
                        (e) => e.value
                      )}
                      onChange={(newValues) => {
                        newValues.forEach((e) => {
                          const i = state.user_uuids.values?.findIndex(
                            (v) => v.value === e
                          );
                          if (i === -1) {
                            state.user_uuids.pushElementValue(e);
                          }
                        });
                        [...state.user_uuids.values]?.forEach((v) => {
                          const i = newValues.findIndex((e) => v.value === e);
                          if (i === -1) {
                            const j = state.user_uuids.values.findIndex(t => t === v)
                            state.user_uuids.deleteElementValue(j);
                          }
                        });
                      }}
                    />
                  </Box>


                  <Box sx={{ width: "100%" }}>
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

                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Box sx={{ width: '33%', height: "85px" }}>
                      <NumberFormat
                        customInput={TextField}
                        fullWidth
                        label="QUANTITY"
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
                              <LayerIcon className="stock-icon" />
                            </InputAdornment>
                          ),
                        }}
                        type="text"
                        allowNegative={false}
                        value={state.quantity.value?.toString()}
                        error={!!state.quantity.error}
                        helperText={state.quantity.error}
                        onChange={(e: any) =>
                          (state.quantity.value = parseInt(e.target.value))
                        }
                      // sx={{ backgroundColor: "grey.200" }}
                      />
                    </Box>
                    <Box sx={{ width: '33%', height: "85px" }}>
                      <Observer>
                        {() => (
                          <LocalizationProvider dateAdapter={AdapterDateFns}>
                            <DatePicker
                              inputFormat="dd.MM.yyyy"
                              disablePast
                              label="EXPIRE DATE"
                              value={state.expire_date.value}
                              onChange={(newValue: any) => {
                                state.expire_date.value = newValue;
                              }}
                              renderInput={(props) => <TextField {...props} fullWidth />}
                            />
                          </LocalizationProvider>
                        )}
                      </Observer>
                    </Box>
                  </Box>

                  <Box sx={{
                    pl: "5px",
                  }}>
                    <Observer>
                      {() => (
                        <CustomizedCheckbox
                          label="Limit to one use per coupon"
                          checked={state.multi_use.value}
                          onChange={(e) => (state.multi_use.value = e.target.checked)}
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
              <Box sx={{ width: '359px', height: 450, backgroundColor: '#F7F8FA', p: 3 }}>
                <Box sx={{ pt: 3, pb: 1 }}>
                  <Box sx={{ borderBottom: "1px solid rgb(154, 156, 160)" }} />
                  <Typography sx={{
                    m: "-14px 0px 0px",
                    color: "rgb(154, 156, 160)",
                    backgroundColor: "rgb(247, 248, 250)",
                    width: "120px",
                    fontSize: "16px",
                    fontWeight: "700",
                  }}
                  >Main Functions</Typography>
                </Box>
                <OrangerySwitch
                  label={{ checked: "Publish your coupon", unchecked: "Publish your coupon " }}
                  checkedLabels={{ checked: "On", unchecked: "Off" }}
                  checked={state.active.value}
                  onChange={(e) => (state.active.value = e.target.checked)}
                />
              </Box>
            )}
          </Observer>
        </Box>

        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "center",
            px: 3,
            py: 2,
            borderTop: '1px solid #E8E9ED',

          }}
        >

          {!noRemove && (
            <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', alignItems: "flex-start" }}>
              {coupon && (
                <DeleteCouponButton
                  handleCloseForm={handleClose}
                  coupon={coupon}
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
                  {coupon ? "Save" : "Create"}
                </Button>
              </>
            )}
          </Observer>
        </Box>
      </Box>
    </form>
  );
}

export interface IDiscountType {
  name: string,
  value: string
}

export const discountType: IDiscountType[] = [
  {
    name: "%",
    value: "%",
  },
  {
    name: "€",
    value: "€",
  },
]
function DiscountType({
  placeholder,
  label,
  sx,
  icon,
  ...props
}: { icon?: React.ReactNode; placeholder?: string } & TextFieldProps) {


  return (<>
    <Observer>
      {() => (
        <Box sx={{ width: "100%", height: "85px" }}>
          <TextField
            select
            placeholder={placeholder}
            {...props}
            label={label}
            fullWidth
            sx={{
              ...sx,
              "&.MuiTextField-root": {
                // backgroundColor: "#f5f7fa",
              },
              "& .MuiOutlinedInput-input": {
                fontSize: 20,
                fontWeight: 600,
                pb: '10px',
                gap: 1,
                pl: icon ? 6 : 2,
                color: "grey.A700",
                borderRadius: 1,
                backgroundColor: "#fff !important",
              },
              "& .MuiOutlinedInput-root": {
                pl: 0,
              },
              "& .MuiInputAdornment-root": {
                position: "absolute",
                left: (theme) => theme.spacing(2),
              },
              // "& .MuiInputLabel-root": {
              //   top: (theme) => theme.spacing(-3),
              //   fontSize: `11px`,
              //   fontWeight: "bold",
              //   transform: "unset",
              // },
              "& .MuiOutlinedInput-notchedOutline > legend > span": {
                display: label ? "block" : "none",
              },
            }}

            InputLabelProps={{
              shrink: true,
            }}

          >
            {discountType.map((discount_type) => (
              <MenuItem key={discount_type.name} value={discount_type.name}>
                {discount_type.name}
              </MenuItem>
            ))}
          </TextField>
        </Box>
      )}
    </Observer>
  </>)
}


