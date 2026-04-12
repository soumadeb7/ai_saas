import { SidebarProvider } from "@/components/ui/sidebar";
import { DashboardNavbar } from "@/modules/dashboard/ui/components/dashboard-navbar";
import { DashboardSidebar } from "@/modules/dashboard/ui/components/dashboard-sidebar";
import { TRPCReactProvider } from "@/trpc/client";

interface Props {
    children: React.ReactNode;
}

const layout = ({ children }: Props) => {
    return (
        <TRPCReactProvider>
            <SidebarProvider>
                <DashboardSidebar />
                <main className="flex flex-col h-screen w-full bg-muted">
                    <DashboardNavbar />
                    {children}
                </main>
            </SidebarProvider>
        </TRPCReactProvider>
    )
}

export default layout