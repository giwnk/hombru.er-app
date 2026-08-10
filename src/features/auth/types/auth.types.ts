export interface ActionResponse<T = null> {
  success: boolean;
  message?: string;
  error?: string;
  data?: T;
}

export interface UserProfileType {
  id: string;
  full_name: string;
  username: string;
  avatar_url?: string;
  bio?: string;
  created_at?: string;
}

export interface UserSessionType {
  user_id: string;
  email: string;
  access_token: string;
}
