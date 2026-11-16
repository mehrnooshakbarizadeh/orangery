import { useGlobalState } from "../../../Contexts & Globals/GlobalContext";
import React from "react";
import { Grid, Box, Button, TextField, InputAdornment } from "@mui/material";
import { makeAutoObservable } from "mobx";
import { Observer } from "mobx-react-lite";
import NumberFormat from "react-number-format";
import {
  ArrayValueState,
  FieldError,
  FormError,
  ValueState,
} from "../../../states/mobx-form";
import DeleteAssetButton from "./DeleteAssetButton";
import {
  OrangeryToast,
  OrangeryTextField,
  OrangerySwitch,
  OrangeryCoworkerAutocomplete,
  OrangeryFormWrapper,
} from "../../OrangeryElements";
import { IAsset, IAssetGroup, useUpsertAsset } from "../../../queries/asset";
import CapacityIcon from "../../../assets/svg/capacity.svg";
import UserIcon from "../../../assets/svg/user.svg";
import EuroIcon from "../../../assets/svg/euro.svg";
import TagIcon from "../../../assets/svg/tag.svg";
import BarcodeIcon from "../../../assets/svg/barcode.svg";
import { UploadImageComponent } from "../../OrangeryElements/OrangeryUploadImage";
import OrangeryUploadPDF from "../../OrangeryElements/OrangeryUploadPDF";

export class AssetState {
  public uuid;
  public name;
  public serial_number;
  public price;
  public active;
  public stock;
  public floor_uuid;
  public user_uuid;
  public office_uuid;
  public image_uuids;
  public invoice_uuid;
  public error = "";

  constructor(office_uuid: string, asset?: IAsset, assetType?: IAssetGroup) {
    this.office_uuid = new ValueState(office_uuid);
    if (asset) {
      this.name = new ValueState(asset.name);
      this.uuid = new ValueState(asset?.uuid ?? "");
      this.serial_number = new ValueState(asset?.serial_number ?? "");
      this.user_uuid = new ValueState(asset?.assigned_user?.uuid ?? "");
      this.price = new ValueState(asset?.price ?? 0);
      this.active = new ValueState(asset?.active);
      this.stock = new ValueState(assetType?.stock ?? 0);
      this.floor_uuid = new ValueState(asset?.assigned_floor?.uuid ?? "");
      this.image_uuids = new ArrayValueState(
        asset?.images?.map((image) => image.uuid) ?? ""
      );
      this.invoice_uuid = new ValueState<File | string>(
        asset?.invoice?.uuid ?? ""
      );
    } else {
      this.name = new ValueState("");
      this.uuid = new ValueState("");
      this.serial_number = new ValueState("");
      this.user_uuid = new ValueState("");
      this.price = new ValueState(0);
      this.active = new ValueState(true);
      this.stock = new ValueState(0);
      this.floor_uuid = new ValueState("");
      this.image_uuids = new ArrayValueState([]);
      this.invoice_uuid = new ValueState<File | string>("");
    }

    makeAutoObservable(this);
  }

  get data() {
    return {
      data: {
        uuid: this.uuid.value,
        name: this.name.value,
        user_uuid: this.user_uuid.value,
        serial_number: this.serial_number.value,
        price: this.price.value,
        active: this.active.value,
        stock: this.stock.value,
        floor_uuid: this.floor_uuid.value,
        office_uuid: this.office_uuid.value,
        image_uuids: this.image_uuids.values?.map((im) => im.value),
        invoice_uuid: this.invoice_uuid.value,
      },
    };
  }

  clearErrors() {
    this.name.clearError();
    this.user_uuid.clearError();
    this.serial_number.clearError();
    this.price.clearError();
    this.active.clearError();
    this.stock.clearError();
    this.floor_uuid.clearError();
    this.error = "";
  }

  validate() {
    let valid = true;
    this.clearErrors();
    if (!this.name.value) {
      this.name.error = "Please fill your asset name";
      valid = false;
    }
    if (this.stock.value < 0) {
      this.stock.error = "Number between 0-9 is allowed";
      valid = false;
    }
    if (this.price.value < 0) {
      this.price.error = "Do not enter negative price";
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
    } else if (error.field === "user_uuid") {
      this.user_uuid.error = error.error;
    } else if (error.field === "price") {
      this.price.error = error.error;
    } else if (error.field === "active") {
      this.active.error = error.error;
    } else if (error.field === "stock") {
      this.stock.error = error.error;
    } else if (error.field === "floor_uuid") {
      this.floor_uuid.error = error.error;
    } else {
      // console.warn(
      //   `the field ${error.field} not found in the field list in DeskForm.`
      // );
    }
  }
}

