const apiURL = import.meta.env.VITE_API_URL;
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import useSessionStore from "../../app/store/useSessionStore"
import { FetchOptions, Modulo, ApiResp } from "../../app/types"
import { useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { fnFetch } from "../fnFetch";
import { ModulosSchema } from "../../app/schemas/modulos-schema";


export type ModulosSessionQryRes = Modulo[] | ApiResp

// Type Guards
// export function isModulosSessionRes(response: ModulosSessionQryRes): response is Modulo[] {
//   return ('error' in response || (response as ApiResp).error == true);
// }

export const useModulosSessionQuery = () => {
  const tknSession = useSessionStore(state => state.tknSession)
  const queryClient = useQueryClient()
  const {data, isFetching, refetch} = useQuery<ModulosSessionQryRes>({
    queryKey: ['modulos_session'],
    queryFn: () => {
      const options: FetchOptions = {
        method:"POST",
        url: apiURL + "modulos/get_modulos_sesion",
        authorization: "Bearer " + tknSession
      }
      return fnFetch(options)
    },
    staleTime: 1000 * 60 * 60 * 24
  })

  const modulosSession = useMemo(() => {
    const result = ModulosSchema.safeParse(data);
    return result.success ? result.data : [];
  }, [data]);

  useEffect(()=>{
    if(!tknSession) {
      queryClient.setQueryData(['modulos_session'], ()=>{return null})
    }else(
      refetch()
    )
  },[tknSession])

  return {
    data,
    modulosSession,
    isFetching
  }
}

// ****** MUTATION ******
export const useMutateModulosQuery = <T>() => {
  const resetSessionStore = useSessionStore(state => state.resetSessionStore)
  const navigate = useNavigate()
  const token = useSessionStore(state => state.tknSession)
  const queryClient = useQueryClient()

  const {mutate, isPending, data} = useMutation<T, Error, FetchOptions, unknown>({
    mutationKey: ['mutation_modulos'],
    mutationFn: fnFetch,
    onSuccess: () => {
      queryClient.fetchQuery({queryKey:["modulos"]});
    }
  })

  const getModulos = () => {
    const options: FetchOptions = {
      method: "POST",
      url: apiURL + "modulos/get_modulos",
      authorization: "Bearer " + token,
    }
    mutate(options)
  }

  const getModulosRol = (rol_id: number) => {
    // Obtiene todos los módulos indicando cuales estan asignados al rol_id
    const options: FetchOptions = {
      method: "POST",
      url: apiURL + "modulos/get_modulos_rol",
      body: JSON.stringify({rol_id}),
      authorization: "Bearer " + token,
    }
    mutate(options)
  }

  const sortModulos = (orderedItems: Modulo[]) => {
    const options: FetchOptions = {
      method: "PUT",
      url: apiURL + "modulos/sort_modulos",
      body: JSON.stringify(orderedItems),
      authorization: "Bearer " + token,
    }
    mutate(options)
  }

  const updateModulo = (modulo: Modulo) => {
    const options: FetchOptions = {
      method: "PUT",
      url: apiURL + "modulos/update_modulo",
      body: JSON.stringify(modulo),
      authorization: "Bearer " + token,
    }
    mutate(options)
  }

  const createModulo = (modulo:  Modulo) => {
    const options: FetchOptions = {
      method: "POST",
      url: apiURL + "modulos/create_modulo",
      body: JSON.stringify(modulo),
      authorization: "Bearer " + token,
    }
    mutate(options)
  }

  const deleteModulo = (id: number) => {
    const options: FetchOptions = {
      method: "DELETE",
      url: apiURL + "modulos/delete_modulo",
      body: JSON.stringify({id}),
      authorization: "Bearer " + token,
    }
    mutate(options)
  }

  const updateModulosRoles = (modulos_roles: any) => {
    const options: FetchOptions = {
      method: "POST",
      url: apiURL + "modulos/update_modulos_roles",
      body: JSON.stringify(modulos_roles),
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
    isPending, 
    createModulo, 
    updateModulo, 
    deleteModulo, 
    sortModulos,
    getModulos,
    getModulosRol,
    updateModulosRoles,
  }
}

