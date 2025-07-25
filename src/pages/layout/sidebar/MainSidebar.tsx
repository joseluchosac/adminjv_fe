import './MainSidebar.css'
import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from 'react-router-dom';
import NavItems from './NavItems';
import { getModulosTree } from '../../../core/utils/funciones';
import { LdsEllipsisCenter } from '../../../core/components/Loaders';
import useLayoutStore from '../../../core/store/useLayoutStore';
import DynaIcon from '../../../core/components/DynaComponents';
import useSessionStore from '../../../core/store/useSessionStore';
import { Modulo } from '../../../core/types';
import { useEmpresaSessionQuery } from '../../../core/hooks/useEmpresaQuery';
import { useModulosSessionQuery } from '../../../core/hooks/useModulosQuery';

const MainSidebar:React.FC = () => {
  const [modulosSesionTree, setModulosSesionTree] = useState<any>(null)
  const navigate = useNavigate();
  const location = useLocation();
  const navSidebarRef = useRef<HTMLElement>(null)
  const layout = useLayoutStore(state => state.layout)
  const setLayout = useLayoutStore(state => state.setLayout)
  const setModuloActual = useSessionStore(state => state.setModuloActual)
  const {empresaSession} = useEmpresaSessionQuery()

  const {modulosSession} = useModulosSessionQuery()

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
    const moduloActual = modulosSession?.find((el: Modulo) => el.nombre === nombreModulo)

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
    document.body.classList.remove("sidebar-show-responsive");
    if(moduloActual){
      setModuloActual(moduloActual)
    }
  }

  useEffect(() => {
    if(!modulosSession) return
    setModulosSesionTree(getModulosTree(modulosSession))
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

  useEffect(() => {
    const nombreModulo = location.pathname.split("/").filter(Boolean).pop();
    if(!nombreModulo) navigate("/home")
    if(!modulosSession) return
    const idx = modulosSession.findIndex((el: Modulo) => el.nombre === nombreModulo)
    if(idx === -1){
      navigate("/home")
    }
  }, [navigate, modulosSession])

  return (
    <>
      <div className="backdrop-sidebar"
        onClick={handleHideSidebar}
      ></div>
      <aside className="main-sidebar">
        <div className="brand">
          <a onClick={handleSidebarMini} href="#" className="nav-link">
            <img src={empresaSession?.urlLogo} alt="Logo empresa" className="" />
            <span className='text-wrap'>{empresaSession?.nombre_comercial}</span>
          </a>
        </div>
        <nav className='nav-sidebar' ref={navSidebarRef} style={{position:"relative"}}>
          {modulosSesionTree 
            ? <NavItems modulosTree={modulosSesionTree} />
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

export default MainSidebar