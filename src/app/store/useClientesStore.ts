import { create } from "zustand";
import { FilterInfo, FilterParams } from "../types";
import { filterInfoInit, filterParamsInit } from "../utils/constants";

interface UseClientesStore {
  currentClienteId: number;
  setCurrentClienteId: (clienteId: number) => void;

  inputSearch: string;
  setInputSearch: (inputSearch: string) => void;

  filterParamsClientes: FilterParams;
  setFilterParamsClientes: (filterParams: FilterParams) => void;

  filterInfoClientes: FilterInfo;
  setFilterInfoClientes: (filterInfo: FilterInfo) => void;

  filterParamsClientesForm: FilterParams;
  setFilterParamsClientesForm: (filterParams: FilterParams) => void;

  showClienteForm: boolean;
  setShowClienteForm: (bool:boolean) => void;
  
  reset: () => void;
}

export const clientesStoreInit = {
  currentClienteId: 0,
  inputSearch: "",
  filterParamsClientes: filterParamsInit,
  filterInfoClientes: filterInfoInit,
  filterParamsClientesForm: filterParamsInit,
  showClienteForm: false,
}

const useClientesStore = create<UseClientesStore>(( set ) => ({
  ...clientesStoreInit,
  setCurrentClienteId: (clienteId) => set({currentClienteId: clienteId}),
  setInputSearch: (inputSearch) => { set({ inputSearch: inputSearch }) },
  setFilterParamsClientes: (filterParams) => { set({ filterParamsClientes: filterParams }) },
  setFilterInfoClientes: (filterInfo) => { set({ filterInfoClientes: filterInfo }) },
  setFilterParamsClientesForm: (filterParams) => { set({ filterParamsClientesForm: filterParams }) },
  setShowClienteForm: (bool) => { set({ showClienteForm: bool }) },
  reset: () => set(clientesStoreInit),
}))

export default useClientesStore;