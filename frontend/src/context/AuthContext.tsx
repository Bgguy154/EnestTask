import {
  createContext,
  useState,
  useEffect,
  type ReactNode,
  type JSX,
} from 'react';

import axios from 'axios';

interface User {
  _id: string;
  username: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;

  login: (
    email: string,
    password: string
  ) => Promise<boolean>;

  register: (
    username: string,
    email: string,
    password: string
  ) => Promise<boolean>;

  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>(
  {} as AuthContextType
);

interface Props {
  children: ReactNode;
}

const API_URL = import.meta.env.VITE_API_URL;

export const AuthProvider = ({
  children,
}: Props): JSX.Element => {
  const [user, setUser] = useState<User | null>(
    null
  );

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const res = await axios.get<User>(
          `${API_URL}/auth/profile`,
          {
            withCredentials: true,
          }
        );

        setUser(res.data);
      } catch (error) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  const login = async (
    email: string,
    password: string
  ): Promise<boolean> => {
    try {
      const res = await axios.post<User>(
        `${API_URL}/auth/login`,
        {
          email,
          password,
        },
        {
          withCredentials: true,
        }
      );

      setUser(res.data);

      return true;
    } catch (err: any) {
      console.error(
        err.response?.data?.message
      );

      return false;
    }
  };

  const register = async (
    username: string,
    email: string,
    password: string
  ): Promise<boolean> => {
    try {
      const res = await axios.post<User>(
        `${API_URL}/auth/register`,
        {
          username,
          email,
          password,
        },
        {
          withCredentials: true,
        }
      );

      setUser(res.data);

      return true;
    } catch (err: any) {
      console.error(
        err.response?.data?.message
      );

      return false;
    }
  };

  const logout = async (): Promise<void> => {
    try {
      await axios.get(
        `${API_URL}/auth/logout`,
        {
          withCredentials: true,
        }
      );

      setUser(null);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;