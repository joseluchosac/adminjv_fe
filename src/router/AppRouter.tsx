import { lazy, Suspense } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import PublicRoute from './PublicRoute';
import PrivateRoute from './PrivateRoute';
import AuthPage from "../pages/auth/AuthPage";
import CategoriasPage from "../pages/categorias/CategoriasPage";
import ClientesPage from "../pages/clientes/ClientesPage";
import ComprobantesPage from "../pages/comprobantes/ComprobantesPage";
import ConfigPage from "../pages/config/ConfigPage";
import CatalogosPage from "../pages/catalogos/CatalogosPage";
import DashboardPage from "../pages/dashboard/DashboardPage";
import LaboratoriosPage from "../pages/laboratorios/LaboratoriosPage";
import MarcasPage from "../pages/marcas/MarcasPage";
import ModulosPage from "../pages/modulos/ModulosPage";
import MovimientosPage from "../pages/movimientos/MovimientosPage";
import NumeracionesPage from '../pages/numeraciones/NumeracionesPage';
import ProductosPage from "../pages/productos/ProductosPage";
import ProfilePage from '../pages/profile/ProfilePage';
import ProveedoresPage from '../pages/proveedores/ProveedoresPage';
import RegisterPage from "../pages/auth/RegisterPage";
import RolesPage from "../pages/roles/RolesPage";
import { useEmpresaInfoQuery } from "../api/queries/useEmpresaQuery";
import { LdsEllipsisCenter } from "../app/components/Loaders";

const UsersPage = lazy(() => import("../pages/users/UsersPage"));

function AppRouter() {
  const {isFetching, data} = useEmpresaInfoQuery()

  if(isFetching){
    return <LdsEllipsisCenter />
  }
  if(!data || ("error" in data && data.error)){
    return <div>{data?.msg || "Hubo un error al cargar datos de la empresa"}</div>
  }

  return (
    <Routes>
      <Route element={<PublicRoute redirectTo="dashboard" />}>
        <Route path="auth" element={<AuthPage />} />
        <Route path="register" element={<RegisterPage />} />
      </Route>
      <Route element={<PrivateRoute redirectTo="auth" />}>
        <Route index element={<Navigate to="dashboard" />} />
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="catalogos" element={<CatalogosPage />} />
        <Route path="categorias" element={<CategoriasPage />} />
        <Route path="clientes" element={<ClientesPage />} />
        <Route path="config" element={<ConfigPage />} />
        <Route path="comprobantes" element={<ComprobantesPage />} />
        <Route path="laboratorios" element={<LaboratoriosPage/>} />
        <Route path="marcas" element={<MarcasPage />} />
        <Route path="modulos" element={<ModulosPage />} />
        <Route path="movimientos" element={<MovimientosPage />} />
        <Route path="numeraciones" element={<NumeracionesPage />} />
        <Route path="proveedores" element={<ProveedoresPage />} />
        <Route path="productos" element={<ProductosPage />} />
        <Route path="profile" element={<ProfilePage />} />
        <Route path="roles" element={<RolesPage />} />
        <Route path="users" 
          element={<Suspense fallback={<div>Loading...</div>}><UsersPage /></Suspense>}  
        />
      </Route>
      <Route path="*" element={<div>404 NOT FOUND</div>} />
    </Routes>
  );
}
export default AppRouter;
