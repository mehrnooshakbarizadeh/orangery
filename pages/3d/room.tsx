// contexts & globals
import { useGlobalState } from "../../src/Contexts & Globals/GlobalContext";

// react & next
import type { NextPage } from 'next'
import { useRouter } from "next/router";
import React from "react"

// orangery elements & internal dependencies
import { OrangeryNavigationContentLoader } from "../../src/components/OrangeryElements";

// queries & backend
import { useRoom } from "../../src/queries/room";
import { setBackendToken } from "../../src/queries/backend";
import RoomForm from "../../src/components/dashboard/rooms/RoomForm";

// others
const TOKEN_KEY = "__token__";

const handleClose = () => {
  window?.postMessage('close', location.origin)
};

const RoomEditPage: NextPage = () => {
  const [token, setToken] = React.useState("")
  const [officeUuid, setOfficeUuid] = React.useState("")
  const [roomUuid, setRoomUuid] = React.useState("")

  const { query } = useRouter();

  React.useEffect(() => {
    if (query.office)
      setOfficeUuid(query.office.toString())
    if (query.id)
      setRoomUuid(query.id.toString())
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query.office, query.id])

  React.useEffect(() => {
    setBackendToken(localStorage.getItem(TOKEN_KEY) ?? "")
    setToken(localStorage.getItem(TOKEN_KEY) ?? "")
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const globalState = useGlobalState();

  React.useEffect(() => {
    if (officeUuid) {
      if (typeof officeUuid === "string")
        globalState.set_office_uuid(officeUuid);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [officeUuid])

  const { data: room, isLoading } = useRoom(officeUuid, roomUuid);

  let roomWithOfficeUuid = room;
  if (room)
    roomWithOfficeUuid = {
      ...room,
      office_uuid: officeUuid
    }

  return <>{
    token && token !== ""
      ? officeUuid
        ? roomUuid
          ? isLoading
            ? <OrangeryNavigationContentLoader />
            : roomWithOfficeUuid
              // ? <>here!</>
              ? <RoomForm room={roomWithOfficeUuid} handleClose={handleClose} noCancel noRemove />
              : "No room found!"
          : "" // "No room id!"
        : "" // "No office id!"
      : "" // "No token!"
  }</>;
}

export default RoomEditPage