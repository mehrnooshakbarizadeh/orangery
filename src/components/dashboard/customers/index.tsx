// contexts & globals
import { useGlobalState } from "../../../Contexts & Globals/GlobalContext";
import Search from "@mui/icons-material/Search";
import ArrowDownAZIcon from "../../../assets/svg/arrowDownAZ.svg";
import ArrowUpZAIcon from "../../../assets/svg/arrowUpZA.svg";
import Fuse from "fuse.js";
// react & next
import React from "react";

// external dependencies
import {
  Box,
  Button,
  debounce,
  Grid,
  Input,
  InputAdornment,
  Typography,
} from "@mui/material";
import { makeAutoObservable } from "mobx";
import { Observer, observer } from "mobx-react-lite";

// orangery elements & internal dependencies
import {
  // OrangeryGlobalFilter,
  OrangeryUserCircle,
  OrangeryNavigationContentLoader,
  OrangeryNavigationPlaceholder,
  OrangeryText,
} from "../../OrangeryElements";
import AddNewCustomerButton from "./AddNewCustomerButton";
import EditCustomerButton from "./EditCustomerButton";
import SortCustomerAutocomplete from "./SortCustomerAutocomplete";

// queries & backend
import { ICustomer, useCustomers } from "../../../queries/customer";

// icons, images & colors
import PlaceholderSvg from "../../../assets/svg/placeholders/customer.svg";
import OrangeryNoSearchResultPlaceholder from "../../OrangeryElements/OrangeryNoSearchResultPlaceholder";

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
  keys: [
    "first_name",
    "last_name",
    "email",
    "company_name",
    "address",
    "customer_number",
    "tax_id",
  ],
};

export class CustomerSortState {
  public sortBy = "";
  public asce: boolean = true;
  public search: string = "";

  constructor() {
    makeAutoObservable(this);
  }

  setSortBy(value: string) {
    this.sortBy = value;
  }

  setDesc(value: boolean) {
    this.asce = !value;
  }

  setSearch(value: string) {
    this.search = value;
  }
}

function getSortedSearchedList(
  customers: ICustomer[],
  search: string,
  sortBy: string,
  asce: boolean
) {
  let sortedSearchedCustomerList = [...customers];
  if (search) {
    const fuse = new Fuse(sortedSearchedCustomerList, options);
    sortedSearchedCustomerList = fuse.search(search).map((r) => r.item);
  }
  sortedSearchedCustomerList = sortCustomers(
    sortedSearchedCustomerList,
    sortBy,
    asce
  );
  return sortedSearchedCustomerList;
}

export default function CustomersList() {
  const globalState = useGlobalState();
  const state = React.useMemo(() => new CustomerSortState(), []);
  const { data: customers, isLoading } = useCustomers(globalState.office_uuid);

  return (
    <>
      <Observer>
        {() => (
          <>
            {isLoading ? (
              <OrangeryNavigationContentLoader />
            ) : customers && customers.length > 0 ? (
              <Box
                sx={{
                  backgroundColor: "#fff",
                  display: "flex",
                  flexDirection: "column",
                  // justifyContent: "start",
                  height: "100%",
                  minHeight: 666,
                  borderRadius: 1.5,
                  py: 3,
                  px: 2,
                  "& .scroll-align": {
                    "&::-webkit-scrollbar": {
                      width: "0.4em",
                    },
                    "&::-webkit-scrollbar-track": {
                      marginLeft: "20px",
                    },
                    "&::-webkit-scrollbar-thumb": {
                      backgroundColor: "rgba(0,0,0,.1)",
                      borderRadius: 5,
                    },
                  },
                }}
              >
                <Header button={<AddNewCustomerButton />} state={state} />
                <Observer>
                  {() => {
                    const sortedSearchedList = getSortedSearchedList(
                      customers,
                      state.search,
                      state.sortBy,
                      state.asce
                    );
                    return (
                      <>
                        <Typography variant="H6" component="h6">
                          {`${sortedSearchedList.length === customers.length
                            ? "Total "
                            : ""
                            }Customers: ${sortedSearchedList.length} Person${sortedSearchedList.length !== 0 &&
                              sortedSearchedList.length !== 1
                              ? "s"
                              : ""
                            }`}
                        </Typography>
                        {sortedSearchedList && sortedSearchedList.length > 0 ? (
                          <CustomerRows customers={sortedSearchedList} />
                        ) : (
                          <OrangeryNoSearchResultPlaceholder />
                        )}
                      </>
                    );
                  }}
                </Observer>
              </Box>
            ) : (
              <OrangeryNavigationPlaceholder
                title={"No customer has been added yet!"}
                subtitle={
                  "Make a list of potential customers for the company to be more targeted to marketing plans."
                }
                PlaceholderSvg={PlaceholderSvg}
                AddNewButton={<AddNewCustomerButton />}
                addNewButtonText={""}
              />
            )}
          </>
        )}
      </Observer>
    </>
  );
}

