import AppHeader from "./components/Header";

import "./app.scss";
import MusicBar from "./components/MusicBar";
import { Outlet } from "react-router";
import PanelComponent from "./components/Panel";
import MusicDetail from "@renderer/components/MusicDetail";

import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import theme from "./theme";

export default function App() {
    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <div className="app-container">
                <AppHeader></AppHeader>
                <div className="body-container">
                    <Outlet></Outlet>
                    <PanelComponent></PanelComponent>
                </div>
                <MusicDetail></MusicDetail>
                <MusicBar></MusicBar>
            </div>
        </ThemeProvider>
    );
}
