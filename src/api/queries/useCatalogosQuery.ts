const apiURL = import.meta.env.VITE_API_URL
import { useMutation, useQuery } from "@tanstack/react-query"
import useSessionStore from "../../app/store/useSessionStore"
import { useEffect, useRef } from "react"
import { useNavigate } from "react-router-dom"
import { Caja, Categoria, FetchOptions, FormaPago, Impuesto, MotivoNota, QueryResp, TipoComprobante, TipoDocumento, TipoMoneda, TipoMovimiento, TipoMovimientoCaja, TipoOperacion, UnidadMedida } from "../../app/types"
import { fnFetch } from "../fnFetch"


// ****** CAJAS ******
export type CajasRes = Caja[] | QueryResp
export function isCajasRes(response: CajasRes): response is Caja[] {
  return ('error' in response || (response as QueryResp).error == true);
}
export const useCajasQuery = () => {
  const tknSession = useSessionStore(state => state.tknSession)
  const {data, isFetching} = useQuery<CajasRes>({
    queryKey: ['cajas'],
    queryFn: () => {
      const options: FetchOptions = {
        url: apiURL + "catalogos/get_cajas",
        authorization: "Bearer " + tknSession
      }
      return fnFetch(options)
    },
    staleTime: 1000 * 60 * 60 * 24
  })

  return {
    cajas: data,
    isFetching
  }
}
// ****** CATEGORIAS TREE ******
type DataCategoriasTree = {content: Categoria[]}
export const useCategoriasTreeQuery = () => {
  const tknSession = useSessionStore(state => state.tknSession)
  const {data, isFetching} = useQuery<DataCategoriasTree>({
    queryKey: ['categorias_tree'],
    queryFn: () => {
      const options: FetchOptions = {
        url: apiURL + "catalogos/get_categorias_tree",
        authorization: "Bearer " + tknSession
      }
      return fnFetch(options)
    },
    staleTime: 1000 * 60 * 60 * 24
  })

  return {
    categoriasTree: data?.content,
    isFetching
  }
}

// ****** UNIDADES MEDIDA ******
type DataUnidadesMedida = {content: UnidadMedida[]}
export const useUnidadesMedidaQuery = () => {
  const tknSession = useSessionStore(state => state.tknSession)
  const {data, isFetching} = useQuery<DataUnidadesMedida>({
    queryKey: ['unidades_medida'],
    queryFn: () => {
      const options: FetchOptions = {
        url: apiURL + "catalogos/get_unidades_medida",
        authorization: "Bearer " + tknSession
      }
      return fnFetch(options)
    },
    staleTime: 1000 * 60 * 60 * 24
  })

  return {
    unidadesMedida: data?.content,
    isFetching
  }
}

// ****** IMPUESTOS ******
type DataImpuestosMedida = {content: Impuesto[]}
export const useImpuestosQuery = () => {
  const tknSession = useSessionStore(state => state.tknSession)
  const {data, isFetching} = useQuery<DataImpuestosMedida>({
    queryKey: ['impuestos'],
    queryFn: () => {
      const options: FetchOptions = {
        url: apiURL + "catalogos/get_impuestos",
        authorization: "Bearer " + tknSession
      }
      return fnFetch(options)
    },
    staleTime: 1000 * 60 * 60 * 24
  })

  return {
    impuestos: data?.content,
    isFetching
  }
}

