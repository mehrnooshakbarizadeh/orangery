// contexts & globals
import Scaffold from "../../src/components/dashboard/_components/Scaffold";

// orangery elements & internal dependencies
import DesksList from "../../src/components/dashboard/desks/DesksList";

function Desks() {
  return (
    <>
      <Scaffold>
        <DesksList />
      </Scaffold>
    </>
  );
}

export default Desks;
