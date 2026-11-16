import { Box, Typography } from "@mui/material";
import { Observer } from "mobx-react-lite";
import { IEvent, IEventModification } from "../../../../../queries/event";
import EditButton from "./EditButton";
import DefaultState from "./DefaultState";

export default function HandleOrganizers({
  logOrganizers,
  event,
}: {
  logOrganizers: IEventModification[];
  event: IEvent;
}) {
  return (
    <>
      <Observer>
        {() => (
          <Box
            sx={{
              backgroundColor: "#F9F9FA",
              border: "white",
              borderRadius: "10px",
              p: 3,
              display: "flex",
              justifyContent: "end",
              gap: 2.5,
            }}
          >
            <>
              <DefaultState event={event} logOrganizers={logOrganizers} />
              <Box sx={{ display: "flex", alignItems: "flex-start", gap: 2 }}>
                <EditButton
                  event={event}
                  logOrganizers={logOrganizers}
                  disabled={
                    logOrganizers[0]?.status === "requested" ? false : true
                  }
                />
              </Box>
            </>
          </Box>
        )}
      </Observer>
    </>
  );
}
