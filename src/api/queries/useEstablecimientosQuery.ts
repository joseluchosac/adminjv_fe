const apiURL = import.meta.env.VITE_API_URL;
import { useEffect, useRef } from "react"
import { useNavigate } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import useSessionStore from "../../app/store/useSessionStore"
import { Establecimiento, FetchOptions } from "../../app/types";
import { fnFetch } from "../fnFetch";

type TypeAction = "filter_full" | "mutate_establecimiento" | "delete_establecimiento"
// ****** ESTABLECIMIENTOS ******
type DataEstablecimientos = {content: Establecimiento[]}
export const useEstablecimientosQuery = () => {
  const tknSession = useSessionStore(state => state.tknSession)
  const {data, isFetching} = useQuery<DataEstablecimientos>({
    queryKey: ['establecimientos'],
    queryFn: () => {
      const options: FetchOptions = {
        url: apiURL + "establecimientos/get_establecimientos",
        authorization: "Bearer " + tknSession
      }
      return fnFetch(options)
    },
    staleTime: 1000 * 60 * 60 * 24
  })

  return {
    establecimientos: data?.content,
    isFetching
  }
}

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

  const getEstablecimiento = (id: number) => {
    const options: FetchOptions = {
      method: "POST",
      url: apiURL + "establecimientos/get_establecimiento",
      body: JSON.stringify({id}),
      authorization: "Bearer " + token,
    }
    mutate(options)
  }

  const createEstablecimiento = (establecimiento: Establecimiento) => {
    typeActionRef.current = "mutate_establecimiento"
    const options: FetchOptions = {
      method: "POST",
      url: apiURL + "establecimientos/create_establecimiento",
      body: JSON.stringify(establecimiento),
      authorization: "Bearer " + token,
    }
    mutate(options)
  }

  const updateEstablecimiento = (establecimiento: Establecimiento) => {
    typeActionRef.current = "mutate_establecimiento"
    const options: FetchOptions = {
      method: "PUT",
      url: apiURL + "establecimientos/update_establecimiento",
      body: JSON.stringify(establecimiento),
      authorization: "Bearer " + token,
    }
    mutate(options)
  }

  const deleteEstablecimiento = (id: number) => {
    typeActionRef.current = "delete_establecimiento"
    const options: FetchOptions = {
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
    getEstablecimiento,
    createEstablecimiento,
    updateEstablecimiento,
    deleteEstablecimiento,
    typeAction: typeActionRef.current,
  }
}
