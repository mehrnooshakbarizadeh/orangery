import React from "react";

// external dependencies
import {
  Box,
  Button,
  Typography,
  Link,
  TextField,
  InputAdornment,
  MenuItem,
  TextFieldProps,
} from "@mui/material";
import { makeAutoObservable } from "mobx";
import { Observer } from "mobx-react-lite";
import NumberFormat from "react-number-format";

// icons, images & colors
import CountryIcon from '../../../../assets/svg/payment/bankAccount/country.svg';
import BankIcon from '../../../../assets/svg/payment/bankAccount/bank.svg';

import {
  IBankAccount,
  IBankAccountParams,
  useUpsertBankAccount,
  useCountryBanks,
  ICountry,
  IBank,
  useBankOptions,
} from "../../../../queries/bankAccount";
import { FieldError, FormError, ValueState } from "../../../../states/mobx-form";
import {
  OrangeryNavigationContentLoader,
  OrangeryCloseButton,
  OrangeryToast,
  OrangeryAutocomplete
} from "../../../OrangeryElements";
import { useGlobalState } from "../../../../Contexts & Globals/GlobalContext";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import DeleteBankAccountFormButton from "./DeleteBankAccountButton";

export class BankAccountFormState {
  public activeStep;
  public selectedCountry: Partial<ICountry> = {};
  public selectedBank: Partial<IBank> = {};

  public office_uuid;

  public uuid;

  public country_uuid;
  public bank_uuid;
  public receive_option;
  public access_detail;

  public error = "";

  constructor(office_uuid: string, bankAccount?: IBankAccount) {
    this.activeStep = new ValueState<number>(0);

    this.office_uuid = new ValueState(office_uuid);
    if (bankAccount) {
      this.uuid = new ValueState(bankAccount.uuid);
      this.country_uuid = new ValueState(bankAccount.country.uuid);
      this.bank_uuid = new ValueState(bankAccount.bank.uuid);
      this.receive_option = new ValueState(bankAccount.bank.receive_option?.uuid ?? "-");
      this.access_detail = new ValueState(bankAccount.bank.access_detail?.uuid ?? "-");
    } else {
      this.uuid = new ValueState("");
      this.country_uuid = new ValueState("");
      this.bank_uuid = new ValueState("");
      this.receive_option = new ValueState("");
      this.access_detail = new ValueState("");
    }

    makeAutoObservable(this);
  }

  get data() {
    return {
      office_uuid: this.office_uuid.value,

      uuid: this.uuid.value,
      country_uuid: this.country_uuid.value,
      bank_uuid: this.bank_uuid.value,
      receive_option: this.receive_option.value,
      access_detail: this.access_detail.value,
    };
  }

  clearErrors() {
    this.uuid.clearError();
    this.country_uuid.clearError();
    this.bank_uuid.clearError();
    this.receive_option.clearError();
    this.access_detail.clearError();

    this.error = "";
  }

  validate() {
    let valid = true;
    this.clearErrors();

    switch (this.activeStep.value) {
      case 0:
        if (!this.country_uuid.value) {
          this.country_uuid.error = "Please select a country";
          valid = false;
        }
        if (!this.bank_uuid.value) {
          this.bank_uuid.error = "Please select a bank";
          valid = false;
        }

        break;

      case 1:
        if (!this.receive_option.value) {
          this.receive_option.error = "Please select an option";
          valid = false;
        }
        if (!this.access_detail.value) {
          this.access_detail.error = "Please select an option";
          valid = false;
        }

        break;

      default:
        { }
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
    } else if (error.field === "country_uuid") {
      this.country_uuid.error = error.error;
    } else if (error.field === "bank_uuid") {
      this.bank_uuid.error = error.error;
    } else if (error.field === "receive_option") {
      this.receive_option.error = error.error;
    } else if (error.field === "access_detail") {
      this.access_detail.error = error.error;
    }
  }
}

