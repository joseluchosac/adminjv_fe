import React, { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useMutationUsersQuery } from "../api/queries/useUsersQuery";
import SidebarLayout from "../app/components/layouts/SidebarLayout";
import useSessionStore from "../app/store/useSessionStore";
import { LdsDots11 } from "../app/components/Loaders";
import HeaderLayout from "../app/components/layouts/HeaderLayout";
import { ApiResp } from "../app/types";

interface Props { redirectTo: string; }

const PrivateRoute: React.FC<Props> = ({ redirectTo }) => {
  const navigate = useNavigate()
  const tknSession = useSessionStore(state => state.tknSession)
  const resetSessionStore = useSessionStore(state => state.resetSessionStore)
  const {
    data: checkAuthResp,
    isPending,
    checkAuth
  } = useMutationUsersQuery<ApiResp>()

  useEffect(()=>{
    if(!tknSession){
      navigate(redirectTo)
    }else{
      checkAuth()
    }
  }, [])

  useEffect(() => {
    if(!checkAuthResp) return
    if(checkAuthResp.error){
      resetSessionStore()
      navigate(redirectTo)
    }
  }, [checkAuthResp])


  if (isPending){
    return (
      <div className="position-absolute h-100 w-100 d-flex align-items-center justify-content-center">
        <div> <LdsDots11 /> </div>
      </div>
    )
  }
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

export default PrivateRoute