import "./App.css";
import { Route, BrowserRouter as Router, Routes} from "react-router-dom";
import Header from "./components/layout/Header";
import Footer from "./components/layout/footer";
import { Toaster } from "react-hot-toast";
import useUserRoutes from "./components/routes/userRoutes";
import useAdminRoutes from "./components/routes/adminRoutes";
import NotFount from "./components/layout/NotFount";

function App() {
  const userRoutes = useUserRoutes();
  const adminRoutes = useAdminRoutes();
  return (
    <Router>
      <div className="App">
        <Toaster position="top-center" />
        <Header />

        <div className="container">
          <Routes>
            {userRoutes}
            {adminRoutes}
            <Route path="*" element={<NotFount />} />
          </Routes>
        </div>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
