import { createContext, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState(() => {
    const token = localStorage.getItem("token");
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      if (token && user) return { token, user };
    } catch { /* ignore invalid JSON */ }
    return {};
  });

  const loginAuth = (token, user) => {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));
    setAuth({ token, user });
  };

  const logoutAuth = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setAuth({});
  };

  return (
    <AuthContext.Provider value={{ auth, loginAuth, logoutAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;