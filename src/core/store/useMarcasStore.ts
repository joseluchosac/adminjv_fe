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
    {campo_name: "acciones", text:"Acciones", orderable: false, order_dir:"", show: true},
    {campo_name: "id", text:"Id", orderable: false, order_dir:"", show: false},
    {campo_name: "nombre", text:"Nombre", orderable: true, order_dir:"", show: true},
    {campo_name: "estado", text:"Estado", orderable: true, order_dir:"", show: true},
  ],
  filterParamsMarcas: {
    offset: 25,
    search: "",
    equals: [], // [{campo_name: "sucursal_id", value: "1", text:"principal", campo_text: "Sucursal"}]
    between: {campo_name: "", campo_text: "", range: ""}, // {campo_name: "created_at", campo_text:"Creado", range: "2024-12-18 00:00:00, 2024-12-19 23:59:59"}
    orders: [], // [{campo_name: "nombres", order_dir: "ASC", text: "Nombres"}]
  },
  filterMarcasCurrent: {
    equals: [],
    between: {campo_name: "", campo_text: "", range: ""},
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
      const order = orders.find(order => order.campo_name === el.campo_name)
      return order ? {...el, order_dir: order?.order_dir} : {...el, order_dir: ""}
    })
    set({camposMarca: newCamposMarcas})
    set({filterMarcasCurrent: {equals, between, orders}})
  },
  reset: () => set(marcasStoreInit),
}))

export default useMarcasStore;