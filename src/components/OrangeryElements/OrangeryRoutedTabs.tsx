// react & next
import React, { useContext } from "react";
import { useRouter } from "next/router";

// external dependencies
import { Box, Tab, Tabs, Fade } from "@mui/material";

//
import OrangeryTabs from "./OrangeryTabs";

export interface ITab {
  slug: string;
  label: string;
  content: JSX.Element;
  button?: JSX.Element;
}

const RoutedTabContext = React.createContext<{
  setSelectedTab?: (tabSlug: string, query: any) => void;
}>({});

export const useRoutedTabStore = () => {
  const store = useContext(RoutedTabContext);
  if (!store) {
    console.warn("No RoutedTabContext");
  }
  return store;
};

function findTabIndex(tabSlug: string | string[] | undefined, tabs: ITab[]) {
  if (!tabSlug)
    return 0;

  const slug = Array.isArray(tabSlug) ? tabSlug[0] : tabSlug;

  const tabIndex = tabs.findIndex((t) => t.slug === slug);
  if (tabIndex === -1)
    return 0;

  return tabIndex;
}

export default function OrangeryRoutedTabs({
  tabs,
  height,
}: {
  tabs: ITab[];
  height?: string;
}) {
  const router = useRouter();

  const selectedTabIndex = findTabIndex(router.query.tab, tabs);

  const setSelectedTabIndex = (tabIndex: number, query: any) => {
    const tab = tabs[tabIndex];
    const slug = tab.slug;
    router.push({
      query: {
        tab: slug,
        ...query,
      },
    });
  };

  const setSelectedTab = (tabSlug: string, query: any) => {
    const tabIndex = tabs.findIndex((t) => t.slug === tabSlug);
    if (tabIndex === -1)
      return;

    setSelectedTabIndex(tabIndex, query);
  };

  const handleChange = (event: React.SyntheticEvent, tabIndex: number) => {
    setSelectedTabIndex(tabIndex, undefined);
  };

  return (
    <RoutedTabContext.Provider
      value={{
        setSelectedTab,
      }}
    >
      <OrangeryTabs
        tabs={tabs}
        selectedTabIndex={selectedTabIndex}
        handleChange={handleChange}
        height={height}
      />
    </RoutedTabContext.Provider>
  );
}
