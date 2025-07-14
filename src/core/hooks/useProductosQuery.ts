const apiURL = import.meta.env.VITE_API_URL;
import { useEffect, useRef, useState } from "react"
import { useNavigate } from "react-router-dom";
import { useInfiniteQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import useSessionStore from "../store/useSessionStore"
import { FilterProductosResp, FnFetchOptions, Producto } from "../types"
import { filterParamsInit } from "../utils/constants";
import { fnFetch } from "../services/fnFetch";

type TypeAction = 
"filter_full" 
| "mutate_producto" 

// ****** FILTRAR ******
export const useFilterProductosQuery = () => {
  const [filterParamsProductos, setFilterParamsProductos] = useState(filterParamsInit)
  const token = useSessionStore(state => state.tknSession)
  const curEstab = useSessionStore(state => state.curEstab)
  const queryClient = useQueryClient()

  const {
    data,
    isError,
    isLoading,
    isFetching,
    hasNextPage,
    fetchNextPage,
  } = useInfiniteQuery<FilterProductosResp, Error>({
    queryKey: ['productos'],
    queryFn: ({pageParam = 1, signal}) => {
      const page = pageParam as number
      const options: FnFetchOptions = {
        method: "POST",
        url: `${apiURL}productos/filter_productos?page=${page}`,
        body: JSON.stringify(filterParamsProductos),
        authorization: "Bearer " + token,
        attachedData: JSON.stringify({curEstab}),
        signal,
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
    queryClient.resetQueries({ queryKey: ['productos'], exact: true });
    setFilterParamsProductos(filterParamsInit)
  }
  useEffect(() => {
    return () => {
      resetear()
    }
  },[])
  
  useEffect(() => {
    queryClient.invalidateQueries({queryKey:["productos"]})
  }, [filterParamsProductos])



  return {
    data,
    isError, 
    isLoading, 
    isFetching, 
    hasNextPage, 
    fetchNextPage,
    setFilterParamsProductos
  }
}

// ****** MUTATION ******
export const useMutationProductosQuery = () => {
  const resetSessionStore = useSessionStore(state => state.resetSessionStore)
  const navigate = useNavigate()
  const token = useSessionStore(state => state.tknSession)
  const curModulo = useSessionStore(state => state.moduloActual?.nombre)
  const curEstab = useSessionStore(state => state.curEstab)
  const queryClient = useQueryClient()
  const typeActionRef = useRef<TypeAction | "">("")

  const {data, isPending, isError, mutate, } = useMutation({
    mutationFn: fnFetch,
    onSuccess: (resp) => {
      if(resp.msgType !== 'success') return
      queryClient.invalidateQueries({queryKey:["productos"]})
    }
  })

  const getProducto = (id: number) => {
    const options: FnFetchOptions = {
      method: "POST",
      url: apiURL + "productos/get_producto",
      body: JSON.stringify({id}),
      authorization: "Bearer " + token,
      attachedData: JSON.stringify({curEstab, curModulo})
    }
    mutate(options)
  }

  const getProductoByCode = (codigo: string, establecimiento_id: number) => {
    const options: FnFetchOptions = {
      method: "POST",
      url: apiURL + "productos/get_producto_by_code",
      body: JSON.stringify({codigo, establecimiento_id}),
      authorization: "Bearer " + token,
    }
    mutate(options)
  }

  const createProducto = (producto: Producto) => {
    typeActionRef.current = "mutate_producto"
    const options: FnFetchOptions = {
      method: "POST",
      url: apiURL + "productos/create_producto",
      body: JSON.stringify(producto),
      authorization: "Bearer " + token,
    }
    mutate(options)
  }

  const updateProducto = (producto: Producto) => {
    typeActionRef.current = "mutate_producto"
    const options: FnFetchOptions = {
      method: "PUT",
      url: apiURL + "productos/update_producto",
      body: JSON.stringify(producto),
      authorization: "Bearer " + token,
    }
    mutate(options)
  }

  const updateEstado = (estado: {id:number; estado:number}) => {
    typeActionRef.current = "mutate_producto"
    const options: FnFetchOptions = {
      method: "PUT",
      url: apiURL + "productos/update_estado",
      body: JSON.stringify(estado),
      authorization: "Bearer " + token,
    }
    mutate(options)
  }


  const deleteProducto = (id: number) => {
    typeActionRef.current = "mutate_producto"
    const options: FnFetchOptions = {
      method: "DELETE",
      url: apiURL + "productos/delete_producto",
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
    getProducto,
    getProductoByCode,
    createProducto,
    updateProducto,
    updateEstado,
    deleteProducto,
  }
}


