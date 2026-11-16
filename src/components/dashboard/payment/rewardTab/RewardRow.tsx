import { Box, Grid, Typography } from "@mui/material";
import { IReward } from "../../../../queries/reward";

export default function RewardRow({ reward }: { reward: IReward }) {
  return (
    <>
      <Grid
        container
        sx={{
          display: "flex",
          justifyContent: "end",
          py: 2.7,
          px: 2.4,
          boxShadow: "1px 1px 8px #0000000a",
          border: "1px solid rgb(210 215 221)",
          alignItems: "stretch",
          borderRadius: 1.5,
          mb: 1.2,
          mx: 0,
          fontSize: 16,
          fontWeight: 500,
          "& .align-column": {
            display: "flex",
            flexDirection: "column",
            gap: "2px",
          },
          "& .MuiTypography-root": {
            "&.titr-typo": {
              fontSize: "13px",
              fontWeight: "600",
            },
          },
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", flexGrow: 1 }}>
          <Grid
            xs={12}
            sm={4}
            md={3}
            item
            className="align-column"
            sx={{
              "& .memo-icon": { width: "1.3rem" },
            }}
          >
            <Typography className="titr-typo">NAME</Typography>
            <Typography variant="h4">{`${reward.user.name[0].toUpperCase()}${reward.user.name.substring(
              1
            )}`}</Typography>
          </Grid>
          <Grid
            xs={12}
            sm={4}
            md={2}
            item
            className="align-column"
            sx={{
              "& .memo-icon": { width: "1.3rem" },
            }}
          >
            <Typography className="titr-typo">TYPE</Typography>
            <Typography variant="h4">{reward.type}</Typography>
          </Grid>
          <Grid
            xs={12}
            sm={4}
            md={2}
            item
            className="align-column"
            sx={{
              "& .memo-icon": { width: "1.3rem" },
            }}
          >
            <Typography className="titr-typo">INVOICE NUMBER</Typography>
            <Typography variant="h4">{reward.invoice_number}</Typography>
          </Grid>
          <Grid
            xs={12}
            sm={4}
            md={2}
            item
            className="align-column"
            sx={{
              "& .memo-icon": { width: "1.3rem" },
            }}
          >
            <Typography className="titr-typo">INVOICE DATE</Typography>
            <Typography variant="h4">
              {new Date(reward.created_at).toLocaleString("de-DE", {
                month: "long",
                year: "numeric",
                day: "numeric",
              })}
            </Typography>
          </Grid>
        </Box>
        <Grid
          xs={12}
          sm={4}
          md={1}
          item
          className="align-column"
          sx={{
            "& .memo-icon": { width: "1.3rem" },
          }}
        >
          <Typography className="titr-typo">AMOUNT OF REWARD</Typography>
          <Typography variant="h4">
            {reward.points} OS Coin{reward.points >= 1 ? "s" : ""}
          </Typography>
        </Grid>
      </Grid>
    </>
  );
}
