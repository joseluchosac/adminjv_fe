const apiURL = import.meta.env.VITE_API_URL;
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import useSessionStore from "../store/useSessionStore"
import { useEffect, useRef } from "react"
import { useNavigate } from "react-router-dom";
import { Empresa, EmpresaSession, FnFetchOptions, ResponseQuery } from "../types";
import { fnFetch } from "../services/fnFetch";

type TypeAction = "mutate_empresa"
type DataEmpresa = {content: Empresa}
type DataEmpresaSession = {content: EmpresaSession}

export const useEmpresaQuery = () => {
  const tknSession = useSessionStore(state => state.tknSession)
  const queryClient = useQueryClient()
  const {data, isFetching} = useQuery<DataEmpresa>({
    queryKey: ['empresa'],
    queryFn: () => {
      const options: FnFetchOptions = {
        url: apiURL + "config/get_empresa",
        authorization: "Bearer " + tknSession
      }
      return fnFetch(options)
    },
    staleTime: 1000 * 60 * 60 * 24
  })

  useEffect(()=>{
    return ()=>{
      queryClient.removeQueries({queryKey:['empresa']})
    }
  },[])

  return {
    empresa: data?.content,
    isFetching
  }
}

export const useEmpresaSessionQuery = () => {
  const {data, isFetching} = useQuery<DataEmpresaSession>({
    queryKey: ['empresa_session'],
    queryFn: () => {
      const options: FnFetchOptions = {
        url: apiURL + "config/get_empresa_session",
      }
      return fnFetch(options)
    },
    staleTime: 1000 * 60 * 60 * 24
  })

  return {
    empresaSession: data?.content,
    isFetching
  }
}

// ****** MUTATION ******
export const useMutationEmpresaQuery = <T>() => {
  const resetSessionStore = useSessionStore(state => state.resetSessionStore)
  const navigate = useNavigate()
  const token = useSessionStore(state => state.tknSession)
  const queryClient = useQueryClient()
  const typeActionRef = useRef<TypeAction | "">("")

  const {data, isPending, isError, mutate, reset } = useMutation<T, Error, FnFetchOptions, unknown>({
    mutationKey: ['mut_empresa'],
    mutationFn: fnFetch,
    onSuccess: (resp) => {
      const r = resp as ResponseQuery
      if(r?.msgType !== 'success') return
      queryClient.invalidateQueries({queryKey:["empresa"]}) // Recarga la tabla proveedores
    }
  })

  const updateEmpresa = (formData: FormData) => {
    typeActionRef.current = "mutate_empresa"
    const options: FnFetchOptions = {
      method: "POST",
      url: apiURL + "config/update_empresa",
      body: formData,
      authorization: "Bearer " + token,
    }
    mutate(options)
  }

  useEffect(()=>{
    const d = data as ResponseQuery
    if(d?.errorType === "errorToken"){
      resetSessionStore()
      navigate("/auth")
    }
  },[data])

  return {
    data, 
    isPending, 
    isError,
    updateEmpresa,
    typeAction: typeActionRef.current,
    reset
  }
}


