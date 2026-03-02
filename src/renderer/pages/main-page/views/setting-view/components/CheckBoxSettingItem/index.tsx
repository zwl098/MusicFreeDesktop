import { IAppConfig } from "@/types/app-config";
import useAppConfig from "@/hooks/useAppConfig";
import AppConfig from "@shared/app-config/renderer";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";

interface ICheckBoxSettingItemProps<T extends keyof IAppConfig> {
    keyPath: T;
    label?: string;
    onChange?: (event: Event, checked: boolean) => void;
}

export default function CheckBoxSettingItem<T extends keyof IAppConfig>(
    props: ICheckBoxSettingItemProps<T>,
) {
    const { keyPath, label, onChange } = props;

    const checked = useAppConfig(keyPath);

    return (
        <div className="setting-row">
            <FormControlLabel
                control={
                    <Checkbox
                        checked={Boolean(checked)}
                        sx={{
                            color: "var(--primaryColor)",
                            "&.Mui-checked": {
                                color: "var(--primaryColor)",
                            },
                        }}
                        onChange={(e, newChecked) => {
                            const event = new Event("ConfigChanged", {
                                cancelable: true,
                            });
                            if (onChange) {
                                onChange(event, newChecked);
                            }
                            if (!event.defaultPrevented) {
                                AppConfig.setConfig({
                                    [keyPath]: newChecked,
                                });
                            }
                        }}
                    />
                }
                label={label}
                sx={{ ml: 0, "& .MuiFormControlLabel-label": { fontSize: "1.1rem", color: "var(--textColor)", pl: 0.5 } }}
            />
        </div>
    );
}
