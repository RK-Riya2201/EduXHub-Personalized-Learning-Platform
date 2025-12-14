import React from "react";
import { UserButton } from "@clerk/nextjs";
import { SidebarTrigger } from "@/components/ui/sidebar";

function AppHeader({ hideSidebar = false }) {
    return (
        <div className="p-5 flex justify-between items-center shadow-sm">
            {!hideSidebar && <SidebarTrigger />}
            <UserButton />
        </div>
    );
}

export default AppHeader;
