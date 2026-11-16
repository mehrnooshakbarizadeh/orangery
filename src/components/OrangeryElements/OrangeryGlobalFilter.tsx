// react & next
import React from "react";

// external dependencies
import InputAdornment from "@mui/material/InputAdornment";
import Search from "@mui/icons-material/Search";
import { Box, debounce, InputBase } from "@mui/material";

const OrangeryGlobalFilter = ({
  filter,
  setFilter,
}: {
  filter?: any;
  setFilter?: (value: string | number) => void;
}) => {
  // const handleFilter = debounce((value: string) => {
  //   setFilter(value);
  // }, 500);

  return (
    <Box
      sx={{
        borderRadius: 2,
        height: 55,
        backgroundColor: (theme) => theme.palette.grey[200],
        display: "flex",
        alignItems: "center",
        gap: 3,
        px: 2,
        width: "100%",
      }}
    >
      <InputBase
        defaultValue={filter || ""}
        // onChange={(e) => {
        //   handleFilter(e.target.value);
        // }}
        placeholder="Search ..."
        fullWidth
        startAdornment={
          <InputAdornment position="start">
            <Search />
          </InputAdornment>
        }
      />
    </Box>
  );
};

export default OrangeryGlobalFilter;