// contexts & globals
import Scaffold from "../../src/components/dashboard/_components/Scaffold";

// orangery elements & internal dependencies
import PaymentNav from "../../src/components/dashboard/payment/PaymentNav";

function Payment() {
  return (
    <>
      <Scaffold>
        <PaymentNav />
      </Scaffold>
    </>
  );
}

export default Payment;
