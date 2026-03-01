export interface Customer {
  id: string;
  name: string;
  mobile: string;
  address: string;
  created_at: string;
}

export interface ServicePreset {
  id: string;
  preset_name: string;
  default_labour_cost: number;
  default_base_cost: number;
  description: string;
}

export interface SparePart {
  id: string;
  part_name: string;
  price: number;
}

export interface Job {
  id: string;
  customer_id: string;
  preset_id: string;
  selected_parts: SparePart[];
  subtotal: number;
  discount_type: 'percentage' | 'fixed' | null;
  discount_value: number;
  final_amount: number;
  payment_status: 'paid' | 'pending' | 'partial';
  service_date: string;
  next_service_date: string;
  created_at: string;
  customer?: Customer;
  preset?: ServicePreset;
}

export interface Expense {
  id: string;
  expense_type: 'fuel' | 'helper' | 'parts' | 'other';
  amount: number;
  date: string;
  created_at: string;
}
