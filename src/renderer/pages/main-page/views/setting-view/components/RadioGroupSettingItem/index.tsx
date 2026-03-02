import "./index.scss";
import { IAppConfig } from "@/types/app-config";
import useAppConfig from "@/hooks/useAppConfig";
import AppConfig from "@shared/app-config/renderer";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Radio from "@mui/material/Radio";


interface IRadioGroupSettingItemProps<T extends keyof IAppConfig> {
    keyPath: T;
    label?: string;
    options: Array<IAppConfig[T]>
    renderItem?: (item: IAppConfig[T]) => string;
    direction?: "horizontal" | "vertical";
}

export default function RadioGroupSettingItem<T extends keyof IAppConfig>(
    props: IRadioGroupSettingItemProps<T>,
) {
    const {
        keyPath,
        label,
        options,
        direction = "horizontal",
        renderItem,
    } = props;

    const value = useAppConfig(keyPath);

    return (
        <div className="setting-view--radio-group-setting-item-container setting-row">
            <FormControl component="fieldset">
                <FormLabel component="legend" className="label-container" sx={{ color: "var(--textColor)", fontWeight: 600, fontSize: "1rem" }}>
                    {label}
                </FormLabel>
                <RadioGroup
                    row={direction === "horizontal"}
                    value={value || ""}
                    onChange={(event) => {
                        AppConfig.setConfig({
                            [keyPath]: event.target.value,
                        });
                    }}
                    className="options-container"
                >
                    {options.map((option, index) => {
                        const title = renderItem ? renderItem(option) : option as string;
                        return (
                            <FormControlLabel
                                key={index}
                                value={option}
                                control={
                                    <Radio
                                        sx={{
                                            color: "var(--primaryColor)",
                                            "&.Mui-checked": {
                                                color: "var(--primaryColor)",
                                            },
                                        }}
                                    />
                                }
                                label={title}
                                sx={{ "& .MuiFormControlLabel-label": { fontSize: "1.1rem", color: "var(--textColor)" } }}
                            />
                        );
                    })}
                </RadioGroup>
            </FormControl>
        </div>
    );
}
