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
    {show: true, orderable: false, order_dir:"", field_name: "acciones", field_label:"Acciones",  },
    {show: false, orderable: true, order_dir:"", field_name: "id", field_label:"Id",  },
    {show: true, orderable: true, order_dir:"", field_name: "nombre", field_label:"Nombre",  },
    {show: true, orderable: true, order_dir:"", field_name: "estado", field_label:"Estado",  },
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