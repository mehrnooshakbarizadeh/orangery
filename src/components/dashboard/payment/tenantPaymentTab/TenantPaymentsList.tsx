// contexts & globals
import { useGlobalState } from "../../../../Contexts & Globals/GlobalContext";
// import theme from "../../../../Contexts & Globals/theme";

// react & next
import React from "react";

// external dependencies
import {
  Box,
  Button,
  Grid,
  Fade,
  IconButton,
  Typography,
  debounce,
  Input,
  InputAdornment,
} from "@mui/material";
import { observer, Observer } from "mobx-react-lite";
import { makeAutoObservable } from "mobx";
import Fuse from "fuse.js";

// orangery elements & internal dependencies
import TenantPaymentMenu from "./tenantPaymentMenu";
import AddNewInvoiceButton from "./AddNewInvoiceButton";
import { ISort } from "../../../OrangeryElements/OrangerySortAutocomplete";
import {
  OrangeryNavigationContentLoader,
  OrangeryPrice,
  OrangeryReadOnlySwitch,
  OrangeryTooltip,
  OrangeryNavigationPlaceholder,
  OrangeryFilter,
  OrangerySortAutocomplete,
  OrangeryText,
} from "../../../OrangeryElements";

// queries & backend
import {
  ITenantPayment,
  useTenantPayments,
} from "../../../../queries/tenantPayment";

// icons, images & colors
import ArrowDownAZIcon from "../../../../assets/svg/arrowDownAZ.svg";
import ArrowUpZAIcon from "../../../../assets/svg/arrowUpZA.svg";
import FileContractIcon from "../../../../assets/svg/file-contract.svg";
import PlaceholderSvg from "../../../../assets/svg/placeholders/default.svg";
import SearchIcon from "@mui/icons-material/Search";
import OrangeryNoSearchResultPlaceholder from "../../../OrangeryElements/OrangeryNoSearchResultPlaceholder";
import Can from "../../../../services/can";

const searchOptions = {
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
    "name",
    "invoice_number",
    "sale_price",
    "total",
    "user.name",
    "user.email",
  ],
};

const sortItems: ISort[] = [
  {
    name: "Name",
    value: "Name",
  },
  {
    name: "Total",
    value: "Total",
  },
  {
    name: "Invoice Number",
    value: "Invoice Number",
  },
  {
    name: "Invoice Date",
    value: "Invoice Date",
  },
];

export class TenantPaymentsListState {
  public sortBy = "";
  public asce: boolean = true;
  public noFilter: boolean = false;
  public search: string = "";
  public filterBy: string[] = [];

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

  isSelected(filter: string) {
    return !!this.filterBy.find((v) => v === filter);
  }

  pushToFilterList(value: string) {
    if (this.filterBy.includes(value)) {
      return;
    }
    this.filterBy.push(value);
  }

  deleteFromFilterList(value: number) {
    this.filterBy.splice(value, 1);
  }
}

function getManipulatedList(
  tenantPayments: ITenantPayment[],
  filterBy: string[],
  search: string,
  sortBy: string,
  asce: boolean
) {
  let tenantPaymentsList = [...tenantPayments];
  if (search) {
    const fuse = new Fuse(tenantPaymentsList, searchOptions);
    tenantPaymentsList = fuse.search(search).map((r) => r.item);
  }
  if (filterBy) {
    tenantPaymentsList = filter(tenantPaymentsList, filterBy);
  }
  tenantPaymentsList = sort(tenantPaymentsList, sortBy, asce);
  return tenantPaymentsList;
}

function filter(tenantPayments: ITenantPayment[], filterBy: string[]) {
  let filterList = [...tenantPayments];
  filterBy.forEach((v, j) => {
    if (v === "All Statuses") {
    } else if (v === "Completed") filterList = filterByCompleted(filterList);
    else if (v === "To Be Charged")
      filterList = filterByToBeCharged(filterList);
    else if (v === "Refunded") filterList = filterByRefunded(filterList);
    else if (v === "Pending") filterList = filterByPending(filterList);
    else if (v === "Failed") filterList = filterByFailed(filterList);
    // else if (v === "On Marketplace") {
    //   filterList = filterByMarketPlace(filterList)
    // } else if (v === "Refunded") {
    //   filterList = filterByRefunded(filterList)
    // }
  });
  return filterList;
}

