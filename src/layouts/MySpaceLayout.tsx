import { useState } from "react";
import { Outlet } from "react-router-dom";

import Sidebar from "../components/admin/Sidebar";
import Topbar from "../components/admin/Topbar";

import { adminColors } from "../theme/adminTokens";

export default function AdminLayout(): React.JSX.Element {

    const [collapsed, setCollapsed] = useState(false);

    const [mobileOpen, setMobileOpen] = useState(false);



    return (

        <div
            style={{ background: adminColors.bg }}
            className="min-h-screen flex"
        >

            <Sidebar
                collapsed={collapsed}
                onToggle={() => setCollapsed(prev => !prev)}
                mobileOpen={mobileOpen}
                onCloseMobile={() => setMobileOpen(false)}
            />

            <div className="flex-1 min-w-0 flex flex-col">

                <Topbar
                    onOpenMobileSidebar={() => setMobileOpen(true)}
                />

                <main className="flex-1 px-4 md:px-6 py-6">

                    <Outlet />

                </main>

            </div>

        </div>

    );

}