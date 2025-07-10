import React, { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { IoChevronDown } from "react-icons/io5";

interface SmoothDropdownProps {
    label?: string;
    options: { label: string; value: string }[];
    onSelect: (option: { label: string; value: string }) => void;
    selected?: string;
}

export const SmoothDropdown: React.FC<SmoothDropdownProps> = ({ label = "Select", options, onSelect, selected }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Close on outside click
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className="relative inline-block w-full text-left" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="border-color-300 hover:border-color-400 focus:ring-color-500 flex w-full items-center justify-between rounded-lg border bg-white px-4 py-2 shadow-sm transition focus:ring-2 focus:outline-none"
            >
                <span className="text-color-700">{selected || label}</span>
                <IoChevronDown className={`transition-transform ${isOpen ? "rotate-180" : ""}`} />
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        className="ring-opacity-5 absolute z-10 w-full rounded-lg bg-white shadow-lg ring-1 ring-black"
                        initial={{ opacity: 0, scale: 0.95, y: -10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: -10 }}
                        transition={{ duration: 0.2, ease: "easeOut" }}
                    >
                        <ul className="py-2">
                            {options.map((option) => (
                                <li
                                    key={option.value}
                                    onClick={() => {
                                        onSelect(option);
                                        setIsOpen(false);
                                    }}
                                    className="text-color-700 hover:bg-color-100 cursor-pointer px-4 py-2 text-sm transition"
                                >
                                    {option.label}
                                </li>
                            ))}
                        </ul>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
