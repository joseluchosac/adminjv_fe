import { create } from "zustand";
import { Catalogos, Categoria, Establecimiento, Rol } from "../types/catalogosTypes";

interface UseCatalogosStore {
  catalogos: Catalogos | null;
  setCatalogos: (newCatalogos: Catalogos) => void;
  setCatalogosCategoriasTree: (categorias_tree: Categoria[]) => void;
  updateRolesStore: (roles: Rol[]) => void;
  setEstablecimientos: (establecimientos: Establecimiento[]) => void;
  setEstablecimiento: (establecimiento: Establecimiento) => void;
  delEstablecimiento: (id: number) => void;
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
  }
})

export default useCatalogosStore;