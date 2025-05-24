import { lazy, Suspense } from 'react';
import { Navigate, Route, Routes } from "react-router-dom";
import MainContent from "./pages/layout/MainContent";
import PrivateRoutes from "./core/routes/PrivateRoutes";
import PublicRoutes from "./core/routes/PublicRoutes";
import Home from "./pages/home/Home";
import "./index.css";
import Modulos from './pages/modulos/Modulos';
import Register from './pages/auth/Register';
import Auth from './pages/auth/Auth';
import Config from './pages/config/Config';
import Roles from './pages/roles/Roles';
import Comprobantes from './pages/comprobantes/Comprobantes';
import Clientes from './pages/clientes/Clientes';
import Proveedores from './pages/proveedores/Proveedores';
import Catalogos from './pages/catalogos/Catalogos';
import Categorias from './pages/categorias/Categorias';
import Laboratorios from './pages/laboratorios/Laboratorios';
import Profile from './pages/profile/Profile';
import Marcas from './pages/marcas/Marcas';


const Tareas = lazy(() => import("./pages/tareas/Tareas"));
const Users = lazy(() => import("./pages/users/Users"));

function App() {
  
  return (
    <Routes>
      <Route element={<PublicRoutes redirectTo="/" />}>
        <Route path="/auth" element={<Auth />} />
        <Route path="/register" element={<Register />} />
      </Route>
      <Route element={<PrivateRoutes redirectTo="/auth" />}>
        <Route element={<MainContent />}>
          <Route path="/" element={<Navigate to="/home" />} />
          <Route path="home" element={<Home />} />
          <Route path="comprobantes" element={<Comprobantes />} />
          <Route path="pos"
            element={<Suspense fallback={<div>Loading...</div>}><Tareas /></Suspense>} 
          />
          <Route path="users" 
            element={<Suspense fallback={<div>Loading...</div>}><Users /></Suspense>}  
          />
          <Route path="clientes" element={<Clientes />} />
          <Route path="proveedores" element={<Proveedores />} />
          <Route path="categorias" element={<Categorias />} />
          <Route path="marcas" element={<Marcas />} />
          <Route path="laboratorios" element={<Laboratorios />} />
          <Route path="catalogos" element={<Catalogos />} />
          <Route path="modulos" element={<Modulos />} />
          <Route path="roles" element={<Roles />} />
          <Route path="config" element={<Config />} />
          <Route path="profile" element={<Profile />} />
        </Route>
      </Route>
      <Route path="*" element={<div>404 NOT FOUND</div>} />
    </Routes>
  );
}
export default App;
