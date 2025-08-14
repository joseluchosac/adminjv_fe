const apiURL = import.meta.env.VITE_API_URL;
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import useSessionStore from "../../app/store/useSessionStore"
import { useEffect, useRef } from "react"
import { useNavigate } from "react-router-dom";
import { ApiGenericResp, Empresa, EmpresaInfo, FetchOptions, QueryResp } from "../../app/types";
import { fnFetch } from "../fnFetch";

type TypeAction = "mutate_empresa"
type DataEmpresa = {content: Empresa}

export const useEmpresaQuery = () => {
  const tknSession = useSessionStore(state => state.tknSession)
  const queryClient = useQueryClient()
  const {data, isFetching} = useQuery<DataEmpresa>({
    queryKey: ['empresa'],
    queryFn: () => {
      const options: FetchOptions = {
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

type EmpresaInfoResp = EmpresaInfo | ApiGenericResp
export const useEmpresaInfoQuery = () => {
  const {data, isFetching} = useQuery<EmpresaInfoResp>({
    queryKey: ['empresa_info'],
    queryFn: () => {
      const options: FetchOptions = {
        url: apiURL + "config/get_empresa_info",
      }
      return fnFetch(options)
    },
    staleTime: 1000 * 60 * 60 * 5
  })
 
  return {
    data,
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

  const {data, isPending, isError, mutate, reset } = useMutation<T, Error, FetchOptions, unknown>({
    mutationKey: ['mut_empresa'],
    mutationFn: fnFetch,
    onSuccess: (resp) => {
      const r = resp as QueryResp
      if(r?.msgType !== 'success') return
      queryClient.invalidateQueries({queryKey:["empresa"]}) // Recarga la tabla proveedores
    }
  })

  const updateEmpresa = (formData: FormData) => {
    typeActionRef.current = "mutate_empresa"
    const options: FetchOptions = {
      method: "POST",
      url: apiURL + "config/update_empresa",
      body: formData,
      authorization: "Bearer " + token,
    }
    mutate(options)
  }

  useEffect(()=>{
    const d = data as QueryResp
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


