import { createContext, useContext, useState, type ReactNode } from "react";

// අනාගතයේදී Backend එකෙන් ලැබෙන සැබෑ roles මෙහි ඇතුළත් කළ හැක
type Role = "ADMIN" | "STAFF" | "CUSTOMER" | null;

interface AuthContextType {
  userRole: Role;
  login: (role: Role) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  // Mock State: දැනට අපි 'ADMIN' ලෙස default role එක සකසමු
  const [userRole, setUserRole] = useState<Role>("ADMIN");

  const login = (role: Role) => setUserRole(role);
  const logout = () => setUserRole(null);

  return (
    <AuthContext.Provider value={{ userRole, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook to use Auth Context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};