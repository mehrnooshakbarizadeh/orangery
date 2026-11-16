// external dependencies
import { Box, Typography } from "@mui/material";
import { OrangeryReadOnlySwitch, OrangerySwitch } from "../OrangeryElements";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import { ChangeEvent } from "react";

export default function OrangeryTimeSelector({
  dayTitle,
  editMode,
  checked,
  handleClosedChange,
  handleFromTimeChange,
  handleUntilTimeChange,
  defaultValueFromTime,
  defaultValueUntilTime,
}: {
  dayTitle: string;
  editMode: boolean;
  checked: boolean;
  defaultValueFromTime: string;
  defaultValueUntilTime: string;
  handleClosedChange?: (event: ChangeEvent<HTMLInputElement>) => void;
  handleFromTimeChange?: (
    value: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  handleUntilTimeChange?: (
    value: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
}) {
  return (
    <>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          margin: "30px 0",
          height: "30px",
        }}
      >
        <Box width={30} mr={5}>
          <Typography variant="h5">{dayTitle}</Typography>
        </Box>

        {editMode ? (
          <Box width={40}>
            <OrangerySwitch onChange={handleClosedChange} checked={checked} />
          </Box>
        ) : (
          <OrangeryReadOnlySwitch
            checked={checked}
            timeSelectorMode={true}
            label={{ checked: "Open", unchecked: "Closed" }}
          />
        )}

        <Stack component="form" noValidate spacing={1}>
          <TextField
            id="time"
            type="time"
            defaultValue={defaultValueFromTime}
            onChange={handleFromTimeChange}
            disabled={!editMode || !checked}
            InputLabelProps={{
              shrink: true,
            }}
            inputProps={{
              step: 300, // 5 min
            }}
            sx={{
              width: 120,
              "& .MuiOutlinedInput-root": {
                height: "40px",
              },
            }}
          />
        </Stack>
        <Typography variant="h5">to</Typography>
        <Stack component="form" noValidate spacing={3} ml={1}>
          <TextField
            id="time"
            type="time"
            defaultValue={defaultValueUntilTime}
            onChange={handleUntilTimeChange}
            disabled={!editMode || !checked}
            InputLabelProps={{
              shrink: true,
            }}
            inputProps={{
              step: 300, // 5 min
            }}
            sx={{
              width: 120,
              "& .MuiOutlinedInput-root": {
                height: "40px",
              },
            }}
          />
        </Stack>
      </Box>
    </>
  );
}
