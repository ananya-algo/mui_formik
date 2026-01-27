import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState } from "react";
import Login from "./components/LoginForm";
import HomePage from "./pages/HomePage";


function App() {
const [user, setUser] = useState(null);


const handleLogin = (userData) => {
setUser(userData);
};


const handleLogout = () => {
setUser(null);
};


return (
<BrowserRouter>
<Routes>
<Route path="/" element={<Login onLogin={handleLogin} />} />
<Route
path="/home"
element={<HomePage user={user} onLogout={handleLogout} />}
/>
</Routes>
</BrowserRouter>
);
}


export default App;