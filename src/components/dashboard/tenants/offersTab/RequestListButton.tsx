// contexts & globals
import { useGlobalState } from "../../../../Contexts & Globals/GlobalContext";

// react & next
import React, { useState } from "react";

// external dependencies
import {
  Box,
  Dialog,
  DialogContent,
  IconButton,
  Typography,
} from "@mui/material";
import { makeAutoObservable } from "mobx";

// orangery elements & internal dependencies
import { Observer } from "mobx-react-lite";
import {
  FieldError,
  FormError,
  ValueState,
} from "../../../../states/mobx-form";
import { OrangeryBadge, OrangeryText } from "../../../OrangeryElements";

// queries & backend
import { IOffer } from "../../../../queries/tenant";
import {
  ITenantRequest,
  useTenantRequestList,
  useUpsertTenantRequest,
} from "../../../../queries/tenantRequest";

// icons, images & colors
import HandIcon from "../../../../assets/svg/hand.svg";
import CrossIcon from "../../../../assets/svg/cross.svg";
import ThumbsDownIcon from "../../../../assets/svg/thumbs-down.svg";
import ThumbsUpIcon from "../../../../assets/svg/thumbs-up.svg";

export class OfferFieldsState {
  public uuid;
  public reject?;
  public accept?;
  public office_uuid;
  public error = "";

  constructor(office_uuid: string, request?: ITenantRequest) {
    this.office_uuid = new ValueState(office_uuid);
    if (request) {
      this.reject = new ValueState<boolean>(request.reject);
      this.accept = new ValueState<boolean>(request.accept);
      this.uuid = new ValueState(request.uuid);
    } else {
      this.reject = new ValueState<boolean>(false);
      this.accept = new ValueState<boolean>(false);
      this.uuid = new ValueState("");
    }

    makeAutoObservable(this);
  }

  get data() {
    return {
      uuid: this.uuid.value,
      reject: this.reject?.value,
      accept: this.accept?.value,
      office_uuid: this.office_uuid.value,
    };
  }

  clearErrors() {
    this.reject?.clearError();
    this.error = "";
  }

  validate() {
    let valid = true;
    this.clearErrors();
    // if (this.reject && !this.reject?.value) {
    //   this.reject.error = "Please choose accept/reject";
    //   valid = false;
    // }
    return valid;
  }

  setupErrors(err: FormError) {
    this.clearErrors();
    err.errors.forEach((error) => this.setupError(error));
  }

  setupError(error: FieldError) {
    if (error.field === "") {
      this.error = error.error;
    } else if (this.reject && error.field === "reject") {
      this.reject.error = error.error;
    } else {
      // console.warn(
      //   `the field ${error.field} not found in the field list in OfferForm.`
      // );
    }
  }
}

export default function RequestListButton({ offer }: { offer: IOffer }) {
  const [open, setOpen] = useState(false);
  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <OrangeryBadge
        icon={<HandIcon className={"hand-icon"} />}
        badgeContent={offer.number_of_requests}
        handleOpen={handleOpen}
      />
      <Dialog
        open={open}
        onClose={handleClose}
        sx={{
          "& .MuiPaper-root": { maxWidth: 1051, width: 1051, height: 681 },
        }}
      >
        <Observer>
          {() => (
            <DialogContent sx={{ p: 0, overflowY: "hidden" }}>
              {open && <RequestList offer={offer} handleClose={handleClose} />}
            </DialogContent>
          )}
        </Observer>
      </Dialog>
    </>
  );
}

