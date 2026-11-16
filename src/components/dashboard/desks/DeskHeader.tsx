// external dependencies
import { Box, Typography } from "@mui/material";

// orangery elements & internal dependencies
import { OrangerySearchInput } from "../../OrangeryElements";

// icons, images & colors
import AngelDownIcon from "../../../assets/svg/angleDown.svg";

export default function DeskHeader() {
  return (
    <>
      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-end",
          alignItems: "felx-end",
          height: 90,
          pb: 4,
        }}
      >
        <Box sx={{ flexGrow: 1, pr: 10 }}>
          <OrangerySearchInput />
        </Box>
        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            gap: 1.8,
            cursor: "pointer",
          }}
        >
          <Box
            sx={{
              backgroundColor: (theme) => theme.palette.grey[100],
              p: 2,
              borderRadius: 2.5,
              display: "flex",
              gap: 2,
              height: 55,
              alignItems: "center",
            }}
          >
            <Box
              sx={{
                width: 12,
                color: (theme) => theme.palette.grey.A200,
                display: "flex",
              }}
            >
              <AngelDownIcon />
            </Box>
            <Typography
              sx={{ color: "grey.A400", fontSize: 17, fontWeight: 400 }}
            >
              Type
            </Typography>
          </Box>
          <Box
            sx={{
              backgroundColor: (theme) => theme.palette.grey[100],
              p: 2,
              borderRadius: 2.5,
              display: "flex",
              gap: 2,
              alignItems: "center",

              height: 55,
            }}
          >
            <Box
              sx={{
                width: 12,
                color: (theme) => theme.palette.grey.A200,
                display: "flex",
              }}
            >
              <AngelDownIcon />
            </Box>
            <Typography
              sx={{ color: "grey.A400", fontSize: 17, fontWeight: 400 }}
            >
              Coworker
            </Typography>
          </Box>
          <Box
            sx={{
              backgroundColor: (theme) => theme.palette.grey[100],
              p: 2,
              borderRadius: 2.5,
              height: 55,
              display: "flex",
              alignItems: "center",
              gap: 2,
            }}
          >
            <Box
              sx={{
                width: 12,
                color: (theme) => theme.palette.grey.A200,
                display: "flex",
              }}
            >
              <AngelDownIcon />
            </Box>
            <Typography
              sx={{ color: "grey.A400", fontSize: 17, fontWeight: 400 }}
            >
              Floor
            </Typography>
          </Box>
          <Box
            sx={{
              backgroundColor: (theme) => theme.palette.grey[100],
              p: 2,
              borderRadius: 2.5,
              height: 55,
              display: "flex",
              alignItems: "center",
              gap: 2,
            }}
          >
            <Box
              sx={{
                width: 12,
                color: (theme) => theme.palette.grey.A200,
                display: "flex",
              }}
            >
              <AngelDownIcon />
            </Box>
            <Typography
              sx={{ color: "grey.A400", fontSize: 17, fontWeight: 400 }}
            >
              Department
            </Typography>
          </Box>
        </Box>
      </Box>
    </>
  );
}
