const apiURL = import.meta.env.VITE_API_URL;
import { useMutation, useQueryClient } from "@tanstack/react-query"
import useSessionStore from "../../app/store/useSessionStore"
import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { FetchOptions } from "../../app/types";
import { fnFetch } from "../fnFetch";

type TypeAction = "UPDATE_CPE_FACT"
  | "UPDATE_CPE_GUIA"
  | "UPDATE_USUARIO_SOL_SEC"

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

  const getApisNroDoc = () => {
    const options: FetchOptions = {
      method: "POST",
      url: apiURL + "config/get_apis_nro_doc",
      authorization: "Bearer " + token,
    }
    mutate(options)
  }

  const updateApisNroDoc = (form: any) => {
    const options: FetchOptions = {
      method: "POST",
      url: apiURL + "config/update_apis_nro_doc",
      body: JSON.stringify(form),
      authorization: "Bearer " + token,
    }
    mutate(options)
  }

  const getCpeFact = () => {
    const options: FetchOptions = {
      method: "POST",
      url: apiURL + "config/get_cpe_fact",
      authorization: "Bearer " + token,
    }
    mutate(options)
  }

  const updateCpeFact = (form: any) => {
    typeActionRef.current = "UPDATE_CPE_FACT"
    const options: FetchOptions = {
      method: "POST",
      url: apiURL + "config/update_cpe_fact",
      body: JSON.stringify(form),
      authorization: "Bearer " + token,
    }
    mutate(options)
  }

  const getCpeGuia = () => {
    const options: FetchOptions = {
      method: "POST",
      url: apiURL + "config/get_cpe_guia",
      authorization: "Bearer " + token,
    }
    mutate(options)
  }
  
  const updateCpeGuia = (form: any) => {
    typeActionRef.current = "UPDATE_CPE_GUIA"
    const options: FetchOptions = {
      method: "POST",
      url: apiURL + "config/update_cpe_guia",
      body: JSON.stringify(form),
      authorization: "Bearer " + token,
    }
    mutate(options)
  }

  const getUsuarioSolSec = () => {
    const options: FetchOptions = {
      method: "POST",
      url: apiURL + "config/get_usuario_sol_sec",
      authorization: "Bearer " + token,
    }
    mutate(options)
  }
  
  const updateUsuarioSolSec = (form: any) => {
    typeActionRef.current = "UPDATE_USUARIO_SOL_SEC"
    const options: FetchOptions = {
      method: "POST",
      url: apiURL + "config/update_usuario_sol_sec",
      body: JSON.stringify(form),
      authorization: "Bearer " + token,
    }
    mutate(options)
  }

  const getEmailConfig = () => {
    const options: FetchOptions = {
      method: "POST",
      url: apiURL + "config/get_email_config",
      authorization: "Bearer " + token,
    }
    mutate(options)
  }
  
  const updateEmailConfig = (form: any) => {
    const options: FetchOptions = {
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


