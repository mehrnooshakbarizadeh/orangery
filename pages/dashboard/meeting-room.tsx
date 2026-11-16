// contexts & globals
import Scaffold from "../../src/components/dashboard/_components/Scaffold";

// orangery elements & internal dependencies
import MeetingRoomsList from "../../src/components/dashboard/meetingRooms/MeetingRoomsList";

function MeetingRoom() {
  return (
    <>
      <Scaffold>
        <MeetingRoomsList />
      </Scaffold>
    </>
  );
}

export default MeetingRoom;
