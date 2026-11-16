// contexts & globals
import { useGlobalState } from "../../../Contexts & Globals/GlobalContext";

// react & next
import React, { useState, useEffect } from "react";

// external dependencies
//

// orangery elements & internal dependencies
import {
  OrangeryNavigationContentLoader,
  OrangeryRoutedTabs,
} from "../../OrangeryElements";
import GeneralPaymentTab from "./generalPaymentTab/GeneralPaymentTab";
import TenantPaymentsList from "./tenantPaymentTab/TenantPaymentsList";
import CreditsList from "./creditTab/CreditsList";
import CouponsList from "./couponCodeTab/CouponsList";
// import BankAccountTable from "./BankAccount/BankAccountTable";
import RewardList from "./rewardTab/RewardList";

export default function PaymentNav() {
  useEffect(() => {
    document.querySelector<HTMLInputElement>("main")!.style.backgroundColor =
      "white";
  }, []);

  const globalState = useGlobalState();
  const user = globalState.currentUser;
  const [hasData, setHasData] = useState(true);
  const isLoading = false;

  const tabs = [
    ...(user?.group.name === "finance_admin" || user?.group.name === "owner" ////////!!!!!!!! should be with can/ability
      ? [
        {
          slug: "general_payment",
          label: "General Payment",
          content: <GeneralPaymentTab />,
        },
      ]
      : []),
    {
      slug: "tenants_payment",
      label: !globalState.currentOffice?.is_customer ? "Tenants Payment" : "Payment History", ////////!!!!!!!! should be with can/ability
      content: <TenantPaymentsList />,
      // button: (
      //   <Box
      //     sx={{
      //       top: -6,
      //       position: "absolute",
      //       width: "fit-content",
      //       right: 0,
      //       zIndex: 20,
      //     }}
      //   >
      //     <AddNewInvoiceButton />
      //   </Box>
      // ),
    },
    ...(!globalState.currentOffice?.is_customer ////////!!!!!!!! should be with can/ability
      ? [{
        slug: "rewarded_os_coins",
        label: "Rewarded OS Coins",
        content: <RewardList />,
      }]
      : []
    ),
    ...(!globalState.currentOffice?.is_customer ////////!!!!!!!! should be with can/ability
      ? [
        {
          slug: "credit",
          label: "Credit",
          content: <CreditsList />,
        },
      ]
      : []
    ),
    ...(!globalState.currentOffice?.is_customer ////////!!!!!!!! should be with can/ability
      ? [{
        slug: "coupon_code",
        label: "Coupon Code",
        content: <CouponsList />,
      }]
      : []
    ),
  ];

  return (
    <>
      {
        isLoading ? (
          <OrangeryNavigationContentLoader />
        ) : hasData ? (
          <OrangeryRoutedTabs tabs={tabs} height={"calc(100% - 21px)"} />
        ) : (
          "No payment data is available"
        )
        //   : <OrangeryNavigationPlaceholder
        //   title={"Build a rental community"}
        //   subtitle={"Valuate the company's assets by renting them during unused hours."}
        //   PlaceholderSvg={PlaceholderSvg}
        //   AddNewButton={<AddNewOfferButton />}
        //   addNewButtonText={""}
        // />
      }
    </>
  );
}
