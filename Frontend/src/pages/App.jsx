import { UserProvider } from "../components/common/UserContext.jsx";
import AppRouter from "../routes/AppRouter";
function App() {
  return (
    <div className="bg-primary ">
      <UserProvider>
        <AppRouter />
      </UserProvider>
    </div>
  );
}

export default App;
