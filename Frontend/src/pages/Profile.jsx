import { useState, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthContext from "../context/AuthProvider";
import { toast } from "react-toastify";
import axios from "axios";

const Profile = () => {
  const { auth, logoutAuth } = useContext(AuthContext);
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/auth/profile`, {
          headers: { Authorization: `Bearer ${auth.token}` }
        });
        setUser(response.data);
      } catch {
        toast.error("Error al cargar el perfil");
        logoutAuth();
        navigate("/login");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50 font-sans p-6 lg:p-10">
      <div className="max-w-3xl mx-auto">
        <Link
          to="/dashboard"
          className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-800 mb-8 transition-colors"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
          </svg>
          Volver al Dashboard
        </Link>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-900 to-indigo-800 px-8 py-10 text-white">
            <div className="flex items-center gap-6">
              <div className="w-20 h-20 rounded-full bg-white/20 flex items-center justify-center text-3xl font-bold">
                {user.firstName?.charAt(0)}{user.lastName?.charAt(0)}
              </div>
              <div>
                <h1 className="text-3xl font-bold">{user.firstName} {user.lastName}</h1>
                <p className="text-blue-100 text-lg">{user.email}</p>
                <span className="inline-block mt-2 px-3 py-1 bg-white/10 border border-white/20 rounded-full text-xs font-bold tracking-wider uppercase">
                  {user.role === "ADMIN" ? "Administrador" : "Estudiante"}
                </span>
              </div>
            </div>
          </div>

          <div className="p-8 space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Nombre</label>
                <p className="text-lg font-semibold text-gray-900">{user.firstName}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Apellido</label>
                <p className="text-lg font-semibold text-gray-900">{user.lastName}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Correo</label>
                <p className="text-lg font-semibold text-gray-900">{user.email}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Semestre</label>
                <p className="text-lg font-semibold text-gray-900">{user.currentSemester ?? "—"}°</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Estilo de Aprendizaje</label>
                <p className="text-lg font-semibold text-gray-900">{user.learningStyle || "Por definir"}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Miembro desde</label>
                <p className="text-lg font-semibold text-gray-900">
                  {new Date(user.createdAt).toLocaleDateString("es-EC", { year: "numeric", month: "long", day: "numeric" })}
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t border-gray-100">
              <Link
                to="/edit-profile"
                className="flex-1 text-center bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 transition-all duration-300 shadow-md hover:shadow-lg"
              >
                Editar Perfil
              </Link>
              <Link
                to="/change-password"
                className="flex-1 text-center bg-gray-100 text-gray-700 font-bold py-3 rounded-lg hover:bg-gray-200 transition-all duration-300 border border-gray-200"
              >
                Cambiar Contraseña
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
