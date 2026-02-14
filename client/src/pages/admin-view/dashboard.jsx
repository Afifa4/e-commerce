import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Package, DollarSign, ShoppingCart, TrendingUp } from "lucide-react";
import { productsApi } from "../../api/products";

function AdminDashboard() {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalStock: 0,
    categories: { headphones: 0, laptops: 0 },
  });

  useEffect(() => {
    let cancelled = false;

    productsApi
      .getAll()
      .then(({ data }) => {
        if (cancelled) return;
        if (data?.success && Array.isArray(data.data)) {
          const products = data.data;
          const headphones = products.filter((p) => p.category === "headphones").length;
          const laptops = products.filter((p) => p.category === "laptops").length;
          const totalStock = products.reduce((sum, p) => sum + (p.totalStock || 0), 0);
          setStats({
            totalProducts: products.length,
            totalStock,
            categories: { headphones, laptops },
          });
        }
      })
      .catch(() => {
        if (!cancelled) {
          setStats({
            totalProducts: 0,
            totalStock: 0,
            categories: { headphones: 0, laptops: 0 },
          });
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-3xl font-bold text-white">Dashboard</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          icon={<Package className="text-blue-400" />}
          label="Total Products"
          value={stats.totalProducts}
        />
        <StatCard
          icon={<ShoppingCart className="text-green-400" />}
          label="Total Stock"
          value={stats.totalStock}
        />
        <StatCard
          icon={<TrendingUp className="text-yellow-400" />}
          label="Headphones"
          value={stats.categories.headphones}
        />
        <StatCard
          icon={<DollarSign className="text-purple-400" />}
          label="Laptops"
          value={stats.categories.laptops}
        />
      </div>

      {/* Quick Actions */}
      <div className="mt-4">
        <h2 className="text-xl font-bold text-white mb-4">Quick Actions</h2>
        <div className="flex gap-4 flex-wrap">
          <Link
            to="/admin/products"
            className="px-6 py-3 bg-white text-black font-bold rounded-full hover:bg-gray-200 transition"
          >
            Manage Products
          </Link>
          <Link
            to="/admin/orders"
            className="px-6 py-3 bg-[#2a2a2a] text-white border border-[#333] rounded-full hover:bg-[#333] transition"
          >
            View Orders
          </Link>
        </div>
      </div>
    </div>
  );
}

// Stat Card Component
function StatCard({ icon, label, value }) {
  return (
    <div className="bg-[#222] border border-[#333] rounded-2xl p-6 flex items-center gap-4">
      <div className="w-12 h-12 bg-[#2a2a2a] rounded-full flex items-center justify-center">
        {icon}
      </div>
      <div>
        <p className="text-gray-400 text-sm">{label}</p>
        <p className="text-white text-2xl font-bold">{value}</p>
      </div>
    </div>
  );
}

export default AdminDashboard;
