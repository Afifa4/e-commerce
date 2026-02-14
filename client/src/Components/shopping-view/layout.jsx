import { Outlet } from "react-router-dom";
import ShoppingHeader from "./header";

function ShoppingLayout() {
    return (
        <div className="flex flex-col bg-[#191919] min-h-screen text-[#EDEDED] font-sans selection:bg-white selection:text-black">
            {/* common header */}
            <ShoppingHeader />
            <main className="flex flex-col w-full">
                <Outlet />
            </main>
        </div>
    )
}
export default ShoppingLayout;
