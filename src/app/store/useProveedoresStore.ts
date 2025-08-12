import { create } from "zustand";

interface UseProveedoresStore {
  currentProveedorId: number;
  setCurrentProveedorId: (proveedorId: number) => void;
  showProveedorForm: boolean;
  setShowProveedorForm: (bool:boolean) => void;
  reset: () => void;
}

export const proveedoresStoreInit = {
  currentProveedorId: 0,
  showProveedorForm: false,
}

const useProveedoresStore = create<UseProveedoresStore>(( set ) => ({
  ...proveedoresStoreInit,
  setShowProveedorForm: (bool) => { set({ showProveedorForm: bool }) },
  setCurrentProveedorId: (proveedorId) => set({currentProveedorId: proveedorId}),
  reset: () => set(proveedoresStoreInit),
}))

export default useProveedoresStore;