// react & next
import React from "react";

// external dependencies
import {
  Box,
  Dialog,
  DialogContent,
  Button,
  Typography,
} from "@mui/material";

// orangery elements & internal dependencies
import {
  OrangeryUserCard2,
  OrangeryIconTitle,
  OrangeryCloseButton,
} from ".";

// queries & backend
import { IEmployee } from "../../queries/employee";

// icons, images & colors
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

export default function OrangerySeeAllEmployeesButton({
  users,
  caption
}: {
  users?: IEmployee[];
  caption?: string
}) {
  const [open, setOpen] = React.useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <Button
        onClick={() => handleOpen()}
        color="primary"
        sx={{
          px: 1,
          py: .5,
          width: "fit-content",
        }}
      >
        <Typography
          sx={{
            fontSize: 12,
            fontWeight: 600,
            color: "#074EE8"
          }}
        >
          {caption ?? "see all"}
        </Typography>
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
        sx={{
          "& .MuiPaper-root": {},
          "& .form-container": { px: 0 },
        }}
      >
        <DialogContent
          className="form-container"
          sx={{
            maxWidth: 900,
            position: "relative",
          }}
        >
          {open && (
            <Box
              sx={{
                width: 550,
                pl: 4,
                pr: 1,
                height: "100%",
              }}
            >
              <OrangeryCloseButton onClose={handleClose} />
              <Box
                sx={{
                  width: "100%",
                }}
              >
                <OrangeryIconTitle
                  title={"Attendees"}
                  sx={{
                    mb: 4,
                    color: "black"
                  }}
                />
              </Box>
              <Box
                sx={{
                  width: "100%",
                  maxHeight: 550,
                  pr: 3,
                  pb: .25,
                  overflowY: "auto",
                  overflowX: "hidden",
                  gap: 4,
                  display: "flex",
                  flexDirection: "column",
                  height: "100%",
                  "&::-webkit-scrollbar": {
                    width: "0.4em",
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
                {users?.map((item, index) => (
                  <OrangeryUserCard2
                    key={index + item.name}
                    expanded
                    withName
                    user={item}
                    size={46}
                  />
                ))}
              </Box>
            </Box>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
