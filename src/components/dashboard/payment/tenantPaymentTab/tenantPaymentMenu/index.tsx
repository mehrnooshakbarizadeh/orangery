// contexts & globals
//

// react & next
import React from "react";

// external dependencies
import {
  Typography,
  Link as MUILink,
} from "@mui/material";

// orangery elements & internal dependencies
import RefundButton from "./RefundButton"
import SendStornoInvoiceButton from "./SendStornoInvoiceButton"
import ChargeCustomerButton from "./ChargeCustomerButton"
import GenerateInvoiceButton from "./GenerateInvoiceButton"
import RegenerateInvoiceButton from "./RegenerateInvoiceButton"
import SendPaymentReminderButton from "./SendPaymentReminderButton"
import SendInvoiceButton from "./SendInvoiceButton"
import SendDepositInvoiceButton from "./SendDepositInvoiceButton"
import SetStatusButton from "./SetStatusButton"
import {
  OrangeryDotMenu,
  OrangeryStatusCircle,
} from "../../../../OrangeryElements";
import { downloadFile } from "../TenantPaymentsList"

// queries & backend
import {
  ITenantPayment,
} from "../../../../../queries/tenantPayment";

// icons, images & colors
//

export default function TenantPaymentMenu({
  tenantPayment
}: {
  tenantPayment: ITenantPayment
}) {
  return (<OrangeryDotMenu
    options={[<RefundButton
      key={"RefundButton" + tenantPayment.uuid}
      billing={{ billing_uuid: tenantPayment.uuid, invoice_number: tenantPayment.invoice_number }}
      // disabled={tenantPayment.refunded || !tenantPayment.charge_success}
      icon={<OrangeryStatusCircle
        small
        empty
      />}
    />,
    ...(tenantPayment.storno_invoice
      ? [<MUILink
        key={tenantPayment.storno_invoice}
        onClick={() =>
          downloadFile(
            tenantPayment.storno_invoice ?? "-",
            `storno-invoice-${tenantPayment.invoice_number}`,
          )
        }
        sx={{
          display: "flex",
          flexDirection: "row",
          // justifyItems: "center",
          gap: 1,
          width: "100%",
          cursor: "pointer",
          p: "0.375rem 0",
          textDecoration: "none",
          pl: 2,
          pr: 2,
        }}
      >
        {/* <IconButton
          sx={{
            "&.file-contract-icon": {
              width: "1.3rem",
              height: "1.3rem",
            },
            "&.MuiIconButton-root": { p: 0 },
          }}
        >
          <FileContractIcon className="file-contract-icon" />
        </IconButton> */}
        <OrangeryStatusCircle
          small
          empty
        />
        <Typography
          variant="h5"
          sx={{
            marginTop: "6px",
            marginBottom: "6px",
            // mx: "auto"
          }}
        >
          Get Storno Invoice
        </Typography>
      </MUILink>
      ]
      : []),
    <SendStornoInvoiceButton
      key={"SendStornoInvoiceButton" + tenantPayment.uuid}
      billing={{ billing_uuid: tenantPayment.uuid }}
      icon={<OrangeryStatusCircle
        small
        status={!!tenantPayment.sent_storno_invoice}
        labels={{
          active: "sent before",
          deactive: "not sent yet"
        }}
      />}
    />,
    <ChargeCustomerButton
      key={"ChargeCustomerButton" + tenantPayment.uuid}
      billing={{ billing_uuid: tenantPayment.uuid }}
      icon={<OrangeryStatusCircle
        small
        empty
      />}
    />,
    <GenerateInvoiceButton
      key={"GenerateInvoiceButton" + tenantPayment.uuid}
      billing={{ billing_uuid: tenantPayment.uuid }}
      icon={<OrangeryStatusCircle
        small
        empty
      />}
    />,
    <RegenerateInvoiceButton
      key={"RegenerateInvoiceButton" + tenantPayment.uuid}
      billing={{ billing_uuid: tenantPayment.uuid }}
      icon={<OrangeryStatusCircle
        small
        empty
      />}
    />,
    <SendPaymentReminderButton
      key={"SendPaymentReminderButton" + tenantPayment.uuid}
      billing={{ billing_uuid: tenantPayment.uuid }}
      icon={<OrangeryStatusCircle
        small
        empty
      />}
    />,
    <SendInvoiceButton
      key={"SendInvoiceButton" + tenantPayment.uuid}
      billing={{ billing_uuid: tenantPayment.uuid }}
      icon={<OrangeryStatusCircle
        small
        status={!!tenantPayment.sent_invoice}
        labels={{
          active: "sent before",
          deactive: "not sent yet"
        }}
      />}
    />,
    <SendDepositInvoiceButton
      key={"SendDepositInvoiceButton" + tenantPayment.uuid}
      billing={{ billing_uuid: tenantPayment.uuid }}
      icon={<OrangeryStatusCircle
        small
        status={!!tenantPayment.sent_deposit_invoice}
        labels={{
          active: "sent before",
          deactive: "not sent yet"
        }}
      />}
    />,
    ...(tenantPayment.deposit_invoice
      ? [<MUILink
        key={tenantPayment.deposit_invoice}
        onClick={() =>
          downloadFile(
            tenantPayment.deposit_invoice ?? "-",
            `deposit-invoice-${tenantPayment.deposit_invoice}`,
          )
        }
        sx={{
          display: "flex",
          flexDirection: "row",
          // justifyItems: "center",
          flex: "none",
          gap: 1,
          width: "100%",
          cursor: "pointer",
          p: "0.375rem 0",
          // paddingLeft: "57px",
          pr: "1rem",
          pl: "1rem",
          alignItems: "center",
          textDecoration: "none"
        }}
      >
        {/* <IconButton
          sx={{
            "&.file-contract-icon": {
              width: "1.3rem",
              height: "1.3rem",
            },
            "&.MuiIconButton-root": { p: 0 },
          }}
        >
          <FileContractIcon className="file-contract-icon" />
        </IconButton> */}
        <OrangeryStatusCircle
          small
          empty
        />
        <Typography
          variant="h5"
          sx={{
            marginTop: "6px",
            marginBottom: "6px",
            // mx: "auto"
          }}
        >
          Get Deposit Invoice
        </Typography>
      </MUILink>
      ]
      : []),
    <SetStatusButton
      key={"SetStatusButton" + tenantPayment.uuid}
      billing={{ billing_uuid: tenantPayment.uuid }}
      icon={<OrangeryStatusCircle
        small
        empty
      />}
    />,
    ]}
  />
  );
}

