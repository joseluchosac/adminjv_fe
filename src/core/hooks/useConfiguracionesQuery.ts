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

  const getEmpresa = () => {
    const params = {
      url: beURL + "api/config/get_empresa",
      headers:{ 
        Authorization, 
        'nombre-modulo': nombreModulo,
      },
    }
    mutate(params)
  }
  
  const updateEmpresa = (formData: FormData) => {
    const params = {
      url: beURL + "api/config/update_empresa",
      method: "POST",
      headers:{ 
        Authorization,
        'nombre-modulo': nombreModulo,
      },
      body: formData
    }
    mutate(params)
  }

  const getApisNroDoc = () => {
    const params = {
      url: beURL + "api/config/get_apis_nro_doc",
      method: "POST",
      headers:{ 
        Authorization,
        'nombre-modulo': nombreModulo,
      },
    }
    mutate(params) 
  }

  const updateApisNroDoc = (form: any) => {
    const params = {
      url: beURL + "api/config/update_apis_nro_doc",
      method: "POST",
      headers:{ 
        Authorization,
        'nombre-modulo': nombreModulo,
      },
      body: JSON.stringify(form)
    }
    mutate(params) 
  }

  const getCpeFact = () => {
    const params = {
      url: beURL + "api/config/get_cpe_fact",
      method: "POST",
      headers:{ 
        Authorization,
        'nombre-modulo': nombreModulo,
      },
    }
    mutate(params)  
  }

  const updateCpeFact = (form: any) => {
    const params = {
      url: beURL + "api/config/update_cpe_fact",
      method: "POST",
      headers:{ 
        Authorization,
        'nombre-modulo': nombreModulo,
      },
      body: JSON.stringify(form)
    }
    mutate(params)  
  }

  const getCpeGuia = () => {
    const params = {
      url: beURL + "api/config/get_cpe_guia",
      method: "POST",
      headers:{ 
        Authorization,
        'nombre-modulo': nombreModulo,
      },
    }
    mutate(params) 
  }
  
  const updateCpeGuia = (form: any) => {
    const params = {
      url: beURL + "api/config/update_cpe_guia",
      method: "POST",
      headers:{ 
        Authorization,
        'nombre-modulo': nombreModulo,
      },
      body: JSON.stringify(form)
    }
    mutate(params) 
  }

  const getUsuarioSolSec = () => {
    const params = {
      url: beURL + "api/config/get_usuario_sol_sec",
      method: "POST",
      headers:{ 
        Authorization,
        'nombre-modulo': nombreModulo,
      },
    }
    mutate(params) 
  }
  
  const updateUsuarioSolSec = (form: any) => {
    const params = {
      url: beURL + "api/config/update_usuario_sol_sec",
      method: "POST",
      headers:{ 
        Authorization,
        'nombre-modulo': nombreModulo,
      },
      body: JSON.stringify(form)
    }
    mutate(params) 
  }

  const getEmailConfig = () => {
    const params = {
      url: beURL + "api/config/get_email_config",
      method: "POST",
      headers:{ 
        Authorization,
        'nombre-modulo': nombreModulo,
      },
    }
    mutate(params) 
  }
  
  const updateEmailConfig = (form: any) => {
    const params = {
      url: beURL + "api/config/update_email_config",
      method: "POST",
      headers:{ 
        Authorization,
        'nombre-modulo': nombreModulo,
      },
      body: JSON.stringify(form)
    }
    mutate(params) 
  }

  const getEstablecimientos = () => {
    const params = {
      url: beURL + "api/config/get_establecimientos",
      method: "POST",
      headers:{ 
        Authorization,
        'nombre-modulo': nombreModulo,
      },
    }
    mutate(params) 
  }
  
  const getSeriesEstablecimiento = (establecimiento_id: number) => {
    const params = {
      url: beURL + "api/config/get_series_establecimiento",
      method: "POST",
      headers:{ 
        Authorization,
        'nombre-modulo': nombreModulo,
      },
      body: JSON.stringify({establecimiento_id})
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
    getEmpresa,
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
    getEstablecimientos,
    getSeriesEstablecimiento,
    resetValues,
  }
}


