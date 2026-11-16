// contexts & globals
import { useTranslation } from "react-i18next";
import { languages } from "../../../i18n";

// external dependencies
import { Box, Button } from "@mui/material";

export default function Language() {
  const { t, i18n } = useTranslation();

  const handleChange = (language: string) => {
    i18n.changeLanguage(language);
  };

  // const languages defined because i18n.languages has variable length when language changes!!!
  const languages = [
    'en',
    'de'
  ]

  function getLanguageButtons(languages: string[], currentLanguage: string) {
    return languages.map((language: string) => (<Button
      key={language}
      onClick={() => handleChange(language)}

      disableRipple
      sx={{
        px: 0,
        color: language === currentLanguage ? "black" : "white",
        minWidth: 0,
        mx: 1,
        fontSize: "22px",
        fontWeight: 700,
        textTransform: "uppercase",
        backgroundColor: "transparent",
        '&.MuiButton-root:hover': {
          backgroundColor: "transparent",
        },
      }}
    >
      {language.toUpperCase()}
    </Button>
    ));
  }

  return (<Box
    sx={{
      display: "flex",
      flexDirection: "row",
    }}
  >
    {getLanguageButtons(languages, i18n.language)}
  </Box>
  );
}
