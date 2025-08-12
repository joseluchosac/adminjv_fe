import { lazy, Suspense } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import PublicRoute from './PublicRoute';
import PrivateRoute from './PrivateRoute';
import AuthPage from "../../pages/public/AuthPage";
import CategoriasPage from "../../pages/private/CategoriasPage";
import ClientesPage from "../../pages/private/ClientesPage";
import ComprobantesPage from "../../pages/private/ComprobantesPage";
import ConfigPage from "../../pages/private/ConfigPage";
import CatalogosPage from "../../pages/private/CatalogosPage";
import HomePage from "../../pages/private/HomePage";
import LaboratoriosPage from "../../pages/private/LaboratoriosPage";
import MarcasPage from "../../pages/private/MarcasPage";
import ModulosPage from "../../pages/private/ModulosPage";
import MovimientosPage from "../../pages/private/MovimientosPage";
import ProductosPage from "../../pages/private/ProductosPage";
import ProfilePage from '../../pages/private/ProfilePage';
import ProveedoresPage from '../../pages/private/ProveedoresPage';
import RegisterPage from "../../pages/public/RegisterPage";
import RolesPage from "../../pages/private/RolesPage";
import NumeracionesPage from '../../pages/private/NumeracionesPage';
import DashboardPage from "../../pages/private/DashboardPage";

const UsersPage = lazy(() => import("../../pages/private/UsersPage"));

function AppRouter() {
  return (
    <Routes>
      <Route element={<PublicRoute redirectTo="/" />}>
        <Route path="auth" element={<AuthPage />} />
        <Route path="register" element={<RegisterPage />} />
      </Route>
      <Route element={<PrivateRoute redirectTo="/auth" />}>
        <Route path="home" element={<HomePage />} />
        {/* <Route index element={<Navigate to="/dashboard" />} /> */}
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
