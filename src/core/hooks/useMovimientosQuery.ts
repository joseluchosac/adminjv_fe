const apiURL = import.meta.env.VITE_API_URL;
import { useEffect, useRef, useState } from "react"
import { useNavigate } from "react-router-dom";
import { useInfiniteQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import useSessionStore from "../store/useSessionStore"
import useMovimientosStore from "../store/useMovimientosStore"
import { filterMovimientosFetch } from "../services/movimientosFetch"
import { Movimiento, Movimientoform } from "../types"
import { mutationFetch } from "../services/mutationFecth"
import { filterParamsInit } from "../utils/constants";

type TypeAction = 
"filter_full" 
| "mutate_movimiento" 

// ****** FILTRAR ******
export const useFilterMovimientosQuery = () => {
  const [isEnabledQuery, setIsEnabledQuery] = useState(false)
  const setFilterParamsMovimientos = useMovimientosStore(state => state.setFilterParamsMovimientos)
  const tknSession = useSessionStore(state => state.tknSession)
  const filterParamsMovimientos = useMovimientosStore(state => state.filterParamsMovimientos)
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const {fetchNextPage, data, refetch, isError, isLoading, isFetching, hasNextPage,  } = useInfiniteQuery({
    queryKey: ['movimientos'],
    queryFn: ({pageParam = 1, signal}) => {
      return filterMovimientosFetch({filterParamsMovimientos, pageParam, signal, token: tknSession})
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
    queryClient.resetQueries({ queryKey: ['movimientos'], exact: true });
    return () => {
      queryClient.setQueryData(['movimientos'], () => null)
      setFilterParamsMovimientos(filterParamsInit)
    }
  },[])
  
  useEffect(() => {
    if(!isEnabledQuery){
      setIsEnabledQuery(true)
    }else{
      refetch()
    }
  }, [filterParamsMovimientos])

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
export const useMutationMovimientosQuery = () => {
  const resetSessionStore = useSessionStore(state => state.resetSessionStore)
  const navigate = useNavigate()
  const tknSession = useSessionStore(state => state.tknSession)
  const Authorization = "Bearer " + tknSession
  const queryClient = useQueryClient()
  const typeActionRef = useRef<TypeAction | "">("")

  const {data, isPending, isError, mutate, } = useMutation({
    mutationFn: mutationFetch,
    onSuccess: (resp) => {
      if(resp.msgType !== 'success') return
      queryClient.invalidateQueries({queryKey:["movimientos"]})
    }
  })


  const createMovimiento = (movimiento: Movimientoform) => {
    typeActionRef.current = "mutate_movimiento"
    const params = {
      url: apiURL + "movimientos/create_movimiento",
      method: "POST",
      headers:{ 
        Authorization,
      },
      body: JSON.stringify(movimiento),
    }
    mutate(params)
  }

  const updateMovimiento = (movimiento: Movimiento) => {
    typeActionRef.current = "mutate_movimiento"
    const params = {
      url: apiURL + "movimientos/update_movimiento",
      method: "PUT",
      headers:{ 
        Authorization,
      },
      body: JSON.stringify(movimiento),
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
    createMovimiento,
    updateMovimiento,
    reset,
  }
}


