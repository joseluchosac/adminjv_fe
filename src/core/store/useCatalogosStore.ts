import { create } from "zustand";
import { Catalogos, Categoria, Rol } from "../types/catalogosTypes";

interface UseCatalogosStore {
  catalogos: Catalogos | null;
  setCatalogos: (newCatalogos: Catalogos) => void;
  setCatalogosCategoriasTree: (categorias_tree: Categoria[]) => void;
  createRolStore: (rol: Rol) => void;
  updateRolStore: (rol: Rol) => void;
  deleteRolStore: (rol_id: number) => void;
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
    createRolStore: (rol) => {
      const catalogos = get().catalogos
      set({catalogos: {...catalogos as Catalogos, roles: [...catalogos?.roles!, rol]}})
    },
    updateRolStore: (rol) => {
      const catalogos = get().catalogos
      const idx = catalogos?.roles?.findIndex(el => el.id === rol.id) as number
      if(catalogos?.roles){
        catalogos.roles[idx] = rol
        set({catalogos: {...catalogos as Catalogos, roles: [...catalogos?.roles!]}})
      }
    },
    deleteRolStore: (rol_id) => {
      const catalogos = get().catalogos
      const nuevosRoles = catalogos?.roles.filter((el)=>el.id != rol_id) as Rol[]
      set({catalogos: {...catalogos as Catalogos, roles: nuevosRoles}})
    },
  }
})

export default useCatalogosStore;