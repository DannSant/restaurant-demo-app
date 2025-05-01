import { Router } from "express";
import {
  getOrderDetails,
  createOrderDetail,
  updateOrderDetail,
  deleteOrderDetail,
} from "../controllers/orderDetailsController";
import { asyncHandler } from "../utils/asyncHandler";

const router = Router();

router.get("/", asyncHandler(getOrderDetails));
router.post("/", asyncHandler(createOrderDetail));
router.put("/:id", asyncHandler(updateOrderDetail));
router.delete("/:id", asyncHandler(deleteOrderDetail));

export default router;
