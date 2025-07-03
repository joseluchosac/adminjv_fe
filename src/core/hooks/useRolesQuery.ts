const apiURL = import.meta.env.VITE_API_URL;
import { useMutation, useQueryClient } from "@tanstack/react-query"
import useSessionStore from "../store/useSessionStore"
import { mutationFetch } from "../services/mutationFecth";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";


// ****** MUTATE ROLES ******
export const useMutateRolesQuery = () => {
  const resetSessionStore = useSessionStore(state => state.resetSessionStore)
  const navigate = useNavigate()
  const tknSession = useSessionStore(state => state.tknSession)
  const Authorization = "Bearer " + tknSession
  const queryClient = useQueryClient()

  const {mutate, isPending, data} = useMutation({
    mutationFn: mutationFetch,
    onSuccess: (resp) => {
      if(resp.msgType !== 'success') return
      queryClient.invalidateQueries({queryKey:["roles"]})
      queryClient.invalidateQueries({queryKey:["modulos_rol"]})
    }
  })

  const updateRol = (param:any) => {
    const params = {
      url: apiURL + "roles/update_rol",
      method: "PUT",
      headers:{ 
        Authorization,
      },
      body: JSON.stringify(param),
    }
    mutate(params)
  }
  
  const createRol = (param:any) => {
    const params = {
      url: apiURL + "roles/create_rol",
      method: "POST",
      headers:{ 
        Authorization,
      },
      body: JSON.stringify(param),
    }
    mutate(params)
  }
  
  const deleteRol = (param: any) => {
    const params = {
      url: apiURL + "roles/delete_rol",
      method: "DELETE",
      headers:{ 
        Authorization,
      },
      body: JSON.stringify(param),
    }
    mutate(params)
  }

  useEffect(()=>{
    if(data?.msgType === "errorToken"){
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