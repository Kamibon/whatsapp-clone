'use client'

import { useState } from "react";

interface Props {
    extraClasses?: string
}

export default function Searchbar(props: Props) {
    const [value, setValue] = useState('')

    const {extraClasses} = props
    
    return (
        <div className={"flex flex-col gap-4 max-w-full"}>
            <div className="flex items-center border pl-3 gap-2 bg-white border-gray-500/30 h-12 rounded-md overflow-hidden">
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="m15.75 15.75-3.262-3.262M14.25 8.25a6 6 0 1 1-12 0 6 6 0 0 1 12 0" stroke="#6B7280" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <input value={value} onChange={(e)=> setValue(e.target.value)} type="text" placeholder="Search the country" className="w-full h-full outline-none text-gray-500 placeholder-gray-500 text-sm" />
            </div>
        </div>
    );
};