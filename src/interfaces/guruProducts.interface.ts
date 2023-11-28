export interface guruProducts {
  current_page: number;
  data: Product[];
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

export interface Product {
  created_at: number;
  group?: Group;
  id: string;
  is_active: number;
  is_deletable: number;
  is_hidden: number;
  is_trackable: number;
  marketplace_id: string;
  marketplace_name: string;
  name: string;
  producer: Group;
  type: string;
  updated_at: number;
}

interface Group {
  id: string;
  name: string;
}