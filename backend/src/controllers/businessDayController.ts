import { Request,  Response } from "express";
import * as businessDayService from "../services/businessDayService";

export const getCurrentBusinessDay = async (_req: Request, res: Response) => {
  try {
    const day = await businessDayService.fetchCurrentBusinessDay();
    res.json(day);
  } catch (error) {
    res.status(500).json({ message: "Error fetching business day", error });
  }
};

export const startBusinessDay = async (_req: Request, res: Response) => {
  try {
    const currentDay = await businessDayService.fetchCurrentBusinessDay();
    if (currentDay) {
      return res.status(400).json({ message: "A business day is already running!" });
    }
    const newDay = await businessDayService.startBusinessDay();
    res.status(201).json(newDay);
  } catch (error) {
    res.status(500).json({ message: "Error starting business day", error });
  }
};

export const closeBusinessDay = async (_req: Request, res: Response) => {
  try {
    const currentDay = await businessDayService.fetchCurrentBusinessDay();
    if (!currentDay) {
      return res.status(400).json({ message: "No active business day to close!" });
    }
    const closedDay = await businessDayService.closeBusinessDay(currentDay.id);
    res.json(closedDay);
  } catch (error) {
    res.status(500).json({ message: "Error closing business day", error });
  }
};
