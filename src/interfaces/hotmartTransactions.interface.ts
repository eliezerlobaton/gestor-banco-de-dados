export interface HotmartTransacoes {
  items: Item[]
  page_info: PageInfo
}

interface Item {
  product: Product
  buyer: Buyer
  producer: Producer
  purchase: Purchase
}

interface Product {
  name: string
  id: number
}

interface Buyer {
  name: string
  ucode: string
  email: string
}

interface Producer {
  name: string
  ucode: string
}

interface Purchase {
  transaction: string
  order_date: number
  approved_date: number
  status: string
  recurrency_number: number
  is_subscription: boolean
  commission_as: string
  price: Price
  payment: Payment
  tracking: Tracking
  warranty_expire_date: number
  offer: Offer
  hotmart_fee: HotmartFee
}

interface Price {
  value: number
  currency_code: string
}

interface Payment {
  method: string
  installments_number: number
  type: string
}

interface Tracking {
  source_sck: string
  source: string
  external_code: string
}

interface Offer {
  payment_mode: string
  code: string
}

interface HotmartFee {
  total: number
  fixed: number
  currency_code: string
  base: number
}

interface PageInfo {
  total_results: number
  next_page_token: string
  prev_page_token: string
  results_per_page: number
}
