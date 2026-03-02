import "./index.scss";
import { IAppConfig } from "@/types/app-config";
import useAppConfig from "@/hooks/useAppConfig";
import AppConfig from "@shared/app-config/renderer";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";

type ExtractArrayItem<T> = T extends Array<infer R> ? R : never;

interface IRadioGroupSettingItemProps<T extends keyof IAppConfig> {
    keyPath: T;
    label?: string;
    options: IAppConfig[T];
    renderItem?: (item: ExtractArrayItem<IAppConfig[T]>) => string;
    direction?: "horizontal" | "vertical";
}

/**
 * 多选
 * @param props
 * @constructor
 */
export default function MultiRadioGroupSettingItem<T extends keyof IAppConfig>(
    props: IRadioGroupSettingItemProps<T>,
) {
    const {
        keyPath,
        label,
        options,
        renderItem,
        direction = "horizontal",
    } = props;
    const value = useAppConfig(keyPath);


    return (
        <div className="setting-view--radio-group-setting-item-container setting-row">
            <FormControl component="fieldset">
                <FormLabel component="legend" className="label-container" sx={{ color: "var(--textColor)", fontWeight: 600, fontSize: "1rem" }}>
                    {label}
                </FormLabel>
                <FormGroup
                    row={direction === "horizontal"}
                    className="options-container"
                    sx={{ mt: 1 }}
                >
                    {(options as any[]).map((option, index) => {
                        const checked = (value as Array<any>)?.includes(option);
                        const title = renderItem ? renderItem(option) : (option as string);

                        return (
                            <FormControlLabel
                                key={index}
                                control={
                                    <Checkbox
                                        checked={Boolean(checked)}
                                        sx={{
                                            color: "var(--primaryColor)",
                                            "&.Mui-checked": {
                                                color: "var(--primaryColor)",
                                            },
                                        }}
                                        onChange={(e, isChecked) => {
                                            let newValue = [];
                                            if (!isChecked) {
                                                newValue = (value as Array<any>)?.filter(
                                                    (it) => it !== option,
                                                ) ?? [];
                                            } else {
                                                newValue = [...(value as Array<any> || []), option];
                                            }
                                            AppConfig.setConfig({
                                                [keyPath]: newValue,
                                            });
                                        }}
                                    />
                                }
                                label={title}
                                sx={{ "& .MuiFormControlLabel-label": { fontSize: "1.1rem", color: "var(--textColor)" } }}
                            />
                        );
                    })}
                </FormGroup>
            </FormControl>
        </div>
    );
}
