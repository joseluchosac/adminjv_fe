import { create } from "zustand";
import { FilterParams } from "../types";
import { filterParamsInit } from "../utils/constants";

interface UseMovimientosStore {
  filterParamsMovimientos: FilterParams;
  setFilterParamsMovimientos: (params:FilterParams) => void;
  reset: () => void;
}

const movimientosStoreInit = {

  filterParamsMovimientos: filterParamsInit,
}

const useMovimientosStore = create<UseMovimientosStore>(( set ) => ({
  ...movimientosStoreInit,
  setFilterParamsMovimientos: (params) => {
    set({filterParamsMovimientos: params})
  },

  reset: () => set(movimientosStoreInit),
}))

export default useMovimientosStore;