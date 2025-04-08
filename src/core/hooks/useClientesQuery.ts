const beURL = import.meta.env.VITE_BE_URL;
import { useInfiniteQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import useSessionStore from "../store/useSessionStore"
import { useEffect, useState } from "react"
import { mutationFetch } from "../services/mutationFecth"
import { useNavigate } from "react-router-dom";
import { filterClientesFetch } from "../services/clientesFetch";
import useClientesStore, { clientesStoreInit } from "../store/useClientesStore";
import { Cliente } from "../types/clientesTypes";


// ****** FILTRAR CLIENTES ******
export const useFilterClientesQuery = () => {
  // const navigate = useNavigate()
  const [isEnabledQuery, setIsEnabledQuery] = useState(false)
  const tknSession = useSessionStore(state => state.tknSession)
  const filterParamsClientes = useClientesStore(state => state.filterParamsClientes)
  const queryClient = useQueryClient()
  const setFilterParamsClientes = useClientesStore(state => state.setFilterParamsClientes)


  const {fetchNextPage, data, refetch, isError, isLoading, isFetching, hasNextPage,  } = useInfiniteQuery({
    queryKey: ['clientes'],
    queryFn: ({pageParam = 1, signal}) => {
      return filterClientesFetch({filterParamsClientes, pageParam, signal, token: tknSession})
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
    queryClient.resetQueries({ queryKey: ['clientes'], exact: true });
    return () => {
      queryClient.setQueryData(['clientes'], () => null)
      setFilterParamsClientes(clientesStoreInit.filterParamsClientes)
    }
  },[])
  
  useEffect(() => {
    if(!isEnabledQuery){
      setIsEnabledQuery(true)
    }else{
      refetch()
    }
  }, [filterParamsClientes])

  // useEffect(()=>{
  //   if(data?.pages[data?.pages.length-1].msgType === "errorToken"){
  //     navigate("/auth")
  //   }
  // },[data])

  return {
    data,
    fetchNextPage, 
    isError, 
    isLoading, 
    isFetching, 
    hasNextPage, 
  }
}

// ****** MUTATION CLIENTES ******
export const useMutationClientesQuery = () => {
  const resetSessionStore = useSessionStore(state => state.resetSessionStore)
  const navigate = useNavigate()
  const tknSession = useSessionStore(state => state.tknSession)
  const nombreModulo = useSessionStore(state => state.moduloActual?.nombre)
  const Authorization = "Bearer " + tknSession
  const filterParamsClientes = useClientesStore(state => state.filterParamsClientes)

  const queryClient = useQueryClient()

  const {data, isPending, isError, mutate, } = useMutation({
    mutationFn: mutationFetch,
    onSuccess: (resp) => {
      if(resp.msgType !== 'success') return
      queryClient.invalidateQueries({queryKey:["clientes"]})
    }
  })

  const filterClientesFull = () => {// Sin Paginacion
    const params = {
      url: beURL + "api/clientes/filter_clientes_full",
      method: "POST",
      headers:{ 
        Authorization,
        'nombre-modulo': nombreModulo,
      },
      body: JSON.stringify(filterParamsClientes),
    }
    mutate(params)
  }

  const getCliente = (id: number) => {
    const params = {
      url: beURL + "api/clientes/get_cliente",
      method: "POST",
      headers:{ 
        Authorization,
        'nombre-modulo': nombreModulo,
      },
      body: JSON.stringify({id}),
    }
    mutate(params)
  }

  const createCliente = (param: Cliente) => {
    const params = {
      url: beURL + "api/clientes/create_cliente",
      method: "POST",
      headers:{ 
        Authorization,
        'nombre-modulo': nombreModulo,
      },
      body: JSON.stringify(param),
    }
    mutate(params)
  }


  const updateCliente = (param: Cliente) => {
    const params = {
      url: beURL + "api/clientes/update_cliente",
      method: "PUT",
      headers:{ 
        Authorization,
        'nombre-modulo': nombreModulo,
      },
      body: JSON.stringify(param),
    }
    mutate(params)
  }



  const deleteCliente = (id: number) => {
    const params = {
      url: beURL + "api/clientes/delete_cliente",
      method: "DELETE",
      headers:{ 
        Authorization,
        'nombre-modulo': nombreModulo,
      },
      body: JSON.stringify({id}),
    }
    mutate(params)
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
    filterClientesFull,
    getCliente,
    createCliente,
    updateCliente,
    deleteCliente,
  }
}


