export interface Memberkit {
  id: number
  full_name: string
  email: string
  bio: string
  profile_image_url: string
  blocked: boolean
  unlimited: boolean
  sign_in_count: number
  current_sign_in_at: string
  created_at: string
  updated_at: string
  student: Aluno[]
  enrollments: Enrollment[]
  memberships: Membership[]
}

interface Enrollment {
  id: number
  status: string
  course_id: number
  classroom_id: number
  expire_date: string
}

interface Membership {
  id: number
  status: string
  membership_level_id: number
  expire_date: string
}

export interface Aluno {
  id: number;
  full_name: string;
  email: string;
  profile_image_url: string;
  sign_in_count: number;
  current_sign_in_at: string;
  created_at: string;
  updated_at: string;
}