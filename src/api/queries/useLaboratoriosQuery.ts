const apiURL = import.meta.env.VITE_API_URL;
import { useEffect, useRef } from "react"
import { useNavigate } from "react-router-dom";
import { InfiniteData, useInfiniteQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import useSessionStore from "../../app/store/useSessionStore"
import { FetchOptions, Laboratorio, LaboratorioItem, ApiResp, LaboratoriosFilQryRes } from "../../app/types";
import { fnFetch } from "../fnFetch";
import { toast } from "react-toastify";
import { useDebounce } from "react-use";
import useLaboratoriosStore from "../../app/store/useLaboratoriosStore";

type TypeAction = "CREATE_LABORATORIO"
  | "UPDATE_LABORATORIO"
  | "DELETE_LABORATORIO"

// ****** FILTRAR  ******
export const useLaboratoriosFilterQuery = () => {
  const {
    laboratorioFilterForm,
    laboratorioFilterParam,
    setLaboratorioFilterParam,
    setLaboratorioFilterParamBetween,
    setLaboratorioFilterInfo
  } = useLaboratoriosStore()
  const token = useSessionStore(state => state.tknSession)
  // const isFirstRender = useRef(true);
  const queryClient = useQueryClient()


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

  const resetear = ()=>{
    queryClient.resetQueries({ queryKey: ['laboratorios'], exact: true });
  }


  useDebounce(() => {
    if (
        laboratorioFilterForm.search.toLowerCase().trim() ==
        laboratorioFilterParam.search.toLowerCase().trim()
    ) return;
    setLaboratorioFilterParam()
  }, 500, [laboratorioFilterForm.search]);

  useEffect(() => {
    // if (isFirstRender.current) {
    //   isFirstRender.current = false;
    //   return; // Evita ejecutar en el primer render
    // }
    return () => {
      resetear()
    }
  }, [])

  useEffect(() => {
    setLaboratorioFilterParam()
  }, [laboratorioFilterForm.order, laboratorioFilterForm.equal])

  useEffect(() => {
    setLaboratorioFilterParamBetween()
  }, [laboratorioFilterForm.between])

  useEffect(() => {
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
export type MutationLaboratorioRes = ApiResp & {
  laboratorio?: LaboratorioItem
};
export const useMutationLaboratoriosQuery = <T>() => {
  const resetSessionStore = useSessionStore(state => state.resetSessionStore)
  const navigate = useNavigate()
  const token = useSessionStore(state => state.tknSession)
  const queryClient = useQueryClient()
  const typeActionRef = useRef<TypeAction | "">("")

  const {data, isPending, isError, mutate, } = useMutation<T, Error, FetchOptions, unknown>({
    mutationFn: fnFetch,
    onSuccess: (resp) => {
      const r = resp as MutationLaboratorioRes
      if(r.msgType !== 'success') return
      if(typeActionRef.current === "CREATE_LABORATORIO") {
        const createdLaboratorio = r.laboratorio as LaboratorioItem
        queryClient.setQueryData(["laboratorios"], (oldData: InfiniteData<LaboratoriosFilQryRes, unknown> | undefined) => {
          const pages = structuredClone(oldData?.pages)
          if((pages?.length || 0) < 4){ // hacer refetch si se cumple esta condicion
            queryClient.invalidateQueries({queryKey:["laboratorios"]})
            return oldData
          }
          if(pages && pages.length > 0){
            pages[0].filas.unshift(createdLaboratorio as LaboratorioItem) // Agrega el nuevo registro al inicio de la primera página
            pages[0].num_regs = pages[0].num_regs + 1
          }
          return {...oldData, pages, }
        })
      }else if(typeActionRef.current === "UPDATE_LABORATORIO") {
        const updatedLaboratorio = r.laboratorio as LaboratorioItem
        queryClient.setQueryData(["laboratorios"], (oldData: InfiniteData<LaboratoriosFilQryRes, unknown> | undefined) => {
          const pages = structuredClone(oldData?.pages)
          if((pages?.length || 0) < 4){
            queryClient.invalidateQueries({queryKey:["laboratorios"]})
            return oldData
          }
          for(let idxPage in pages){
            const idxFila = pages[parseInt(idxPage)].filas.findIndex((el: LaboratorioItem)=>el.id === updatedLaboratorio.id)
            if(idxFila !== -1){
              pages[parseInt(idxPage)].filas[idxFila] = updatedLaboratorio // Actualiza el registro en la lista
              break
            }
          }
          return {...oldData, pages}
        })
      }else if(typeActionRef.current === "DELETE_LABORATORIO") {
        const deletedLaboratorioId = r.content as LaboratorioItem["id"]
        queryClient.setQueryData(["laboratorios"], (oldData: InfiniteData<LaboratoriosFilQryRes, unknown> | undefined) => {
          let pages = structuredClone(oldData?.pages)
          if((pages?.length || 0) < 4){
            queryClient.invalidateQueries({queryKey:["laboratorios"]})
            return oldData
          }
          for(let idxPage in pages){
            const idxFila = pages[parseInt(idxPage)].filas.findIndex((el: LaboratorioItem)=>el.id === deletedLaboratorioId)
            if(idxFila !== -1){
              let filasFiltradas = pages[parseInt(idxPage)].filas.filter(el => el.id !== deletedLaboratorioId) // Elimina el usuario de la fila
              pages[parseInt(idxPage)].filas = filasFiltradas
              pages[0].num_regs = pages[0].num_regs - 1
              break
            }
          }
          return {...oldData, pages}
        })
      } 



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
    typeActionRef.current = "CREATE_LABORATORIO"
    const options: FetchOptions = {
      method: "POST",
      url: apiURL + "laboratorios/create_laboratorio",
      body: JSON.stringify(laboratorio),
      authorization: "Bearer " + token,
    }
    mutate(options)
  }

  const updateLaboratorio = (laboratorio: Laboratorio) => {
    typeActionRef.current = "UPDATE_LABORATORIO"
    const options: FetchOptions = {
      method: "PUT",
      url: apiURL + "laboratorios/update_laboratorio",
      body: JSON.stringify(laboratorio),
      authorization: "Bearer " + token,
    }
    mutate(options)
  }

  const setStateLaboratorio = (data: {estado: number, id: number}) => {
    typeActionRef.current = "UPDATE_LABORATORIO"
    const options: FetchOptions = {
      method: "PUT",
      url: apiURL + "laboratorios/set_state_laboratorio",
      body: JSON.stringify(data),
      authorization: "Bearer " + token,
    }
    mutate(options)
  }
  
  const deleteLaboratorio = (id: number) => {
    typeActionRef.current = "DELETE_LABORATORIO"
    const options: FetchOptions = {
      method: "DELETE",
      url: apiURL + "laboratorios/delete_laboratorio",
      body: JSON.stringify({id}),
      authorization: "Bearer " + token,
    }
    mutate(options)
  }

  useEffect(()=>{
    if((data as ApiResp)?.errorType === "errorToken"){
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