export default function BankAccountForm({
  bankAccount,
  handleClose,
  noCancel,
  noRemove,
}: {
  bankAccount?: IBankAccount;
  handleClose: () => void;
  noCancel?: any;
  noRemove?: any;
}) {
  const { office_uuid } = useGlobalState();
  const state = React.useMemo(
    () => new BankAccountFormState(office_uuid, bankAccount),
    [office_uuid, bankAccount]
  );

  return (
    <Observer>
      {() => (
        state.activeStep.value === 0
          ? <BankForm
            state={state}
            bankAccount={bankAccount}
            handleClose={handleClose}
            noCancel={noCancel}
            noRemove={noRemove}
          />
          : <OptionsForm
            state={state}
            bankAccount={bankAccount}
            handleClose={handleClose}
            noCancel={noCancel}
            noRemove={noRemove}
          />
      )}
    </Observer>
  )
}

function BankForm({
  state,
  bankAccount,
  handleClose,
  noCancel,
  noRemove,
}: {
  state: BankAccountFormState;
  bankAccount?: IBankAccount;
  handleClose: () => void;
  noCancel?: any;
  noRemove?: any;
}) {
  const {
    data: countryBanks,
    isLoading,
    isError
  } = useCountryBanks();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!state.validate()) {
      return;
    }
    state.activeStep.value = 1
  }

  return <Box
    sx={{
      position: "relative",
      width: {
        xs: "95%",
        md: 898
      }
    }}
  >
    <OrangeryCloseButton onClose={handleClose} />
    <Observer>
      {() => (
        <Box
          sx={{
            px: 3,
            py: 2,
            // pt: "12px",
            mb: 3.5,
            display: "flex",
            justifyContent: "start",
            alignItems: "center",
            borderBottom: (theme) => `1px solid ${theme.palette.grey[400]}`,
          }}
        >
          <Typography
            sx={{ flexGrow: 1, fontSize: 20, fontWeight: 800 }}
            color={(theme) => theme.palette.primary.light}
          >
            {bankAccount ? "Edit Bank Account" : "Add Bank Account"}
          </Typography>
        </Box>
      )}
    </Observer>
    {isLoading
      ? <OrangeryNavigationContentLoader />
      : <Box
        sx={{
          px: 3,
          mb: 3
        }}
      >
        {countryBanks && countryBanks.length > 0
          ? <form onSubmit={handleSubmit}>
            <Observer>
              {() => (
                <>
                  <Box sx={{
                    display: "flex",
                    flexDirection: "row",
                    flexWrap: "wrap",
                  }}
                  >
                    <Box
                      sx={{
                        flexBasis: {
                          xs: "100%",
                          sm: "50%"
                        },
                        pr: {
                          xs: 0,
                          sm: 1
                        },
                      }}
                    >
                      <OrangeryAutocomplete
                        options={countryBanks.map((country) => ({ label: country.name, value: country.uuid }))}
                        label="SELECT COUNTRY"
                        name="country_uuid"
                        placeholder="Choose a country"
                        icon={<CountryIcon />}
                        value={state.country_uuid.value}
                        error={!!state.country_uuid.error}
                        helperText={state.country_uuid.error}
                        onChange={(newValue) => {
                          state.country_uuid.value = newValue;
                          state.selectedCountry = countryBanks.find((country) => country.uuid === newValue) ?? {}
                        }}
                      />
                    </Box>

                    <Box
                      sx={{
                        flexBasis: {
                          xs: "100%",
                          sm: "50%"
                        },
                        pl: {
                          xs: 0,
                          sm: 1
                        },
                        mt: {
                          xs: 2,
                          sm: 0
                        },
                      }}
                    >
                      <OrangeryAutocomplete
                        options={state.selectedCountry?.banks?.map((bank) => ({ label: bank.name ?? "-", value: bank.uuid ?? "-" })) ?? []}
                        label="SELECT BANK"
                        name="bank_uuid"
                        placeholder="Choose a bank"
                        icon={<BankIcon />}
                        value={state.bank_uuid.value}
                        error={!!state.bank_uuid.error}
                        helperText={state.bank_uuid.error}
                        onChange={(newValue) => {
                          state.bank_uuid.value = newValue;
                          state.selectedBank = state.selectedCountry?.banks?.find((bank) => bank.uuid === newValue) ?? {}
                        }}
                        disabled={!state.country_uuid.value}
                      />
                    </Box>
                  </Box>
                </>
              )}
            </Observer>

            <Box
              sx={{
                display: "flex",
                justifyContent: "flex-end",
                alignItems: "center",
                mt: 10,
              }}
            >
              {!noRemove && (
                <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', alignItems: "flex-start" }}>
                  {bankAccount && (
                    <DeleteBankAccountFormButton
                      handleCloseForm={handleClose}
                      bankAccount={bankAccount}
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
                          color: (theme) => theme.palette.grey.A200,
                          backgroundColor: (theme) => theme.palette.grey[200],
                          mr: 2,
                        }}
                      >
                        CANCEL
                      </Button>
                    )}
                    <Button
                      variant="contained"
                      type="submit"
                      color="primary"
                      sx={{
                        width: 170,
                        height: 55,
                        fontSize: 20,
                        color: "#fff",
                      }}
                    >
                      {bankAccount
                        ? "SAVE"
                        : "CONNECT"}
                    </Button>
                  </>
                )}
              </Observer>
            </Box>
          </form>
          : <>No country/bank is available.</>
        }
      </Box>
    }
  </Box >
}

