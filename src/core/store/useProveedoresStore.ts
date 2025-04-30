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
    {campo_name: "acciones", text:"", order_dir:"", show: true},
    {campo_name: "id", text:"Id", order_dir:"", show: false},
    {campo_name: "nro_documento", text:"Nro Doc", order_dir:"", show: true},
    {campo_name: "nombre_razon_social", text:"Proveedor", order_dir:"", show: true},
    {campo_name: "direccion", text:"Dirección", order_dir:"", show: true},
    {campo_name: "email", text:"Correo", order_dir:"", show: true},
    {campo_name: "telefono", text:"Teléf.", order_dir:"", show: true},
  ],
  filterParamsProveedores: {
    offset: 10,
    search: "",
    equals: [], // [{campo_name: "sucursal_id", value: "1", text:"principal", campo_text: "Sucursal"}]
    between: {campo_name: "", campo_text: "", range: ""}, // {campo_name: "created_at", campo_text:"Creado", range: "2024-12-18 00:00:00, 2024-12-19 23:59:59"}
    orders: [], // [{campo_name: "nombres", order_dir: "ASC", text: "Nombres"}]
  },
  filterProveedoresCurrent: {
    equals: [],
    between: {campo_name: "", campo_text: "", range: ""},
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
      const order = orders.find(order => order.campo_name === el.campo_name)
      return order ? {...el, order_dir: order?.order_dir} : {...el, order_dir: ""}
    })
    set({camposProveedor: newCamposProveedores})
    set({filterProveedoresCurrent: {equals, between, orders}})
  },
  setCurrentProveedorId: (proveedorId) => set({currentProveedorId: proveedorId}),
  reset: () => set(proveedoresStoreInit),
}))

export default useProveedoresStore;