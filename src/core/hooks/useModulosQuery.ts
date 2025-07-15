const apiURL = import.meta.env.VITE_API_URL;
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import useSessionStore from "../store/useSessionStore"
import { FnFetchOptions, Modulo, ResponseQuery } from "../types"
import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { fnFetch } from "../services/fnFetch";

interface DataModulosSession extends ResponseQuery {content: Modulo[]}

type TypeAction = "mutate_modulo" | "mutate_modulos"

export const useModulosSessionQuery = () => {
  const tknSession = useSessionStore(state => state.tknSession)
  const {data, isFetching} = useQuery<DataModulosSession>({
    queryKey: ['modulos_session'],
    queryFn: () => {
      const options: FnFetchOptions = {
        method:"POST",
        url: apiURL + "modulos/get_modulos_sesion",
        authorization: "Bearer " + tknSession
      }
      return fnFetch(options)
    },
    staleTime: 1000 * 60 * 60 * 24
  })

  return {
    modulosSession: data?.content,
    isFetching
  }
}

// ****** MUTATION ******
export const useMutateModulosQuery = () => {
  const resetSessionStore = useSessionStore(state => state.resetSessionStore)
  const navigate = useNavigate()
  const token = useSessionStore(state => state.tknSession)
  const queryClient = useQueryClient()
  const typeActionRef = useRef<TypeAction | "">("")

  const {mutate, isPending, data} = useMutation({
    mutationKey: ['mutation_modulos'],
    mutationFn: fnFetch,
    onSuccess: () => {
      queryClient.fetchQuery({queryKey:["modulos"]});
    }
  })

  const getModulos = () => {
    const options: FnFetchOptions = {
      method: "POST",
      url: apiURL + "modulos/get_modulos",
      authorization: "Bearer " + token,
    }
    mutate(options)
  }

  const getModulosSession = () => {
    const options: FnFetchOptions = {
      method: "POST",
      url: apiURL + "modulos/get_modulos_sesion",
      authorization: "Bearer " + token,
    }
    mutate(options)
  }

  const getModuloRol = (rol_id: number) => {
    const options: FnFetchOptions = {
      method: "POST",
      url: apiURL + "modulos/get_modulo_rol",
      body: JSON.stringify({rol_id}),
      authorization: "Bearer " + token,
    }
    mutate(options)
  }

  const sortModulos = (orderedItems: Modulo[]) => {
    const options: FnFetchOptions = {
      method: "PUT",
      url: apiURL + "modulos/sort_modulos",
      body: JSON.stringify(orderedItems),
      authorization: "Bearer " + token,
    }
    mutate(options)
  }

  const updateModulo = (modulo: Modulo) => {
    typeActionRef.current = "mutate_modulo"
    const options: FnFetchOptions = {
      method: "PUT",
      url: apiURL + "modulos/update_modulo",
      body: JSON.stringify(modulo),
      authorization: "Bearer " + token,
    }
    mutate(options)
  }

  const createModulo = (modulo:  Modulo) => {
    typeActionRef.current = "mutate_modulo"
    const options: FnFetchOptions = {
      method: "POST",
      url: apiURL + "modulos/create_modulo",
      body: JSON.stringify(modulo),
      authorization: "Bearer " + token,
    }
    mutate(options)
  }

  const deleteModulo = (id: number) => {
    typeActionRef.current = "mutate_modulo"
    const options: FnFetchOptions = {
      method: "DELETE",
      url: apiURL + "modulos/delete_modulo",
      body: JSON.stringify({id}),
      authorization: "Bearer " + token,
    }
    mutate(options)
  }

  const updateModulosRoles = (modulos_roles: any) => {
    const options: FnFetchOptions = {
      method: "POST",
      url: apiURL + "modulos/update_modulos_roles",
      body: JSON.stringify(modulos_roles),
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
    isPending, 
    createModulo, 
    updateModulo, 
    deleteModulo, 
    sortModulos,
    getModulos,
    getModulosSession,
    getModuloRol,
    updateModulosRoles,
  }
}

