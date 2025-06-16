import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider, useTheme } from "./context/ThemeContext";
import { LanguageProvider } from "./context/LanguageContext";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import HomePage from "./pages/HomePage";
import WatchPage from "./pages/WatchPage";
import MyOrders from "./pages/MyOrders";
import ProfilePage from "./pages/ProfilePage";
import AdminPanel from "./pages/AdminPanel";
import ReviewsPage from "./pages/ReviewsPage";
import NotFoundPage from "./pages/NotFoundPage"; 
import MainLayout from "./components/MainLayout";
import { useEffect } from "react";

const ThemeWrapper = ({ children }) => {
  const { theme } = useTheme();

  useEffect(() => {
    document.body.className = theme;
  }, [theme]);

  return children;
};

function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <ThemeWrapper>
          <Router>
            <Routes>
              <Route path="/" element={<MainLayout><HomePage /></MainLayout>} />
              <Route path="/login" element={<MainLayout><LoginPage /></MainLayout>} />
              <Route path="/register" element={<MainLayout><RegisterPage /></MainLayout>} />
              <Route path="/my-orders" element={<MainLayout><MyOrders /></MainLayout>} />
              <Route path="/watches" element={<MainLayout><WatchPage /></MainLayout>} />
              <Route path="/reviews" element={<MainLayout><ReviewsPage /></MainLayout>} />
              <Route path="/admin" element={<MainLayout><AdminPanel /></MainLayout>} />
              <Route path="/profile" element={<MainLayout><ProfilePage /></MainLayout>} />

              <Route path="*" element={<MainLayout><NotFoundPage /></MainLayout>} />
            </Routes>
          </Router>
        </ThemeWrapper>
      </LanguageProvider>
    </ThemeProvider>
  );
}

export default App;