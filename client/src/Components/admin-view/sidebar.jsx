import { ChartNoAxesCombined, LayoutDashboard, ShoppingCart, Package } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

function AdminSidebar() {
    const navigate = useNavigate();
    const location = useLocation();

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
        <aside className="hidden w-72 flex-col border-r border-[#2a2a2a] bg-[#191919] p-6 lg:flex">
            <div
                className="flex items-center gap-3 mb-10 pl-2 cursor-pointer"
                onClick={() => navigate('/admin')}
            >
                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-black">
                    <ChartNoAxesCombined size={20} />
                </div>
                <h1 className="text-xl font-bold tracking-tight text-white">Admin Panel</h1>
            </div>
            <nav className="flex flex-col gap-2">
                <div className="text-xs font-medium text-[#888888] uppercase tracking-wider mb-2 pl-2">Menu</div>

                <div
                    onClick={() => navigate('/admin')}
                    className={getMenuItemClass('/admin')}
                >
                    <LayoutDashboard size={20} />
                    <span>Dashboard</span>
                </div>

                <div
                    onClick={() => navigate('/admin/products')}
                    className={getMenuItemClass('/admin/products')}
                >
                    <ShoppingCart size={20} />
                    <span>Products</span>
                </div>

                <div
                    onClick={() => navigate('/admin/orders')}
                    className={getMenuItemClass('/admin/orders')}
                >
                    <Package size={20} />
                    <span>Orders</span>
                </div>
            </nav>
        </aside>
    );
}

export default AdminSidebar;
