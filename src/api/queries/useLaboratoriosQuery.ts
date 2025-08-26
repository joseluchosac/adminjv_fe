const apiURL = import.meta.env.VITE_API_URL;
import { useEffect, useRef } from "react"
import { useNavigate } from "react-router-dom";
import { useInfiniteQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import useSessionStore from "../../app/store/useSessionStore"
import { FetchOptions, FilterQueryResp, Laboratorio, LaboratorioItem } from "../../app/types";
import { fnFetch } from "../fnFetch";
import { toast } from "react-toastify";
import { useDebounce } from "react-use";
import useLaboratoriosStore from "../../app/store/useLaboratoriosStore";

type TypeAction = 
  "filter_full"
  | "mutate_laboratorio"
  | 'mutate_state_laboratorio'

// ****** FILTRAR  ******
export interface LaboratoriosFilQryRes extends FilterQueryResp {
  filas: LaboratorioItem[];
}

export const useFilterLaboratoriosQuery = () => {
  const token = useSessionStore(state => state.tknSession)
  // const isFirstRender = useRef(true);
  const queryClient = useQueryClient()
  const {
    laboratorioFilterForm,
    laboratorioFilterParam,
    setLaboratorioFilterParam,
    setLaboratorioFilterParamBetween,
    setLaboratorioFilterInfo
  } = useLaboratoriosStore()

  const {
    data,
    isError,
    isLoading,
    isFetching,
    hasNextPage,
    fetchNextPage,
  } = useInfiniteQuery<LaboratoriosFilQryRes, Error>({
    queryKey: ['laboratorios'],
    queryFn: ({pageParam = 1, signal}) => {
      const page = pageParam as number
      const options: FetchOptions = {
        method: "POST",
        url: `${apiURL}laboratorios/filter_laboratorios?page=${page}`,
        body: JSON.stringify(laboratorioFilterParam),
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
  //   queryClient.resetQueries({ queryKey: ['laboratorios'], exact: true });
  // }

  useDebounce(() => {
    if (
        laboratorioFilterForm.search.toLowerCase().trim() ==
        laboratorioFilterParam.search.toLowerCase().trim()
    ) return;
    setLaboratorioFilterParam()
  }, 500, [laboratorioFilterForm.search]);

  useEffect(() => {
    setLaboratorioFilterParam()
  }, [laboratorioFilterForm.order, laboratorioFilterForm.equal])

  useEffect(() => {
    setLaboratorioFilterParamBetween()
  }, [laboratorioFilterForm.between])

  useEffect(() => {
    // if (isFirstRender.current) {
    //   isFirstRender.current = false;
    //   return; // Evita ejecutar en el primer render
    // }
    queryClient.invalidateQueries({queryKey:["laboratorios"]})
  }, [laboratorioFilterParam])

  useEffect(()=>{
    if(!data) return
    if(data?.pages[0].error || isError){
      toast.error("Error al obtener registros")
      return
    }
    if(!isFetching){
      setLaboratorioFilterInfo()
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
export const useMutationLaboratoriosQuery = () => {
  const resetSessionStore = useSessionStore(state => state.resetSessionStore)
  const navigate = useNavigate()
  const token = useSessionStore(state => state.tknSession)
  const queryClient = useQueryClient()
  const typeActionRef = useRef<TypeAction | "">("")

  const {data, isPending, isError, mutate, } = useMutation({
    mutationFn: fnFetch,
    onSuccess: (resp) => {
      if(resp.msgType !== 'success') return
      queryClient.invalidateQueries({queryKey:["laboratorios"]}) // Recarga la tabla laboratorios
    }
  })

  const getLaboratorio = (id: number) => {
    const options: FetchOptions = {
      method: "POST",
      url: apiURL + "laboratorios/get_laboratorio",
      body: JSON.stringify({id}),
      authorization: "Bearer " + token,
    }
    mutate(options)
  }

  const createLaboratorio = (laboratorio: Laboratorio) => {
    typeActionRef.current = "mutate_laboratorio"
    const options: FetchOptions = {
      method: "POST",
      url: apiURL + "laboratorios/create_laboratorio",
      body: JSON.stringify(laboratorio),
      authorization: "Bearer " + token,
    }
    mutate(options)
  }

  const updateLaboratorio = (laboratorio: Laboratorio) => {
    typeActionRef.current = "mutate_laboratorio"
    const options: FetchOptions = {
      method: "PUT",
      url: apiURL + "laboratorios/update_laboratorio",
      body: JSON.stringify(laboratorio),
      authorization: "Bearer " + token,
    }
    mutate(options)
  }
  const setStateLaboratorio = (data: {estado: number, id: number}) => {
    typeActionRef.current = "mutate_state_laboratorio"
    const options: FetchOptions = {
      method: "PUT",
      url: apiURL + "laboratorios/set_state_laboratorio",
      body: JSON.stringify(data),
      authorization: "Bearer " + token,
    }
    mutate(options)
  }
  const deleteLaboratorio = (id: number) => {
    typeActionRef.current = "mutate_laboratorio"
    const options: FetchOptions = {
      method: "DELETE",
      url: apiURL + "laboratorios/delete_laboratorio",
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
    getLaboratorio,
    createLaboratorio,
    updateLaboratorio,
    setStateLaboratorio,
    deleteLaboratorio,
    typeAction: typeActionRef.current,
  }
}


