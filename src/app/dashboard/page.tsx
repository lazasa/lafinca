"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";

export default function Dashboard() {
  const { user, isLoading, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/");
    }
  }, [user, isLoading, router]);

  const handleLogout = async () => {
    await logout();
    router.push("/");
  };

  if (isLoading) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-finca-black">
        <div className="text-white text-xl">Cargando...</div>
      </main>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <main className="min-h-screen bg-finca-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <div className="flex justify-between items-start mb-8">
            <div>
              <h1 className="text-4xl font-bold text-finca-green mb-2">
                Dashboard
              </h1>
              <p className="text-finca-brown">
                Bienvenido, <span className="font-semibold">{user.nombre}</span>
              </p>
            </div>
            <button
              onClick={handleLogout}
              className="bg-finca-brown text-white px-6 py-2 rounded-lg font-semibold hover:bg-finca-orange-dark transition-colors duration-200"
            >
              Cerrar sesión
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-finca-beige/20 rounded-lg p-6 border border-finca-beige">
              <h3 className="text-lg font-semibold text-finca-brown mb-2">
                Usuario
              </h3>
              <p className="text-finca-brown">{user.username}</p>
            </div>

            <div className="bg-finca-beige/20 rounded-lg p-6 border border-finca-beige">
              <h3 className="text-lg font-semibold text-finca-brown mb-2">
                Nombre
              </h3>
              <p className="text-finca-brown">{user.nombre}</p>
            </div>

            <div className="bg-finca-beige/20 rounded-lg p-6 border border-finca-beige">
              <h3 className="text-lg font-semibold text-finca-brown mb-2">
                Rol
              </h3>
              <p className="text-finca-brown capitalize">{user.rol}</p>
            </div>
          </div>

          <div className="mt-8 bg-finca-green/10 rounded-lg p-6 border border-finca-green">
            <h3 className="text-lg font-semibold text-finca-green mb-2">
              Estado de Autenticación
            </h3>
            <p className="text-finca-brown mb-4">
              Tu sesión está activa y el token de acceso se actualiza
              automáticamente cada 14 minutos.
            </p>
            <div className="flex items-center text-finca-green">
              <div className="w-2 h-2 bg-finca-green rounded-full mr-2"></div>
              <span className="text-sm font-medium">Conectado</span>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
