import { useEffect,useState } from "react";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { fetchCurrentBusinessDay, startBusinessDay as startDayThunk, closeBusinessDay as closeDayThunk } from "../store/slices/businessDaySlice";
import { fetchOrders,} from "../store/slices/ordersSlice";
import { fetchOrderDetails } from "../store/slices/orderDetailsSlice";
import toast from "react-hot-toast";

function OverviewPage() {
  const dispatch = useAppDispatch();
  const [totalSales, setTotalSales] = useState(0);
  const { currentBusinessDay, loading, error } = useAppSelector((state) => state.businessDay);

  useEffect(() => {
    dispatch(fetchCurrentBusinessDay()).unwrap().then(async (day) => {
      if (day?.id) {
        const fetchedOrders = await dispatch(fetchOrders(day.id)).unwrap();

        const paidOrders = fetchedOrders.filter((order) => order.status === "PAID");

        let grandTotal = 0;
        for (const order of paidOrders) {
          const details = await dispatch(fetchOrderDetails(order.id)).unwrap();
          const orderTotal = details.reduce((sum, item) => sum + item.line_total, 0);
          grandTotal += orderTotal;
        }

        setTotalSales(grandTotal);
      }
    });
  }, [dispatch]);

  const startDay = async () => {
    try {
      await dispatch(startDayThunk()).unwrap();
      toast.success("Business day started!");
    } catch (error) {
      console.error(error);
      toast.error("Failed to start business day");
    }
  };

  const closeDay = async () => {
    try {
      await dispatch(closeDayThunk()).unwrap();
      toast.success("Business day closed!");
    } catch (error) {
      console.error(error);
      toast.error("Failed to close business day");
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Today's Sales Overview</h1>

      {loading ? (
        <p>Loading business day info...</p>
      ) : error ? (
        <p className="text-red-600">Error: {error}</p>
      ) : (
        <div className="mb-6 space-y-2">
          {currentBusinessDay && currentBusinessDay.status === "RUNNING" ? (
            <div className="space-y-4">
              <div className="text-green-600 font-bold">
                Business day is RUNNING since {new Date(currentBusinessDay.start_time).toLocaleTimeString()}
              </div>
              <div className="p-6 bg-white rounded-lg shadow w-full max-w-sm">
                <p className="text-gray-500">Total Sales Today</p>
                <h2 className="text-4xl font-bold mt-2">${totalSales.toFixed(2)}</h2> 
              </div>
            </div>
          ) : (
            <div className="text-red-600 font-bold">
              No business day is currently open
            </div>
          )}

        </div>
      )}

      <div className="flex gap-4">
        <button
          onClick={startDay}
          disabled={currentBusinessDay?.status === "RUNNING"}
          className={`py-3 px-6 rounded-lg shadow transition ${currentBusinessDay?.status === "RUNNING"
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700 text-white"
            }`}
        >
          Start Business Day
        </button>

        <button
          onClick={closeDay}
          disabled={!currentBusinessDay || currentBusinessDay.status === "CLOSED"}
          className={`py-3 px-6 rounded-lg shadow transition ${!currentBusinessDay || currentBusinessDay.status === "CLOSED"
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-gray-800 hover:bg-gray-900 text-white"
            }`}
        >
          End Business Day
        </button>
      </div>
    </div>
  );
}

export default OverviewPage;
