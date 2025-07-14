const apiURL = import.meta.env.VITE_API_URL;
import { useMutation, useQueryClient } from "@tanstack/react-query"
import useSessionStore from "../store/useSessionStore"
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { fnFetch } from "../services/fnFetch";
import { FnFetchOptions } from "../types";


// ****** MUTATE ROLES ******
export const useMutateRolesQuery = () => {
  const resetSessionStore = useSessionStore(state => state.resetSessionStore)
  const navigate = useNavigate()
  const token = useSessionStore(state => state.tknSession)
  const queryClient = useQueryClient()

  const {mutate, isPending, data} = useMutation({
    mutationFn: fnFetch,
    onSuccess: (resp) => {
      if(resp.msgType !== 'success') return
      queryClient.invalidateQueries({queryKey:["roles"]})
      queryClient.invalidateQueries({queryKey:["modulos_rol"]})
    }
  })

  const updateRol = (param:any) => {
    const options: FnFetchOptions = {
      method: "PUT",
      url: apiURL + "roles/update_rol",
      body: JSON.stringify(param),
      authorization: "Bearer " + token,
    }
    mutate(options)
  }
  
  const createRol = (param:any) => {
    const options: FnFetchOptions = {
      method: "POST",
      url: apiURL + "roles/create_rol",
      body: JSON.stringify(param),
      authorization: "Bearer " + token,
    }
    mutate(options)
  }
  
  const deleteRol = (param: any) => {
    const options: FnFetchOptions = {
      method: "DELETE",
      url: apiURL + "roles/delete_rol",
      body: JSON.stringify(param),
      authorization: "Bearer " + token,
    }
    mutate(options)
  }

  useEffect(()=>{
    if(data?.errorType === "errorToken"){
      resetSessionStore()
      navigate("/auth")
    }
  },[data])

  return {
    data, 
    updateRol, 
    createRol, 
    deleteRol, 
    isPending
  }
}