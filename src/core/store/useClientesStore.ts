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
    {show: true, orderable: false, order_dir: "", field_name: "acciones", field_label:"",},
    {show: false, orderable: true, order_dir: "", field_name: "id", field_label:"Id",},
    {show: true, orderable: true, order_dir: "", field_name: "nro_documento", field_label:"Nro Doc",},
    {show: true, orderable: true, order_dir: "", field_name: "nombre_razon_social", field_label:"Cliente",},
    {show: true, orderable: true, order_dir: "", field_name: "direccion", field_label:"Dirección",},
    {show: true, orderable: true, order_dir: "", field_name: "email", field_label:"Correo",},
    {show: true, orderable: true, order_dir: "", field_name: "telefono", field_label:"Teléf.",},
  ],
  filterParamsClientes: {
    offset: 25,
    search: "",
    equals: [],
    between: {field_name: "", field_label: "", range: ""}, 
    orders: [],
  },
  filterClientesCurrent: {
    equals: [],
    between: {field_name: "", field_label: "", range: ""},
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
      const order = orders.find(order => order.field_name === el.field_name)
      return order ? {...el, order_dir: order?.order_dir} : {...el, order_dir: ""}
    })
    set({camposCliente: newCamposClientes})
    set({filterClientesCurrent: {equals, between, orders}})
  },
  setCurrentClienteId: (clienteId) => set({currentClienteId: clienteId}),
  reset: () => set(clientesStoreInit),
}))

export default useClientesStore;