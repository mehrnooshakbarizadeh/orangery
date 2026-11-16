// contexts & globals
import { useGlobalState } from "../../../../Contexts & Globals/GlobalContext";

// react & next
import React from "react";

// external dependencies
import { Box, Button, IconButton, Typography } from "@mui/material";
import { makeAutoObservable } from "mobx";
import { Observer } from "mobx-react-lite";

// orangery elements & internal dependencies
import {
  ArrayValueState,
  FieldError,
  FormError,
  ValueState,
} from "../../../../states/mobx-form";
import { OrangerySwitch, OrangeryToast } from "../../../OrangeryElements";
import OfferStepper from "./OfferStepper";
import DeleteOfferButton from "./DeleteOfferButton";
import OverviewContent from "./preview/OverviewContent";

// queries & backend
import {
  IOffer,
  IOfferResult,
  useUpsertOffer,
} from "../../../../queries/tenant";

// icons, images & colors
import CrossIcon from "../../../../assets/svg/cross.svg";
import ArrowRightIcon from "../../../../assets/svg/arrow-right.svg";
import ArrowLeftIcon from "../../../../assets/svg/arrow-left.svg";
import SidebarSwitchs from "./SidebarSwitchs";
import Form1 from "./Form1";
import Form2 from "./Form2";
import Form3 from "./Form3";

export class OfferFieldsState {
  public uuid;
  public name;
  public description;
  public instructions;
  public images;
  public desks;
  public room_uuids;
  public assets;
  public documents;
  public price;
  public product_type;
  public date_picker;
  public hourly_select;
  public sale_price;
  public minimum_contract_duration;
  public tax_rate;
  public payment_method;
  public quantity;
  public deposit;
  public contract_start_date;
  public contract_end_date;
  public create_dashboard_for_tenant;
  public auto_confirm_request;
  public offer_is_free;
  public published;
  public payable_via_invoice;
  public force_invoice_payment;
  public marketplace;
  public status;

  public is_wholesale;

  public office_uuid;

  public block_days;

  public error = "";

  public activeStep = 0;
  public mobilityState = false;

  public result: IOfferResult | null = null;

  public updateAll;

