import { Observer } from "mobx-react-lite";
import CrossIcon from "../../../../../assets/svg/cross.svg";
import { Box, Button, Divider, IconButton, Typography } from "@mui/material";
import React, { useState } from "react";
import {
  IEvent,
  IEventModification,
  usePatchEvent,
} from "../../../../../queries/event";
import { useGlobalState } from "../../../../../Contexts & Globals/GlobalContext";
import { OrangeryToast } from "../../../../OrangeryElements";
import { ArrayValueState, StateClass } from "../../../../../states/mobx-form";
import { makeAutoObservable } from "mobx";
import OrganizerRow from "./PresenterRow";
import PresenterRow from "./PresenterRow";

export class PresenterLogState {
  public presenters;
  public accepted: boolean = false;

  constructor(length: number) {
    this.presenters = new ArrayValueState<string | null>(
      new Array(length).fill("")
    );

    makeAutoObservable(this);
  }

  get data() {
    return {
      presenters_uuids: this.presenters.values.map((v) => v.value),
    };
  }

  setAccepted(accepted: boolean) {
    this.accepted = accepted;
  }

  isReady() {
    let ready = true;
    if (this.presenters.values.length === 0) ready = false;
    const hasEmpty = this.presenters.values.find((f) => f.value === "");
    if (hasEmpty) ready = false;
    return ready;
  }
}

export default function EditForm({
  logPresenter,
  handleClose,
  event,
}: {
  logPresenter: IEventModification[];
  handleClose: () => void;
  event: IEvent;
}) {
  const mutation = usePatchEvent();
  const globalState = useGlobalState();
  const [organizers, setOrganizers] = useState<string[]>([]);
  const [result, setResult] = useState(false);
  const presenterValues = logPresenter.filter(
    (sg) => sg.status === "requested"
  );

  const getLength =
    presenterValues[0].status === "requested"
      ? presenterValues[0].new_values.length
      : 0;
  const state = React.useMemo(
    () => new PresenterLogState(getLength),
    [getLength]
  );

  console.log(getLength);

  const length = presenterValues.map((m) => m.new_values.length) || 0;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      const updateData = {
        uuid: event.uuid,
        office_uuid: globalState.office_uuid,
        presenter_uuids: state.data.presenters_uuids,
      };
      const result = await mutation.mutateAsync(updateData);
      if (result) {
        setResult(true);
      }
      handleClose();
      if (event) {
        OrangeryToast("Successfully " + event.name, "success");
      }
    } catch (err: any) {}
  }

  const lastValue =
    presenterValues[0].status === "requested"
      ? presenterValues[0].new_values
      : [];

  console.log(lastValue.length);
  console.log(state.presenters.values.length);

  const handleFill = () => {
    let valuable = true;
    state.presenters.values.forEach((v, i) => {
      if (v.value === "") {
        return (valuable = false);
      }
    });
    return valuable;
  };
  console.log(handleFill());
  return (
    <>
      <Box
        sx={{
          pr: 3,
          pl: 4,
          py: 3.5,
          gap: 4,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderBottom: "1px solid #EDEEF0",
        }}
      >
        <Typography sx={{ fontSize: 24, fontWeight: 600, color: "#000" }}>
          Edit Presenter
        </Typography>

        <IconButton
          onClick={handleClose}
          sx={{
            display: "flex",
            "& .cancel-icon": { width: "1.3rem", height: "1.3rem" },
          }}
        >
          <CrossIcon className="cancel-icon" />
        </IconButton>
      </Box>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 1,
          pl: 4,
          mt: 3,
          mb: 3,
        }}
      >
        <Typography fontSize={18} fontWeight={600} color="#A5AAB4">
          Current
        </Typography>
        <Typography fontSize={25} fontWeight={700} color="#2B2E33">
          {event?.presenters.map((org) => org.name).join(", ")}
        </Typography>
      </Box>
      <Divider />
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 1,
          p: 4,
          height: "500px",
          overflow: "hidden",
        }}
      >
        <Typography fontSize={18} fontWeight={600} color="#A5AAB4" pb={4}>
          Customer Suggestion
        </Typography>
        <Observer>
          {() => (
            <>
              {lastValue && (
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 1,
                    height: "100%",
                    overflow: "auto",
                    "&::-webkit-scrollbar": {
                      width: "0.4em",
                    },
                    "&::-webkit-scrollbar-track": {
                      marginLeft: "20px",
                    },
                    "&::-webkit-scrollbar-thumb": {
                      backgroundColor: "rgba(0,0,0,.1)",
                      borderRadius: 5,
                    },
                  }}
                >
                  {lastValue.map((presenter, index) => (
                    <PresenterRow
                      key={presenter.uuid}
                      state={state}
                      value={state.presenters.values[index].value}
                      onChange={(newValue) =>
                        (state.presenters.values[index].value = newValue)
                      }
                      presenter={presenter}
                      isSelected={
                        state.presenters.values[index].value === presenter.uuid
                      }
                      isDeclined={state.presenters.values[index].value === null}
                    />
                  ))}
                </Box>
              )}
            </>
          )}
        </Observer>
      </Box>
      <Box
        sx={{
          pr: 3,
          py: 3.5,
          gap: 1,
          display: "flex",
          justifyContent: "end",
          alignItems: "center",
          borderTop: "1px solid #EDEEF0",
          position: "absolute",
          right: 0,
          bottom: 0,
          width: "100%",
        }}
      >
        <Button
          onClick={handleClose}
          sx={{ fontSize: "21px", fontWeight: "600" }}
        >
          Cancel
        </Button>
        <Observer>
          {() => (
            <Button
              type="submit"
              onClick={handleSubmit}
              disabled={mutation.isLoading || !state.isReady()}
              color="primary"
              variant="contained"
              sx={{ fontSize: "21px", fontWeight: "600" }}
            >
              Submit
            </Button>
          )}
        </Observer>
      </Box>
    </>
  );
}
