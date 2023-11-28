export interface GuruAssinaturas {
  current_page: number
  data: Assinatura[]
  first_page_url: string
  from: number
  last_page: number
  last_page_url: string
  links: Link[]
  next_page_url: any
  path: string
  per_page: number
  prev_page_url: any
  to: number
  total: number
}

export interface Assinatura {
  cancel_at_cicle_end: boolean
  cancelled_at: any
  charged_every_days: number
  charged_times: number
  contact: Contact
  created_at: number
  id: string
  last_status: string
  last_status_at: number
  next_cycle_at: string
  payment_method: string
  product: Product
  started_at: number
  subscription_code: string
  trial_finished_at: any
  trial_started_at: any
  updated_at: number
}

interface Contact {
  doc: string
  email: string
  id: string
  name: string
  phone_local_code: string
  phone_number: string
}

interface Product {
  id: string
  marketplace_id: string
  marketplace_name: string
  name: string
}

interface Link {
  url?: string
  label: string
  active: boolean
}
