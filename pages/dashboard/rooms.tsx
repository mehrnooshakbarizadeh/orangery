// contexts & globals
import Scaffold from "../../src/components/dashboard/_components/Scaffold";

// orangery elements & internal dependencies
import RoomsList from "../../src/components/dashboard/rooms/RoomsList";

function Desks() {
  return (
    <>
      <Scaffold>
        <RoomsList />
      </Scaffold>
    </>
  );
}

export default Desks;
