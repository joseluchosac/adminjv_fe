const apiURL = import.meta.env.VITE_API_URL;
import { useEffect, useRef } from "react"
import { useNavigate } from "react-router-dom";
import { InfiniteData, useInfiniteQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import useSessionStore from "../../app/store/useSessionStore"
import { ApiResp, FetchOptions, FilterQueryResp, Movimiento, Movimientoform, MovimientoItem } from "../../app/types"
import { fnFetch } from "../fnFetch";
import useMovimientosStore from "../../app/store/useMovimientosStore";
import { useDebounce } from "react-use";
import { toast } from "react-toastify";

type TypeAction = "CREATE_MOVIMIENTO"
  | "UPDATE_MOVIMIENTO"
  | "DELETE_MOVIMIENTO"

// ****** FILTRAR ******
export interface MovimientosFilQryRes extends FilterQueryResp {
  filas: MovimientoItem[];
}
export const useMovimientosFilterQuery = () => {
  const {
    movimientoFilterForm,
    movimientoFilterParam,
    setMovimientoFilterParam,
    setMovimientoFilterParamBetween,
    setMovimientoFilterInfo
  } = useMovimientosStore()
  const token = useSessionStore(state => state.tknSession)
  // const isFirstRender = useRef(true);
  const queryClient = useQueryClient()


  const {
    data,
    isError,
    isLoading,
    isFetching,
    hasNextPage,
    fetchNextPage,
  } = useInfiniteQuery<MovimientosFilQryRes, Error>({
    queryKey: ['movimientos'],
    queryFn: ({pageParam = 1, signal}) => {
      const page = pageParam as number
      const options: FetchOptions = {
        method: "POST",
        url: `${apiURL}movimientos/filter_movimientos?page=${page}`,
        body: JSON.stringify(movimientoFilterParam),
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


  useDebounce(() => {
    if (
        movimientoFilterForm.search.toLowerCase().trim() ==
        movimientoFilterParam.search.toLowerCase().trim()
    ) return;
    setMovimientoFilterParam()
  }, 500, [movimientoFilterForm.search]);

  useEffect(() => {
    // if (isFirstRender.current) {
    //   isFirstRender.current = false;
    //   return; // Evita ejecutar en el primer render
    // }
    return () => {
      resetear()
    }
  }, [])

  useEffect(() => {
    setMovimientoFilterParam()
  }, [movimientoFilterForm.order, movimientoFilterForm.equal])

  useEffect(() => {
    setMovimientoFilterParamBetween()
  }, [movimientoFilterForm.between])

  useEffect(() => {
    queryClient.invalidateQueries({queryKey:["movimientos"]})
  }, [movimientoFilterParam])

  useEffect(()=>{
    if(!data) return
    if(data?.pages[0].error || isError){
      toast.error("Error al obtener registros")
      return
    }
    if(!isFetching){
      setMovimientoFilterInfo()
    }
  },[data, isError, isFetching])

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
export type MutationMovimientoRes = ApiResp & {
  movimiento?: MovimientoItem
};
export const useMutationMovimientosQuery = <T>() => {
  const resetSessionStore = useSessionStore(state => state.resetSessionStore)
  const navigate = useNavigate()
  const token = useSessionStore(state => state.tknSession)
  const queryClient = useQueryClient()
  const typeActionRef = useRef<TypeAction | "">("")

  const {data, isPending, isError, mutate, } = useMutation<T, Error, FetchOptions, unknown>({
    mutationFn: fnFetch,
    onSuccess: (resp) => {
      const r = resp as MutationMovimientoRes
      if(r.msgType !== 'success') return
      if(typeActionRef.current === "CREATE_MOVIMIENTO") {
        const createdMovimiento = r.movimiento as MovimientoItem
        queryClient.setQueryData(["movimientos"], (oldData: InfiniteData<MovimientosFilQryRes, unknown> | undefined) => {
          const pages = structuredClone(oldData?.pages)
          if((pages?.length || 0) < 4){ // hacer refetch si se cumple esta condicion
            queryClient.invalidateQueries({queryKey:["movimientos"]})
            return oldData
          }
          if(pages && pages.length > 0){
            pages[0].filas.unshift(createdMovimiento as MovimientoItem) // Agrega el nuevo registro al inicio de la primera página
            pages[0].num_regs = pages[0].num_regs + 1
          }
          return {...oldData, pages, }
        })
      }else if(typeActionRef.current === "UPDATE_MOVIMIENTO") {
        const updatedMovimiento = r.movimiento as MovimientoItem
        queryClient.setQueryData(["movimientos"], (oldData: InfiniteData<MovimientosFilQryRes, unknown> | undefined) => {
          const pages = structuredClone(oldData?.pages)
          if((pages?.length || 0) < 4){
            queryClient.invalidateQueries({queryKey:["movimientos"]})
            return oldData
          }
          for(let idxPage in pages){
            const idxFila = pages[parseInt(idxPage)].filas.findIndex((el: MovimientoItem)=>el.id === updatedMovimiento.id)
            if(idxFila !== -1){
              pages[parseInt(idxPage)].filas[idxFila] = updatedMovimiento // Actualiza el registro en la lista
              break
            }
          }
          return {...oldData, pages}
        })
      }else if(typeActionRef.current === "DELETE_MOVIMIENTO") {
        const deletedMovimientoId = r.content as MovimientoItem["id"]
        queryClient.setQueryData(["movimientos"], (oldData: InfiniteData<MovimientosFilQryRes, unknown> | undefined) => {
          let pages = structuredClone(oldData?.pages)
          if((pages?.length || 0) < 4){
            queryClient.invalidateQueries({queryKey:["movimientos"]})
            return oldData
          }
          for(let idxPage in pages){
            const idxFila = pages[parseInt(idxPage)].filas.findIndex((el: MovimientoItem)=>el.id === deletedMovimientoId)
            if(idxFila !== -1){
              let filasFiltradas = pages[parseInt(idxPage)].filas.filter(el => el.id !== deletedMovimientoId) // Elimina el usuario de la fila
              pages[parseInt(idxPage)].filas = filasFiltradas
              pages[0].num_regs = pages[0].num_regs - 1
              break
            }
          }
          return {...oldData, pages}
        })
      } 



      queryClient.invalidateQueries({queryKey:["movimientos"]}) // Recarga la tabla
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
    if((data as ApiResp)?.errorType === "errorToken"){
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


