import AppConfig from "@shared/app-config/renderer";
import "./index.scss";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import { IAppConfig } from "@/types/app-config";
import useAppConfig from "@/hooks/useAppConfig";
import { dialogUtil, fsUtil, shellUtil } from "@shared/utils/renderer";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";

interface PathSettingItemProps<T extends keyof IAppConfig> {
    keyPath: T;
    label?: string;
}

export default function PathSettingItem<T extends keyof IAppConfig>(
    props: PathSettingItemProps<T>,
) {
    const { keyPath, label } = props;
    const value = useAppConfig(keyPath);
    const { t } = useTranslation();

    return (
        <Box className="setting-view--path-setting-item-container setting-row" sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
            <Typography variant="body1" className="label-container" sx={{ color: "var(--textColor)", fontWeight: 600 }}>
                {label}
            </Typography>
            <Box className="options-container" sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <Typography 
                    variant="body2" 
                    className="path-container" 
                    title={value as string}
                    sx={{
                        maxWidth: "60%",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        color: "var(--textColor)",
                        opacity: 0.8,
                    }}
                >
                    {value as string}
                </Typography>
                <Button
                    variant="contained"
                    size="small"
                    onClick={async () => {
                        const result = await dialogUtil.showOpenDialog({
                            title: t("settings.choose_path"),
                            defaultPath: value as string,
                            properties: ["openDirectory"],
                            buttonLabel: t("common.confirm"),
                        });
                        if (!result.canceled && result.filePaths.length > 0) {
                            AppConfig.setConfig({
                                [keyPath]: result.filePaths[0] as any,
                            });
                        }
                    }}
                >
                    {t("settings.change_path")}
                </Button>
                <Button
                    variant="outlined"
                    size="small"
                    onClick={async () => {
                        if (await fsUtil.isFolder(value as string)) {
                            shellUtil.openPath(value as string);
                        } else {
                            toast.error(t("settings.folder_not_exist"));
                        }
                    }}
                >
                    {t("settings.open_folder")}
                </Button>
            </Box>
        </Box>
    );
}