// ****** MOTIVOS NOTA ******
type DataMotivosNotaMedida = {content: MotivoNota[]}
export const useMotivosNotaQuery = () => {
  const tknSession = useSessionStore(state => state.tknSession)
  const {data, isFetching} = useQuery<DataMotivosNotaMedida>({
    queryKey: ['motivos_nota'],
    queryFn: () => {
      const options: FetchOptions = {
        url: apiURL + "catalogos/get_motivos_nota",
        authorization: "Bearer " + tknSession
      }
      return fnFetch(options)
    },
    staleTime: 1000 * 60 * 60 * 24
  })

  return {
    motivosNota: data?.content,
    isFetching
  }
}
// ****** TIPOS DOCUMENTO ******
type DataTiposDocumento = {content: TipoDocumento[]}
export const useTiposDocumentoQuery = () => {
  const tknSession = useSessionStore(state => state.tknSession)
  const {data, isFetching} = useQuery<DataTiposDocumento>({
    queryKey: ['tipos_documento'],
    queryFn: () => {
      const options: FetchOptions = {
        url: apiURL + "catalogos/get_tipos_documento",
        authorization: "Bearer " + tknSession
      }
      return fnFetch(options)
    },
    staleTime: 1000 * 60 * 60 * 24
  })

  return {
    tiposDocumento: data?.content,
    isFetching
  }
}
// ****** TIPOS COMPROBANTE ******
type DataTiposComprobante = {content: TipoComprobante[]}
export const useTiposComprobanteQuery = () => {
  const tknSession = useSessionStore(state => state.tknSession)
  const {data, isFetching} = useQuery<DataTiposComprobante>({
    queryKey: ['tipos_comprobante'],
    queryFn: () => {
      const options: FetchOptions = {
        url: apiURL + "catalogos/get_tipos_comprobante",
        authorization: "Bearer " + tknSession
      }
      return fnFetch(options)
    },
    staleTime: 1000 * 60 * 60 * 24
  })

  return {
    tiposComprobante: data?.content,
    isFetching
  }
}
// ****** TIPOS MOVIMIENTO CAJA ******
type DataTiposMovimientoCaja = {content: TipoMovimientoCaja[]}
export const useTiposMovimientoCajaQuery = () => {
  const tknSession = useSessionStore(state => state.tknSession)
  const {data, isFetching} = useQuery<DataTiposMovimientoCaja>({
    queryKey: ['tipos_movimiento_caja'],
    queryFn: () => {
      const options: FetchOptions = {
        url: apiURL + "catalogos/get_tipos_movimiento_caja",
        authorization: "Bearer " + tknSession
      }
      return fnFetch(options)
    },
    staleTime: 1000 * 60 * 60 * 24
  })

  return {
    tiposMovimientoCaja: data?.content,
    isFetching
  }
}
// ****** TIPOS MOVIMIENTO ******
type DataTiposMovimiento = {content: TipoMovimiento[]}
export const useTiposMovimientoQuery = () => {
  const tknSession = useSessionStore(state => state.tknSession)
  const {data, isFetching} = useQuery<DataTiposMovimiento>({
    queryKey: ['tipos_movimiento'],
    queryFn: () => {
      const options: FetchOptions = {
        url: apiURL + "catalogos/get_tipos_movimiento",
        authorization: "Bearer " + tknSession
      }
      return fnFetch(options)
    },
    staleTime: 1000 * 60 * 60 * 24
  })

  return {
    tiposMovimiento: data?.content,
    isFetching
  }
}
// ****** TIPOS OPERACION ******
type DataTiposOperacion = {content: TipoOperacion[]}
export const useTiposOperacionQuery = () => {
  const tknSession = useSessionStore(state => state.tknSession)
  const {data, isFetching} = useQuery<DataTiposOperacion>({
    queryKey: ['tipos_operacion'],
    queryFn: () => {
      const options: FetchOptions = {
        url: apiURL + "catalogos/get_tipos_operacion",
        authorization: "Bearer " + tknSession
      }
      return fnFetch(options)
    },
    staleTime: 1000 * 60 * 60 * 24
  })

  return {
    tiposOperacion: data?.content,
    isFetching
  }
}
// ****** TIPOS MONEDA ******
type DataTiposMoneda = {content: TipoMoneda[]}
export const useTiposMonedaQuery = () => {
  const tknSession = useSessionStore(state => state.tknSession)
  const {data, isFetching} = useQuery<DataTiposMoneda>({
    queryKey: ['tipos_moneda'],
    queryFn: () => {
      const options: FetchOptions = {
        url: apiURL + "catalogos/get_tipos_moneda",
        authorization: "Bearer " + tknSession
      }
      return fnFetch(options)
    },
    staleTime: 1000 * 60 * 60 * 24
  })

  return {
    tiposMoneda: data?.content,
    isFetching
  }
}
// ****** TIPOS ESTABLECIMIENTO ******
type DataTiposEstablecimiento = {content: string[]}
export const useTiposEstablecimientoQuery = () => {
  const tknSession = useSessionStore(state => state.tknSession)
  const {data, isFetching} = useQuery<DataTiposEstablecimiento>({
    queryKey: ['tipos_establecimiento'],
    queryFn: () => {
      const options: FetchOptions = {
        url: apiURL + "catalogos/get_tipos_establecimiento",
        authorization: "Bearer " + tknSession
      }
      return fnFetch(options)
    },
    staleTime: 1000 * 60 * 60 * 24
  })

  return {
    tiposEstablecimiento: data?.content,
    isFetching
  }
}
// ****** FORMAS PAGO ******
type DataFormasPago = {content: FormaPago[]}
export const useFormasPagoQuery = () => {
  const tknSession = useSessionStore(state => state.tknSession)
  const {data, isFetching} = useQuery<DataFormasPago>({
    queryKey: ['formas_pago'],
    queryFn: () => {
      const options: FetchOptions = {
        url: apiURL + "catalogos/get_formas_pago",
        authorization: "Bearer " + tknSession
      }
      return fnFetch(options)
    },
    staleTime: 1000 * 60 * 60 * 24
  })

  return {
    formasPago: data?.content,
    isFetching
  }
}


// ****** MUTATION CATALOGOS ******
export const useMutationCatalogosQuery = () => {
  const fnName = useRef("")
  const resetSessionStore = useSessionStore(state => state.resetSessionStore)
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

  const createTipoComprobante = (param: TipoComprobante) => {
    fnName.current = createTipoComprobante.name
    const options: FetchOptions = {
      method: "POST",
      url: apiURL + "catalogos/create_tipo_comprobante",
      body: JSON.stringify(param),
      authorization: "Bearer " + token,
    }
    mutate(options)
  }
  
  const updateTipoComprobante = (param: TipoComprobante) => {
    fnName.current = updateTipoComprobante.name
    const options: FetchOptions = {
      method: "PUT",
      url: apiURL + "catalogos/update_tipo_comprobante",
      body: JSON.stringify(param),
      authorization: "Bearer " + token,
    }
    mutate(options)
  }

  const deleteTipoComprobante = (id: number) => {
    fnName.current = deleteTipoComprobante.name
    const options: FetchOptions = {
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
  },[data])
  
  return {
    data, 
    isPending, 
    isError,
    createTipoComprobante,
    updateTipoComprobante,
    deleteTipoComprobante,
  }
}


