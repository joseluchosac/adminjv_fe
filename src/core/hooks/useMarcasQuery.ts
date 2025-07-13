const apiURL = import.meta.env.VITE_API_URL;
import { useCallback, useEffect, useRef, useState } from "react"
import { useNavigate } from "react-router-dom";
import { useInfiniteQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import useSessionStore from "../store/useSessionStore"
import { mutationFetch } from "../services/mutationFecth"
import { FilterMarcasResp, Marca } from "../types";
import { filterFetch } from "../services/filterFetch";
import { filterParamsInit } from "../utils/constants";

type TypeAction = "filter_full" | "mutate_marca"

// ****** FILTRAR ******
export const useFilterMarcasQuery = () => {
  const [filterParamsMarcas, setFilterParamsMarcas] = useState(filterParamsInit)
  const tknSession = useSessionStore(state => state.tknSession)
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
      return filterFetch({
        filterParams: filterParamsMarcas,
        url: `${apiURL}marcas/filter_marcas?page=${page}`,
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
  const tknSession = useSessionStore(state => state.tknSession)
  const Authorization = "Bearer " + tknSession
  const queryClient = useQueryClient()
  const typeActionRef = useRef<TypeAction | "">("")

  const {data, isPending, isError, mutate, } = useMutation({
    mutationFn: mutationFetch,
    onSuccess: (resp) => {
      if(resp.msgType !== 'success') return
      queryClient.invalidateQueries({queryKey:["marcas"]}) // Recarga la tabla marcas
    }
  })

  // const filterMarcasFull = () => {// Sin Paginacion
  //   typeActionRef.current = "filter_full"
  //   const params = {
  //     url: apiURL + "marcas/filter_marcas_full",
  //     method: "POST",
  //     headers:{ 
  //       Authorization,
  //     },
  //     body: JSON.stringify(filterParamsMarcas),
  //   }
  //   mutate(params)
  // }

  const getMarca = (id: number) => {
    const params = {
      url: apiURL + "marcas/get_marca",
      method: "POST",
      headers:{ 
        Authorization,
      },
      body: JSON.stringify({id}),
    }
    mutate(params)
  }

  const createMarca = (marca: Marca) => {
    typeActionRef.current = "mutate_marca"
    const params = {
      url: apiURL + "marcas/create_marca",
      method: "POST",
      headers:{ 
        Authorization,
      },
      body: JSON.stringify(marca),
    }
    mutate(params)
  }

  const updateMarca = (marca: Marca) => {
    typeActionRef.current = "mutate_marca"
    const params = {
      url: apiURL + "marcas/update_marca",
      method: "PUT",
      headers:{ 
        Authorization,
      },
      body: JSON.stringify(marca),
    }
    mutate(params)
  }

  const deleteMarca = (id: number) => {
    typeActionRef.current = "mutate_marca"
    const params = {
      url: apiURL + "marcas/delete_marca",
      method: "DELETE",
      headers:{ 
        Authorization,
      },
      body: JSON.stringify({id}),
    }
    mutate(params)
  }

  const reset = (newValues: any) => {
    mutate({newValues}) // Solo actualiza los datos, solo local
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
    reset,
  }
}
