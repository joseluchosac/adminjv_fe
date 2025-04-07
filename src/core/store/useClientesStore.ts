import { create } from "zustand";
import { CampoTable, FilterCurrent, FilterParams } from "../types";

interface UseClientesStore {
  currentClienteId: number;
  camposCliente: CampoTable[];
  filterParamsClientes: FilterParams;
  filterClientesCurrent: FilterCurrent;
  showClienteFormMdl: boolean;
  showClientesFilterMdl: boolean;
  setShowClienteFormMdl: (bool:boolean) => void;
  setFilterParamsClientes: (params:FilterParams) => void;
  setFilterClientesCurrent: () => void;
  setShowClientesFilterMdl: (p: boolean) => void;
  setCurrentClienteId: (clienteId: number) => void;
  reset: () => void;
}

export const clientesStoreInit = {
  currentClienteId: 0,
  camposCliente: [
    {campo_name: "id", text:"Id", order_dir:"", show: false},
    {campo_name: "nro_documento", text:"Nro Doc", order_dir:"", show: true},
    {campo_name: "nombre_razon_social", text:"Cliente", order_dir:"", show: true},
    {campo_name: "direccion", text:"Dirección", order_dir:"", show: true},
    {campo_name: "email", text:"Correo", order_dir:"", show: true},
    {campo_name: "telefono", text:"Teléf.", order_dir:"", show: true},
    {campo_name: "acciones", text:"Acciones", order_dir:"", show: true},
  ],
  filterParamsClientes: {
    offset: 10,
    search: "",
    equals: [], // [{campo_name: "sucursal_id", value: "1", text:"principal", campo_text: "Sucursal"}]
    between: {campo_name: "", campo_text: "", range: ""}, // {campo_name: "created_at", campo_text:"Creado", range: "2024-12-18 00:00:00, 2024-12-19 23:59:59"}
    orders: [], // [{campo_name: "nombres", order_dir: "ASC", text: "Nombres"}]
  },
  filterClientesCurrent: {
    equals: [],
    between: {campo_name: "", campo_text: "", range: ""},
    orders: [], 
  },
  showClienteFormMdl: false,
  showClientesFilterMdl: false
}

const useClientesStore = create<UseClientesStore>(( set, get ) => ({
  ...clientesStoreInit,
  setShowClienteFormMdl: (bool) => { set({ showClienteFormMdl: bool }) },
  setShowClientesFilterMdl: (bool) => set({ showClientesFilterMdl: bool }),
  setFilterParamsClientes: (params) => {
    set({filterParamsClientes: params})
  },
  setFilterClientesCurrent: () => {
    const {equals, between, orders} = get().filterParamsClientes
    const newCamposClientes = get().camposCliente.map(el=>{
      const order = orders.find(order => order.campo_name === el.campo_name)
      return order ? {...el, order_dir: order?.order_dir} : {...el, order_dir: ""}
    })
    set({camposCliente: newCamposClientes})
    set({filterClientesCurrent: {equals, between, orders}})
  },
  setCurrentClienteId: (clienteId) => set({currentClienteId: clienteId}),
  reset: () => set(clientesStoreInit),
}))

export default useClientesStore;