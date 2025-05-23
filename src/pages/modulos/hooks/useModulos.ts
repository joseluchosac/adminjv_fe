import { useEffect, useState } from "react"
import { Modulo, Padre } from "../../../core/types"
import { getModulosTree } from "../../../core/utils/funciones"
import { useMutateModulosQuery } from "../../../core/hooks/useModulosQuery"
import { moduloFormInit } from "../../../core/utils/constants"

const useModulos = () => {
  const [modulosTree, setModulosTree] = useState<Modulo[] | null>(null)
  const [moduloForm, setModuloForm] = useState<Modulo>(moduloFormInit)
  const [padres, setPadres] = useState<Padre[] | null>(null)
  const {
    isPending: isPendingGetModulos,
    data: modulos,
    getModulos
  } = useMutateModulosQuery()

  const toEdit = (id: number) => {
    const moduloActual = modulos?.find((el: Modulo) => el.id === id) as Modulo
    setModuloForm(moduloActual)
    if(moduloActual.nombre == ""){
      setPadres(null)
    }else{
      actualizarPadres()
    }
  }

  const actualizarPadres = () => {
    if(!modulos) return
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
    if(!modulos || modulos.error) return
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