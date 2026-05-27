import { useState, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import AuthContext from "../context/AuthProvider";
import { toast } from "react-toastify";
import axios from "axios";

const EditProfile = () => {
  const { auth, logoutAuth } = useContext(AuthContext);
  const navigate = useNavigate();
  const [loadingUser, setLoadingUser] = useState(true);
  const [saving, setSaving] = useState(false);
  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/auth/profile`, {
          headers: { Authorization: `Bearer ${auth.token}` }
        });
        const user = response.data;
        reset({
          firstName: user.firstName,
          lastName: user.lastName,
          currentSemester: user.currentSemester ?? "",
          learningStyle: user.learningStyle ?? ""
        });
      } catch {
        toast.error("Error al cargar el perfil");
        logoutAuth();
        navigate("/login");
      } finally {
        setLoadingUser(false);
      }
    };
    fetchProfile();
  }, []);

  const onSubmit = async (dataForm) => {
    setSaving(true);
    try {
      const payload = {
        firstName: dataForm.firstName,
        lastName: dataForm.lastName,
        currentSemester: dataForm.currentSemester ? Number(dataForm.currentSemester) : null,
        learningStyle: dataForm.learningStyle || null
      };

      await axios.put(`${import.meta.env.VITE_BACKEND_URL}/auth/profile`, payload, {
        headers: { Authorization: `Bearer ${auth.token}` }
      });

      toast.success("Perfil actualizado correctamente");
      navigate("/profile");
    } catch (error) {
      toast.error(error.response?.data?.error || "Error al actualizar el perfil");
    } finally {
      setSaving(false);
    }
  };

  if (loadingUser) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 font-sans p-6 lg:p-10">
      <div className="max-w-3xl mx-auto">
        <Link
          to="/profile"
          className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-800 mb-8 transition-colors"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
          </svg>
          Volver al perfil
        </Link>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Editar Perfil</h1>
          <p className="text-gray-500 mb-8">Actualiza tus datos personales y preferencias académicas.</p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-semibold mb-2 text-gray-700">Nombre</label>
                <input
                  type="text"
                  placeholder="Tu nombre"
                  className="w-full rounded-lg border border-gray-300 py-2.5 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                  {...register("firstName", { required: "El nombre es obligatorio" })}
                />
                {errors.firstName && <p className="text-red-500 text-sm mt-1">{errors.firstName.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2 text-gray-700">Apellido</label>
                <input
                  type="text"
                  placeholder="Tu apellido"
                  className="w-full rounded-lg border border-gray-300 py-2.5 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                  {...register("lastName", { required: "El apellido es obligatorio" })}
                />
                {errors.lastName && <p className="text-red-500 text-sm mt-1">{errors.lastName.message}</p>}
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2 text-gray-700">Semestre Actual</label>
              <input
                type="number"
                min="1"
                max="12"
                placeholder="Ej. 5"
                className="w-full sm:w-48 rounded-lg border border-gray-300 py-2.5 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                {...register("currentSemester", {
                  min: { value: 1, message: "Mínimo semestre 1" },
                  max: { value: 12, message: "Máximo semestre 12" }
                })}
              />
              {errors.currentSemester && <p className="text-red-500 text-sm mt-1">{errors.currentSemester.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2 text-gray-700">Estilo de Aprendizaje</label>
              <select
                className="w-full sm:w-64 rounded-lg border border-gray-300 py-2.5 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all bg-white"
                {...register("learningStyle")}
              >
                <option value="">Seleccionar...</option>
                <option value="VISUAL">Visual</option>
                <option value="AUDITIVO">Auditivo</option>
                <option value="KINESTESICO">Kinestésico</option>
                <option value="LECTURA">Lectura/Escritura</option>
              </select>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <button
                type="submit"
                disabled={saving}
                className="flex-1 bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 transition-all duration-300 disabled:bg-blue-300 shadow-md hover:shadow-lg"
              >
                {saving ? "Guardando..." : "Guardar Cambios"}
              </button>
              <Link
                to="/profile"
                className="flex-1 text-center bg-gray-100 text-gray-700 font-bold py-3 rounded-lg hover:bg-gray-200 transition-all duration-300 border border-gray-200"
              >
                Cancelar
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditProfile;
