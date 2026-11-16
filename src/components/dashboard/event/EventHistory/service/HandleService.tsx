import { Box } from "@mui/material";
import { Observer } from "mobx-react-lite";
import { IEvent, IEventModification } from "../../../../../queries/event";
import EditButton from "./EditButton";
import DefaultState from "./DefaultState";
import PriceField from "../meeting-room/RoomPriceField";
import ServicePriceField from "./ServicePriceField";

export default function HandleService({
  logService,
  event,
}: {
  logService: IEventModification[];
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
              <DefaultState event={event} logService={logService} />
              <Box
                sx={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 2,
                  width: "350px",
                  justifyContent: "end",
                }}
              >
                <ServicePriceField event={event} />
                <EditButton
                  event={event}
                  logService={logService}
                  disabled={
                    logService[0]?.status === "requested" ? false : true
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
