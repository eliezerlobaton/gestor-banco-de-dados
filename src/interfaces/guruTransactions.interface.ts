export interface Transactions {
  current_page: number;
  data: Datum[];
  first_page_url: string;
  from: number;
  last_page: number;
  last_page_url: string;
  next_page_url: string;
  path: string;
  per_page: number;
  prev_page_url?: any;
  to: number;
  total: number;
}

export interface Datum {
  affiliations: any[];
  contact: Contact;
  contracts: any[];
  dates: Dates;
  ecommerces: any[];
  has_order_bump: number;
  id: string;
  infrastructure: Infrastructure;
  invoice: Invoice;
  is_order_bump: number;
  last_transaction: any[];
  payment: Payment;
  product: Product;
  shipment: Shipment;
  shipping: Shipping;
  status: string;
  subscription: Subscription;
  trackings: Trackings;
  type: string;
}

interface Trackings {
  source?: any;
  checkout_source?: any;
  utm_source?: any;
  utm_campaign?: any;
  utm_medium?: any;
  utm_content?: any;
  utm_term?: any;
  pptc: any[];
}

interface Subscription {
  can_cancel: number;
  canceled_at?: any;
  charged_every_days: number;
  charged_times: number;
  id: string;
  internal_id: string;
  last_status: string;
  last_status_at: number;
  name: string;
  started_at: number;
  subscription_code: string;
  trial_days: number;
  trial_finished_at?: any;
  trial_started_at?: any;
}

interface Shipping {
  name: string;
  value: number;
}

interface Shipment {
  carrier: string;
  service: string;
  tracking: string;
  value: number;
  status: string;
  delivery_time: string;
}

interface Product {
  id: string;
  image_url: string;
  internal_id: string;
  marketplace_id: string;
  marketplace_name: string;
  name: string;
  offer: Offer;
  producer: Producer;
  qty: number;
  total_value: number;
  type: string;
  unit_value: number;
}

interface Producer {
  marketplace_id: string;
  name: string;
  contact_email: string;
}

interface Offer {
  id: string;
  name: string;
}

export interface Payment {
  affiliate_value: number;
  acquirer: Acquirer;
  can_try_again: number;
  coupon: Coupon;
  currency: string;
  discount_value: number;
  gross: number;
  installments: Installments;
  marketplace_id: string;
  marketplace_name: string;
  marketplace_value: number;
  method: string;
  net: number;
  processing_times: Processingtimes;
  refund_reason: string;
  refuse_reason: string;
  tax: Tax;
  total: number;
  pix: Pix;
}

interface Pix {
  qrcode: Qrcode;
  expiration_date: number;
}

interface Qrcode {
  signature: string;
  url: string;
}

interface Tax {
  value: number;
  rate: number;
}

interface Processingtimes {
  started_at: string;
  finished_at: string;
  delay_in_seconds: number;
}

interface Installments {
  value: number;
  qty: number;
  interest: number;
}

export interface Coupon {
  coupon_value: any;
  coupon_code: string;
  final_value: number;
  last_sent_at: number;
  incidence_type: string;
  incidence_field: string;
  incidence_value: number;
  id: string;
}

interface Acquirer {
  code: string;
  message: string;
  name: string;
  tid: number;
}

interface Invoice {
  charge_at: string;
  created_at: string;
  cycle: number;
  discount_value: number;
  id: string;
  increment_value: number;
  period_end: string;
  period_start: string;
  status: string;
  tax_value: number;
  tries: number;
  try: number;
  type: string;
  value: number;
}

interface Infrastructure {
  ip: string;
  city: string;
  region: string;
  country: string;
  user_agent: string;
  city_lat_long: string;
}

interface Dates {
  canceled_at?: any;
  confirmed_at?: any;
  created_at: number;
  expires_at: string;
  ordered_at: number;
  unavailable_until?: any;
  updated_at: number;
  warranty_until?: any;
}

export interface Contact {
  id: string;
  name: string;
  company_name: string;
  email: string;
  doc: string;
  phone_number: string;
  phone_local_code: string;
  address: string;
  address_number: string;
  address_comp: string;
  address_district: string;
  address_city: string;
  address_state: string;
  address_state_full_name: string;
  address_country: string;
  address_zip_code: string;
  lead: any[];
}