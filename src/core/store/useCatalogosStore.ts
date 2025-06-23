import { create } from "zustand";
import { Catalogos, Categoria, Establecimiento, Numeracion, Rol } from "../types/catalogosTypes";

interface UseCatalogosStore {
  catalogos: Catalogos | null;
  setCatalogos: (newCatalogos: Catalogos) => void;
  setCatalogosCategoriasTree: (categorias_tree: Categoria[]) => void;
  updateRolesStore: (roles: Rol[]) => void;
  setEstablecimientos: (establecimientos: Establecimiento[]) => void;
  setEstablecimiento: (establecimiento: Establecimiento) => void;
  delEstablecimiento: (id: number) => void;
  setNumeraciones: (numeraciones: Numeracion[]) => void;
  setNumeracion: (numeracion: Numeracion) => void;
  delNumeracion: (id: number) => void;
}

const initialState = {
  catalogos: null,
} 
const useCatalogosStore = create<UseCatalogosStore>((set, get) => {
  return {
    ...initialState,
    setCatalogos: (newCatalogos) => {
      set({catalogos: newCatalogos})
    },
    setCatalogosCategoriasTree: (categorias_tree) => {
      set({catalogos: {...get().catalogos as Catalogos, categorias_tree}})
    },
    updateRolesStore: (roles) => {
      const catalogos = get().catalogos
      set({catalogos: {...catalogos as Catalogos, roles}})
    },
    setEstablecimientos: (establecimientos) => {
      const catalogos = get().catalogos
      if(catalogos){
        set({catalogos: {...catalogos, establecimientos}})
      }
    },
    setEstablecimiento: (establecimiento) => {
      const catalogos = get().catalogos
      if(!catalogos) return
      const idx = catalogos?.establecimientos.findIndex(el=>el.id === establecimiento.id)
      if(idx === -1){ // Agrega
        const nuevosEstablecimientos = [...catalogos.establecimientos, establecimiento]
        set({catalogos: {...catalogos, establecimientos: nuevosEstablecimientos}})
      }else{ // modifica
        const nuevosEstablecimientos = [...catalogos.establecimientos]
        nuevosEstablecimientos[idx] = establecimiento
        set({catalogos: {...catalogos, establecimientos: nuevosEstablecimientos}})
      }
    },
    delEstablecimiento: (id) => {
      const catalogos = get().catalogos
      if(!catalogos) return
      const nuevosEstablecimientos = catalogos.establecimientos.filter(el=> el.id !== id)
      set({catalogos: {...catalogos, establecimientos: nuevosEstablecimientos}})
    },
    setNumeraciones: (numeraciones) => {
      const catalogos = get().catalogos
      if(catalogos){
        set({catalogos: {...catalogos, numeraciones}})
      }
    },
    setNumeracion: (numeracion) => {
      const catalogos = get().catalogos
      if(!catalogos) return
      const idx = catalogos?.numeraciones.findIndex(el=>el.id === numeracion.id)
      if(idx === -1){ // Agrega
        const nuevasNumeraciones = [...catalogos.numeraciones, numeracion]
        set({catalogos: {...catalogos, numeraciones: nuevasNumeraciones}})
      }else{ // modifica
        const nuevasNumeraciones = [...catalogos.numeraciones]
        nuevasNumeraciones[idx] = numeracion
        set({catalogos: {...catalogos, numeraciones: nuevasNumeraciones}})
      }
    },
    delNumeracion: (id) => {
      const catalogos = get().catalogos
      if(!catalogos) return
      const nuevasNumeraciones = catalogos.numeraciones.filter(el=> el.id !== id)
      set({catalogos: {...catalogos, numeraciones: nuevasNumeraciones}})
    },
  }
})

export default useCatalogosStore;