import { Box, Typography } from "@mui/material";
import { Observer } from "mobx-react-lite";
import { useGlobalState } from "../../../../Contexts & Globals/GlobalContext";
import { useEmployees } from "../../../../queries/employee";
import { OrangeryUserCircle } from "../../../OrangeryElements";
import { EventFieldsState } from "../EventForm";

export const ShowOrganizer = ({ state }: { state: EventFieldsState }) => {
  const globalState = useGlobalState();
  const { data: employees } = useEmployees(globalState.office_uuid);

  return (
    <Observer>
      {() => (
        <Box
          sx={{
            display: "flex",
          }}
        >
          {state.organizer_uuids?.values?.length ? (
            state.organizer_uuids?.values.map((organizer) => {
              const findOrganizer = employees?.find(
                (e) => e.uuid === organizer.value.uuid.value
              );
              if (findOrganizer) {
                return (
                  <OrangeryUserCircle
                    key={findOrganizer!.uuid}
                    name={findOrganizer!.name}
                    fileName={
                      typeof findOrganizer?.image === "string"
                        ? findOrganizer?.image
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