function filterByCompleted(tenantPayments: ITenantPayment[]) {
  return tenantPayments.filter(
    (tenantPayment) => tenantPayment.charge_success && !tenantPayment.refunded
  );
}
function filterByToBeCharged(tenantPayments: ITenantPayment[]) {
  return tenantPayments.filter((tenantPayment) => tenantPayment.to_be_charged);
}
function filterByRefunded(tenantPayments: ITenantPayment[]) {
  return tenantPayments.filter((tenantPayment) => tenantPayment.refunded);
}
function filterByPending(tenantPayments: ITenantPayment[]) {
  return tenantPayments.filter((tenantPayment) => tenantPayment.pending);
}
function filterByFailed(tenantPayments: ITenantPayment[]) {
  return tenantPayments.filter(
    (tenantPayment) =>
      !tenantPayment.to_be_charged &&
      !tenantPayment.charge_success &&
      !tenantPayment.refunded &&
      !tenantPayment.pending
  );
}

function sort(tenantPayments: ITenantPayment[], sortBy: string, asce: boolean) {
  if (sortBy) {
    switch (sortBy) {
      case "Name":
        return sortByName(tenantPayments, asce);
      case "Total":
        return sortByTotal(tenantPayments, asce);
      // case "Sale Price":
      //   return sortBySalePrice(tenantPayments, asce);
      case "Invoice Number":
        return sortByInvoiceNumber(tenantPayments, asce);
      case "Invoice Date":
        return sortByInvoiceDate(tenantPayments, asce);
    }
  }
  return tenantPayments;
}

function sortByName(tenantPayment: ITenantPayment[], asce: boolean) {
  if (!asce) {
    return tenantPayment.sort((a, b) =>
      a?.name.toLocaleUpperCase() > b.name.toLocaleUpperCase() ? 1 : -1
    );
  } else {
    return tenantPayment.sort((a, b) =>
      a.name.toLocaleUpperCase() < b.name.toLocaleUpperCase() ? 1 : -1
    );
  }
}
function sortByTotal(tenantPayment: ITenantPayment[], asce: boolean) {
  if (asce) {
    return tenantPayment?.sort((a, b) =>
      (a?.total ?? 0) < (b?.total ?? 0) ? 1 : -1
    );
  } else {
    return tenantPayment?.sort((a, b) =>
      (a.total ?? 0) > (b.total ?? 0) ? 1 : -1
    );
  }
}

// function sortBySalePrice(tenantPayment: ITenantPayment[], asce: boolean) {
//   if (asce) {
//     return tenantPayment?.sort((a, b) =>
//       a?.sale_price < b?.sale_price ? 1 : -1
//     );
//   } else {
//     return tenantPayment?.sort((a, b) => (a.sale_price > b.sale_price ? 1 : -1));
//   }
// }

function sortByInvoiceNumber(tenantPayment: ITenantPayment[], asce: boolean) {
  return tenantPayment?.sort((a, b) => {
    // return (
    //   !Number.isNaN(parseInt(a?.invoice_number)) && !Number.isNaN(parseInt(b?.invoice_number))
    //     ? (a?.invoice_number ?? 0) < (b?.invoice_number ?? 0)
    //       ? 1
    //       : -1
    //     : a?.invoice_number.toLowerCase() < b?.invoice_number.toLowerCase()
    //       ? 1
    //       : -1
    // ) * (asce ? 1 : -1)
    return (
      (parseInt(a?.invoice_number ?? 0) < parseInt(b?.invoice_number ?? 0)
        ? 1
        : -1) * (asce ? 1 : -1)
    );
  });
}

function sortByInvoiceDate(tenantPayment: ITenantPayment[], asce: boolean) {
  if (!asce) {
    return tenantPayment.sort((a, b) =>
      new Date(a.date) > new Date(b.date) ? 1 : -1
    );
  } else {
    return tenantPayment.sort((a, b) =>
      new Date(a.date) < new Date(b.date) ? 1 : -1
    );
  }
}

