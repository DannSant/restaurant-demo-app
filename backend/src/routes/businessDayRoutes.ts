import { Router } from "express";
import { getCurrentBusinessDay, startBusinessDay, closeBusinessDay } from "../controllers/businessDayController";
import { asyncHandler } from "../utils/asyncHandler";

const router = Router();

router.get("/", asyncHandler(getCurrentBusinessDay));
router.post("/start", asyncHandler(startBusinessDay));
router.post("/close", asyncHandler(closeBusinessDay));

export default router;
