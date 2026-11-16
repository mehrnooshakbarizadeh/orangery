// contexts & globals
//

// react & next
import React from "react";

// external dependencies
//

// orangery elements & internal dependencies
import {
  OrangeryDotMenu,
  OrangeryStatusCircle,
} from "../../../../OrangeryElements";

// queries & backend
import UpdateUserProductButton from "./UpdateUserProductButton";
import { IUserProduct } from "../../../../../queries/tenant";

// icons, images & colors
//

export default function RentedPropertiesMenu({
  userProduct
}: {
  userProduct: IUserProduct
}) {
  return (<OrangeryDotMenu
    options={[
      // <UpdateUserProductButton
      //   key={"UpdateUserProductButton" + "business_payment" + userProduct.uuid}
      //   params={{
      //     user_product_uuid: userProduct.uuid,
      //     business_payment: !userProduct.business_payment
      //   }}
      //   title={"Business Payment"}
      //   message={"Are you sure to change the business payment?"}
      //   // disabled={offer.refunded || !offer.charge_success}
      //   icon={<OrangeryStatusCircle
      //     small
      //     status={!!userProduct.business_payment}
      //     labels={{
      //       active: "on",
      //       deactive: "off"
      //     }}
      //   />}
      // />,
      <UpdateUserProductButton
        key={"UpdateUserProductButton" + "invoice_payment" + userProduct.uuid}
        params={{
          user_product_uuid: userProduct.uuid,
          invoice_payment: !userProduct.invoice_payment
        }}
        title={"Invoice Payment"}
        message={!userProduct.invoice_payment
          ? "Are you sure you want to set the payment method to invoice payment?"
          : "Are you sure you want to remove the invoice payment?"
        }
        // disabled={offer.refunded || !offer.charge_success}
        icon={<OrangeryStatusCircle
          small
          status={!!userProduct.invoice_payment}
          labels={{
            active: "Payment method is invoice payment",
            deactive: "Payment method is not invoice payment"
          }}
        />}
      />,
      <UpdateUserProductButton
        key={"UpdateUserProductButton" + "canceled" + userProduct.uuid}
        params={{
          user_product_uuid: userProduct.uuid,
          canceled: !userProduct.canceled
        }}
        title={"Cancelled Subscription"}
        message={!userProduct.canceled
          ? "Are you sure you want to cancel this subscription?"
          : "Are you sure you want to continue the subscription?"
        }
        // disabled={offer.refunded || !offer.charge_success}
        icon={<OrangeryStatusCircle
          small
          status={!!userProduct.canceled}
          labels={{
            active: "Cancelled subscription",
            deactive: "Subscription is continuing"
          }}
        />}
      />,
      <UpdateUserProductButton
        key={"UpdateUserProductButton" + "ignore_billing" + userProduct.uuid}
        params={{
          user_product_uuid: userProduct.uuid,
          ignore_billing: !userProduct.ignore_billing
        }}
        title={"Ignore Billing"}
        message={!userProduct.ignore_billing
          ? "Are you sure you want to ignore/stop the monthly payments?"
          : "Are you sure you want to continue the monthly billing?"
        }
        // disabled={offer.refunded || !offer.charge_success}
        icon={<OrangeryStatusCircle
          small
          status={!!userProduct.ignore_billing}
          labels={{
            active: "No monthly payments",
            deactive: "Monthly billing is continuing"
          }}
        />}
      />,
    ]}
  />
  );
}