export default function TenantPaymentsList() {
  const { office_uuid } = useGlobalState();
  const {
    data: tenantPayments,
    isLoading,
    isError,
  } = useTenantPayments(office_uuid);
  const listState = React.useMemo(() => new TenantPaymentsListState(), []);

  return (
    <>
      {isLoading ? (
        <OrangeryNavigationContentLoader />
      ) : tenantPayments && tenantPayments.length > 0 ? (
        <Box
          sx={{
            backgroundColor: "#fff",
            display: "flex",
            flexDirection: "column",
            height: "100%",
            // minHeight: 666,
            borderRadius: 1.5,
            // py: 3,
          }}
        >
          <Header button={<Can I="view" a="AddNewInvoiceButton">
            <AddNewInvoiceButton />
          </Can>
          }
            listState={listState}
          />

          <Box
            sx={{
              overflowY: "auto",
              height: "calc(100% - 12px)",
              pr: "12px",
              display: "flex",
              flexDirection: "column",
              gap: 1,
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
            }}
          >
            <Observer>
              {() => {
                const manipulatedList = getManipulatedList(
                  tenantPayments,
                  listState.filterBy,
                  listState.search,
                  listState.sortBy,
                  listState.asce
                );
                return manipulatedList && manipulatedList.length > 0 ? (
                  <TenantPaymentRows
                    tenantPayments={manipulatedList}
                    listState={listState}
                  />
                ) : (
                  <OrangeryNoSearchResultPlaceholder />
                );
              }}
            </Observer>
          </Box>
        </Box>
      ) : (
        <OrangeryNavigationPlaceholder
          vertical
          width={213}
          height={224}
          title={"No Tenant Payments!"}
          subtitle={""}
          PlaceholderSvg={PlaceholderSvg}
          AddNewButton={<Can I="view" a="AddNewInvoiceButton">
            <AddNewInvoiceButton />
          </Can>}
          addNewButtonText={""}
        />
      )}
    </>
  );
}

const TenantPaymentRows = ({
  listState,
  tenantPayments,
}: {
  listState: TenantPaymentsListState;
  tenantPayments: ITenantPayment[];
}) => {
  return (
    <>
      {tenantPayments?.map((tenantPayment: ITenantPayment) => (
        <TenantPaymentRow
          key={tenantPayment.uuid}
          tenantPayment={tenantPayment}
        />
      ))}
    </>
  );
};