  constructor(office_uuid: string, offer?: IOffer, updateAll?: boolean) {
    this.office_uuid = new ValueState(office_uuid);

    this.updateAll = new ValueState<boolean | undefined>(updateAll);

    if (offer) {
      this.uuid = new ValueState(offer.uuid);
      this.name = new ValueState(offer.name);
      this.description = new ValueState(offer.description);
      this.product_type = new ValueState(offer.product_type);
      this.date_picker = new ValueState<boolean>(offer.date_picker ?? false); //  || true
      this.hourly_select = new ValueState(offer.hourly_select);
      this.instructions = new ValueState(offer.instructions ?? "");
      this.payable_via_invoice = new ValueState(offer.payable_via_invoice);
      this.force_invoice_payment = new ValueState(offer.force_invoice_payment);
      this.images = new ArrayValueState<string>(
        offer.images.map((image) => image.uuid) ?? ""
      );
      this.desks = new ArrayValueState(offer.desks.map((desk) => desk.uuid));
      this.room_uuids = new ArrayValueState(
        offer.rooms.map((room) => room.uuid)
      );
      this.assets = new ArrayValueState(
        offer.assets.map((asset) => asset.uuid)
      );
      this.documents = new ArrayValueState<string>(
        offer.documents.map((document) => document.uuid)
      );
      this.price = new ValueState(offer.price);
      this.sale_price = new ValueState(offer.sale_price);
      this.deposit = new ValueState(offer.deposit);
      this.published = new ValueState(offer.published);
      this.marketplace = new ValueState(offer.marketplace);
      this.status = new ValueState(!offer.status);
      this.offer_is_free = new ValueState(offer.offer_is_free);
      this.minimum_contract_duration = new ValueState(
        offer.minimum_contract_duration
      );
      this.tax_rate = new ValueState(offer.tax_rate);
      this.payment_method = new ValueState(offer.payment_method);
      this.quantity = new ValueState(offer.quantity);
      this.contract_start_date = new ValueState(offer.contract_start_date);
      this.contract_end_date = new ValueState(null);
      this.create_dashboard_for_tenant = new ValueState(
        offer.create_dashboard_for_tenant
      );
      this.auto_confirm_request = new ValueState(offer.auto_confirm_request);

      this.is_wholesale = new ValueState<boolean>(offer.is_wholesale ?? false);

      this.block_days = new ArrayValueState<string>(
        (offer.block_days ?? []).map((blockDay) => blockDay)
      );
    } else {
      this.uuid = new ValueState("");
      this.name = new ValueState("");
      this.description = new ValueState("");
      this.instructions = new ValueState("");
      this.product_type = new ValueState("private_office");
      this.payable_via_invoice = new ValueState(false);
      this.force_invoice_payment = new ValueState(false);
      this.images = new ArrayValueState<string>([]);
      this.documents = new ArrayValueState<string>([]);
      this.desks = new ArrayValueState<string>([]);
      this.room_uuids = new ArrayValueState<string>([]);
      this.assets = new ArrayValueState<string>([]);
      this.price = new ValueState(0);
      this.published = new ValueState(true);
      this.marketplace = new ValueState(false);
      this.status = new ValueState(false);
      this.sale_price = new ValueState(0);
      this.minimum_contract_duration = new ValueState(null);
      this.tax_rate = new ValueState(19);
      this.quantity = new ValueState(0);
      this.deposit = new ValueState(0);
      this.offer_is_free = new ValueState(false);
      this.payment_method = new ValueState("subscription");
      this.contract_start_date = new ValueState(new Date());
      this.contract_end_date = new ValueState(null);
      this.create_dashboard_for_tenant = new ValueState(false);
      this.auto_confirm_request = new ValueState(true);
      this.date_picker = new ValueState<boolean>(true);
      this.hourly_select = new ValueState(false);

      this.is_wholesale = new ValueState(false);

      this.block_days = new ArrayValueState<string>([]);
    }

    makeAutoObservable(this);
  }

  get data() {
    let contract_start_date = new Date(this.contract_start_date.value);
    let formattedContractStartDate = `${contract_start_date.getFullYear()}-${
      contract_start_date.getMonth() + 1
    }-${contract_start_date.getDate()}`; //  ${contract_start_date.getHours()}:${contract_start_date.getMinutes()}

    return {
      uuid: this.uuid.value,
      name: this.name.value,
      description: this.description.value,
      payable_via_invoice: this.payable_via_invoice.value,
      force_invoice_payment: this.force_invoice_payment.value,
      instructions: this.instructions.value,
      images: this.images.values.map((v) => v.value),
      documents: this.documents.values.map((v) => v.value),
      desks: this.desks.values.map((v) => v.value),
      room_uuids: this.room_uuids.values.map((r) => r.value),
      assets: this.assets.values.map((v) => v.value),
      price: this.offer_is_free.value ? 0 : this.price.value,
      product_type: this.product_type.value,
      sale_price: this.offer_is_free.value ? 0 : this.sale_price.value,
      published: this.published.value,
      offer_is_free: this.offer_is_free.value,
      marketplace: this.marketplace.value,
      status: !this.status.value,
      quantity: this.quantity.value,
      deposit: this.offer_is_free.value ? 0 : this.deposit.value,
      minimum_contract_duration: this.minimum_contract_duration.value,
      tax_rate: this.offer_is_free.value ? 0 : this.tax_rate.value,
      date_picker: this.date_picker.value,
      hourly_select: this.hourly_select.value,
      payment_method: this.payment_method.value,
      contract_start_date: formattedContractStartDate, ////////!!!!!!!! should be revised
      create_dashboard_for_tenant: this.create_dashboard_for_tenant.value,
      auto_confirm_request: this.auto_confirm_request.value,
      office_uuid: this.office_uuid.value,
      contract_end_date: null,
      // ...(this.payment_method.value === "subscription"
      //   ? { contract_end_date: this.contract_end_date.value }
      //   : {}),

      is_wholesale: this.is_wholesale.value,

      updateAll: this.updateAll.value,

      block_days: this.block_days.values.map((v) => v.value),
    };
  }

