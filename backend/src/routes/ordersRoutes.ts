import { Router } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { createOrder, updateOrder, cancelOrder, closeOrder, getOrders } from "../controllers/ordersController";
import { getOrdersReport } from "../controllers/ordersController";

const router = Router();

router.get("/", asyncHandler(getOrders));
router.post("/", asyncHandler(createOrder));
router.put("/:id", asyncHandler(updateOrder));
router.post("/cancel", asyncHandler(cancelOrder));
router.post("/close", asyncHandler(closeOrder));
router.get("/report", asyncHandler(getOrdersReport));


export default router;
