import { createContext, useContext } from 'react';

export interface AuthContextType {
  userToken: string | null;
  setUserToken: (token: string | null) => void;
  signOut: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const useAuth = () => useContext(AuthContext);