  clearErrors() {
    this.name.clearError();
    this.description.clearError();
    this.instructions.clearError();
    this.desks.clearError();
    this.room_uuids.clearError();
    this.assets.clearError();
    this.payable_via_invoice.clearError();
    this.force_invoice_payment.clearError();
    this.documents.clearError();
    this.price.clearError();
    this.sale_price.clearError();
    this.product_type.clearError();
    this.marketplace.clearError();
    this.published.clearError();
    this.status.clearError();
    this.offer_is_free.clearError();
    this.quantity.clearError();
    this.deposit.clearError();
    this.minimum_contract_duration.clearError();
    this.date_picker.clearError();
    this.hourly_select.clearError();
    this.tax_rate.clearError();
    this.payment_method.clearError();
    this.contract_start_date.clearError();
    this.contract_end_date.clearError();
    this.create_dashboard_for_tenant.clearError();
    this.auto_confirm_request.clearError();

    this.is_wholesale.clearError();

    this.block_days.clearError();

    this.error = "";
  }

  setMobility(value: boolean) {
    this.mobilityState = value;
  }

  setProducttype(offerType: string) {
    this.product_type.value = offerType;

    switch (this.product_type.value) {
      case "private_office":
        this.payment_method.value = "subscription";
        this.date_picker.value = false;
        this.hourly_select.value = false;
        break;

      case "flex":
        this.payment_method.value = "one_time_payment";
        this.date_picker.value = true;
        this.hourly_select.value = false;
        break;

      case "cube":
        this.payment_method.value = "one_time_payment";
        this.date_picker.value = true;
        this.hourly_select.value = true;
        break;

      default:
        this.payment_method.value = "one_time_payment";
        this.date_picker.value = false;
        this.hourly_select.value = false;
    }
  }

  setDateHourlyValue() {
    if (this.payment_method.value === "subscription") {
      this.date_picker.value = false;
      this.hourly_select.value = false;
    } else {
      this.date_picker.value = this.date_picker.value;
      this.hourly_select.value = this.hourly_select.value;
    }
  }

  updateQuantity(value: number) {
    // let total = this.desks.values.length + this.assets.values.length + this.room_uuids.values.length
    // if (total > 0) {
    //   this.quantity.value = total;
    // } else {
    this.quantity.value = value;
    // }
  }

  validateInitialSetup() {
    let valid = true;
    this.clearErrors();
    if (!this.name.value) {
      this.name.error = "Please fill your desk name";
      valid = false;
    }
    if (!this.product_type.value) {
      this.product_type.error = "Please select offer type";
      valid = false;
    }
    return valid;
  }

  validateIncludeItems() {
    let valid = true;
    this.clearErrors();

    switch (this.product_type.value) {
      case "private_office":
        // this.updateQuantity(this.desks.values.length + this.assets.values.length + this.room_uuids.values.length);

        // if (this.room_uuids.values.length < 1) {
        //   this.room_uuids.error = "Please choose at least one room";
        //   valid = false;
        // }
        break;

      case "flex":
        // this.updateQuantity(this.desks.values.length + this.assets.values.length + this.room_uuids.values.length);

        // if (this.desks.values.length + this.assets.values.length < 1) {
        //   this.desks.error = "Please choose at least one desk or asset";
        //   this.assets.error = "Please choose at least one desk or asset";
        //   valid = false;
        // }
        break;

      case "cube":
        break;

      default:
    }

    return valid;
  }

