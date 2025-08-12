import React, { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useMutationUsersQuery } from "../../api/queries/useUsersQuery";
import SidebarLayout from "../components/layouts/SidebarLayout";
import { QueryResp } from "../types";
import useSessionStore from "../store/useSessionStore";
import { LdsDots11 } from "../components/Loaders";
import HeaderLayout from "../components/layouts/HeaderLayout";

interface Props { redirectTo: string; }

interface CheckAuthQryRes extends QueryResp {
  content: any;
}

const PrivateRoute: React.FC<Props> = ({ redirectTo }) => {
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
    return (
    <>
      <HeaderLayout />
      <SidebarLayout />
      <div className="content-wrapper">
        <Outlet />
      </div>
    </>
    )
  }
}

export default PrivateRoute