// contexts & globals
import Scaffold from "../../src/components/dashboard/_components/Scaffold";

// orangery elements & internal dependencies
import FloorsList from "../../src/components/dashboard/floors/FloorsList";

function Floors() {
  return (
    <>
      <Scaffold>
        <FloorsList />
      </Scaffold>
    </>
  );
}

export default Floors;
