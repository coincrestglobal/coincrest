import { createContext, useContext, useState, useEffect } from "react";

// Creating the User Context
const UserContext = createContext();

// Custom hook
export const useUser = () => {
  return useContext(UserContext);
};

// UserContext provider component
export const UserProvider = ({ children }) => {
  // Load user from localStorage on first render
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  // Update localStorage whenever user changes
  useEffect(() => {
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
    } else {
      localStorage.removeItem("user");
    }
  }, [user]);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};
