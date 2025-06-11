import { create } from "zustand";
import { Catalogos, Categoria, Rol } from "../types/catalogosTypes";

interface UseCatalogosStore {
  catalogos: Catalogos | null;
  setCatalogos: (newCatalogos: Catalogos) => void;
  setCatalogosCategoriasTree: (categorias_tree: Categoria[]) => void;
  updateRolesStore: (roles: Rol[]) => void;
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
  }
})

export default useCatalogosStore;