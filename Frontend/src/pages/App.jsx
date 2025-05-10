import { UserProvider } from "../components/common/UserContext.jsx";
import AppRouter from "../routes/AppRouter";
import { ToastContainer } from "react-toastify";

function App() {
  return (
    <div className="bg-primary ">
      <UserProvider>
        <AppRouter />
        <ToastContainer />
      </UserProvider>
    </div>
  );
}

export default App;
