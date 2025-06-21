const apiURL = import.meta.env.VITE_API_URL;
import { useEffect, useRef, useState } from "react"
import { useNavigate } from "react-router-dom";
import { useInfiniteQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import useSessionStore from "../store/useSessionStore"
import useSucursalesStore from "../store/useSucursalesStore";
import { mutationFetch } from "../services/mutationFecth"
import { filterSucursalesFetch } from "../services/sucursalesFetch";
import { filterParamsInit } from "../utils/constants";
import { Sucursal } from "../types/catalogosTypes";

type TypeAction = "filter_full" | "mutate_sucursal"

// ****** FILTRAR ******
export const useFilterSucursalesQuery = () => {
  const [isEnabledQuery, setIsEnabledQuery] = useState(false)
  const tknSession = useSessionStore(state => state.tknSession)
  const filterParamsSucursales = useSucursalesStore(state => state.filterParamsSucursales)
  const setFilterParamsSucursales = useSucursalesStore(state => state.setFilterParamsSucursales)
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  
  const {fetchNextPage, data, refetch, isError, isLoading, isFetching, hasNextPage} = useInfiniteQuery({
    queryKey: ['sucursales'],
    queryFn: ({pageParam = 1, signal}) => {
      return filterSucursalesFetch({filterParamsSucursales, pageParam, signal, token: tknSession})
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
    queryClient.resetQueries({ queryKey: ['sucursales'], exact: true });
    return () => {
      queryClient.setQueryData(['sucursales'], () => null)
      setFilterParamsSucursales(filterParamsInit)
    }
  },[])
  
  useEffect(() => {
    if(!isEnabledQuery){
      setIsEnabledQuery(true)
    }else{
      refetch()
    }
  }, [filterParamsSucursales])

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
export const useMutationSucursalesQuery = () => {
  const resetSessionStore = useSessionStore(state => state.resetSessionStore)
  const navigate = useNavigate()
  const tknSession = useSessionStore(state => state.tknSession)
  const nombreModulo = useSessionStore(state => state.moduloActual?.nombre)
  const Authorization = "Bearer " + tknSession
  const filterParamsSucursales = useSucursalesStore(state => state.filterParamsSucursales)
  const queryClient = useQueryClient()
  const typeActionRef = useRef<TypeAction | "">("")

  const {data, isPending, isError, mutate, } = useMutation({
    mutationFn: mutationFetch,
    onSuccess: (resp) => {
      if(resp.msgType !== 'success') return
      queryClient.invalidateQueries({queryKey:["sucursales"]}) // Recarga la tabla sucursales
    }
  })

  const filterSucursalesFull = () => {// Sin Paginacion
    typeActionRef.current = "filter_full"
    const params = {
      url: apiURL + "establecimientos/filter_sucursales_full",
      method: "POST",
      headers:{ 
        Authorization,
        'nombre-modulo': nombreModulo,
      },
      body: JSON.stringify(filterParamsSucursales),
    }
    mutate(params)
  }

  const getSucursal = (id: number) => {
    const params = {
      url: apiURL + "establecimientos/get_sucursal",
      method: "POST",
      headers:{ 
        Authorization,
        'nombre-modulo': nombreModulo,
      },
      body: JSON.stringify({id}),
    }
    mutate(params)
  }

  const createSucursal = (sucursal: Sucursal) => {
    typeActionRef.current = "mutate_sucursal"
    const params = {
      url: apiURL + "establecimientos/create_sucursal",
      method: "POST",
      headers:{ 
        Authorization,
        'nombre-modulo': nombreModulo,
      },
      body: JSON.stringify(sucursal),
    }
    mutate(params)
  }

  const updateSucursal = (sucursal: Sucursal) => {
    typeActionRef.current = "mutate_sucursal"
    const params = {
      url: apiURL + "establecimientos/update_sucursal",
      method: "PUT",
      headers:{ 
        Authorization,
        'nombre-modulo': nombreModulo,
      },
      body: JSON.stringify(sucursal),
    }
    mutate(params)
  }

  const deleteSucursal = (id: number) => {
    typeActionRef.current = "mutate_sucursal"
    const params = {
      url: apiURL + "establecimientos/delete_sucursal",
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
    getSucursal,
    createSucursal,
    updateSucursal,
    deleteSucursal,
    typeAction: typeActionRef.current,
    reset,
  }
}
