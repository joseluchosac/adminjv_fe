const apiURL = import.meta.env.VITE_API_URL;
import { useMutation, useQueryClient } from "@tanstack/react-query"
import useSessionStore from "../store/useSessionStore"
import { ModuloForm, ModuloT } from "../types"
import { mutationFetch } from "../services/mutationFecth";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

// ****** MUTATION ******
export const useMutateModulosQuery = () => {
  const resetSessionStore = useSessionStore(state => state.resetSessionStore)
  const navigate = useNavigate()
  const tknSession = useSessionStore(state => state.tknSession)
  const nombreModulo = useSessionStore(state => state.moduloActual?.nombre)
  const Authorization = "Bearer " + tknSession
  const queryClient = useQueryClient()

  const {mutate, isPending, data} = useMutation({
    mutationFn: mutationFetch,
    onSuccess: () => {
      queryClient.fetchQuery({queryKey:["modulos"]});
    }
  })

  const getModulos = () => {
    const params = {
      url: apiURL + "modulos/get_modulos",
      method: "POST",
      headers:{ 
        Authorization,
        'nombre-modulo': nombreModulo,
      },
    }
    mutate(params)
  }

  const getModulosSession = () => {
    const params = {
      url: apiURL + "modulos/get_modulos_sesion",
      method: "POST",
      headers:{ 
        Authorization,
        // 'nombre-modulo': nombreModulo,
      },
    }
    mutate(params)
  }

  const getModuloRol = (rol_id: number) => {
    const params = {
      url: apiURL + "modulos/get_modulo_rol",
      method: "POST",
      headers:{ 
        Authorization,
        'nombre-modulo': nombreModulo,
      },
      body: JSON.stringify({rol_id})
    }
    mutate(params)
  }

  const sortModulos = (orderedItems: ModuloT[]) => {
    const params = {
      url: apiURL + "modulos/sort_modulos",
      method: "PUT",
      headers:{ 
        Authorization,
        'nombre-modulo': nombreModulo,
      },
      body: JSON.stringify(orderedItems)
    }
    mutate(params)
  }

  const updateModulo = (param: ModuloForm) => {
    const params = {
      url: apiURL + "modulos/update_modulo",
      method: "PUT",
      headers:{ 
        Authorization,
        'nombre-modulo': nombreModulo,
      },
      body: JSON.stringify(param),
    }
    mutate(params)
  }

  const createModulo = (param:  ModuloForm) => {
    const params = {
      url: apiURL + "modulos/create_modulo",
      method: "POST",
      headers:{ 
        Authorization,
        'nombre-modulo': nombreModulo,
      },
      body: JSON.stringify(param),
    }
    mutate(params)
  }

  const deleteModulo = (id: number) => {
    const params = {
      url: apiURL + "modulos/delete_modulo",
      method: "DELETE",
      headers:{ 
        Authorization,
        'nombre-modulo': nombreModulo,
      },
      body: JSON.stringify({id}),
    }
    mutate(params)
  }

  const updateModulosRoles = (param: any) => {
    const params = {
      url: apiURL + "modulos/update_modulos_roles",
      method: "POST",
      headers:{ 
        Authorization,
        'nombre-modulo': nombreModulo,
      },
      body: JSON.stringify(param),
    }
    mutate(params)
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

