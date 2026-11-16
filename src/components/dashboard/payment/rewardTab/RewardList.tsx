import PlaceholderSvg from "../../../../assets/svg/placeholders/visitors.svg";
import Fuse from "fuse.js";
import React from "react";
import { Box } from "@mui/material";
import { makeAutoObservable } from "mobx";
import { Observer } from "mobx-react-lite";
import { IReward, useRewards } from "../../../../queries/reward";
import { useGlobalState } from "../../../../Contexts & Globals/GlobalContext";
import {
  OrangeryNavigationContentLoader,
  OrangeryNavigationPlaceholder,
} from "../../../OrangeryElements";
import { RewardRows } from "./RewardRows";
import { Header } from "./Header";
import OrangeryNoSearchResultPlaceholder from "../../../OrangeryElements/OrangeryNoSearchResultPlaceholder";

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
  keys: ["user.name", "booking.product.name", "invoice_number", "points"],
};

export class RewardSortState {
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
  rewards: IReward[],
  search: string,
  sortBy: string,
  asce: boolean
) {
  let sortedSearchedRewardList = [...rewards];
  if (search) {
    const fuse = new Fuse(sortedSearchedRewardList, options);
    sortedSearchedRewardList = fuse.search(search).map((r) => r.item);
  }
  sortedSearchedRewardList = sortRewards(
    sortedSearchedRewardList,
    sortBy,
    asce
  );
  return sortedSearchedRewardList;
}

function sortRewards(rewards: IReward[], sortBy: string, asce: boolean) {
  if (sortBy) {
    switch (sortBy) {
      case "Name":
        return sortByName(rewards, asce);
      case "Invoice Date":
        return sortByInvoiceDate(rewards, asce);
      case "Amount of Reward":
        return sortByPoints(rewards, asce);
    }
  }
  return rewards;
}

function sortByName(rewards: IReward[], asce: boolean) {
  if (asce) {
    return rewards?.sort((a, b) =>
      a?.user.name.toLocaleUpperCase() < b?.user.name.toLocaleUpperCase()
        ? 1
        : -1
    );
  } else {
    return rewards?.sort((a, b) =>
      a.user.name.toLocaleUpperCase() > b.user.name.toLocaleUpperCase() ? 1 : -1
    );
  }
}
function sortByInvoiceDate(rewards: IReward[], asce: boolean) {
  if (!asce) {
    return rewards.sort((a, b) =>
      new Date(a.created_at) > new Date(b.created_at) ? 1 : -1
    );
  } else {
    return rewards.sort((a, b) =>
      new Date(a.created_at) < new Date(b.created_at) ? 1 : -1
    );
  }
}
function sortByPoints(rewards: IReward[], asce: boolean) {
  if (asce) {
    return rewards?.sort((a, b) => (a?.points < b?.points ? 1 : -1));
  } else {
    return rewards?.sort((a, b) => (a.points > b.points ? 1 : -1));
  }
}

export default function RewardList() {
  const globalState = useGlobalState();
  const state = React.useMemo(() => new RewardSortState(), []);
  const { data: rewards, isLoading } = useRewards(globalState.office_uuid);

  return (
    <>
      <Observer>
        {() => (
          <>
            {isLoading ? (
              <OrangeryNavigationContentLoader />
            ) : rewards && rewards.length > 0 ? (
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
                <Header state={state} />
                <Observer>
                  {() => {
                    const sortedSearchedList = getSortedSearchedList(
                      rewards,
                      state.search,
                      state.sortBy,
                      state.asce
                    );
                    return sortedSearchedList &&
                      sortedSearchedList.length > 0 ? (
                      <RewardRows rewards={sortedSearchedList} state={state} />
                    ) : (
                      <OrangeryNoSearchResultPlaceholder />
                    );
                  }}
                </Observer>
              </Box>
            ) : (
              <OrangeryNavigationPlaceholder
                title={"Deliver an exceptional visitor experience"}
                subtitle={
                  "Provide job candidates, clients, and other office guests with a seamless experience from start to finish."
                }
                PlaceholderSvg={PlaceholderSvg}
                addNewButtonText={""}
              />
            )}
          </>
        )}
      </Observer>
    </>
  );
}
