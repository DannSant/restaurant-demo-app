import { useEffect, useState } from "react";
import { Product } from "../models/Product";
import axios from "axios";
import Modal from "../components/Modal"; // Import the Modal
import toast from "react-hot-toast";
import { useAppSelector,useAppDispatch } from "../store/hooks";
import { fetchProducts } from "../store/slices/productsSlice";
import { addProduct as addProductThunkAction, updateProduct as updateProductThunkAction } from "../store/slices/productsSlice";
import ProductForm from "../components/ProductsForm";

function ProductsPage() {
  const { products, loading, error } = useAppSelector((state) => state.products);
  const dispatch = useAppDispatch();

  //const [isModalOpen, setIsModalOpen] = useState(false);
  const [newProduct, setNewProduct] = useState<Omit<Product, "id" | "created_at">>({
    name: "",
    description: "",
    price: 0,
    image_url: "",
    disabled: false,
  });
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editProductId, setEditProductId] = useState<string>("");

 
  

  const addProduct = async () => {
    try {
      await dispatch(addProductThunkAction(newProduct)).unwrap();
      toast.success("Product added successfully!");
      setIsAddModalOpen(false);
      resetForm();
      setNewProduct({ name: "", description: "", price: 0, image_url: "", disabled: false });
    } catch (error) {
      console.error("Error adding product", error);
      toast.error("Failed to add product.");
    }
  };

  const disableProduct = async (id: string) => {
    try {
      //await axios.put(`http://localhost:5000/products/${id}`, { disabled: true });
      await dispatch(updateProductThunkAction({ id, updatedProduct: { disabled: true } })).unwrap();
      toast.success("Product disabled!");
     
    } catch (error) {
      console.error("Error disabling product", error);
      toast.error("Failed to disable product.");
    }
  };

  const reactivateProduct = async (id: string) => {
    try {
      //await axios.put(`http://localhost:5000/products/${id}`, { disabled: false });
      await dispatch(updateProductThunkAction({ id, updatedProduct: { disabled: false } })).unwrap();
      toast.success("Product reactivated!");
      
    } catch (error) {
      console.error("Error reactivating product", error);
      toast.error("Failed to reactivate product.");
    }
  };

  const handleUpdateProduct = async () => {
    try {
      await dispatch(updateProductThunkAction({ id: editProductId, updatedProduct: newProduct })).unwrap();
      toast.success("Product updated successfully!");
      setIsEditModalOpen(false);
      resetForm();
    } catch (error) {
      console.error("Error updating product", error);
      toast.error("Failed to update product.");
    }
  };

  const resetForm = () => {
    setNewProduct({ name: "", description: "", price: 0, image_url: "", disabled: false });
    setEditProductId("");
  };

  const openEditModal = (product: Product) => {
    setNewProduct({
      name: product.name,
      description: product.description,
      price: product.price,
      image_url: product.image_url || "",
      disabled: product.disabled,
    });
    setEditProductId(product.id);
    setIsEditModalOpen(true);
  };

  if (loading) return <p>Loading products...</p>;
  if (error) return <p className="text-red-600">Error: {error}</p>;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Manage Products</h1>

      {/* Add New Product Button */}
      <div className="mb-4">
        <button
          className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
          onClick={() => setIsAddModalOpen(true)}
        >
          + Add New Product
        </button>
      </div>    

      {/* Products Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded-lg shadow">
          <thead>
            <tr>
              <th className="py-3 px-6 bg-gray-200 text-left">Name</th>
              <th className="py-3 px-6 bg-gray-200 text-left">Price</th>
              <th className="py-3 px-6 bg-gray-200 text-left">Status</th>
              <th className="py-3 px-6 bg-gray-200 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id} className="border-t">
                <td className="py-3 px-6">{product.name}</td>
                <td className="py-3 px-6">${product.price.toFixed(2)}</td>
                <td className="py-3 px-6">
                  {product.disabled ? (
                    <span className="text-red-500 font-semibold">Disabled</span>
                  ) : (
                    <span className="text-green-600 font-semibold">Active</span>
                  )}
                </td>
                <td className="py-3 px-6 space-x-2">
                  {product.disabled ? (
                    <button
                      onClick={() => reactivateProduct(product.id)}
                      className="bg-green-600 text-white py-1 px-3 rounded hover:bg-green-700"
                    >
                      Reactivate
                    </button>
                  ) : (
                    <button
                      onClick={() => disableProduct(product.id)}
                      className="bg-red-600 text-white py-1 px-3 rounded hover:bg-red-700"
                    >
                      Disable
                    </button>
                    
                  )}
                  <button
                    onClick={() => openEditModal(product)}
                    className="bg-yellow-500 text-white py-1 px-3 rounded hover:bg-yellow-600"
                  >
                    Edit
                  </button>
                </td>
            
              </tr>
            ))}
          </tbody>
        </table>
      </div>

       {/* Add Modal */}
      <Modal isOpen={isAddModalOpen} onClose={() => { setIsAddModalOpen(false); resetForm(); }}>
        <h2 className="text-2xl font-bold mb-4">Add New Product</h2>
        <ProductForm
          product={newProduct}
          setProduct={setNewProduct}
          onSubmit={addProduct}
          submitLabel="Add Product"
        />
      </Modal>

      {/* Edit Modal */}
      <Modal isOpen={isEditModalOpen} onClose={() => { setIsEditModalOpen(false); resetForm(); }}>
        <h2 className="text-2xl font-bold mb-4">Edit Product</h2>
        <ProductForm
          product={newProduct}
          setProduct={setNewProduct}
          onSubmit={handleUpdateProduct}
          submitLabel="Update Product"
        />
      </Modal>
    </div>
  );
}

export default ProductsPage;
