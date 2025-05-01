import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import {
  fetchOrders,
  createOrder as createOrderThunk,
} from "../store/slices/ordersSlice";
import { fetchCurrentBusinessDay } from "../store/slices/businessDaySlice";
import { Order } from "../models/Order";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import Modal from "../components/Modal";

function OrdersPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { currentBusinessDay } = useAppSelector((state) => state.businessDay);
  const { orders, loading } = useAppSelector((state) => state.orders);

  const [showClosed, setShowClosed] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [clientName, setClientName] = useState("");
  const [tableNumber, setTableNumber] = useState("");
  const [notes, setNotes] = useState("");

  const openOrders = orders.filter((o) => o.status === "OPEN");
  const paidOrders = orders.filter((o) => o.status === "PAID");

  useEffect(() => {
    dispatch(fetchCurrentBusinessDay()).unwrap().then((day) => {
      if (day?.id) dispatch(fetchOrders(day.id));
    });
  }, [dispatch]);

  const handleCreateOrder = async () => {
    try {
      if (!currentBusinessDay) return;

      const orderData ={
        business_day_id: currentBusinessDay.id,
        client_name: clientName || null,
        notes: notes || null,
        table_number: parseInt(tableNumber) || null,
      };
     
      const result = await dispatch(
        createOrderThunk(orderData)
      ).unwrap();

      toast.success("Order created!");
      setIsModalOpen(false);
      setClientName("");
      setTableNumber("");
      setNotes("");

      navigate(`/orders/${result.id}`);
    } catch (error) {
      toast.error("Failed to create order.");
    }
  };

  const renderOrderRow = (order: Order) => (
    <tr key={order.id} className="border-t">
      <td className="py-2 px-4">{order.table_number || "-"}</td>
      <td className="py-2 px-4">{order.client_name || "-"}</td>
      <td className="py-2 px-4">
        <span
          className={`text-xs px-2 py-1 rounded-full font-semibold 
            ${order.status === "OPEN" ? "bg-yellow-200 text-yellow-800" : "bg-green-200 text-green-800"}`}
        >
          {order.status}
        </span>
      </td>
      <td className="py-2 px-4">
        <a
          href={`/orders/${order.id}`}
          className="text-blue-600 hover:underline"
        >
          Edit
        </a>
      </td>
    </tr>
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-3xl font-bold">Orders</h1>
        <button
          className={`bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed`}
          disabled={!currentBusinessDay || currentBusinessDay.status !== "RUNNING"}
          onClick={() => setIsModalOpen(true)}
          title={!currentBusinessDay || currentBusinessDay.status !== "RUNNING" ? "A business day needs to be open to create an order" : ""}
        >
          + Create Order
        </button>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <h2 className="text-xl font-semibold mb-4">Create New Order</h2>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleCreateOrder();
          }}
          className="space-y-4"
        >
          <div>
            <label className="block text-gray-700">Table Number</label>
            <input
              type="text"
              value={tableNumber}
              onChange={(e) => setTableNumber(e.target.value)}
              className="w-full border rounded p-2"
            />
          </div>
          <div>
            <label className="block text-gray-700">Client Name</label>
            <input
              type="text"
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
              className="w-full border rounded p-2"
            />
          </div>
          <div>
            <label className="block text-gray-700">Notes</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full border rounded p-2"
            />
          </div>
          <button
            type="submit"
            className="bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700"
          >
            Create Order
          </button>
        </form>
      </Modal>

      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Open Orders</h2>
        <table className="min-w-full bg-white shadow rounded">
          <thead>
            <tr>
              <th className="py-2 px-4 text-left">Table</th>
              <th className="py-2 px-4 text-left">Client</th>
              <th className="py-2 px-4 text-left">Status</th>
              <th className="py-2 px-4 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>{openOrders.map(renderOrderRow)}</tbody>
        </table>
      </div>

      <div className="mb-6">
        <div
          className="cursor-pointer text-gray-700 hover:text-gray-900 mb-2"
          onClick={() => setShowClosed(!showClosed)}
        >
          {showClosed ? "▼" : "▶"} Show Paid Orders
        </div>

        {showClosed && (
          <table className="min-w-full bg-white shadow rounded">
            <thead>
              <tr>
                <th className="py-2 px-4 text-left">Table</th>
                <th className="py-2 px-4 text-left">Client</th>
                <th className="py-2 px-4 text-left">Status</th>
                <th className="py-2 px-4 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>{paidOrders.map(renderOrderRow)}</tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default OrdersPage;
