// contexts & globals
import { useGlobalState } from "../../Contexts & Globals/GlobalContext";

// react & next
import React from "react";

// external dependencies
import {
  Box,
  Grid,
  debounce,
  Typography,
  Input,
  InputAdornment,
} from "@mui/material";
import { observer, Observer } from "mobx-react-lite";
import { makeAutoObservable } from "mobx";
import Fuse from "fuse.js";

// orangery elements & internal dependencies
import {
  OrangeryCoworkerAutocomplete, OrangeryFilter, OrangeryNavigationContentLoader, OrangeryNavigationPlaceholder, OrangeryText, OrangeryUserCard2,
} from ".";

// queries & backend
import { IDoorAccess, ILock, useLocks } from "../../queries/apps/saltoKs";
import { useOffices } from "../../queries/office";

// icons, images & colors
import SearchIcon from "../../assets/svg/search.svg";
import PlaceholderSvg from "../../assets/svg/placeholders/default.svg";
import LockIcon from "../../assets/svg/apps/saltoKs/lock-icon.svg";
import OrangeryCheckBox from "../dashboard/apps/saltoKs/doorAccessesTab/OrangeryCheckBox";

const options = {
  isCaseSensitive: false,
  findAllMatches: true,
  includeMatches: true,
  includeScore: true,
  useExtendedSearch: false,
  threshold: 0.4,
  location: 0,
  distance: 400,
  shouldSort: true,
  maxPatternLength: 32,
  minMatchCharLength: 1,
  keys: ["lock_name", "office.name"],
};

export class ListState {
  public sortBy = "";
  public asce: boolean = true;
  public search: string = "";
  public filterByLocation: string[] = [];
  public filterByCoworker: string[] = [];

  constructor() {
    makeAutoObservable(this);
  }

  setSearch(value: string) {
    this.search = value;
  }

  pushToFilterByLocationList(value: string) {
    if (this.filterByLocation.includes(value)) {
      return;
    }
    this.filterByLocation.push(value);
  }

  deleteFromFilterByLocationList(value: number) {
    this.filterByLocation.splice(value, 1);
  }

  pushToFilterByCoworkerList(value: string) {
    if (this.filterByCoworker.includes(value)) {
      return;
    }
    this.filterByCoworker.push(value);
  }

  deleteFromFilterByCoworkerList(value: number) {
    this.filterByCoworker.splice(value, 1);
  }
}

function getManipulatedList(
  locks: ILock[],
  filterByLocation: string[],
  filterByCoworker: string[],
  search: string,
) {
  // let locksList = [...locks];
  let locksList = JSON.parse(JSON.stringify(locks));
  if (filterByLocation && filterByLocation.length > 0)
    locksList = handleFilterByLocation(locksList, filterByLocation)
  if (filterByCoworker && filterByCoworker.length > 0)
    locksList = handleFilterByCoworker(locksList, filterByCoworker)

  if (search) {
    const fuse = new Fuse(locksList, options);
    locksList = fuse.search(search).map((r) => r.item);
  }

  return locksList;
}

function handleFilterByLocation(locks: ILock[], filterByLocation: string[]) {
  let filteredList = [...locks];
  filterByLocation.forEach((v, j) => {
    if (v === "All") {
    } else
      filteredList = locks.filter((lock) => lock.office?.name === v);
  });
  return filteredList;
}

function handleFilterByCoworker(locks: ILock[], filterByCoworker: string[]) {
  let filteredList = [...locks];
  console.log({ filteredList })
  filterByCoworker.forEach((v, j) => {
    if (v === "All" || !v) {
    } else
      filteredList = locks.filter((lock) => lock.users?.find((user: IDoorAccess) => user.uuid === v));
  });
  return filteredList;
}

