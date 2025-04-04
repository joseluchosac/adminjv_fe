import { Navigate, Outlet } from "react-router-dom";
import useSessionStore from "../store/useSessionStore";

type Props = { redirectTo: string }

function PublicRoutes({ redirectTo = "/"}:Props) {

  const tknSession = useSessionStore(state => state.tknSession)

  if (tknSession) {
    return <Navigate to={redirectTo} replace />;
  }
    return <Outlet />;
}

export default PublicRoutes