function TenantPaymentRow({
  tenantPayment,
}: {
  tenantPayment: ITenantPayment;
}) {
  function getPaymentMethod(tenantPayment: ITenantPayment): string {
    if (tenantPayment.is_pay_via_invoice) return "Via Invoice";

    if (tenantPayment.card_payment) return "Credit Card";

    if (tenantPayment.sepa_payment) return "SEPA";

    return "-";
  }

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
          mx: 0,
          rowGap: 2,
          fontSize: 16,
          fontWeight: 500,
          "& .column-align": {
            display: "flex",
            flexDirection: "column",
            gap: 1,
          },
        }}
      >
        <Grid item xs={6} sm={3} md={2} xl={1.5} className="column-align">
          <Typography variant="h6">INVOICE NUMBER</Typography>
          <Typography variant="h4">
            <OrangeryText text={tenantPayment.invoice_number} limit={13} />
          </Typography>
        </Grid>
        <Grid item xs={6} sm={9} md={4.5} xl={2} className="column-align">
          <Typography variant="h6">TITLE</Typography>
          <Typography variant="h4">
            <OrangeryText text={tenantPayment.name} limit={20} />
          </Typography>
        </Grid>
        <Grid
          item
          xs={6}
          sm={3}
          md={0}
          xl={1}
          sx={{
            display: {
              xs: "flex",
              md: "none",
              xl: "flex",
            },
            flexDirection: "column",
            gap: 1,
          }}
        >
          <Typography variant="h6">SERVICE DATES</Typography>
          <Typography variant="h4">
            {tenantPayment.requested_dates &&
              tenantPayment.requested_dates.length > 0 ? (
              tenantPayment.requested_dates.length <= 2 ? (
                tenantPayment.requested_dates
                  ?.map((requested_date) =>
                    new Date(requested_date).toLocaleString("de-DE", {
                      month: "long",
                      year: "numeric",
                      day: "numeric",
                    })
                  )
                  .join(", ")
              ) : (
                <OrangeryTooltip
                  title={tenantPayment.requested_dates
                    ?.map((requested_date) =>
                      new Date(requested_date).toLocaleString("de-DE", {
                        month: "long",
                        year: "numeric",
                        day: "numeric",
                      })
                    )
                    .join(", ")}
                  placement="bottom-start"
                  TransitionComponent={Fade}
                  TransitionProps={{ timeout: 600 }}
                >
                  <Box>
                    {new Date(tenantPayment.requested_dates[0]).toLocaleString(
                      "de-DE",
                      {
                        month: "long",
                        year: "numeric",
                        day: "numeric",
                      }
                    ) + ", ..."}
                  </Box>
                </OrangeryTooltip>
              )
            ) : (
              "-"
            )}
          </Typography>
        </Grid>
        <Grid item xs={6} sm={6} md={2.5} xl={1.25} className="column-align">
          <Typography variant="h6">INVOICE DATE</Typography>
          <Typography variant="h4">
            {new Date(tenantPayment.date).toLocaleString("de-DE", {
              month: "long",
              year: "numeric",
              day: "numeric",
            })}
          </Typography>
        </Grid>
        <Grid
          item
          xs={6}
          sm={3}
          md={1.5}
          xl={1.15}
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: {
              xs: "unset",
              md: "center",
            },
            gap: 1,
            textAlign: {
              xs: "unset",
              md: "center",
            },
          }}
        >
          <Typography variant="h6">DOWNLOAD INVOICE</Typography>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Box>
              {tenantPayment.uuid ? (
                <a
                  onClick={() =>
                    downloadFile(
                      tenantPayment.uuid,
                      `invoice-${tenantPayment.invoice_number}`
                    )
                  }
                >
                  <IconButton
                    sx={{
                      "& .file-contract-icon": {
                        width: "1.3rem",
                        height: "1.3rem",
                      },
                      "&.MuiIconButton-root": { p: 0 },
                    }}
                  >
                    <FileContractIcon className="file-contract-icon" />
                  </IconButton>
                </a>
              ) : (
                "-"
              )}
            </Box>
          </Box>
        </Grid>
        <Grid
          item
          xs={6}
          sm={3}
          md={1.5}
          xl={0.75}
          className="column-align"
          sx={{
            alignItems: {
              xs: "unset",
              md: "end",
              xl: "unset",
            },
          }}
        >
          <Typography variant="h6">َAMOUNT</Typography>
          <Typography variant="h4">
            <OrangeryPrice euro={tenantPayment.total} germanFormat />
          </Typography>
        </Grid>

        <Grid
          item
          xs={0}
          sm={0}
          md={2}
          xl={0}
          sx={{
            display: {
              xs: "none",
              md: "flex",
              xl: "none",
            },
            flexDirection: "column",
            gap: 1,
          }}
        >
          <Typography variant="h6">PAYMENT METHOD</Typography>
          <Typography variant="h4">
            {getPaymentMethod(tenantPayment) || "-"}
          </Typography>
        </Grid>
        <Grid item xs={6} sm={6} md={4.5} xl={1.85} className="column-align">
          <Typography variant="h6">CUSTOMER</Typography>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 0.5,
            }}
          >
            <Typography variant="h4">
              <OrangeryText
                text={tenantPayment?.user?.name || "-"}
                limit={20}
              />
            </Typography>
            <Typography variant="h6">
              <OrangeryText
                text={tenantPayment?.user?.email || "-"}
                limit={25}
              />
            </Typography>
          </Box>
        </Grid>
        <Grid
          item
          xs={6}
          sm={3}
          md={0}
          xl={1}
          sx={{
            display: {
              xs: "flex",
              md: "none",
              xl: "flex",
            },
            flexDirection: "column",
            gap: 1,
          }}
        >
          <Typography variant="h6">PAYMENT METHOD</Typography>
          <Typography variant="h4">
            {getPaymentMethod(tenantPayment) || "-"}
          </Typography>
        </Grid>
        <Grid
          item
          xs={0}
          sm={0}
          md={2.5}
          xl={0}
          sx={{
            display: {
              xs: "none",
              md: "flex",
              xl: "none",
            },
            flexDirection: "column",
            gap: 1,
          }}
        >
          <Typography variant="h6">SERVICE DATES</Typography>
          <Typography variant="h4">
            {tenantPayment.requested_dates &&
              tenantPayment.requested_dates.length > 0 ? (
              tenantPayment.requested_dates.length <= 2 ? (
                tenantPayment.requested_dates
                  ?.map((requested_date) =>
                    new Date(requested_date).toLocaleString("de-DE", {
                      month: "long",
                      year: "numeric",
                      day: "numeric",
                    })
                  )
                  .join(", ")
              ) : (
                <OrangeryTooltip
                  title={tenantPayment.requested_dates
                    ?.map((requested_date) =>
                      new Date(requested_date).toLocaleString("de-DE", {
                        month: "long",
                        year: "numeric",
                        day: "numeric",
                      })
                    )
                    .join(", ")}
                  placement="bottom-start"
                  TransitionComponent={Fade}
                  TransitionProps={{ timeout: 600 }}
                >
                  <Box>
                    {new Date(tenantPayment.requested_dates[0]).toLocaleString(
                      "de-DE",
                      {
                        month: "long",
                        year: "numeric",
                        day: "numeric",
                      }
                    ) + ", ..."}
                  </Box>
                </OrangeryTooltip>
              )
            ) : (
              "-"
            )}
          </Typography>
        </Grid>

        <Box
          sx={{
            flex: 1,
            display: {
              xs: "none",
              lg: "flex",
            },
          }}
        />

        <Grid
          item
          xs={12}
          sm={12}
          md={3}
          xl={1.15}
          sx={{
            display: "flex",
            flexDirection: "row",
            alignItems: "end",
            justifyContent: "end",
          }}
        >
          <OrangeryReadOnlySwitch
            withoutDot
            pending={tenantPayment.pending}
            label={{
              checked: tenantPayment.to_be_charged
                ? "To Be Charged"
                : "Completed",
              unchecked: tenantPayment.refunded ? "Refunded" : "Failed",
              pending: "Pending",
            }}
            checked={
              tenantPayment.to_be_charged ||
              (!tenantPayment.refunded && tenantPayment.charge_success)
            }
          />
          <TenantPaymentMenu tenantPayment={tenantPayment} />
        </Grid>
      </Grid>
    </>
  );
}

