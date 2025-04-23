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

  const obtenerApisNroDoc = () => {
    const params = {
      url: beURL + "api/configuraciones/obtener_apis_nro_doc",
      method: "POST",
      headers:{ 
        Authorization,
        'nombre-modulo': nombreModulo,
      },
    }
    mutate(params) 
  }

  const actualizarApisNroDoc = (form: any) => {
    const params = {
      url: beURL + "api/configuraciones/actualizar_apis_nro_doc",
      method: "POST",
      headers:{ 
        Authorization,
        'nombre-modulo': nombreModulo,
      },
      body: JSON.stringify(form)
    }
    mutate(params) 
  }

  const obtenerCpeFact = () => {
    const params = {
      url: beURL + "api/configuraciones/obtener_cpe_fact",
      method: "POST",
      headers:{ 
        Authorization,
        'nombre-modulo': nombreModulo,
      },
    }
    mutate(params)  
  }

  const actualizarCpeFact = (form: any) => {
    const params = {
      url: beURL + "api/configuraciones/actualizar_cpe_fact",
      method: "POST",
      headers:{ 
        Authorization,
        'nombre-modulo': nombreModulo,
      },
      body: JSON.stringify(form)
    }
    mutate(params)  
  }

  const obtenerCpeGuia = () => {
    const params = {
      url: beURL + "api/configuraciones/obtener_cpe_guia",
      method: "POST",
      headers:{ 
        Authorization,
        'nombre-modulo': nombreModulo,
      },
    }
    mutate(params) 
  }
  
  const actualizarCpeGuia = (form: any) => {
    const params = {
      url: beURL + "api/configuraciones/actualizar_cpe_guia",
      method: "POST",
      headers:{ 
        Authorization,
        'nombre-modulo': nombreModulo,
      },
      body: JSON.stringify(form)
    }
    mutate(params) 
  }

  const obtenerUsuarioSolSec = () => {
    const params = {
      url: beURL + "api/configuraciones/obtener_usuario_sol_sec",
      method: "POST",
      headers:{ 
        Authorization,
        'nombre-modulo': nombreModulo,
      },
    }
    mutate(params) 
  }
  
  const actualizarUsuarioSolSec = (form: any) => {
    const params = {
      url: beURL + "api/configuraciones/actualizar_usuario_sol_sec",
      method: "POST",
      headers:{ 
        Authorization,
        'nombre-modulo': nombreModulo,
      },
      body: JSON.stringify(form)
    }
    mutate(params) 
  }

  const obtenerEmailConfig = () => {
    const params = {
      url: beURL + "api/configuraciones/obtener_email_config",
      method: "POST",
      headers:{ 
        Authorization,
        'nombre-modulo': nombreModulo,
      },
    }
    mutate(params) 
  }
  
  const actualizarEmailConfig = (form: any) => {
    const params = {
      url: beURL + "api/configuraciones/actualizar_email_config",
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
    obtenerApisNroDoc,
    actualizarApisNroDoc,
    obtenerCpeFact,
    actualizarCpeFact,
    obtenerCpeGuia,
    actualizarCpeGuia,
    obtenerUsuarioSolSec,
    actualizarUsuarioSolSec,
    obtenerEmailConfig,
    actualizarEmailConfig,
    resetValues,
  }
}


