import { createTheme } from "@mui/material/styles";

const theme = createTheme({
    palette: {
        primary: {
            main: "#f17d34",
        },
        // Remove background and text from here, as MUI tries to calculate contrast on them
        // using colorManipulator, which throws error on "var(--xxx)"
    },
    components: {
        MuiCssBaseline: {
            styleOverrides: {
                body: {
                    backgroundColor: "var(--backgroundColor)",
                    color: "var(--textColor)",
                },
            },
        },
        MuiTypography: {
            styleOverrides: {
                root: {
                    color: "var(--textColor)",
                },
            },
        },
        MuiDivider: {
            styleOverrides: {
                root: {
                    borderColor: "var(--dividerColor)",
                },
            },
        },
        MuiButton: {
            styleOverrides: {
                root: {
                    textTransform: "none",
                },
            },
        },
        MuiTab: {
            styleOverrides: {
                root: {
                    color: "var(--textColor)",
                    "&.Mui-selected": {
                        color: "var(--primaryColor)",
                    },
                },
            },
        },
        MuiTabs: {
            styleOverrides: {
                indicator: {
                    backgroundColor: "var(--primaryColor)",
                },
            },
        },
    },
});

export default theme;
