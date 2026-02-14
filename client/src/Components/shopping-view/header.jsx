import { Link } from "react-router-dom";
import { ShoppingCart, User } from "lucide-react";
import { useCart } from "../../context/CartContext";

function ShoppingHeader() {
    const { getItemCount } = useCart();
    const itemCount = getItemCount();

    return (
        <header className="sticky top-0 z-40 w-full border-b border-[#333] bg-[#191919]">
            <div className="flex h-16 items-center justify-between px-4 md:px-6">
                {/* Logo */}
                <Link to="/" className="text-white font-bold text-xl">
                    ShopNow
                </Link>

                {/* Navigation */}
                <nav className="hidden md:flex gap-6">
                    <Link to="/" className="text-gray-400 hover:text-white transition">
                        Home
                    </Link>
                    <Link to="/listing" className="text-gray-400 hover:text-white transition">
                        Products
                    </Link>
                </nav>

                {/* Icons */}
                <div className="flex items-center gap-4">
                    <Link to="/checkout" className="relative text-gray-400 hover:text-white transition">
                        <ShoppingCart size={24} />
                        {itemCount > 0 && (
                            <span className="absolute -top-2 -right-2 bg-white text-black text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">
                                {itemCount}
                            </span>
                        )}
                    </Link>
                    <Link to="/account" className="text-gray-400 hover:text-white transition">
                        <User size={24} />
                    </Link>
                </div>
            </div>
        </header>
    );
}

export default ShoppingHeader;