export default function OrangeryLocksSelector({
  values,
  initialValues,
  onChange,
}: {
  values: string[];
  initialValues: string[];
  onChange: (value: string[]) => void;
}) {
  const {
    data: locks,
    isLoading,
    isError,
  } = useLocks(true);
  const state = React.useMemo(() => new ListState(), []);

  return <Box
    sx={{
      backgroundColor: "#fff",
      display: "flex",
      flexDirection: "column",
      // justifyContent: "start",
      // minHeight: 666,
      height: 351,
      borderRadius: 1.5,
    }}
  >
    {isLoading
      ? <OrangeryNavigationContentLoader />
      : locks && locks.length > 0
        ?
        <>
          <Header state={state} />

          <Box
            sx={{
              overflowY: "auto", // Make it scroll!
              height: `calc(100%)`,
              // maxHeight: 280,
              "&::-webkit-scrollbar": {
                width: "0.4em",
              },
              pr: locks.length > 4 ? 1 : 0,
              "&::-webkit-scrollbar-track": {
                marginLeft: "20px",
              },
              "&::-webkit-scrollbar-thumb": {
                backgroundColor: "rgba(0,0,0,.1)",
                borderRadius: 5,
              },
            }}
          >
            <Observer>
              {() => {
                const manipulatedList = getManipulatedList(
                  locks,
                  state.filterByLocation,
                  state.filterByCoworker,
                  state.search,
                );
                return (
                  manipulatedList && manipulatedList.length > 0
                    ? <LocksRows
                      locks={manipulatedList}
                      values={values}
                      initialValues={initialValues}
                      onChange={onChange}
                    />
                    : <OrangeryNavigationPlaceholder
                      width={213}
                      height={224}
                      minHeight={0}
                      title={"No locks found!"}
                      subtitle={"Please search or filter somthing else"}
                      PlaceholderSvg={PlaceholderSvg}
                      // AddNewButton={<AddNewLockButton />}
                      addNewButtonText={""}
                    />
                );
              }}
            </Observer>
          </Box>
        </>
        : <OrangeryNavigationPlaceholder
          // vertical
          width={213}
          height={224}
          minHeight={0}
          title={"No lock is available!"}
          subtitle={""}
          PlaceholderSvg={PlaceholderSvg}
          addNewButtonText={""}
        />
    }
  </Box>;
}

const LocksRows = ({
  locks,
  onChange: outerOnChange,
  values,
  initialValues,
}: {
  locks: ILock[];
  onChange: (values: string[]) => void;
  values: string[];
  initialValues: string[];
}) => {
  function onChange(lockId: string, checked: boolean) {
    const i = values.findIndex(
      (v) => v === lockId
    );
    if (checked) {
      if (i === -1) {
        values.push(lockId);
      }
    } else {
      if (i !== -1) {
        values.splice(i, 1);
      }
    }

    outerOnChange(values)
  }

  return (
    <>
      {locks.sort(
        (a, b) => (
          (initialValues.find((value) => value === b.lock_id) ? true : false)
            ? 1
            : (initialValues.find((value) => value === a.lock_id) ? true : false)
              ? -1
              : 1
        )
      ).map(lock => (
        <LockRow
          key={lock.uuid}
          lock={lock}
          onChange={(value: boolean) => onChange(lock.lock_id, value)}
          checked={values.find((value) => value === lock.lock_id) ? true : false}
        />
      ))}
    </>
  );
};

