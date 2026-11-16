// contexts & globals
import Scaffold from "../../src/components/dashboard/_components/Scaffold";

// orangery elements & internal dependencies
import CustomersList from "../../src/components/dashboard/customers";

function CustomrsPage() {
  return (
    <>
      <Scaffold>
        <CustomersList />
      </Scaffold>
    </>
  );
}

export default CustomrsPage;
