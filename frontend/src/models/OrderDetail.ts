export interface OrderDetail {
    id: string;
    order_id: string;
    menu_item_id: string;
    unit_price: number;
    tax: number;
    line_total: number;
  }