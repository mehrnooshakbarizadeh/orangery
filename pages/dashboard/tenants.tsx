// contexts & globals
import Scaffold from "../../src/components/dashboard/_components/Scaffold";

// orangery elements & internal dependencies
import TenantsNav from "../../src/components/dashboard/tenants/TenantsNav";

function Tenants() {
  return (
    <>
      <Scaffold>
        <TenantsNav />
      </Scaffold>
    </>
  );
}

export default Tenants;
