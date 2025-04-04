import React, { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useMutationUsersQuery } from "../hooks/useUsersQuery";
import useSessionStore from "../store/useSessionStore";
import { useMutateModulosQuery } from "../hooks/useModulosQuery";
import { ModuloT } from "../types";
import { LdsDots11 } from "../components/Loaders";

interface Props { redirectTo: string; }

const PrivateRoutes: React.FC<Props> = ({ redirectTo }) => {
  const [accessModulo, setAccessModulo] = useState<boolean>(false)
  const navigate = useNavigate()
  const tknSession = useSessionStore(state => state.tknSession)
  const setUserSession = useSessionStore(state => state.setUserSession)
  const setEmpresaSession = useSessionStore(state => state.setEmpresaSession)
  const resetSessionStore = useSessionStore(state => state.resetSessionStore)
  const setModulosSesion = useSessionStore(state => state.setModulosSesion)
  const modulosSesion = useSessionStore(state => state.modulosSesion)
  const {
    data: dataCheckAuth,
    checkAuth
  } = useMutationUsersQuery()

  const {
    data: dataObtenerModulosSession,
    obtenerModulosSession
  } = useMutateModulosQuery()

  useEffect(()=>{
    if(!tknSession){
      navigate(redirectTo)
    }else{
      checkAuth()
    }
  }, [])

  useEffect(() => {
    if(!dataCheckAuth) return
    if(dataCheckAuth.error){
      resetSessionStore()
      navigate(redirectTo)
    }else{
      setUserSession(dataCheckAuth.registro)
      setEmpresaSession(dataCheckAuth.empresaSession)
      obtenerModulosSession()
    }
  }, [dataCheckAuth])

  useEffect(() => {
    if(!dataObtenerModulosSession) return
    setModulosSesion(dataObtenerModulosSession)
  }, [dataObtenerModulosSession])

  useEffect(() => {
    const nombreModulo = location.pathname.split("/").filter(Boolean).pop();
    if(!nombreModulo) navigate("/home")
    if(!modulosSesion) return
    const idx = modulosSesion.findIndex((el: ModuloT) => el.nombre === nombreModulo)
    if(idx === -1){
      setAccessModulo(false)
      navigate("/home")
    }else{
      setAccessModulo(true)
    }
  }, [navigate, modulosSesion])

  
  if (!modulosSesion || !accessModulo) {
    return (
      <div className="position-absolute h-100 w-100 d-flex align-items-center justify-content-center">
        <div> <LdsDots11 /> </div>
      </div>
    )
  }else{
    return <Outlet />;
  }
}

export default PrivateRoutes