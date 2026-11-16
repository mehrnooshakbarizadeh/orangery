import { Box, Typography } from "@mui/material";
import { OrangeryPrice } from "../../../OrangeryElements";
import { EventFieldsState } from "../EventForm";

export const AssetSummary = ({ state }: { state: EventFieldsState }) => {
  return (
    <Box sx={{ pl: 4, pr: 3 }}>
      <Typography fontSize="20px" fontWeight={600} color="#A5AAB4" pt={1}>
        Assets
      </Typography>
      {state.assets.values.map((asset) => (
        <>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "end",
              gap: 2,
              "& .sub-row": {
                fontSize: "19px",
                fontWeight: 400,
                color: "#2B2E33",
              },
            }}
          >
            <Typography
              sx={{
                "&:first-letter": { textTransform: "capitalize" },
                fontSize: "19px",
                fontWeight: 600,
                color: "#55585C",
                flexGrow: 1,
              }}
            >
              {asset.value.grouped_name.value}
            </Typography>
            {asset.value.asset_type.value === "Included" ? (
              <Typography
                sx={{
                  fontSize: "19px",
                  fontWeight: 600,
                  color: "#0E0F11",
                }}
              >
                {asset.value.asset_type.value}
              </Typography>
            ) : (
              <>
                <Typography className="sub-row">
                  Quantity:{asset.value.quantity.value}
                </Typography>
                <Typography className="sub-row">
                  Price/Item:
                  {
                    <OrangeryPrice
                      euro={asset.value.price.value}
                      germanFormat
                    />
                  }{" "}
                </Typography>
                <Typography
                  sx={{
                    fontSize: "19px",
                    fontWeight: 600,
                    color: "#0E0F11",
                  }}
                >
                  Total:{" "}
                  {
                    <OrangeryPrice
                      euro={
                        asset.value.price.value * asset.value.quantity.value
                      }
                      germanFormat
                    />
                  }
                </Typography>
              </>
            )}
          </Box>
        </>
      ))}
    </Box>
  );
};
