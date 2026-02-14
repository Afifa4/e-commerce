import { Menu, LogOut, ChartNoAxesCombined, LayoutDashboard, ShoppingCart, Package } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from "../ui/sheet";
import { useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";

function AdminHeader() {
    const navigate = useNavigate();
    const location = useLocation();
    const [open, setOpen] = useState(false);

    const handleNavigation = (path) => {
        navigate(path);
        setOpen(false); // Close sheet on navigation
    };

    // Helper to determine active class
    const isActive = (path) => {
        if (path === '/admin') {
            return location.pathname === '/admin';
        }
        return location.pathname.startsWith(path);
    };

    const getMenuItemClass = (path) => {
        const activeClass = "bg-[#2a2a2a] text-white";
        const inactiveClass = "text-[#888888] hover:text-white hover:bg-[#222]";
        const baseClass = "flex items-center gap-3 px-4 py-3 rounded-lg cursor-pointer transition-all";

        return `${baseClass} ${isActive(path) ? activeClass : inactiveClass}`;
    };

    return (
        <header className="flex items-center justify-between border-b border-[#2a2a2a] bg-[#191919] px-6 py-4">
            {/* Mobile Sidebar Sheet */}
            <Sheet open={open} onOpenChange={setOpen}>
                <SheetTrigger asChild>
                    <button className="lg:hidden block text-white hover:bg-[#2a2a2a] p-2 rounded-md transition-colors">
                        <Menu />
                        <span className="sr-only">Toggle Menu</span>
                    </button>
                </SheetTrigger>
                <SheetContent side="left" className="w-[300px] border-r border-[#2a2a2a] bg-[#191919] p-0 text-white">
                    <SheetHeader className="p-6 border-b border-[#2a2a2a]">
                        <SheetTitle className="flex items-center gap-2 text-white">
                            <ChartNoAxesCombined size={24} />
                            <span className="text-xl font-bold">Admin Panel</span>
                        </SheetTitle>
                    </SheetHeader>

                    {/* Reuse Sidebar Navigation for Mobile */}
                    <nav className="flex flex-col gap-2 p-6">
                        <div className="text-xs font-medium text-[#888888] uppercase tracking-wider mb-2 pl-2">Menu</div>

                        <div
                            onClick={() => handleNavigation('/admin')}
                            className={getMenuItemClass('/admin')}
                        >
                            <LayoutDashboard size={20} />
                            <span>Dashboard</span>
                        </div>

                        <div
                            onClick={() => handleNavigation('/admin/products')}
                            className={getMenuItemClass('/admin/products')}
                        >
                            <ShoppingCart size={20} />
                            <span>Products</span>
                        </div>

                        <div
                            onClick={() => handleNavigation('/admin/orders')}
                            className={getMenuItemClass('/admin/orders')}
                        >
                            <Package size={20} />
                            <span>Orders</span>
                        </div>
                    </nav>
                </SheetContent>
            </Sheet>

            <div className="flex flex-1 justify-end">
                <button className="flex items-center gap-2 px-5 py-2.5 bg-white text-black rounded-full text-sm font-semibold hover:bg-[#e0e0e0] transition-colors">
                    <LogOut size={16} />
                    Log Out
                </button>
            </div>
        </header>
    )
}

export default AdminHeader;
