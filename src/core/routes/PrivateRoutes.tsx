import React, { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useMutationUsersQuery } from "../hooks/useUsersQuery";
import useSessionStore from "../store/useSessionStore";
import { useMutateModulosQuery } from "../hooks/useModulosQuery";
import { Modulo } from "../types";
import { LdsDots11 } from "../components/Loaders";
import { useMutationConfigQuery } from "../hooks/useConfigQuery";

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
    data: modulosSession,
    getModulosSession
  } = useMutateModulosQuery()

  const {checkThisTerm} = useMutationConfigQuery()

  useEffect(()=>{
    if(!tknSession){
      navigate(redirectTo)
    }else{
      checkAuth()
    }
    checkThisTerm()
  }, [])

  useEffect(() => {
    if(!dataCheckAuth) return
    if(dataCheckAuth.error){
      resetSessionStore()
      navigate(redirectTo)
    }else{
      setUserSession(dataCheckAuth.content.registro)
      setEmpresaSession(dataCheckAuth.content.empresaSession)
      getModulosSession()
    }
  }, [dataCheckAuth])

  useEffect(() => {
    if(!modulosSession) return
    if(modulosSession.content){
      setModulosSesion(modulosSession.content)
    }
  }, [modulosSession])

  useEffect(() => {
    const nombreModulo = location.pathname.split("/").filter(Boolean).pop();
    if(!nombreModulo) navigate("/home")
    if(!modulosSesion) return
    const idx = modulosSesion.findIndex((el: Modulo) => el.nombre === nombreModulo)
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