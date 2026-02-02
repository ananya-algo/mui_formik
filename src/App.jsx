// App.jsx
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Login from "./components/LoginForm";
import HomePage from "./pages/HomePage";
import AuditlogsTable from "./pages/AuditlogsTable";
import ProtectedRoute from "./components/ProtectedRoute";
import '../App.css';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const authToken = localStorage.getItem('authToken');
    const userData = localStorage.getItem('userData');
    
    if (authToken && userData) {
      setUser(JSON.parse(userData));
    }
    setLoading(false);
  }, []);

  const handleLogin = (userData) => {
    const authToken = `token_${Date.now()}_${userData.sapId}`;
    
    localStorage.setItem('authToken', authToken);
    localStorage.setItem('userData', JSON.stringify(userData));
    
    setUser(userData);
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userData');
    
    setUser(null);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route 
          path="/" 
          element={
            user ? <Navigate to="/home" replace /> : <Login onLogin={handleLogin} />
          } 
        />
        
        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <HomePage user={user} onLogout={handleLogout} />
            </ProtectedRoute>
          }
        />

        <Route
          path="/process-audit-logs"
          element={
            <ProtectedRoute>
              <AuditlogsTable user={user} onLogout={handleLogout} />
            </ProtectedRoute>
          }
        />
        
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;