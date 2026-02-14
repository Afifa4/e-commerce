import { Package } from "lucide-react";

function AdminOrders() {
    const orders = [];

    return (
        <div className="flex flex-col gap-6">
            <h1 className="text-3xl font-bold text-white">Orders</h1>

            {orders.length === 0 ? (
                <div className="w-full h-[300px] bg-[#191919] border border-dashed border-[#333] rounded-3xl flex flex-col items-center justify-center text-center p-6">
                    <Package size={48} className="text-[#555] mb-4" />
                    <h3 className="text-xl font-bold text-white">No Orders Yet</h3>
                    <p className="text-gray-500 mt-2">
                        Orders will appear here when customers make purchases.
                    </p>
                </div>
            ) : (
                <div className="space-y-4">
                    {orders.map((order) => (
                        <div
                            key={order._id}
                            className="bg-[#222] border border-[#333] rounded-2xl p-4"
                        >
                            <p className="text-white">Order #{order._id}</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default AdminOrders;
