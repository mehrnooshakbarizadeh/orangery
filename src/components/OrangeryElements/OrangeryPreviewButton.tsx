import { Button, Typography } from "@mui/material";
import { useState } from "react";
import PreviewIcon from "../../assets/svg/preview.svg";

export default function OrangeryPreviewButton({ onClick }: { onClick: () => void }) {

    return (
        <>
            <Button
                variant="outlined"
                onClick={onClick}
                sx={{
                    px: "11px",
                    border: "1px solid #2B2E33",
                    borderRadius: '5px',
                    "& > *:first-of-type": { mx: 0 },
                    "& .ListCheckedIcon": {
                        width: "1.3rem",
                        height: "1.3rem",
                        mr: "0.5rem",
                        color: "#2B2E33",
                    },
                    "& .MuiButton-root": { minWidth: 40 },
                }}
            >
                <PreviewIcon className="ListCheckedIcon" />
                <Typography fontSize={14} fontWeight={600} color="#2B2E33">
                    Preview
                </Typography>
            </Button>

        </>
    );
};