  validatePaymentDetails() {
    let valid = true;
    this.clearErrors();
    this.setDateHourlyValue();
    if (!this.price.value && !this.offer_is_free.value) {
      this.price.error = "Please choose price";
      valid = false;
    }

    if (
      !(this.product_type.value === "mobility" && this.hourly_select.value) &&
      !this.quantity.value &&
      this.desks.values.length < 1 &&
      this.assets.values.length < 1 &&
      this.room_uuids.values.length < 1
    ) {
      this.quantity.error = "Please write quantity";
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
    } else if (error.field === "product_type") {
      this.product_type.error = error.error;
    } else if (error.field === "name") {
      this.name.error = error.error;
    } else if (error.field === "description") {
      this.description.error = error.error;
    } else if (error.field === "desks") {
      this.desks.error = error.error;
    } else if (error.field === "assets") {
      this.assets.error = error.error;
    } else if (error.field === "documents") {
      this.documents.error = error.error;
    } else if (error.field === "price") {
      this.price.error = error.error;
    } else if (error.field === "sale_price") {
      this.sale_price.error = error.error;
    } else if (error.field === "quantity") {
      this.quantity.error = error.error;
    } else if (error.field === "tax_rate") {
      this.tax_rate.error = error.error;
    } else if (error.field === "payment_method") {
      this.payment_method.error = error.error;
    }
  }

  setActiveStep(value: number) {
    this.activeStep = value;
  }

  setResult(value: IOfferResult) {
    this.result = value;
  }
}

export default function HandleOfferForm({
  offer,
  handleClose,
  handleDone,
  updateAll,
}: {
  offer?: IOffer;
  handleClose: () => void;
  handleDone: () => void;
  updateAll?: boolean;
}) {
  const { office_uuid } = useGlobalState();
  const state = React.useMemo(
    () => new OfferFieldsState(office_uuid, offer, updateAll),
    [office_uuid, offer, updateAll]
  );

  return (
    <>
      <Observer>
        {() => (
          <>
            {!state.result && (
              <BaseForm state={state} offer={offer} handleClose={handleClose} />
            )}
            {state.result && (
              <OverviewContent
                overview={state.result}
                handleDone={handleDone}
              />
            )}
          </>
          // <div>{JSON.stringify(state.result)}</div>
        )}
      </Observer>
    </>
  );
}

