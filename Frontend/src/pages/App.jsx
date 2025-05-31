import { useEffect, useState } from "react";
import { useUser } from "../components/common/UserContext.jsx";
import AppRouter from "../routes/AppRouter";
import { ToastContainer } from "react-toastify";
import { validateToken } from "../services/operations/authApi.js";
import Loading from "./Loading.jsx";

function App() {
  const { user, setUser } = useUser();
  const [loding, setLoading] = useState(false);
  useEffect(() => {
    const validatingToken = async () => {
      try {
        setLoading(true);
        const response = await validateToken(user?.token, setUser);
      } catch (error) {
      } finally {
        setLoading(false);
      }
    };

    if (user?.token) {
      validatingToken();
    }
  }, [user?.token]);

  if (loding) {
    return <Loading />;
  }

  return (
    <div className="bg-primary ">
      <AppRouter />
      <ToastContainer />
    </div>
  );
}

export default App;
