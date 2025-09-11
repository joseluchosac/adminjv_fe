const basename = import.meta.env.VITE_BASENAME;
import { useNavigate } from "react-router-dom"
import { useMutationCatalogosQuery } from "../../api/queries/useCatalogosQuery"
import { useEffect, useState } from "react"
import { TipoComprobanteSchema } from "../../app/schemas/catalogos-schema"
import z from "zod"
import { toast } from "react-toastify"
import { ApiResp } from "../../app/types"

type TipoComprobante = z.infer<typeof TipoComprobanteSchema>
const tipoComprobanteFormInit: TipoComprobante = {
  id: 0,
  codigo: "",
  descripcion: "",
  serie_pre: "",
  descripcion_doc: "",
  estado: 1,
}

export default function Edit({id}:{id: string | null}) {
  const [tipoComprobanteForm, setTipoComprobanteForm] = useState<TipoComprobante>(tipoComprobanteFormInit)
  const navigate = useNavigate()

  const{
    data: getTipoComprobanteResp,
    isPending,
    getTipoComprobante,
    abortController
  } = useMutationCatalogosQuery()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {name, value} = e.target
    setTipoComprobanteForm({...tipoComprobanteForm, [name]: value})
  }

  useEffect(() => {
    return () => abortController?.abort();
  }, []);

  useEffect(() => {
    if(id){
      if(+id){
        getTipoComprobante(+id)
      }else{
        setTipoComprobanteForm(tipoComprobanteFormInit)
      }
    }else{
      setTipoComprobanteForm(tipoComprobanteFormInit)
      abortController?.abort()
    }
  }, [id]);

  useEffect(() => {
    if(!getTipoComprobanteResp) return
    if('error' in getTipoComprobanteResp && getTipoComprobanteResp.error){
      toast.error((getTipoComprobanteResp as ApiResp).msg)
      navigate(location.pathname)
    }else{
      setTipoComprobanteForm(getTipoComprobanteResp)
    }
  }, [getTipoComprobanteResp]);

  if (id){
    return (
      <div>
        <h3>EDITAR</h3>
        <button onClick={() => {
          navigate(location.pathname.replace(basename,""))
        }}>Lista</button>
        <div>Editando {id}</div>
        <form>
          <div>
            <label htmlFor="codigo">Codigo</label>
            <input 
              type="text" 
              name="codigo" 
              id="codigo"
              value={tipoComprobanteForm.codigo}
              onChange={handleChange}
            />
          </div>
          <div>
            <label htmlFor="descripcion">Descripcion</label>
            <input 
              type="text" 
              name="descripcion" 
              id="descripcion"
              value={tipoComprobanteForm.descripcion}
              onChange={handleChange}
            />
          </div>
          <div>
            <label htmlFor="serie_pre">Serie pre</label>
            <input 
              type="text" 
              name="serie_pre" 
              id="serie_pre"
              value={tipoComprobanteForm.serie_pre}
              onChange={handleChange}
            />
          </div>
          <div>
            <label htmlFor="descripcion_doc">Descripcion_doc</label>
            <input 
              type="text" 
              name="descripcion_doc" 
              id="descripcion_doc"
              value={tipoComprobanteForm.descripcion_doc}
              onChange={handleChange}
            />
          </div>
        </form>
        {isPending && <div>Cargando...</div>}
      </div>
    )
  }
}
