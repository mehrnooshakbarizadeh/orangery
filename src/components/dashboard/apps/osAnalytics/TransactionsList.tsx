// contexts & globals
import { useGlobalState } from "../../../../Contexts & Globals/GlobalContext";

// react & next
import React from "react";

// external dependencies
import {
  Box,
  IconButton,
  Grid,
  Typography,
} from "@mui/material";
import { Observer } from "mobx-react-lite";

// orangery elements & internal dependencies
import {
  OrangeryFormWrapper,
  OrangeryNavigationContentLoader,
  OrangeryNavigationPlaceholder,
  OrangeryDotMenu,
  OrangeryFormButton,
  OrangeryTabs,
  OrangeryText,
} from "../../../OrangeryElements";
import TransactionForm from "./TransactionForm";
import TransactionRemoveForm from "./TransactionRemoveForm";
import { downloadFile } from "../../payment/tenantPaymentTab/TenantPaymentsList"

// queries & backend
import {
  useTransactions,
  useRecurringTransactions
} from "../../../../queries/apps/osAnalytics";
import OrangeryPrice from "../../../OrangeryElements/OrangeryPrice";

// icons, images & colors
import PlaceholderSvg from "../../../../assets/svg/placeholders/default.svg";
import FileContractIcon from "../../../../assets/svg/file-contract.svg";
import { IOffice } from "../../../../queries/office";

import NextLink from "next/link";
import { Link as MUILink } from "@mui/material";

export default function TransactionsList({
  handleClose,
  selectedOffice,
}: {
  handleClose: () => void;
  selectedOffice?: IOffice;
}) {
  const {
    isLoading,
    data: transactions
  } = useTransactions(selectedOffice?.uuid ?? "");
  const {
    isLoading: recurringTransactionsIsLoading,
    data: recurringTransactions
  } = useRecurringTransactions(selectedOffice?.uuid ?? "", true);

  const [allTransactions, setAllTransactions] = React.useState<any[] | undefined>(undefined);

  React.useEffect(() => {
    let temp = [...(transactions ?? [])].sort((a, b) => (new Date(a.date) < new Date(b.date) ? 1 : -1)) // , ...(recurringTransactions ?? [])
    setAllTransactions(temp)
  }, [transactions, recurringTransactions])

  const tabs = [
    {
      label: "History",
      content:
        allTransactions
          ? <>{
            allTransactions?.map((transaction: any) => (
              <TransactionRow
                key={transaction.name}
                transaction={transaction}
                selectedOffice={selectedOffice}
              />
            ))
          }</>
          : <></>
    },
    {
      label: "Monthly Recurring",
      content:
        recurringTransactionsIsLoading
          ? <OrangeryNavigationContentLoader />
          : recurringTransactions && recurringTransactions.length > 0
            ? <>
              {
                recurringTransactions?.map((transaction: any) => (
                  <TransactionRow
                    key={transaction.name}
                    transaction={transaction}
                    selectedOffice={selectedOffice}
                  />
                ))
              }
            </>
            : <OrangeryNavigationPlaceholder
              width={298}
              height={311}
              minHeight={0}
              title={"No monthly transactions have been added!"}
              subtitle={"Add your first transaction"}
              PlaceholderSvg={PlaceholderSvg}
            />
    },
    // {
    //   label: "Monthly",
    //   content: recurringTransactions.map((transaction2: any) => (
    //     <Transaction2Row key={transaction2.name} transaction2={transaction2} />
    //   )),
    // },
  ]

  return (
    <OrangeryFormWrapper
      onClose={handleClose}
      title={`Transactions`}
      // withBorder
      // style={{
      //   width: 601,
      //   height: 395
      // }}
      footer={<Box
        sx={{
          display: "flex",
          justifyContent: "flex-end",
          alignItems: "center",
          width: "100%"
        }}
      >
        <OrangeryFormButton
          variant="add"
          Form={
            <TransactionForm
              selectedOffice={selectedOffice}
            />
          }
          caption="Add Transaction"
          size="large"
          disabled={!selectedOffice}
        />
        {/* <AddNewTrasnactionButton
          selectedOffice={selectedOffice}
        /> */}
      </Box>
      }
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "end",
          height: "566px",
          width: "100%"
        }}
      >
        {
          isLoading && recurringTransactionsIsLoading
            ? <OrangeryNavigationContentLoader />
            : (transactions && transactions.length > 0) || (recurringTransactions && recurringTransactions.length > 0)
              ? <Observer>
                {() => (
                  <Box
                    sx={{
                      display: "flex",
                      // flexGrow: 1,
                      flexDirection: "column",
                      // pb: 14,
                      pl: 4,
                      pr: 2,
                      mr: 1,
                      rowGap: 2,
                      width: "100%",
                      height: "100%",
                      // overflowY: "auto",
                      overflowY: "none",
                    }}
                  >
                    <OrangeryTabs
                      tabs={tabs}
                      height={"calc(100% - 21px)"}
                    />
                  </Box>
                )}
              </Observer>
              : <OrangeryNavigationPlaceholder
                width={298}
                height={311}
                minHeight={0}
                title={"No transactions have been added!"}
                subtitle={"Add your first transaction"}
                PlaceholderSvg={PlaceholderSvg}
              />
        }
      </Box>
    </OrangeryFormWrapper>
  );
}


