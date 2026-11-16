import { Box, Typography } from "@mui/material";
import { Observer } from "mobx-react-lite";
import { useGlobalState } from "../../../../Contexts & Globals/GlobalContext";
import { useEmployees } from "../../../../queries/employee";
import { OrangeryUserCircle } from "../../../OrangeryElements";
import { EventFieldsState } from "../EventForm";

export const ShowPresenters = ({ state }: { state: EventFieldsState }) => {
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
          {state.presenter_uuids?.values.length ? (
            state.presenter_uuids?.values.map((presenter) => {
              const findPresenter = employees?.find(
                (e) => e.uuid === presenter.value
              );
              if (findPresenter) {
                return (
                  <OrangeryUserCircle
                    key={findPresenter!.uuid}
                    name={findPresenter!.name}
                    fileName={
                      typeof findPresenter?.image === "string"
                        ? findPresenter?.image
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
