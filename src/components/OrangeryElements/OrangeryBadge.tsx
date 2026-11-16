// external dependencies
import { Box, IconButton, Typography } from "@mui/material";
import { Observer } from "mobx-react-lite";

export default function OrangeryBadge({
  icon,
  badgeContent,
  handleOpen,
}: {
  icon: React.ReactNode;
  badgeContent: number;
  handleOpen?: () => void;
}) {
  return (
    <>
      <Observer>
        {() => (
          <IconButton
            onClick={handleOpen}
            sx={{
              position: "relative",
              "& .hand-icon": {
                width: "1.3rem",
                height: "1.3rem",
              },
            }}
          >
            <Box
              sx={{
                position: "absolute",
                top: -3,
                right: 0,
                backgroundColor: "red",
                borderRadius: "50%",
                width: "1.1rem",
                height: "1.1rem",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Typography variant="h6" sx={{ color: "#fff" }}>
                {badgeContent}
              </Typography>
            </Box>
            <Box
              sx={{ width: "1.3rem", height: "1.3rem", color: "primary.main" }}
            >
              {icon}
            </Box>
          </IconButton>
        )}
      </Observer>
    </>
  );
}
