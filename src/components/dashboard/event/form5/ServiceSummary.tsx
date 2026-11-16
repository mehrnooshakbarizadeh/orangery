import { Box, Typography } from "@mui/material";
import { OrangeryPrice } from "../../../OrangeryElements";
import { EventFieldsState } from "../EventForm";

export const ServiceSummary = ({ state }: { state: EventFieldsState }) => {
  return (
    <Box sx={{ pl: 4, pr: 3 }}>
      <Typography fontSize="20px" fontWeight={600} color="#A5AAB4" pt={1}>
        Services
      </Typography>
      {state.services.values.map((service) => (
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
              {service.value.service_name.value}
            </Typography>
            {/* <Typography fontSize="19" fontWeight={600} color="#A5AAB4">
              {service.value.email.value}
            </Typography> */}
            <>
              <Typography className="sub-row">
                Q: {service.value.quantity.value}
              </Typography>
              <Typography className="sub-row">
                Price:
                {
                  <OrangeryPrice
                    euro={service.value.price.value}
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
                      service.value.price.value * service.value.quantity.value
                    }
                    germanFormat
                  />
                }
              </Typography>
            </>
          </Box>
        </>
      ))}
    </Box>
  );
};
