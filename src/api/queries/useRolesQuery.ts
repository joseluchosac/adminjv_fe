const apiURL = import.meta.env.VITE_API_URL;
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import useSessionStore from "../../app/store/useSessionStore"
import { useNavigate } from "react-router-dom";
import { useEffect, useMemo } from "react";
import { FetchOptions, ApiResp, Rol } from "../../app/types";
import { fnFetch } from "../fnFetch";
import { RolesSchema } from "../../app/schemas/roles-schema";


export const useRolesQuery = () => {
  const tknSession = useSessionStore(state => state.tknSession)
  const {data, isFetching, isLoading, isError} = useQuery({
    queryKey: ['roles'],
    queryFn: () => {
      const options: FetchOptions = {
        url: apiURL + "roles/get_roles",
        authorization: "Bearer " + tknSession
      }
      return fnFetch(options)
    },
    staleTime: 1000 * 60 * 60 * 12
  })

  const roles = useMemo(() => {
    const result = RolesSchema.safeParse(data);
    return result.success ? result.data : [];
  }, [data]);

  return {
    roles,
    isFetching,
    isLoading,
    isError
  }
}

// ****** MUTATE ROLES ******
export const useMutateRolesQuery = <T>() => {
  const resetSessionStore = useSessionStore(state => state.resetSessionStore)
  const navigate = useNavigate()
  const token = useSessionStore(state => state.tknSession)
  const queryClient = useQueryClient()

  const {mutate, isPending, data} = useMutation<T, Error, FetchOptions, unknown>({
    mutationFn: fnFetch,
    onSuccess: (resp) => {
      const r = resp as ApiResp
      if(r.msgType !== 'success') return
      queryClient.invalidateQueries({queryKey:["roles"]})
      queryClient.invalidateQueries({queryKey:["modulos_rol"]})
    }
  })

  const createRol = (param: Rol) => {
    const options: FetchOptions = {
      method: "POST",
      url: apiURL + "roles/create_rol",
      body: JSON.stringify(param),
      authorization: "Bearer " + token,
    }
    mutate(options)
  }

  const updateRol = (param: Rol) => {
    const options: FetchOptions = {
      method: "PUT",
      url: apiURL + "roles/update_rol",
      body: JSON.stringify(param),
      authorization: "Bearer " + token,
    }
    mutate(options)
  }
  
  const deleteRol = (id: Rol['id']) => {
    const options: FetchOptions = {
      method: "DELETE",
      url: apiURL + "roles/delete_rol",
      body: JSON.stringify({id}),
      authorization: "Bearer " + token,
    }
    mutate(options)
  }

  useEffect(()=>{
    const r = data as ApiResp
    if(r?.errorType === "errorToken"){
      resetSessionStore()
      navigate("/signin")
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