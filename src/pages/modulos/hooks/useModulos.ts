import { useEffect, useState } from "react"
import { ModuloForm, ModuloT, Padre } from "../../../core/types"
import { moduloFormInit } from "../../../core/types/initials"
import { getTree } from "../../../core/utils/funciones"
import { useMutateModulosQuery } from "../../../core/hooks/useModulosQuery"

const useModulos = () => {
  const [modulosTree, setModulosTree] = useState<ModuloT[] | null>(null)
  const [moduloForm, setModuloForm] = useState<ModuloForm>(moduloFormInit)
  const [isSorted, setIsSorted] = useState(false)
  const [padres, setPadres] = useState<Padre[] | null>(null)
  const {
    isPending: isPendingGetModulos,
    data: modulos,
    getModulos
  } = useMutateModulosQuery()

  const resetSort = () => {
    if(!modulos) return
    const modulosTree = structuredClone(getTree(modulos))
    setModulosTree(modulosTree)
    setIsSorted(false)
  }

  const toEdit = (id: number) => {
    const moduloActual = modulos?.find((el: ModuloT) => el.id === id) as ModuloT
    setModuloForm(moduloActual)
    if(moduloActual.nombre == ""){
      setPadres(null)
    }else{
      actualizarPadres()
    }
  }

  const actualizarPadres = () => {
    if(!modulos) return
    const modulosTree = getTree(modulos)
    let nuevosPadres = modulosTree
      .filter((el:any) => (el.nombre == "" || el.nombre == null))
      .map((el: ModuloT) => {
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
    const modulosTree = structuredClone(getTree(modulos))
    setModulosTree(modulosTree)
    actualizarPadres()
  }, [modulos])
  
  return {
    isPendingGetModulos,
    isSorted,
    padres,
    modulosTree,
    moduloForm,
    setModulosTree,
    setIsSorted,
    resetSort,
    toEdit,
    setModuloForm,
    actualizarPadres,
    getModulos,
  }
}

export default useModulos