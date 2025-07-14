const apiURL = import.meta.env.VITE_API_URL;
import { useEffect, useRef } from "react"
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query"
import useSessionStore from "../store/useSessionStore"
import { FnFetchOptions, Numeracion } from "../types";
import { fnFetch } from "../services/fnFetch";

type TypeAction = "filter_full" | "mutate_numeracion" | "delete_numeracion"

// ****** MUTATION ******
export const useMutationNumeracionesQuery = () => {
  const resetSessionStore = useSessionStore(state => state.resetSessionStore)
  const navigate = useNavigate()
  const token = useSessionStore(state => state.tknSession)
  const typeActionRef = useRef<TypeAction | "">("")

  const {data, isPending, isError, mutate, } = useMutation({
    mutationFn: fnFetch,
    onSuccess: (resp) => {
      if(resp.msgType !== 'success') return
      // queryClient.invalidateQueries({queryKey:["establecimientos"]}) // Recarga la tabla establecimientos
    }
  })

  const getNumeraciones = () => {
    const options: FnFetchOptions = {
      method: "POST",
      url: apiURL + "numeraciones/get_numeraciones",
      authorization: "Bearer " + token,
    }
    mutate(options)
  }

  const getNumeracion = (id: number) => {
    const options: FnFetchOptions = {
      method: "POST",
      url: apiURL + "numeraciones/get_numeracion",
      body: JSON.stringify({id}),
      authorization: "Bearer " + token,
    }
    mutate(options)
  }

  const createNumeracion = (numeracion: Numeracion) => {
    typeActionRef.current = "mutate_numeracion"
    const options: FnFetchOptions = {
      method: "POST",
      url: apiURL + "numeraciones/create_numeracion",
      body: JSON.stringify(numeracion),
      authorization: "Bearer " + token,
    }
    mutate(options)
  }

  const updateNumeracion = (numeracion: Numeracion) => {
    typeActionRef.current = "mutate_numeracion"
    const options: FnFetchOptions = {
      method: "PUT",
      url: apiURL + "numeraciones/update_numeracion",
      body: JSON.stringify(numeracion),
      authorization: "Bearer " + token,
    }
    mutate(options)
  }
  const deleteNumeracion = (id: number) => {
    typeActionRef.current = "delete_numeracion"
    const options: FnFetchOptions = {
      method: "DELETE",
      url: apiURL + "numeraciones/delete_numeracion",
      body: JSON.stringify({id}),
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
    getNumeraciones,
    getNumeracion,
    createNumeracion,
    updateNumeracion,
    deleteNumeracion,
    typeAction: typeActionRef.current,
  }
}
