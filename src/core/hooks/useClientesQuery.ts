const apiURL = import.meta.env.VITE_API_URL;
import { useInfiniteQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import useSessionStore from "../store/useSessionStore"
import { useEffect, useRef, useState } from "react"
import { mutationFetch } from "../services/mutationFecth"
import { useNavigate } from "react-router-dom";
import { Cliente, FilterClientesResp, MutationFetch, ResponseQuery } from "../types";
import { filterFetch } from "../services/filterFetch";
import { filterParamsInit } from "../utils/constants";

type TypeAction = "mutate_cliente" | "consultar_nro_doc"

// ****** FILTRAR ******
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
  } = useInfiniteQuery<FilterClientesResp, Error>({
    queryKey: ['clientes'],
    queryFn: ({pageParam = 1, signal}) => {
      const page = pageParam as number
      return filterFetch({
        filterParams: filterParamsClientes,
        url: `${apiURL}clientes/filter_clientes?page=${page}`,
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
  const tknSession = useSessionStore(state => state.tknSession)
  const Authorization = "Bearer " + tknSession
  const queryClient = useQueryClient()
  const typeActionRef = useRef<TypeAction | "">("")

  const {data, isPending, isError, mutate, } = useMutation<T, Error, MutationFetch, unknown>({
    mutationFn: mutationFetch,
    onSuccess: (resp) => {
      const r = resp as ResponseQuery
      if(r?.msgType !== 'success') return
      queryClient.invalidateQueries({queryKey:["clientes"]}) // Recarga la tabla clientes
    }
  })

  const getCliente = (id: number) => {
    const params = {
      url: apiURL + "clientes/get_cliente",
      method: "POST",
      headers:{ 
        Authorization,
      },
      body: JSON.stringify({id}),
    }
    mutate(params)
  }

  const createCliente = (cliente: Cliente) => {
    typeActionRef.current = "mutate_cliente"
    const params = {
      url: apiURL + "clientes/create_cliente",
      method: "POST",
      headers:{ 
        Authorization,
      },
      body: JSON.stringify(cliente),
    }
    mutate(params)
  }

  const updateCliente = (cliente: Cliente) => {
    typeActionRef.current = "mutate_cliente"
    const params = {
      url: apiURL + "clientes/update_cliente",
      method: "PUT",
      headers:{ 
        Authorization,
      },
      body: JSON.stringify(cliente),
    }
    mutate(params)
  }

  const setStateCliente = (estado: number) => {
    typeActionRef.current = "mutate_cliente"
    const params = {
      url: apiURL + "clientes/set_state_cliente",
      method: "PUT",
      headers:{ 
        Authorization,
      },
      body: JSON.stringify({estado}),
    }
    mutate(params)
  }

  const deleteCliente = (id: number) => {
    typeActionRef.current = "mutate_cliente"
    const params = {
      url: apiURL + "clientes/delete_cliente",
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
      url: apiURL + "clientes/consultar_nro_documento",
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
    const r = data as ResponseQuery
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


