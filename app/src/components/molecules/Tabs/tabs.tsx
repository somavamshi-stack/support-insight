import { barlow } from "../../../assets/fonts/barlow";
import { useRef, useEffect, useState } from "react";

export const Tabs = ({ data, activeTab, setActiveTab }) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [sliderStyle, setSliderStyle] = useState({});

    useEffect(() => {
        const index = data.findIndex(([value]) => value === activeTab);
        const container = containerRef.current;
        if (!container) return;

        const button = container.children[index];
        if (button && button instanceof HTMLElement) {
            const { offsetLeft, offsetWidth } = button;
            setSliderStyle({
                left: offsetLeft,
                width: offsetWidth
            });
        }
    }, [activeTab, data]);

    return (
        <div className="relative mb-2 inline-block rounded bg-[#F4F4F5] p-[5px]">
            {/* Sliding Background */}
            <div
                className="absolute top-[5px] left-0 z-0 ml-1 h-[calc(100%-10px)] rounded bg-[#343434] transition-all duration-300"
                style={{ ...sliderStyle }}
            />

            {/* Buttons */}
            <div ref={containerRef} className="relative z-10 inline-flex">
                {data.map(([value, label], i) => (
                    <button
                        key={value + i}
                        onClick={() => setActiveTab(value)}
                        className={`${barlow.className} text-medium cursor-pointer rounded-none px-4 py-2 text-xs font-medium transition-all duration-200 ${
                            activeTab === value ? "text-white" : "text-black"
                        }`}
                    >
                        {label.toUpperCase()}
                    </button>
                ))}
            </div>
        </div>
    );
};
