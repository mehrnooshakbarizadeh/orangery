// react & next
import { useState } from "react";

// external dependencies
import {
  Box,
  IconButton,
  Dialog,
  DialogContent,
  Typography,
  Grid
} from "@mui/material";

// orangery elements & internal dependencies
import { OrangeryCloseButton } from "../OrangeryElements"

// queries & backend
//

// icons, images & colors
import ListCheckedIcon from "../../assets/svg/list-checked.svg";

export default function OrangeryDataOverviewButton({
  data,
  codeStyle,
  disabled,
  color,
  title,
  height,
  width,
}: {
  data: any;
  codeStyle?: boolean;
  disabled?: boolean;
  color?: string;
  title?: string;
  height?: string | number;
  width?: string | number;
}) {
  const [open, setOpen] = useState(false);
  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <IconButton
        onClick={() => handleOpen()}
        disabled={disabled}
        sx={{
          "& > *:first-of-type": { mx: 0 },
          "& .icon": {
            width: "1.3rem",
            height: "1.3rem",
            color: color ?? "primary.main",
          },
          "& .MuiButton-root": { minWidth: 40 },
        }}
      >
        <ListCheckedIcon className="icon" />
      </IconButton>
      <Dialog
        open={open}
        onClose={handleClose}
        sx={{
          "& .MuiPaper-root": {
            maxWidth: width ? width : 900,  ////////!!!!!!!!
            width: width ?? 900,
            height: {
              xs: "none",
              sm: height ?? 720,
            },
          },
        }}
      >
        <DialogContent
          sx={{
            p: 0,
          }}
        >
          {open &&
            <DataOverviewContent title={title} data={data} handleClose={handleClose} codeStyle={codeStyle} />
          }
        </DialogContent>
      </Dialog>
    </>
  );
}

function DataOverviewContent({
  data,
  handleClose,
  codeStyle,
  title
}: {
  data: any;
  handleClose: () => void;
  codeStyle?: boolean;
  title?: string;
}) {

  var library = {} as any;
  library.json = {
    replacer: function (match: any, pIndent: any, pKey: any, pVal: any, pEnd: any) {
      var key = '<span class=json-key>';
      var val = '<span class=json-value>';
      var str = '<span class=json-string>';
      var r = pIndent || '';
      if (pKey)
        r = r + key + pKey.replace(/[": ]/g, '') + '</span>: ';
      if (pVal)
        r = r + (pVal[0] == '"' ? str : val) + pVal + '</span>';
      return r + (pEnd || '');
    },
    prettyPrint: function (obj: any) {
      var jsonLine = /^( *)("[\w]+": )?("[^"]*"|[\w.+-]*)?([,[{])?$/mg;
      return JSON.stringify(obj, null, 3)
        .replace(/&/g, '&amp;').replace(/\\"/g, '&quot;')
        .replace(/</g, '&lt;').replace(/>/g, '&gt;')
        .replace(jsonLine, library.json.replacer);
    }
  };

  return <Box
    sx={{
      height: "100%",
      overflowY: "hidden",
    }}
  >
    <Box
      sx={{
        pr: 3,
        pl: 4,
        py: codeStyle ? 1.8 : 2.5,
        // pb: 1,
        // pt: 2.5,
        mb: codeStyle ? 2.5 : 0,
        display: "flex",
        justifyContent: "start",
        alignItems: "center",
        borderBottom: (theme) => `1px solid #EDEEF0`,
      }}
    >
      <Typography
        sx={{
          fontSize: 24,
          fontWeight: 600,
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
          maxWidth: "80%",
          color: "#2B2E33"
        }}
      >
        {title ?? "Data"}
      </Typography>
      <OrangeryCloseButton onClose={handleClose} noAbsolute />
    </Box>
    <Box
      sx={{
        backgroundColor: codeStyle ? "#1e1e1e" : "white", // VS: "#1e1e1e" // {react: "#282c34", // grren: #8dc891 strings // cyan: #88c6be punctuations // red: #fc929e}
        pl: codeStyle ? 2 : 1,
        pr: codeStyle ? 0 : 1,
        ml: 2,
        mr: codeStyle ? 2 : 1.5,
        py: codeStyle ? 2 : 0,
        my: codeStyle ? 0 : 1,
        position: "relative",
        borderRadius: 1,
        height: codeStyle ? "calc(100% - 100px)" : "calc(100% - 110px)",
        overflowY: "auto",
        "&::-webkit-scrollbar": {
          width: "0.4em",
        },
        "&::-webkit-scrollbar-track": {
          marginLeft: "20px",
        },
        "&::-webkit-scrollbar-thumb": {
          backgroundColor: codeStyle ? "rgba(255,255,255,.7)" : "rgba(0,0,0,.1)",
          borderRadius: 5,
        },
      }}
    >
      {codeStyle
        ? <Typography
          sx={{
            wordBreak: "break-all",
            color: "lightgray",
            "& .json-key": {
              color: "#a5c25c"
            },
            "& .json-value": {
              color: "#6897bb"
            },
            "& .json-string": {
              color: "#cc7832"
            }
          }}
        >
          <pre
            style={{
              margin: 0
            }}
            dangerouslySetInnerHTML={{
              __html: library.json.prettyPrint(data)
            }}
          />
          {/* {JSON.stringify(JSON.parse(JSON.stringify(data)), null, 2)} */}
        </Typography>
        : Object.entries(data).map((entry: [string, any]) => (
          <DataCard
            key={entry[0]}
            entry={entry}
          />
        ))
      }
    </Box>
  </Box >
}

function DataCard({ entry }: { entry: [string, any] }) {
  return <Grid
    container
    sx={{
      display: "flex",
      justifyContent: "start",
      width: "100%",
      py: 2,
      px: 2,
      // boxShadow: "1px 1px 8px #0000000a",
      // border: "1px solid rgb(210 215 221)",
      backgroundColor: "#F9F9FA",
      alignItems: "center",
      borderRadius: 1.5,
      mb: 1,
      mx: 0,
      // gap: 1,
    }}
  >
    <Grid
      xs={7}
      sm={7}
      md={7}
      item
      sx={{
        display: "flex",
        // alignItems: "center",
        gap: 1,
        flexDirection: "row",
        pr: 1
      }}
    >
      <Typography
        variant="h4"
        sx={{
          wordBreak: "break-all",
          pr: 1,
        }}
      >
        {entry?.[0]}
      </Typography>
    </Grid>
    <Grid
      xs={5}
      sm={5}
      md={5}
      item
      sx={{
        display: "flex",
        // alignItems: "center",
        gap: 1,
        flexDirection: "column",
      }}
    >
      {entry?.[1] && entry?.[1] instanceof Object
        ? Object.entries(entry?.[1]).map((childEntry: [string, any]) => (
          <DataCard
            key={entry?.[0] + "-" + childEntry[0]}
            entry={childEntry}
          />
        ))
        : <Typography
          variant="h4"
          sx={{
            wordBreak: "break-all"
          }}
        >
          {entry?.[1]?.toString() ?? "-"}
        </Typography>
      }
    </Grid>
  </Grid>
}