function BaseForm({
  state,
  offer,
  handleClose,
}: {
  state: OfferFieldsState;
  offer?: IOffer;
  handleClose: () => void;
}) {
  let editMode = offer ? true : false;

  const mutation = useUpsertOffer();

  const handleNext = (e: React.MouseEvent) => {
    e.preventDefault();

    let valid = true;
    if (state.activeStep === 0) {
      valid = state.validateInitialSetup();
    }
    if (state.activeStep === 1) {
      valid = state.validateIncludeItems();
    }
    if (state.activeStep === 2) {
      valid = state.validatePaymentDetails();
      if (valid) {
        handleSubmit();
        return;
      }
    }

    if (!valid) {
      return;
    }
    if (state.product_type.value === "mobility") {
      const mobilitystep = 2;
      state.setActiveStep(mobilitystep);
    } else {
      const newActiveStep = state.activeStep + 1;
      state.setActiveStep(newActiveStep);
    }
  };
  const handleBack = (e: React.MouseEvent) => {
    e.preventDefault();
    if (state.activeStep <= 0) return;
    if (state.product_type.value === "mobility") {
      state.setActiveStep(0);
    } else state.setActiveStep(state.activeStep - 1);
  };

  async function handleSubmit() {
    if (!state.validatePaymentDetails()) {
      return;
    }
    try {
      const result = await mutation.mutateAsync(state.data);
      state.setResult(result);
      if (offer) {
        handleClose();
      }
      if (offer) {
        OrangeryToast("Successfully edited " + state.data.name, "success");
      } else {
        OrangeryToast("Successfully created " + state.data.name, "success");
      }
    } catch (err: any) {
      state.setupErrors(err);
    }
  }

  return (
    <>
      <Box
        sx={{
          pr: 3,
          pl: 4,
          py: 1.8,
          gap: 4,
          display: "flex",
          // flexDirection: 'column',
          justifyContent: "space-between",
          alignItems: "center",
          borderBottom: "1px solid #EDEEF0",
        }}
      >
        <Typography sx={{ fontSize: 24, fontWeight: 600, color: "#000" }}>
          {offer
            ? "Edit a rental property offer"
            : "Create a rental property offer"}
        </Typography>
        <Box sx={{ width: "44%" }}>
          <Observer>
            {() => (
              <OfferStepper
                state={state}
                activeStep={state.activeStep}
                mobilityState={state.mobilityState}
                mobilityProduct={state.product_type.value}
              />
            )}
          </Observer>
        </Box>

        <IconButton
          onClick={handleClose}
          sx={{
            display: "flex",
            "& .cancel-icon": { width: "1.3rem", height: "1.3rem" },
          }}
        >
          <CrossIcon className="cancel-icon" />
        </IconButton>
      </Box>

      <Box
        sx={{
          display: "flex",
          // gridTemplateColumns: "70% 30%",
          height: " calc(100% - 82px)",
          gap: 2,
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            flexGrow: 1,
            pr: "41px",
            pt: 5,
            pl: 4,
            width: "68%",
            // mr: 2,
            mt: 2,
            height: "85%",
            overflow: "auto",
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
          <Observer>
            {() => (
              <React.Fragment>
                {state.activeStep === 0 && <Form1 state={state} />}
                {state.activeStep === 1 && <Form2 state={state} />}
                {state.activeStep === 2 && (
                  <Form3 state={state} editMode={editMode} />
                )}
              </React.Fragment>
            )}
          </Observer>
        </Box>
        <SidebarSwitchs state={state} />
      </Box>
      <Box
        sx={{
          width: "100%",
          pt: 2,
          borderTop: "1px solid #EDEEF0",
          display: "flex",
          gap: 2,
          pr: 2,
          position: "absolute",
          right: 0,
          bottom: "16px",
          justifyContent: "end",
          "& .add-btn": { width: "1.3rem", height: "1.3rem" },
        }}
      >
        <Box sx={{ flexGrow: 1, pl: 6 }}>
          {offer && (
            <DeleteOfferButton
              handleCloseForm={handleClose}
              offer={offer}
              label="Remove"
              sx={{ color: "red" }}
            />
          )}
        </Box>
        <Observer>
          {() => (
            <>
              {state.activeStep !== 0 ? (
                <Button
                  variant="text"
                  disabled={state.activeStep === 0}
                  onClick={handleBack}
                  sx={{
                    display: "flex",
                    gap: 2,
                    mr: 1,
                    py: "12px",
                    px: 5,
                  }}
                >
                  <ArrowLeftIcon className="add-btn" />
                  <Typography variant="h5" color="#2B2E33">
                    Back
                  </Typography>
                </Button>
              ) : (
                <Button
                  variant="text"
                  // disabled={state.activeStep === 0}
                  onClick={handleClose}
                  sx={{
                    display: "flex",
                    gap: 2,
                    mr: 1,
                    py: "12px",
                    px: 5,
                  }}
                >
                  <Typography variant="h5" color="#2B2E33">
                    Cancel
                  </Typography>
                </Button>
              )}
            </>
          )}
        </Observer>

        <Observer>
          {() => (
            <Button
              onClick={handleNext}
              sx={{
                display: "flex",
                gap: 2,
                mr: 1,
                py: "12px",
                px: 5,
              }}
              color="primary"
              variant="contained"
              disabled={mutation.isLoading}
            >
              {state.activeStep === 2 ? (
                <Typography className="add-letter">
                  {offer ? "Save" : "Create"}
                </Typography>
              ) : (
                <>
                  <Typography className="add-letter">Next</Typography>
                  <ArrowRightIcon className="add-btn" />
                </>
              )}
            </Button>
          )}
        </Observer>
      </Box>
    </>
  );
}