function OptionsForm({
  state,
  bankAccount,
  handleClose,
  noCancel,
  noRemove,
}: {
  state: BankAccountFormState;
  bankAccount?: IBankAccount;
  handleClose: () => void;
  noCancel?: any;
  noRemove?: any;
}) {
  const { office_uuid } = useGlobalState();
  const mutation = useUpsertBankAccount();

  const {
    data: bankOptions,
    isLoading,
    isError
  } = useBankOptions(office_uuid, state.selectedBank?.uuid);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!state.validate()) {
      return;
    }
    try {
      await mutation.mutateAsync(state.data);
      OrangeryToast(`Successfully ${bankAccount ? "edited" : "created"}.`, "success");
    } catch (err: any) {
      state.setupErrors(err);
    }
  }

  return <Box
    sx={{
      position: "relative",
      width: {
        xs: "95%",
        sm: 429
      }
    }}
  >
    <OrangeryCloseButton onClose={handleClose} />
    <Observer>
      {() => (
        <Box
          sx={{
            pr: 3,
            pl: 4,
            py: 2,
            // pt: "12px",
            mb: 3.5,
            display: "flex",
            justifyContent: "start",
            alignItems: "center",
            // borderBottom: (theme) => `1px solid ${theme.palette.grey[400]}`,
          }}
        >
          <Typography
            sx={{ flexGrow: 1, fontSize: 20, fontWeight: 800 }}
            color={(theme) => theme.palette.primary.light}
          >
            {bankAccount ? " " : " "}
          </Typography>
        </Box>
      )}
    </Observer>
    {isLoading
      ? <OrangeryNavigationContentLoader />
      : <Box
        sx={{
          px: 3,
          mb: 3
        }}
      >
        {bankOptions?.receive_options && bankOptions?.access_details
          ? <form onSubmit={handleSubmit}>
            <Observer>
              {() => (
                <>
                  <Box sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 3
                  }}
                  >
                    <Box sx={{
                      display: "flex",
                      flexDirection: "column",
                    }}
                    >
                      <Typography
                        sx={{ fontWeight: 700 }}
                      >
                        Orangery
                      </Typography>
                      <Typography>
                        Requests access to your <Link
                          href={state.selectedBank?.link}
                          target="_blank"
                          sx={{ textDecoration: "none", color: "blue" }}
                        >
                          {state.selectedBank?.name}
                        </Link> account information
                      </Typography>
                    </Box>

                    <Box
                      sx={{
                        flexBasis: {
                          xs: "100%",
                        },
                      }}
                    >
                      <OrangeryAutocomplete
                        options={bankOptions.receive_options?.map((receiveOption) => ({ label: receiveOption.name, value: receiveOption.uuid })) ?? []}
                        label=""
                        name="receive_option"
                        placeholder="What orangery Will Receive"
                        // icon={<CountryIcon />}
                        value={state.receive_option.value}
                        error={!!state.receive_option.error}
                        helperText={state.receive_option.error}
                        onChange={(newValue) => {
                          state.receive_option.value = newValue;
                        }}
                      />
                    </Box>

                    <Box
                      sx={{
                        flexBasis: {
                          xs: "100%",
                        },
                      }}
                    >
                      <OrangeryAutocomplete
                        options={bankOptions.access_details?.map((accessDetail) => ({ label: accessDetail.name, value: accessDetail.uuid })) ?? []}
                        label=""
                        name="access_detail"
                        placeholder="Access Details"
                        // icon={<CountryIcon />}
                        value={state.access_detail.value}
                        error={!!state.access_detail.error}
                        helperText={state.access_detail.error}
                        onChange={(newValue) => {
                          state.access_detail.value = newValue;
                        }}
                      />
                    </Box>
                  </Box>
                </>
              )}
            </Observer>

            <Box
              sx={{
                display: "flex",
                justifyContent: "flex-end",
                alignItems: "center",
                mt: 10,
              }}
            >
              <Observer>
                {() => (
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      gap: 3
                    }}
                  >
                    <Button
                      variant="contained"
                      type="submit"
                      color="primary"
                      disabled={mutation.isLoading}
                      sx={{
                        width: "100%",
                        height: 55,
                        fontSize: 20,
                        color: "#fff",
                      }}
                    >
                      I AGREE
                    </Button>
                    <Typography
                      sx={{
                        textAlign: "center"
                      }}
                    >
                      By using this service and clicking &quot;I AGREE&quot;, you agree to <Link
                        href={"https://orangery.io/agb"}
                        target="_blank"
                        sx={{ textDecoration: "none", color: "blue" }}
                      >orangery Terms and Condition</Link> and <Link
                        href={"https://orangery.io/privacy-policy"}
                        target="_blank"
                        sx={{ textDecoration: "none", color: "blue" }}
                      >Privacy Policy</Link>.
                    </Typography>
                    <Box
                      sx={{
                        objectFit: "contain",
                        width: "150px",
                      }}
                      component={"img"}
                      src={`${process.env.NEXT_PUBLIC_BASE_PATH}/assets/Orangery-OS.png`}
                      loading="lazy"
                    />
                  </Box>
                )}
              </Observer>
            </Box>
          </form>
          : <>No bank options is available.</>
        }
      </Box>
    }
  </Box >
}


