const apiURL = import.meta.env.VITE_API_URL;
import { useInfiniteQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import useSessionStore from "../../app/store/useSessionStore"
import { useEffect, useRef, useState } from "react"
import { useNavigate } from "react-router-dom";
import { FetchOptions, FilterQueryResp, Proveedor, ProveedorItem, QueryResp } from "../../app/types";
import { filterParamsInit } from "../../app/utils/constants";
import { fnFetch } from "../fnFetch";

type TypeAction = "mutate_proveedor" | "consultar_nro_doc"

// ****** FILTRAR ******
export interface ProveedoresFilQryRes extends FilterQueryResp {
  filas: ProveedorItem[];
}
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
  } = useInfiniteQuery<ProveedoresFilQryRes, Error>({
    queryKey: ['proveedores'],
    queryFn: ({pageParam = 1, signal}) => {
      const page = pageParam as number
      const options: FetchOptions = {
        method: "POST",
        url: `${apiURL}proveedores/filter_proveedores?page=${page}`,
        body: JSON.stringify(filterParamsProveedores),
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
  const token = useSessionStore(state => state.tknSession)
  const queryClient = useQueryClient()
  const typeActionRef = useRef<TypeAction | "">("")

  const {data, isPending, isError, mutate, reset } = useMutation<T, Error, FetchOptions, unknown>({
    mutationFn: fnFetch,
    onSuccess: (resp) => {
      const r = resp as QueryResp
      if(r?.msgType !== 'success') return
      queryClient.invalidateQueries({queryKey:["proveedores"]}) // Recarga la tabla proveedores
    }
  })

  const getProveedor = (id: number) => {
    const options: FetchOptions = {
      method: "POST",
      url: apiURL + "proveedores/get_proveedor",
      body: JSON.stringify({id}),
      authorization: "Bearer " + token,
    }
    mutate(options)
  }

  const createProveedor = (proveedor: Proveedor) => {
    typeActionRef.current = "mutate_proveedor"
    const options: FetchOptions = {
      method: "POST",
      url: apiURL + "proveedores/create_proveedor",
      body: JSON.stringify(proveedor),
      authorization: "Bearer " + token,
    }
    mutate(options)
  }

  const updateProveedor = (proveedor: Proveedor) => {
    typeActionRef.current = "mutate_proveedor"
    const options: FetchOptions = {
      method: "PUT",
      url: apiURL + "proveedores/update_proveedor",
      body: JSON.stringify(proveedor),
      authorization: "Bearer " + token,
    }
    mutate(options)
  }

  const setStateProveedor = (estado: number) => {
    typeActionRef.current = "mutate_proveedor"
    const options: FetchOptions = {
      method: "PUT",
      url: apiURL + "proveedores/set_state_proveedor",
      body: JSON.stringify({estado}),
      authorization: "Bearer " + token,
    }
    mutate(options)
  }

  const deleteProveedor = (id: number) => {
    typeActionRef.current = "mutate_proveedor"
    const options: FetchOptions = {
      method: "DELETE",
      url: apiURL + "proveedores/delete_proveedor",
      body: JSON.stringify({id}),
      authorization: "Bearer " + token,
    }
    mutate(options)
  }

  const consultarNroDocumento = (param: any) => {
    typeActionRef.current = "consultar_nro_doc"
    const options: FetchOptions = {
      method: "POST",
      url: apiURL + "proveedores/consultar_nro_documento",
      body: JSON.stringify(param),
      authorization: "Bearer " + token,
    }
    mutate(options)
  }

  useEffect(()=>{
    const d = data as QueryResp
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
    reset
  }
}


