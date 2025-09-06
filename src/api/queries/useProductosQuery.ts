const apiURL = import.meta.env.VITE_API_URL;
import { useEffect, useRef } from "react"
import { useNavigate } from "react-router-dom";
import { InfiniteData, useInfiniteQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import useSessionStore from "../../app/store/useSessionStore"
import { FetchOptions, Producto, ApiResp, FilterQueryResp, ProductoItem } from "../../app/types"
import { fnFetch } from "../fnFetch";
import useProductosStore from "../../app/store/useProductosStore";
import { useDebounce } from "react-use";
import { toast } from "react-toastify";

type TypeAction = "CREATE_PRODUCTO"
  | "UPDATE_PRODUCTO"
  | "DELETE_PRODUCTO"

// ****** FILTRAR ******
interface ProductosFilQryRes extends FilterQueryResp {
  filas: ProductoItem[];
}
export const useProductosFilterQuery = () => {
  const {
    productoFilterForm,
    productoFilterParam,
    setProductoFilterParam,
    setProductoFilterParamBetween,
    setProductoFilterInfo
  } = useProductosStore()
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
  } = useInfiniteQuery<ProductosFilQryRes, Error>({
    queryKey: ['productos'],
    queryFn: ({pageParam = 1, signal}) => {
      const page = pageParam as number
      const options: FetchOptions = {
        method: "POST",
        url: `${apiURL}productos/filter_productos?page=${page}`,
        body: JSON.stringify(productoFilterParam),
        authorization: "Bearer " + token,
        // attachedData: JSON.stringify({curEstab}),
        signal,
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
    queryClient.resetQueries({ queryKey: ['productos'], exact: true });
  }

  useDebounce(() => {
    if (
        productoFilterForm.search.toLowerCase().trim() ==
        productoFilterParam.search.toLowerCase().trim()
    ) return;
    setProductoFilterParam()
  }, 500, [productoFilterForm.search]);

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
    setProductoFilterParam()
  }, [productoFilterForm.order, productoFilterForm.equal])

  useEffect(() => {
      setProductoFilterParamBetween()
    }, [productoFilterForm.between])
  
    useEffect(() => {
      queryClient.invalidateQueries({queryKey:["productos"]})
    }, [productoFilterParam])
  
    useEffect(()=>{
      if(!data) return
      if(data?.pages[0].error || isError){
        toast.error("Error al obtener registros")
        return
      }
      if(!isFetching){
        setProductoFilterInfo()
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
export type MutationProductoRes = ApiResp & {
  producto?: ProductoItem
};
export const useMutationProductosQuery = <T>() => {
  const resetSessionStore = useSessionStore(state => state.resetSessionStore)
  const navigate = useNavigate()
  const token = useSessionStore(state => state.tknSession)
  // const curModulo = useSessionStore(state => state.moduloActual?.nombre)
  // const curEstab = useSessionStore(state => state.curEstab)
  const queryClient = useQueryClient()
  const typeActionRef = useRef<TypeAction | "">("")

  const {data, isPending, isError, mutate, } = useMutation<T, Error, FetchOptions, unknown>({
    mutationFn: fnFetch,
    onSuccess: (resp) => {
      const r = resp as MutationProductoRes
      if(r.msgType !== 'success') return
      if(typeActionRef.current === "CREATE_PRODUCTO") {
        const createdProducto = r.producto as ProductoItem
        queryClient.setQueryData(["productos"], (oldData: InfiniteData<ProductosFilQryRes, unknown> | undefined) => {
          const pages = structuredClone(oldData?.pages)
          if((pages?.length || 0) < 4){ // hacer refetch si se cumple esta condicion
            queryClient.invalidateQueries({queryKey:["productos"]})
            return oldData
          }
          if(pages && pages.length > 0){
            pages[0].filas.unshift(createdProducto as ProductoItem) // Agrega el nuevo registro al inicio de la primera página
            pages[0].num_regs = pages[0].num_regs + 1
          }
          return {...oldData, pages, }
        })
      }else if(typeActionRef.current === "UPDATE_PRODUCTO") {
        const updatedProducto = r.producto as ProductoItem
        queryClient.setQueryData(["productos"], (oldData: InfiniteData<ProductosFilQryRes, unknown> | undefined) => {
          const pages = structuredClone(oldData?.pages)
          if((pages?.length || 0) < 4){
            queryClient.invalidateQueries({queryKey:["productos"]})
            return oldData
          }
          for(let idxPage in pages){
            const idxFila = pages[parseInt(idxPage)].filas.findIndex((el: ProductoItem)=>el.id === updatedProducto.id)
            if(idxFila !== -1){
              pages[parseInt(idxPage)].filas[idxFila] = updatedProducto // Actualiza el registro en la lista
              break
            }
          }
          return {...oldData, pages}
        })
      }else if(typeActionRef.current === "DELETE_PRODUCTO") {
        const deletedProductoId = r.content as ProductoItem["id"]
        queryClient.setQueryData(["productos"], (oldData: InfiniteData<ProductosFilQryRes, unknown> | undefined) => {
          let pages = structuredClone(oldData?.pages)
          if((pages?.length || 0) < 4){
            queryClient.invalidateQueries({queryKey:["productos"]})
            return oldData
          }
          for(let idxPage in pages){
            const idxFila = pages[parseInt(idxPage)].filas.findIndex((el: ProductoItem)=>el.id === deletedProductoId)
            if(idxFila !== -1){
              let filasFiltradas = pages[parseInt(idxPage)].filas.filter(el => el.id !== deletedProductoId) // Elimina el usuario de la fila
              pages[parseInt(idxPage)].filas = filasFiltradas
              pages[0].num_regs = pages[0].num_regs - 1
              break
            }
          }
          return {...oldData, pages}
        })
      } 



      queryClient.invalidateQueries({queryKey:["productos"]}) // Recarga la tabla productos
    }
  })

  const getProducto = (id: number) => {
    const options: FetchOptions = {
      method: "POST",
      url: apiURL + "productos/get_producto",
      body: JSON.stringify({id}),
      authorization: "Bearer " + token,
      // attachedData: JSON.stringify({curEstab, curModulo})
    }
    mutate(options)
  }

  const getProductoByCode = (codigo: string, establecimiento_id: number) => {
    const options: FetchOptions = {
      method: "POST",
      url: apiURL + "productos/get_producto_by_code",
      body: JSON.stringify({codigo, establecimiento_id}),
      authorization: "Bearer " + token,
    }
    mutate(options)
  }

  const createProducto = (producto: Producto) => {
    const options: FetchOptions = {
      method: "POST",
      url: apiURL + "productos/create_producto",
      body: JSON.stringify(producto),
      authorization: "Bearer " + token,
    }
    mutate(options)
  }

  const updateProducto = (producto: Producto) => {
    const options: FetchOptions = {
      method: "PUT",
      url: apiURL + "productos/update_producto",
      body: JSON.stringify(producto),
      authorization: "Bearer " + token,
    }
    mutate(options)
  }

  const setStateProducto = (estado: {id:number; estado:number}) => {
    const options: FetchOptions = {
      method: "PUT",
      url: apiURL + "productos/update_estado",
      body: JSON.stringify(estado),
      authorization: "Bearer " + token,
    }
    mutate(options)
  }


  const deleteProducto = (id: number) => {
    const options: FetchOptions = {
      method: "DELETE",
      url: apiURL + "productos/delete_producto",
      body: JSON.stringify({id}),
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
    getProducto,
    getProductoByCode,
    createProducto,
    updateProducto,
    setStateProducto,
    deleteProducto,
  }
}


