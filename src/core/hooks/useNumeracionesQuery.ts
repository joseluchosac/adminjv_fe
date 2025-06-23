const apiURL = import.meta.env.VITE_API_URL;
import { useEffect, useRef } from "react"
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query"
import useSessionStore from "../store/useSessionStore"
import { mutationFetch } from "../services/mutationFecth"
import { Numeracion } from "../types/catalogosTypes";

type TypeAction = "filter_full" | "mutate_numeracion" | "delete_numeracion"

// ****** MUTATION ******
export const useMutationNumeracionesQuery = () => {
  const resetSessionStore = useSessionStore(state => state.resetSessionStore)
  const navigate = useNavigate()
  const tknSession = useSessionStore(state => state.tknSession)
  const nombreModulo = useSessionStore(state => state.moduloActual?.nombre)
  const Authorization = "Bearer " + tknSession
  // const queryClient = useQueryClient()
  const typeActionRef = useRef<TypeAction | "">("")

  const {data, isPending, isError, mutate, } = useMutation({
    mutationFn: mutationFetch,
    onSuccess: (resp) => {
      if(resp.msgType !== 'success') return
      // queryClient.invalidateQueries({queryKey:["establecimientos"]}) // Recarga la tabla establecimientos
    }
  })

  // const getNumeracionesEstablecimiento = (establecimiento_id: number) => {
  //   const params = {
  //     url: apiURL + "numeraciones/get_numeraciones_establecimiento",
  //     method: "POST",
  //     headers:{ 
  //       Authorization,
  //       'nombre-modulo': nombreModulo,
  //     },
  //     body: JSON.stringify({establecimiento_id}),
  //   }
  //   mutate(params)
  // }

  const getNumeracion = (id: number) => {
    const params = {
      url: apiURL + "numeraciones/get_numeracion",
      method: "POST",
      headers:{ 
        Authorization,
        'nombre-modulo': nombreModulo,
      },
      body: JSON.stringify({id}),
    }
    mutate(params)
  }

  const createNumeracion = (numeracion: Numeracion) => {
    typeActionRef.current = "mutate_numeracion"
    const params = {
      url: apiURL + "numeraciones/create_numeracion",
      method: "POST",
      headers:{ 
        Authorization,
        'nombre-modulo': nombreModulo,
      },
      body: JSON.stringify(numeracion),
    }
    mutate(params)
  }

  const updateNumeracion = (numeracion: Numeracion) => {
    typeActionRef.current = "mutate_numeracion"
    const params = {
      url: apiURL + "numeraciones/update_numeracion",
      method: "PUT",
      headers:{ 
        Authorization,
        'nombre-modulo': nombreModulo,
      },
      body: JSON.stringify(numeracion),
    }
    mutate(params)
  }
  const deleteNumeracion = (id: number) => {
    typeActionRef.current = "delete_numeracion"
    const params = {
      url: apiURL + "numeraciones/delete_numeracion",
      method: "DELETE",
      headers:{ 
        Authorization,
        'nombre-modulo': nombreModulo,
      },
      body: JSON.stringify({id}),
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
    isError,
    // getNumeracionesEstablecimiento,
    getNumeracion,
    createNumeracion,
    updateNumeracion,
    deleteNumeracion,
    typeAction: typeActionRef.current,
  }
}
