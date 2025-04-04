import MainHeader from "./header/MainHeader";
import MainSidebar from "./sidebar/MainSidebar";
import { Outlet } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import useLayoutStore from "../../core/store/useLayoutStore";
import { useObtenerCatalogosQuery } from "../../core/hooks/useCatalogosQuery";

const MainContent: React.FC = () => {
  const darkMode = useLayoutStore(state => state.layout.darkMode)
  useObtenerCatalogosQuery()

  return (
    <>
      <MainHeader />
      <MainSidebar />
      <div className="content-wrapper">
        <Outlet />
        <ToastContainer
          theme={darkMode ? 'dark' : 'light'}
        />
      </div>
    </>
  );
};

export default MainContent;
