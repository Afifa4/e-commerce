import { useCart } from "../../context/CartContext";
import { Trash2, Plus, Minus, ShoppingBag } from "lucide-react";
import { Link } from "react-router-dom";

function ShoppingCheckout() {
    const { cartItems, removeFromCart, updateQuantity, getTotal, clearCart } = useCart();

    if (cartItems.length === 0) {
        return (
            <div className="min-h-screen bg-[#191919] flex flex-col items-center justify-center p-4">
                <ShoppingBag size={64} className="text-gray-500 mb-4" />
                <h2 className="text-2xl font-bold text-white mb-2">Your Cart is Empty</h2>
                <p className="text-gray-500 mb-6">Add some products to get started!</p>
                <Link
                    to="/listing"
                    className="bg-white text-black px-6 py-3 rounded-full font-bold hover:bg-gray-200 transition"
                >
                    Browse Products
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#191919] py-8 px-4">
            <div className="container mx-auto max-w-4xl">
                <h1 className="text-3xl font-bold text-white mb-8">Your Cart</h1>

                {/* Cart Items */}
                <div className="space-y-4 mb-8">
                    {cartItems.map((item) => (
                        <div
                            key={item._id}
                            className="bg-[#222] rounded-2xl p-4 flex gap-4 border border-[#333]"
                        >
                            <img
                                src={item.image || "https://via.placeholder.com/100"}
                                alt={item.title}
                                className="w-24 h-24 object-cover rounded-xl"
                            />
                            <div className="flex-1">
                                <h3 className="text-white font-bold">{item.title}</h3>
                                <p className="text-gray-500 text-sm">{item.category}</p>
                                <p className="text-white font-bold mt-2">
                                    ${item.salePrice || item.price}
                                </p>
                            </div>

                            {/* Quantity Controls */}
                            <div className="flex flex-col items-end justify-between">
                                <button
                                    onClick={() => removeFromCart(item._id)}
                                    className="text-red-500 hover:text-red-400 transition"
                                >
                                    <Trash2 size={20} />
                                </button>

                                <div className="flex items-center gap-3 bg-[#333] rounded-full px-3 py-1">
                                    <button
                                        onClick={() => updateQuantity(item._id, item.quantity - 1)}
                                        className="text-white hover:text-gray-400"
                                    >
                                        <Minus size={16} />
                                    </button>
                                    <span className="text-white font-bold min-w-[20px] text-center">
                                        {item.quantity}
                                    </span>
                                    <button
                                        onClick={() => updateQuantity(item._id, item.quantity + 1)}
                                        className="text-white hover:text-gray-400"
                                    >
                                        <Plus size={16} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Summary */}
                <div className="bg-[#222] rounded-2xl p-6 border border-[#333]">
                    <div className="flex justify-between items-center mb-4">
                        <span className="text-gray-400">Subtotal</span>
                        <span className="text-white font-bold text-xl">${getTotal().toFixed(2)}</span>
                    </div>
                    <div className="flex gap-4">
                        <button
                            onClick={clearCart}
                            className="flex-1 py-3 rounded-full border border-[#444] text-white hover:bg-[#333] transition"
                        >
                            Clear Cart
                        </button>
                        <button className="flex-1 py-3 rounded-full bg-white text-black font-bold hover:bg-gray-200 transition">
                            Checkout
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ShoppingCheckout;
