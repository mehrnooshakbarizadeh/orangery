// contexts & globals
import Scaffold from "../../src/components/dashboard/_components/Scaffold";

// orangery elements & internal dependencies
import ContractsList from "../../src/components/dashboard/contracts/ContractsList";

function Contracts() {
  return (
    <>
      <Scaffold>
        <ContractsList />
      </Scaffold>
    </>
  );
}

export default Contracts;
