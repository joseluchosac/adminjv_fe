const apiURL = import.meta.env.VITE_API_URL;
import { useEffect, useRef } from "react"
import { useNavigate } from "react-router-dom";
import { useInfiniteQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import useSessionStore from "../../app/store/useSessionStore"
import { FetchOptions, FilterQueryResp, Marca, MarcaItem, ApiResp } from "../../app/types";
import { fnFetch } from "../fnFetch";
import useMarcasStore from "../../app/store/useMarcasStore";
import { useDebounce } from "react-use";
import { toast } from "react-toastify";

type TypeAction = 
"mutate_create_marca" 
| 'mutate_update_marca'
| 'mutate_delete_marca'
| 'mutate_state_marca'

// ****** FILTRAR ******
export interface MarcasFilQryRes extends FilterQueryResp {
  filas: MarcaItem[];
}

export const useFilterMarcasQuery = () => {
  const token = useSessionStore(state => state.tknSession)
  // const isFirstRender = useRef(true);
  const queryClient = useQueryClient()
  const {
    marcaFilterForm,
    marcaFilterParam,
    setMarcaFilterParam,
    setMarcaFilterParamBetween,
    setMarcaFilterInfo
  } = useMarcasStore()

  const {
    data,
    isError,
    isLoading,
    isFetching,
    hasNextPage,
    fetchNextPage,
  } = useInfiniteQuery<MarcasFilQryRes, Error>({
    queryKey: ['marcas'],
    queryFn: ({pageParam = 1, signal}) => {
      const page = pageParam as number
      const options: FetchOptions = {
        method: "POST",
        url: `${apiURL}marcas/filter_marcas?page=${page}`,
        body: JSON.stringify(marcaFilterParam),
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
  //   queryClient.resetQueries({ queryKey: ['marcas'], exact: true });
  // }

  useDebounce(() => {
    if (
        marcaFilterForm.search.toLowerCase().trim() ==
        marcaFilterParam.search.toLowerCase().trim()
    ) return;
    setMarcaFilterParam()
  }, 500, [marcaFilterForm.search]);

  useEffect(() => {
    setMarcaFilterParam()
  }, [marcaFilterForm.order, marcaFilterForm.equal])

  useEffect(() => {
    setMarcaFilterParamBetween()
  }, [marcaFilterForm.between])

  useEffect(() => {
    // if (isFirstRender.current) {
    //   isFirstRender.current = false;
    //   return; // Evita ejecutar en el primer render
    // }
    queryClient.invalidateQueries({queryKey:["marcas"]})
  }, [marcaFilterParam])

  useEffect(()=>{
    if(!data) return
    if(data?.pages[0].error || isError){
      toast.error("Error al obtener registros")
      return
    }
    if(!isFetching){
      setMarcaFilterInfo()
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
export const useMutationMarcasQuery = <T>() => {
  const resetSessionStore = useSessionStore(state => state.resetSessionStore)
  const navigate = useNavigate()
  const token = useSessionStore(state => state.tknSession)
  const queryClient = useQueryClient()
  const typeActionRef = useRef<TypeAction | "">("")

  const {data, isPending, isError, mutate, } = useMutation<T, Error, FetchOptions, unknown>({
    mutationFn: fnFetch,
    onSuccess: (resp) => {
      if((resp as ApiResp).msgType !== 'success') return
      queryClient.invalidateQueries({queryKey:["marcas"]}) // Recarga la tabla marcas
    }
  })

  const getMarca = (id: number) => {
    const options: FetchOptions = {
      method: "POST",
      url: apiURL + "marcas/get_marca",
      body: JSON.stringify({id}),
      authorization: "Bearer " + token,
    }
    mutate(options)
  }

  const createMarca = (marca: Marca) => {
    typeActionRef.current = "mutate_create_marca"
    const options: FetchOptions = {
      method: "POST",
      url: apiURL + "marcas/create_marca",
      body: JSON.stringify(marca),
      authorization: "Bearer " + token,
    }
    mutate(options)
  }

  const updateMarca = (marca: Marca) => {
    typeActionRef.current = "mutate_update_marca"
    const options: FetchOptions = {
      method: "PUT",
      url: apiURL + "marcas/update_marca",
      body: JSON.stringify(marca),
      authorization: "Bearer " + token,
    }
    mutate(options)
  }
  const setStateMarca = (data: {estado: number, id: number}) => {
    typeActionRef.current = "mutate_state_marca"
    const options: FetchOptions = {
      method: "PUT",
      url: apiURL + "marcas/set_state_marca",
      body: JSON.stringify(data),
      authorization: "Bearer " + token,
    }
    mutate(options)
  }
  const deleteMarca = (id: number) => {
    typeActionRef.current = "mutate_delete_marca"
    const options: FetchOptions = {
      method: "DELETE",
      url: apiURL + "marcas/delete_marca",
      body: JSON.stringify({id}),
      authorization: "Bearer " + token,
    }
    mutate(options)
  }

  useEffect(()=>{
    if(!data) return
    if((data as ApiResp).errorType === "errorToken"){
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
    setStateMarca,
    deleteMarca,
    typeAction: typeActionRef.current,
  }
}
