// contexts & globals
import { useGlobalState } from "../../../../Contexts & Globals/GlobalContext";
import { useEffect, useState } from "react";
// react & next
import React from "react";
import NextLink from "next/link";
import Search from "@mui/icons-material/Search";
import ArrowDownAZIcon from "../../../../assets/svg/arrowDownAZ.svg";
import ArrowUpZAIcon from "../../../../assets/svg/arrowUpZA.svg";
import Fuse from "fuse.js";

// external dependencies
import {
  Box,
  Button,
  debounce,
  Dialog,
  DialogContent,
  Fade,
  Grid,
  IconButton,
  Input,
  InputAdornment,
  Tooltip,
  Typography,
} from "@mui/material";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { Link as MUILink } from "@mui/material";
import { observer, Observer } from "mobx-react-lite";

// orangery elements & internal dependencies
import AddNewOfferButton from "./AddNewOfferButton";
import EditOfferButton from "./EditOfferButton";
import RequestListButton from "./RequestListButton";
import {
  OrangeryNavigationContentLoader,
  OrangeryNavigationPlaceholder,
  OrangeryPrice,
  OrangeryTooltip,
  OrangeryStatusCircle,
  OrangeryText,
  OrangeryMultiDatepicker,
  OrangeryToast,
} from "../../../OrangeryElements";
// queries & backend
import { IOffer, useOffers, useUpsertOffer } from "../../../../queries/tenant";

// icons, images & colors
import FileLockIcon from "../../../../assets/svg/file-lock.svg";
import FileContractIcon from "../../../../assets/svg/file-contract.svg";
import PlaceholderSvg from "../../../../assets/svg/placeholders/offer-list.svg";
import { useRouter } from "next/router";
import { makeAutoObservable } from "mobx";
import SortOffersAutocomplete from "./SortOffersAutocomplete";
import FilterOffer from "./FilterOffer";
import CopyLinkButton from "./CopyLinkButton";
import OrangeryNoSearchResultPlaceholder from "../../../OrangeryElements/OrangeryNoSearchResultPlaceholder";
import { OfferFieldsState } from "./HandleOfferForm";
import { ArrayValueState } from "../../../../states/mobx-form";
import moment from "moment";
import EyeNewIcon from "../../../../assets/svg/eye-new.svg";
import OverviewContent from "./preview/OverviewContent";

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
  keys: ["name", "description", "sale_price", "price", "payment_method"],
};

