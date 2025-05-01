import { Product } from "../models/Product";

interface ProductFormProps {
  product: Omit<Product, "id" | "created_at">;
  setProduct: (product: Omit<Product, "id" | "created_at">) => void;
  onSubmit: () => void;
  submitLabel: string;
}

function ProductForm({ product, setProduct, onSubmit, submitLabel }: ProductFormProps) {
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit();
      }}
      className="space-y-4"
    >
      <div>
        <label className="block text-gray-700">Name</label>
        <input
          type="text"
          value={product.name}
          onChange={(e) => setProduct({ ...product, name: e.target.value })}
          className="w-full border rounded p-2"
          required
        />
      </div>

      <div>
        <label className="block text-gray-700">Description</label>
        <textarea
          value={product.description}
          onChange={(e) => setProduct({ ...product, description: e.target.value })}
          className="w-full border rounded p-2"
          required
        />
      </div>

      <div>
        <label className="block text-gray-700">Price</label>
        <input
          type="number"
          step="0.01"
          value={product.price}
          onChange={(e) => setProduct({ ...product, price: parseFloat(e.target.value) })}
          className="w-full border rounded p-2"
          required
        />
      </div>

      <div>
        <label className="block text-gray-700">Image URL</label>
        <input
          type="text"
          value={product.image_url}
          onChange={(e) => setProduct({ ...product, image_url: e.target.value })}
          className="w-full border rounded p-2"
        />
      </div>

      <button
        type="submit"
        className="bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700"
      >
        {submitLabel}
      </button>
    </form>
  );
}

export default ProductForm;
