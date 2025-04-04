import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import useSessionStore from "../store/useSessionStore"
import { useEffect } from "react"
import { Catalogos } from "../types"
import { obtenerCatalogosFetch } from "../services/catalogosFetch"
import useCatalogosStore from "../store/useCatalogosStore"
import { mutationFetch } from "../services/mutationFecth"
import { useNavigate } from "react-router-dom"
const beURL = import.meta.env.VITE_BE_URL;

type ObtenerProvincias = {departamento:string}
type ObtenerDistritos = {departamento: string, provincia: string}
// ****** GET CATALOGOS ******
export const useObtenerCatalogosQuery = () => {
  const tknSession = useSessionStore(state => state.tknSession)
  // const queryClient = useQueryClient()
  const setCatalogos = useCatalogosStore(state => state.setCatalogos)
  const {data, isLoading, isFetching, isError, refetch } = useQuery<Catalogos, Error>({
    queryKey: ["catalogos"],
    queryFn: ({signal}) => {
      return obtenerCatalogosFetch({token: tknSession, signal})
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
  const resetSessionStore = useSessionStore(state => state.resetSessionStore)
  const navigate = useNavigate()
  const tknSession = useSessionStore(state => state.tknSession)
  const nombreModulo = useSessionStore(state => state.moduloActual?.nombre)
  const Authorization = "Bearer " + tknSession
  const queryClient = useQueryClient()

  const {data, isPending, isError, mutate, } = useMutation({
    mutationFn: mutationFetch,
    onSuccess: (resp) => {
      if(resp.msgType !== 'success') return
      queryClient.invalidateQueries({queryKey:["catalogos"]})
    }
  })

  const obtenerProvincias = ({departamento}:ObtenerProvincias) => {
    const params = {
      url: beURL + "api/catalogos/obtener_provincias",
      method: "POST",
      headers:{ 
        Authorization,
        'nombre-modulo': nombreModulo,
      },
      body: JSON.stringify({departamento}),
    }
    mutate(params)
  }
  const obtenerDistritos = ({departamento, provincia}: ObtenerDistritos) => {
    const params = {
      url: beURL + "api/catalogos/obtener_distritos",
      method: "POST",
      headers:{ 
        Authorization,
        'nombre-modulo': nombreModulo,
      },
      body: JSON.stringify({departamento, provincia}),
    }
    mutate(params)
  }

  useEffect(()=>{
    if(data?.msgType === "errorToken"){
      resetSessionStore()
      navigate("/auth")
    }
  },[data])
  
  return {
    data, 
    isPending, 
    isError,
    obtenerProvincias,
    obtenerDistritos,
  }
}


