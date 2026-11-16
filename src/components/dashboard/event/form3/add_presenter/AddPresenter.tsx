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
import { OrganizerEventFieldsState } from "../../organizer/organizer-preview/OrganizerReviewPage";

export const AddPresenter = ({
  state,
}: {
  state: EventFieldsState | OrganizerEventFieldsState;
}) => {
  const mutation = useUpsertEmployee();
  const { office_uuid } = useGlobalState();

  const handleAddNew = async (e: React.MouseEvent) => {
    const presenterFName = inputRefFirstName.current?.value || "";
    const presenterLName = inputRefLastName.current?.value || "";
    const presenterEmail = inputRefEmail.current?.value || "";
    if (presenterFName) {
      const result = await mutation.mutateAsync({
        first_name: presenterFName,
        last_name: presenterLName,
        phone: "",
        address: "",
        email: presenterEmail,
        group_uuid: "45819cb0-f0c9-4a4f-ad61-984908df8eb8",
        office_uuid,
      });
      {
        mutation.isLoading && state.setIsLoading(true);
      }
      const uuid = result?.uuid || "";
      addToPresenterList(uuid);
      state.setIsAddPresenter(false);
    }
  };

  const addToPresenterList = (uuid: string) => {
    const i = state.presenter_uuids.values.findIndex((v) => v.value === uuid);
    if (i === -1) {
      state.presenter_uuids.pushElementValue(uuid);
    }
  };

  const handleCancel = () => {
    state.setIsAddPresenter(false);
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
              placeholder={state.presenterFirstName}
              startIcon={<UserIcon />}
              inputRef={inputRefFirstName}
              value={state.presenterFirstName}
              onChange={(e) => (state.presenterFirstName = e.target.value)}
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
