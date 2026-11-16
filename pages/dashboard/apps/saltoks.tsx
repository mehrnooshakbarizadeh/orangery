// contexts & globals
import Scaffold from "../../../src/components/dashboard/_components/Scaffold";

// orangery elements & internal dependencies
import SaltoKsNav from "../../../src/components/dashboard/apps/saltoKs/SaltoKsNav";

function SaltoKs() {
  return (
    <>
      <Scaffold>
        <SaltoKsNav />
      </Scaffold>
    </>
  );
}

export default SaltoKs;
