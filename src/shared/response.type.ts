export interface ActionResponse<T = null> {
  success: boolean;
  message?: string;
  error?: string;
  data?: T;
}