function RequestList({
  offer,
  handleClose,
}: {
  offer: IOffer;
  handleClose: () => void;
}) {
  const globalState = useGlobalState();
  const { data: tenant_requests, isLoading } = useTenantRequestList(
    globalState.office_uuid,
    offer.uuid
  );

  return (
    <>
      <Box
        sx={{
          "& .header-row": {
            pl: 5,
            pr: 3,
            pt: 3,
            pb: 1,
            display: "flex",
            justifyContent: "end",
            "& .title": { flexGrow: 1 },
          },
          "& .list": { pr: 3, pl: 5 },
        }}
      >
        <Box className="header-row">
          <Typography variant="h4" className="title">
            Requests for &nbsp;
            <OrangeryText text={offer.name} limit={40} />
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
        <Box className="list">
          {offer.number_of_requests === 1 ? (
            <Typography variant="h5" fontWeight={600}>
              {offer.number_of_requests}&nbsp;Request
            </Typography>
          ) : (
            <Typography variant="h5" fontWeight={600}>
              {offer.number_of_requests}&nbsp;Requests
            </Typography>
          )}
          <Box
            sx={{
              overflowY: "auto",
              height: "calc(100vh - 210px)",
              pr: "12px",
              pt: 2,
              display: "flex",
              flexDirection: "column",
              gap: 1,
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
            <Observer>
              {() => (
                <>
                  {tenant_requests?.map((request) => (
                    <RequestRow
                      key={request.uuid}
                      request={request}
                      handleClose={handleClose}
                    />
                  ))}
                </>
              )}
            </Observer>
          </Box>
        </Box>
      </Box>
    </>
  );
}

function RequestRow({
  request,
  handleClose,
}: {
  request: ITenantRequest;
  handleClose: () => void;
}) {
  const { office_uuid } = useGlobalState();
  const state = React.useMemo(
    () => new OfferFieldsState(office_uuid, request),
    [office_uuid, request]
  );
  const mutation = useUpsertTenantRequest();

  async function handleAcceptRequest(value: boolean) {
    if (!state.validate()) {
      return;
    }
    try {
      // setValue(!value);
      if (state.reject) {
        state.reject.value = !value;
      }
      if (state.accept) {
        state.accept.value = value;
      }
      await mutation.mutateAsync(state.data);
      // handleClose();
      // if (request) {
      //   OrangeryToast("Successfully edited " + state.data.reject, "success");
      // } else {
      //   OrangeryToast("Successfully created " + state.data.reject, "success");
      // }
    } catch (err: any) {
      state.setupErrors(err);
    }
  }

  return (
    <>
      <form>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            py: 2.7,
            px: 2.4,
            boxShadow: "1px 1px 8px #0000000a",
            border: "1px solid rgb(210 215 221)",
            alignItems: "center",
            borderRadius: 1.5,
            mx: 0,
            rowGap: 2,
            fontSize: 16,
            fontWeight: 500,
            "& .column-align": {
              display: "flex",
              flexDirection: "column",
              // gap: 1,
              width: "100%",
            },
          }}
        >
          <Box className="column-align">
            <Typography variant="h6">NAME</Typography>
            <Typography variant="h4">
              <OrangeryText
                text={`${request.first_name}` + ` ` + `${request.last_name}`}
                limit={20}
              />
            </Typography>
            <Typography sx={{ textDecoration: "underline" }}>
              <OrangeryText text={request.email} limit={25} />
            </Typography>
          </Box>
          <Box className="column-align">
            <Typography variant="h6">ADDRESS</Typography>
            <Typography variant="h4">
              <OrangeryText text={request.address} limit={20} />
            </Typography>
          </Box>
          <Box className="column-align">
            <Typography variant="h6">COMPANY</Typography>
            <Typography variant="h4">
              <OrangeryText text={request.company_name} limit={20} />
            </Typography>
          </Box>
          <Box
            sx={{
              "& .thumbs-icon": { width: "2rem", height: "2rem" },
              // color: state.reject.value === false ? "red" : "green",
            }}
          >
            <IconButton
              onClick={() => handleAcceptRequest(false)}
              sx={{ color: state.reject?.value === true ? "red" : "" }}
            >
              <ThumbsDownIcon className="thumbs-icon" />
            </IconButton>

            <IconButton
              onClick={() => handleAcceptRequest(true)}
              sx={{ color: state.accept?.value === true ? "green" : "" }}
            >
              <ThumbsUpIcon className="thumbs-icon" />
            </IconButton>
          </Box>
        </Box>
      </form>
    </>
  );
}
