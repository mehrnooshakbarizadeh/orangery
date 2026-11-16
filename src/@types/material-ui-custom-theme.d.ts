// external dependencies
import { Theme } from "@mui/material/styles";

declare module "@mui/material/styles" {
  interface DefaultTheme extends Theme { }
}

declare module "@mui/material/styles/createPalette" {
  interface Palette {
    tertiary: {
      main: React.CSSProperties["color"];
      dark: React.CSSProperties["color"];
      light: React.CSSProperties["color"];
      A100: React.CSSProperties["color"];
      A200: React.CSSProperties["color"];
      A400: React.CSSProperties["color"];
    };
  }
  interface PaletteOptions {
    tertiary: {
      main: React.CSSProperties["color"];
      dark: React.CSSProperties["color"];
      light: React.CSSProperties["color"];
      A100: React.CSSProperties["color"];
      A200: React.CSSProperties["color"];
      A400: React.CSSProperties["color"];
    };
  }
}
