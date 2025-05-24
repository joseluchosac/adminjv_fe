import { create } from "zustand";
import { CampoTable, FilterCurrent, FilterParams } from "../types";

interface UseProveedoresStore {
  currentProveedorId: number;
  camposProveedor: CampoTable[];
  filterParamsProveedores: FilterParams;
  filterProveedoresCurrent: FilterCurrent;
  showProveedorFormMdl: boolean;
  showProveedoresFilterMdl: boolean;
  setShowProveedorFormMdl: (bool:boolean) => void;
  setFilterParamsProveedores: (params:FilterParams) => void;
  setFilterProveedoresCurrent: () => void;
  setShowProveedoresFilterMdl: (p: boolean) => void;
  setCurrentProveedorId: (proveedorId: number) => void;
  reset: () => void;
}

export const proveedoresStoreInit = {
  currentProveedorId: 0,
  camposProveedor: [
    {show: true, orderable: true, order_dir:"", field_name: "acciones", field_label:"Acciones",},
    {show: false, orderable: true, order_dir:"", field_name: "id", field_label:"Id",},
    {show: true, orderable: true, order_dir:"", field_name: "nro_documento", field_label:"Nro Doc",},
    {show: true, orderable: true, order_dir:"", field_name: "nombre_razon_social", field_label:"Proveedor",},
    {show: true, orderable: true, order_dir:"", field_name: "direccion", field_label:"Dirección",},
    {show: true, orderable: true, order_dir:"", field_name: "email", field_label:"Correo",},
    {show: true, orderable: true, order_dir:"", field_name: "telefono", field_label:"Teléf.",},
  ],
  filterParamsProveedores: {
    offset: 25,
    search: "",
    equals: [],
    between: {field_name: "", field_label: "", range: ""},
    orders: [],
  },
  filterProveedoresCurrent: {
    equals: [],
    between: {field_name: "", field_label: "", range: ""},
    orders: [], 
  },
  showProveedorFormMdl: false,
  showProveedoresFilterMdl: false
}

const useProveedoresStore = create<UseProveedoresStore>(( set, get ) => ({
  ...proveedoresStoreInit,
  setShowProveedorFormMdl: (bool) => { set({ showProveedorFormMdl: bool }) },
  setShowProveedoresFilterMdl: (bool) => set({ showProveedoresFilterMdl: bool }),
  setFilterParamsProveedores: (params) => {
    set({filterParamsProveedores: params})
  },
  setFilterProveedoresCurrent: () => {
    const {equals, between, orders} = get().filterParamsProveedores
    const newCamposProveedores = get().camposProveedor.map(el=>{
      const order = orders.find(order => order.field_name === el.field_name)
      return order ? {...el, order_dir: order?.order_dir} : {...el, order_dir: ""}
    })
    set({camposProveedor: newCamposProveedores})
    set({filterProveedoresCurrent: {equals, between, orders}})
  },
  setCurrentProveedorId: (proveedorId) => set({currentProveedorId: proveedorId}),
  reset: () => set(proveedoresStoreInit),
}))

export default useProveedoresStore;