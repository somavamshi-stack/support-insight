import Snowflake from "../../../assets/img/Popup-icons/Snowflake.svg";
import BigQuerry from "../../../assets/img/Popup-icons/Bigquerry.svg";
import DataIcon from "../../../assets/img/Popup-icons/Data-icon.svg";
import Mysql from "../../../assets/img/Popup-icons/Mysql.svg";
import { barlow } from "../../../assets/fonts/barlow";
import Image from "next/image";
import React from "react";

interface DsmPopupProps {
    isOpen: boolean;
    onClose: () => void;
    children?: React.ReactNode;
}

export const DsmPopup: React.FC<DsmPopupProps> = ({ isOpen, onClose }) => {
    if (!isOpen) return null;
    return (
        <>
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-[2px]">
                <div className="relative mx-4 h-[60vh] w-[40vw] overflow-y-auto rounded-lg bg-white shadow-xl scrollbar-thin">
                    <div className="relative flex h-[7vh] w-full items-center border-b border-[#e4e4e4] pl-3 text-[20px]">
                        <div className="flex items-center gap-2">
                            <Image src={DataIcon} alt="Data Icon" />
                            <h1 className={`${barlow.className} font-semibold text-black`}>Add Data Source</h1>
                        </div>
                        <button
                            onClick={onClose}
                            className="absolute right-3 flex h-8 w-8 items-center justify-center rounded-lg bg-[#AE3020] text-white hover:bg-red-700"
                            aria-label="Close"
                        >
                            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                    <div className="flex h-auto w-full justify-between pt-6 pr-3 pl-3">
                        <div className="flex h-[13vh] w-[30%] items-center justify-center rounded-lg border-[2px] border-[#343434] ">
                            <Image src={Snowflake} alt="Snowflake Icon" />
                        </div>
                        <div className="relative flex h-[13vh] w-[30%] items-center justify-center rounded-lg border-[1.5px] border-[#e4e4e4] hover:border-2 hover:bg-[#e4e4e4] group">
                            <Image src={BigQuerry} alt="BigQuery Icon" />
                            <div className={`${barlow.className} absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:flex px-3 py-1 rounded bg-black text-white text-xs whitespace-nowrap z-10 shadow-lg`}>
                                Will be available soon!
                            </div>
                        </div>
                        <div className="relative flex h-[13vh] w-[30%] items-center justify-center rounded-lg border-[1.5px] border-[#e4e4e4] hover:border-2 hover:bg-[#e4e4e4] group">
                            <Image src={Mysql} alt="MySQL Icon" />
                            <div className={`${barlow.className} absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:flex px-3 py-1 rounded bg-black text-white text-xs whitespace-nowrap z-10 shadow-lg`}>
                                Will be available soon!
                            </div>
                        </div>
                    </div>

                    <div className="mt-4 h-[1px] w-[96%] bg-[#e4e4e4] mx-auto"></div>
                    <div className="mt-4 mx-auto w-[96%]">
                        <div className="h-auto w-[100%] grid grid-cols-2 gap-4 py-4">
                            <div className="flex flex-col">
                                <label className={`${barlow.className} mb-1 text-sm text-black`}>Username</label>
                                <input className={`${barlow.className} text-xs rounded-md border border-[#e4e4e7] px-3 py-2 focus:ring-1 focus:ring-[#B0B0B0] focus:outline-none`} placeholder="Enter user" />
                            </div>
                            <div className="flex flex-col">
                                <label className={`${barlow.className} mb-1 text-sm text-black`}>Snowflake Account</label>
                                <input className={`${barlow.className} text-xs rounded-md border border-[#e4e4e7] px-3 py-2 focus:ring-1 focus:ring-[#B0B0B0] focus:outline-none`} placeholder="Enter account" />
                            </div>
                            <div className="flex flex-col">
                                <label className={`${barlow.className} mb-1 text-sm text-black`}>Role</label>
                                <input className={`${barlow.className} text-xs rounded-md border border-[#e4e4e7] px-3 py-2 focus:ring-1 focus:ring-[#B0B0B0] focus:outline-none`} placeholder="Enter role" />
                            </div>
                            <div className="flex flex-col">
                                <label className={`${barlow.className} mb-1 text-sm text-black`}>Warehouse</label>
                                <input className={`${barlow.className} text-xs rounded-md border border-[#e4e4e7] px-3 py-2 focus:ring-1 focus:ring-[#B0B0B0] focus:outline-none`} placeholder="Enter warehouse" />
                            </div>
                            <div className="flex flex-col">
                                <label className={`${barlow.className} mb-1 text-sm text-black`}>Database</label>
                                <input className={`${barlow.className} text-xs rounded-md border border-[#e4e4e7] px-3 py-2 focus:ring-1 focus:ring-[#B0B0B0] focus:outline-none`} placeholder="Enter database" />
                            </div>
                            <div className="flex flex-col">
                                <label className={`${barlow.className} mb-1 text-sm text-black`}>Schema</label>
                                <input className={`${barlow.className} text-xs rounded-md border border-[#e4e4e7] px-3 py-2 focus:ring-1 focus:ring-[#B0B0B0] focus:outline-none`} placeholder="Enter schema" />
                            </div>
                            <div className="flex flex-col col-span-2">
                                <label className={`${barlow.className} mb-1 text-sm text-black`}>Snowflake Private Key</label>
                                <input className={`${barlow.className} text-xs rounded-md border border-[#e4e4e7] px-3 py-2 focus:ring-1 focus:ring-[#B0B0B0] focus:outline-none`} placeholder="Enter private key" />
                            </div>
                        </div>
                        
                        <div className="flex items-center w-full mt-4">
                            <div className="flex-1 h-[1px] bg-[#e4e4e4]" />
                            <span className="mx-4 text-sm text-[#888] font-medium">or</span>
                            <div className="flex-1 h-[1px] bg-[#e4e4e4]" />
                        </div>
                        
                        <div className="mt-4 mb-6">
                            <div className="h-auto w-[25%] border-2 border-dashed p-3 border-[#e4e4e4] rounded-lg hover:border-[#B0B0B0] transition-colors">
                                <label htmlFor="file-upload" className="cursor-pointer flex flex-col items-center justify-center w-full h-full">
                                    <div className="flex items-center gap-2">
                                        <svg className="w-4 h-4 text-[#000]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                        </svg>
                                        <span className={`${barlow.className} text-[#888] text-sm font-medium`}>Add Yaml</span>
                                    </div>
                                    <input id="file-upload" type="file" accept=".yaml,.yml" className="hidden" />
                                </label>
                            </div>
                        </div>
                        <div className="mt-8 mb-4">
                            <button
                                type="button"
                                className={`${barlow.className} px-6 py-2 rounded-lg bg-[#343434] text-white font-normal hover:bg-[#646464] transition-colors`}
                            >
                                Submit
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <style jsx global>{`
                .scrollbar-thin::-webkit-scrollbar {
                    width: 2px !important;
                }
                .scrollbar-thin::-webkit-scrollbar-thumb {
                    background: #343434 !important;
                    border-radius: 2px;
                }
                .scrollbar-thin::-webkit-scrollbar-track {
                    background: transparent !important;
                }
            `}</style>
        </>
    );
};