// react & next
import React from "react";

// external dependencies
import {
  Table,
  TableContainer,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Box,
  Button,
  IconButton,
  Dialog,
  DialogContent,
} from "@mui/material";

// icons, images & colors
import CrossIcon from "../../../assets/svg/cross.svg";
import CheckIcon from "../../../assets/svg/check.svg";
import { Height } from "@mui/icons-material";

export default function WhatAreRolesButton() {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  const iconStyle = { height: "1.4rem", width: "1.4rem" };
  return (
    <>
      <Button
        variant="text"
        onClick={() => handleOpen()}
        sx={{
          pb: 2,
          fontSize: 12,
          "&:hover": { backgroundColor: "unset" },
        }}
      >
        What are roles?
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
        sx={{
          "& .MuiPaper-root": { maxWidth: 1000, width: 1000 },
          px: 4,
          pt: 6,
          pb: 3,
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "end",
            alignItems: "center",
          }}
        >
          <Box sx={{ flexGrow: 1 }} />

          <IconButton
            onClick={handleClose}
            color="secondary"
            aria-label="upload picture"
            component="span"
            sx={{
              "&:hover": {
                backgroundColor: "unset",
                color: "#000",
                transition: "0.5s",
              },
            }}
          >
            <Box
              sx={{
                width: 12,
                height: 12,
                mr: 2.5,
              }}
            >
              <CrossIcon />
            </Box>
          </IconButton>
        </Box>
        <DialogContent
          sx={{
            "& .MuiAccordion-root": {
              backgroundColor: "grey",
              m: 1,
              p: 1,
              borderRadius: 1,
              // borderRadius: 5,
            },
          }}
        >
          {open && (
            <>
              <TableContainer sx={{ maxHeight: 740 }}>
                <Table aria-label="simple table" stickyHeader>
                  <TableHead
                    sx={{ backgroundColor: (theme) => theme.palette.grey[200] }}
                  >
                    <TableRow
                      sx={{
                        "&:last-child td, &:last-child th ": { border: 0 },
                        "& th:first-of-type": {
                          borderBottomLeftRadius: 10,
                          borderTopLeftRadius: 10,
                        },
                        "& th:last-child": {
                          borderBottomRightRadius: 10,
                          borderTopRightRadius: 10,
                        },
                        "& .MuiTableCell-root": {
                          fontSize: 14,
                          fontWeight: 600,
                          backgroundColor: (theme) => theme.palette.grey[200],
                          color: (theme) => theme.palette.grey.A700,
                        },
                      }}
                    >
                      <TableCell align="left">Permissions</TableCell>
                      <TableCell align="center">Super Admin</TableCell>
                      <TableCell align="center">Space Admin</TableCell>
                      <TableCell align="center">Front Desk Admin</TableCell>
                      <TableCell align="center">Warehouse Admin</TableCell>
                      <TableCell align="center">Security Admin</TableCell>
                      <TableCell align="center">Finance Admin</TableCell>
                      <TableCell align="center">Employee</TableCell>
                      <TableCell align="center">Visitor</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <TableRow>
                      <TableCell>Login to Dashboard</TableCell>
                      <TableCell>
                        <RoleIcon icon={<CheckIcon />} />
                      </TableCell>
                      <TableCell>
                        <RoleIcon icon={<CheckIcon />} />
                      </TableCell>
                      <TableCell>
                        <RoleIcon icon={<CheckIcon />} />
                      </TableCell>
                      <TableCell>
                        <RoleIcon icon={<CheckIcon />} />
                      </TableCell>
                      <TableCell>
                        <RoleIcon icon={<CheckIcon />} />
                      </TableCell>
                      <TableCell>
                        <RoleIcon icon={<CheckIcon />} />
                      </TableCell>
                      <TableCell>
                        <RoleIcon icon={<CheckIcon />} />
                      </TableCell>
                      <TableCell>
                        <RoleIcon icon={<CheckIcon />} />
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Dashboard Overview</TableCell>
                      <TableCell>
                        <RoleIcon icon={<CheckIcon />} />
                      </TableCell>
                      <TableCell>
                        <RoleIcon icon={<CheckIcon />} />
                      </TableCell>
                      <TableCell>
                        <RoleIcon icon={<CheckIcon />} />
                      </TableCell>
                      <TableCell>
                        <RoleIcon icon={<CheckIcon />} />
                      </TableCell>
                      <TableCell>
                        <RoleIcon icon={<CheckIcon />} />
                      </TableCell>
                      <TableCell>
                        <RoleIcon icon={<CheckIcon />} />
                      </TableCell>
                      <TableCell>
                        <RoleIcon icon={<CheckIcon />} />
                      </TableCell>
                      <TableCell>
                        <RoleIcon icon={<CheckIcon />} />
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Change Profile Settings</TableCell>
                      <TableCell>
                        <RoleIcon icon={<CheckIcon />} />
                      </TableCell>
                      <TableCell>
                        <RoleIcon icon={<CheckIcon />} />
                      </TableCell>
                      <TableCell>
                        <RoleIcon icon={<CheckIcon />} />
                      </TableCell>
                      <TableCell>
                        <RoleIcon icon={<CheckIcon />} />
                      </TableCell>
                      <TableCell>
                        <RoleIcon icon={<CheckIcon />} />
                      </TableCell>
                      <TableCell>
                        <RoleIcon icon={<CheckIcon />} />
                      </TableCell>
                      <TableCell>
                        <RoleIcon icon={<CheckIcon />} />
                      </TableCell>
                      <TableCell>
                        <RoleIcon icon={<CheckIcon />} />
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Visitor User Console</TableCell>
                      <TableCell>
                        <RoleIcon icon={<CheckIcon />} />
                      </TableCell>
                      <TableCell>
                        <RoleIcon icon={<CheckIcon />} />
                      </TableCell>
                      <TableCell>
                        <RoleIcon icon={<CheckIcon />} />
                      </TableCell>
                      <TableCell>
                        <RoleIcon icon={<CheckIcon />} />
                      </TableCell>
                      <TableCell>
                        <RoleIcon icon={<CheckIcon />} />
                      </TableCell>
                      <TableCell>
                        <RoleIcon icon={<CrossIcon style={iconStyle} />} />
                      </TableCell>
                      <TableCell>
                        <RoleIcon icon={<CrossIcon style={iconStyle} />} />
                      </TableCell>
                      <TableCell>
                        <RoleIcon icon={<CrossIcon style={iconStyle} />} />
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Employee List in Dashboard</TableCell>
                      <TableCell>
                        <RoleIcon icon={<CheckIcon />} />
                      </TableCell>
                      <TableCell>
                        <RoleIcon icon={<CheckIcon />} />
                      </TableCell>
                      <TableCell>
                        <RoleIcon icon={<CheckIcon />} />
                      </TableCell>
                      <TableCell>
                        <RoleIcon icon={<CheckIcon />} />
                      </TableCell>
                      <TableCell>
                        <RoleIcon icon={<CrossIcon style={iconStyle} />} />
                      </TableCell>
                      <TableCell>
                        <RoleIcon icon={<CrossIcon style={iconStyle} />} />
                      </TableCell>
                      <TableCell>
                        <RoleIcon icon={<CrossIcon style={iconStyle} />} />
                      </TableCell>
                      <TableCell>
                        <RoleIcon icon={<CrossIcon style={iconStyle} />} />
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Employee User Console</TableCell>
                      <TableCell>
                        <RoleIcon icon={<CheckIcon />} />
                      </TableCell>
                      <TableCell>
                        <RoleIcon icon={<CheckIcon />} />
                      </TableCell>
                      <TableCell>
                        <RoleIcon icon={<CheckIcon />} />
                      </TableCell>
                      <TableCell>
                        <RoleIcon icon={<CheckIcon />} />
                      </TableCell>
                      <TableCell>
                        <RoleIcon icon={<CrossIcon style={iconStyle} />} />
                      </TableCell>
                      <TableCell>
                        <RoleIcon icon={<CrossIcon style={iconStyle} />} />
                      </TableCell>
                      <TableCell>
                        <RoleIcon icon={<CrossIcon style={iconStyle} />} />
                      </TableCell>
                      <TableCell>
                        <RoleIcon icon={<CrossIcon style={iconStyle} />} />
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Delivery Management</TableCell>
                      <TableCell>
                        <RoleIcon icon={<CheckIcon />} />
                      </TableCell>
                      <TableCell>
                        <RoleIcon icon={<CheckIcon />} />
                      </TableCell>
                      <TableCell>
                        <RoleIcon icon={<CheckIcon />} />
                      </TableCell>
                      <TableCell>
                        <RoleIcon icon={<CheckIcon />} />
                      </TableCell>
                      <TableCell>
                        <RoleIcon icon={<CrossIcon style={iconStyle} />} />
                      </TableCell>
                      <TableCell>
                        <RoleIcon icon={<CrossIcon style={iconStyle} />} />
                      </TableCell>
                      <TableCell>
                        <RoleIcon icon={<CrossIcon style={iconStyle} />} />
                      </TableCell>
                      <TableCell>
                        <RoleIcon icon={<CrossIcon style={iconStyle} />} />
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Customer User Console</TableCell>
                      <TableCell>
                        <RoleIcon icon={<CheckIcon />} />
                      </TableCell>
                      <TableCell>
                        <RoleIcon icon={<CheckIcon />} />
                      </TableCell>
                      <TableCell>
                        <RoleIcon icon={<CrossIcon style={iconStyle} />} />
                      </TableCell>
                      <TableCell>
                        <RoleIcon icon={<CrossIcon style={iconStyle} />} />
                      </TableCell>
                      <TableCell>
                        <RoleIcon icon={<CrossIcon style={iconStyle} />} />
                      </TableCell>
                      <TableCell>
                        <RoleIcon icon={<CheckIcon />} />
                      </TableCell>
                      <TableCell>
                        <RoleIcon icon={<CrossIcon style={iconStyle} />} />
                      </TableCell>
                      <TableCell>
                        <RoleIcon icon={<CrossIcon style={iconStyle} />} />
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>View/Download Monthly Reports</TableCell>
                      <TableCell>
                        <RoleIcon icon={<CheckIcon />} />
                      </TableCell>
                      <TableCell>
                        <RoleIcon icon={<CheckIcon />} />
                      </TableCell>
                      <TableCell>
                        <RoleIcon icon={<CrossIcon style={iconStyle} />} />
                      </TableCell>
                      <TableCell>
                        <RoleIcon icon={<CrossIcon style={iconStyle} />} />
                      </TableCell>
                      <TableCell>
                        <RoleIcon icon={<CrossIcon style={iconStyle} />} />
                      </TableCell>
                      <TableCell>
                        <RoleIcon icon={<CheckIcon />} />
                      </TableCell>
                      <TableCell>
                        <RoleIcon icon={<CrossIcon style={iconStyle} />} />
                      </TableCell>
                      <TableCell>
                        <RoleIcon icon={<CrossIcon style={iconStyle} />} />
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Contract Management</TableCell>
                      <TableCell>
                        <RoleIcon icon={<CheckIcon />} />
                      </TableCell>
                      <TableCell>
                        <RoleIcon icon={<CheckIcon />} />
                      </TableCell>
                      <TableCell>
                        <RoleIcon icon={<CrossIcon style={iconStyle} />} />
                      </TableCell>
                      <TableCell>
                        <RoleIcon icon={<CrossIcon style={iconStyle} />} />
                      </TableCell>
                      <TableCell>
                        <RoleIcon icon={<CrossIcon style={iconStyle} />} />
                      </TableCell>
                      <TableCell>
                        <RoleIcon icon={<CheckIcon />} />
                      </TableCell>
                      <TableCell>
                        <RoleIcon icon={<CrossIcon style={iconStyle} />} />
                      </TableCell>
                      <TableCell>
                        <RoleIcon icon={<CrossIcon style={iconStyle} />} />
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>View/Edit Payment Details</TableCell>
                      <TableCell>
                        <RoleIcon icon={<CheckIcon />} />
                      </TableCell>
                      <TableCell>
                        <RoleIcon icon={<CheckIcon />} />
                      </TableCell>
                      <TableCell>
                        <RoleIcon icon={<CrossIcon style={iconStyle} />} />
                      </TableCell>
                      <TableCell>
                        <RoleIcon icon={<CrossIcon style={iconStyle} />} />
                      </TableCell>
                      <TableCell>
                        <RoleIcon icon={<CrossIcon style={iconStyle} />} />
                      </TableCell>
                      <TableCell>
                        <RoleIcon icon={<CheckIcon />} />
                      </TableCell>
                      <TableCell>
                        <RoleIcon icon={<CrossIcon style={iconStyle} />} />
                      </TableCell>
                      <TableCell>
                        <RoleIcon icon={<CrossIcon style={iconStyle} />} />
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Add/Edit Inventories</TableCell>
                      <TableCell>
                        <RoleIcon icon={<CheckIcon />} />
                      </TableCell>
                      <TableCell>
                        <RoleIcon icon={<CheckIcon />} />
                      </TableCell>
                      <TableCell>
                        <RoleIcon icon={<CrossIcon style={iconStyle} />} />
                      </TableCell>
                      <TableCell>
                        <RoleIcon icon={<CheckIcon />} />
                      </TableCell>
                      <TableCell>
                        <RoleIcon icon={<CrossIcon style={iconStyle} />} />
                      </TableCell>
                      <TableCell>
                        <RoleIcon icon={<CrossIcon style={iconStyle} />} />
                      </TableCell>
                      <TableCell>
                        <RoleIcon icon={<CrossIcon style={iconStyle} />} />
                      </TableCell>
                      <TableCell>
                        <RoleIcon icon={<CrossIcon style={iconStyle} />} />
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Add/Edit Rooms</TableCell>
                      <TableCell>
                        <RoleIcon icon={<CheckIcon />} />
                      </TableCell>
                      <TableCell>
                        <RoleIcon icon={<CheckIcon />} />
                      </TableCell>
                      <TableCell>
                        <RoleIcon icon={<CrossIcon style={iconStyle} />} />
                      </TableCell>
                      <TableCell>
                        <RoleIcon icon={<CheckIcon />} />
                      </TableCell>
                      <TableCell>
                        <RoleIcon icon={<CrossIcon style={iconStyle} />} />
                      </TableCell>
                      <TableCell>
                        <RoleIcon icon={<CrossIcon style={iconStyle} />} />
                      </TableCell>
                      <TableCell>
                        <RoleIcon icon={<CrossIcon style={iconStyle} />} />
                      </TableCell>
                      <TableCell>
                        <RoleIcon icon={<CrossIcon style={iconStyle} />} />
                      </TableCell>
                    </TableRow>

                    <TableRow>
                      <TableCell>Build/Edit Office</TableCell>
                      <TableCell>
                        <RoleIcon icon={<CheckIcon />} />
                      </TableCell>
                      <TableCell>
                        <RoleIcon icon={<CheckIcon />} />
                      </TableCell>
                      <TableCell>
                        <RoleIcon icon={<CrossIcon style={iconStyle} />} />
                      </TableCell>
                      <TableCell>
                        <RoleIcon icon={<CrossIcon style={iconStyle} />} />
                      </TableCell>
                      <TableCell>
                        <RoleIcon icon={<CrossIcon style={iconStyle} />} />
                      </TableCell>
                      <TableCell>
                        <RoleIcon icon={<CrossIcon style={iconStyle} />} />
                      </TableCell>
                      <TableCell>
                        <RoleIcon icon={<CrossIcon style={iconStyle} />} />
                      </TableCell>
                      <TableCell>
                        <RoleIcon icon={<CrossIcon style={iconStyle} />} />
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Add/Edit Floors</TableCell>
                      <TableCell>
                        <RoleIcon icon={<CheckIcon />} />
                      </TableCell>
                      <TableCell>
                        <RoleIcon icon={<CheckIcon />} />
                      </TableCell>
                      <TableCell>
                        <RoleIcon icon={<CrossIcon style={iconStyle} />} />
                      </TableCell>
                      <TableCell>
                        <RoleIcon icon={<CrossIcon style={iconStyle} />} />
                      </TableCell>
                      <TableCell>
                        <RoleIcon icon={<CrossIcon style={iconStyle} />} />
                      </TableCell>
                      <TableCell>
                        <RoleIcon icon={<CrossIcon style={iconStyle} />} />
                      </TableCell>
                      <TableCell>
                        <RoleIcon icon={<CrossIcon style={iconStyle} />} />
                      </TableCell>
                      <TableCell>
                        <RoleIcon icon={<CrossIcon style={iconStyle} />} />
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Add/Edit Desks</TableCell>
                      <TableCell>
                        <RoleIcon icon={<CheckIcon />} />
                      </TableCell>
                      <TableCell>
                        <RoleIcon icon={<CheckIcon />} />
                      </TableCell>
                      <TableCell>
                        <RoleIcon icon={<CrossIcon style={iconStyle} />} />
                      </TableCell>
                      <TableCell>
                        <RoleIcon icon={<CrossIcon style={iconStyle} />} />
                      </TableCell>
                      <TableCell>
                        <RoleIcon icon={<CrossIcon style={iconStyle} />} />
                      </TableCell>
                      <TableCell>
                        <RoleIcon icon={<CrossIcon style={iconStyle} />} />
                      </TableCell>
                      <TableCell>
                        <RoleIcon icon={<CrossIcon style={iconStyle} />} />
                      </TableCell>
                      <TableCell>
                        <RoleIcon icon={<CrossIcon style={iconStyle} />} />
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Add/Edit Meeting Rooms</TableCell>
                      <TableCell>
                        <RoleIcon icon={<CheckIcon />} />
                      </TableCell>
                      <TableCell>
                        <RoleIcon icon={<CheckIcon />} />
                      </TableCell>
                      <TableCell>
                        <RoleIcon icon={<CrossIcon style={iconStyle} />} />
                      </TableCell>
                      <TableCell>
                        <RoleIcon icon={<CrossIcon style={iconStyle} />} />
                      </TableCell>
                      <TableCell>
                        <RoleIcon icon={<CrossIcon style={iconStyle} />} />
                      </TableCell>
                      <TableCell>
                        <RoleIcon icon={<CrossIcon style={iconStyle} />} />
                      </TableCell>
                      <TableCell>
                        <RoleIcon icon={<CrossIcon style={iconStyle} />} />
                      </TableCell>
                      <TableCell>
                        <RoleIcon icon={<CrossIcon style={iconStyle} />} />
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Change Notification Email Settings</TableCell>
                      <TableCell>
                        <RoleIcon icon={<CheckIcon />} />
                      </TableCell>
                      <TableCell>
                        <RoleIcon icon={<CheckIcon />} />
                      </TableCell>
                      <TableCell>
                        <RoleIcon icon={<CrossIcon style={iconStyle} />} />
                      </TableCell>
                      <TableCell>
                        <RoleIcon icon={<CrossIcon style={iconStyle} />} />
                      </TableCell>
                      <TableCell>
                        <RoleIcon icon={<CrossIcon style={iconStyle} />} />
                      </TableCell>
                      <TableCell>
                        <RoleIcon icon={<CrossIcon style={iconStyle} />} />
                      </TableCell>
                      <TableCell>
                        <RoleIcon icon={<CrossIcon style={iconStyle} />} />
                      </TableCell>
                      <TableCell>
                        <RoleIcon icon={<CrossIcon style={iconStyle} />} />
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Add/Change Office</TableCell>
                      <TableCell>
                        <RoleIcon icon={<CheckIcon />} />
                      </TableCell>
                      <TableCell>
                        <RoleIcon icon={<CrossIcon style={iconStyle} />} />
                      </TableCell>
                      <TableCell>
                        <RoleIcon icon={<CrossIcon style={iconStyle} />} />
                      </TableCell>
                      <TableCell>
                        <RoleIcon icon={<CrossIcon style={iconStyle} />} />
                      </TableCell>
                      <TableCell>
                        <RoleIcon icon={<CrossIcon style={iconStyle} />} />
                      </TableCell>
                      <TableCell>
                        <RoleIcon icon={<CrossIcon style={iconStyle} />} />
                      </TableCell>
                      <TableCell>
                        <RoleIcon icon={<CrossIcon style={iconStyle} />} />
                      </TableCell>
                      <TableCell>
                        <RoleIcon icon={<CrossIcon style={iconStyle} />} />
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>
                        Office Settings (Location Name, Address ...)
                      </TableCell>
                      <TableCell>
                        <RoleIcon icon={<CheckIcon />} />
                      </TableCell>
                      <TableCell>
                        <RoleIcon icon={<CrossIcon style={iconStyle} />} />
                      </TableCell>
                      <TableCell>
                        <RoleIcon icon={<CrossIcon style={iconStyle} />} />
                      </TableCell>
                      <TableCell>
                        <RoleIcon icon={<CrossIcon style={iconStyle} />} />
                      </TableCell>
                      <TableCell>
                        <RoleIcon icon={<CrossIcon style={iconStyle} />} />
                      </TableCell>
                      <TableCell>
                        <RoleIcon icon={<CrossIcon style={iconStyle} />} />
                      </TableCell>
                      <TableCell>
                        <RoleIcon icon={<CrossIcon style={iconStyle} />} />
                      </TableCell>
                      <TableCell>
                        <RoleIcon icon={<CrossIcon style={iconStyle} />} />
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Manage Media</TableCell>
                      <TableCell>
                        <RoleIcon icon={<CheckIcon />} />
                      </TableCell>
                      <TableCell>
                        <RoleIcon icon={<CrossIcon style={iconStyle} />} />
                      </TableCell>
                      <TableCell>
                        <RoleIcon icon={<CrossIcon style={iconStyle} />} />
                      </TableCell>
                      <TableCell>
                        <RoleIcon icon={<CrossIcon style={iconStyle} />} />
                      </TableCell>
                      <TableCell>
                        <RoleIcon icon={<CrossIcon style={iconStyle} />} />
                      </TableCell>
                      <TableCell>
                        <RoleIcon icon={<CrossIcon style={iconStyle} />} />
                      </TableCell>
                      <TableCell>
                        <RoleIcon icon={<CrossIcon style={iconStyle} />} />
                      </TableCell>
                      <TableCell>
                        <RoleIcon icon={<CrossIcon style={iconStyle} />} />
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Manage Apps</TableCell>
                      <TableCell>
                        <RoleIcon icon={<CheckIcon />} />
                      </TableCell>
                      <TableCell>
                        <RoleIcon icon={<CrossIcon style={iconStyle} />} />
                      </TableCell>
                      <TableCell>
                        <RoleIcon icon={<CrossIcon style={iconStyle} />} />
                      </TableCell>
                      <TableCell>
                        <RoleIcon icon={<CrossIcon style={iconStyle} />} />
                      </TableCell>
                      <TableCell>
                        <RoleIcon icon={<CrossIcon style={iconStyle} />} />
                      </TableCell>
                      <TableCell>
                        <RoleIcon icon={<CrossIcon style={iconStyle} />} />
                      </TableCell>
                      <TableCell>
                        <RoleIcon icon={<CrossIcon style={iconStyle} />} />
                      </TableCell>
                      <TableCell>
                        <RoleIcon icon={<CrossIcon style={iconStyle} />} />
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Add/Edit Office Guideline</TableCell>
                      <TableCell>
                        <RoleIcon icon={<CheckIcon />} />
                      </TableCell>
                      <TableCell>
                        <RoleIcon icon={<CrossIcon style={iconStyle} />} />
                      </TableCell>
                      <TableCell>
                        <RoleIcon icon={<CrossIcon style={iconStyle} />} />
                      </TableCell>
                      <TableCell>
                        <RoleIcon icon={<CrossIcon style={iconStyle} />} />
                      </TableCell>
                      <TableCell>
                        <RoleIcon icon={<CrossIcon style={iconStyle} />} />
                      </TableCell>
                      <TableCell>
                        <RoleIcon icon={<CrossIcon style={iconStyle} />} />
                      </TableCell>
                      <TableCell>
                        <RoleIcon icon={<CrossIcon style={iconStyle} />} />
                      </TableCell>
                      <TableCell>
                        <RoleIcon icon={<CrossIcon style={iconStyle} />} />
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}

function RoleIcon({ icon }: { icon: React.ReactNode }) {
  return (
    <>
      <TableCell
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          "&.MuiTableCell-root": {
            border: 0,
          },
        }}
      >
        <Box sx={{ width: 24, textAlign: "-webkit-center" }}>{icon}</Box>
      </TableCell>
    </>
  );
}
