// // contexts & globals
// import { useGlobalState } from "../../../../../Contexts & Globals/GlobalContext";

// import React from "react";
// import UserIcon from "../../../../../assets/svg/user.svg";
// import {
//   Autocomplete,
//   Box,
//   Button,
//   SxProps,
//   TextField,
//   Theme,
// } from "@mui/material";
// import { useEmployees } from "../../../../../queries/employee";
// import { EventFieldsState } from "../../EventForm";
// import AngleDown from "../../../../../assets/svg/angleBoldDown.svg";
// import AddIcon from "@mui/icons-material/Add";
// import { useAllCoworker } from "../../../../../queries/coworker";

// export default function AttendeesAutocomplete({
//   sx,
//   label,
//   value,
//   onChange,
//   state,
// }: {
//   sx?: SxProps<Theme> | undefined;
//   label: string;
//   value: string[];
//   onChange: (value: string[]) => void;
//   state: EventFieldsState;
// }) {
//   const globalState = useGlobalState();
//   const {
//     data: all_workers,
//     isLoading,
//     isError,
//   } = useAllCoworker(globalState.office_uuid);

//   const handleAddNew = async (e: React.MouseEvent) => {
//     const newName = inputRef.current?.value;
//     if (newName) {
//       state.setIsAddAttendee(true);
//       state.setAttendeeFirstName(newName);
//     }
//   };

//   const inputRef = React.useRef<HTMLInputElement>(null);

//   return (
//     <>
//       <Box
//         sx={{
//           ...sx,
//           width: "100%",
//           // height: "85px",
//           position: "relative",
//           "& .MuiChip-root": { ml: 1.5 },
//           "& .MuiOutlinedInput-root": {
//             pl: 4,
//           },
//           "& .icon-angleDown": {
//             width: "1rem",
//             height: "1rem",
//             color: "rgba(0, 0, 0, 0.54)",
//           },
//           "& .icon": {
//             mr: 2,
//             position: "absolute",
//             width: "1.3rem",
//             height: "1.3rem",
//             color: "grey.A200",
//             top: (theme) => theme.spacing(2.2),
//             left: (theme) => theme.spacing(2.1),
//           },
//         }}
//       >
//         <Autocomplete
//           options={all_workers || []}
//           popupIcon={<AngleDown className="icon-angleDown" />}
//           renderOption={(props, option) => <li {...props}>{option.name}</li>}
//           getOptionLabel={(option) => option.name}
//           multiple
//           value={(all_workers ?? []).filter(
//             (e) => value?.indexOf(e.uuid) !== -1
//           )}
//           onChange={(_, newValues) => {
//             onChange(newValues.map((e) => e.uuid));
//             state.setPresenterValues(newValues.map((e) => e.uuid));
//           }}
//           isOptionEqualToValue={(option, value) => option.uuid === value.uuid}
//           noOptionsText={
//             <>
//               User not found
//               <Button
//                 sx={{ ml: 1, color: "#fff", backgroundColor: "#000" }}
//                 variant="contained"
//                 onMouseDown={handleAddNew}
//               >
//                 <AddIcon />
//                 Add Manually
//               </Button>{" "}
//             </>
//           }
//           sx={{
//             "& .MuiAutocomplete-tag": { display: "none" },
//             "& .MuiAutocomplete-clearIndicator": { display: "none" },
//           }}
//           renderInput={(params) => (
//             <TextField
//               label={label}
//               placeholder="Search people and select them"
//               {...params}
//               inputRef={inputRef}
//               InputLabelProps={{
//                 ...params.InputLabelProps,
//                 shrink: true,
//               }}
//               // placeholder="Select Features..."
//               sx={{
//                 "& .MuiAutocomplete-endAdornment": { right: "16px !important" },
//                 "& .MuiAutocomplete-input": { ml: 4 },
//               }}
//             />
//           )}
//         />
//         <UserIcon className="icon" />
//       </Box>
//     </>
//   );
// }
import AngleDown from "../../../../../assets/svg/angleBoldDown.svg";
// react & next
import React, { ReactNode } from "react";

// external dependencies
import {
  Autocomplete,
  Box,
  Button,
  SxProps,
  TextField,
  Theme,
} from "@mui/material";

// queries & backend

// icons, images & colors
import UsersIcon from "../../../../../assets/svg/attendees.svg";
import { useGlobalState } from "../../../../../Contexts & Globals/GlobalContext";
import { useAllCoworker } from "../../../../../queries/coworker";
import { EventFieldsState } from "../../EventForm";
import AddIcon from "@mui/icons-material/Add";
import { OrganizerEventFieldsState } from "../../organizer/organizer-preview/OrganizerReviewPage";

export default function AttendeesAutocomplete({
  sx,
  label,
  value,
  onChange,
  state,
}: {
  sx?: SxProps<Theme> | undefined;
  label: string;
  value: string[];
  onChange: (value: string[]) => void;
  state: EventFieldsState | OrganizerEventFieldsState;
}) {
  const globalState = useGlobalState();
  const {
    data: customers,
    isLoading,
    isError,
  } = useAllCoworker(globalState.office_uuid);

  const handleAddNew = async (e: React.MouseEvent) => {
    const newName = inputRef.current?.value;
    if (newName) {
      state.setIsAddAttendee(true);
      state.setAttendeeFirstName(newName);
    }
  };

  const inputRef = React.useRef<HTMLInputElement>(null);

  return (
    <>
      <Box
        sx={{
          ...sx,
          width: "100%",
          position: "relative",
          "& .icon-angleDown": {
            width: "1rem",
            height: "1rem",
            color: "rgba(0, 0, 0, 0.54)",
            mr: 1,
          },
          "& .icon": {
            mr: 2,
            position: "absolute",
            width: "1.125rem",
            height: "1.125rem",
            color: "grey.A200",
            top: (theme) => theme.spacing(2.3),
            left: (theme) => theme.spacing(2),
          },
        }}
      >
        <Autocomplete
          options={customers || []}
          popupIcon={<AngleDown className="icon-angleDown" />}
          renderOption={(props, option) => <li {...props}>{option.name}</li>}
          getOptionLabel={(option) => option.name}
          multiple
          value={(customers ?? []).filter((e) => value?.indexOf(e.uuid) !== -1)}
          onChange={(_, newValues) => {
            onChange(newValues.map((e) => e.uuid));
          }}
          isOptionEqualToValue={(option, value) => option.uuid === value.uuid}
          noOptionsText={
            <>
              User not found
              <Button
                sx={{ ml: 1, color: "#fff", backgroundColor: "#000" }}
                variant="contained"
                onMouseDown={handleAddNew}
              >
                <AddIcon />
                Add Manually
              </Button>{" "}
            </>
          }
          sx={{
            "& .MuiAutocomplete-tag": { display: "none" },
            "& .MuiAutocomplete-clearIndicator": { display: "none" },
          }}
          renderInput={(params) => (
            <TextField
              label={label}
              placeholder="Search people and select them"
              {...params}
              inputRef={inputRef}
              InputLabelProps={{
                ...params.InputLabelProps,
                shrink: true,
              }}
              // placeholder="Select Features..."
              sx={{
                "& .MuiAutocomplete-endAdornment": { right: "16px !important" },
                "& .MuiAutocomplete-input": { ml: 4 },
              }}
            />
          )}
        />
        <UsersIcon className="icon" />
      </Box>
    </>
  );
}
