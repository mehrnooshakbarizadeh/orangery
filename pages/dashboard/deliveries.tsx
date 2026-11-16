// contexts & globals
import Scaffold from "../../src/components/dashboard/_components/Scaffold";

// orangery elements & internal dependencies
import DeliveriesNav from "../../src/components/dashboard/deliveries";

function Deliveries() {
  return (
    <>
      <Scaffold>
        <DeliveriesNav />
      </Scaffold>
    </>
  );
}

export default Deliveries;
