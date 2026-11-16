import { Box, SwitchProps, Typography } from "@mui/material";
import { useGlobalState } from "../../../../Contexts & Globals/GlobalContext";
import { IBankAccount, useBankAccounts } from "../../../../queries/bankAccount";
import { OrangeryNavigationContentLoader, OrangeryNavigationPlaceholder, OrangeryReadOnlySwitch, OrangeryUserCircle } from "../../../OrangeryElements";
import AddNewBankAccountButton from "./AddNewBankAccountButton";
import PlaceholderSvg from "../../../../assets/svg/placeholders/bankAccount.svg";
import React from "react";
import EditBankAccountButton from "./EditBankAccountButton";
import { Observer } from "mobx-react-lite";

export default function BankAccountFormTable() {
  const globalState = useGlobalState();
  const { data: bankAccounts, isLoading, isError } = useBankAccounts(globalState.office_uuid);

  return (<>
    {isLoading ? (
      <OrangeryNavigationContentLoader />
    ) : bankAccounts && bankAccounts.length > 0 ? (
      <Box
        sx={{
          backgroundColor: "#fff",
          display: "flex",
          flexDirection: "column",
          height: "100%",
          minHeight: 666,
          borderRadius: 1.5,
          py: 3,
          px: 2,
        }}
      >
        <Header button={<AddNewBankAccountButton />} />
        <Box
          sx={{
            overflowY: "auto",
            height: "calc(100vh - 72px)",
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
              <>
                {bankAccounts?.map((bankAccount) => (
                  <BankAccountCard key={bankAccount.uuid} bankAccount={bankAccount} />
                ))}
              </>
            )}
          </Observer>
        </Box>
      </Box>
    ) : (
      <OrangeryNavigationPlaceholder
        title={"Create a new bank account"}
        subtitle={
          "Manage your bank account smartly and quickly."
        }
        PlaceholderSvg={PlaceholderSvg}
        AddNewButton={<AddNewBankAccountButton />}
        addNewButtonText={""}
      />
    )}
  </>)
}

function BankAccountCard({ bankAccount }: { bankAccount: IBankAccount }) {
  return (<>
    <Box sx={{
      display: "flex",
      justifyContent: "space-between",
      py: 3,
      px: 2,
      boxShadow: "1px 1px 8px #0000000a",
      border: "1px solid rgb(210 215 221)",
      alignItems: "center",
      borderRadius: 1.5,
      mb: 1.2,
      mx: 0,
      rowGap: 2,
      fontSize: 16,
      fontWeight: 500,
      "& .cell-align": {
        display: 'flex', flexDirection: 'column',
        gap: 1,
        mr: 2,
        width: "10%",
        flexBasis: "10px",
        flexShrink: 0,
        flexGrow: 1,
        "& .file-name": {
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
        },
      }
    }}
    >
      <Box className="cell-align">
        <Typography variant="subtitle2" color="#A5AAB4">BANK NAME</Typography>
        <Observer>
          {() => (
            <Typography variant="subtitle1" className='file-name'>{bankAccount.bank.name ?? "-"}</Typography>
          )}
        </Observer>
      </Box>
      <Box className="cell-align">
        <Typography variant="subtitle2" color="#A5AAB4">COUNTRY</Typography>
        <Observer>
          {() => (
            <Typography variant="subtitle1">{bankAccount.country.name}</Typography>
          )}
        </Observer>
      </Box>
      <Box className="cell-align">
        <Typography variant="subtitle2" color="#A5AAB4">IBAN</Typography>
        <Observer>
          {() => (
            <Typography variant="subtitle1">{bankAccount.iban}</Typography>
          )}
        </Observer>
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Observer>
          {() => (
            <OrangeryReadOnlySwitch
              pending={bankAccount.is_expired}
              label={{ checked: "Connected", unchecked: "Disconnected", pending: "Expired" }}
              checked={bankAccount.active}
              width={150}
            />
          )}
        </Observer>
        <Box>
          <Observer>
            {() => (
              <EditBankAccountButton
                bankAccount={bankAccount} />
            )}
          </Observer>
        </Box>
      </Box>
    </Box>
  </>)
}

function Header({ button }: { button?: JSX.Element }) {
  const [desc, setDesc] = React.useState(false);

  const handleSort = () => {
    setDesc(!desc);
  };
  return (
    <>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "end",
          mb: 2,
          flexFlow: {
            sx: "column",
            sm: "row",
          },
        }}
      >
        <Box
          sx={{ flexGrow: 1, display: "flex", alignItems: "center", gap: 1 }}
        >
          <Box sx={{ minWidth: 300, maxWidth: 400 }}>{ }</Box>
          <Box
          // sx={{
          //   backgroundColor: (theme) => theme.palette.grey[200],
          //   py: 1.3,
          //   px: 1,
          //   borderRadius: 1,
          //   flexShrink: 0,
          //   "& .sort-icon": { width: "1.3rem", color: "grey.A400" },
          //   "& .sort-button": { minWidth: 46 },
          // }}
          >
            {/* <Button onClick={handleSort} className="sort-button">
                {desc ? (
                  <ArrowDownAZIcon className="sort-icon" />
                ) : (
                  <ArrowUpZAIcon className="sort-icon" />
                )}
              </Button> */}
          </Box>
        </Box>
        <Box
          sx={{
            flexShrink: 0,
            ml: 3,
          }}
        >
          {button}
        </Box>
      </Box>
    </>
  );
}