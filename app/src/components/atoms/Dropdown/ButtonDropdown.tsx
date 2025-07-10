import React, { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

interface ButtonDropdownProps {
    label: string;
    options: string[];
    onSelect: (option: string) => void;
    selected?: string;
    isOpenOptions?: boolean;
    buttonClassName?: string;
}

export const ButtonDropdown: React.FC<ButtonDropdownProps> = ({ label, options, onSelect, selected, isOpenOptions = true, buttonClassName = "" }) => {
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
        <div className="relative inline-block text-left" ref={dropdownRef}>
            <button
                onClick={isOpenOptions ? () => setIsOpen(!isOpen) : undefined}
                className={`flex items-center justify-between rounded-lg px-4 py-2 shadow-sm transition focus:outline-none ${buttonClassName}`}
            >
                <span>{selected || label}</span>
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        className="ring-opacity-3 absolute z-50 mt-1 w-full rounded-lg bg-white shadow-lg ring-1 ring-black"
                        initial={{ opacity: 0, scale: 0.95, y: -10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: -10 }}
                        transition={{ duration: 0.2, ease: "easeOut" }}
                    >
                        <ul className="py-2">
                            {options.map((option) => (
                                <li
                                    key={option}
                                    onClick={() => {
                                        onSelect(option);
                                        setIsOpen(false);
                                    }}
                                    className="hover:bg-color-100 cursor-pointer px-4 py-2 text-sm text-gray-700 transition"
                                >
                                    {option}
                                </li>
                            ))}
                        </ul>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
