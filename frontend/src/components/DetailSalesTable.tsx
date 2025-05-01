import React from "react";

export type SalesRow = {
    orderId: string;
    name: string;
    unit_price: number;
    tax: number;
    line_total: number;
  };


interface Props {
    rows: SalesRow[];
    sortField: keyof SalesRow;
    sortDirection: "asc" | "desc";
    onSort: (field: keyof SalesRow) => void;
  }

export default function DetailSalesTable({
  rows,
  sortField,
  sortDirection,
  onSort,
}: Props) {
    const getArrow = (field: keyof SalesRow) =>
        sortField === field ? (sortDirection === "asc" ? "↑" : "↓") : "";

  return (
    <div className="overflow-auto max-h-[500px] border rounded shadow">
      <table className="min-w-full table-auto text-sm">
        <thead className="bg-gray-100 sticky top-0">
          <tr>
            <th className="px-4 py-2 text-left">Order ID</th>
            <th
              className="px-4 py-2 text-left cursor-pointer hover:text-blue-600"
              onClick={() => onSort("name")}
            >
              Product {getArrow("name")}
            </th>
            <th
              className="px-4 py-2 text-right cursor-pointer hover:text-blue-600"
              onClick={() => onSort("unit_price")}
            >
              Unit Price {getArrow("unit_price")}
            </th>
            <th
              className="px-4 py-2 text-right cursor-pointer hover:text-blue-600"
              onClick={() => onSort("tax")}
            >
              Tax {getArrow("tax")}
            </th>
            <th
              className="px-4 py-2 text-right cursor-pointer hover:text-blue-600"
              onClick={() => onSort("line_total")}
            >
              Line Total {getArrow("line_total")}
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, idx) => (
            <tr key={idx} className="border-t">
              <td className="px-4 py-2">{row.orderId}</td>
              <td className="px-4 py-2">{row.name}</td>
              <td className="px-4 py-2 text-right">${row.unit_price.toFixed(2)}</td>
              <td className="px-4 py-2 text-right">${row.tax.toFixed(2)}</td>
              <td className="px-4 py-2 text-right font-semibold">
                ${row.line_total.toFixed(2)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
