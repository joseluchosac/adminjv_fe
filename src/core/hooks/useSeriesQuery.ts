const apiURL = import.meta.env.VITE_API_URL;
import { useEffect, useRef } from "react"
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query"
import useSessionStore from "../store/useSessionStore"
// import useSucursalesStore from "../store/useSucursalesStore";
import { mutationFetch } from "../services/mutationFecth"
import { SerieSucursal } from "../types/catalogosTypes";

type TypeAction = "filter_full" | "mutate_serie_sucursal" | "delete_serie_sucursal"

// ****** MUTATION ******
export const useMutationSeriesQuery = () => {
  const resetSessionStore = useSessionStore(state => state.resetSessionStore)
  const navigate = useNavigate()
  const tknSession = useSessionStore(state => state.tknSession)
  const nombreModulo = useSessionStore(state => state.moduloActual?.nombre)
  const Authorization = "Bearer " + tknSession
  // const queryClient = useQueryClient()
  const typeActionRef = useRef<TypeAction | "">("")

  const {data, isPending, isError, mutate, } = useMutation({
    mutationFn: mutationFetch,
    onSuccess: (resp) => {
      if(resp.msgType !== 'success') return
      // queryClient.invalidateQueries({queryKey:["sucursales"]}) // Recarga la tabla sucursales
    }
  })

  const getSeriesSucursal = (establecimiento_id: number) => {
    const params = {
      url: apiURL + "series/get_series_establecimiento",
      method: "POST",
      headers:{ 
        Authorization,
        'nombre-modulo': nombreModulo,
      },
      body: JSON.stringify({establecimiento_id}),
    }
    mutate(params)
  }

  const getSerieSucursal = (id: number) => {
    const params = {
      url: apiURL + "series/get_serie_establecimiento",
      method: "POST",
      headers:{ 
        Authorization,
        'nombre-modulo': nombreModulo,
      },
      body: JSON.stringify({id}),
    }
    mutate(params)
  }

  const createSerieSucursal = (serieSucursal: SerieSucursal) => {
    typeActionRef.current = "mutate_serie_sucursal"
    const params = {
      url: apiURL + "series/create_serie_establecimiento",
      method: "POST",
      headers:{ 
        Authorization,
        'nombre-modulo': nombreModulo,
      },
      body: JSON.stringify(serieSucursal),
    }
    mutate(params)
  }

  const updateSerieSucursal = (serieSucursal: SerieSucursal) => {
    typeActionRef.current = "mutate_serie_sucursal"
    const params = {
      url: apiURL + "series/update_serie_establecimiento",
      method: "PUT",
      headers:{ 
        Authorization,
        'nombre-modulo': nombreModulo,
      },
      body: JSON.stringify(serieSucursal),
    }
    mutate(params)
  }
  const deleteSerieSucursal = (id: number) => {
    typeActionRef.current = "delete_serie_sucursal"
    const params = {
      url: apiURL + "series/delete_serie_establecimiento",
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
    if(data?.msgType === "errorToken"){
      resetSessionStore()
      navigate("/auth")
    }
  },[data])

  return {
    data, 
    isPending, 
    isError,
    getSeriesSucursal,
    getSerieSucursal,
    createSerieSucursal,
    updateSerieSucursal,
    deleteSerieSucursal,
    typeAction: typeActionRef.current,
  }
}
