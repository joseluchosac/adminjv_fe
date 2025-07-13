const apiURL = import.meta.env.VITE_API_URL;
import { useEffect, useRef, useState } from "react"
import { useNavigate } from "react-router-dom";
import { useInfiniteQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import useSessionStore from "../store/useSessionStore"
import { mutationFetch } from "../services/mutationFecth"
import { FilterLaboratoriosResp, Laboratorio } from "../types";
import { filterFetch } from "../services/filterFetch";
import { filterParamsInit } from "../utils/constants";

type TypeAction = 
  "filter_full"
  | "mutate_laboratorio"

// ****** FILTRAR  ******
export const useFilterLaboratoriosQuery = () => {
  const [filterParamsLaboratorios, setFilterParamsLaboratorios] = useState(filterParamsInit)
  const token = useSessionStore(state => state.tknSession)
  const queryClient = useQueryClient()

  const {
    data,
    isError,
    isLoading,
    isFetching,
    hasNextPage,
    fetchNextPage,
  } = useInfiniteQuery<FilterLaboratoriosResp, Error>({
    queryKey: ['laboratorios'],
    queryFn: ({pageParam = 1, signal}) => {
      const page = pageParam as number
      return filterFetch({
        filterParams: filterParamsLaboratorios,
        url: `${apiURL}laboratorios/filter_laboratorios?page=${page}`,
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
    queryClient.resetQueries({ queryKey: ['laboratorios'], exact: true });
    setFilterParamsLaboratorios(filterParamsInit)
  }

  useEffect(() => {
    return () => {
      resetear()
    }
  },[])
  
  useEffect(() => {
    queryClient.invalidateQueries({queryKey:["laboratorios"]})
  }, [filterParamsLaboratorios])

  return {
    data,
    isError, 
    isLoading, 
    isFetching, 
    hasNextPage, 
    fetchNextPage,
    setFilterParamsLaboratorios,
  }
}

// ****** MUTATION ******
export const useMutationLaboratoriosQuery = () => {
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
      queryClient.invalidateQueries({queryKey:["laboratorios"]}) // Recarga la tabla laboratorios
    }
  })

  // const filterLaboratoriosFull = () => {// Sin Paginacion
  //   typeActionRef.current = "filter_full"
  //   const params = {
  //     url: apiURL + "laboratorios/filter_laboratorios_full",
  //     method: "POST",
  //     headers:{ 
  //       Authorization,
  //     },
  //     body: JSON.stringify(filterParamsLaboratorios),
  //   }
  //   mutate(params)
  // }

  const getLaboratorio = (id: number) => {
    const params = {
      url: apiURL + "laboratorios/get_laboratorio",
      method: "POST",
      headers:{ 
        Authorization,
      },
      body: JSON.stringify({id}),
    }
    mutate(params)
  }

  const createLaboratorio = (laboratorio: Laboratorio) => {
    typeActionRef.current = "mutate_laboratorio"
    const params = {
      url: apiURL + "laboratorios/create_laboratorio",
      method: "POST",
      headers:{ 
        Authorization,
      },
      body: JSON.stringify(laboratorio),
    }
    mutate(params)
  }

  const updateLaboratorio = (laboratorio: Laboratorio) => {
    typeActionRef.current = "mutate_laboratorio"
    const params = {
      url: apiURL + "laboratorios/update_laboratorio",
      method: "PUT",
      headers:{ 
        Authorization,
      },
      body: JSON.stringify(laboratorio),
    }
    mutate(params)
  }

  const deleteLaboratorio = (id: number) => {
    typeActionRef.current = "mutate_laboratorio"
    const params = {
      url: apiURL + "laboratorios/delete_laboratorio",
      method: "DELETE",
      headers:{ 
        Authorization,
      },
      body: JSON.stringify({id}),
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
    // filterLaboratoriosFull,
    getLaboratorio,
    createLaboratorio,
    updateLaboratorio,
    deleteLaboratorio,
    typeAction: typeActionRef.current,
    reset,
  }
}


