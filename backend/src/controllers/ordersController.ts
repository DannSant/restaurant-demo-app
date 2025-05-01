import { Request, Response } from "express";
import * as ordersService from "../services/ordersService";
import { getOrdersWithDetailsByFilter } from "../services/ordersService";

export const createOrder = async (req: Request, res: Response) => {
  try {
    const { business_day_id, client_name, notes, table_number } = req.body;

    if (!business_day_id) {
      return res.status(400).json({ message: "business_day_id is required" });
    }

    const newOrder = await ordersService.createOrder({
      business_day_id,
      client_name,
      notes,
      table_number,
    });

    res.status(201).json(newOrder);
  } catch (error) {   
    res.status(500).json({ message: "Error creating order", error });
  }
};

export const updateOrder = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updatedFields = req.body;

    const updatedOrder = await ordersService.updateOrder(id, updatedFields);

    res.json(updatedOrder);
  } catch (error) {
    res.status(500).json({ message: "Error updating order", error });
  }
};

export const cancelOrder = async (req: Request, res: Response) => {
  try {
    const { id } = req.body;

    if (!id) {
      return res.status(400).json({ message: "Order id is required" });
    }

    const canceledOrder = await ordersService.updateOrder(id, { status: "CANCELLED" });

    res.json(canceledOrder);
  } catch (error) {
    res.status(500).json({ message: "Error cancelling order", error });
  }
};

export const closeOrder = async (req: Request, res: Response) => {
  try {
    const { id } = req.body;

    if (!id) {
      return res.status(400).json({ message: "Order id is required" });
    }

    const closedOrder = await ordersService.updateOrder(id, { status: "PAID" });

    res.json(closedOrder);
  } catch (error) {
    res.status(500).json({ message: "Error closing order", error });
  }
};

export const getOrders = async (req: Request, res: Response) => {
    try {
      const { business_day_id } = req.query;
  
      const orders = await ordersService.fetchOrders(
        typeof business_day_id === "string" ? business_day_id : undefined
      );
  
      res.json(orders);
    } catch (error) {
      res.status(500).json({ message: "Error fetching orders", error });
    }
  };

  export const getOrdersReport = async (req: Request, res: Response) => {
    const { status = "PAID", from, to } = req.query;
  
    if (!from || !to) {
      return res.status(400).json({ message: "Missing from/to query parameters" });
    }
  
    try {
      const orders = await getOrdersWithDetailsByFilter(
        status.toString(),
        from.toString(),
        to.toString()
      );
      res.json(orders);
    } catch (error) {
      res.status(500).json({ message: "Failed to generate report", error });
    }
  };
  