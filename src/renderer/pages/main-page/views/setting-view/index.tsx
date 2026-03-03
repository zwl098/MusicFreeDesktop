import "./index.scss";
import routers from "./routers";
import { useEffect, useRef, useState } from "react";
import Condition from "@/renderer/components/Condition";
import { useTranslation } from "react-i18next";
import camelToSnake from "@/common/camel-to-snake";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

export default function SettingView() {
    const [selected, setSelected] = useState(routers[0].id);
    const { t } = useTranslation();

    const intersectionObserverRef = useRef<IntersectionObserver>();
    const bodyContainerRef = useRef<HTMLDivElement>();
    const intersectionRatioRef = useRef<Map<string, number>>(new Map());

    const isProgrammaticScroll = useRef(false);
    const scrollTimeoutRef = useRef<NodeJS.Timeout>();

    useEffect(() => {
        intersectionObserverRef.current = new IntersectionObserver(
            (targets) => {
                if (isProgrammaticScroll.current) return;
                
                const ratio = intersectionRatioRef.current;
                targets.forEach((target) => {
                    ratio.set(target.target.id, target.intersectionRatio);
                });
                let maxVal = 0;
                let maxId;
                for (const entry of ratio.entries()) {
                    if (entry[1] > maxVal) {
                        maxId = entry[0];
                        maxVal = entry[1];
                    }
                }
                if (maxId) {
                    setSelected(maxId.slice(8));
                }
            },
            {
                root: bodyContainerRef.current,
                threshold: [0, 0.2, 0.8, 1],
            },
        );

        for (const setting of routers) {
            const target = document.getElementById(`setting-${setting.id}`);
            if (target) {
                intersectionObserverRef.current.observe(target);
            }
        }
        return () => {
            document
                .getElementById("page-container")
                ?.classList?.remove("page-container-full-width");

            if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
            intersectionObserverRef.current?.disconnect();
            intersectionObserverRef.current = null;
            intersectionRatioRef.current?.clear();
            intersectionRatioRef.current = null;
        };
    }, []);

    return (
        <Box
            id="page-container"
            className="page-container-fw setting-view--container"
            sx={{ display: "flex", flexDirection: "column", height: "100%", width: "100%" }}
        >
            <Box className="setting-view--header" sx={{ borderBottom: 1, borderColor: "divider"  }}>
                <Tabs
                    value={selected}
                    onChange={(event, newValue) => {
                        setSelected(newValue);
                        isProgrammaticScroll.current = true;
                        if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
                        
                        document.getElementById(`setting-${newValue}`)?.scrollIntoView({
                            behavior: "smooth",
                        });
                        
                        // 预估滚动动画需要大约 600ms 完成
                        scrollTimeoutRef.current = setTimeout(() => {
                            isProgrammaticScroll.current = false;
                        }, 800);
                    }}
                    variant="scrollable"
                    scrollButtons={false}
                    aria-label="setting tabs"
                >
                    {routers.map((setting) => (
                        <Tab
                            key={setting.id}
                            value={setting.id}
                            label={t(`settings.section_name.${camelToSnake(setting.id)}`)}
                            sx={{ textTransform: "none", fontWeight: 600, fontSize: "1rem" }}
                        />
                    ))}
                </Tabs>
            </Box>
            <Box className="setting-view--body" ref={bodyContainerRef} sx={{ flex: 1, overflowY: "auto", px: 3, pt: 2, pb: 4 }}>
                {routers.map((setting, index) => {
                    const Component = setting.component as any;

                    return (
                        <Box
                            className="setting-view--body-item-container"
                            id={`setting-${setting.id}`}
                            key={setting.id}
                            sx={{ width: "100%", mb: index !== routers.length - 1 ? 4 : 0 }}
                        >
                            <Typography variant="h6" className="setting-view--body-title" sx={{ fontWeight: 600, mb: 2 }}>
                                {t(`settings.section_name.${camelToSnake(setting.id)}`)}
                            </Typography>
                            <Component />
                            <Condition condition={index !== routers.length - 1}>
                                <div className="divider" style={{ marginTop: "24px" }}></div>
                            </Condition>
                        </Box>
                    );
                })}
            </Box>
        </Box>
    );
}
