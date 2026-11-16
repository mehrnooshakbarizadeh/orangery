import { Box, Button, Icon, Typography } from "@mui/material";
import NextLink from "next/link";
import { Link as MUILink } from "@mui/material";
import CsvDownloadIcon from "../../../assets/svg/csvDownload.svg";

export default function DownloadCsvSample() {
  return (
    <>
      <Box
        sx={{
          width: "59%",
        }}
      >
        <NextLink
          href={`${process.env.NEXT_PUBLIC_CDN_URL}/sample_bb660880-be8a-41f9-a2e9-262a2622ebbd.csv`}
          passHref
        >
          <MUILink
            href={`${process.env.NEXT_PUBLIC_CDN_URL}/sample_bb660880-be8a-41f9-a2e9-262a2622ebbd.csv`}
            download
            target="_blank"
            rel="noreferrer"
            sx={{ textDecoration: "none" }}
          >
            <Button
              variant="outlined"
              sx={{ display: "flex", alignItems: "center", gap: 1 }}
            >
              <Icon
                sx={{
                  "& .svg": { width: "1rem", height: "1.5rem" },
                  "&.MuiIcon-root": { height: "2.3rem" },
                }}
              >
                <CsvDownloadIcon className="svg" />
              </Icon>
              <Typography fontSize={12} fontWeight={600}>
                Download Sample File (.csv)
              </Typography>
            </Button>
          </MUILink>
        </NextLink>
      </Box>
    </>
  );
}
