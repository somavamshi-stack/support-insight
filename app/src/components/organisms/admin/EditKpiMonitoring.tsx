import React, { useState, useEffect } from "react";
import { X, Clock } from "lucide-react";
import Image from "next/image";

import monitoringConfigCrone from "@assets/img/monitoringConfigCrone.svg";
import timerReset from "@assets/img/timer-reset.svg";
import { getCronDescription } from "@utils";
import timer from "@assets/img/timer.svg";

interface InitialData {
    schedule_cron?: string;
    is_active: boolean;
}

interface CronJobProps {
    onClose?: () => void;
    onSave?: (config: InitialData) => void;
    initialData?: InitialData | null;
}

interface CronConfig {
    isActive: boolean;
    minute: string;
    hour: string;
    day: string;
    month: string;
    dayOfWeek: string;
    schedule_cron: string;
    is_active: boolean;
}

const EditKpiMonitoring: React.FC<CronJobProps> = ({ onClose, onSave, initialData = null }) => {
    const [config, setConfig] = useState<CronConfig>({
        isActive: true,
        minute: "00",
        hour: "00:00",
        day: "Everyday",
        month: "Every Month",
        dayOfWeek: "Everyday",
        schedule_cron: "",
        is_active: true
    });

    const minuteOptions = Array.from({ length: 60 }, (_, i) => i.toString().padStart(2, "0"));
    const hourOptions = Array.from({ length: 24 }, (_, i) => `${i.toString().padStart(2, "0")}:00`);
    const dayOptions = ["Everyday", ...Array.from({ length: 31 }, (_, i) => (i + 1).toString())];
    const monthOptions = [
        "Every Month",
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December"
    ];
    const dayOfWeekOptions = ["Everyday", "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

    // Parse cron expression to UI values
    const parseCronExpression = (cronExpression: string) => {
        if (!cronExpression || cronExpression.trim() === "") return;

        const parts = cronExpression.trim().split(/\s+/);
        if (parts.length !== 5) return;

        const [minute, hour, day, month, dayOfWeek] = parts;

        setConfig((prev) => ({
            ...prev,
            minute: minute === "*" ? "00" : minute.padStart(2, "0"),
            hour: hour === "*" ? "00:00" : `${hour.padStart(2, "0")}:00`,
            day: day === "*" ? "Everyday" : day,
            month: month === "*" ? "Every Month" : monthOptions[parseInt(month)] || "Every Month",
            dayOfWeek: dayOfWeek === "*" ? "Everyday" : dayOfWeekOptions[parseInt(dayOfWeek) + 1] || "Everyday"
        }));
    };

    // Initialize with initial data
    useEffect(() => {
        if (initialData) {
            setConfig((prev) => ({
                ...prev,
                isActive: initialData.is_active,
                is_active: initialData.is_active
            }));

            if (initialData.schedule_cron) {
                parseCronExpression(initialData.schedule_cron);
            }
        }
    }, [initialData]);

    const generateCronExpression = () => {
        const minute = config.minute;
        const hour = config.hour.split(":")[0];
        const day = config.day === "Everyday" ? "*" : config.day;
        const month = config.month === "Every Month" ? "*" : monthOptions.indexOf(config.month).toString();
        const dayOfWeek = config.dayOfWeek === "Everyday" ? "*" : (dayOfWeekOptions.indexOf(config.dayOfWeek) - 1).toString();

        return `${minute} ${hour} ${day} ${month} ${dayOfWeek}`;
    };

    const cronExpression = generateCronExpression();

    const updateConfig = (updates: Partial<CronConfig>) => {
        setConfig((prev) => {
            const newConfig = { ...prev, ...updates };
            // Keep both isActive and is_active in sync
            if ("isActive" in updates) {
                newConfig.is_active = updates.isActive!;
            }
            return newConfig;
        });
    };

    const handleSave = () => {
        const cronExpression = generateCronExpression();
        const finalConfig = {
            schedule_cron: cronExpression,
            is_active: config.isActive
        };
        onSave?.(finalConfig);
    };

    return (
        <div className="bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center bg-transparent p-4">
            <div className="w-full max-w-2xl rounded-lg bg-white shadow-xl">
                <div className="flex items-center justify-between border-b border-gray-200 p-4">
                    <div className="flex items-center gap-2">
                        <Image src={monitoringConfigCrone} width={32} height={32} alt="crone" />
                        <h2 className="text-xl font-semibold text-gray-800">KPI Monitoring Configuration</h2>
                    </div>

                    <button onClick={onClose} className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-md bg-[#AE3020]">
                        <X className="text-white" />
                    </button>
                </div>

                <div className="space-y-6 p-6">
                    {/* Status Toggle */}
                    <div className="flex items-center justify-between border-b border-gray-200 pb-3">
                        <div className="flex items-center gap-1">
                            <Image src={timer} width={18} height={18} alt="timer" />
                            <p className="text-base font-medium text-black">Config Job Status</p>
                        </div>

                        <div className="flex items-center gap-2">
                            <label className="relative inline-flex cursor-pointer items-center">
                                <input
                                    type="checkbox"
                                    checked={config.isActive}
                                    onChange={(e) => updateConfig({ isActive: e.target.checked })}
                                    className="sr-only"
                                />
                                <div className={`h-5 w-9 rounded-full transition-colors ${config.isActive ? "bg-[#8A966E]" : "bg-[#AE3020]"}`}>
                                    <div
                                        className={`h-4 w-4 transform rounded-xl bg-white shadow-md transition-transform ${
                                            config.isActive ? "translate-x-4" : "translate-x-0"
                                        } mt-0.5 ml-0.5`}
                                    />
                                </div>
                            </label>
                            <span className="bg-[#E4E4E4] p-[0.1875rem] text-xs font-light text-black italic">
                                ({config.isActive ? "Active" : "Inactive"})
                            </span>
                        </div>
                    </div>

                    {/* Schedule Configuration */}
                    <div>
                        <div className="mb-4 flex items-center gap-2 text-sm font-medium text-gray-700">
                            <Image src={timerReset} width={18} height={18} alt="timerReset" />
                            <p className="text-base font-medium text-black">Config Schedule Configuration</p>
                        </div>

                        <div className="grid grid-cols-5 gap-4">
                            {/* Minute */}
                            <div>
                                <label className="mb-1 block text-xs font-medium text-gray-600">Minute</label>
                                <select
                                    value={config.minute}
                                    onChange={(e) => updateConfig({ minute: e.target.value })}
                                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-transparent focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                >
                                    {minuteOptions.map((minute) => (
                                        <option key={minute} value={minute}>
                                            {minute}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Hour */}
                            <div>
                                <label className="mb-1 block text-xs font-medium text-gray-600">Hour</label>
                                <select
                                    value={config.hour}
                                    onChange={(e) => updateConfig({ hour: e.target.value })}
                                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-transparent focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                >
                                    {hourOptions.map((hour) => (
                                        <option key={hour} value={hour}>
                                            {hour}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Day */}
                            <div>
                                <label className="mb-1 block text-xs font-medium text-gray-600">Day</label>
                                <select
                                    value={config.day}
                                    onChange={(e) => updateConfig({ day: e.target.value })}
                                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-transparent focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                >
                                    {dayOptions.map((day) => (
                                        <option key={day} value={day}>
                                            {day}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Month */}
                            <div>
                                <label className="mb-1 block text-xs font-medium text-gray-600">Month</label>
                                <select
                                    value={config.month}
                                    onChange={(e) => updateConfig({ month: e.target.value })}
                                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-transparent focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                >
                                    {monthOptions.map((month) => (
                                        <option key={month} value={month}>
                                            {month}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Day of the week */}
                            <div>
                                <label className="mb-1 block text-xs font-medium text-gray-600">Day of the week</label>
                                <select
                                    value={config.dayOfWeek}
                                    onChange={(e) => updateConfig({ dayOfWeek: e.target.value })}
                                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-transparent focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                >
                                    {dayOfWeekOptions.map((day) => (
                                        <option key={day} value={day}>
                                            {day}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Schedule Description */}
                    <div>
                        <label className="mb-2 block text-xs font-medium text-gray-600">Schedule Description</label>
                        <div className="rounded-lg border bg-gray-50 p-3">
                            <p className="text-sm text-gray-700">{getCronDescription(cronExpression)}</p>
                        </div>
                    </div>

                    {/* Cron Expression */}
                    <div>
                        <label className="mb-2 block text-xs font-medium text-gray-600">
                            Cron Expression: <span className="font-mono text-xs">{cronExpression}</span>
                        </label>
                    </div>
                </div>

                {/* Footer */}
                <div className="flex justify-center border-t border-gray-200 p-4">
                    <button
                        onClick={handleSave}
                        className="cursor-pointer rounded-md bg-gray-800 px-6 py-2 text-sm font-medium text-white transition-colors hover:bg-gray-700"
                    >
                        Save Configuration
                    </button>
                </div>
            </div>
        </div>
    );
};

export default EditKpiMonitoring;
