// react & next
import React from "react"

// external dependencies
import { Box, Tab, Tabs, Fade, Button, Typography } from "@mui/material";

export interface ITab {
  slug?: string;
  label: string
  content: JSX.Element
  button?: JSX.Element
}

export default function OrangeryTabs({
  tabs,
  height,
  selectedTabIndex: inputSelectedTabIndex,
  handleChange: inputHandleChange,
  sx
}: {
  tabs: ITab[],
  height?: string
  selectedTabIndex?: number
  handleChange?: (event: React.SyntheticEvent, tabIndex: number) => void
  sx?: any;
}) {
  const [selectedTabIndex, setSelectedTabIndex] = React.useState(inputSelectedTabIndex ?? 0);

  React.useEffect(() => {
    setSelectedTabIndex(inputSelectedTabIndex ?? 0)
  }, [inputSelectedTabIndex])

  const handleChange = (event: React.SyntheticEvent, tabIndex: number) => {
    if (selectedTabIndex !== undefined) {
      if (inputHandleChange)
        inputHandleChange(event, tabIndex)
      else
        setSelectedTabIndex(tabIndex);
    }
  };

  return (
    <Box
      sx={{
        height: "100%",
        position: "relative",
      }}
    >
      <Tabs
        value={selectedTabIndex}
        onChange={handleChange}
        variant="scrollable"
        scrollButtons="auto"
        sx={{
          zIndex: 1,
          border: "0 solid #D7DBE1",
          borderBottomWidth: "2px",
          "& .MuiTabs-scrollButtons.Mui-disabled": {
            opacity: 0.3
          },
          // "& > * + *": {
          //   ml: 2
          // }
        }}
      >
        {tabs.map((tab: any, index: number) =>
          <Tab
            key={tab.slug || tab.label}
            label={tab.label}
            sx={{
              color: "#5F7089",
              // color: "#2B2E33",
              textTransform: "none",
              px: 0,
              mr: 4,
              fontSize: 20,
              fontWeight: 600,
              // border: "0 solid #D7DBE1",
              // borderBottomWidth: "2px",
            }}
          />
        )}
      </Tabs>

      <Box
        sx={{
          zIndex: 2,
          py: 3,
          height: height ?? "calc(100% - 24px - 4px - 1px)",
          ...sx
        }}
      >
        {tabs.map((tab: any, index: number) => (
          selectedTabIndex === index &&
          <Fade
            key={tab.slug || tab.label}
            in={selectedTabIndex === index}
            {...(selectedTabIndex === index ? { timeout: 1000 } : {})}
          >
            <Box
              sx={{
                height: "100%",
              }}
            >
              {tab.button}

              <Box
                sx={{
                  height: "100%",
                  overflowY: "auto",
                  pr: 1,
                  "&::-webkit-scrollbar": {
                    width: "0.4em",
                    height: "0.4em",
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
                {tab?.content}
              </Box>
            </Box>
          </Fade>
        ))}
      </Box>
    </Box>
  );
}