export default function InventoryForm({
  asset,
  handleClose,
  noCancel,
  noRemove,
  updateDashboard,
}: {
  asset?: IAsset;
  handleClose: () => void;
  noCancel?: any;
  noRemove?: any;
  updateDashboard?: boolean;
}) {
  const { office_uuid } = useGlobalState();
  const mutation = useUpsertAsset();
  const state = React.useMemo(
    () => new AssetState(office_uuid, asset),
    [office_uuid, asset]
  );
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!state.validate()) {
      return;
    }
    try {
      await mutation.mutateAsync({ ...state.data.data, updateDashboard });
      handleClose();
      if (asset) {
        OrangeryToast("Successfully edited " + state.data.data.name, "success");
      } else {
        OrangeryToast(
          "Successfully created " + state.data.data.name,
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
      title={`${asset ? "Edit" : "Create"} Inventory`}
      withBorder
      // style={{
      //   width: 601,
      //   height: 395
      // }}
      footer={
        <Grid
          item
          xs={12}
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "center",
            width: "100%",
          }}
        >
          {!noRemove && !asset?.tenant_office_uuid && (
            <Box sx={{ flexGrow: 1 }}>
              {asset && (
                <DeleteAssetButton
                  handleCloseForm={handleClose}
                  asset={asset}
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
                    onClick={(e) => {
                      e.preventDefault();
                      handleClose();
                    }}
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
                  {asset ? "Save" : "Create"}
                </Button>
              </>
            )}
          </Observer>
        </Grid>
      }
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "end",
          height: "550px",
          width: "100%",
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            flexGrow: 1,
            px: 3,
            pt: 4,
            height: "100%",
            overflow: "auto",
          }}
        >
          <Observer>
            {() => (
              <>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                  <Box sx={{ flexBasis: "38%" }}>
                    <OrangeryTextField
                      label="NAME"
                      type="text"
                      name="name"
                      placeholder="Enter Name"
                      startIcon={<TagIcon />}
                      error={!!state.name.error}
                      value={state.name.value}
                      helperText={state.name.error}
                      onChange={(e: any) => (state.name.value = e.target.value)}
                    />
                  </Box>

                  <Box sx={{ flexBasis: "32%" }}>
                    <OrangeryTextField
                      label="SERIAL NUMBER"
                      type="text"
                      placeholder="MDH12345-21352"
                      startIcon={<BarcodeIcon />}
                      value={state.serial_number.value}
                      error={!!state.serial_number.error}
                      helperText={state.serial_number.error}
                      onChange={(e) =>
                        (state.serial_number.value = e.target.value)
                      }
                    />
                  </Box>

                  {!asset && (
                    <Box sx={{ flexBasis: "18%" }}>
                      <Box sx={{ width: "100%", height: "85px" }}>
                        <NumberFormat
                          customInput={TextField}
                          label="STOCK"
                          InputProps={{
                            startAdornment: (
                              <InputAdornment
                                position="start"
                                sx={{ "& .stock-icon": { width: "0.95rem" } }}
                              >
                                <CapacityIcon className="stock-icon" />
                              </InputAdornment>
                            ),
                          }}
                          type="text"
                          allowNegative={false}
                          value={state.stock.value?.toString()}
                          error={!!state.stock.error}
                          helperText={state.stock.error}
                          onChange={(e: any) =>
                            (state.stock.value = parseInt(e.target.value))
                          }
                        />
                      </Box>
                    </Box>
                  )}

                  <Box sx={{ flexBasis: "28%" }}>
                    <Box sx={{ width: "100%", height: "85px" }}>
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
                              sx={{ "& .euro-icon": { width: "0.75rem" } }}
                            >
                              <EuroIcon className="euro-icon" />
                            </InputAdornment>
                          ),
                        }}
                        type="text"
                        // thousandSeparator={true}
                        allowNegative={false}
                        decimalScale={2}
                        error={!!state.price.error}
                        helperText={state.price.error}
                        onChange={(e: any) =>
                          (state.price.value = parseFloat(e.target.value))
                        }
                        disabled={!!asset?.tenant_office_uuid}
                      />
                    </Box>
                  </Box>
                </Box>

                <Box
                  sx={{
                    display: "flex",
                    alignItems: "start",
                    gap: 2,
                    flexDirection: "column",
                  }}
                >
                  <Observer>
                    {() => (
                      <OrangeryCoworkerAutocomplete
                        disabled={state.stock.value > 1}
                        labelsWithRole
                        withoutVisitors
                        label="ASSIGN"
                        name="user_uuid"
                        error={!!state.user_uuid.error}
                        helperText={state.user_uuid.error}
                        placeholder="Select User"
                        icon={<UserIcon />}
                        value={state.user_uuid.value}
                        onChange={(newValue) => {
                          state.user_uuid.value = newValue;
                        }}
                      />
                    )}
                  </Observer>

                  <Observer>
                    {() => (
                      <UploadImageComponent
                        limit={1}
                        sx={{ width: "100%" }}
                        images={state.image_uuids.values?.map((v) => v.value)}
                        handleChange={(newValues) => {
                          newValues.forEach((e) => {
                            const i = state.image_uuids.values.findIndex(
                              (v) => v.value === e
                            );
                            if (i === -1) {
                              state.image_uuids.pushElementValue(e);
                            }
                          });
                          state.image_uuids.values.forEach((v, j) => {
                            const i = newValues.findIndex((e) => v.value === e);
                            if (i === -1) {
                              state.image_uuids.deleteElementValue(j);
                            }
                          });
                        }}
                      />
                    )}
                  </Observer>

                  <Observer>
                    {() => (
                      <OrangeryUploadPDF
                        file={state.invoice_uuid.value}
                        onAdd={(uuid) => {
                          state.invoice_uuid.value = uuid;
                          // onChange(state.data);
                        }}
                        onRemove={(uuid) => {
                          state.invoice_uuid.value = "";
                        }}
                      />
                    )}
                  </Observer>
                </Box>
                <Box sx={{ height: "32px" }} />
              </>
            )}
          </Observer>
        </Box>

        <Observer>
          {() => (
            <>
              {!asset?.tenant_office_uuid && (
                <Box
                  sx={{
                    width: "359px",
                    height: "550px",
                    backgroundColor: "#F7F8FA",
                    p: 3,
                  }}
                >
                  <OrangerySwitch
                    label={{ checked: "Published", unchecked: "Published" }}
                    checkedLabels={{
                      checked: "On",
                      unchecked: "Off",
                    }}
                    checked={state.active.value}
                    onChange={(e) => (state.active.value = e.target.checked)}
                  />
                </Box>
              )}
            </>
          )}
        </Observer>
      </Box>
    </OrangeryFormWrapper>
  );
}
