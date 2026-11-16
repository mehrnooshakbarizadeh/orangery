// contexts & globals
import { useGlobalState } from "../../Contexts & Globals/GlobalContext";

// react & next
import React from "react";

// external dependencies
import { Autocomplete, Box, TextField } from "@mui/material";

// queries & backend
import { IOffer, useOffers } from "../../queries/tenant";

// icons, images & colors
import LocalOfferIcon from '@mui/icons-material/LocalOffer';

export default function OrangeryOfferAutocomplete({
  label,
  value,
  error,
  helperText,
  placeholder,
  onChange,
}: {
  label: string;
  value?: string;
  error: boolean;
  helperText: React.ReactNode;
  placeholder: string;
  onChange: (newOffer: {
    uuid: string;
    name: string;
    price: number;
    tax_rate: number;
  }) => void;
}) {
  const globalState = useGlobalState();

  const {
    data: offers,
    isLoading,
    isError,
  } = useOffers(globalState.office_uuid);

  return (
    <>
      <Box
        sx={{
          width: "100%",
          height: "85px",
          position: "relative",
          "& .MuiOutlinedInput-root": {
            pl: 6,
          },
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
          renderOption={(props, option) => <li {...props} key={option.uuid}>{`${option.name} (€${option.price})`}</li>}
          getOptionLabel={(option) => `${option.name} (€${option.price})`}
          value={(offers ?? []).find((e: any) => value?.indexOf(e.uuid) !== -1)}
          onChange={(_, newValue) => {
            onChange(newValue
              ? newValue
              : {
                uuid: "",
                name: "",
                price: 0,
                tax_rate: 0
              });
          }}
          isOptionEqualToValue={(option, value) => option.uuid === value.uuid}
          renderInput={(params) => (
            <TextField
              label={label}
              error={error}
              helperText={helperText}
              placeholder={placeholder}
              {...params}
              InputLabelProps={{
                ...params.InputLabelProps,
                shrink: true,
              }}
              sx={{
                "& .MuiAutocomplete-input": { ml: 4 },
                // "&.MuiTextField-root": { backgroundColor: "#f5f7fa" },
              }}
            />
          )}
        />
        <LocalOfferIcon className="icon" />
      </Box>
    </>
  );
}
