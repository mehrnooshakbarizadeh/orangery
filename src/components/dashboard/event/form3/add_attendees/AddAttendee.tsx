import { Box, Button } from "@mui/material";
import { Observer } from "mobx-react-lite";
import React from "react";
import { useGlobalState } from "../../../../../Contexts & Globals/GlobalContext";
import { useUpsertEmployee } from "../../../../../queries/employee";
import { OrangeryTextField } from "../../../../OrangeryElements";
import { EventFieldsState } from "../../EventForm";
import EmailIcon from "../../../../../assets/svg/email.svg";
import UserIcon from "../../../../../assets/svg/user.svg";
import PlusIcon from "../../../../../assets/svg/plus.svg";
import { useUpsertCustomer } from "../../../../../queries/customer";
import { OrganizerEventFieldsState } from "../../organizer/organizer-preview/OrganizerReviewPage";

export const AddAttendee = ({
  state,
}: {
  state: EventFieldsState | OrganizerEventFieldsState;
}) => {
  const mutation = useUpsertCustomer();
  const { office_uuid } = useGlobalState();

  const handleAddNew = async (e: React.MouseEvent) => {
    const attendeeFName = inputRefFirstName.current?.value || "";
    const attendeeLName = inputRefLastName.current?.value || "";
    const attendeeEmail = inputRefEmail.current?.value || "";
    if (attendeeFName) {
      const result = await mutation.mutateAsync({
        first_name: attendeeFName,
        last_name: attendeeLName,
        address: "",
        email: attendeeEmail,
        invoice_email: "",
        office_uuid,
        customer_number: "",
        create_dashboard: false,
        company_name: "",
        tax_id: "",
        invoice_extra_info: "",
      });
      {
        mutation.isLoading && state.setIsLoading(true);
      }
      const uuid = result?.uuid || "";
      addToAttendeeList(uuid);
      state.setIsAddAttendee(false);
    }
  };

  const addToAttendeeList = (uuid: string) => {
    const i = state.attendee_uuids.values.findIndex((v) => v.value === uuid);
    if (i === -1) {
      state.attendee_uuids.pushElementValue(uuid);
    }
  };

  const handleCancel = () => {
    state.setIsAddAttendee(false);
  };

  const inputRefFirstName = React.useRef<HTMLInputElement>(null);
  const inputRefLastName = React.useRef<HTMLInputElement>(null);
  const inputRefEmail = React.useRef<HTMLInputElement>(null);

  return (
    <>
      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        <Observer>
          {() => (
            <OrangeryTextField
              label="FIRST NAME"
              name="first_name"
              placeholder={state.attendeeFirstName}
              startIcon={<UserIcon />}
              inputRef={inputRefFirstName}
              value={state.attendeeFirstName}
              onChange={(e) => (state.attendeeFirstName = e.target.value)}
            />
          )}
        </Observer>
        <Observer>
          {() => (
            <OrangeryTextField
              label="LAST NAME"
              name="last_name"
              placeholder="Presenter last name"
              startIcon={<UserIcon />}
              inputRef={inputRefLastName}
              //   value={state.presenterLastName}
              //   onChange={(e) => (state.presenterLastName = e.target.value)}
            />
          )}
        </Observer>
        <Observer>
          {() => (
            <OrangeryTextField
              label="EMAIL"
              name="email"
              placeholder="Enter presenter email"
              startIcon={<EmailIcon />}
              inputRef={inputRefEmail}
            />
          )}
        </Observer>

        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: "30px" }}>
          <Button
            variant="outlined"
            onClick={handleCancel}
            sx={{ "&.MuiButton-root": { py: "14px", px: "20px" } }}
          >
            cancel
          </Button>
          <Button
            sx={{
              "&.MuiButton-root": { py: "14px", pr: "20px", pl: "12px" },
              "& .plus-svg": { width: "1rem", height: "1rem", mr: 1 },
            }}
            variant="outlined"
            onClick={handleAddNew}
            disabled={mutation.isLoading}
          >
            <PlusIcon className="plus-svg" />
            Add
          </Button>
        </Box>
      </Box>
    </>
  );
};
