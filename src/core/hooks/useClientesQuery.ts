const apiURL = import.meta.env.VITE_API_URL;
import { useInfiniteQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import useSessionStore from "../store/useSessionStore"
import { useEffect, useRef } from "react"
import { mutationFetch } from "../services/mutationFecth"
import { useNavigate } from "react-router-dom";
import useClientesStore from "../store/useClientesStore";
import { Cliente, FilterClientesResp } from "../types";
import { filterFetch } from "../services/filterFetch";

type TypeAction = 
"filter_full" 
| "mutate_cliente"
| "consultar_nro_doc"

// ****** FILTRAR CLIENTES ******
export const useFilterClientesQuery = () => {
  const filterParamsClientes = useClientesStore(state => state.filterParamsClientes)
  // const setFilterParamsClientes = useClientesStore(state => state.setFilterParamsClientes)
  const tknSession = useSessionStore(state => state.tknSession)
  const queryClient = useQueryClient()

  const {
    fetchNextPage,
    data,
    isError,
    isLoading,
    isFetching,
    hasNextPage
  } = useInfiniteQuery<FilterClientesResp, Error>({
    queryKey: ['clientes'],
    queryFn: ({pageParam = 1, signal}) => {
      const page = pageParam as number
      return filterFetch({
        filterParams: filterParamsClientes,
        url: `${apiURL}clientes/filter_clientes?page=${page}`,
        signal,
        token: tknSession
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
  }

  useEffect(() => {
    return () => {
      resetear()
    }
  },[])
  
  useEffect(() => {
    queryClient.invalidateQueries({queryKey:["clientes"]})
  }, [filterParamsClientes])

  // useEffect(()=>{
  //   if(data?.pages[data?.pages.length-1].errorType === "errorToken"){
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
export const useMutationClientesQuery = () => {
  const resetSessionStore = useSessionStore(state => state.resetSessionStore)
  const navigate = useNavigate()
  const tknSession = useSessionStore(state => state.tknSession)
  const Authorization = "Bearer " + tknSession
  const filterParamsClientes = useClientesStore(state => state.filterParamsClientes)  
  const queryClient = useQueryClient()
  const typeActionRef = useRef<TypeAction | "">("")

  const {data, isPending, isError, mutate, } = useMutation({
    mutationFn: mutationFetch,
    onSuccess: (resp) => {
      if(resp.msgType !== 'success') return
      queryClient.invalidateQueries({queryKey:["clientes"]}) // Recarga la tabla clientes
    }
  })

  const filterClientesFull = () => {// Sin Paginacion
    const params = {
      url: apiURL + "clientes/filter_clientes_full",
      method: "POST",
      headers:{ 
        Authorization,
      },
      body: JSON.stringify(filterParamsClientes),
    }
    mutate(params)
  }

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
    if(data?.errorType === "errorToken"){
      resetSessionStore()
      navigate("/auth")
    }
  },[data])

  return {
    data, 
    isPending, 
    isError,
    filterClientesFull,
    getCliente,
    createCliente,
    updateCliente,
    deleteCliente,
    consultarNroDocumento,
    typeAction: typeActionRef.current,
    reset
  }
}


