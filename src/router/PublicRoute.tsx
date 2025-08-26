import "../assets/css/auth.css"
import { Navigate, Outlet } from "react-router-dom";
import useSessionStore from "../app/store/useSessionStore";

type Props = { redirectTo: string }

function PublicRoute({ redirectTo = "/"}:Props) {

  const tknSession = useSessionStore(state => state.tknSession)

  if (tknSession) {
    return <Navigate to={redirectTo} replace />;
  }
    return <Outlet />;
}

export default PublicRoute