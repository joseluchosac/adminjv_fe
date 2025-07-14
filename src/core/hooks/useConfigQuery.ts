const apiURL = import.meta.env.VITE_API_URL;
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import useSessionStore from "../store/useSessionStore"
import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Empresa, FnFetchOptions } from "../types";
import { fnFetch } from "../services/fnFetch";

type TypeAction = 
  "mutate_empresa"
  | "mutate_apis_nro_doc"
  | "mutate_cpe_fact"
  | "mutate_cpe_guia"
  | "mutate_usuario_sol_sec"
  | "mutate_email_config"
  | "mutate_establecimiento"
  | "check_this_term"

type DataEmpresa = {content: Empresa}

export const useEmpresaQuery = () => {
  const tknSession = useSessionStore(state => state.tknSession)
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

  return {
    empresa: data?.content,
    isFetching
  }
}

// ****** MUTATION ******
export const useMutationConfigQuery = () => {
  const navigate = useNavigate()
  const resetSessionStore = useSessionStore(state => state.resetSessionStore)
  const token = useSessionStore(state => state.tknSession)
  const queryClient = useQueryClient()
  const typeActionRef = useRef<TypeAction | "">("")

  const {data, isPending, isError, mutate,} = useMutation({
    mutationFn: fnFetch,
    onSuccess: (resp) => {
      if(resp.msgType !== 'success') return
      queryClient.invalidateQueries({queryKey:["users"]})
    }
  })

  const updateEmpresa = (formData: FormData) => {
    typeActionRef.current = "mutate_empresa"
    // const params = {
    //   url: apiURL + "config/update_empresa",
    //   method: "POST",
    //   headers:{ 
    //     Authorization,
    //   },
    //   body: formData
    // }
    // mutate(params)
    const options: FnFetchOptions = {
      method: "POST",
      url: apiURL + "config/update_empresa",
      body: formData,
      authorization: "Bearer " + token,
    }
    mutate(options)
  }

  const getApisNroDoc = () => {
    const options: FnFetchOptions = {
      method: "POST",
      url: apiURL + "config/get_apis_nro_doc",
      authorization: "Bearer " + token,
    }
    mutate(options)
  }

  const updateApisNroDoc = (form: any) => {
    typeActionRef.current = "mutate_apis_nro_doc"
    const options: FnFetchOptions = {
      method: "POST",
      url: apiURL + "config/update_apis_nro_doc",
      body: JSON.stringify(form),
      authorization: "Bearer " + token,
    }
    mutate(options)
  }

  const getCpeFact = () => {
    const options: FnFetchOptions = {
      method: "POST",
      url: apiURL + "config/get_cpe_fact",
      authorization: "Bearer " + token,
    }
    mutate(options)
  }

  const updateCpeFact = (form: any) => {
    typeActionRef.current = "mutate_cpe_fact"
    const options: FnFetchOptions = {
      method: "POST",
      url: apiURL + "config/update_cpe_fact",
      body: JSON.stringify(form),
      authorization: "Bearer " + token,
    }
    mutate(options)
  }

  const getCpeGuia = () => {
    const options: FnFetchOptions = {
      method: "POST",
      url: apiURL + "config/get_cpe_guia",
      authorization: "Bearer " + token,
    }
    mutate(options)
  }
  
  const updateCpeGuia = (form: any) => {
    typeActionRef.current = "mutate_cpe_guia"
    const options: FnFetchOptions = {
      method: "POST",
      url: apiURL + "config/update_cpe_guia",
      body: JSON.stringify(form),
      authorization: "Bearer " + token,
    }
    mutate(options)
  }

  const getUsuarioSolSec = () => {
    const options: FnFetchOptions = {
      method: "POST",
      url: apiURL + "config/get_usuario_sol_sec",
      authorization: "Bearer " + token,
    }
    mutate(options)
  }
  
  const updateUsuarioSolSec = (form: any) => {
    typeActionRef.current = "mutate_usuario_sol_sec"
    const options: FnFetchOptions = {
      method: "POST",
      url: apiURL + "config/update_usuario_sol_sec",
      body: JSON.stringify(form),
      authorization: "Bearer " + token,
    }
    mutate(options)
  }

  const getEmailConfig = () => {
    const options: FnFetchOptions = {
      method: "POST",
      url: apiURL + "config/get_email_config",
      authorization: "Bearer " + token,
    }
    mutate(options)
  }
  
  const updateEmailConfig = (form: any) => {
    typeActionRef.current = "mutate_email_config"
    const options: FnFetchOptions = {
      method: "POST",
      url: apiURL + "config/update_email_config",
      body: JSON.stringify(form),
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
    isError,
    updateEmpresa,
    getApisNroDoc,
    updateApisNroDoc,
    getCpeFact,
    updateCpeFact,
    getCpeGuia,
    updateCpeGuia,
    getUsuarioSolSec,
    updateUsuarioSolSec,
    getEmailConfig,
    updateEmailConfig,
    typeAction: typeActionRef.current,
  }
}


