import * as React from 'react';
import Can from "../../services/can";
import { ISubject } from "../../services/ability";
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import MoreVertIcon from '@mui/icons-material/MoreVert';

import {
  Typography,
  Box
} from "@mui/material";

// icons, images & colors
import AngleDownIcon from "../../assets/svg/angleDown.svg";
import AngleUpIcon from "../../assets/svg/angleUp.svg";

export interface IMenuOption {
  subject: ISubject;
  title: string;
  onClick: () => void
}

export default function OrangeryMenu({
  options,
  icon
}: {
  options: IMenuOption[],
  icon?: any
}) {
  const [open, setOpen] = React.useState(false);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setOpen(!open)
  };

  const handleClose = () => {
    setOpen(false)
  };

  return (
    <Box
      sx={{
        height: open ? "auto" : "68px",
        borderRadius: "10px",
        backgroundColor: "white",
        float: "right",
        padding: "8px",
        transition: "0.2s",
        boxShadow: open ? "5px 5px 11px #00000014" : "",
        ":hover": {
          cursor: "pointer",
          mr: "-0px",
        },
      }}
      onClick={(e) => handleClick(e)}
      onMouseLeave={() => handleClose()}
    >
      {icon
        ? <>
          {icon}
          <Box
            sx={{
              mt: "-43px",
              mr: "25px",
              float: "right",
              width: "20px",
              height: "50px",
            }}
          >
            {open ? <AngleUpIcon /> : <AngleDownIcon />}
          </Box>
        </>
        : <IconButton
          aria-label="more"
          id="long-button"
          aria-controls={open ? 'long-menu' : undefined}
          aria-expanded={open ? 'true' : undefined}
          aria-haspopup="true"
          onClick={handleClick}
        >
          <MoreVertIcon />
        </IconButton>
      }
      {options.map((option) => (
        <Can I="view" a={option.subject}
          key={option.title}
        >
          <Box
            sx={{
              zIndex: 2,
              height: "50px",
              mt: "8px",
              borderRadius: "5px",
              p: "10px",
              transition: "0.1s",
              visibility: open ? "visible" : "hidden",
              opacity: open ? 1 : 0,
              ":hover": {
                cursor: "pointer",
                backgroundColor: "#f3f3f3",
              },
            }}
            onClick={() => { option.onClick ? option.onClick() : () => { } }}
          >
            <Typography
              className={"noselect"}
              sx={{ fontSize: "22px", ml: "20px", fontWeight: 500, mr: "70px" }}
            >
              {option.title}
            </Typography>
          </Box>
        </Can>
      ))}
    </Box>
  );
}