const CustomerRows = ({ customers }: { customers: ICustomer[] }) => {
  return (
    <div
      style={{
        height: `calc(100vh - 72px)`,
        overflow: "auto", // Make it scroll!
      }}
      className="scroll-align"
    >
      {customers.map((customer) => (
        <CustomerRow key={customer.uuid} customer={customer} />
      ))}
    </div>
  );
};

function sortCustomers(customers: ICustomer[], sortBy: string, asce: boolean) {
  if (sortBy) {
    switch (sortBy) {
      case "Name":
        return sortByName(customers, asce);
      case "Email":
        return sortByEmail(customers, asce);
      case "Company Name":
        return sortByCompanyName(customers, asce);
      case "Customer Number":
        return sortByCustomerNumber(customers, asce);
      case "Tax Id":
        return sortByTaxId(customers, asce);
      case "Created Date":
        return sortByCreatedDate(customers, asce);
    }
  }
  return customers;
}

function sortByName(customers: ICustomer[], asce: boolean) {
  if (asce) {
    return customers.sort((a, b) =>
      a.name.toLocaleUpperCase() < b.name.toLocaleUpperCase() ? 1 : -1
    );
  } else {
    return customers.sort((a, b) =>
      a.name.toLocaleUpperCase() > b.name.toLocaleUpperCase() ? 1 : -1
    );
  }
}
function sortByEmail(customers: ICustomer[], asce: boolean) {
  if (!asce) {
    return customers.sort((a, b) =>
      a.email.toLocaleUpperCase() > b.email.toLocaleUpperCase() ? 1 : -1
    );
  } else {
    return customers.sort((a, b) =>
      a.email.toLocaleUpperCase() < b.email.toLocaleUpperCase() ? 1 : -1
    );
  }
}
function sortByCompanyName(customers: ICustomer[], asce: boolean) {
  if (!asce) {
    return customers.sort((a, b) =>
      a.company_name.toLocaleUpperCase() > b.company_name.toLocaleUpperCase()
        ? 1
        : -1
    );
  } else {
    return customers.sort((a, b) =>
      a.company_name.toLocaleUpperCase() < b.company_name.toLocaleUpperCase()
        ? 1
        : -1
    );
  }
}
function sortByCustomerNumber(customers: ICustomer[], asce: boolean) {
  if (!asce) {
    return customers.sort((a, b) => {
      let aValue = a.customer_number === "-" ? 0 : Number(a.customer_number);
      let bValue = b.customer_number === "-" ? 0 : Number(b.customer_number);
      return aValue - bValue;
    });
  } else {
    return customers.sort((a, b) => {
      let aValue = a.customer_number === "-" ? 0 : Number(a.customer_number);
      let bValue = b.customer_number === "-" ? 0 : Number(b.customer_number);
      return bValue - aValue;
    });
  }
}
function sortByTaxId(customers: ICustomer[], asce: boolean) {
  if (!asce) {
    return customers.sort((a, b) => {
      let aValue = a.tax_id === "-" ? 0 : Number(a.tax_id);
      let bValue = b.tax_id === "-" ? 0 : Number(b.tax_id);
      return aValue - bValue;
    });
  } else {
    return customers.sort((a, b) => {
      let aValue = a.tax_id === "-" ? 0 : Number(a.tax_id);
      let bValue = b.tax_id === "-" ? 0 : Number(b.tax_id);
      return bValue - aValue;
    });
  }
}
function sortByCreatedDate(customers: ICustomer[], asce: boolean) {
  if (asce) {
    return customers.sort((a, b) =>
      new Date(a.created_date) > new Date(b.created_date) ? 1 : -1
    );
  } else {
    return customers.sort((a, b) =>
      new Date(a.created_date) < new Date(b.created_date) ? 1 : -1
    );
  }
}

