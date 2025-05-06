import { useState } from "react";

const useAppState = () => {
  const [user, setUser] = useState(null);

  return { user, setUser };
};

export default useAppState;
