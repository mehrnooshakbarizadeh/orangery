import { Box, Button, MenuProps, Select, Typography } from "@mui/material";
import { Observer } from "mobx-react-lite";
import React, { useEffect } from "react";
import CopyToClipboard from "react-copy-to-clipboard";
import CustomerIcon from "../../../assets/svg/customer-icon.svg";
import AttendeeIcon from "../../../assets/svg/attendee-icon.svg";
import { styled, alpha } from "@mui/material/styles";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";

const StyledMenu = styled((props: MenuProps) => (
  <Menu
    elevation={0}
    anchorOrigin={{
      vertical: "bottom",
      horizontal: "right",
    }}
    transformOrigin={{
      vertical: "top",
      horizontal: "right",
    }}
    {...props}
  />
))(({ theme }) => ({
  "& .MuiPaper-root": {
    borderRadius: 6,
    marginTop: theme.spacing(1),
    minWidth: 180,
    color:
      theme.palette.mode === "light"
        ? "rgb(55, 65, 81)"
        : theme.palette.grey[300],
    boxShadow:
      "rgb(255, 255, 255) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px",
    "& .MuiMenu-list": {
      padding: "4px 0",
    },
    "& .MuiMenuItem-root": {
      "& .MuiSvgIcon-root": {
        fontSize: 18,
        color: theme.palette.text.secondary,
        marginRight: theme.spacing(1.5),
      },
      "&:active": {
        backgroundColor: alpha(
          theme.palette.primary.main,
          theme.palette.action.selectedOpacity
        ),
      },
    },
  },
}));

export default function CopyLinkButton({
  text1,
  text2,
}: {
  text1: string;
  text2?: string;
}) {
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

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClickOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <Observer>
        {() => (
          <>
            <Button
              aria-haspopup="true"
              aria-expanded={open ? "true" : undefined}
              variant="outlined"
              onClick={handleClickOpen}
              disableElevation
              sx={{
                "&:hover": {
                  backgroundColor: color ? "#42B863" : "#000",
                  border: color ? "1px solid #fff" : "1px solid #000",
                  transition: "0.6s",
                  transitionTimingFunction: "ease-in-out",
                },
                px: 1,
                width: "100px",
                backgroundColor: color ? "#42B863" : "#000",
                color: "#fff",
                border: color ? "1px solid #fff" : "1px solid #000",
                transition: "0.6s",
                transitionTimingFunction: "ease-in-out",
                borderRadius: "5px",
                "& .copy-icon": {
                  width: "1rem",
                  height: "1rem",
                  // color: "primary.main",
                  color: "#fff",
                  transition: "0.6s",
                  transitionTimingFunction: "ease-in-out",
                  mr: "0.5rem",
                },
              }}
            >
              {/* <CopyIcon className="copy-icon" /> */}
              <Typography fontSize={14} fontWeight={600} whiteSpace="nowrap">
                {color ? "Copied!" : "Copy Link"}
              </Typography>
            </Button>
            <StyledMenu
              id="demo-customized-menu"
              MenuListProps={{
                "aria-labelledby": "demo-customized-button",
              }}
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
              sx={{
                "& .icon": {
                  width: "1.3rem",
                  height: "1.3rem",
                },
                "& .font": {
                  fontSize: "14px",
                  fontWeight: 600,
                  color: "#2B2E33",
                },
              }}
            >
              <CopyToClipboard text={text2!} onCopy={() => setCopied(true)}>
                <MenuItem
                  onClick={handleClose}
                  disableRipple
                  sx={{ display: "flex", alignItems: "center", gap: 1, p: 1.5 }}
                >
                  <CustomerIcon className="icon" />
                  <Typography className="font">Customer link</Typography>
                </MenuItem>
              </CopyToClipboard>
              <CopyToClipboard text={text1} onCopy={() => setCopied(true)}>
                <MenuItem
                  onClick={handleClose}
                  disableRipple
                  sx={{ display: "flex", alignItems: "center", gap: 1, p: 1.5 }}
                >
                  <AttendeeIcon className="icon" />
                  <Typography className="font">Attendee link</Typography>
                </MenuItem>
              </CopyToClipboard>
            </StyledMenu>
          </>
        )}
      </Observer>
    </>
  );
}
