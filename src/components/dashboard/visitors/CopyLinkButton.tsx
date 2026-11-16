import { Button, Typography } from "@mui/material";
import { Observer } from "mobx-react-lite";
import React, { useEffect } from "react";
import CopyToClipboard from "react-copy-to-clipboard";
import CopyIcon from "../../../assets/svg/copy.svg";
import { useGlobalState } from "../../../Contexts & Globals/GlobalContext";

export default function CopyLinkButton({
  host_uuid,
  office_uuid,
}: {
  host_uuid: string;
  office_uuid: string;
}) {
  const globalState = useGlobalState();
  const [copied, setCopied] = React.useState(false);
  const [color, setcolor] = React.useState(false);
  useEffect(() => {
    const timer = setTimeout(() => {
      setcolor(false);
    }, 3000);
    return () => clearTimeout(timer);
  }, [copied, color]);

  const handleClick = () => {
    setcolor(true);
  };

  return (
    <>
      <Observer>
        {() => (
          <CopyToClipboard
            text={`${process.env.NEXT_PUBLIC_HOME_URL}/_p/register/visitor/?office_uuid=${office_uuid}&host_uuid=${host_uuid}&o=${globalState.currentOffice.name}&u=${globalState.currentUser.name}`}
            onCopy={() => setCopied(true)}
          >
            <Button
              variant="outlined"
              onClick={handleClick}
              sx={{
                "&:hover": {
                  backgroundColor: color ? "#42B863" : "#fff",
                  border: color ? "1px solid #fff" : "1px solid #000",
                  transition: "0.6s",
                  transitionTimingFunction: "ease-in-out",
                },
                pt: "9px",
                pb: "13px",
                px: 2,
                backgroundColor: color ? "#42B863" : "white",
                color: color ? "#fff" : "black",
                border: color ? "1px solid #fff" : "1px solid #000",
                transition: "0.6s",
                transitionTimingFunction: "ease-in-out",
                "& .copy-icon": {
                  width: "1.5rem",
                  height: "1.5rem",
                  // color: "primary.main",
                  color: color ? "#fff" : "black",
                  transition: "0.6s",
                  transitionTimingFunction: "ease-in-out",
                  mr: 1.2,
                },
              }}
            >
              <CopyIcon className="copy-icon" />
              <Typography
                fontSize={24}
                fontWeight={400}
                sx={{ lineHeight: "31.39px" }}
              >
                Copy Registration Link
              </Typography>
            </Button>
          </CopyToClipboard>
        )}
      </Observer>
    </>
  );
}
