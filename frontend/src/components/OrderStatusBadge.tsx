import React from "react";

interface Props {
  status: "OPEN" | "PAID" | "CANCELLED";
}

const statusStyles: Record<Props["status"], string> = {
  OPEN: "bg-yellow-100 text-yellow-800 border-yellow-400",
  PAID: "bg-green-100 text-green-800 border-green-400",
  CANCELLED: "bg-red-100 text-red-800 border-red-400",
};

export default function OrderStatusBadge({ status }: Props) {
  return (
    <span
      className={`px-2 py-1 text-xs font-semibold border rounded-full ${statusStyles[status]}`}
    >
      {status}
    </span>
  );
}
