import { Box, Typography } from "@mui/material";
import { Observer } from "mobx-react-lite";
import { useGlobalState } from "../../../../Contexts & Globals/GlobalContext";
import { useAllCoworker } from "../../../../queries/coworker";
import { useEmployees } from "../../../../queries/employee";
import { OrangeryUserCircle } from "../../../OrangeryElements";
import { EventFieldsState } from "../EventForm";

export const ShowAttendees = ({ state }: { state: EventFieldsState }) => {
  const globalState = useGlobalState();
  const {
    data: customers,
    isLoading,
    isError,
  } = useAllCoworker(globalState.office_uuid);

  return (
    <Observer>
      {() => (
        <Box
          sx={{
            display: "flex",
          }}
        >
          {state.attendee_uuids?.values.length ? (
            state.attendee_uuids?.values.map((attendee) => {
              const findAttendee = customers?.find(
                (e) => e.uuid === attendee.value
              );
              if (findAttendee) {
                return (
                  <OrangeryUserCircle
                    key={findAttendee!.uuid}
                    name={findAttendee!.name}
                    fileName={
                      typeof findAttendee?.image === "string"
                        ? findAttendee?.image
                        : undefined
                    }
                    size={32}
                  />
                );
              }
            })
          ) : (
            <Typography variant="h4">-</Typography>
          )}
        </Box>
      )}
    </Observer>
  );
};
