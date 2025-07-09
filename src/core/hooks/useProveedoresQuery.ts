const apiURL = import.meta.env.VITE_API_URL;
import { useInfiniteQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import useSessionStore from "../store/useSessionStore"
import { useEffect } from "react"
import { mutationFetch } from "../services/mutationFecth"
import { useNavigate } from "react-router-dom";
import useProveedoresStore from "../store/useProveedoresStore";
import { FilterProveedoresResp, MutationFetch, Proveedor, ResponseQuery } from "../types";
import { filterFetch } from "../services/filterFetch";

// ****** FILTRAR CLIENTES ******
export const useFilterProveedoresQuery = () => {
  const filterParamsProveedores = useProveedoresStore(state => state.filterParamsProveedores)
  // const setFilterParamsProveedores = useProveedoresStore(state => state.setFilterParamsProveedores)
  const tknSession = useSessionStore(state => state.tknSession)
  const queryClient = useQueryClient()

  const {
    data,
    fetchNextPage,
    isError,
    isLoading,
    isFetching,
    hasNextPage
  } = useInfiniteQuery<FilterProveedoresResp, Error>({
    queryKey: ['proveedores'],
    queryFn: ({pageParam = 1, signal}) => {
      const page = pageParam as number
      return filterFetch({
        filterParams: filterParamsProveedores,
        url: `${apiURL}proveedores/filter_proveedores?page=${page}`,
        signal,
        token: tknSession
      })
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      return lastPage.next != 0 ? lastPage.next : undefined
    },
    // getPreviousPageParam: (lastPage) => lastPage.previous ?? undefined,
    staleTime: 1000 * 60 * 5 
  })

  const resetear = ()=>{
    queryClient.resetQueries({ queryKey: ['proveedores'], exact: true });
  }

  useEffect(() => {
    return () => {
      resetear()
    }
  },[])
  
  useEffect(() => {
    queryClient.invalidateQueries({queryKey:["proveedores"]})
  }, [filterParamsProveedores])

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
export const useMutationProveedoresQuery = <T>() => {
  const resetSessionStore = useSessionStore(state => state.resetSessionStore)
  const navigate = useNavigate()
  const tknSession = useSessionStore(state => state.tknSession)
  const Authorization = "Bearer " + tknSession
  const filterParamsProveedores = useProveedoresStore(state => state.filterParamsProveedores)

  const queryClient = useQueryClient()

  const {data, isPending, isError, mutate, } = useMutation<T, Error, MutationFetch, unknown>({
    mutationFn: mutationFetch,
    onSuccess: (resp) => {
      const r = resp as ResponseQuery
      if(r?.msgType !== 'success') return
      queryClient.invalidateQueries({queryKey:["proveedores"]}) // Recarga la tabla proveedores
    }
  })

  const filterProveedoresFull = () => {// Sin Paginacion
    const params = {
      url: apiURL + "proveedores/filter_proveedores_full",
      method: "POST",
      headers:{ 
        Authorization,
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
      },
      body: JSON.stringify(param),
    }
    mutate(params)
  }

  const reset = (newValues: any) => {
    mutate({newValues}) // Solo actualiza los datos, no hace fetch
  }

  useEffect(()=>{
    const d = data as ResponseQuery
    if(d?.errorType === "errorToken"){
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


