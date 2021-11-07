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

export const TOKEN_KEY = "@devx-Token";

export const setToken = (token?: string) =>
  token && localStorage.setItem(TOKEN_KEY, token);

export const getToken = () => localStorage.getItem(TOKEN_KEY);

const AuthContext = React.createContext<AuthContextType>(null!);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const accessTokenRef = React.useRef<string>();
  const [user, setUser] = React.useState<any>(null);
  const loginQuery = useMutation(loginRequest, {
    onSuccess: (data) => {
      accessTokenRef.current = data;
      setToken(data);
    },
  });

  const signupQuery = useMutation(signupRequest);

  const keyVerificationQuery = useMutation(keyValidationRequest, {
    onSuccess: (data) => {
      accessTokenRef.current = data;
      setToken(data);
    },
  });

  const sendEmailQuery = useMutation(sendEmailRequest);

  useEffect(() => {
    if (accessTokenRef.current) {
      const user = jwt_decode(accessTokenRef.current);
      setUser(user);
    } else {
      setUser(undefined);
      localStorage.removeItem(TOKEN_KEY);
    }
  }, [accessTokenRef.current]);

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
    accessTokenRef.current = undefined;
  };

  const isSuccess = loginQuery.isSuccess;
  const isAuthenticated = isSuccess && !!accessTokenRef.current;

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
