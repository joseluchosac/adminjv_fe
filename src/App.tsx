import "./index.css";
import AppRouter from './router/AppRouter';
import { ToastContainer } from "react-toastify";
import useLayoutStore from "./app/store/useLayoutStore";

function App() {
  const darkMode = useLayoutStore(state => state.layout.darkMode)
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
