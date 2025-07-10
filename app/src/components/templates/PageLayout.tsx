import Head from "next/head";

import { barlow } from "../../assets/fonts/barlow";
import { COMPANY_NAME } from "@constants";
import { LogoutButton } from "@molecules";

interface IPageElement {
    children: React.ReactNode;
    className?: string;
}

type IPageTitle = IPageElement;
type IPageActions = IPageElement;
type IPageHeader = IPageElement;

interface IPage extends IPageElement {
    name: string;
    header?: React.ReactNode;
    sidebar?: React.ReactNode;
}

export function PageHeader({ children }: IPageHeader) {
    return (
        <div
            id="page-header"
            className="z-50 flex items-center justify-between border-b border-[#E4E4E7] bg-[#FAFAFA] px-4 py-2 pb-[1px]"
            style={{ minHeight: "50px", maxHeight: "55px" }}
        >
            {children}
        </div>
    );
}

export function PageTitle({ children }: IPageTitle) {
    return (
        <div
            id="page-title"
            className={`${barlow.className} inline-flex grow items-center text-lg text-[22px] font-semibold text-black no-underline select-none`}
            style={{ textDecoration: "none" }}
        >
            {children}
        </div>
    );
}

export function PageListCount({ pageTitle, count, listLoading }) {
    return (
        <div id="page-size" className="inline-flex items-center">
            <label className="mr-1">{pageTitle}</label>
            <label className={listLoading ? "animate-pulse" : ""}>{`(${listLoading && count == 0 ? "loading" : count})`}</label>
        </div>
    );
}

export function PageActions({ children }: IPageActions) {
    return (
        <div id="page-actions" className="flex grow flex-row items-center justify-end space-x-2.5">
            {children}
        </div>
    );
}

export function PageLayout({ name, header, className = "", sidebar, children }: IPage) {
    return (
        <div id="page-body" className="flex w-screen px-p-0 flex-col overflow-hidden" style={{ minHeight: "100vh", maxHeight: "100vh" }}>
            <Head>
                <link rel="shortcut icon" href="/static/favicon.svg" />
                <title>{`${COMPANY_NAME} - ${name}`}</title>
            </Head>

            {/* Main Flex: Sidebar + Content */}
            <div className="custom-scrollbar relative flex flex-grow flex-row overflow-hidden">
                {/* Sidebar (if any) */}
                {sidebar}

                {/* Right Content Area */}
                <div className="flex w-full flex-col overflow-y-auto">
                    {/* Moved Header into here */}
                    {header && (
                        <PageHeader>
                            <div className="flex w-full items-center justify-between">
                                <div className="inline-flex items-center">{header}</div>
                                <LogoutButton />
                            </div>
                        </PageHeader>
                    )}

                    {/* Actual Page Content */}
                    <div className={`flex-grow p-[8px] ${className}`}>{children}</div>
                </div>
            </div>
        </div>
    );
}
