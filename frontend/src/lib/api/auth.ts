import { request } from './client';

export type TokenResponse = {
  access_token: string;
  token_type: string;
};

export async function login(identifier: string, password: string): Promise<TokenResponse> {
  return request<TokenResponse>('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ identifier, password }),
  });
}

export async function me(token: string): Promise<any> {
  return request<any>('/auth/me', {
    method: 'GET',
    headers: { Authorization: `Bearer ${token}` },
  });
}

