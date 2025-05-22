import { create } from "zustand";
import { CampoTable, FilterCurrent, FilterParams } from "../types";

interface UseMarcasStore {
  camposMarca: CampoTable[];
  filterParamsMarcas: FilterParams;
  filterMarcasCurrent: FilterCurrent;
  setFilterParamsMarcas: (params:FilterParams) => void;
  setFilterMarcasCurrent: () => void;
  reset: () => void;
}

export const marcasStoreInit = {
  camposMarca: [
    {show: true, orderable: false, order_dir:"", fieldname: "acciones", text:"Acciones",  },
    {show: false, orderable: true, order_dir:"", fieldname: "id", text:"Id",  },
    {show: true, orderable: true, order_dir:"", fieldname: "nombre", text:"Nombre",  },
    {show: true, orderable: true, order_dir:"", fieldname: "estado", text:"Estado",  },
  ],
  filterParamsMarcas: {
    offset: 25,
    search: "",
    equals: [], // [{fieldname: "sucursal_id", value: "1", text:"principal", campo_text: "Sucursal"}]
    between: {fieldname: "", campo_text: "", range: ""}, // {fieldname: "created_at", campo_text:"Creado", range: "2024-12-18 00:00:00, 2024-12-19 23:59:59"}
    orders: [], // [{fieldname: "nombres", order_dir: "ASC", text: "Nombres"}]
  },
  filterMarcasCurrent: {
    equals: [],
    between: {fieldname: "", campo_text: "", range: ""},
    orders: [], 
  },
}

const useMarcasStore = create<UseMarcasStore>(( set, get ) => ({
  ...marcasStoreInit,
  setFilterParamsMarcas: (params) => {
    set({filterParamsMarcas: params})
  },
  setFilterMarcasCurrent: () => {
    const {equals, between, orders} = get().filterParamsMarcas
    const newCamposMarcas = get().camposMarca.map(el=>{
      const order = orders.find(order => order.fieldname === el.fieldname)
      return order ? {...el, order_dir: order?.order_dir} : {...el, order_dir: ""}
    })
    set({camposMarca: newCamposMarcas})
    set({filterMarcasCurrent: {equals, between, orders}})
  },
  reset: () => set(marcasStoreInit),
}))

export default useMarcasStore;