import * as React from 'react';
import Checkbox from '@mui/material/Checkbox';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import FilterIcon from '../../../../../assets/svg/filter.svg';
import { Box, FormControl, InputAdornment, InputLabel, ListItemText, MenuItem, OutlinedInput, Select, SelectChangeEvent, Typography } from '@mui/material';
import { Observer } from 'mobx-react-lite';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { SearchFilterDoorsState } from './DoorsForm';
import { OrangeryText } from '../../../../OrangeryElements';

export interface IFilter {
  name: string,
}

// const filterOptions = [
//   "Active on landing page",
//   "On Marketplace",
//   "Digital Contract",
//   "Subscription",
//   "One Time Payment"
// ] as string[]

const ITEM_HEIGHT = 40;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
      backgroundColor: "#fff !important",
      boxShadow: "0px 45px 40px #E0E0E0",
      borderRadius: "0 0 15px 15px",
    },
  },
};

export default function FilterDoors({
  label,
  value,
  onChange,
  state,
  filterOptions,
}: {
  state: SearchFilterDoorsState;
  label?: string;
  value?: string[];
  onChange?: (value: string[]) => void;
  filterOptions: string[];
}) {
  const [open, setOpen] = React.useState(false);

  const handleChange = (event: any) => {
    let newValues = event.target.value;

    newValues.forEach((e: any) => {
      const i = state.filterBy.findIndex(
        (v) => v === e
      );
      if (i === -1) {
        state.pushToFilterList(e);
      }
    });
    [...state.filterBy].forEach((v) => {
      const i = newValues.findIndex((e: any) => v === e);
      if (i === -1) {
        const j = state.filterBy.findIndex(t => t === v)
        state.deleteFromFilterList(j);
      }
    });
  }

  return (
    <Box sx={{
      position: "relative",
      "& .icon": {
        mr: 2,
        position: "absolute",
        width: "15px",
        height: "13px",
        color: "#505357",
        top: (theme) => theme.spacing(3),
        left: (theme) => theme.spacing(2.5),
      },
      "& .filter-selected": {
        mr: 2,
        position: "absolute",
        color: "#505357",
        fontSize: "17px",
        fontWeight: '400',
        top: (theme) => theme.spacing(2.2),
        left: (theme) => theme.spacing(6),
      },
      "& .dropdown-icon": { width: '1rem', height: '1rem' }
    }}>
      <Observer>
        {() => (
          <FormControl sx={{
            m: 1, width: 300,
            "&::before": { borderBottom: '0px' },
          }}>
            <Select
              onOpen={() => setOpen(true)}
              onClose={() => setOpen(false)}
              IconComponent={KeyboardArrowDownIcon}
              MenuProps={MenuProps}
              sx={{
                "&::before": { borderBottom: '0px' },
                "&::after": { borderBottom: '0px' },
                "&:hover:before": { borderBottom: "none !important" },
                "& .MuiSelect-select": { height: '35px !important', borderRadius: '5px' },
                "& .MuiInput-input": { backgroundColor: '#FFF !important', border: '1px solid #C9CCD2', },
                "& .MuiSelect-icon": { right: '16px' },
                "& .MuiPaper-root": { background: 'red' }
              }}
              variant="standard"
              multiple
              value={state.filterBy}
              onChange={handleChange}
              renderValue={(selected) => ``}
            >
              {filterOptions.map((filter, index) => {
                if (index === 0 || !filterOptions.slice(0, index).find(filterOption => filterOption === filter))
                  return <MenuItem
                    key={filter}
                    value={filter}
                    sx={{
                      color: state.filterBy.includes(filter) ? "#074EE8" : "",
                      "&.Mui-selected": { backgroundColor: 'white' },
                    }}>
                    <Checkbox checked={state.isSelected(filter)} sx={{
                      color: '#505357',
                      "&.Mui-checked": { color: '#074EE8' }
                    }} />
                    <ListItemText primary={<OrangeryText text={filter} limit={25} />} sx={{
                      "& .MuiTypography-root": { fontWeight: 400 },
                    }} />
                  </MenuItem>
              })}
            </Select>
          </FormControl>
        )}
      </Observer>
      <Observer>
        {() => (
          <>
            <Typography className="filter-selected">{state.filterBy.length > 0 ? `${state.filterBy.length} selected` : "Filter by"}</Typography>
            <FilterIcon className="icon" />
          </>
        )}
      </Observer>
    </Box>
  );
}