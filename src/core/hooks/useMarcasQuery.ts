const apiURL = import.meta.env.VITE_API_URL;
import { useCallback, useEffect, useRef, useState } from "react"
import { useNavigate } from "react-router-dom";
import { useInfiniteQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import useSessionStore from "../store/useSessionStore"
import { FilterMarcasResp, FnFetchOptions, Marca } from "../types";
import { filterParamsInit } from "../utils/constants";
import { fnFetch } from "../services/fnFetch";

type TypeAction = "filter_full" | "mutate_marca"

// ****** FILTRAR ******
export const useFilterMarcasQuery = () => {
  const [filterParamsMarcas, setFilterParamsMarcas] = useState(filterParamsInit)
  const token = useSessionStore(state => state.tknSession)
  const queryClient = useQueryClient()
  
  const {
    data,
    isError,
    isLoading,
    isFetching,
    hasNextPage,
    fetchNextPage,
  } = useInfiniteQuery<FilterMarcasResp, Error>({
    queryKey: ['marcas'],
    queryFn: ({pageParam = 1, signal}) => {
      const page = pageParam as number
      const options: FnFetchOptions = {
        method: "POST",
        url: `${apiURL}marcas/filter_marcas?page=${page}`,
        body: JSON.stringify(filterParamsMarcas),
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

  const resetear = useCallback(()=>{
    queryClient.resetQueries({ queryKey: ['marcas'], exact: true });
    setFilterParamsMarcas(filterParamsInit)
  },[])
  

  useEffect(() => {
    return () => {
      resetear()
    }
  },[])
  
  useEffect(() => {
    queryClient.invalidateQueries({queryKey:["marcas"]})
  }, [filterParamsMarcas])

  return {
    data,
    isError, 
    isLoading, 
    isFetching, 
    hasNextPage, 
    fetchNextPage,
    setFilterParamsMarcas,
  }
}

// ****** MUTATION ******
export const useMutationMarcasQuery = () => {
  const resetSessionStore = useSessionStore(state => state.resetSessionStore)
  const navigate = useNavigate()
  const token = useSessionStore(state => state.tknSession)
  const queryClient = useQueryClient()
  const typeActionRef = useRef<TypeAction | "">("")

  const {data, isPending, isError, mutate, } = useMutation({
    mutationFn: fnFetch,
    onSuccess: (resp) => {
      if(resp.msgType !== 'success') return
      queryClient.invalidateQueries({queryKey:["marcas"]}) // Recarga la tabla marcas
    }
  })

  const getMarca = (id: number) => {
    const options: FnFetchOptions = {
      method: "POST",
      url: apiURL + "marcas/get_marca",
      body: JSON.stringify({id}),
      authorization: "Bearer " + token,
    }
    mutate(options)
  }

  const createMarca = (marca: Marca) => {
    typeActionRef.current = "mutate_marca"
    const options: FnFetchOptions = {
      method: "POST",
      url: apiURL + "marcas/create_marca",
      body: JSON.stringify(marca),
      authorization: "Bearer " + token,
    }
    mutate(options)
  }

  const updateMarca = (marca: Marca) => {
    typeActionRef.current = "mutate_marca"
    const options: FnFetchOptions = {
      method: "PUT",
      url: apiURL + "marcas/update_marca",
      body: JSON.stringify(marca),
      authorization: "Bearer " + token,
    }
    mutate(options)
  }

  const deleteMarca = (id: number) => {
    typeActionRef.current = "mutate_marca"
    const options: FnFetchOptions = {
      method: "DELETE",
      url: apiURL + "marcas/delete_marca",
      body: JSON.stringify({id}),
      authorization: "Bearer " + token,
    }
    mutate(options)
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
    getMarca,
    createMarca,
    updateMarca,
    deleteMarca,
    typeAction: typeActionRef.current,
  }
}
