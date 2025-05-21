const beURL = import.meta.env.VITE_BE_URL;
import { useInfiniteQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import useSessionStore from "../store/useSessionStore"
import { useEffect, useState } from "react"
import { mutationFetch } from "../services/mutationFecth"
import { useNavigate } from "react-router-dom";
import useLaboratoriosStore, { laboratoriosStoreInit } from "../store/useLaboratoriosStore";
import { filterLaboratoriosFetch } from "../services/laboratoriosFetch";
import { Laboratorio } from "../types";


// ****** FILTRAR  ******
export const useFilterLaboratoriosQuery = () => {
  // const navigate = useNavigate()
  const [isEnabledQuery, setIsEnabledQuery] = useState(false)
  const tknSession = useSessionStore(state => state.tknSession)
  const filterParamsLaboratorios = useLaboratoriosStore(state => state.filterParamsLaboratorios)
  const queryClient = useQueryClient()
  const setFilterParamsLaboratorios = useLaboratoriosStore(state => state.setFilterParamsLaboratorios)


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

  // useEffect(()=>{
  //   if(data?.pages[data?.pages.length-1].msgType === "errorToken"){
  //     navigate("/auth")
  //   }
  // },[data])

  return {
    data,
    isError, 
    isLoading, 
    isFetching, 
    hasNextPage, 
    fetchNextPage, 
  }
}

// ****** MUTATION CLIENTES ******
export const useMutationLaboratoriosQuery = () => {
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
    const params = {
      url: beURL + "api/laboratorios/filter_laboratorios_full",
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
    const params = {
      url: beURL + "api/laboratorios/get_laboratorio",
      method: "POST",
      headers:{ 
        Authorization,
        'nombre-modulo': nombreModulo,
      },
      body: JSON.stringify({id}),
    }
    mutate(params)
  }

  const createLaboratorio = (param: Laboratorio) => {
    const params = {
      url: beURL + "api/laboratorios/create_laboratorio",
      method: "POST",
      headers:{ 
        Authorization,
        'nombre-modulo': nombreModulo,
      },
      body: JSON.stringify(param),
    }
    mutate(params)
  }


  const updateLaboratorio = (param: Laboratorio) => {
    const params = {
      url: beURL + "api/laboratorios/update_laboratorio",
      method: "PUT",
      headers:{ 
        Authorization,
        'nombre-modulo': nombreModulo,
      },
      body: JSON.stringify(param),
    }
    mutate(params)
  }

  const deleteLaboratorio = (id: number) => {
    const params = {
      url: beURL + "api/laboratorios/delete_laboratorio",
      method: "DELETE",
      headers:{ 
        Authorization,
        'nombre-modulo': nombreModulo,
      },
      body: JSON.stringify({id}),
    }
    mutate(params)
  }

  const consultarNroDocumento = (param: any) => {
    const params = {
      url: beURL + "api/laboratorios/consultar_nro_documento",
      method: "POST",
      headers:{ 
        Authorization,
        'nombre-modulo': nombreModulo,
      },
      body: JSON.stringify(param),
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
    consultarNroDocumento,
    reset
  }
}


