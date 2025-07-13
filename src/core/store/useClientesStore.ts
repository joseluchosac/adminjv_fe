import { create } from "zustand";
import { Cliente } from "../types";

interface UseClientesStore {
  currentClienteId: number;
  setCurrentClienteId: (clienteId: number) => void;
  lastSettedCliente: Cliente | null;
  setLastSettedCliente: (cliente: Cliente | null) => void; 
  showClienteForm: boolean;
  setShowClienteForm: (bool:boolean) => void;
  reset: () => void;
}

export const clientesStoreInit = {
  currentClienteId: 0,
  showClienteForm: false,
  lastSettedCliente: null,
}

const useClientesStore = create<UseClientesStore>(( set ) => ({
  ...clientesStoreInit,
  setShowClienteForm: (bool) => { set({ showClienteForm: bool }) },
  setCurrentClienteId: (clienteId) => set({currentClienteId: clienteId}),
  setLastSettedCliente: (cliente) => {set({lastSettedCliente: cliente})},
  reset: () => set(clientesStoreInit),
}))

export default useClientesStore;