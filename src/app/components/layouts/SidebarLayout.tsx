import "../../../assets/css/sidebar-layout.css";
import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from 'react-router-dom';
import { getModulosTree } from '../../utils/funciones';
import { LdsEllipsisCenter } from '../Loaders';
import useLayoutStore from '../../store/useLayoutStore';
import DynaIcon from '../DynaComponents';
import useSessionStore from '../../store/useSessionStore';
import { EmpresaInfo, Modulo } from '../../types';
import { isModulosSessionRes, useModulosSessionQuery } from '../../../api/queries/useModulosQuery';
import SidebarNavItems from "./SidebarNavItems";
import { useQueryClient } from "@tanstack/react-query";



const SidebarLayout:React.FC = () => {
  const [modulosSesionTree, setModulosSesionTree] = useState<any>(null)
  const navigate = useNavigate();
  const location = useLocation();
  const navSidebarRef = useRef<HTMLElement>(null)
  const layout = useLayoutStore(state => state.layout)
  const setLayout = useLayoutStore(state => state.setLayout)
  const setModuloActual = useSessionStore(state => state.setModuloActual)
  const queryClient = useQueryClient()
  const empresa = queryClient.getQueryData(["empresa_info"]) as EmpresaInfo
  const {data: modulosSession} = useModulosSessionQuery()

  const handleSidebarMini = (e:React.MouseEvent) => {
    e.preventDefault();
    document.body.classList.toggle("main-sidebar-mini");
    if(layout){
      setLayout({...layout, sidebarMini: !layout.sidebarMini})
    }
  };

  const handleDarkMode = (e:React.MouseEvent) => {
    e.preventDefault()
    if(layout){
      setLayout({...layout, darkMode: !layout.darkMode})
    }
  }

  const handleHideSidebar = (e:React.MouseEvent) => {
    e.preventDefault()
    document.body.classList.remove('sidebar-show-responsive')
  }

  const activarItem = () => {
    const nombreModulo = location.pathname.split("/").filter(Boolean).pop();
    const moduloActual = modulosSession && isModulosSessionRes(modulosSession) // call type guards
      ? modulosSession.find((el: Modulo) => el.nombre === nombreModulo)
      : null

    const navLinks = navSidebarRef.current?.querySelectorAll('.nav-link')
    navLinks?.forEach(el=>{
      el.classList.remove('active')
      el.classList.remove('active-parent')
    })
    const currentNavLink = navSidebarRef.current?.querySelector(`[data-nombre=${nombreModulo}]`)
    currentNavLink?.classList.add('active')
    const navlinkParent = currentNavLink?.closest('.is-parent')
    if(navlinkParent) {
      navlinkParent?.children[0].classList.add('active-parent')
    }
    
    setModuloActual(moduloActual || null)

    document.body.classList.remove("sidebar-show-responsive");
    document.title = moduloActual?.descripcion
    ? `${moduloActual?.descripcion} - ${empresa.nombre_comercial}`
    : empresa.nombre_comercial || "Mi Empresa"
  }

  useEffect(() => {
    if(!modulosSession) return
    if(("error" in modulosSession) && modulosSession.error){
      console.log("Error al obtener modulos session")
    }else{
      setModulosSesionTree(getModulosTree(modulosSession as Modulo[]))
    }
  }, [modulosSession])

  useEffect(() => {
    activarItem()
  }, [navigate]);

  useEffect(() => {
    if(!modulosSesionTree) return
    activarItem()
  }, [modulosSesionTree])
  
  
  useEffect(()=>{
    if(layout?.darkMode){
      document.documentElement.setAttribute('data-bs-theme', 'dark') 
    }else{
      document.documentElement.setAttribute('data-bs-theme', '') 
    }
    if(layout?.sidebarMini){
      document.body.classList.add("main-sidebar-mini");
    }else{
      document.body.classList.remove("main-sidebar-mini");
    }
  },[layout])

  // useEffect(() => {
    // const nombreModulo = location.pathname.split("/").filter(Boolean).pop();
    // if(!nombreModulo) navigate("/home")
    // if(!modulosSession) return
    // const idx = modulosSession.findIndex((el: Modulo) => el.nombre === nombreModulo)
    // if(idx === -1){
      // navigate("/home")
    // }
  // }, [navigate, modulosSession])

  return (
    <>
      <div className="backdrop-sidebar"
        onClick={handleHideSidebar}
      ></div>
      <aside className="main-sidebar">
        <div className="brand">
          <a onClick={handleSidebarMini} href="#" className="nav-link">
            <img src={empresa.urlLogo} alt="Logo empresa" className="" />
            <span className='text-wrap'>{empresa.nombre_comercial}</span>
          </a>
        </div>
        <nav className='nav-sidebar' ref={navSidebarRef} style={{position:"relative"}}>
          {modulosSesionTree 
            ? <SidebarNavItems modulosTree={modulosSesionTree} />
            : <LdsEllipsisCenter />
          } 
        </nav>
        <div className="divider"></div>
          <div
            className="theme"
            onClick={handleDarkMode}
          >
            {layout?.darkMode 
              ? <DynaIcon name='FaSun' className="icon" /> 
              : <DynaIcon name='FaMoon' className="icon" />}
            <span className="text-nowrap">{layout?.darkMode ? 'Modo claro' : 'Modo oscuro'}</span>
          </div>
      </aside>
    </>
  );
}

export default SidebarLayout