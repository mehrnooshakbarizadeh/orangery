import { Box, IconButton, Tooltip } from "@mui/material";
import React from "react";
import CopyToClipboard from "react-copy-to-clipboard";
import { IOffer } from "../../../../queries/tenant";
import CopyIcon from "../../../../assets/svg/copy.svg";
import { useGlobalState } from "../../../../Contexts & Globals/GlobalContext";
import { OrangeryButton } from "../../../OrangeryElements";

export default function CopyLinkButton({
  text,
  variant = "iconButton"
}: {
  text: string;
  variant?: string;
}) {
  const [copied, setCopied] = React.useState(false);
  const [open, setOpen] = React.useState(false);

  const handleCopied = () => {
    setCopied(true);
    setTimeout(() => { setCopied(false) }, 2000)
  };

  const handleTooltipClose = () => {
    setOpen(false);
  };

  const handleTooltipOpen = () => {
    setOpen(true);
  };
  return (
    <>
      <Box>
        <Box sx={{ flexGrow: 1 }} />
        <CopyToClipboard text={text} onCopy={handleCopied}>
          {/* <ClickAwayListener onClickAway={handleTooltipClose}> */}
          <div>
            <Tooltip
              sx={{
                "& .MuiTooltip-popperInteractive": {
                  inset: "-7px auto auto 48px",
                },
              }}
              PopperProps={{
                disablePortal: true,
              }}
              onClose={handleTooltipClose}
              open={open}
              disableFocusListener
              disableHoverListener
              disableTouchListener
              title="Copied"
            >
              <span>
                {variant === "iconButton"
                  ? <IconButton
                    onClick={handleTooltipOpen}
                    sx={{
                      "& .icon": {
                        width: "1.3rem",
                        height: "1.3rem",
                        color: "primary.main",
                      },
                    }}
                  >
                    <CopyIcon className="icon" />
                  </IconButton>
                  : <OrangeryButton
                    variant="outlined"
                    onClick={handleTooltipOpen}
                    caption={<Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                        "& .icon": {
                          width: "1.3rem",
                          height: "1.3rem",
                          color: "primary.main",
                        },
                      }}
                    >
                      <CopyIcon className="icon" />
                      Copy Link
                    </Box>}
                  />
                }
              </span>
            </Tooltip>
          </div>
          {/* </ClickAwayListener> */}
        </CopyToClipboard>
      </Box>
    </>
  );
}
