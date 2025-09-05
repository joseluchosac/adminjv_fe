import { useEffect, useMemo, useState } from "react"
import { ApiResp, Modulo, Padre } from "../../../app/types"
import { getModulosTree } from "../../../app/utils/funciones"
import { useMutateModulosQuery } from "../../../api/queries/useModulosQuery"
import { moduloFormInit } from "../../../app/utils/constants"
import { ModulosSchema } from "../../../app/schemas/modulos-schema"

const useModulos = () => {
  const [modulosTree, setModulosTree] = useState<Modulo[] | null>(null)
  const [moduloForm, setModuloForm] = useState<Modulo>(moduloFormInit)
  const [padres, setPadres] = useState<Padre[] | null>(null)
  const {
    data: getModulosResp,
    isPending: isPendingGetModulos,
    getModulos
  } = useMutateModulosQuery<Modulo[] | ApiResp>()

  const modulos = useMemo(() => {
    const result = ModulosSchema.safeParse(getModulosResp);
    return result.success ? result.data : [];
  }, [getModulosResp]);

  const toEdit = (id: number) => {
    const moduloActual = modulos?.find((el) => el.id === id)
    setModuloForm(moduloActual!)
    if(moduloActual?.nombre == ""){
      setPadres(null)
    }else{
      actualizarPadres()
    }
  }

  const actualizarPadres = () => {
    if(!modulos.length) return
    const modulosTree = getModulosTree(modulos)
    let nuevosPadres = modulosTree
      .filter((el:any) => (el.nombre == "" || el.nombre == null))
      .map((el: Modulo) => {
        const {id, descripcion} = el
        return {id, descripcion}
      }
    )
    setPadres(nuevosPadres)
  }

  useEffect(() => {
    getModulos()
  }, [])

  useEffect(() => {
    if(!modulos.length ) return
    const modulosTree = structuredClone(getModulosTree(modulos))
    setModulosTree(modulosTree)
    actualizarPadres()
  }, [modulos])
  
  return {
    isPendingGetModulos,
    padres,
    modulosTree,
    moduloForm,
    toEdit,
    setModuloForm,
    actualizarPadres,
    getModulos,
  }
}

export default useModulos