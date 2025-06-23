const apiURL = import.meta.env.VITE_API_URL;
import { useEffect, useRef } from "react"
import { useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query"
import useSessionStore from "../store/useSessionStore"
import { mutationFetch } from "../services/mutationFecth"
import { Establecimiento } from "../types/catalogosTypes";

type TypeAction = "filter_full" | "mutate_establecimiento" | "delete_establecimiento"

// ****** MUTATION ******
export const useMutationEstablecimientosQuery = () => {
  const resetSessionStore = useSessionStore(state => state.resetSessionStore)
  const navigate = useNavigate()
  const tknSession = useSessionStore(state => state.tknSession)
  const nombreModulo = useSessionStore(state => state.moduloActual?.nombre)
  const Authorization = "Bearer " + tknSession
  const queryClient = useQueryClient()
  const typeActionRef = useRef<TypeAction | "">("")

  const {data, isPending, isError, mutate, } = useMutation({
    mutationFn: mutationFetch,
    onSuccess: (resp) => {
      if(resp.msgType !== 'success') return
      queryClient.invalidateQueries({queryKey:["establecimientos"]}) // Recarga la tabla establecimientos
    }
  })

  const getEstablecimientos = () => {
    const params = {
      url: apiURL + "establecimientos/get_establecimientos",
      method: "POST",
      headers:{ 
        Authorization,
        'nombre-modulo': nombreModulo,
      },
    }
    mutate(params)
  }

  const getEstablecimiento = (id: number) => {
    const params = {
      url: apiURL + "establecimientos/get_establecimiento",
      method: "POST",
      headers:{ 
        Authorization,
        'nombre-modulo': nombreModulo,
      },
      body: JSON.stringify({id}),
    }
    mutate(params)
  }

  const createEstablecimiento = (establecimiento: Establecimiento) => {
    typeActionRef.current = "mutate_establecimiento"
    const params = {
      url: apiURL + "establecimientos/create_establecimiento",
      method: "POST",
      headers:{ 
        Authorization,
        'nombre-modulo': nombreModulo,
      },
      body: JSON.stringify(establecimiento),
    }
    mutate(params)
  }

  const updateEstablecimiento = (establecimiento: Establecimiento) => {
    typeActionRef.current = "mutate_establecimiento"
    const params = {
      url: apiURL + "establecimientos/update_establecimiento",
      method: "PUT",
      headers:{ 
        Authorization,
        'nombre-modulo': nombreModulo,
      },
      body: JSON.stringify(establecimiento),
    }
    mutate(params)
  }

  const deleteEstablecimiento = (id: number) => {
    typeActionRef.current = "delete_establecimiento"
    const params = {
      url: apiURL + "establecimientos/delete_establecimiento",
      method: "DELETE",
      headers:{ 
        Authorization,
        'nombre-modulo': nombreModulo,
      },
      body: JSON.stringify({id}),
    }
    mutate(params)
  }

  const reset = (newValues: any) => {
    mutate({newValues}) // Solo actualiza los datos, solo local
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
    getEstablecimientos,
    getEstablecimiento,
    createEstablecimiento,
    updateEstablecimiento,
    deleteEstablecimiento,
    typeAction: typeActionRef.current,
    reset,
  }
}
