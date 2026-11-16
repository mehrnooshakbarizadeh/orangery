// contexts & globals
import Scaffold from "../../src/components/dashboard/_components/Scaffold";

// orangery elements & internal dependencies
import ParkingSpotsList from "../../src/components/dashboard/parkingSpots/ParkingSpotsList";

function ParkingSpot() {
  return (
    <>
      <Scaffold>
        <ParkingSpotsList />
      </Scaffold>
    </>
  );
}

export default ParkingSpot;
