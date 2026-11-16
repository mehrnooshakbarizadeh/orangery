import { Box, Button, debounce, Input, InputAdornment } from "@mui/material";
import { observer } from "mobx-react-lite";
import { RewardSortState } from "./RewardList";
import Search from "@mui/icons-material/Search";
import ArrowDownAZIcon from "../../../../assets/svg/arrowDownAZ.svg";
import ArrowUpZAIcon from "../../../../assets/svg/arrowUpZA.svg";
import { OrangerySortAutocomplete } from "../../../OrangeryElements";
import { ISort } from "../../../OrangeryElements/OrangerySortAutocomplete";

export const sortItems: ISort[] = [
  {
    name: "Name",
    value: "Name",
  },
  {
    name: "Invoice Date",
    value: "Invoice Date",
  },
  {
    name: "Amount of Reward",
    value: "Amount of Reward",
  },
];

export const Header = observer(({ state }: { state: RewardSortState }) => {
  const handleFilter = debounce((value: string) => {
    state.setSearch(value);
  }, 500);

  return (
    <>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "end",
          mb: 2,
          flexFlow: {
            sx: "column",
            sm: "row",
          },
        }}
      >
        <Box
          sx={{ flexGrow: 1, display: "flex", alignItems: "center", gap: 1 }}
        >
          <Box
            sx={{
              borderRadius: 2,
              height: 55,
              backgroundColor: (theme) => theme.palette.grey[200],
              display: "flex",
              alignItems: "center",
              gap: 3,
              px: 2,
              flexBasis: "22%",
            }}
          >
            <Input
              disableUnderline={true}
              onChange={(e) => {
                handleFilter(e.target.value.toLowerCase());
              }}
              sx={{ width: "100%" }}
              placeholder="search ..."
              endAdornment={
                <InputAdornment position="end">
                  <Search />
                </InputAdornment>
              }
            />
          </Box>
          <Box sx={{ minWidth: 264, maxWidth: 400 }}>
            <OrangerySortAutocomplete
              name="sortBy"
              placeholder="Sort By..."
              sortItems={sortItems}
              value={state.sortBy}
              onChange={(newValue: string) => {
                state.setSortBy(newValue);
              }}
            />
          </Box>

          <Box
            sx={{
              minWidth: 300,
              maxWidth: 400,
              "& .arrow-icon": { width: "1.2rem", height: "1.2rem" },
            }}
          >
            <Button
              onClick={() => state.setDesc(state.asce)}
              sx={{ backgroundColor: "#F9F9FA", p: 2, borderRadius: "5px" }}
            >
              {state.asce ? (
                <ArrowUpZAIcon className="arrow-icon" />
              ) : (
                <ArrowDownAZIcon className="arrow-icon" />
              )}
            </Button>
          </Box>
        </Box>
      </Box>
    </>
  );
});
