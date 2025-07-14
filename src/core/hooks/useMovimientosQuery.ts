const apiURL = import.meta.env.VITE_API_URL;
import { useEffect, useRef } from "react"
import { useNavigate } from "react-router-dom";
import { useInfiniteQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import useSessionStore from "../store/useSessionStore"
import useMovimientosStore from "../store/useMovimientosStore"
import { FilterMovimientosResp, FnFetchOptions, Movimiento, Movimientoform } from "../types"
import { fnFetch } from "../services/fnFetch";

type TypeAction = 
"filter_full" 
| "mutate_movimiento" 

// ****** FILTRAR ******
export const useFilterMovimientosQuery = () => {
  // const setFilterParamsMovimientos = useMovimientosStore(state => state.setFilterParamsMovimientos)
  const token = useSessionStore(state => state.tknSession)
  const filterParamsMovimientos = useMovimientosStore(state => state.filterParamsMovimientos)
  const queryClient = useQueryClient()

  const {
    fetchNextPage,
    data,
    isError,
    isLoading,
    isFetching,
    hasNextPage
  } = useInfiniteQuery<FilterMovimientosResp, Error>({
    queryKey: ['movimientos'],
    queryFn: ({pageParam = 1, signal}) => {
      const page = pageParam as number
      const options: FnFetchOptions = {
        method: "POST",
        url: `${apiURL}movimientos/filter_movimientos?page=${page}`,
        body: JSON.stringify(filterParamsMovimientos),
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
    queryClient.resetQueries({ queryKey: ['movimientos'], exact: true });
  }

  useEffect(() => {
    return () => {
      resetear()
    }
  },[])
  
  useEffect(() => {
    queryClient.invalidateQueries({queryKey:["movimientos"]})
  }, [filterParamsMovimientos])

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
  const token = useSessionStore(state => state.tknSession)
  const queryClient = useQueryClient()
  const typeActionRef = useRef<TypeAction | "">("")

  const {data, isPending, isError, mutate, } = useMutation({
    mutationFn: fnFetch,
    onSuccess: (resp) => {
      if(resp.msgType !== 'success') return
      queryClient.invalidateQueries({queryKey:["movimientos"]})
    }
  })


  const createMovimiento = (movimiento: Movimientoform) => {
    typeActionRef.current = "mutate_movimiento"
    const options: FnFetchOptions = {
      method: "POST",
      url: apiURL + "movimientos/create_movimiento",
      body: JSON.stringify(movimiento),
      authorization: "Bearer " + token,
    }
    mutate(options)
  }

  const updateMovimiento = (movimiento: Movimiento) => {
    typeActionRef.current = "mutate_movimiento"
    const options: FnFetchOptions = {
      method: "PUT",
      url: apiURL + "movimientos/update_movimiento",
      body: JSON.stringify(movimiento),
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
    createMovimiento,
    updateMovimiento,
  }
}


