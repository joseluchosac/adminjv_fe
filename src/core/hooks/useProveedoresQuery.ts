const apiURL = import.meta.env.VITE_API_URL;
import { useInfiniteQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import useSessionStore from "../store/useSessionStore"
import { useEffect, useRef, useState } from "react"
import { mutationFetch } from "../services/mutationFecth"
import { useNavigate } from "react-router-dom";
import { FilterProveedoresResp, MutationFetch, Proveedor, ResponseQuery } from "../types";
import { filterFetch } from "../services/filterFetch";
import { filterParamsInit } from "../utils/constants";

type TypeAction = "mutate_proveedor" | "consultar_nro_doc"

// ****** FILTRAR ******
export const useFilterProveedoresQuery = () => {
  const [filterParamsProveedores, setFilterParamsProveedores] = useState(filterParamsInit)
  const token = useSessionStore(state => state.tknSession)
  const queryClient = useQueryClient()

  const {
    data,
    isError,
    isLoading,
    isFetching,
    hasNextPage,
    fetchNextPage,
  } = useInfiniteQuery<FilterProveedoresResp, Error>({
    queryKey: ['proveedores'],
    queryFn: ({pageParam = 1, signal}) => {
      const page = pageParam as number
      return filterFetch({
        filterParams: filterParamsProveedores,
        url: `${apiURL}proveedores/filter_proveedores?page=${page}`,
        signal,
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
    queryClient.resetQueries({ queryKey: ['proveedores'], exact: true });
    setFilterParamsProveedores(filterParamsInit)
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
    setFilterParamsProveedores,
  }
}

// ****** MUTATION ******
export const useMutationProveedoresQuery = <T>() => {
  const resetSessionStore = useSessionStore(state => state.resetSessionStore)
  const navigate = useNavigate()
  const tknSession = useSessionStore(state => state.tknSession)
  const Authorization = "Bearer " + tknSession
  const queryClient = useQueryClient()
  const typeActionRef = useRef<TypeAction | "">("")

  const {data, isPending, isError, mutate } = useMutation<T, Error, MutationFetch, unknown>({
    mutationFn: mutationFetch,
    onSuccess: (resp) => {
      const r = resp as ResponseQuery
      if(r?.msgType !== 'success') return
      queryClient.invalidateQueries({queryKey:["proveedores"]}) // Recarga la tabla proveedores
    }
  })

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
    typeActionRef.current = "mutate_proveedor"
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

  const updateProveedor = (proveedor: Proveedor) => {
    typeActionRef.current = "mutate_proveedor"
    const params = {
      url: apiURL + "proveedores/update_proveedor",
      method: "PUT",
      headers:{ 
        Authorization,
      },
      body: JSON.stringify(proveedor),
    }
    mutate(params)
  }

  const setStateProveedor = (estado: number) => {
    typeActionRef.current = "mutate_proveedor"
    const params = {
      url: apiURL + "proveedores/set_state_proveedor",
      method: "PUT",
      headers:{ 
        Authorization,
      },
      body: JSON.stringify({estado}),
    }
    mutate(params)
  }

  const deleteProveedor = (id: number) => {
    typeActionRef.current = "mutate_proveedor"
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
    typeActionRef.current = "consultar_nro_doc"
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
    getProveedor,
    createProveedor,
    updateProveedor,
    setStateProveedor,
    deleteProveedor,
    consultarNroDocumento,
    typeAction: typeActionRef.current,
    reset,
  }
}


