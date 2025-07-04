const apiURL = import.meta.env.VITE_API_URL;
import { useMutation, useQueryClient } from "@tanstack/react-query"
import useSessionStore from "../store/useSessionStore"
import { mutationFetch } from "../services/mutationFecth";
import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

type TypeAction = 
  "mutate_empresa"
  | "mutate_apis_nro_doc"
  | "mutate_cpe_fact"
  | "mutate_cpe_guia"
  | "mutate_usuario_sol_sec"
  | "mutate_email_config"
  | "mutate_establecimiento"
  | "check_this_term"
  
// ****** MUTATION ******
export const useMutationConfigQuery = () => {
  // const [typeAction, setTypeAction] = useState<TypeAction | "">("")
  const navigate = useNavigate()
  const resetSessionStore = useSessionStore(state => state.resetSessionStore)
  const tknSession = useSessionStore(state => state.tknSession)
  const Authorization = "Bearer " + tknSession
  const queryClient = useQueryClient()
  const typeActionRef = useRef<TypeAction | "">("")

  const {data, isPending, isError, mutate,} = useMutation({
    mutationFn: mutationFetch,
    onSuccess: (resp) => {
      if(resp.msgType !== 'success') return
      queryClient.invalidateQueries({queryKey:["users"]})
    }
  })

  const getEmpresa = () => {
    const params = {
      url: apiURL + "config/get_empresa",
      headers:{ 
        Authorization, 
      },
    }
    mutate(params)
  }
  
  const updateEmpresa = (formData: FormData) => {
    typeActionRef.current = "mutate_empresa"
    const params = {
      url: apiURL + "config/update_empresa",
      method: "POST",
      headers:{ 
        Authorization,
      },
      body: formData
    }
    mutate(params)
  }

  const getApisNroDoc = () => {
    const params = {
      url: apiURL + "config/get_apis_nro_doc",
      method: "POST",
      headers:{ 
        Authorization,
      },
    }
    mutate(params) 
  }

  const updateApisNroDoc = (form: any) => {
    typeActionRef.current = "mutate_apis_nro_doc"
    const params = {
      url: apiURL + "config/update_apis_nro_doc",
      method: "POST",
      headers:{ 
        Authorization,
      },
      body: JSON.stringify(form)
    }
    mutate(params) 
  }

  const getCpeFact = () => {
    const params = {
      url: apiURL + "config/get_cpe_fact",
      method: "POST",
      headers:{ 
        Authorization,
      },
    }
    mutate(params)  
  }

  const updateCpeFact = (form: any) => {
    typeActionRef.current = "mutate_cpe_fact"
    const params = {
      url: apiURL + "config/update_cpe_fact",
      method: "POST",
      headers:{ 
        Authorization,
      },
      body: JSON.stringify(form)
    }
    mutate(params)  
  }

  const getCpeGuia = () => {
    const params = {
      url: apiURL + "config/get_cpe_guia",
      method: "POST",
      headers:{ 
        Authorization,
      },
    }
    mutate(params) 
  }
  
  const updateCpeGuia = (form: any) => {
    typeActionRef.current = "mutate_cpe_guia"
    const params = {
      url: apiURL + "config/update_cpe_guia",
      method: "POST",
      headers:{ 
        Authorization,
      },
      body: JSON.stringify(form)
    }
    mutate(params) 
  }

  const getUsuarioSolSec = () => {
    const params = {
      url: apiURL + "config/get_usuario_sol_sec",
      method: "POST",
      headers:{ 
        Authorization,
      },
    }
    mutate(params) 
  }
  
  const updateUsuarioSolSec = (form: any) => {
    typeActionRef.current = "mutate_usuario_sol_sec"
    const params = {
      url: apiURL + "config/update_usuario_sol_sec",
      method: "POST",
      headers:{ 
        Authorization,
      },
      body: JSON.stringify(form)
    }
    mutate(params) 
  }

  const getEmailConfig = () => {
    const params = {
      url: apiURL + "config/get_email_config",
      method: "POST",
      headers:{ 
        Authorization,
      },
    }
    mutate(params) 
  }
  
  const updateEmailConfig = (form: any) => {
    typeActionRef.current = "mutate_email_config"
    const params = {
      url: apiURL + "config/update_email_config",
      method: "POST",
      headers:{ 
        Authorization,
      },
      body: JSON.stringify(form)
    }
    mutate(params) 
  }





  const reset = (newValues: any) => {
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
    typeAction: typeActionRef.current,
    reset,
  }
}


