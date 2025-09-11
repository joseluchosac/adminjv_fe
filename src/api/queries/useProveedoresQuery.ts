const apiURL = import.meta.env.VITE_API_URL;
import { useInfiniteQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import useSessionStore from "../../app/store/useSessionStore"
import { useEffect, useRef } from "react"
import { useNavigate } from "react-router-dom";
import { FetchOptions, Proveedor, ApiResp, ProveedoresFilQryRes } from "../../app/types";
import { fnFetch } from "../fnFetch";
import useProveedoresStore from "../../app/store/useProveedoresStore";
import { useDebounce } from "react-use";
import { toast } from "react-toastify";

type TypeAction = "CREATE_PROVEEDOR" 
| "UPDATE_PROVEEDOR"
| "DELETE_PROVEEDOR"
| "QUERY_DOCUMENT"

// ****** FILTRAR ******
export const useProveedoresFilterQuery = () => {
  const token = useSessionStore(state => state.tknSession)
  // const isFirstRender = useRef(true);
  const queryClient = useQueryClient()
  const {
    proveedorFilterForm,
    proveedorFilterParam,
    setProveedorFilterParam,
    setProveedorFilterParamBetween,
    setProveedorFilterInfo
  } = useProveedoresStore()

  const {
    data,
    isError,
    isLoading,
    isFetching,
    hasNextPage,
    fetchNextPage,
  } = useInfiniteQuery<ProveedoresFilQryRes, Error>({
    queryKey: ['proveedores'],
    queryFn: ({pageParam = 1, signal}) => {
      const page = pageParam as number
      const options: FetchOptions = {
        method: "POST",
        url: `${apiURL}proveedores/filter_proveedores?page=${page}`,
        body: JSON.stringify(proveedorFilterParam),
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
  //   queryClient.resetQueries({ queryKey: ['proveedores'], exact: true });
  // }

  useDebounce(() => {
    if (
        proveedorFilterForm.search.toLowerCase().trim() ==
        proveedorFilterParam.search.toLowerCase().trim()
    ) return;
    setProveedorFilterParam()
  }, 500, [proveedorFilterForm.search]);

  useEffect(() => {
    setProveedorFilterParam()
  }, [proveedorFilterForm.order, proveedorFilterForm.equal])

  useEffect(() => {
    setProveedorFilterParamBetween()
  }, [proveedorFilterForm.between])

  useEffect(() => {
    // if (isFirstRender.current) {
    //   isFirstRender.current = false;
    //   return; // Evita ejecutar en el primer render
    // }
    queryClient.invalidateQueries({queryKey:["proveedores"]})
  }, [proveedorFilterParam])

  useEffect(()=>{
    if(!data) return
    if(data?.pages[0].error || isError){
      toast.error("Error al obtener registros")
      return
    }
    if(!isFetching){
      setProveedorFilterInfo()
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
export const useMutationProveedoresQuery = <T>() => {
  const resetSessionStore = useSessionStore(state => state.resetSessionStore)
  const navigate = useNavigate()
  const token = useSessionStore(state => state.tknSession)
  const queryClient = useQueryClient()
  const typeActionRef = useRef<TypeAction | "">("")

  const {data, isPending, isError, mutate, reset } = useMutation<T, Error, FetchOptions, unknown>({
    mutationFn: fnFetch,
    onSuccess: (resp) => {
      const r = resp as ApiResp
      if(r?.msgType !== 'success') return
      queryClient.invalidateQueries({queryKey:["proveedores"]}) // Recarga la tabla proveedores
    }
  })

  const getProveedor = (id: number) => {
    const options: FetchOptions = {
      method: "POST",
      url: apiURL + "proveedores/get_proveedor",
      body: JSON.stringify({id}),
      authorization: "Bearer " + token,
    }
    mutate(options)
  }

  const createProveedor = (proveedor: Proveedor) => {
    typeActionRef.current = "CREATE_PROVEEDOR"
    const options: FetchOptions = {
      method: "POST",
      url: apiURL + "proveedores/create_proveedor",
      body: JSON.stringify(proveedor),
      authorization: "Bearer " + token,
    }
    mutate(options)
  }

  const updateProveedor = (proveedor: Proveedor) => {
    typeActionRef.current = "UPDATE_PROVEEDOR"
    const options: FetchOptions = {
      method: "PUT",
      url: apiURL + "proveedores/update_proveedor",
      body: JSON.stringify(proveedor),
      authorization: "Bearer " + token,
    }
    mutate(options)
  }

  const setStateProveedor = (estado: number) => {
    typeActionRef.current = "UPDATE_PROVEEDOR"
    const options: FetchOptions = {
      method: "PUT",
      url: apiURL + "proveedores/set_state_proveedor",
      body: JSON.stringify({estado}),
      authorization: "Bearer " + token,
    }
    mutate(options)
  }

  const deleteProveedor = (id: number) => {
    typeActionRef.current = "DELETE_PROVEEDOR"
    const options: FetchOptions = {
      method: "DELETE",
      url: apiURL + "proveedores/delete_proveedor",
      body: JSON.stringify({id}),
      authorization: "Bearer " + token,
    }
    mutate(options)
  }

  const queryDocument = (param: any) => {
    typeActionRef.current = "QUERY_DOCUMENT"
    const options: FetchOptions = {
      method: "POST",
      url: apiURL + "proveedores/query_document",
      body: JSON.stringify(param),
      authorization: "Bearer " + token,
    }
    mutate(options)
  }

  useEffect(()=>{
    const d = data as ApiResp
    if(d?.errorType === "errorToken"){
      resetSessionStore()
      navigate("/signin")
    }
  },[data])

  return {
    data, 
    isPending, 
    isError,
    getProveedor,
    createProveedor,
    updateProveedor,
    setStateProveedor,
    deleteProveedor,
    queryDocument,
    typeAction: typeActionRef.current,
    reset
  }
}


