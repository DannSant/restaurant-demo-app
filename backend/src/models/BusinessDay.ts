export interface BusinessDay {
    id: string;
    business_day_date: string; // Date as YYYY-MM-DD
    start_time: string;         // ISO timestamp
    end_time?: string | null;    // ISO timestamp or null
    status: "RUNNING" | "CLOSED"; // Only two valid statuses
  }