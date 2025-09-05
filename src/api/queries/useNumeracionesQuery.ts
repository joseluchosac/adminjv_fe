const apiURL = import.meta.env.VITE_API_URL;
import { useEffect } from "react"
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query"
import useSessionStore from "../../app/store/useSessionStore"
import { FetchOptions, Numeracion } from "../../app/types";
import { fnFetch } from "../fnFetch";


// ****** MUTATION ******
export const useMutationNumeracionesQuery = () => {
  const resetSessionStore = useSessionStore(state => state.resetSessionStore)
  const navigate = useNavigate()
  const token = useSessionStore(state => state.tknSession)

  const {data, isPending, isError, mutate, } = useMutation({
    mutationFn: fnFetch,
    onSuccess: (resp) => {
      if(resp.msgType !== 'success') return
    }
  })

  const getNumeraciones = () => {
    const options: FetchOptions = {
      method: "POST",
      url: apiURL + "numeraciones/get_numeraciones",
      authorization: "Bearer " + token,
    }
    mutate(options)
  }

  const getNumeracion = (id: number) => {
    const options: FetchOptions = {
      method: "POST",
      url: apiURL + "numeraciones/get_numeracion",
      body: JSON.stringify({id}),
      authorization: "Bearer " + token,
    }
    mutate(options)
  }

  const createNumeracion = (numeracion: Numeracion) => {
    const options: FetchOptions = {
      method: "POST",
      url: apiURL + "numeraciones/create_numeracion",
      body: JSON.stringify(numeracion),
      authorization: "Bearer " + token,
    }
    mutate(options)
  }

  const updateNumeracion = (numeracion: Numeracion) => {
    const options: FetchOptions = {
      method: "PUT",
      url: apiURL + "numeraciones/update_numeracion",
      body: JSON.stringify(numeracion),
      authorization: "Bearer " + token,
    }
    mutate(options)
  }
  const deleteNumeracion = (id: number) => {
    const options: FetchOptions = {
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
  }
}
