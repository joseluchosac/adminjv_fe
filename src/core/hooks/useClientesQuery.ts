const apiURL = import.meta.env.VITE_API_URL;
import { useInfiniteQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import useSessionStore from "../store/useSessionStore"
import { useEffect, useRef, useState } from "react"
import { useNavigate } from "react-router-dom";
import { Cliente, ClienteItem, FetchOptions, FilterQueryResp, QueryResp } from "../types";
import { filterParamsInit } from "../utils/constants";
import { fnFetch } from "../services/fnFetch";

type TypeAction = "mutate_cliente" | "consultar_nro_doc"

// ****** FILTRAR ******
export interface ClientesFilQryRes extends FilterQueryResp {
  filas: ClienteItem[];
}
export const useFilterClientesQuery = () => {
  const [filterParamsClientes, setFilterParamsClientes] = useState(filterParamsInit)
  const token = useSessionStore(state => state.tknSession)
  const queryClient = useQueryClient()

  const {
    data,
    isError,
    isLoading,
    isFetching,
    hasNextPage,
    fetchNextPage,
  } = useInfiniteQuery<ClientesFilQryRes, Error>({
    queryKey: ['clientes'],
    queryFn: ({pageParam = 1, signal}) => {
      const page = pageParam as number
      const options: FetchOptions = {
        method: "POST",
        url: `${apiURL}clientes/filter_clientes?page=${page}`,
        body: JSON.stringify(filterParamsClientes),
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
    queryClient.resetQueries({ queryKey: ['clientes'], exact: true });
    setFilterParamsClientes(filterParamsInit)
  }

  useEffect(() => {
    return () => {
      resetear()
    }
  },[])
  
  useEffect(() => {
    queryClient.invalidateQueries({queryKey:["clientes"]})
  }, [filterParamsClientes])

  return {
    data,
    isError, 
    isLoading, 
    isFetching, 
    hasNextPage, 
    fetchNextPage,
    setFilterParamsClientes,
  }
}

// ****** MUTATION ******
export const useMutationClientesQuery = <T>() => {
  const resetSessionStore = useSessionStore(state => state.resetSessionStore)
  const navigate = useNavigate()
  const token = useSessionStore(state => state.tknSession)
  const queryClient = useQueryClient()
  const typeActionRef = useRef<TypeAction | "">("")

// ****** MUTATION ******
  const {data, isPending, isError, mutate, reset} = useMutation<T, Error, FetchOptions, unknown>({
    mutationKey:["clientes_mut"],
    mutationFn: fnFetch,
    onSuccess: (resp) => {
      const r = resp as QueryResp
      if(r?.msgType !== 'success') return
      queryClient.invalidateQueries({queryKey:["clientes"]}) // Recarga la tabla clientes
    }
  })

  const getCliente = (id: number) => {
    const options: FetchOptions = {
      method: "POST",
      url: apiURL + "clientes/get_cliente",
      body: JSON.stringify({id}),
      authorization: "Bearer " + token,
    }
    mutate(options)
  }

  const createCliente = (cliente: Cliente) => {
    typeActionRef.current = "mutate_cliente"
    const options: FetchOptions = {
      method: "POST",
      url: apiURL + "clientes/create_cliente",
      body: JSON.stringify(cliente),
      authorization: "Bearer " + token,
    }
    mutate(options)
  }

  const updateCliente = (cliente: Cliente) => {
    typeActionRef.current = "mutate_cliente"
    const options: FetchOptions = {
      method: "POST",
      url: apiURL + "clientes/update_cliente",
      body: JSON.stringify(cliente),
      authorization: "Bearer " + token,
    }
    mutate(options)
  }

  const setStateCliente = (estado: number) => {
    typeActionRef.current = "mutate_cliente"
    const options: FetchOptions = {
      method: "POST",
      url: apiURL + "clientes/set_state_cliente",
      body: JSON.stringify({estado}),
      authorization: "Bearer " + token,
    }
    mutate(options)
  }

  const deleteCliente = (id: number) => {
    typeActionRef.current = "mutate_cliente"
    const options: FetchOptions = {
      method: "DELETE",
      url: apiURL + "clientes/delete_cliente",
      body: JSON.stringify({id}),
      authorization: "Bearer " + token,
    }
    mutate(options)
  }

  const consultarNroDocumento = (param: any) => {
    typeActionRef.current = "consultar_nro_doc"
    const options: FetchOptions = {
      method: "POST",
      url: apiURL + "clientes/consultar_nro_documento",
      body: JSON.stringify(param),
      authorization: "Bearer " + token,
    }
    mutate(options)
  }

  useEffect(()=>{
    const r = data as QueryResp
    if(r?.errorType === "errorToken"){
      resetSessionStore()
      navigate("/auth")
    }
  },[data])

  return {
    data, 
    isPending, 
    isError,
    getCliente,
    createCliente,
    updateCliente,
    setStateCliente,
    deleteCliente,
    consultarNroDocumento,
    typeAction: typeActionRef.current,
    reset
  }
}