// function BaseForm({
//   state,
//   bankAccount,
//   handleClose,
// }: {
//   state: BankAccountFormState;
//   bankAccount?: IBankAccount;
//   handleClose: () => void;
// }) {
//   const mutation = useUpsertBankAccount();
//   const handleNext = (e: React.MouseEvent) => {
//     e.preventDefault();

//     let valid = true;
//     valid = state.validate();
//     if (state.activeStep.value === 1) {
//       if (valid) {
//         handleSubmit();
//         return;
//       }
//     }

//     if (!valid) {
//       return;
//     }

//     state.activeStep.value = state.activeStep.value + 1
//   };

//   const handleBack = (e: React.MouseEvent) => {
//     e.preventDefault();
//     if (state.activeStep.value <= 0) return;
//     state.activeStep.value = state.activeStep.value - 1
//   };

//   async function handleSubmit() {
//     if (!state.validate()) {
//       return;
//     }
//     try {
//       const result = await mutation.mutateAsync(state.data);
//       if (handleClose) {
//         handleClose();
//       }
//       OrangeryToast(`Successfully ${bankAccount ? "edited" : "created"}.`, "success");
//     } catch (err: any) {
//       state.setupErrors(err);
//     }
//   }

//   return (
//     <>
//       <Box
//         sx={{
//           pr: 3,
//           pl: 4,
//           py: 1.8,
//           mb: 1,
//           display: "flex",
//           justifyContent: "end",
//           alignItems: "center",
//           borderBottom: (theme) => `1px solid ${theme.palette.grey[400]}`,
//         }}
//       >
//         {offer ? (
//           <Typography
//             sx={{ flexGrow: 1, fontSize: 20, fontWeight: 800 }}
//             color={(theme) => theme.palette.primary.light}
//           >
//             Create a rental property offer
//           </Typography>
//         ) : (
//           <Typography
//             sx={{ flexGrow: 1, fontSize: 20, fontWeight: 800 }}
//             color={(theme) => theme.palette.primary.light}
//           >
//             Edit a rental property offer
//           </Typography>
//         )}
//         <IconButton
//           onClick={handleClose}
//           sx={{
//             display: "flex",
//             "& .cancel-icon": { width: "1.3rem", height: "1.3rem" },
//           }}
//         >
//           <CrossIcon className="cancel-icon" />
//         </IconButton>
//       </Box>

