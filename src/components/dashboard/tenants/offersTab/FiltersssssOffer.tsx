import * as React from 'react';
import Checkbox from '@mui/material/Checkbox';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import FilterIcon from '../../../../assets/svg/filter.svg';
import { Box, InputAdornment, Typography } from '@mui/material';

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

export interface IFilter {
  name: string,
}

export const filterOptions: IFilter[] = [
  {
    name: "Active on landing page"
  },
  {
    name: "On Marketplace"
  },
]

export default function FiltersssssOffer({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string[];
  onChange: (value: string[]) => void;
}) {
  return (
    <Box sx={{
      position: "relative",
      "& .icon": {
        mr: 2,
        position: "absolute",
        width: "1.125rem",
        height: "1.125rem",
        color: "#2B2E33",
        top: (theme) => theme.spacing(2.3),
        left: (theme) => theme.spacing(2),
      },
      "& .filter-selected": {
        mr: 2,
        position: "absolute",
        // width: "1.125rem",
        // height: "1.125rem",
        color: "#2B2E33",
        top: (theme) => theme.spacing(2),
        left: (theme) => theme.spacing(6),
      },
    }}>
      <Autocomplete
        multiple
        disablePortal={true}
        autoSelect={true}
        // clearOnBlur={true}
        options={filterOptions}
        value={(filterOptions ?? []).filter((e) => value?.indexOf(e.name) !== -1)}
        onChange={(_, newValues) => {
          onChange(newValues.map((e) => e.name));
        }}
        isOptionEqualToValue={(option, value) => option.name === value.name}
        getOptionLabel={(option) => option.name}
        renderOption={(props, option, { selected }) => (
          <li {...props}>
            <Checkbox
              icon={icon}
              checkedIcon={checkedIcon}
              style={{ marginRight: 8 }}
              checked={selected}
            />
            {option.name}
          </li>
        )}
        sx={{
          flex: '0 1 auto',
          "& .MuiOutlinedInput-root": { maxWidth: '160%', minWidth: '300px' },
          "& .MuiAutocomplete-input": { ml: 2.5, cursor: 'pointer' },
          "& .MuiInput-root:hover": { borderBottom: "none" },
          "& .MuiTextField-root": { borderRadius: 1.2 },
          "& .MuiAutocomplete-tag": { display: 'none' }
        }}
        renderInput={(params) => (
          <TextField {...params}
            disabled={true}

            // placeholder='Filter By' 
            // label="Filter By"

            InputLabelProps={{
              ...params.InputLabelProps,
              shrink: true,
            }}

            sx={{
              cursor: 'none',
              "& .MuiOutlinedInput-root": {
                pl: 4
              },
              "& .MuiInput-root:before": { borderBottom: 'none' },
              "& .MuiAutocomplete-inputRoot": { height: '55px' },
              backgroundColor: '#F5F7FA',
            }}
          />
        )}
      />
      <Typography className="filter-selected">{value.length > 0 ? `${value.length} selected` : "Filter By"}</Typography>
      <FilterIcon className="icon" />
    </Box>
  );
}