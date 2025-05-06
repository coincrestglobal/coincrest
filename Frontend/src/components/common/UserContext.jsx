import React, { createContext, useContext, useState } from "react";

// Creating the User Context
const UserContext = createContext();

// Create a custom hook to use the UserContext
export const useUser = () => {
  return useContext(UserContext);
};

// UserContext provider component
export const UserProvider = ({ children }) => {
  const [user, setUser] = useState({
    name: "Salman Khan",
    firstName: "Salman",
    lastName: "Khan",
    email: "bishnoi@298.com",
    role: "user",
    photo:
      "https://images.unsplash.com/photo-1529665253569-6d01c0eaf7b6?q=80&w=1985&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    wallets: [
      {
        type: "usdt",
        address: "TVq4jHF5oK6sUzZzMph9Av6FvvfPPZP82x",
        chain: "TRC20",
      },
      {
        type: "usdt",
        address: "TVq4jHF5oK6sUzZzMph9Av6FvvfPPZP82x",
        chain: "BEP20",
      },
    ],
    review: {
      rating: 4.5,
      reviewText: "abc",
    },
    lastWithdrawalDate: "2025-04-02T10:00:00Z",
  });

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};
