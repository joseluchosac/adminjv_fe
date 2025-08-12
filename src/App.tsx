import "./index.css";
import { useEmpresaSessionQuery } from './api/queries/useEmpresaQuery';
import AppRouter from './app/router/AppRouter';
import { ToastContainer } from "react-toastify";
import useLayoutStore from "./app/store/useLayoutStore";

function App() {
  const darkMode = useLayoutStore(state => state.layout.darkMode)
  useEmpresaSessionQuery()

  return (
    <>
      <AppRouter />
      <ToastContainer
        theme={darkMode ? 'dark' : 'light'}
        autoClose={3000}
        position="bottom-left"
      />
    </>
  );
}
export default App;
