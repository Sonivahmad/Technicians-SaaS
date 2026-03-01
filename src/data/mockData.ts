import { Customer, ServicePreset, SparePart, Job, Expense } from '@/types';

export const mockCustomers: Customer[] = [
  { id: '1', name: 'Rajesh Kumar', mobile: '9876543210', address: 'B-12, Sector 62, Noida', created_at: '2025-01-15' },
  { id: '2', name: 'Priya Sharma', mobile: '9876543211', address: 'A-45, Lajpat Nagar, Delhi', created_at: '2025-01-20' },
  { id: '3', name: 'Amit Patel', mobile: '9876543212', address: 'C-8, Vaishali, Ghaziabad', created_at: '2025-02-01' },
  { id: '4', name: 'Sunita Devi', mobile: '9876543213', address: 'D-22, Indirapuram, Ghaziabad', created_at: '2025-02-10' },
];

export const mockPresets: ServicePreset[] = [
  { id: '1', preset_name: 'Gas Refill', default_labour_cost: 500, default_base_cost: 2000, description: 'AC gas refilling service' },
  { id: '2', preset_name: 'General Service', default_labour_cost: 400, default_base_cost: 300, description: 'Cleaning & general maintenance' },
  { id: '3', preset_name: 'Installation', default_labour_cost: 800, default_base_cost: 1500, description: 'New AC installation' },
  { id: '4', preset_name: 'Repair', default_labour_cost: 600, default_base_cost: 500, description: 'AC repair & troubleshooting' },
  { id: '5', preset_name: 'Uninstallation', default_labour_cost: 500, default_base_cost: 300, description: 'AC removal & shifting' },
];

export const mockParts: SparePart[] = [
  { id: '1', part_name: 'Capacitor', price: 350 },
  { id: '2', part_name: 'PCB Board', price: 2500 },
  { id: '3', part_name: 'Fan Motor', price: 1800 },
  { id: '4', part_name: 'Gas R32', price: 2000 },
  { id: '5', part_name: 'Gas R410A', price: 2500 },
  { id: '6', part_name: 'Compressor', price: 5000 },
  { id: '7', part_name: 'Remote', price: 300 },
  { id: '8', part_name: 'Air Filter', price: 200 },
];

export const mockJobs: Job[] = [
  {
    id: '1', customer_id: '1', preset_id: '1', selected_parts: [mockParts[3]],
    subtotal: 4500, discount_type: null, discount_value: 0, final_amount: 4500,
    payment_status: 'paid', service_date: '2025-02-28', next_service_date: '2025-08-28',
    created_at: '2025-02-28',
    customer: mockCustomers[0], preset: mockPresets[0],
  },
  {
    id: '2', customer_id: '2', preset_id: '2', selected_parts: [],
    subtotal: 700, discount_type: 'fixed', discount_value: 100, final_amount: 600,
    payment_status: 'pending', service_date: '2025-02-27', next_service_date: '2025-08-27',
    created_at: '2025-02-27',
    customer: mockCustomers[1], preset: mockPresets[1],
  },
  {
    id: '3', customer_id: '3', preset_id: '4', selected_parts: [mockParts[0], mockParts[1]],
    subtotal: 3950, discount_type: 'percentage', discount_value: 10, final_amount: 3555,
    payment_status: 'paid', service_date: '2025-02-26', next_service_date: '2025-08-26',
    created_at: '2025-02-26',
    customer: mockCustomers[2], preset: mockPresets[3],
  },
];

export const mockExpenses: Expense[] = [
  { id: '1', expense_type: 'fuel', amount: 500, date: '2025-02-28', created_at: '2025-02-28' },
  { id: '2', expense_type: 'helper', amount: 300, date: '2025-02-28', created_at: '2025-02-28' },
  { id: '3', expense_type: 'parts', amount: 1200, date: '2025-02-27', created_at: '2025-02-27' },
  { id: '4', expense_type: 'fuel', amount: 400, date: '2025-02-26', created_at: '2025-02-26' },
];
