import MainHeader from "./header/MainHeader";
import MainSidebar from "./sidebar/MainSidebar";
import { Outlet } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import useLayoutStore from "../../core/store/useLayoutStore";

const MainContent: React.FC = () => {
  const darkMode = useLayoutStore(state => state.layout.darkMode)
  return (
    <>
      <MainHeader />
      <MainSidebar />
      <div className="content-wrapper">
        <Outlet />
        <ToastContainer
          theme={darkMode ? 'dark' : 'light'}
          autoClose={3000}
        />
      </div>
    </>
  );
};

export default MainContent;
