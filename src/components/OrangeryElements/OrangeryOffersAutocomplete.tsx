// contexts & globals
import { useGlobalState } from "../../Contexts & Globals/GlobalContext";

// react & next
import React from "react";

// external dependencies
import { Autocomplete, Box, TextField } from "@mui/material";

// queries & backend
import { useAllOffers } from "../../queries/tenant";

// icons, images & colors
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import OrangeryPrice from "./OrangeryPrice";

export default function OrangeryOffersAutocomplete({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string[];
  onChange: (value: string[]) => void;
}) {
  const globalState = useGlobalState();

  const {
    data: offers,
    isLoading,
    isError,
  } = useAllOffers(globalState.office_uuid);

  return (
    <>
      <Box
        sx={{
          width: "100%",
          mb: 4,
          // height: "85px",
          position: "relative",
          "& .icon": {
            mr: 2,
            ml: 1,
            position: "absolute",
            width: "1.125rem",
            height: "1.125rem",
            color: "grey.A200",
            top: (theme) => theme.spacing(2.3),
            left: (theme) => theme.spacing(1),
          },
        }}
      >
        <Autocomplete
          options={offers || []}
          renderOption={(props, option) => <li {...props}>{`${option.name} (`}<OrangeryPrice euro={option.price} germanFormat />{`)`}</li>}
          getOptionLabel={(option) => `${option.name} (${option.price} €)`}
          multiple
          value={(offers ?? []).filter((e) => value?.indexOf(e.uuid) !== -1)}
          onChange={(_, newValues) => {
            onChange(newValues.map((e) => e.uuid));
          }}
          isOptionEqualToValue={(option, value) => option.uuid === value.uuid}
          renderInput={(params) => (
            <TextField
              label={label}
              {...params}
              InputLabelProps={{
                ...params.InputLabelProps,
                shrink: true,
              }}
              placeholder="Choose Office Offers"
              sx={{
                "& .MuiOutlinedInput-root": {
                  pl: 5
                },
              }}
            />
          )}
        />
        <LocalOfferIcon className="icon" />
      </Box>
    </>
  );
}