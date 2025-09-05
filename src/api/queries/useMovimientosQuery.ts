const apiURL = import.meta.env.VITE_API_URL;
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom";
import { useInfiniteQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import useSessionStore from "../../app/store/useSessionStore"
import { FetchOptions, FilterQueryResp, Movimiento, Movimientoform, MovimientoItem } from "../../app/types"
import { filterParamsInit } from "../../app/utils/constants";
import { fnFetch } from "../fnFetch";


// ****** FILTRAR ******
export interface MovimientosFilQryRes extends FilterQueryResp {
  filas: MovimientoItem[];
}
export const useMovimientosFilterQuery = () => {
  const [filterParamsMovimientos, setFilterParamsMovimientos] = useState(filterParamsInit)
  const token = useSessionStore(state => state.tknSession)
  const queryClient = useQueryClient()

  const {
    fetchNextPage,
    data,
    isError,
    isLoading,
    isFetching,
    hasNextPage
  } = useInfiniteQuery<MovimientosFilQryRes, Error>({
    queryKey: ['movimientos'],
    queryFn: ({pageParam = 1, signal}) => {
      const page = pageParam as number
      const options: FetchOptions = {
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
    setFilterParamsMovimientos(filterParamsInit)

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
    setFilterParamsMovimientos
  }
}

// ****** MUTATION ******
export const useMutationMovimientosQuery = () => {
  const resetSessionStore = useSessionStore(state => state.resetSessionStore)
  const navigate = useNavigate()
  const token = useSessionStore(state => state.tknSession)
  const queryClient = useQueryClient()

  const {data, isPending, isError, mutate, } = useMutation({
    mutationFn: fnFetch,
    onSuccess: (resp) => {
      if(resp.msgType !== 'success') return
      queryClient.invalidateQueries({queryKey:["movimientos"]})
    }
  })


  const createMovimiento = (movimiento: Movimientoform) => {
    const options: FetchOptions = {
      method: "POST",
      url: apiURL + "movimientos/create_movimiento",
      body: JSON.stringify(movimiento),
      authorization: "Bearer " + token,
    }
    mutate(options)
  }

  const updateMovimiento = (movimiento: Movimiento) => {
    const options: FetchOptions = {
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


