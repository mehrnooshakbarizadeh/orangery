import * as React from 'react';
import Checkbox from '@mui/material/Checkbox';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import FilterIcon from '../../assets/svg/filter.svg';
import {
  Box,
  Button,
  FormControl,
  ListItemText,
  MenuItem,
  Select,
  Typography
} from '@mui/material';
import { Observer } from 'mobx-react-lite';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { styled } from '@mui/material/styles';

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

export interface IFilter {
  name: string,
}

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;

const BpIcon = styled('span')(({ theme }) => ({
  marginRight: 8,
  borderRadius: '50%',
  width: 17,
  height: 17,
  backgroundColor: "white",
  border: "2px solid #505357",
  'input:hover ~ &': {
    backgroundColor: theme.palette.mode === 'dark' ? '#30404d' : '#ebf1f5',
  },
}));

const BpCheckedIcon = styled(BpIcon)({
  outline: "6px solid #074EE8",
  outlineOffset: "-6px",
  border: "2px solid #074EE8",
});


export default function OrangeryFilter({
  label,
  placeHolder,
  icon,
  options: outerOptions,
  selectedValues,
  onChange,
  multiSelect,
  width,
  horizontal,
  withoutCheckbox,
  white,
  textWidth,
}: {
  label?: string;
  placeHolder?: string;
  icon?: JSX.Element;
  options: string[];
  selectedValues?: string[];
  onChange: (value: string[]) => void;
  multiSelect?: boolean;
  width?: string | number;
  horizontal?: boolean;
  withoutCheckbox?: boolean;
  white?: boolean;
  textWidth?: string | number;
}) {
  const [open, setOpen] = React.useState(false);
  const [options, setOptions] = React.useState(outerOptions);

  React.useEffect(() => {
    if (outerOptions)
      setOptions(outerOptions.filter((item, pos) => outerOptions.indexOf(item) == pos)) // make options unique
  }, [outerOptions])

  const handleChange = (values: string[]) => { ////////!!!!!!!! any[]?
    let newValues = Array.isArray(values)
      ? values
      : [values];

    onChange(newValues)
  }

  function isSelected(filter: string): boolean {
    return !!selectedValues?.find((v) => v === filter)
  }

  return (
    !horizontal
      ? <Box
        sx={{
          // maxWidth: 300,
          // width: "100%",
          position: "relative",
          display: "flex",
          alignItems: "center",
          "& .dropdown-icon": {
            width: '1rem',
            height: '1rem'
          }
        }}
      >
        <Observer>
          {() => (
            <FormControl
              sx={{
                // m: 1, width: 300,
                width: width ?? 225,
                "&::before": {
                  borderBottom: '0px'
                },
              }}>
              <Select
                onOpen={() => setOpen(true)}
                onClose={() => setOpen(false)}
                IconComponent={KeyboardArrowDownIcon}
                MenuProps={{
                  PaperProps: {
                    style: {
                      maxHeight: ITEM_HEIGHT * 9 + ITEM_PADDING_TOP,
                      width: width ?? 225,
                      // width: "100%",
                      backgroundColor: "#fff !important",
                      boxShadow: "0px 25px 40px rgba(51, 74, 108, 0.1)",
                      borderRadius: "0 0 15px 15px",
                    },
                  },
                }}
                sx={{
                  "&::before": { borderBottom: '0px' },
                  "&::after": { borderBottom: '0px' },
                  "&:hover:before": { borderBottom: "none !important" },
                  "& .MuiSelect-select": { height: '46px !important', borderRadius: '5px' },
                  "& .MuiInput-input": {
                    height: "44px !important",
                    backgroundColor: open
                      ? '#FFF !important'
                      : white
                        ? "white"
                        : "#F5F7FA !important",
                    ...(white
                      ? { border: "1px solid #C9CCD2" }
                      : {}
                    )
                  },
                  "& .MuiSelect-icon": { right: '16px' },
                  "& .MuiPaper-root": { background: 'red' },
                }}
                variant="standard"
                multiple={multiSelect}
                value={selectedValues}
                onChange={(e: any) => handleChange(e.target.value)}
                renderValue={(selected) => ``}
              >
                {options.map(filter => (
                  <MenuItem
                    key={filter}
                    value={filter}
                    sx={{
                      color: selectedValues?.includes(filter) ? "#074EE8" : "",
                      "&.Mui-selected": { backgroundColor: 'white' },
                    }}
                  >
                    {withoutCheckbox
                      ? <></>
                      : multiSelect
                        ? <Checkbox
                          checked={isSelected(filter)}
                          sx={{
                            color: '#505357',
                            "&.Mui-checked": { color: '#074EE8' }
                          }}
                        />
                        : isSelected(filter)
                          ? <BpCheckedIcon />
                          : <BpIcon />
                    }
                    <ListItemText
                      primary={filter}
                      sx={{
                        "& .MuiTypography-root": { fontWeight: 400 },
                      }}
                    />
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}
        </Observer>

        <Observer>
          {() => (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                height: 46,
                "& .icon": {
                  mr: 2,
                  position: "absolute",
                  width: 16,
                  maxHeight: 20,
                  color: "#505357",
                  top: (theme) => theme.spacing(2.3),
                  left: (theme) => theme.spacing(2.5),
                },
              }}
            >
              <Typography
                sx={{
                  mr: 2,
                  position: "absolute",
                  color: "#505357",
                  fontSize: "17px",
                  fontWeight: '400',
                  ...(textWidth
                    ? {
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      width: textWidth,
                    }
                    : {}
                  ),
                  top: (theme) => theme.spacing(2),
                  left: (theme) => theme.spacing(6),
                }}
              >
                {selectedValues?.length === 1
                  ? selectedValues?.[0]
                  : selectedValues?.length ?? 0 > 1
                    ? `${selectedValues?.length} selected`
                    : placeHolder ?? "Filter By"
                }
              </Typography>
              {icon
                ? icon
                : <FilterIcon className="icon" />
              }
            </Box>
          )}
        </Observer>
      </Box>
      : <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          gap: 0.25,
          py: .5,
          px: .5,
          backgroundColor: "rgb(239, 242, 245)",
          borderRadius: 1,
          width: "fit-content"
        }}
      >
        {options.map(filter => (
          <Button
            key={filter}
            sx={{
              backgroundColor: isSelected(filter) ? "white" : "rgb(239, 242, 245)",
              minWidth: 0,
              width: 50,
              height: 35,
              p: 0,
              fontWeight: 700,
              fontSize: 18,
            }}
            onClick={() => handleChange([filter])}
          >
            {filter}
          </Button>
        ))}
      </Box>
  );
}