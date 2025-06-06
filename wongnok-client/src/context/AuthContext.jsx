import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      setToken(storedToken);
    }
  }, []);

  const login = (newToken) => {
    localStorage.setItem("token", newToken);
    setToken(newToken);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

// ✅ ฟังก์ชัน decodeJWT
export function decodeJWT(token) {
  if (!token) return null;

  try {
    const payloadBase64 = token.split(".")[1];
    const decoded = JSON.parse(atob(payloadBase64));
    return decoded;
  } catch (e) {
    console.error("❌ decodeJWT ผิดพลาด:", e);
    return null;
  }
}
