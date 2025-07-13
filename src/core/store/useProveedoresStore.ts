import { create } from "zustand";
import { Proveedor } from "../types";

interface UseProveedoresStore {
  currentProveedorId: number;
  setCurrentProveedorId: (proveedorId: number) => void;
  lastSettedProveedor: Proveedor | null;
  setLastSettedProveedor: (proveedor: Proveedor | null) => void;
  showProveedorForm: boolean;
  setShowProveedorForm: (bool:boolean) => void;
  reset: () => void;
}

export const proveedoresStoreInit = {
  currentProveedorId: 0,
  showProveedorForm: false,
  lastSettedProveedor: null,
}

const useProveedoresStore = create<UseProveedoresStore>(( set ) => ({
  ...proveedoresStoreInit,
  setShowProveedorForm: (bool) => { set({ showProveedorForm: bool }) },
  setCurrentProveedorId: (proveedorId) => set({currentProveedorId: proveedorId}),
  setLastSettedProveedor: (proveedor) => {set({lastSettedProveedor: proveedor})},
  reset: () => set(proveedoresStoreInit),
}))

export default useProveedoresStore;