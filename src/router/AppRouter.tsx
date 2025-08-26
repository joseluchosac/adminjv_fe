import { lazy, Suspense } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import PublicRoute from './PublicRoute';
import PrivateRoute from './PrivateRoute';
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
import RolesPage from "../pages/roles/RolesPage";
import { useEmpresaInfoQuery } from "../api/queries/useEmpresaQuery";
import { LdsEllipsisCenter } from "../app/components/Loaders";
import HomePage from "../pages/home/HomePage";
import SignInPage from "../pages/auth/SignInPage";
import SignUpPage from "../pages/auth/SignUpPage";
import RecoveryPage from "../pages/auth/RecoveryPage";
import ProveedoresPage from "../pages/proveedores/ProveedoresPage";

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
        <Route path="signin" element={<SignInPage />} />
        <Route path="signup" element={<SignUpPage />} />
        <Route path="recovery" element={<RecoveryPage />} />
      </Route>
      <Route element={<PrivateRoute redirectTo="signin" />}>
        <Route index element={<Navigate to="dashboard" />} />
        <Route path="home" element={<HomePage />} />
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
