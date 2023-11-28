export interface Contacts {
  current_page: number
  data: Contact[]
  first_page_url: string
  from: number
  last_page: number
  last_page_url: string
  next_page_url: any
  path: string
  per_page: number
  prev_page_url: any
  to: number
  total: number
}

export interface Contact {
  address: string
  address_city: string
  address_comp: string
  address_coutry: any
  address_district: string
  address_number: string
  address_state: string
  address_zip_code: string
  created_at: number
  doc: string
  email: string
  id: string
  name: string
  phone_full_number: string
  phone_local_code: string
  phone_number: string
  updated_at: number
}
