interface GuruOffers {
  current_page: number;
  data: Offers[];
  first_page_url: string;
  from: number;
  last_page: number;
  last_page_url: string;
  next_page_url?: any;
  path: string;
  per_page: number;
  prev_page_url?: any;
  to: number;
  total: number;
}

export interface Offers {
  cash_discount: number;
  checkout_url: string;
  created_at: number;
  currency: string;
  friendly_url: string;
  id: string;
  installments: Installments;
  is_active: number;
  is_deletable: number;
  name: string;
  payment_types: string[];
  plan: Plan;
  units_per_sale: number;
  updated_at: number;
  value: number;
}

export interface Plan {
  cycles: string;
  discount: Discount;
  increment: Discount;
  interval: number;
  interval_type: string;
  provider: string;
  split_cycles: number;
  trial_days: number;
}

interface Discount {
  value: number;
  cycles: number;
}

interface Installments {
  automatic: number;
  default: number;
  interest_rate: number;
  max_with_interest: number;
  max_without_interest: number;
}