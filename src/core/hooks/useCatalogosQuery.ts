const apiURL = import.meta.env.VITE_API_URL
import { useMutation, useQuery } from "@tanstack/react-query"
import useSessionStore from "../store/useSessionStore"
import { useEffect, useRef } from "react"
import useCatalogosStore from "../store/useCatalogosStore"
import { useNavigate } from "react-router-dom"
import { Caja, Catalogos, TipoComprobante } from "../types/catalogosTypes"
import { FnFetchOptions } from "../types"
import { fnFetch } from "../services/fnFetch"

// type GetProvincias = {departamento:string}
// type GetDistritos = {departamento: string, provincia: string}

type GetCatalogosFetch = {
  content: Catalogos | null;
  error?: boolean;
  msg?: string;
  msgType?: string;
}

type DataCajas = {content: Caja[]}
export const useCajasQuery = () => {
  const tknSession = useSessionStore(state => state.tknSession)
  const {data, isFetching} = useQuery<DataCajas>({
    queryKey: ['cajas'],
    queryFn: () => {
      const options: FnFetchOptions = {
        url: apiURL + "catalogos/get_cajas",
        authorization: "Bearer " + tknSession
      }
      return fnFetch(options)
    },
    staleTime: 1000 * 60 * 60 * 24
  })

  return {
    cajas: data?.content,
    isFetching
  }
}

// ****** GET CATALOGOS ******
export const useGetCatalogosQuery = () => {
  const tknSession = useSessionStore(state => state.tknSession)
  // const queryClient = useQueryClient()
  const setCatalogos = useCatalogosStore(state => state.setCatalogos)
  const {data, isLoading, isFetching, isError, refetch } = useQuery<GetCatalogosFetch, Error>({
    queryKey: ["catalogos"],
    queryFn: ({signal}) => {
      const options: FnFetchOptions = {
        method: "POST",
        url: apiURL + "catalogos/get_catalogos",
        authorization: "Bearer " + tknSession,
        signal
      }
      return fnFetch(options)
    },
    staleTime: 1000 * 60 * 60,
  })

  useEffect(() => {
    if(!data) return
    if(data.error){
      console.log(data.msg)
    }
    if(data.content){
      setCatalogos(data.content)
    }
  },[data])
  return {isLoading, isFetching, isError, refetch}
}

// ****** MUTATION CATALOGOS ******
export const useMutationCatalogosQuery = () => {
  const fnName = useRef("")
  const resetSessionStore = useSessionStore(state => state.resetSessionStore)
  const setCatalogos = useCatalogosStore(state => state.setCatalogos)
  const catalogos = useCatalogosStore(state => state.catalogos)
  const navigate = useNavigate()
  const token = useSessionStore(state => state.tknSession)

  const {data, isPending, isError, mutate, } = useMutation({
    mutationKey: ['mutation_catalogos'],
    mutationFn: fnFetch,
    onSuccess: (resp) => {
      if(resp.msgType !== 'success') return
      // queryClient.invalidateQueries({queryKey:["catalogos"]})
    }
  })

  // const getProvincias = ({departamento}:GetProvincias) => {
  //   fnName.current = getProvincias.name
  //   const options: FnFetchOptions = {
  //     method: "POST",
  //     url: apiURL + "catalogos/get_provincias",
  //     body: JSON.stringify({departamento}),
  //     authorization: "Bearer " + token,
  //   }
  //   mutate(options)
  // }

  // const getDistritos = ({departamento, provincia}: GetDistritos) => {
  //   fnName.current = getDistritos.name
  //   const options: FnFetchOptions = {
  //     method: "POST",
  //     url: apiURL + "catalogos/get_distritos",
  //     body: JSON.stringify({departamento, provincia}),
  //     authorization: "Bearer " + token,
  //   }
  //   mutate(options)
  // }

  const createTipoComprobante = (param: TipoComprobante) => {
    fnName.current = createTipoComprobante.name
    const options: FnFetchOptions = {
      method: "POST",
      url: apiURL + "catalogos/create_tipo_comprobante",
      body: JSON.stringify(param),
      authorization: "Bearer " + token,
    }
    mutate(options)
  }
  
  const updateTipoComprobante = (param: TipoComprobante) => {
    fnName.current = updateTipoComprobante.name
    const options: FnFetchOptions = {
      method: "PUT",
      url: apiURL + "catalogos/update_tipo_comprobante",
      body: JSON.stringify(param),
      authorization: "Bearer " + token,
    }
    mutate(options)
  }

  const deleteTipoComprobante = (id: number) => {
    fnName.current = deleteTipoComprobante.name
    const options: FnFetchOptions = {
      method: "DELETE",
      url: apiURL + "catalogos/delete_tipo_comprobante",
      body: JSON.stringify({id}),
      authorization: "Bearer " + token,
    }
    mutate(options)
  }

  useEffect(()=>{
    if(!data) return
    if(data?.errorType === "errorToken"){
      resetSessionStore()
      navigate("/auth")
    }
    if(data.error) return
    // Actualizando el store
    switch (fnName.current) {
      case "createTipoComprobante":
      case "updateTipoComprobante":{
        const tipos_comprobante = data.content as TipoComprobante[]
        if(catalogos) setCatalogos({...catalogos, tipos_comprobante})
        break;
      }
      case "deleteTipoComprobante":{
        const id = data.content.id as number
        const newtiposComprobante = catalogos?.tipos_comprobante.filter(el=>el.id !== id) as TipoComprobante[]
        if(catalogos) setCatalogos({...catalogos, tipos_comprobante: newtiposComprobante})
        break;
      }
      default:{
        console.log("funcion no comprobada")
        break
      }
    }
  },[data])
  
  return {
    data, 
    isPending, 
    isError,
    createTipoComprobante,
    updateTipoComprobante,
    deleteTipoComprobante,
    // getProvincias,
    // getDistritos,
  }
}


