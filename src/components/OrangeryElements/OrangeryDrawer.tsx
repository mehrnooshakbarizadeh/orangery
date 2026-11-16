import React from 'react';
// external dependencies

import {
  Drawer
} from "@mui/material";

import OrangeryCloseButton from './OrangeryCloseButton';

export default function OrangeryDrawer({
  children,
  handleClose,
  open
}: {
  children: React.ReactElement;
  handleClose: () => void;
  open: boolean
}) {
  return (
    <React.Fragment>
      <Drawer
        open={open}
        anchor={'right'}
        onClose={handleClose}
        sx={{
          position: "relative",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          "& .MuiPaper-root": {
            overflow: "hidden",
            py: 4,
            pl: 4,
            pr: 3,
            my: 2,
            mr: 2,
            height: "calc(100% - 32px)",
            borderRadius: 4,
            width: {
              xs: "calc(100% - 32px)",
              sm: "unset"
            }
          }
        }}
      >
        <OrangeryCloseButton onClose={handleClose} />
        {children}
      </Drawer>
    </React.Fragment>
  );
}