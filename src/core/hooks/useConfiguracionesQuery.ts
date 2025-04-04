const beURL = import.meta.env.VITE_BE_URL;
import { useMutation, useQueryClient } from "@tanstack/react-query"
import useSessionStore from "../store/useSessionStore"
import { mutationFetch } from "../services/mutationFecth";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

// ****** MUTATION CONFIGURACIONES ******
export const useMutationConfiguracionesQuery = () => {
  const resetSessionStore = useSessionStore(state => state.resetSessionStore)
  const navigate = useNavigate()
  
  const tknSession = useSessionStore(state => state.tknSession)
  const nombreModulo = useSessionStore(state => state.moduloActual?.nombre)
  const Authorization = "Bearer " + tknSession
  const queryClient = useQueryClient()

  const {data, isPending, isError, mutate,} = useMutation({
    mutationFn: mutationFetch,
    onSuccess: (resp) => {
      if(resp.msgType !== 'success') return
      queryClient.invalidateQueries({queryKey:["users"]})
    }
  })



  const obtenerEmpresa = () => {
    const params = {
      url: beURL + "api/configuraciones/obtener_empresa",
      headers:{ 
        Authorization, 
        'nombre-modulo': nombreModulo,
      },
    }
    mutate(params)
  }
  
  const actualizarEmpresa = (formData: FormData) => {
    const params = {
      url: beURL + "api/configuraciones/actualizar_empresa",
      method: "POST",
      headers:{ 
        Authorization,
        'nombre-modulo': nombreModulo,
      },
      body: formData
    }
    mutate(params)
  }

  const obtenerConfiguraciones = () => {
    const params = {
      url: beURL + "api/configuraciones/obtener_configuraciones",
      headers:{ 
        Authorization,
        'nombre-modulo': nombreModulo,
      },
    }
    mutate(params)
  }

  const actualizarConfiguraciones = (form: any) => {
    const params = {
      url: beURL + "api/configuraciones/actualizar_configuraciones",
      method: "POST",
      headers:{ 
        Authorization,
        'nombre-modulo': nombreModulo,
      },
      body: JSON.stringify(form)
    }
    mutate(params)
  }

  const resetValues = (newValues: any) => {
    mutate({newValues}) // Solo actualiza los datos, no hace fetch
  }
  useEffect(()=>{
    if(data?.msgType === "errorToken"){
      resetSessionStore()
      navigate("/auth")
    }
  },[data])

  return {
    data, 
    isPending, 
    isError,
    obtenerEmpresa,
    actualizarEmpresa,
    obtenerConfiguraciones,
    actualizarConfiguraciones,
    resetValues,
  }
}


