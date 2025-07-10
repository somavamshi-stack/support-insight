import Head from "next/head";
import React from "react";

import { COMPANY_NAME } from "@constants";
import { LOGO } from "@atoms";

interface LoginPageLayoutProps {
    children: React.ReactNode;
}

export const LoginPageLayout: React.FC<LoginPageLayoutProps> = ({ children }) => (
    <div className="flex h-screen w-full select-none">
        <Head>
            <link rel="shortcut icon" href="/static/favicon.svg" />
            <title>{`${COMPANY_NAME} - Signin Page`}</title>
        </Head>
        <div className="flex w-1/2 items-center justify-center">
            <div className="max-w-sm transform cursor-pointer items-center justify-center duration-[300ms] hover:scale-120">
                <div className="flex flex-col items-center justify-center">
                    <LOGO width={350} height={120} />
                </div>
            </div>
        </div>
        <div className="flex h-screen w-1/2 flex-col items-center justify-center">
            <div className="mt-8 w-60">{children}</div>
        </div>
    </div>
);
