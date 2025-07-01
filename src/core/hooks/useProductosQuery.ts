const apiURL = import.meta.env.VITE_API_URL;
import { useEffect, useRef, useState } from "react"
import { useNavigate } from "react-router-dom";
import { useInfiniteQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import useSessionStore from "../store/useSessionStore"
import useProductosStore from "../store/useProductosStore"
import { filterProductosFetch } from "../services/productosFetch"
import { Producto } from "../types"
import { mutationFetch } from "../services/mutationFecth"
import { filterParamsInit } from "../utils/constants";

type TypeAction = 
"filter_full" 
| "mutate_producto" 

// ****** FILTRAR ******
export const useFilterProductosQuery = () => {
  const [isEnabledQuery, setIsEnabledQuery] = useState(false)
  const setFilterParamsProductos = useProductosStore(state => state.setFilterParamsProductos)
  const token = useSessionStore(state => state.tknSession)
  const thisTerm = useSessionStore(state => state.thisTerm)
  const filterParamsProductos = useProductosStore(state => state.filterParamsProductos)
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const {fetchNextPage, data, refetch, isError, isLoading, isFetching, hasNextPage,  } = useInfiniteQuery({
    queryKey: ['productos'],
    queryFn: ({pageParam = 1, signal}) => {
      return filterProductosFetch({filterParamsProductos, pageParam, signal, token, thisTerm})
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
    queryClient.resetQueries({ queryKey: ['productos'], exact: true });
    return () => {
      queryClient.setQueryData(['productos'], () => null)
      setFilterParamsProductos(filterParamsInit)
    }
  },[])
  
  useEffect(() => {
    if(!isEnabledQuery){
      setIsEnabledQuery(true)
    }else{
      refetch()
    }
  }, [filterParamsProductos])

  useEffect(()=>{
    if(data?.pages[data?.pages.length-1].msgType === "errorToken"){
      // resetSessionStore()
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
export const useMutationProductosQuery = () => {
  const resetSessionStore = useSessionStore(state => state.resetSessionStore)
  const navigate = useNavigate()
  const tknSession = useSessionStore(state => state.tknSession)
  const nombreModulo = useSessionStore(state => state.moduloActual?.nombre)
  const Authorization = "Bearer " + tknSession
  const filterParamsProductos = useProductosStore(state => state.filterParamsProductos)
  const queryClient = useQueryClient()
  const typeActionRef = useRef<TypeAction | "">("")

  const {data, isPending, isError, mutate, } = useMutation({
    mutationFn: mutationFetch,
    onSuccess: (resp) => {
      if(resp.msgType !== 'success') return
      queryClient.invalidateQueries({queryKey:["productos"]})
    }
  })

  const filterProductoFull = () => {// Sin Paginacion
    typeActionRef.current = "filter_full"
    const params = {
      url: apiURL + "productos/filter_productos_full",
      method: "POST",
      headers:{ 
        Authorization,
        'nombre-modulo': nombreModulo,
      },
      body: JSON.stringify(filterParamsProductos),
    }
    mutate(params)
  }

  const getProducto = (id: number) => {
    const params = {
      url: apiURL + "productos/get_producto",
      method: "POST",
      headers:{ 
        Authorization,
        'nombre-modulo': nombreModulo,
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
        'nombre-modulo': nombreModulo,
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
        'nombre-modulo': nombreModulo,
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
        'nombre-modulo': nombreModulo,
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
        'nombre-modulo': nombreModulo,
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
    filterProductoFull,
    getProducto,
    getProductoByCode,
    createProducto,
    updateProducto,
    updateEstado,
    deleteProducto,
    reset,
  }
}