export async function downloadFile(uuid: string, fileName: string) {
  const TOKEN_KEY = "__token__";
  const token = localStorage.getItem(TOKEN_KEY);
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/file/${uuid}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  const blob = await response.blob();
  const link = document.createElement("a");
  var binaryData = [];
  binaryData.push(blob);
  const url = window.URL.createObjectURL(
    new Blob(binaryData, { type: "application/pdf" })
  );
  link.href = url;
  link.download = (fileName ?? "document") + ".pdf";

  // Append to html link element page
  document.body.append(link);

  // Start download
  link.click();

  // window.URL.revokeObjectURL(url);
  window.open(url);
}

const Header = observer(
  ({
    button,
    listState,
  }: {
    button?: JSX.Element;
    listState: TenantPaymentsListState;
  }) => {
    const handleFilter = debounce((value: string) => {
      listState.setSearch(value);
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
            sx={{
              flexGrow: 1,
              display: "flex",
              alignItems: "center",
              gap: 1,
              pt: 1,
            }}
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
                sx={{
                  width: "100%",
                  "& .MuiInput-input": {
                    fontSize: "17px !important",
                    fontWeight: "400 !important",
                    color: "#505357 !important",
                  },
                }}
                placeholder="Type here ..."
                startAdornment={
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                }
              />
            </Box>
            <Box sx={{ minWidth: 264, maxWidth: 400 }}>
              <OrangerySortAutocomplete
                sortItems={sortItems}
                name="sortBy"
                placeholder="Sort By..."
                value={listState.sortBy}
                onChange={(newValue: string) => {
                  listState.setSortBy(newValue);
                }}
              />
            </Box>

            <Box
              sx={{
                minWidth: 60,
                maxWidth: 400,
                "& .arrow-icon": { width: "1.2rem", height: "1.2rem" },
              }}
            >
              <Button
                onClick={() => listState.setDesc(listState.asce)}
                sx={{ backgroundColor: "#F9F9FA", p: 2, borderRadius: "5px" }}
              >
                {listState.asce ? (
                  <ArrowUpZAIcon className="arrow-icon" />
                ) : (
                  <ArrowDownAZIcon className="arrow-icon" />
                )}
              </Button>
            </Box>
            <OrangeryFilter
              // multiSelect
              width={300}
              selectedValues={listState.filterBy}
              options={[
                "All Statuses",
                "Completed",
                "To Be Charged",
                "Refunded",
                "Pending",
                "Failed",
              ]}
              onChange={(newValues) => {
                newValues.forEach((e: any) => {
                  const i = listState.filterBy.findIndex((v) => v === e);
                  if (i === -1) {
                    listState.pushToFilterList(e);
                  }
                });
                [...listState.filterBy].forEach((v) => {
                  const i = newValues.findIndex((e: any) => v === e);
                  if (i === -1) {
                    const j = listState.filterBy.findIndex((t) => t === v);
                    listState.deleteFromFilterList(j);
                  }
                });
              }}
            />
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
