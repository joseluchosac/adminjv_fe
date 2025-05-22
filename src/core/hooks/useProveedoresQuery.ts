const apiURL = import.meta.env.VITE_API_URL;
import { useInfiniteQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import useSessionStore from "../store/useSessionStore"
import { useEffect, useState } from "react"
import { mutationFetch } from "../services/mutationFecth"
import { useNavigate } from "react-router-dom";
import { filterProveedoresFetch } from "../services/proveedoresFetch";
import useProveedoresStore, { proveedoresStoreInit } from "../store/useProveedoresStore";
import { Proveedor } from "../types";


// ****** FILTRAR CLIENTES ******
export const useFilterProveedoresQuery = () => {
  // const navigate = useNavigate()
  const [isEnabledQuery, setIsEnabledQuery] = useState(false)
  const tknSession = useSessionStore(state => state.tknSession)
  const filterParamsProveedores = useProveedoresStore(state => state.filterParamsProveedores)
  const queryClient = useQueryClient()
  const setFilterParamsProveedores = useProveedoresStore(state => state.setFilterParamsProveedores)


  const {fetchNextPage, data, refetch, isError, isLoading, isFetching, hasNextPage,  } = useInfiniteQuery({
    queryKey: ['proveedores'],
    queryFn: ({pageParam = 1, signal}) => {
      return filterProveedoresFetch({filterParamsProveedores, pageParam, signal, token: tknSession})
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
    queryClient.resetQueries({ queryKey: ['proveedores'], exact: true });
    return () => {
      queryClient.setQueryData(['proveedores'], () => null)
      setFilterParamsProveedores(proveedoresStoreInit.filterParamsProveedores)
    }
  },[])
  
  useEffect(() => {
    if(!isEnabledQuery){
      setIsEnabledQuery(true)
    }else{
      refetch()
    }
  }, [filterParamsProveedores])

  // useEffect(()=>{
  //   if(data?.pages[data?.pages.length-1].msgType === "errorToken"){
  //     navigate("/auth")
  //   }
  // },[data])

  return {
    data,
    isError, 
    isLoading, 
    isFetching, 
    hasNextPage, 
    fetchNextPage, 
  }
}

// ****** MUTATION CLIENTES ******
export const useMutationProveedoresQuery = () => {
  const resetSessionStore = useSessionStore(state => state.resetSessionStore)
  const navigate = useNavigate()
  const tknSession = useSessionStore(state => state.tknSession)
  const nombreModulo = useSessionStore(state => state.moduloActual?.nombre)
  const Authorization = "Bearer " + tknSession
  const filterParamsProveedores = useProveedoresStore(state => state.filterParamsProveedores)

  const queryClient = useQueryClient()

  const {data, isPending, isError, mutate, } = useMutation({
    mutationFn: mutationFetch,
    onSuccess: (resp) => {
      if(resp.msgType !== 'success') return
      queryClient.invalidateQueries({queryKey:["proveedores"]}) // Recarga la tabla proveedores
    }
  })

  const filterProveedoresFull = () => {// Sin Paginacion
    const params = {
      url: apiURL + "proveedores/filter_proveedores_full",
      method: "POST",
      headers:{ 
        Authorization,
        'nombre-modulo': nombreModulo,
      },
      body: JSON.stringify(filterParamsProveedores),
    }
    mutate(params)
  }

  const getProveedor = (id: number) => {
    const params = {
      url: apiURL + "proveedores/get_proveedor",
      method: "POST",
      headers:{ 
        Authorization,
        'nombre-modulo': nombreModulo,
      },
      body: JSON.stringify({id}),
    }
    mutate(params)
  }

  const createProveedor = (proveedor: Proveedor) => {
    const params = {
      url: apiURL + "proveedores/create_proveedor",
      method: "POST",
      headers:{ 
        Authorization,
        'nombre-modulo': nombreModulo,
      },
      body: JSON.stringify(proveedor),
    }
    mutate(params)
  }


  const updateProveedor = (param: Proveedor) => {
    const params = {
      url: apiURL + "proveedores/update_proveedor",
      method: "PUT",
      headers:{ 
        Authorization,
        'nombre-modulo': nombreModulo,
      },
      body: JSON.stringify(param),
    }
    mutate(params)
  }

  const deleteProveedor = (id: number) => {
    const params = {
      url: apiURL + "proveedores/delete_proveedor",
      method: "DELETE",
      headers:{ 
        Authorization,
        'nombre-modulo': nombreModulo,
      },
      body: JSON.stringify({id}),
    }
    mutate(params)
  }

  const consultarNroDocumento = (param: any) => {
    const params = {
      url: apiURL + "proveedores/consultar_nro_documento",
      method: "POST",
      headers:{ 
        Authorization,
        'nombre-modulo': nombreModulo,
      },
      body: JSON.stringify(param),
    }
    mutate(params)
  }

  const reset = (newValues: any) => {
    mutate({newValues}) // Solo actualiza los datos, no hace fetch
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
    filterProveedoresFull,
    getProveedor,
    createProveedor,
    updateProveedor,
    deleteProveedor,
    consultarNroDocumento,
    reset
  }
}


