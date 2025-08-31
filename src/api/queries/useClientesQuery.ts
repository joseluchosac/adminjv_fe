const apiURL = import.meta.env.VITE_API_URL;
import { useInfiniteQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import useSessionStore from "../../app/store/useSessionStore"
import { useEffect, useRef } from "react"
import { useNavigate } from "react-router-dom";
import { Cliente, ClienteItem, FetchOptions, FilterQueryResp, ApiResp } from "../../app/types";
import useClientesStore from "../../app/store/useClientesStore";
import { fnFetch } from "../fnFetch";
import { toast } from "react-toastify";
import { useDebounce } from "react-use";

type TypeAction = "mutate_cliente" | "query_document"

// ****** FILTRAR ******
export interface ClientesFilQryRes extends FilterQueryResp {
  filas: ClienteItem[];
}

export const useFilterClientesQuery = () => {
  const token = useSessionStore(state => state.tknSession)
  const queryClient = useQueryClient()
  const {
    clienteFilterForm,
    clienteFilterParam,
    setClienteFilterParam,
    setClienteFilterParamBetween,
    setClienteFilterInfo
  } = useClientesStore()

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
        body: JSON.stringify(clienteFilterParam),
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

  // const resetear = ()=>{
  //   queryClient.resetQueries({ queryKey: ['clientes'], exact: true });
  // }

  useDebounce(() => {
    if (
        clienteFilterForm.search.toLowerCase().trim() ==
        clienteFilterParam.search.toLowerCase().trim()
    ) return;
    setClienteFilterParam()
  }, 500, [clienteFilterForm.search]);

  useEffect(() => {
    setClienteFilterParam()
  }, [clienteFilterForm.order, clienteFilterForm.equal])

  useEffect(() => {
    setClienteFilterParamBetween()
  }, [clienteFilterForm.between])

  useEffect(() => {
    // if (isFirstRender.current) {
    //   isFirstRender.current = false;
    //   return; // Evita ejecutar en el primer render
    // }
    queryClient.invalidateQueries({queryKey:["clientes"]})
  }, [clienteFilterParam])

  useEffect(()=>{
    if(!data) return
    if(data?.pages[0].error || isError){
      toast.error("Error al obtener registros")
      return
    }
    if(!isFetching){
      setClienteFilterInfo()
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
export const useMutationClientesQuery = <T>() => {
  const resetSessionStore = useSessionStore(state => state.resetSessionStore)
  const navigate = useNavigate()
  const token = useSessionStore(state => state.tknSession)
  const queryClient = useQueryClient()
  const typeActionRef = useRef<TypeAction | "">("")

  const {data, isPending, isError, mutate, reset} = useMutation<T, Error, FetchOptions, unknown>({
    mutationKey:["clientes_mut"],
    mutationFn: fnFetch,
    onSuccess: (resp) => {
      const r = resp as ApiResp
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
      method: "PUT",
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

  const queryDocument = (param: any) => {
    typeActionRef.current = "query_document"
    const options: FetchOptions = {
      method: "POST",
      url: apiURL + "clientes/query_document",
      body: JSON.stringify(param),
      authorization: "Bearer " + token,
    }
    mutate(options)
  }

  useEffect(()=>{
    const r = data as ApiResp
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
    queryDocument,
    typeAction: typeActionRef.current,
    reset
  }
}


