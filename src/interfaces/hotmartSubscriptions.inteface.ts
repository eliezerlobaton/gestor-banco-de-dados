export interface HotmartAssinatura {
  items: Item[]
  page_info: PageInfo
}

interface Item {
  subscriber_code: string
  subscription_id: number
  status: string
  accession_date: number
  end_accession_date: number
  request_date: number
  date_next_charge: number
  trial: boolean
  transaction: string
  plan: Plan
  product: Product
  price: Price
  subscriber: Subscriber
}

interface Plan {
  name: string
  id: number
  recurrency_period: number
  max_charge_cycles: number
}

interface Product {
  id: number
  name: string
  ucode: string
}

interface Price {
  value: number
  currency_code: string
}

interface Subscriber {
  name: string
  email: string
  ucode: string
}

interface PageInfo {
  total_results: number
  next_page_token: string
  prev_page_token: string
  results_per_page: number
}

