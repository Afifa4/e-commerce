import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { ShoppingBag, ArrowRight } from "lucide-react";

function ShoppingHome() {
    const { products, fetchProducts } = useCart();

    useEffect(() => {
        fetchProducts();
    }, []);

    const featuredProducts = products.slice(0, 4);

    return (
        <div className="flex flex-col min-h-screen bg-[#191919]">
            <div className="py-16 px-6 text-center">
                <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                    Welcome to <span className="text-gray-400">ShopNow</span>
                </h1>
                <p className="text-lg text-gray-500 mb-8">
                    Discover amazing Headphones & Laptops
                </p>
                <Link
                    to="/listing"
                    className="inline-flex items-center gap-2 bg-white text-black px-6 py-3 rounded-full font-bold hover:bg-gray-200 transition"
                >
                    Shop Now <ArrowRight size={18} />
                </Link>
            </div>
            <div className="container mx-auto px-4 pb-16">
                <h2 className="text-2xl font-bold text-white mb-6">Featured Products</h2>

                {featuredProducts.length === 0 ? (
                    <div className="text-center py-12 text-gray-500">
                        <ShoppingBag size={48} className="mx-auto mb-4 opacity-50" />
                        <p>No products available yet</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {featuredProducts.map((product) => (
                            <ProductCard key={product._id} product={product} />
                        ))}
                    </div>
                )}

                {products.length > 4 && (
                    <div className="text-center mt-8">
                        <Link
                            to="/listing"
                            className="text-gray-400 hover:text-white transition"
                        >
                            View All Products →
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}

function ProductCard({ product }) {
    const { addToCart } = useCart();

    return (
        <div className="bg-[#222] rounded-2xl overflow-hidden border border-[#333] hover:border-[#444] transition">
            <img
                src={product.image || "https://via.placeholder.com/300"}
                alt={product.title}
                className="w-full h-48 object-cover"
            />
            <div className="p-4">
                <p className="text-xs text-gray-500 uppercase mb-1">{product.category}</p>
                <h3 className="text-white font-bold text-lg truncate">{product.title}</h3>
                <div className="flex items-center gap-2 mt-2">
                    {product.salePrice ? (
                        <>
                            <span className="text-white font-bold">${product.salePrice}</span>
                            <span className="text-gray-500 line-through text-sm">${product.price}</span>
                        </>
                    ) : (
                        <span className="text-white font-bold">${product.price}</span>
                    )}
                </div>
                <button
                    onClick={() => addToCart(product)}
                    className="w-full mt-4 bg-white text-black font-bold py-2 rounded-full hover:bg-gray-200 transition"
                >
                    Add to Cart
                </button>
            </div>
        </div>
    );
}

export default ShoppingHome;
