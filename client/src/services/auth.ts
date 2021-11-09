import api from "./api";

export interface UserLoginInfo {
  name?: string;
  email: string;
  password: string;
}

export interface Token {
  accessToken: string;
}

export const loginRequest = async ({ email, password }: UserLoginInfo) => {
  const response = await api.post<Token>("/auth/signin", {
    email,
    password,
  });
  return response?.data?.accessToken;
};

export const signupRequest = async ({
  name,
  email,
  password,
}: UserLoginInfo) => {
  const response = await api.post<Token>("/auth/signup", {
    name,
    email,
    password,
  });
  return response?.data?.accessToken;
};

export const keyValidationRequest = async (key: string) => {
  const response = await api.get<Token>(`/auth/checked/${key}`);
  return response?.data?.accessToken;
};

export const sendEmailRequest = async (email: string) => {
  await api.post<void>("/auth/send-email", { email });
  return;
};
