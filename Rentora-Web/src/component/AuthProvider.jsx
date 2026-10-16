import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

const AuthContext = createContext(null);

const SESSION_KEY = "rentora_demo_user";

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // DEMO ONLY:
    // Replace this with GET /api/auth/me when your backend exists.
    try {
      const savedUser = localStorage.getItem(SESSION_KEY);
      if (savedUser) setUser(JSON.parse(savedUser));
    } catch {
      localStorage.removeItem(SESSION_KEY);
    } finally {
      setLoading(false);
    }
  }, []);

  const login = async ({ name, email }) => {
    /*
     * BACKEND INTEGRATION:
     * POST /api/auth/login
     * Send email/password to the server.
     * Let the server verify credentials and set a secure HttpOnly cookie.
     * Never store passwords or real JWTs in localStorage.
     */

    const authenticatedUser = {
      name: name || email.split("@")[0],
      email,
    };

    // Demo session only. This is NOT secure authentication.
    localStorage.setItem(SESSION_KEY, JSON.stringify(authenticatedUser));
    setUser(authenticatedUser);

    return authenticatedUser;
  };

  const logout = async () => {
    /*
     * BACKEND INTEGRATION:
     * POST /api/auth/logout
     * The server should invalidate the session/refresh token and clear
     * the authentication cookie.
     */
    localStorage.removeItem(SESSION_KEY);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{ user, loading, login, logout, isAuthenticated: Boolean(user) }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
};