function LockRow({
  lock,
  onChange: outerOnchange,
  checked: outerChecked
}: {
  lock: ILock;
  onChange: (value: boolean) => void,
  checked: boolean
}) {
  const [checked, setChecked] = React.useState(outerChecked)

  function onChange(e: React.ChangeEvent<HTMLInputElement>) {
    setChecked(e.target.checked)
    outerOnchange(e.target.checked)
  }

  return (
    <>
      <Grid
        container
        sx={{
          display: "flex",
          justifyContent: "start",
          backgroundColor: "#F5F5F5",
          py: 1,
          pl: 1.4,
          pr: 2.4,
          alignItems: "center",
          borderRadius: 1.5,
          mb: 1.2,
          mx: 0,
          fontSize: 16,
          fontWeight: 500,
        }}
      >
        <Grid xs={8} item
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 0,
            flexDirection: "row",
            textAlign: "left",
            pr: 4,
          }}
        >
          <OrangeryCheckBox
            onChange={onChange}
            checked={checked}
          />

          <Box
            sx={{
              ml: 1.5,
              display: "flex",
              alignItems: "center",
              gap: 2,
              flexDirection: "row",
              "& .icon": {
                flex: "none"
              }
            }}
          >
            <LockIcon className="icon" />
            <Typography
              sx={{
                fontSize: 16,
                fontWeight: 600,
                wordBreak: "break-all",
              }}
            >
              {lock.lock_name}
            </Typography>
          </Box>
        </Grid>

        <Grid xs={4} item
          sx={{
            display: "flex",
            // alignItems: "center",
            gap: 1,
            flexDirection: "column",
          }}
        >
          <Typography
            sx={{
              fontSize: 16,
              fontWeight: 600
            }}
          >
            <OrangeryText text={lock.office?.name || "-"} limit={30} />
          </Typography>
        </Grid>
      </Grid>
    </>
  );
}

const Header = observer(
  ({ button, state }: { button?: JSX.Element; state: ListState }) => {
    const { currentUser } = useGlobalState();

    const handleFilter = debounce((value: string) => {
      state.setSearch(value);
    }, 500);

    const {
      data: offices,
      // isLoading,
      // isError
    } = useOffices();

    return (
      <>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            mb: 2,
            width: "100%",
            flexDirection: "row",
            gap: 2
          }}
        >
          <Box
            sx={{
              borderRadius: 1,
              backgroundColor: "white",
              height: 55,
              display: "flex",
              alignItems: "center",
              gap: 3,
              px: 2,
              border: "1px solid #C9CCD2",
              flexGrow: 1,
            }}
          >
            <Input
              disableUnderline={true}
              onChange={(e) => {
                handleFilter(e.target.value.toLowerCase());
              }}
              sx={{
                width: "100%",
                "& .MuiInput-input": {
                  fontSize: '17px !important',
                  fontWeight: "400 !important",
                  color: '#505357 !important'
                },
                "& .icon": {
                  width: "1.3rem",
                  color: "#55585C",
                },
              }}
              placeholder="Search Doors"
              startAdornment={
                <InputAdornment position="start">
                  <SearchIcon className="icon" />
                </InputAdornment>
              }
            />
          </Box>

          <Box
            sx={{
              backgroundColor: "white",
              display: "flex",
              alignItems: "center",
              width: "30%",
            }}
          >
            <OrangeryFilter
              // multiSelect
              width={250}
              textWidth={"65%"}
              white
              withoutCheckbox
              selectedValues={state.filterByLocation}
              placeHolder="Location"
              options={[
                "All",
                ...offices?.map((office) => office.name) ?? [] as string[]
              ]}
              onChange={(newValues) => {
                newValues.forEach((e: any) => {
                  const i = state.filterByLocation.findIndex((v) => v === e);
                  if (i === -1) {
                    state.pushToFilterByLocationList(e);
                  }
                });
                [...state.filterByLocation].forEach((v) => {
                  const i = newValues.findIndex((e: any) => v === e);
                  if (i === -1) {
                    const j = state.filterByLocation.findIndex((t) => t === v);
                    state.deleteFromFilterByLocationList(j);
                  }
                });
              }}
            />
          </Box>

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              width: "30%",
            }}
          >
            <OrangeryCoworkerAutocomplete
              noHeight
              preUsers={[currentUser]}
              name="user_uuid"
              placeholder="Employee"
              // icon={<UserIcon />}
              value={state.filterByCoworker[0]}
              onChange={(newValue) => {
                state.filterByCoworker = [newValue];
              }}
            // filterOptions={offices?.map((office) => office.name) ?? [] as string[]}
            />
          </Box>
        </Box>
      </>
    );
  }
);