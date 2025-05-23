import { create } from "zustand";
import { CampoTable, FilterParams } from "../types";
import { filterParamsInit } from "../utils/constants";

interface UseMarcasStore {
  camposMarca: CampoTable[];
  filterParamsMarcas: FilterParams;
  setFilterParamsMarcas: (params:FilterParams) => void;
  setCamposMarca: (camposMarca: CampoTable[]) => void;
  reset: () => void;
}

const marcasStoreInit = {
  camposMarca: [
    {show: true, orderable: false, order_dir:"", fieldname: "acciones", label:"Acciones",  },
    {show: false, orderable: true, order_dir:"", fieldname: "id", label:"Id",  },
    {show: true, orderable: true, order_dir:"", fieldname: "nombre", label:"Nombre",  },
    {show: true, orderable: true, order_dir:"", fieldname: "estado", label:"Estado",  },
  ],
  filterParamsMarcas: filterParamsInit,

}

const useMarcasStore = create<UseMarcasStore>(( set ) => ({
  ...marcasStoreInit,
  setFilterParamsMarcas: (params) => {
    set({filterParamsMarcas: params})
  },

  setCamposMarca: (camposMarca) => {
    set({camposMarca})
  },
  reset: () => set(marcasStoreInit),
}))

export default useMarcasStore;