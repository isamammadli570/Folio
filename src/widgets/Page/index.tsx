import type {ReactNode} from "react";
import {cn} from "@/lib/utils";

type PageProps = {
    children: ReactNode;
    className?: string;
};

/** The centred content column with the side gutters; every page except the home hero sits in one. */
export const Page = ({children, className}: PageProps) => (
    <div className={cn("page-enter px-gutter mx-auto w-full max-w-[1240px] pb-24 pt-10 sm:pt-14", className)}>{children}</div>
);