//       <Observer>
//         {() => (
//           <OfferStepper
//             state={state}
//             activeStep={state.activeStep}
//           // onHandleStep={handleStep(activeStep)}
//           />
//         )}
//       </Observer>
//       <Box
//         sx={{
//           width: "100%",
//           pt: 2,
//           borderTop: "1px solid #bdbdbd",
//           display: "flex",
//           gap: 2,
//           pr: 2,
//           position: "absolute",
//           right: 0,
//           bottom: "16px",
//           justifyContent: "end",
//           "& .add-letter": {
//             fontSize: 18,
//             fontWeight: 400,
//             // color: disabled ? "#000" : "#fff",
//           },
//           "& .add-btn": { width: "1.3rem", height: "1.3rem" },
//         }}
//       >
//         <Box sx={{ flexGrow: 1, pl: 6 }}>
//           {offer && (
//             <DeleteOfferButton
//               handleCloseForm={handleClose}
//               offer={offer}
//               label="Remove"
//               sx={{ color: "red" }}
//             />
//           )}
//         </Box>
//         <Observer>
//           {() => (
//             <Button
//               // color="primary"
//               variant="text"
//               disabled={state.activeStep === 0}
//               onClick={handleBack}
//               sx={{
//                 display: "flex",
//                 gap: 2,
//                 mr: 1,
//                 py: "12px",
//                 px: 5,
//               }}
//             >
//               <ArrowLeftIcon className="add-btn" />
//               <Typography className="add-letter">Back</Typography>
//             </Button>
//           )}
//         </Observer>

//         <Observer>
//           {() => (
//             <Button
//               onClick={handleNext}
//               sx={{
//                 display: "flex",
//                 gap: 2,
//                 mr: 1,
//                 py: "12px",
//                 px: 5,
//               }}
//               color="primary"
//               variant="contained"
//               disabled={mutation.isLoading}
//             >
//               {state.activeStep === 2 ? (
//                 <>
//                   {offer ? (
//                     <Typography className="add-letter">Save</Typography>
//                   ) : (
//                     <Typography className="add-letter">Create</Typography>
//                   )}
//                 </>
//               ) : (
//                 <>
//                   <Typography className="add-letter">Next</Typography>
//                 </>
//               )}
//             </Button>
//           )}
//         </Observer>
//       </Box>
//     </>
//   );
// }
