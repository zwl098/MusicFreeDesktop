import "./index.scss";
import Condition, { IfTruthy } from "@/renderer/components/Condition";
import { isBasicType } from "@/common/normalize-util";
import { ReactNode } from "react";
import SvgAsset from "@/renderer/components/SvgAsset";
import { Tooltip } from "react-tooltip";
import { IAppConfig } from "@/types/app-config";
import useAppConfig from "@/hooks/useAppConfig";
import AppConfig from "@shared/app-config/renderer";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Box from "@mui/material/Box";

interface ListBoxSettingItemProps<T extends keyof IAppConfig> {
    keyPath: T;
    label?: string;
    options: Array<IAppConfig[T]> | null;
    onChange?: (event: Event, newConfig: IAppConfig[T]) => void;
    renderItem?: (item: IAppConfig[T]) => ReactNode;
    width?: number | string;
    toolTip?: string;
}

export default function ListBoxSettingItem<T extends keyof IAppConfig>(
    props: ListBoxSettingItemProps<T>,
) {

    const {
        keyPath,
        label,
        options,
        onChange,
        renderItem,
        width,
        toolTip,
    } = props;

    const value = useAppConfig(keyPath);

    return (
        <div className="setting-view--list-box-setting-item-container setting-row">
            <IfTruthy condition={toolTip}>
                <Tooltip id={`tt-${keyPath}`}></Tooltip>
            </IfTruthy>
            <Box sx={{ display: "flex", alignItems: "center", width: "100%" }}>
                <div className="label-container" style={{ marginRight: "16px", display: "flex", alignItems: "center" }}>
                    {label}
                    <IfTruthy condition={toolTip}>
                        <div
                            className="question-mark-container"
                            data-tooltip-id={`tt-${keyPath}`}
                            data-tooltip-content={toolTip}
                            style={{ marginLeft: "4px" }}
                        >
                            <SvgAsset iconName="question-mark-circle"></SvgAsset>
                        </div>
                    </IfTruthy>
                </div>
                
                <FormControl size="small" sx={{ minWidth: width || 200, flex: 1, maxWidth: width }}>
                    <Select
                        value={value ?? ""}
                        onChange={(event) => {
                            const newVal = event.target.value;
                            const customEvent = new Event("ConfigChanged", {
                                cancelable: true,
                            });
                            if (onChange) {
                                onChange(customEvent, newVal as any);
                            }
                            if (!customEvent.defaultPrevented) {
                                AppConfig.setConfig({
                                    [keyPath]: newVal,
                                });
                            }
                        }}
                        displayEmpty
                        renderValue={(selected) => {
                            if (!selected) {
                                return <em>请选择</em>;
                            }
                            return <>{renderItem ? renderItem(selected as any) : (isBasicType(selected) ? (selected as string) : "")}</>;
                        }}
                    >
                        {options?.map((option, index) => (
                            <MenuItem key={index} value={option as any}>
                                {renderItem
                                    ? renderItem(option)
                                    : isBasicType(option)
                                        ? (option as string)
                                        : ""}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </Box>
        </div>
    );
}
