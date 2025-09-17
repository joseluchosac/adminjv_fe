import { useLocation, useNavigate } from "react-router-dom"
import { useMutationCatalogosQuery } from "../../api/queries/useCatalogosQuery"
import { useEffect, useMemo, useState } from "react"
import { TipoComprobanteSchema } from "../../app/schemas/catalogos-schema"
import z from "zod"
import { toast } from "react-toastify"
import { ApiResp } from "../../app/types"

type TipoComprobante = z.infer<typeof TipoComprobanteSchema>
const tipoComprobanteInit: TipoComprobante = {
  id: 0,
  codigo: "",
  descripcion: "",
  serie_pre: "",
  descripcion_doc: "",
  estado: 1,
}

export default function View() {
  const [tipoComprobante, setTipoComprobante] = useState<TipoComprobante>(tipoComprobanteInit)
  const navigate = useNavigate()
  const location = useLocation()

  const{
    data: getTipoComprobanteResp,
    isPending,
    getTipoComprobante,
    abortController
  } = useMutationCatalogosQuery()

  const id = useMemo(() => {
    const params = new URLSearchParams(location.search)
    return params.get('view')
  }, [location])

  useEffect(() => {
    return () => abortController?.abort();
  }, []);

  useEffect(() => {
    if(id){
      if(+id){
        getTipoComprobante(+id)
      }else{
        setTipoComprobante(tipoComprobanteInit)
      }
    }else{
      setTipoComprobante(tipoComprobanteInit)
      abortController?.abort()
    }
  }, [id]);

  useEffect(() => {
    if(!getTipoComprobanteResp) return
    if('error' in getTipoComprobanteResp && getTipoComprobanteResp.error){
      toast.error((getTipoComprobanteResp as ApiResp).msg)
      navigate(location.pathname)
    }else{
      setTipoComprobante(getTipoComprobanteResp)
    }
  }, [getTipoComprobanteResp]);

  if (id){
    return (
      <div>
        <h3>VER</h3>
        <button onClick={() => navigate(location.pathname)}>Lista</button>
        <div>Viendo {id}</div>
        <ul>
          <li>{tipoComprobante.codigo}</li>
          <li>{tipoComprobante.descripcion}</li>
          <li>{tipoComprobante.descripcion_doc}</li>
          <li>{tipoComprobante.estado}</li>
          <li>{tipoComprobante.id}</li>
        </ul>
        {isPending && <div>Cargando...</div>}
      </div>
    )
  }
}
