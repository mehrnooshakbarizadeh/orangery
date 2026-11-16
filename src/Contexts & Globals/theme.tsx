// external dependencies
import { createTheme } from "@mui/material";

declare module "@mui/material/styles" {
  interface TypographyVariants {
    H4: React.CSSProperties;
    H6: React.CSSProperties;
    BUTTONTEXT: React.CSSProperties;
    CAPTION: React.CSSProperties;
    officeSelect: React.CSSProperties;
    profileSubtext: React.CSSProperties;
    googleButton: React.CSSProperties;
  }

  // allow configuration using `createTheme`
  interface TypographyVariantsOptions {
    H4?: React.CSSProperties;
    H6?: React.CSSProperties;
    BUTTONTEXT?: React.CSSProperties;
    CAPTION?: React.CSSProperties;
    officeSelect?: React.CSSProperties;
    profileSubtext?: React.CSSProperties;
    googleButton: React.CSSProperties;
  }
}

// Update the Typography's variant prop options
declare module "@mui/material/Typography" {
  interface TypographyPropsVariantOverrides {
    H4: true;
    H6: true;
    BUTTONTEXT: true;
    CAPTION: true;
    officeSelect: true;
    profileSubtext: true;
    googleButton: true;
  }
}

const theme = createTheme({
  palette: {
    primary: {
      main: "#2B2E33",
      light: "#55585C",
    },
    secondary: {
      main: "#FFBE41",
      dark: "#EAAD38",
      light: "#FFD27A",
    },
    grey: {
      "100": "#FAFBFC",
      "200": "#F5F7FA",
      A100: "#D7DBE1",
      A200: "#8794A6",
      A400: "#5F7089",
      A700: "#374C6B",
    },
    tertiary: {
      main: "#218377",
      dark: "#4D9C92",
      light: "#7AB5AD",
      A100: "#DDF9F3",
      A200: "#D3E6E4",
      A400: "#A6CDC9",
    },
    info: {
      main: "#09ACD0",
    },
    error: {
      main: "#FF9900",
    },
    success: {
      main: "#56CA29",
    },
    warning: {
      main: "#FF3D00",
    },
  },
  typography: {
    fontFamily: ["Assistant"].join(","),
    h1: {
      fontSize: 26,
      fontWeight: "700",
    },
    h2: {
      fontSize: 22,
      fontWeight: "700",
    },
    h3: {
      fontSize: 21,
      fontWeight: "600",
    },
    h4: {
      fontSize: 19,
      fontWeight: "700",
    },
    h5: {
      fontSize: 18,
      fontWeight: "600",
    },
    h6: {
      fontSize: 13,
      fontWeight: "600",
    },
    H4: {
      fontFamily: ["Assistant"].join(","),
      fontWeight: "700",
      fontSize: 24,
      lineHeight: "32px",
    },
    H6: {
      fontFamily: ["Assistant"].join(","),
      fontWeight: "700",
      fontSize: 16,
      lineHeight: "32px",
    },
    BUTTONTEXT: {
      fontFamily: ["Assistant"].join(","),
      fontWeight: "600",
      fontSize: 18,
      lineHeight: "25px",
    },
    CAPTION: {
      fontFamily: ["Assistant"].join(","),
      fontWeight: "400",
      fontSize: 12,
      lineHeight: "20px",
    },
    subtitle1: {
      fontSize: 19,
      fontWeight: 700,
      color: "#2B2E33",
    },
    subtitle2: {
      fontSize: 13,
      fontWeight: 600,
      // color: '#A5AAB4'
    },
    body1: {
      fontSize: 16,
      fontWeight: 600,
      // color: '#2B2E33'
    },
    caption: {
      fontSize: 13,
      fontWeight: 600,
      color: "#A5AAB4",
    },
    officeSelect: {
      fontSize: 19,
      fontWeight: 500,
      color: "#2B2E33",
      letterSpacing: 0,
    },
    profileSubtext: {
      fontWeight: 500,
      fontSize: 14,
      lineHeight: "20px",
      letterSpacing: 0,
    },
    googleButton: {
      fontFamily: ["Roboto"].join(","),
      fontWeight: "400",
      fontSize: 14,
      lineHeight: "20px",
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "unset",
        },
      },
    },
    // MuiSwitch: {
    //   styleOverrides: {
    //     track: {
    //       color: "#218377",
    //     },
    //   },
    // },
  },
});

export default theme;