function CustomerRow({ customer }: { customer: ICustomer }) {
  return (
    <>
      <Grid
        container
        sx={{
          display: "flex",
          justifyContent: "space-between",
          py: 2.7,
          px: 2.4,
          boxShadow: "1px 1px 8px #0000000a",
          border: "1px solid rgb(210 215 221)",
          alignItems: "center",
          borderRadius: 1.5,
          mb: 1.2,
          rowGap: 2,
          mx: 0,
          fontSize: 16,
          fontWeight: 500,
        }}
      >
        <Grid
          xs={12}
          sm={4}
          md={3}
          item
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 3,
            width: "100%",
            "& .memo-icon": { width: "1.3rem" },
          }}
        >
          <OrangeryUserCircle
            name={customer.first_name ? customer.first_name : ""}
            fileName={
              typeof customer.image === "string" ? customer.image : undefined
            }
          />
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 1,
              alignItems: "start",
              maxWidth: "calc(100% - 70px)",
            }}
          >
            <Typography
              variant="h4"
              sx={{
                width: "100%",
                textTransform: "capitalize",
                whiteSpace: "nowrap",
              }}
            >
              <OrangeryText
                text={`${customer.first_name} ${customer.last_name}`}
                limit={20}
              />
            </Typography>
            <Typography
              variant="h6"
              sx={{
                width: "100%",
                whiteSpace: "nowrap",
              }}
            >
              <OrangeryText text={customer.email} limit={30} />
            </Typography>
          </Box>
        </Grid>
        <Grid
          item
          xs={3}
          sm={2}
          md={2}
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 1,
          }}
        >
          <Typography variant="h6">COMPANY</Typography>
          <Box
            sx={{
              mr: 2,
              width: "100%",
              textAlign: "left",
              maxWidth: "80%",
              "& .long-name": {
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              },
            }}
          >
            <Typography variant="h4">
              {customer.company_name ? (
                <OrangeryText text={customer.company_name} limit={15} />
              ) : (
                "-"
              )}
            </Typography>
          </Box>
        </Grid>
        <Grid
          item
          xs={6}
          sm={5}
          md={2.5}
          sx={{ display: "flex", flexDirection: "column", gap: 1 }}
        >
          <Typography variant="h6">ADDRESS</Typography>
          <Typography variant="h4">
            {customer.address ? (
              <OrangeryText text={customer.address} limit={30} />
            ) : (
              "-"
            )}
          </Typography>
        </Grid>
        <Grid
          item
          xs={4}
          sm={3}
          md={2}
          sx={{ display: "flex", flexDirection: "column", gap: 1 }}
        >
          <Typography variant="h6">CUSTOMER NUMBER</Typography>
          <Typography variant="h4">
            {customer.customer_number ? (
              <OrangeryText text={customer.customer_number} limit={10} />
            ) : (
              "-"
            )}
          </Typography>
        </Grid>
        <Grid
          item
          xs={4}
          sm={2}
          md={1}
          sx={{ display: "flex", flexDirection: "column", gap: 1 }}
        >
          <Typography variant="h6">TAX ID</Typography>
          <Typography variant="h4">
            {customer.tax_id ? customer.tax_id : "-"}
          </Typography>
        </Grid>
        <Grid
          item
          xs={4}
          sm={2}
          md={1}
          sx={{ display: "flex", flexDirection: "column", gap: 1 }}
        >
          <Typography variant="h6">NO. OF OFFERS</Typography>
          <Typography variant="h4">
            {customer.products?.length ? customer.products?.length : "-"}
          </Typography>
        </Grid>
        <Grid item xs={1} md={0.5} textAlign={"right"}>
          <EditCustomerButton customer={customer} />
        </Grid>
      </Grid>
    </>
  );
}

const Header = observer(
  ({ button, state }: { button?: JSX.Element; state: CustomerSortState }) => {
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
              <Observer>
                {() => (
                  <SortCustomerAutocomplete
                    name="sortBy"
                    placeholder="Sort By..."
                    value={state.sortBy}
                    onChange={(newValue: string) => {
                      state.setSortBy(newValue);
                    }}
                  />
                )}
              </Observer>
            </Box>

            <Box
              sx={{
                minWidth: 300,
                maxWidth: 400,
                "& .arrow-icon": { width: "1.2rem", height: "1.2rem" },
              }}
            >
              <Observer>
                {() => (
                  <Button
                    onClick={() => state.setDesc(state.asce)}
                    sx={{
                      backgroundColor: "#F9F9FA",
                      p: 2,
                      borderRadius: "5px",
                    }}
                  >
                    {state.asce ? (
                      <ArrowUpZAIcon className="arrow-icon" />
                    ) : (
                      <ArrowDownAZIcon className="arrow-icon" />
                    )}
                  </Button>
                )}
              </Observer>
            </Box>
          </Box>
          <Box
            sx={{
              flexShrink: 0,
              ml: 3,
            }}
          >
            {button}
          </Box>
        </Box>
      </>
    );
  }
);