export function TransactionRow({
  transaction,
  selectedOffice,
}: {
  transaction: any;
  selectedOffice?: IOffice;
}) {
  return (
    <Grid
      container
      sx={{
        display: "flex",
        position: "relative",
        py: 1,
        px: 2,
        alignItems: "center",
        backgroundColor: "#F9F9FA",
        borderRadius: 1.5,
        mb: 1.2,
        mx: 0,
        // gap: 1,
        fontSize: 16,
        fontWeight: 500,
      }}
    >
      <Grid xs={4.5} sm={4.5} md={4.5} item
        sx={{
          display: "flex",
          // alignItems: "center",
          gap: 1,
          flexDirection: "column",
        }}
      >
        <Typography variant="h4">
          <OrangeryText text={transaction.name} limit={50} />
        </Typography>
      </Grid>

      <Grid xs={2} sm={2} md={2} item
        sx={{
          display: "flex",
          // alignItems: "center",
          gap: 1,
          flexDirection: "column",
        }}
      >
        <Typography variant="h4">
          {(new Date(transaction.date)).toLocaleString("de-DE", {
            month: "long",
            year: "numeric",
            day: "numeric",
          })}
        </Typography>
      </Grid>

      <Grid xs={1.5} sm={1.5} md={1.5} item
        sx={{
          display: "flex",
          // alignItems: "center",
          gap: 1,
          flexDirection: "column",
        }}
      >
        <Typography
          variant="h4"
          sx={{
            color: transaction && transaction.amount > 0 ? "#42B863" : "#FF3D00"
          }}
        >
          <OrangeryPrice euro={transaction.amount} germanFormat />
        </Typography>
      </Grid>

      <Grid xs={2} sm={2} md={2} item
        sx={{
          display: "flex",
          // alignItems: "center",
          gap: 1,
          flexDirection: "column",
        }}
      >
        <Typography variant="h4">
          {transaction.recurring ? "Monthly Transaction" : ""}
        </Typography>
      </Grid>

      <Grid xs={1} sm={1} md={1} item
        sx={{
          display: "flex",
          // alignItems: "center",
          gap: 1,
          flexDirection: "column",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Box>
            {transaction.invoice
              ? <a
                onClick={() =>
                  downloadFile(
                    transaction.invoice,
                    `invoice-${transaction.invoice}`
                  )
                }
              >
                <IconButton
                  sx={{
                    "& .file-contract-icon": {
                      width: "1.3rem",
                      height: "1.3rem",
                    },
                    "&.MuiIconButton-root": { p: 0 },
                  }}
                >
                  <FileContractIcon className="file-contract-icon" />
                </IconButton>
              </a>
              : <></>
            }

            {/* {transaction.invoice &&
              <NextLink
                href={`${process.env.NEXT_PUBLIC_CDN_URL}/${transaction.invoice}.pdf`}
                passHref
              >
                <MUILink
                  href={`${process.env.NEXT_PUBLIC_CDN_URL}/${transaction.invoice}.pdf`}
                  download
                  target="_blank"
                  rel="noreferrer"
                  sx={{ textDecoration: "none" }}
                >
                  <IconButton
                    sx={{
                      "& .icon": {
                        width: "1.3rem",
                        height: "1.3rem",
                      },
                      "&.MuiIconButton-root": { p: 0 },
                    }}
                  >
                    <FileContractIcon className="icon" />
                  </IconButton>
                </MUILink>
              </NextLink>
            } */}
          </Box>
        </Box>
      </Grid>

      <Grid xs={1} sm={1} md={1} item
        sx={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "end"
        }}
      >
        <OrangeryDotMenu
          horizontal
          disabled={!selectedOffice}
          options={[
            <Box
              key={"TransactionEditButton" + transaction.uuid}
              sx={{
                px: .4,
                py: .1,
                width: "100%",
                backgroundColor: "white"
              }}
            >
              <OrangeryFormButton
                variant="edit"
                Form={<TransactionForm
                  transaction={transaction}
                  selectedOffice={selectedOffice}
                />}
                caption
                noIcon
                size="full"
                hoverColor="#F9D507"
              />
            </Box>,
            <Box
              key={"TransactionRemoveButton" + transaction.uuid}
              sx={{
                px: .4,
                py: .1,
                width: "100%",
                backgroundColor: "white"
              }}
            >
              <OrangeryFormButton
                variant="remove"
                Form={<TransactionRemoveForm transaction={transaction} />}
                caption={"Delete"}
                noIcon
                size="full"
                hoverColor="#F9D507"
              />
            </Box>,
          ]}
        />
      </Grid>
    </Grid >
  );
}