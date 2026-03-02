import { useEffect, useState } from "react";
import Base from "../Base";
import "./index.scss";
import SvgAsset from "@/renderer/components/SvgAsset";
import useSearchLyric from "./hooks/useSearchLyric";
import searchResultStore from "./hooks/searchResultStore";
import { Tab } from "@headlessui/react";
import SearchResult from "./searchResult";
import { useTranslation } from "react-i18next";
import PluginManager from "@shared/plugin-manager/renderer";
import InputBase from "@mui/material/InputBase";
import IconButton from "@mui/material/IconButton";

interface IProps {
    defaultTitle?: string;
    musicItem?: IMusic.IMusicItem;
    defaultExtra?: boolean;
}

export default function SearchLyric(props: IProps) {
    const { defaultTitle, musicItem } = props;

    const [inputSearch, setInputSearch] = useState(defaultTitle ?? "");

    const searchLyric = useSearchLyric();
    const searchResults = searchResultStore.useValue();
    const { t } = useTranslation();

    const availablePlugins = PluginManager.getSearchablePlugins("lyric");

    useEffect(() => {
        if (inputSearch) {
            searchLyric(inputSearch);
        }
    }, []);

    return (
        <Base defaultClose withBlur={false}>
            <div className="modal--search-lyric-container shadow backdrop-color">
                <Base.Header>
                    <div className="search-lyric-input-container">
                        <InputBase
                            className="search-lyric-input"
                            placeholder={t("modal.search_lyric")}
                            value={inputSearch}
                            onChange={(evt) => {
                                setInputSearch(evt.target.value);
                            }}
                            onKeyDown={(key) => {
                                if (key.key === "Enter") {
                                    searchLyric(inputSearch);
                                }
                            }}
                            fullWidth
                            endAdornment={
                                <IconButton
                                    className="search-lyric-search-btn"
                                    onClick={() => {
                                        searchLyric(inputSearch);
                                    }}
                                    size="small"
                                >
                                    <SvgAsset iconName="magnifying-glass"></SvgAsset>
                                </IconButton>
                            }
                        />
                    </div>
                </Base.Header>
                <Tab.Group>
                    <Tab.List className="tab-list-container">
                        {availablePlugins.map((plugin) => (
                            <Tab key={plugin.hash} as="div" className="tab-list-item">
                                {plugin.platform}
                            </Tab>
                        ))}
                    </Tab.List>
                    <Tab.Panels className={"tab-panels-container"}>
                        {availablePlugins.map((plugin) => (
                            <Tab.Panel className="tab-panel-container" key={plugin.hash}>
                                <SearchResult
                                    data={searchResults.data[plugin.hash]}
                                    musicItem={musicItem}
                                ></SearchResult>
                            </Tab.Panel>
                        ))}
                    </Tab.Panels>
                </Tab.Group>
            </div>
        </Base>
    );
}
