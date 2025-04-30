import { useMutation, useQuery } from "@tanstack/react-query"
import useSessionStore from "../store/useSessionStore"
import { useEffect, useRef } from "react"
import { getCatalogosFetch } from "../services/catalogosFetch"
import useCatalogosStore from "../store/useCatalogosStore"
import { mutationFetch } from "../services/mutationFecth"
import { useNavigate } from "react-router-dom"
import { Catalogos, TipoComprobante } from "../types/catalogosTypes"
const apiURL = import.meta.env.VITE_BE_URL + "api/"

type GetProvincias = {departamento:string}
type GetDistritos = {departamento: string, provincia: string}


// ****** GET CATALOGOS ******
export const useGetCatalogosQuery = () => {
  const tknSession = useSessionStore(state => state.tknSession)
  // const queryClient = useQueryClient()
  const setCatalogos = useCatalogosStore(state => state.setCatalogos)
  const {data, isLoading, isFetching, isError, refetch } = useQuery<Catalogos, Error>({
    queryKey: ["catalogos"],
    queryFn: ({signal}) => {
      return getCatalogosFetch({token: tknSession, signal})
    },
    staleTime: 1000 * 60 * 60,
    // refetchOnMount: false,
    // refetchOnWindowFocus: false,
    // refetchOnReconnect: false,
  })

  useEffect(() => {
    return () => {
      // queryClient.cancelQueries({ queryKey: ['catalogos'] })
      // queryClient.resetQueries<any>({ queryKey: ['catalogos'], exact: true });
    }
  },[])

  useEffect(() => {
    if(data){
      setCatalogos(data)
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
  const tknSession = useSessionStore(state => state.tknSession)
  const nombreModulo = useSessionStore(state => state.moduloActual?.nombre)
  const Authorization = "Bearer " + tknSession
  // const queryClient = useQueryClient()

  const {data, isPending, isError, mutate, } = useMutation({
    mutationFn: mutationFetch,
    onSuccess: (resp) => {
      if(resp.msgType !== 'success') return
      // queryClient.invalidateQueries({queryKey:["catalogos"]})
    }
  })

  const getProvincias = ({departamento}:GetProvincias) => {
    fnName.current = getProvincias.name
    const params = {
      url: apiURL + 'catalogos/get_provincias',
      method: "POST",
      headers:{ 
        Authorization,
        'nombre-modulo': nombreModulo,
      },
      body: JSON.stringify({departamento}),
    }
    mutate(params)
  }

  const getDistritos = ({departamento, provincia}: GetDistritos) => {
    fnName.current = getDistritos.name
    const params = {
      url: apiURL + 'catalogos/get_distritos',
      method: "POST",
      headers:{ 
        Authorization,
        'nombre-modulo': nombreModulo,
      },
      body: JSON.stringify({departamento, provincia}),
    }
    mutate(params)
  }

  const createTipoComprobante = (param: TipoComprobante) => {
    fnName.current = createTipoComprobante.name
    const params = {
      url: apiURL + 'catalogos/create_tipo_comprobante',
      method: "POST",
      headers:{ 
        Authorization,
        'nombre-modulo': nombreModulo,
      },
      body: JSON.stringify(param),
    }
    mutate(params)
  }
  
  const updateTipoComprobante = (param: TipoComprobante) => {
    fnName.current = updateTipoComprobante.name
    const params = {
      url: apiURL + 'catalogos/update_tipo_comprobante',
      method: "PUT",
      headers:{ 
        Authorization,
        'nombre-modulo': nombreModulo,
      },
      body: JSON.stringify(param),
    }
    mutate(params)
  }

  const deleteTipoComprobante = (id: number) => {
    fnName.current = deleteTipoComprobante.name
    const params = {
      url: apiURL + 'catalogos/delete_tipo_comprobante',
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
    if(!data) return
    if(data?.msgType === "errorToken"){
      resetSessionStore()
      navigate("/auth")
    }
    if(data.error) return
    // Actualizando el store
    switch (fnName.current) {
      case "createTipoComprobante":
      case "updateTipoComprobante":{
        const tipos_comprobante = data.registro as TipoComprobante[]
        if(catalogos) setCatalogos({...catalogos, tipos_comprobante})
        break;
      }
      case "deleteTipoComprobante":{
        const id = data.id as number
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
    getProvincias,
    getDistritos,
  }
}


