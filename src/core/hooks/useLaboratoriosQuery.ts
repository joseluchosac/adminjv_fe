const apiURL = import.meta.env.VITE_API_URL;
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom";
import { useInfiniteQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import useSessionStore from "../store/useSessionStore"
import useLaboratoriosStore, { laboratoriosStoreInit } from "../store/useLaboratoriosStore";
import { mutationFetch } from "../services/mutationFecth"
import { filterLaboratoriosFetch } from "../services/laboratoriosFetch";
import { Laboratorio } from "../types";

type TypeAction = 
  "filter_full" 
  | "get_laboratorio" 
  | "mutate_laboratorio"

// ****** FILTRAR  ******
export const useFilterLaboratoriosQuery = () => {
  const [isEnabledQuery, setIsEnabledQuery] = useState(false)
  const tknSession = useSessionStore(state => state.tknSession)
  const filterParamsLaboratorios = useLaboratoriosStore(state => state.filterParamsLaboratorios)
  const setFilterParamsLaboratorios = useLaboratoriosStore(state => state.setFilterParamsLaboratorios)
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const {fetchNextPage, data, refetch, isError, isLoading, isFetching, hasNextPage} = useInfiniteQuery({
    queryKey: ['laboratorios'],
    queryFn: ({pageParam = 1, signal}) => {
      return filterLaboratoriosFetch({filterParamsLaboratorios, pageParam, signal, token: tknSession})
    },
    initialPageParam: 1,
    enabled: isEnabledQuery,
    getNextPageParam: (lastPage) => {
      return lastPage.next != 0 ? lastPage.next : undefined
    },
    getPreviousPageParam: (lastPage) => lastPage.previous ?? undefined,
    staleTime: 1000 * 60 * 5 
  })

  useEffect(() => {
    queryClient.resetQueries({ queryKey: ['laboratorios'], exact: true });
    return () => {
      queryClient.setQueryData(['laboratorios'], () => null)
      setFilterParamsLaboratorios(laboratoriosStoreInit.filterParamsLaboratorios)
    }
  },[])
  
  useEffect(() => {
    if(!isEnabledQuery){
      setIsEnabledQuery(true)
    }else{
      refetch()
    }
  }, [filterParamsLaboratorios])

  useEffect(()=>{
    if(data?.pages[data?.pages.length-1].msgType === "errorToken"){
      navigate("/auth")
    }
  },[data])

  return {
    data,
    isError, 
    isLoading, 
    isFetching, 
    hasNextPage, 
    fetchNextPage, 
  }
}

// ****** MUTATION ******
export const useMutationLaboratoriosQuery = () => {
  const [typeAction, setTypeAction] = useState<TypeAction | "">("")
  const resetSessionStore = useSessionStore(state => state.resetSessionStore)
  const navigate = useNavigate()
  const tknSession = useSessionStore(state => state.tknSession)
  const nombreModulo = useSessionStore(state => state.moduloActual?.nombre)
  const Authorization = "Bearer " + tknSession
  const filterParamsLaboratorios = useLaboratoriosStore(state => state.filterParamsLaboratorios)

  const queryClient = useQueryClient()

  const {data, isPending, isError, mutate, } = useMutation({
    mutationFn: mutationFetch,
    onSuccess: (resp) => {
      if(resp.msgType !== 'success') return
      queryClient.invalidateQueries({queryKey:["laboratorios"]}) // Recarga la tabla laboratorios
    }
  })

  const filterLaboratoriosFull = () => {// Sin Paginacion
    setTypeAction("filter_full")
    const params = {
      url: apiURL + "laboratorios/filter_laboratorios_full",
      method: "POST",
      headers:{ 
        Authorization,
        'nombre-modulo': nombreModulo,
      },
      body: JSON.stringify(filterParamsLaboratorios),
    }
    mutate(params)
  }

  const getLaboratorio = (id: number) => {
    setTypeAction("get_laboratorio")
    const params = {
      url: apiURL + "laboratorios/get_laboratorio",
      method: "POST",
      headers:{ 
        Authorization,
        'nombre-modulo': nombreModulo,
      },
      body: JSON.stringify({id}),
    }
    mutate(params)
  }

  const createLaboratorio = (laboratorio: Laboratorio) => {
    setTypeAction("mutate_laboratorio")
    const params = {
      url: apiURL + "laboratorios/create_laboratorio",
      method: "POST",
      headers:{ 
        Authorization,
        'nombre-modulo': nombreModulo,
      },
      body: JSON.stringify(laboratorio),
    }
    mutate(params)
  }

  const updateLaboratorio = (laboratorio: Laboratorio) => {
    setTypeAction("mutate_laboratorio")
    const params = {
      url: apiURL + "laboratorios/update_laboratorio",
      method: "PUT",
      headers:{ 
        Authorization,
        'nombre-modulo': nombreModulo,
      },
      body: JSON.stringify(laboratorio),
    }
    mutate(params)
  }

  const deleteLaboratorio = (id: number) => {
    setTypeAction("mutate_laboratorio")
    const params = {
      url: apiURL + "laboratorios/delete_laboratorio",
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
    filterLaboratoriosFull,
    getLaboratorio,
    createLaboratorio,
    updateLaboratorio,
    deleteLaboratorio,
    typeAction,
    reset,
  }
}


