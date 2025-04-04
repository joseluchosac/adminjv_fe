import { create } from "zustand";
import { Catalogos, Rol } from "../types";

interface UseCatalogosStore {
  catalogos: Catalogos | null;
  setCatalogos: (newCatalogos: Catalogos) => void;
  registrarRolStore: (rol: Rol) => void;
  actualizarRolStore: (rol: Rol) => void;
  eliminarRolStore: (rol_id: number) => void;
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
    registrarRolStore: (rol) => {
      const catalogos = get().catalogos
      set({catalogos: {...catalogos as Catalogos, roles: [...catalogos?.roles!, rol]}})
    },
    actualizarRolStore: (rol) => {
      const catalogos = get().catalogos
      const idx = catalogos?.roles?.findIndex(el => el.id === rol.id) as number
      if(catalogos?.roles){
        catalogos.roles[idx] = rol
        set({catalogos: {...catalogos as Catalogos, roles: [...catalogos?.roles!]}})
      }
    },
    eliminarRolStore: (rol_id) => {
      const catalogos = get().catalogos
      const nuevosRoles = catalogos?.roles.filter((el)=>el.id != rol_id) as Rol[]
      set({catalogos: {...catalogos as Catalogos, roles: nuevosRoles}})
    },
  }
})

export default useCatalogosStore;