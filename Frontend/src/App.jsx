import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AuthProvider } from "./context/AuthProvider";
import PublicRoute from "./routes/PublicRoute";
import PrivateRoute from "./routes/PrivateRoute";
import Login from "./pages/Login";
import Landing from "./pages/Landing";
import Register from "./pages/Register";
import Confirm from "./pages/Confirm";
import Forgot from "./pages/Forgot";
import Reset from "./pages/Reset";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import EditProfile from "./pages/EditProfile";
import ChangePassword from "./pages/ChangePassword";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ToastContainer position="top-right" autoClose={3000} />
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/confirm/:token" element={<Confirm />} />
          
          <Route element={<PublicRoute />}>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot" element={<Forgot />} />
            <Route path="/reset-password/:token" element={<Reset />} />
          </Route>

          <Route element={<PrivateRoute />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/edit-profile" element={<EditProfile />} />
            <Route path="/change-password" element={<ChangePassword />} />
          </Route>

          <Route path="*" element={
            <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 font-sans">
              <h1 className="text-6xl font-extrabold text-gray-900 mb-4">404</h1>
              <p className="text-xl text-gray-500 mb-8">Página no encontrada</p>
              <a href="/" className="bg-blue-600 text-white font-bold py-3 px-8 rounded-lg hover:bg-blue-700 transition-all duration-300 shadow-md">
                Volver al inicio
              </a>
            </div>
          } />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;