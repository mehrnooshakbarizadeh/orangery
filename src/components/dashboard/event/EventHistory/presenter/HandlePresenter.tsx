import { Box } from "@mui/material";
import { Observer } from "mobx-react-lite";
import { IEvent, IEventModification } from "../../../../../queries/event";
import EditButton from "./EditButton";
import DefaultState from "./DefaultState";

export default function HandlePresenter({
  logPresenter,
  event,
}: {
  logPresenter: IEventModification[];
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
              <DefaultState event={event} logPresenter={logPresenter} />
              <Box sx={{ display: "flex", alignItems: "flex-start", gap: 2 }}>
                <EditButton
                  event={event}
                  logPresenter={logPresenter}
                  disabled={
                    logPresenter[0]?.status === "requested" ? false : true
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
