import React, { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useMutationUsersQuery } from "../hooks/useUsersQuery";
import useSessionStore from "../store/useSessionStore";
import { QueryResp } from "../types";
import { LdsDots11 } from "../components/Loaders";

interface Props { redirectTo: string; }

interface CheckAuthQryRes extends QueryResp {
  content: any;
}

const PrivateRoutes: React.FC<Props> = ({ redirectTo }) => {
  const navigate = useNavigate()
  const tknSession = useSessionStore(state => state.tknSession)
  const resetSessionStore = useSessionStore(state => state.resetSessionStore)
  const {
    data: dataCheckAuth,
    checkAuth
  } = useMutationUsersQuery<CheckAuthQryRes>()

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
    }
  }, [dataCheckAuth])


  if (!dataCheckAuth?.content)
     {
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