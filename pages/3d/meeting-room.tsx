// contexts & globals
import { useGlobalState } from "../../src/Contexts & Globals/GlobalContext";

// react & next
import type { NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

// orangery elements & internal dependencies
import { OrangeryNavigationContentLoader } from "../../src/components/OrangeryElements";

// queries & backend
import { useMeetingRoom } from "../../src/queries/meetingRoom";
import { setBackendToken } from "../../src/queries/backend";
import HandleRoomForm from "../../src/components/dashboard/meetingRooms/HandleRoomForm";

// others
const TOKEN_KEY = "__token__";

const handleClose = () => {
  window?.postMessage("close", location.origin);
};

const MeetingRoomEditPage: NextPage = () => {
  const [token, setToken] = useState("");
  var officeUuid = "";

  const { query } = useRouter();

  if (query.office) officeUuid = query.office.toString();

  useEffect(() => {
    setBackendToken(localStorage.getItem(TOKEN_KEY) ?? "");
    setToken(localStorage.getItem(TOKEN_KEY) ?? "");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const globalState = useGlobalState();

  useEffect(() => {
    if (officeUuid) {
      if (typeof officeUuid === "string")
        globalState.set_office_uuid(officeUuid);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [officeUuid]);

  const { data: meetingRoom, isLoading } = useMeetingRoom(officeUuid, query.id);

  let meetingRoomWithOfficeUuid = meetingRoom;
  if (meetingRoom)
    meetingRoomWithOfficeUuid = {
      ...meetingRoom,
      office_uuid: officeUuid,
    };

  return (
    <>
      {isLoading ? (
        <OrangeryNavigationContentLoader />
      ) : meetingRoomWithOfficeUuid && token && token !== "" ? (
        // ? <>here!</>
        <HandleRoomForm
          meetingRoom={meetingRoomWithOfficeUuid}
          handleClose={handleClose}
          noCancel
          noRemove
        />
      ) : (
        "No meeting room found!"
      )}
    </>
  );
};

export default MeetingRoomEditPage;
