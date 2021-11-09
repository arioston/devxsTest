import React, { useEffect } from "react";
import {
  keyValidationRequest,
  loginRequest,
  sendEmailRequest,
  signupRequest,
} from "../../services/auth";
import { useMutation } from "react-query";
import jwt_decode from "jwt-decode";

export interface UserLoginInfo {
  email: string;
  password: string;
}

export interface Token {
  accessToken: string;
}

export interface AuthContextType {
  user: any;
  isAuthenticated: boolean;
  signin: (email: string, password: string) => Promise<string>;
  signup: (name: string, email: string, password: string) => Promise<string>;
  signout: () => void;
  keyVerification: (key: string) => Promise<string>;
  sendEmail: (email: string) => Promise<void>;
}

let tokenChangeFlag = 1;

export const TOKEN_KEY = "@devx-Token";

export const setToken = (token?: string) => {
  if (token) {
    tokenChangeFlag++;
    localStorage.setItem(TOKEN_KEY, token);
  }
};

export const cleanTokenKey = () => {
  localStorage.removeItem(TOKEN_KEY);
  tokenChangeFlag++;
};

export const getToken = () => localStorage.getItem(TOKEN_KEY);

const AuthContext = React.createContext<AuthContextType>(null!);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [accessToken, setAccessToken] = React.useState<
    string | undefined | null
  >(getToken());
  const [user, setUser] = React.useState<any>(null);

  const loginQuery = useMutation(loginRequest, {
    onSuccess: (data) => {
      setAccessToken(data);
      setToken(data);
    },
  });

  const signupQuery = useMutation(signupRequest);

  const keyVerificationQuery = useMutation(keyValidationRequest, {
    onSuccess: (data) => {
      setAccessToken(data);
      setToken(data);
    },
  });

  const sendEmailQuery = useMutation(sendEmailRequest);

  useEffect(() => {
    if (accessToken) {
      const user = jwt_decode(accessToken);
      setUser(user);
    } else {
      setUser(undefined);
      localStorage.removeItem(TOKEN_KEY);
    }
  }, [accessToken, tokenChangeFlag]);

  const signin = (email: string, password: string) => {
    return loginQuery.mutateAsync({ email, password });
  };

  const signup = (name: string, email: string, password: string) => {
    return signupQuery.mutateAsync({ email, password, name });
  };

  const keyVerification = (key: string) => {
    return keyVerificationQuery.mutateAsync(key);
  };

  const sendEmail = (email: string) => {
    return sendEmailQuery.mutateAsync(email);
  };

  const signout = () => {
    setAccessToken(undefined);
  };

  const isAuthenticated = !!accessToken;

  const value = {
    user,
    signin,
    signout,
    signup,
    sendEmail,
    keyVerification,
    isAuthenticated,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return React.useContext(AuthContext);
}
