import { Request, Response } from "express";
import * as service from "../services/orderDetailsService";

export const getOrderDetails = async (req: Request, res: Response) => {
  const { order_id } = req.query;

  if (!order_id || typeof order_id !== "string") {
    return res.status(400).json({ message: "Missing or invalid order_id" });
  }

  try {
    const details = await service.fetchOrderDetails(order_id);   
    res.json(details);
  } catch (error) {
    res.status(500).json({ message: "Error fetching order details", error });
  }
};

export const createOrderDetail = async (req: Request, res: Response) => {
  try {
    const detail = await service.createOrderDetail(req.body);
    res.status(201).json(detail);
  } catch (error) {
    res.status(500).json({ message: "Error creating order detail", error });
  }
};

export const updateOrderDetail = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updated = await service.updateOrderDetail(id, req.body);
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: "Error updating order detail", error });
  }
};

export const deleteOrderDetail = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await service.deleteOrderDetail(id);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: "Error deleting order detail", error });
  }
};
