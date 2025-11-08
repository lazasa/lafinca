export interface User {
  id: string;
  username: string;
  color: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface TokenPayload {
  userId: string;
  username: string;
  type: 'access' | 'refresh';
  iat: number;
  exp: number;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  accessToken?: string;
  user?: User;
  error?: string;
}