export class OfferSortState {
  public sortBy = "";
  public asce: boolean = true;
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

function getSortedSearchedList(
  offers: IOffer[],
  filterBy: string[],
  search: string,
  sortBy: string,
  asce: boolean
) {
  let OfferList = [...offers];
  if (search) {
    const fuse = new Fuse(OfferList, options);
    OfferList = fuse.search(search).map((r) => r.item);
  }
  if (filterBy) {
    OfferList = OfferFilter(OfferList, filterBy);
  }
  OfferList = OffersSort(OfferList, sortBy, asce);
  return OfferList;
}

function OfferFilter(offers: IOffer[], filterBy: string[]) {
  let filterList = [...offers];
  filterBy.forEach((v, j) => {
    if (v === "Digital Contract") {
      filterList = filterByDigitalContract(filterList);
    } else if (v === "On Marketplace") {
      filterList = filterByMarketPlace(filterList);
    } else if (v === "Active on landing page") {
      filterList = filterByPublish(filterList);
    }
  });
  return filterList;
}

function filterByPublish(offers: IOffer[]) {
  return offers.filter((offer) => offer.published);
}

function filterByMarketPlace(offers: IOffer[]) {
  return offers.filter((offer) => offer.marketplace);
}

function filterByDigitalContract(offers: IOffer[]) {
  return offers.filter((offer) => offer.documents.length > 0);
}

function OffersSort(offers: IOffer[], sortBy: string, asce: boolean) {
  if (sortBy) {
    switch (sortBy) {
      case "Name":
        return sortByName(offers, asce);
      case "Price":
        return sortByPrice(offers, asce);
      case "Sale Price":
        return sortBySalePrice(offers, asce);
      case "Contract Start Date":
        return sortByContractStartDate(offers, asce);
      case "Number of Request":
        return sortByNumberOfRequest(offers, asce);
      case "Created Date":
        return sortByCreatedDate(offers, asce);
    }
  }
  return offers;
}

function sortByName(offer: IOffer[], asce: boolean) {
  if (!asce) {
    return offer.sort((a, b) =>
      a?.name.toLocaleUpperCase() > b.name.toLocaleUpperCase() ? 1 : -1
    );
  } else {
    return offer.sort((a, b) =>
      a.name.toLocaleUpperCase() < b.name.toLocaleUpperCase() ? 1 : -1
    );
  }
}
function sortByPrice(offer: IOffer[], asce: boolean) {
  if (asce) {
    return offer?.sort((a, b) => (a?.price < b?.price ? 1 : -1));
  } else {
    return offer?.sort((a, b) => (a.price > b.price ? 1 : -1));
  }
}
function sortBySalePrice(offer: IOffer[], asce: boolean) {
  if (asce) {
    return offer?.sort((a, b) => (a?.sale_price < b?.sale_price ? 1 : -1));
  } else {
    return offer?.sort((a, b) => (a.sale_price > b.sale_price ? 1 : -1));
  }
}
function sortByNumberOfRequest(offer: IOffer[], asce: boolean) {
  if (asce) {
    return offer?.sort((a, b) =>
      a?.number_of_requests < b?.number_of_requests ? 1 : -1
    );
  } else {
    return offer?.sort((a, b) =>
      a.number_of_requests > b.number_of_requests ? 1 : -1
    );
  }
}
function sortByContractStartDate(offer: IOffer[], asce: boolean) {
  if (!asce) {
    return offer.sort((a, b) =>
      new Date(a.contract_start_date) > new Date(b.contract_start_date) ? 1 : -1
    );
  } else {
    return offer.sort((a, b) =>
      new Date(a.contract_start_date) < new Date(b.contract_start_date) ? 1 : -1
    );
  }
}

function sortByCreatedDate(offer: IOffer[], asce: boolean) {
  if (!asce) {
    return offer.sort((a, b) =>
      new Date(a.created_at) < new Date(b.created_at) ? 1 : -1
    );
  } else {
    return offer.sort((a, b) =>
      new Date(a.created_at) > new Date(b.created_at) ? 1 : -1
    );
  }
}

export default function OffersList() {
  const globalState = useGlobalState();
  const {
    data: offers,
    isLoading,
    isError,
  } = useOffers(globalState.office_uuid);
  const state = React.useMemo(() => new OfferSortState(), []);

  useEffect(() => {
    if (offers)
      if (offers.length > 0)
        globalState.setShowOffersList(true)
      else
        globalState.setShowOffersList(false)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [offers, globalState.currentOffice])

  return (
    <>
      {isLoading ? (
        <OrangeryNavigationContentLoader />
      ) : globalState.showOffersList && offers && offers.length > 0 ? (
        <Box
          sx={{
            backgroundColor: "#fff",
            display: "flex",
            flexDirection: "column",
            height: "100%",
            // minHeight: 666,
            borderRadius: 1.5,
            // pb: 3,
          }}
        >
          <Header button={<AddNewOfferButton />} state={state} />

          <Box
            sx={{
              height: `calc(100% - 12px)`,
              overflowY: "auto",
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
                const sortedSearchedList = getSortedSearchedList(
                  offers,
                  state.filterBy,
                  state.search,
                  state.sortBy,
                  state.asce
                );
                return sortedSearchedList && sortedSearchedList.length > 0 ? (
                  <OfferRows offers={sortedSearchedList} state={state} />
                ) : (
                  <OrangeryNoSearchResultPlaceholder />
                );
              }}
            </Observer>
          </Box>
        </Box>
      ) : (
        <OrangeryNavigationPlaceholder
          title={"No Offer!"}
          subtitle={"Please make an offer to rent your assets."}
          PlaceholderSvg={PlaceholderSvg}
          AddNewButton={<AddNewOfferButton showOffersList={false} />}
          addNewButtonText={""}
        />
      )}
    </>
  );
}

const OfferRows = ({
  state,
  offers,
}: {
  state: OfferSortState;
  offers: IOffer[];
}) => {
  const router = useRouter();

  const selectedOfferUuid = router.query.offer;

  return (
    <>
      {offers.map((offer) => (
        <OfferRow
          key={offer.uuid}
          offer={offer}
          highlighted={offer.uuid === selectedOfferUuid}
        />
      ))}
    </>
  );
};

function OfferRow({
  offer,
  highlighted,
}: {
  offer: IOffer;
  highlighted?: boolean;
}) {
  const { office_uuid } = useGlobalState();
  const state = React.useMemo(
    () => new OfferFieldsState(office_uuid, offer, false),
    [office_uuid, offer]
  );

  const handleDisableTooltip = () => {
    if (!offer.description) {
      return true;
    } else return false;
  };
  const [overviewOpen, setOverviewOpen] = useState(false);
  const handleOverviewOpen = () => {
    setOverviewOpen(true);
  };
  const handleOverviewClose = () => {
    setOverviewOpen(false);
  };

  const mutation = useUpsertOffer();
  async function handleChangeBlockDays() {
    if (!state.validatePaymentDetails()) {
      return;
    }
    try {
      const result = await mutation.mutateAsync(state.data);
      state.setResult(result);
      if (offer)
        OrangeryToast("Block days Successfully changed", "success");
    } catch (err: any) {
      state.setupErrors(err);
    }
  }

  return (
    <>
      <Grid
        // id={offer.uuid}
        container
        sx={{
          display: "flex",
          justifyContent: "space-between",
          pb: !offer.contract_end_date ? 2 : 0,
          pt: 5,
          px: 2.4,
          backgroundColor: highlighted ? "#eeecec" : undefined,
          boxShadow: "1px 1px 8px #0000000a",
          border: "1px solid rgb(210 215 221)",
          alignItems: "flex-start",
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
        <Grid xs={3} sm={3} md={2} item className="column-align">
          <Typography variant="h6" color="#A5AAB4">
            OFFER NAME
          </Typography>
          <Typography variant="h4">
            <OrangeryText text={offer.name} limit={20} />
          </Typography>
        </Grid>
        <Grid item xs={3} sm={3} md={1} className="column-align">
          <Typography variant="h6" color="#A5AAB4">
            PRICE
          </Typography>
          {offer.price ? (
            <Typography variant="h4">
              {<OrangeryPrice euro={offer.price} germanFormat />}
              {offer.payment_method === "subscription" ? "/m" : ""}
            </Typography>
          ) : (
            <Typography variant="h4">-</Typography>
          )}
        </Grid>

        <Grid item xs={3} sm={3} md={1} className="column-align">
          <Typography variant="h6" color="#A5AAB4">
            SALES PRICE
          </Typography>
          {offer.sale_price ? (
            <Typography variant="h4">
              {<OrangeryPrice euro={offer.sale_price} germanFormat />}
              {offer.payment_method === "subscription" ? "/m" : ""}
            </Typography>
          ) : (
            <Typography variant="h4">-</Typography>
          )}
        </Grid>
        <Grid
          item
          xs={3}
          sm={3}
          md={1}
          sx={{ display: "flex", flexDirection: "column", gap: 1 }}
        >
          <Typography variant="h6" color="#A5AAB4">
            DEPOSIT
          </Typography>
          <Typography variant="h4">
            {offer.deposit ? (
              <OrangeryPrice euro={offer.deposit} germanFormat />
            ) : offer.payment_method === "one_time_payment" ? (
              "-"
            ) : (
              "0"
            )}
          </Typography>
        </Grid>
        <Grid
          item
          xs={3}
          sm={2.5}
          md={1.5}
          sx={{ display: "flex", flexDirection: "column", gap: 1 }}
        >
          <Typography variant="h6" color="#A5AAB4">
            CONTRACT DATE
          </Typography>

          <Typography variant="h4">
            {offer.contract_start_date
              ? new Date(offer.contract_start_date).toLocaleString("de-DE", {
                month: "long",
                year: "numeric",
                day: "numeric",
              })
              : "-"}
          </Typography>
          <Typography variant="h4">
            {offer.contract_end_date
              ? new Date(offer.contract_end_date).toLocaleString("de-DE", {
                month: "long",
                year: "numeric",
                day: "numeric",
              })
              : "-"}
          </Typography>
        </Grid>
        <Grid
          item
          xs={3}
          sm={3}
          md={1}
          sx={{ display: "flex", flexDirection: "column", gap: 1 }}
        >
          <Typography variant="h6" color="#A5AAB4">
            DESCRIPTION
          </Typography>
          <Box
            sx={{
              "& .memo-icon": { width: "1.3rem", height: "1.3rem" },
              "& .memo-disable-icon": {
                height: "1.3rem",
                width: "1.3rem",
                color: "#b7b2b2",
              },
            }}
          >
            {offer.description ? (
              <OrangeryTooltip
                title={offer.description}
                placement="bottom-start"
                TransitionComponent={Fade}
                TransitionProps={{ timeout: 600 }}
              >
                <Box>
                  <IconButton sx={{ "&.MuiIconButton-root": { p: 0 } }}>
                    <FileLockIcon className="memo-icon" />
                  </IconButton>
                </Box>
              </OrangeryTooltip>
            ) : (
              <OrangeryTooltip
                title="No Description"
                placement="bottom-start"
                TransitionComponent={Fade}
                TransitionProps={{ timeout: 200 }}
                disableInteractive
              >
                <IconButton
                  sx={{
                    cursor: "default",
                    "&.MuiIconButton-root": { p: 0 },
                  }}
                >
                  <FileLockIcon className="memo-disable-icon" />
                </IconButton>
              </OrangeryTooltip>
            )}
          </Box>
        </Grid>
        <Grid
          item
          xs={3}
          sm={3}
          md={1}
          sx={{ display: "flex", flexDirection: "column", gap: 1 }}
        >
          <Typography variant="h6" color="#A5AAB4">
            DIGITAL CONTRACT
          </Typography>
          {offer.documents.length > 0 ? (
            <Box sx={{ display: "flex", alignItems: "center" }}>
              {offer.documents.map((d) => (
                <DownloadContract key={d.uuid} uuid={d.uuid} />
              ))}
            </Box>
          ) : (
            <Typography variant="h4">-</Typography>
          )}
        </Grid>
        <Grid item xs={3} sm={3} md={1} className="column-align">
          <Typography variant="h6" color="#A5AAB4">
            PAYMENT METHOD
          </Typography>
          {offer.payment_method === "subscription" ? (
            <Typography variant="h4">Subscription</Typography>
          ) : (
            <Typography variant="h4">One Time Payment</Typography>
          )}
        </Grid>
        <Grid
          item
          xs={3}
          sm={2.5}
          md={2}
          sx={{
            display: "flex",
            justifyContent: "end",
            gap: .5,
            alignItems: "center",
            flexWrap: "wrap",
            my: "auto",
            pb: 3
          }}
        >
          <IconButton
            onClick={() => handleOverviewOpen()}
            sx={{
              "& .icon": {
                color: "#000",
                width: "1.3rem",
                height: "1.3rem",
              },
              mr: 0.5
            }}
          >
            {/* <ListCheckedIcon className="icon" /> */}
            <EyeNewIcon className="icon" />
          </IconButton>

          {offer.payment_method === "subscription"
            ? <></>
            : <Box
              sx={{
                ml: -1
              }}
            >
              <Observer>
                {() => (
                  <OrangeryMultiDatepicker
                    small={true}
                    readOnly={false}
                    disabledDates={[]}
                    disablePast

                    withoutNote

                    // error={!!state.block_days.error}
                    // errorMessage={"You can block an offer for a specific time period."}

                    preventRemoveLast={false}

                    selectedDates={offer.block_days?.map((blockDay) => new Date(blockDay) ?? [])}
                    onSubmit={(newValues: Date[]) => {
                      if (JSON.stringify(offer.block_days) !== JSON.stringify(newValues.map((v) => moment(v).format("YYYY-MM-DD")))) {
                        if (newValues.length === 0)
                          state.block_days = new ArrayValueState([]);
                        else {
                          newValues.forEach((e) => {
                            const i = state.block_days.values?.findIndex(
                              (v) => v.value === moment(e).format("YYYY-MM-DD")
                            );
                            if (i === -1) {
                              state.block_days.pushElementValue(moment(e).format("YYYY-MM-DD"));
                            }
                          });

                          state.block_days.values?.forEach((v, j) => {
                            const i = newValues.findIndex((e) => v.value === moment(e).format("YYYY-MM-DD"));
                            if (i === -1) {
                              state.block_days.deleteElementValue(j);
                            }
                          });
                        }

                        handleChangeBlockDays();
                      }
                    }}
                    onCancel={() => { }}
                    onRemoveAll={() => {
                      let newValues = [moment(new Date()).format("YYYY-MM-DD")]
                      state.block_days = new ArrayValueState(newValues);
                    }}
                    selectedDatesTitle={"Block days"}
                    submitButtonText={"Done"}
                    cancelButtonText={"Cancel"}
                  />
                )}
              </Observer>
            </Box>
          }

          <Box sx={{ mr: -1 }}>
            <OrangeryStatusCircle
              status={offer.status}
              labels={{
                active: "Active",
                deactive: "Deactive",
              }}
            />
          </Box>

          <Observer>{() => <RequestListButton offer={offer} />}</Observer>

          <CopyLinkButton text={`${process.env.NEXT_PUBLIC_CHECKOUT_URL}/offer/?id=${offer?.uuid}`} />

          <EditOfferButton offer={offer} />
        </Grid>
      </Grid>
      {offer && (
        <Dialog
          open={overviewOpen}
          onClose={handleOverviewClose}
          sx={{
            "& .MuiPaper-root": { maxWidth: 1100, width: 1051, height: 752 },
          }}
        >
          <DialogContent sx={{ "&.MuiDialogContent-root": { p: 0 } }}>
            {overviewOpen && (
              <OverviewContent
                overview={offer}
                noQuantity={true}
                handleDone={handleOverviewClose}
              // noLinkInOverview={false}
              />
            )}
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}

function DownloadContract({ uuid }: { uuid?: string }) {
  const globalState = useGlobalState();
  return (
    <>
      <NextLink
        href={`${process.env.NEXT_PUBLIC_CDN_URL}/${uuid}.pdf`}
        passHref
      >
        {uuid && (
          <MUILink
            href={`${process.env.NEXT_PUBLIC_CDN_URL}/${uuid}.pdf`}
            download
            target="_blank"
            rel="noreferrer"
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
          </MUILink>
        )}
      </NextLink>
      {/* <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
        {uuid && (
          <a href={`${document}.pdf`} download>
            <IconButton
              sx={{
                "& .file-contract-icon": { width: "1.3rem", height: "1.3rem" },
                "&.MuiIconButton-root": { p: 0 },
              }}
            >
              <FileContractIcon className="file-contract-icon" />
            </IconButton>
          </a>
        )}
      </Box> */}
    </>
  );
}

const Header = observer(
  ({ button, state }: { button?: JSX.Element; state: OfferSortState }) => {
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
                    <Search />
                  </InputAdornment>
                }
              />
            </Box>
            <Box sx={{ minWidth: 264, maxWidth: 400 }}>
              <SortOffersAutocomplete
                name="sortBy"
                placeholder="Sort By..."
                value={state.sortBy}
                onChange={(newValue: string) => {
                  state.setSortBy(newValue);
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
            <FilterOffer state={state} />
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
