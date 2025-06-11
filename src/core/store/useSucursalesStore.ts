import { create } from "zustand";
import { CampoTable, FilterParams } from "../types";
import { filterParamsInit } from "../utils/constants";

interface UseSucursalesStore {
  camposSucursal: CampoTable[];
  filterParamsSucursales: FilterParams;
  setFilterParamsSucursales: (params:FilterParams) => void;
  setCamposSucursal: (camposSucursal: CampoTable[]) => void;
  reset: () => void;
}

const sucursalesStoreInit = {
  camposSucursal: [
    {show: true, orderable: false, order_dir:"", field_name: "acciones", field_label:"Acciones",  },
    {show: false, orderable: true, order_dir:"", field_name: "id", field_label:"Id",  },
    {show: true, orderable: true, order_dir:"", field_name: "codigo", field_label:"Código",  },
    {show: true, orderable: true, order_dir:"", field_name: "descripcion", field_label:"Descripcion",  },
    {show: true, orderable: true, order_dir:"", field_name: "direccion", field_label:"Direccion",  },
    {show: true, orderable: true, order_dir:"", field_name: "telefono", field_label:"Telefono",  },
    {show: true, orderable: true, order_dir:"", field_name: "email", field_label:"Correo",  },
    {show: true, orderable: true, order_dir:"", field_name: "estado", field_label:"Estado",  },
  ],
  filterParamsSucursales: filterParamsInit,

}

const useSucursalesStore = create<UseSucursalesStore>(( set ) => ({
  ...sucursalesStoreInit,
  setFilterParamsSucursales: (params) => {
    set({filterParamsSucursales: params})
  },

  setCamposSucursal: (camposSucursal) => {
    set({camposSucursal})
  },
  reset: () => set(sucursalesStoreInit),
}))

export default useSucursalesStore;