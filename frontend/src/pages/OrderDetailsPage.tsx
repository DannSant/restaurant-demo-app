import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { fetchOrderDetails, deleteOrderDetail, createOrderDetail } from "../store/slices/orderDetailsSlice";
import { closeOrder, fetchOrders, updateOrder } from "../store/slices/ordersSlice";
import { Order } from "../models/Order";
import { OrderDetail } from "../models/OrderDetail";
import { Product } from "../models/Product";
import { Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import OrderStatusBadge from "../components/OrderStatusBadge";


function OrderDetailsPage() {
    const { id: orderId } = useParams();
    const dispatch = useAppDispatch();
    const order = useAppSelector((state) =>
        state.orders.orders.find((o) => o.id === orderId)
    );
    const { orderDetails } = useAppSelector((state) => state.orderDetails);
    const { products } = useAppSelector((state) => state.products);

    const [clientName, setClientName] = useState("");
    const [tableNumber, setTableNumber] = useState("");
    const [notes, setNotes] = useState("");
    const [showAddItemPane, setShowAddItemPane] = useState(false);
    const [searchKeyword, setSearchKeyword] = useState("");
    const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);

    const subtotal = orderDetails.reduce((sum, item) => sum + item.unit_price, 0);
    const tax = orderDetails.reduce((sum, item) => sum + item.tax, 0);
    const total = orderDetails.reduce((sum, item) => sum + item.line_total, 0);

    useEffect(() => {
        if (orderId) {
            dispatch(fetchOrders(order?.business_day_id || ""));
            dispatch(fetchOrderDetails(orderId));
        }
    }, [dispatch, orderId]);

    useEffect(() => {
        if (order) {
            setClientName(order.client_name || "");
            setTableNumber(order.table_number ? String(order.table_number) : "");
            setNotes(order.notes || "");
        }
    }, [order]);

    const handleUpdateOrder = async () => {
        try {
            if (!order) return;
            await dispatch(updateOrder({
                id: order.id,
                updatedFields: {
                    client_name: clientName,
                    table_number: parseInt(tableNumber),
                    notes,
                },
            })).unwrap();
            toast.success("Order updated");
        } catch (error) {
            toast.error("Failed to update order");
        }
    };

    const handleDeleteDetail = async (detailId: string) => {
        try {
            await dispatch(deleteOrderDetail(detailId)).unwrap();
            toast.success("Item removed");
        } catch (error) {
            toast.error("Failed to delete item");
        }
    };

    const handleSearch = () => {
        const filtered = products.filter((p) =>
            p.name.toLowerCase().includes(searchKeyword.toLowerCase())
        );
        setFilteredProducts(filtered);
    };

    const handleAddProductToOrder = async (product: Product) => {
        if (!orderId) return;
        try {
            await dispatch(createOrderDetail({
                order_id: orderId,
                menu_item_id: product.id,
                unit_price: product.price,
                tax: product.price * 0.1, // 10% tax example
                line_total: product.price * 1.1,
            })).unwrap();
            toast.success(`${product.name} added to order`);
            setShowAddItemPane(false);
        } catch (error) {
            toast.error("Failed to add item");
        }
    };

    const finalizeOrder = async () => {
        try {
            if (!order) return;
            Swal.fire({
                title: "Do you want to finish this order?",
                showDenyButton: true,
                showCancelButton: true,
                confirmButtonText: "Confirm",

            }).then(async (result) => {
                /* Read more about isConfirmed, isDenied below */
                if (result.isConfirmed) {
                    await dispatch(closeOrder({
                        id: order.id,
                        updatedFields: {
                            id: order.id,
                            client_name: clientName,
                            table_number: parseInt(tableNumber),
                            notes,
                        },
                    })).unwrap();
                    toast.success("Order closed");
                }
            });

        } catch (error) {
            toast.error("Failed to update order");
        }
    }

    const cancelOrder = async () => {

    }

    const getProductName = (menuItemId: string) => {
        return products.find((p) => p.id === menuItemId)?.name || "Unknown";
    };
    

    return (
        <div className="p-4 space-y-4">
            <div className="flex justify-between items-start gap-4">
                <div className="space-y-2 w-full">
                    <div className="flex gap-4">
                        <div className="w-1/3">
                            <label className="block text-sm font-medium text-gray-600">Table Number</label>
                            <input
                                type="text"
                                value={tableNumber}
                                onChange={(e) => setTableNumber(e.target.value)}
                                className="w-full border rounded p-2"
                            />
                        </div>
                        <div className="w-1/3">
                            <label className="block text-sm font-medium text-gray-600">Client Name</label>
                            <input
                                type="text"
                                value={clientName}
                                onChange={(e) => setClientName(e.target.value)}
                                className="w-full border rounded p-2"
                            />
                        </div>
                        <div className="w-1/3">
                            <label className="block text-sm font-medium text-gray-600">Notes</label>
                            <input
                                type="text"
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                                className="w-full border rounded p-2"
                            />
                        </div>
                    </div>

                    <div className="flex gap-6 pt-2">
                        <div>
                            <span className="text-sm text-gray-500">Subtotal</span>
                            <div className="font-bold">${subtotal.toFixed(2)}</div>
                        </div>
                        <div>
                            <span className="text-sm text-gray-500">Tax</span>
                            <div className="font-bold">${tax.toFixed(2)}</div>
                        </div>
                        <div>
                            <span className="text-sm text-gray-500">Total</span>
                            <div className="font-bold">${total.toFixed(2)}</div>
                        </div>
                        <div>
                            <button
                                disabled={!order || order.status.toUpperCase() !== "OPEN"}
                                onClick={finalizeOrder}
                                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                            >
                                Finalize Order
                            </button>
                        </div>
                        <div>
                            <button
                               disabled={!order || order.status.toUpperCase() !== "OPEN"}
                                onClick={cancelOrder}
                                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                            >
                                Cancel Order
                            </button>
                        </div>
                        <div>
                        {order && <OrderStatusBadge status={order.status} />}
                        </div>
                    </div>
                </div>

                <div className="flex flex-col gap-2">
                    <button
                     disabled={!order || order.status.toUpperCase() !== "OPEN"}
                        onClick={handleUpdateOrder}
                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                    >
                        Update Order
                    </button>
                    <button
                     disabled={!order || order.status.toUpperCase() !== "OPEN"}
                        onClick={() => setShowAddItemPane(true)}
                        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                    >
                        + Add Item
                    </button>
                </div>
            </div>

            {/* Order Items Table */}
            <table className="min-w-full bg-white rounded shadow">
                <thead>
                    <tr className="bg-gray-100 text-left">
                        <th className="px-4 py-2">ID</th>
                        <th className="px-4 py-2">Item</th>
                        <th className="px-4 py-2">Unit Price</th>
                        <th className="px-4 py-2">Tax</th>
                        <th className="px-4 py-2">Line Total</th>
                        <th className="px-4 py-2">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {orderDetails.map((item) => (
                        <tr key={item.id} className="border-t">
                            <td className="px-4 py-2 text-sm text-gray-700">{item.id}</td>
                            <td className="px-4 py-2 text-sm text-gray-800">{getProductName(item.menu_item_id)}</td>
                            <td className="px-4 py-2 text-sm">${item.unit_price.toFixed(2)}</td>
                            <td className="px-4 py-2 text-sm">${item.tax.toFixed(2)}</td>
                            <td className="px-4 py-2 text-sm">${item.line_total.toFixed(2)}</td>
                            <td className="px-4 py-2">
                                <button
                                    onClick={() => handleDeleteDetail(item.id)}
                                    className="text-red-600 hover:text-red-800"
                                >
                                    <Trash2 size={18} />
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Side Pane */}
            {showAddItemPane && (
                <div className="fixed right-0 top-0 w-96 h-full bg-white shadow-lg p-4 z-50 overflow-y-auto">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-lg font-semibold">Add Item</h2>
                        <button
                            className="text-gray-500 hover:text-gray-700"
                            onClick={() => setShowAddItemPane(false)}
                        >
                            ✕
                        </button>
                    </div>

                    <input
                        type="text"
                        value={searchKeyword}
                        onChange={(e) => setSearchKeyword(e.target.value)}
                        className="w-full border rounded p-2 mb-2"
                        placeholder="Search product..."
                    />
                    <div className="flex gap-2 mb-4">
                        <button
                            className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                            onClick={handleSearch}
                        >
                            Search
                        </button>
                        <button
                            className="bg-gray-400 text-white px-3 py-1 rounded hover:bg-gray-500"
                            onClick={() => { setFilteredProducts([]); setSearchKeyword(""); }}
                        >
                            Cancel
                        </button>
                    </div>

                    {filteredProducts.map((product) => (
                        <div
                            key={product.id}
                            className="flex items-center gap-3 px-4 py-2 hover:bg-gray-100 rounded cursor-pointer"
                            onClick={() => handleAddProductToOrder(product)}
                        >
                            <div className="w-8 h-8 rounded-full bg-gray-400 flex items-center justify-center">
                                <svg width="16" height="16" fill="currentColor" className="text-white"><path d="M2 2h12v12H2z" /></svg>
                            </div>
                            <div className="text-sm text-gray-800">{product.name}</div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default OrderDetailsPage;
