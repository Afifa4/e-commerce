import { useState, useEffect } from "react";
import { Button } from "../../Components/ui/button";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
} from "../../Components/ui/sheet";
import { addProductFormElements } from "../../config";
import { UploadCloud, Trash2, Edit2, Package, Plus } from "lucide-react";
import { useToast } from "../../context/ToastContext";
import { useConfirm } from "../../context/ConfirmContext";
import { productsApi } from "../../api/products";

// Admin page: list products, add, edit, delete, and upload images
function AdminProducts() {
    const [openSheet, setOpenSheet] = useState(false);
    const [formData, setFormData] = useState({});
    const [imageFile, setImageFile] = useState(null);
    const [uploadedImageUrl, setUploadedImageUrl] = useState("");
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [editingId, setEditingId] = useState(null);

    const { showToast } = useToast();
    const { confirm } = useConfirm();

    useEffect(() => {
        fetchProducts();
    }, []);

    async function fetchProducts() {
        try {
            const { data } = await productsApi.getAll();
            if (data?.success && Array.isArray(data.data)) {
                setProducts(data.data);
            }
        } catch {
            setProducts([]);
        }
    }

    function handleImageChange(event) {
        const file = event.target.files[0];
        if (file) setImageFile(file);
    }

    function handleRemoveImage() {
        setImageFile(null);
        setUploadedImageUrl("");
    }

    function handleInputChange(event) {
        setFormData({
            ...formData,
            [event.target.name]: event.target.value,
        });
    }

    async function uploadImage() {
        if (!imageFile) return uploadedImageUrl;

        const formData = new FormData();
        formData.append("file", imageFile);

        try {
            const { data } = await productsApi.uploadImage(formData);
            if (data?.success && data?.result?.secure_url) {
                setUploadedImageUrl(data.result.secure_url);
                return data.result.secure_url;
            }
            // If upload didn't succeed, show the error message
            const errorMsg = data?.message || "Image upload failed";
            showToast(errorMsg, "error");
            return "";
        } catch (err) {
            const msg = err.response?.data?.message || err.message || "Image upload error";
            showToast(msg, "error");
            return "";
        }
    }

    async function handleSubmit() {
        // Validate required fields before submitting
        if (!formData.title || !formData.category || !formData.price || !formData.totalStock) {
            showToast("Please fill in all required fields (Title, Category, Price, Stock)", "error");
            return;
        }

        setLoading(true);

        let imageUrl = uploadedImageUrl;
        if (imageFile) {
            imageUrl = await uploadImage();
            // If image upload failed, stop submission
            if (!imageUrl) {
                setLoading(false);
                return;
            }
        }

        const productData = {
            ...formData,
            image: imageUrl,
        };

        try {
            if (editingId) {
                await productsApi.update(editingId, productData);
                showToast("Product updated successfully", "success");
            } else {
                await productsApi.create(productData);
                showToast("Product created successfully", "success");
            }
            resetForm();
            fetchProducts();
        } catch (err) {
            const msg = err.response?.data?.message || err.message || "Error saving product";
            showToast(msg, "error");
        } finally {
            setLoading(false);
        }
    }

    async function handleDelete(id, title) {
        const confirmed = await confirm(
            `Are you sure you want to delete "${title}"? This action cannot be undone.`,
        );
        if (!confirmed) return;

        try {
            await productsApi.delete(id);
            showToast("Product deleted", "info");
            fetchProducts();
        } catch (err) {
            const msg = err.response?.data?.message || err.message || "Error deleting product";
            showToast(msg, "error");
        }
    }

    function handleEdit(product) {
        setEditingId(product._id);
        setFormData({
            title: product.title,
            description: product.description,
            category: product.category,
            price: product.price,
            salePrice: product.salePrice || "",
            totalStock: product.totalStock,
        });
        setUploadedImageUrl(product.image || "");
        setOpenSheet(true);
    }

    function resetForm() {
        setFormData({});
        setImageFile(null);
        setUploadedImageUrl("");
        setEditingId(null);
        setOpenSheet(false);
    }

    function renderInput(item) {
        const value = formData[item.name] || "";

        if (item.componentType === "select") {
            return (
                <select
                    name={item.name}
                    value={value}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-xl bg-[#1a1a1a] text-white border border-[#333] focus:border-white transition"
                >
                    <option value="">Select {item.label}</option>
                    {item.options.map((opt) => (
                        <option key={opt.id} value={opt.id}>
                            {opt.label}
                        </option>
                    ))}
                </select>
            );
        }

        if (item.componentType === "textarea") {
            return (
                <textarea
                    name={item.name}
                    value={value}
                    placeholder={item.placeholder}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-xl bg-[#1a1a1a] text-white border border-[#333] focus:border-white transition min-h-[100px] resize-none"
                />
            );
        }

        return (
            <input
                type={item.type}
                name={item.name}
                value={value}
                placeholder={item.placeholder}
                onChange={handleInputChange}
                min={item.min}
                className="w-full px-4 py-3 rounded-xl bg-[#1a1a1a] text-white border border-[#333] focus:border-white transition"
            />
        );
    }

    return (
        <div className="flex flex-col w-full">
            {/* Add Button at Top */}
            <div className="mb-8">
                <Button
                    onClick={() => {
                        resetForm();
                        setOpenSheet(true);
                    }}
                    className="bg-white text-black font-bold rounded-xl px-6 py-3 hover:bg-gray-100 flex items-center gap-2 text-base"
                >
                    <Plus size={20} /> Add Product
                </Button>
            </div>

            {/* Products Grid or Empty State */}
            {products.length === 0 ? (
                <div className="w-full py-20 bg-[#1a1a1a] border border-dashed border-[#333] rounded-2xl flex flex-col items-center justify-center text-center">
                    <Package size={56} className="text-gray-600 mb-4" />
                    <h3 className="text-xl font-bold text-white mb-2">No Products Yet</h3>
                    <p className="text-gray-500 mb-6">
                        Add your first product to get started
                    </p>
                    <Button
                        onClick={() => setOpenSheet(true)}
                        className="bg-white text-black rounded-xl px-6 py-3 font-bold"
                    >
                        Add Product
                    </Button>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full">
                    {products.map((product) => (
                        <div
                            key={product._id}
                            className="bg-[#1a1a1a] rounded-xl border border-[#252525] hover:border-[#444] transition-all overflow-hidden group"
                        >
                            {/* Product Image */}
                            <div className="w-full h-44 bg-[#222] flex items-center justify-center overflow-hidden">
                                {product.image ? (
                                    <img
                                        src={product.image}
                                        alt={product.title}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                    />
                                ) : (
                                    <Package size={40} className="text-gray-600" />
                                )}
                            </div>

                            {/* Product Info */}
                            <div className="p-4">
                                <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">
                                    {product.category}
                                </p>
                                <h3 className="text-white font-semibold truncate mb-2">
                                    {product.title}
                                </h3>

                                <div className="flex items-center justify-between mb-3">
                                    <div className="flex items-center gap-2">
                                        <span className="text-white font-bold text-lg">
                                            ${product.salePrice || product.price}
                                        </span>
                                        {product.salePrice && (
                                            <span className="text-gray-500 line-through text-sm">
                                                ${product.price}
                                            </span>
                                        )}
                                    </div>
                                    <span className="text-gray-500 text-sm">
                                        {product.totalStock} in stock
                                    </span>
                                </div>

                                {/* Actions - Small icons */}
                                <div className="flex gap-2 pt-3 border-t border-[#252525]">
                                    <button
                                        onClick={() => handleEdit(product)}
                                        className="flex-1 flex items-center justify-center gap-2 py-2 text-sm text-gray-400 hover:text-white hover:bg-[#252525] rounded-lg transition"
                                    >
                                        <Edit2 size={14} /> Edit
                                    </button>
                                    <button
                                        onClick={() => handleDelete(product._id, product.title)}
                                        className="flex-1 flex items-center justify-center gap-2 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition"
                                    >
                                        <Trash2 size={14} /> Delete
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Add/Edit Product Sheet */}
            <Sheet open={openSheet} onOpenChange={setOpenSheet}>
                <SheetContent className="bg-[#0d0d0d] text-white border-l border-[#1a1a1a] w-full sm:max-w-md overflow-y-auto">
                    <SheetHeader className="mb-6">
                        <SheetTitle className="text-white text-xl font-bold">
                            {editingId ? "Edit Product" : "Add New Product"}
                        </SheetTitle>
                    </SheetHeader>

                    {/* Image Upload */}
                    <div className="w-full bg-[#1a1a1a] rounded-xl border-2 border-dashed border-[#333] py-8 flex flex-col items-center relative mb-6">
                        {!imageFile && !uploadedImageUrl ? (
                            <label className="cursor-pointer flex flex-col items-center w-full h-full absolute inset-0 justify-center group">
                                <div className="w-14 h-14 bg-[#252525] rounded-full flex items-center justify-center mb-3 group-hover:bg-[#333] transition">
                                    <UploadCloud className="text-gray-400" size={24} />
                                </div>
                                <span className="text-gray-400 font-medium text-sm">
                                    Click to upload
                                </span>
                                <input
                                    type="file"
                                    className="hidden"
                                    onChange={handleImageChange}
                                    accept="image/*"
                                />
                            </label>
                        ) : (
                            <div className="flex flex-col items-center z-10 p-4">
                                {(uploadedImageUrl || imageFile) && (
                                    <img
                                        src={uploadedImageUrl || URL.createObjectURL(imageFile)}
                                        alt="Preview"
                                        className="w-24 h-24 object-cover rounded-lg mb-3 border border-[#333]"
                                    />
                                )}
                                <p className="text-white text-sm font-medium mb-2">
                                    {imageFile?.name || "Current Image"}
                                </p>
                                <button
                                    onClick={handleRemoveImage}
                                    className="text-red-400 text-sm hover:text-red-300 transition"
                                >
                                    Remove
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Form Fields */}
                    <div className="flex flex-col gap-4">
                        {addProductFormElements.map((item) => (
                            <div key={item.name} className="flex flex-col gap-1.5">
                                <label className="text-xs font-medium text-gray-400 uppercase tracking-wider">
                                    {item.label}
                                </label>
                                {renderInput(item)}
                            </div>
                        ))}

                        <Button
                            onClick={handleSubmit}
                            disabled={loading}
                            className="mt-4 bg-white text-black font-semibold h-11 rounded-lg hover:bg-gray-100 disabled:opacity-50"
                        >
                            {loading ? "Saving..." : editingId ? "Update" : "Create"}
                        </Button>
                    </div>
                </SheetContent>
            </Sheet>
        </div>
    );
}

export default AdminProducts;
