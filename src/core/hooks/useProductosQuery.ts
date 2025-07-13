const apiURL = import.meta.env.VITE_API_URL;
import { useEffect, useRef, useState } from "react"
import { useNavigate } from "react-router-dom";
import { useInfiniteQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import useSessionStore from "../store/useSessionStore"
import { FilterProductosResp, Producto } from "../types"
import { mutationFetch } from "../services/mutationFecth"
import { filterFetch } from "../services/filterFetch";
import { filterParamsInit } from "../utils/constants";

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
      return filterFetch({
        filterParams: filterParamsProductos,
        url: `${apiURL}productos/filter_productos?page=${page}`,
        signal,
        curEstab,
        token
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
  const tknSession = useSessionStore(state => state.tknSession)
  const curModulo = useSessionStore(state => state.moduloActual?.nombre)
  const curEstab = useSessionStore(state => state.curEstab)
  const Authorization = "Bearer " + tknSession
  const queryClient = useQueryClient()
  const typeActionRef = useRef<TypeAction | "">("")

  const {data, isPending, isError, mutate, } = useMutation({
    mutationFn: mutationFetch,
    onSuccess: (resp) => {
      if(resp.msgType !== 'success') return
      queryClient.invalidateQueries({queryKey:["productos"]})
    }
  })

  // const filterProductoFull = () => {// Sin Paginacion
  //   typeActionRef.current = "filter_full"
  //   const params = {
  //     url: apiURL + "productos/filter_productos_full",
  //     method: "POST",
  //     headers:{ 
  //       Authorization,
  //       "attached-data": JSON.stringify({curEstab, curModulo}),
  //     },
  //     body: JSON.stringify(filterParamsProductos),
  //   }
  //   mutate(params)
  // }

  const getProducto = (id: number) => {
    const params = {
      url: apiURL + "productos/get_producto",
      method: "POST",
      headers:{ 
        Authorization,
        "attached-data": JSON.stringify({curEstab, curModulo}),
      },
      body: JSON.stringify({id}),
    }
    mutate(params)
  }

  const getProductoByCode = (codigo: string, establecimiento_id: number) => {
    const params = {
      url: apiURL + "productos/get_producto_by_code",
      method: "POST",
      headers:{ 
        Authorization,
      },
      body: JSON.stringify({codigo, establecimiento_id}),
    }
    mutate(params)
  }

  const createProducto = (producto: Producto) => {
    typeActionRef.current = "mutate_producto"
    const params = {
      url: apiURL + "productos/create_producto",
      method: "POST",
      headers:{ 
        Authorization,
      },
      body: JSON.stringify(producto),
    }
    mutate(params)
  }

  const updateProducto = (producto: Producto) => {
    typeActionRef.current = "mutate_producto"
    const params = {
      url: apiURL + "productos/update_producto",
      method: "PUT",
      headers:{ 
        Authorization,
      },
      body: JSON.stringify(producto),
    }
    mutate(params)
  }

  const updateEstado = (estado: {id:number; estado:number}) => {
    typeActionRef.current = "mutate_producto"
    const params = {
      url: apiURL + "productos/update_estado",
      method: "PUT",
      headers:{ 
        Authorization,
      },
      body: JSON.stringify(estado),
    }
    mutate(params)
  }


  const deleteProducto = (id: number) => {
    typeActionRef.current = "mutate_producto"
    const params = {
      url: apiURL + "productos/delete_producto",
      method: "DELETE",
      headers:{ 
        Authorization,
      },
      body: JSON.stringify({id}),
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
    getProducto,
    getProductoByCode,
    createProducto,
    updateProducto,
    updateEstado,
    deleteProducto,
    reset,
  }
}


