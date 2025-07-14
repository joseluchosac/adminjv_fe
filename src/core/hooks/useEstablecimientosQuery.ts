const apiURL = import.meta.env.VITE_API_URL;
import { useEffect, useRef } from "react"
import { useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query"
import useSessionStore from "../store/useSessionStore"
import { Establecimiento } from "../types/catalogosTypes";
import { fnFetch } from "../services/fnFetch";
import { FnFetchOptions } from "../types";

type TypeAction = "filter_full" | "mutate_establecimiento" | "delete_establecimiento"

// ****** MUTATION ******
export const useMutationEstablecimientosQuery = () => {
  const resetSessionStore = useSessionStore(state => state.resetSessionStore)
  const navigate = useNavigate()
  const token = useSessionStore(state => state.tknSession)
  const queryClient = useQueryClient()
  const typeActionRef = useRef<TypeAction | "">("")

  const {data, isPending, isError, mutate, } = useMutation({
    mutationFn: fnFetch,
    onSuccess: (resp) => {
      if(resp.msgType !== 'success') return
      queryClient.invalidateQueries({queryKey:["establecimientos"]}) // Recarga la tabla establecimientos
    }
  })

  const getEstablecimientos = () => {
    const options: FnFetchOptions = {
      method: "POST",
      url: apiURL + "establecimientos/get_establecimientos",
      authorization: "Bearer " + token,
    }
    mutate(options)
  }

  const getEstablecimientosOptions = () => {
    const options: FnFetchOptions = {
      method: "POST",
      url: apiURL + "establecimientos/get_establecimientos_options",
    }
    mutate(options)
  }

  const getEstablecimiento = (id: number) => {
    const options: FnFetchOptions = {
      method: "POST",
      url: apiURL + "establecimientos/get_establecimiento",
      body: JSON.stringify({id}),
      authorization: "Bearer " + token,
    }
    mutate(options)
  }

  const createEstablecimiento = (establecimiento: Establecimiento) => {
    typeActionRef.current = "mutate_establecimiento"
    const options: FnFetchOptions = {
      method: "POST",
      url: apiURL + "establecimientos/create_establecimiento",
      body: JSON.stringify(establecimiento),
      authorization: "Bearer " + token,
    }
    mutate(options)
  }

  const updateEstablecimiento = (establecimiento: Establecimiento) => {
    typeActionRef.current = "mutate_establecimiento"
    const options: FnFetchOptions = {
      method: "PUT",
      url: apiURL + "establecimientos/update_establecimiento",
      body: JSON.stringify(establecimiento),
      authorization: "Bearer " + token,
    }
    mutate(options)
  }

  const deleteEstablecimiento = (id: number) => {
    typeActionRef.current = "delete_establecimiento"
    const options: FnFetchOptions = {
      method: "DELETE",
      url: apiURL + "establecimientos/delete_establecimiento",
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
    getEstablecimientos,
    getEstablecimientosOptions,
    getEstablecimiento,
    createEstablecimiento,
    updateEstablecimiento,
    deleteEstablecimiento,
    typeAction: typeActionRef.current,
  }
}
