const apiURL = import.meta.env.VITE_API_URL;
import { useEffect, useRef, useState } from "react"
import { useNavigate } from "react-router-dom";
import { useInfiniteQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import useSessionStore from "../store/useSessionStore"
import useMarcasStore, { marcasStoreInit } from "../store/useMarcasStore";
import { mutationFetch } from "../services/mutationFecth"
import { filterMarcasFetch } from "../services/marcasFetch";
import { Marca } from "../types";

type TypeAction = 
  "filter_full" 
  | "mutate_marca"

// ****** FILTRAR ******
export const useFilterMarcasQuery = () => {
  const [isEnabledQuery, setIsEnabledQuery] = useState(false)
  const tknSession = useSessionStore(state => state.tknSession)
  const filterParamsMarcas = useMarcasStore(state => state.filterParamsMarcas)
  const setFilterParamsMarcas = useMarcasStore(state => state.setFilterParamsMarcas)
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  
  const {fetchNextPage, data, refetch, isError, isLoading, isFetching, hasNextPage} = useInfiniteQuery({
    queryKey: ['marcas'],
    queryFn: ({pageParam = 1, signal}) => {
      return filterMarcasFetch({filterParamsMarcas, pageParam, signal, token: tknSession})
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
    queryClient.resetQueries({ queryKey: ['marcas'], exact: true });
    return () => {
      queryClient.setQueryData(['marcas'], () => null)
      setFilterParamsMarcas(marcasStoreInit.filterParamsMarcas)
    }
  },[])
  
  useEffect(() => {
    if(!isEnabledQuery){
      setIsEnabledQuery(true)
    }else{
      refetch()
    }
  }, [filterParamsMarcas])

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
export const useMutationMarcasQuery = () => {
  const resetSessionStore = useSessionStore(state => state.resetSessionStore)
  const navigate = useNavigate()
  const tknSession = useSessionStore(state => state.tknSession)
  const nombreModulo = useSessionStore(state => state.moduloActual?.nombre)
  const Authorization = "Bearer " + tknSession
  const filterParamsMarcas = useMarcasStore(state => state.filterParamsMarcas)
  const queryClient = useQueryClient()
  const typeActionRef = useRef<TypeAction | "">("")

  const {data, isPending, isError, mutate, } = useMutation({
    mutationFn: mutationFetch,
    onSuccess: (resp) => {
      if(resp.msgType !== 'success') return
      queryClient.invalidateQueries({queryKey:["marcas"]}) // Recarga la tabla marcas
    }
  })

  const filterMarcasFull = () => {// Sin Paginacion
    typeActionRef.current = "filter_full"
    const params = {
      url: apiURL + "marcas/filter_marcas_full",
      method: "POST",
      headers:{ 
        Authorization,
        'nombre-modulo': nombreModulo,
      },
      body: JSON.stringify(filterParamsMarcas),
    }
    mutate(params)
  }

  const getMarca = (id: number) => {
    const params = {
      url: apiURL + "marcas/get_marca",
      method: "POST",
      headers:{ 
        Authorization,
        'nombre-modulo': nombreModulo,
      },
      body: JSON.stringify({id}),
    }
    mutate(params)
  }

  const createMarca = (marca: Marca) => {
    typeActionRef.current = "mutate_marca"
    const params = {
      url: apiURL + "marcas/create_marca",
      method: "POST",
      headers:{ 
        Authorization,
        'nombre-modulo': nombreModulo,
      },
      body: JSON.stringify(marca),
    }
    mutate(params)
  }

  const updateMarca = (marca: Marca) => {
    typeActionRef.current = "mutate_marca"
    const params = {
      url: apiURL + "marcas/update_marca",
      method: "PUT",
      headers:{ 
        Authorization,
        'nombre-modulo': nombreModulo,
      },
      body: JSON.stringify(marca),
    }
    mutate(params)
  }

  const deleteMarca = (id: number) => {
    typeActionRef.current = "mutate_marca"
    const params = {
      url: apiURL + "marcas/delete_marca",
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
    filterMarcasFull,
    getMarca,
    createMarca,
    updateMarca,
    deleteMarca,
    typeAction: typeActionRef.current,
    reset,
  }
}
