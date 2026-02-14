import { useEffect, useState } from "react";
import { useCart } from "../../context/CartContext";
import { Search } from "lucide-react";

// Products listing page with search and category filter
function ShoppingListing() {
  const { products, fetchProducts, addToCart } = useCart();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  useEffect(() => {
    fetchProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps -- run once on mount to load products
  }, []);

  // Filter products by category and search (computed on each render)
  let filteredProducts = products ?? [];
  if (selectedCategory !== "all") {
    filteredProducts = filteredProducts.filter((p) => p.category === selectedCategory);
  }
  if (searchQuery.trim()) {
    const query = searchQuery.toLowerCase();
    filteredProducts = filteredProducts.filter((p) => p.title?.toLowerCase().includes(query));
  }

  return (
    <div className="min-h-screen bg-[#191919] py-8 px-4">
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <h1 className="text-3xl font-bold text-white">All Products</h1>
          <div className="flex gap-3 w-full md:w-auto">
            <div className="relative flex-1 md:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-full bg-[#2a2a2a] text-white border border-[#333] focus:border-white transition"
              />
            </div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-2 rounded-full bg-[#2a2a2a] text-white border border-[#333] cursor-pointer"
            >
              <option value="all">All Categories</option>
              <option value="headphones">Headphones</option>
              <option value="laptops">Laptops</option>
            </select>
          </div>
        </div>

        {filteredProducts.length === 0 ? (
          <div className="text-center py-20 text-gray-500">
            <p className="text-xl">No products found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <div
                key={product._id}
                className="bg-[#222] rounded-2xl overflow-hidden border border-[#333] hover:border-[#555] transition group"
              >
                <img
                  src={product.image || "https://via.placeholder.com/300"}
                  alt={product.title ?? "Product"}
                  className="w-full h-48 object-cover group-hover:scale-105 transition"
                />
                <div className="p-4">
                  <p className="text-xs text-gray-500 uppercase mb-1">{product.category}</p>
                  <h3 className="text-white font-bold text-lg truncate">{product.title}</h3>
                  <p className="text-gray-500 text-sm mt-1 line-clamp-2">{product.description}</p>
                  <div className="flex items-center gap-2 mt-3">
                    {product.salePrice ? (
                      <>
                        <span className="text-white font-bold text-lg">${product.salePrice}</span>
                        <span className="text-gray-500 line-through text-sm">${product.price}</span>
                      </>
                    ) : (
                      <span className="text-white font-bold text-lg">${product.price}</span>
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
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default ShoppingListing;
