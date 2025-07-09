const apiURL = import.meta.env.VITE_API_URL;
import { useEffect, useRef } from "react"
import { useNavigate } from "react-router-dom";
import { useInfiniteQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import useSessionStore from "../store/useSessionStore"
import useMovimientosStore from "../store/useMovimientosStore"
import { FilterMovimientosResp, Movimiento, Movimientoform } from "../types"
import { mutationFetch } from "../services/mutationFecth"
import { filterFetch } from "../services/filterFetch";

type TypeAction = 
"filter_full" 
| "mutate_movimiento" 

// ****** FILTRAR ******
export const useFilterMovimientosQuery = () => {
  // const setFilterParamsMovimientos = useMovimientosStore(state => state.setFilterParamsMovimientos)
  const tknSession = useSessionStore(state => state.tknSession)
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
      return filterFetch({
        filterParams: filterParamsMovimientos,
        url: `${apiURL}movimientos/filter_movimientos?page=${page}`,
        signal,
        token: tknSession
      })
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
    reset,
  }
}


