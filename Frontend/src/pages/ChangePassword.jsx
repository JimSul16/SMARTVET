import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { MdVisibility, MdVisibilityOff } from "react-icons/md";
import AuthContext from "../context/AuthProvider";
import { toast } from "react-toastify";
import axios from "axios";

const ChangePassword = () => {
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [saving, setSaving] = useState(false);
  const { auth } = useContext(AuthContext);
  const navigate = useNavigate();
  const { register, handleSubmit, watch, formState: { errors } } = useForm();
  const newPasswordValue = watch("newPassword");

  const onSubmit = async (dataForm) => {
    setSaving(true);
    try {
      await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/auth/change-password`,
        {
          currentPassword: dataForm.currentPassword,
          newPassword: dataForm.newPassword
        },
        { headers: { Authorization: `Bearer ${auth.token}` } }
      );

      toast.success("Contraseña actualizada correctamente");
      navigate("/profile");
    } catch (error) {
      toast.error(error.response?.data?.error || "Error al cambiar la contraseña");
    } finally {
      setSaving(false);
    }
  };

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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Cambiar Contraseña</h1>
          <p className="text-gray-500 mb-8">
            Para proteger tu cuenta, ingresa tu contraseña actual y luego escribe una nueva.
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 max-w-lg">
            <div>
              <label className="block text-sm font-semibold mb-2 text-gray-700">Contraseña Actual</label>
              <div className="relative">
                <input
                  type={showCurrent ? "text" : "password"}
                  placeholder="••••••••"
                  className="w-full rounded-lg border border-gray-300 py-2.5 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                  {...register("currentPassword", { required: "La contraseña actual es obligatoria" })}
                />
                <button
                  type="button"
                  onClick={() => setShowCurrent(!showCurrent)}
                  className="absolute inset-y-0 right-3 flex items-center text-gray-400 hover:text-gray-600"
                >
                  {showCurrent ? <MdVisibilityOff size={22} /> : <MdVisibility size={22} />}
                </button>
              </div>
              {errors.currentPassword && <p className="text-red-500 text-sm mt-1">{errors.currentPassword.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2 text-gray-700">Nueva Contraseña</label>
              <div className="relative">
                <input
                  type={showNew ? "text" : "password"}
                  placeholder="Mínimo 8 caracteres"
                  className="w-full rounded-lg border border-gray-300 py-2.5 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                  {...register("newPassword", {
                    required: "La nueva contraseña es obligatoria",
                    minLength: { value: 8, message: "Mínimo 8 caracteres" }
                  })}
                />
                <button
                  type="button"
                  onClick={() => setShowNew(!showNew)}
                  className="absolute inset-y-0 right-3 flex items-center text-gray-400 hover:text-gray-600"
                >
                  {showNew ? <MdVisibilityOff size={22} /> : <MdVisibility size={22} />}
                </button>
              </div>
              {errors.newPassword && <p className="text-red-500 text-sm mt-1">{errors.newPassword.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2 text-gray-700">Confirmar Nueva Contraseña</label>
              <div className="relative">
                <input
                  type={showConfirm ? "text" : "password"}
                  placeholder="Repite la contraseña"
                  className="w-full rounded-lg border border-gray-300 py-2.5 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                  {...register("confirmPassword", {
                    required: "Debes confirmar la contraseña",
                    validate: value => value === newPasswordValue || "Las contraseñas no coinciden"
                  })}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute inset-y-0 right-3 flex items-center text-gray-400 hover:text-gray-600"
                >
                  {showConfirm ? <MdVisibilityOff size={22} /> : <MdVisibility size={22} />}
                </button>
              </div>
              {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword.message}</p>}
            </div>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <button
                type="submit"
                disabled={saving}
                className="flex-1 bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 transition-all duration-300 disabled:bg-blue-300 shadow-md hover:shadow-lg"
              >
                {saving ? "Actualizando..." : "Actualizar Contraseña"}
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

export default ChangePassword;
