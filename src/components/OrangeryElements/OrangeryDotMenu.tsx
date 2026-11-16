import * as React from 'react';
import {
  IconButton,
  Box
} from '@mui/material';
import {
  Menu,
  MenuItem,
  MenuButton
} from '@szhsin/react-menu';
import '@szhsin/react-menu/dist/index.css';
import '@szhsin/react-menu/dist/transitions/slide.css';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';

export default function OrangeryDotMenu({
  horizontal,
  disabled,
  options,
  selectedOptionTitle
}: {
  horizontal?: boolean,
  disabled?: boolean;
  options: JSX.Element[],
  selectedOptionTitle?: string
}) {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <Menu
      direction="bottom"
      align="end"
      menuButton={
        <IconButton
          aria-label="more"
          id="long-button"
          aria-controls={open ? 'long-menu' : undefined}
          aria-expanded={open ? 'true' : undefined}
          aria-haspopup="true"
          onClick={handleClick}
          sx={{
            width: 40,
            height: 40
          }}
          disabled={disabled}
        >
          {horizontal
            ? < MoreHorizIcon />
            : < MoreVertIcon />
          }
        </IconButton>
      }
    >
      {options.map((option) => (
        <MenuItem
          style={{ padding: 0 }}
          key={option.key}
        // selected={option.title === selectedOptionTitle}
        // onClick={() => { option.onClick(); handleClose(); }}
        >
          {option}
        </MenuItem>
      ))}
    </Menu>);
}
