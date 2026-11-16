import React from 'react';
// external dependencies

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Slide,
  Box
} from "@mui/material";

import OrangeryCloseButton from './OrangeryCloseButton';

function Transition(props) {
  return <Slide direction={"left"} {...props} />;
}

export default class OrangeryFlyout extends React.Component {
  render() {
    return (
      <Dialog
        open={this.props.open}
        TransitionComponent={Transition}
        keepMounted
        onClose={this.props.handleClose}
      >
        <DialogContent
          sx={{
            position: "relative",
            display: "flex",
            flexDirection: "column",
            overflowY: "hidden",
            flexGrow: 1,
            height: "100vh"
          }}
        >
          <OrangeryCloseButton onClose={this.props.handleClose} />
          {this.props.children}
        </DialogContent>
      </ Dialog>
    );
  }
}