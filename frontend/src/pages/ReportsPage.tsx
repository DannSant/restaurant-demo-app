import { useEffect, useMemo, useState } from "react";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { fetchOrdersReport } from "../store/slices/ordersSlice";
import DetailSalesTable, { SalesRow } from "../components/DetailSalesTable";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from "recharts";
import dayjs from "dayjs";


  

export default function ReportsPage() {
    const dispatch = useAppDispatch();
    const { orders } = useAppSelector((state) => state.orders);
    const { products } = useAppSelector((state) => state.products);

    const [activeTab, setActiveTab] = useState<"current" | "historic" | "details">("current");
    const [fromDate, setFromDate] = useState(dayjs().format("YYYY-MM-DD"));
    const [toDate, setToDate] = useState(dayjs().format("YYYY-MM-DD"));
    const [sortField, setSortField] = useState<"name" | "unit_price" | "tax" | "line_total">("line_total");
    const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");


    useEffect(() => {
        const today = dayjs().format("YYYY-MM-DD");
        if (activeTab === "current") {
            dispatch(fetchOrdersReport({ status: "PAID", from: today, to: today }));
        }
    }, [activeTab, dispatch]);

    const handleHistoricReport = () => {
        dispatch(fetchOrdersReport({ status: "PAID", from: fromDate, to: toDate }));
    };

    const handleDetailSalesReport = () => {
        dispatch(fetchOrdersReport({ status: "PAID", from: fromDate, to: toDate }));
    };

    const detailedSalesData = useMemo(() => {
        const rows: SalesRow[] = [];
      
        for (const order of orders) {
          if (order.orderDetails) {
            for (const detail of order.orderDetails) {
              const product = products.find((p) => p.id === detail.menu_item_id);
              rows.push({
                orderId: order.id,
                name: product?.name || "Unknown",
                unit_price: detail.unit_price,
                tax: detail.tax,
                line_total: detail.line_total,
              });
            }
          }
        }
      
        // ✅ Sort before returning
        return rows.sort((a, b) => {
          const aVal = a[sortField];
          const bVal = b[sortField];
      
          if (typeof aVal === "number" && typeof bVal === "number") {
            return sortDirection === "asc" ? aVal - bVal : bVal - aVal;
          }
      
          if (typeof aVal === "string" && typeof bVal === "string") {
            return sortDirection === "asc"
              ? aVal.localeCompare(bVal)
              : bVal.localeCompare(aVal);
          }
      
          return 0;
        });
      }, [orders, products, sortField, sortDirection]);
      

    const topSellingProducts = useMemo(() => {
        const counts: Record<string, number> = {};
        for (const order of orders) {
            if (order.orderDetails) {
                for (const detail of order.orderDetails) {
                    counts[detail.menu_item_id] = (counts[detail.menu_item_id] || 0) + 1;
                }
            }
        }

        return Object.entries(counts)
            .map(([menu_item_id, quantity]) => {
                const product = products.find((p) => p.id === menu_item_id);
                return { name: product?.name || "Unknown", quantity };
            })
            .sort((a, b) => b.quantity - a.quantity);
    }, [orders, products]);

    const summary = useMemo(() => {
        const total = orders.reduce((sum, order) => {
            return (
                sum +
                (order.orderDetails?.reduce((s, d) => s + d.line_total, 0) ?? 0)
            );
        }, 0);
        const count = orders.length;
        const average = count > 0 ? total / count : 0;
        return { total, count, average };
    }, [orders]);

    const handleSort = (field: keyof SalesRow) => {
        if (field === "orderId") {
            console.warn("Sorting by 'orderId' is not supported.");
            return;
        }
        if (sortField === field) {
            setSortDirection(sortDirection === "asc" ? "desc" : "asc");
        } else {
            setSortField(field as "name" | "unit_price" | "tax" | "line_total");
            setSortDirection("asc");
        }
    };

    return (
        <div className="p-6 space-y-8">
            <h1 className="text-3xl font-bold">Reports</h1>



            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white p-4 rounded shadow">
                    <p className="text-gray-500">Total Revenue</p>
                    <h2 className="text-2xl font-bold">${summary.total.toFixed(2)}</h2>
                </div>
                <div className="bg-white p-4 rounded shadow">
                    <p className="text-gray-500">Total Orders</p>
                    <h2 className="text-2xl font-bold">{summary.count}</h2>
                </div>
                <div className="bg-white p-4 rounded shadow">
                    <p className="text-gray-500">Avg. Order Value</p>
                    <h2 className="text-2xl font-bold">${summary.average.toFixed(2)}</h2>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-4 border-b mb-6">
                {["current", "historic", "details"].map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab as any)}
                        className={`py-2 px-4 capitalize ${activeTab === tab ? "border-b-2 border-blue-600 font-semibold" : "text-gray-500"
                            }`}
                    >
                        {tab === "current"
                            ? "Current Summary"
                            : tab === "historic"
                                ? "Historic Report"
                                : "Detail Sales"}
                    </button>
                ))}
            </div>

            {/* Current Summary */}
            {activeTab === "current" && (
                <>
                    <h2 className="text-xl font-bold mb-2">Top Selling Products Today</h2>
                    <div className="bg-white p-4 rounded shadow w-full h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={topSellingProducts}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                <Bar dataKey="quantity" fill="#8884d8" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </>
            )}

            {/* Historic Report */}
            {activeTab === "historic" && (
                <div className="space-y-4">
                    <div className="flex gap-4 items-end">
                        <div>
                            <label className="block text-sm text-gray-600">From</label>
                            <input
                                type="date"
                                value={fromDate}
                                onChange={(e) => setFromDate(e.target.value)}
                                className="border rounded px-3 py-1"
                            />
                        </div>
                        <div>
                            <label className="block text-sm text-gray-600">To</label>
                            <input
                                type="date"
                                value={toDate}
                                onChange={(e) => setToDate(e.target.value)}
                                className="border rounded px-3 py-1"
                            />
                        </div>
                        <button
                            onClick={handleHistoricReport}
                            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                        >
                            Generate Report
                        </button>
                    </div>

                    <div className="bg-white p-4 rounded shadow w-full h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={topSellingProducts}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                <Bar dataKey="quantity" fill="#82ca9d" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            )}


            {/* Detailed Sales Report */}
            { activeTab === "details" && (
                <div className="space-y-4">
                    <div className="flex gap-4 items-end">
                        <div>
                            <label className="block text-sm text-gray-600">From</label>
                            <input
                                type="date"
                                value={fromDate}
                                onChange={(e) => setFromDate(e.target.value)}
                                className="border rounded px-3 py-1"
                            />
                        </div>
                        <div>
                            <label className="block text-sm text-gray-600">To</label>
                            <input
                                type="date"
                                value={toDate}
                                onChange={(e) => setToDate(e.target.value)}
                                className="border rounded px-3 py-1"
                            />
                        </div>
                        <button
                            onClick={handleDetailSalesReport}
                            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                        >
                            Generate Table
                        </button>
                    </div>

                    <DetailSalesTable
                        rows={detailedSalesData}
                        sortField={sortField}
                        sortDirection={sortDirection}
                        onSort={handleSort}
                    />
                </div>
            )}

        </div>
    );
}
