const apiURL = import.meta.env.VITE_API_URL;
import { useEffect, useRef, useState } from "react"
import { useNavigate } from "react-router-dom";
import { useInfiniteQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import useSessionStore from "../store/useSessionStore"
import { FilterLaboratoriosResp, FnFetchOptions, Laboratorio } from "../types";
import { filterParamsInit } from "../utils/constants";
import { fnFetch } from "../services/fnFetch";

type TypeAction = 
  "filter_full"
  | "mutate_laboratorio"

// ****** FILTRAR  ******
export const useFilterLaboratoriosQuery = () => {
  const [filterParamsLaboratorios, setFilterParamsLaboratorios] = useState(filterParamsInit)
  const token = useSessionStore(state => state.tknSession)
  const queryClient = useQueryClient()

  const {
    data,
    isError,
    isLoading,
    isFetching,
    hasNextPage,
    fetchNextPage,
  } = useInfiniteQuery<FilterLaboratoriosResp, Error>({
    queryKey: ['laboratorios'],
    queryFn: ({pageParam = 1, signal}) => {
      const page = pageParam as number
      const options: FnFetchOptions = {
        method: "POST",
        url: `${apiURL}laboratorios/filter_laboratorios?page=${page}`,
        body: JSON.stringify(filterParamsLaboratorios),
        authorization: "Bearer " + token,
        signal
      }
      return fnFetch(options)
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      return lastPage.next != 0 ? lastPage.next : undefined
    },
    getPreviousPageParam: (lastPage) => lastPage.previous ?? undefined,
    staleTime: 1000 * 60 * 5 
  })
  
  const resetear = ()=>{
    queryClient.resetQueries({ queryKey: ['laboratorios'], exact: true });
    setFilterParamsLaboratorios(filterParamsInit)
  }

  useEffect(() => {
    return () => {
      resetear()
    }
  },[])
  
  useEffect(() => {
    queryClient.invalidateQueries({queryKey:["laboratorios"]})
  }, [filterParamsLaboratorios])

  return {
    data,
    isError, 
    isLoading, 
    isFetching, 
    hasNextPage, 
    fetchNextPage,
    setFilterParamsLaboratorios,
  }
}

// ****** MUTATION ******
export const useMutationLaboratoriosQuery = () => {
  const resetSessionStore = useSessionStore(state => state.resetSessionStore)
  const navigate = useNavigate()
  const token = useSessionStore(state => state.tknSession)
  const queryClient = useQueryClient()
  const typeActionRef = useRef<TypeAction | "">("")

  const {data, isPending, isError, mutate, } = useMutation({
    mutationFn: fnFetch,
    onSuccess: (resp) => {
      if(resp.msgType !== 'success') return
      queryClient.invalidateQueries({queryKey:["laboratorios"]}) // Recarga la tabla laboratorios
    }
  })

  const getLaboratorio = (id: number) => {
    const options: FnFetchOptions = {
      method: "POST",
      url: apiURL + "laboratorios/get_laboratorio",
      body: JSON.stringify({id}),
      authorization: "Bearer " + token,
    }
    mutate(options)
  }

  const createLaboratorio = (laboratorio: Laboratorio) => {
    typeActionRef.current = "mutate_laboratorio"
    const options: FnFetchOptions = {
      method: "POST",
      url: apiURL + "laboratorios/create_laboratorio",
      body: JSON.stringify(laboratorio),
      authorization: "Bearer " + token,
    }
    mutate(options)
  }

  const updateLaboratorio = (laboratorio: Laboratorio) => {
    typeActionRef.current = "mutate_laboratorio"
    const options: FnFetchOptions = {
      method: "PUT",
      url: apiURL + "laboratorios/update_laboratorio",
      body: JSON.stringify(laboratorio),
      authorization: "Bearer " + token,
    }
    mutate(options)
  }

  const deleteLaboratorio = (id: number) => {
    typeActionRef.current = "mutate_laboratorio"
    const options: FnFetchOptions = {
      method: "DELETE",
      url: apiURL + "laboratorios/delete_laboratorio",
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
    // filterLaboratoriosFull,
    getLaboratorio,
    createLaboratorio,
    updateLaboratorio,
    deleteLaboratorio,
    typeAction: typeActionRef.current,
  }
}


