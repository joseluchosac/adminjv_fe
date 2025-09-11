import "../../../assets/css/sidebar-layout.css";
import { useEffect, useMemo, useRef } from "react";
import { useLocation, useNavigate } from 'react-router-dom';
import { getModulosTree } from '../../utils/funciones';
import { LdsEllipsisCenter } from '../Loaders';
import useLayoutStore from '../../store/useLayoutStore';
import DynaIcon from '../DynaComponents';
import useSessionStore from '../../store/useSessionStore';
import { EmpresaInfo, Modulo } from '../../types';
import { useModulosSessionQuery } from '../../../api/queries/useModulosQuery';
import SidebarNavItems from "./SidebarNavItems";
import { useQueryClient } from "@tanstack/react-query";


const SidebarLayout:React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const navSidebarRef = useRef<HTMLElement>(null)
  const layout = useLayoutStore(state => state.layout)
  const setLayout = useLayoutStore(state => state.setLayout)
  const setModuloActual = useSessionStore(state => state.setModuloActual)
  const queryClient = useQueryClient()
  const empresa = queryClient.getQueryData(["empresa_info"]) as EmpresaInfo
  const {modulosSession} = useModulosSessionQuery()
  
  const nombreModulo = () => {
    return location.pathname.split("/").filter(el=>el)[0]
  }

  const modulosSessionTree = useMemo(() => {
    return getModulosTree(modulosSession)
  }, [modulosSession])

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
    const moduloActual = (modulosSession).find((el) => el.nombre === nombreModulo()) as Modulo
    const navLinks = navSidebarRef.current?.querySelectorAll('.nav-link')

    navLinks?.forEach(el=>{
      el.classList.remove('active')
      el.classList.remove('active-parent')
    })

    const currentNavLink = navSidebarRef.current?.querySelector(`[data-nombre=${nombreModulo()}]`)
    currentNavLink?.classList.add('active')
    const navlinkParent = currentNavLink?.closest('.parent')
    if(navlinkParent) {
      navlinkParent?.children[0].classList.add('active-parent')
    }
    
    setModuloActual(moduloActual)

    document.body.classList.remove("sidebar-show-responsive");
    document.title = moduloActual?.descripcion
    ? `${moduloActual?.descripcion} - ${empresa.nombre_comercial}`
    : empresa.nombre_comercial || "Mi Empresa"
  }

  useEffect(() => { // evita ingresar a otros modulos
    activarItem()
    if(!nombreModulo()) navigate("/home")
    if(!modulosSession.length) return
    const idx = (modulosSession).findIndex((el) => el.nombre === nombreModulo())
    if(idx === -1){
      navigate("/home")
    }
  }, [navigate, modulosSession])

  useEffect(() => {
    if(!modulosSessionTree.length) return
    activarItem()
  }, [modulosSessionTree])
  
  
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
          {modulosSessionTree.length
            ? <SidebarNavItems modulosTree={modulosSessionTree} />
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