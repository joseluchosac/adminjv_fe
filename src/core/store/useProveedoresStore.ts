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
    {show: true, orderable: true, order_dir:"", fieldname: "acciones", label:"Acciones",},
    {show: false, orderable: true, order_dir:"", fieldname: "id", label:"Id",},
    {show: true, orderable: true, order_dir:"", fieldname: "nro_documento", label:"Nro Doc",},
    {show: true, orderable: true, order_dir:"", fieldname: "nombre_razon_social", label:"Proveedor",},
    {show: true, orderable: true, order_dir:"", fieldname: "direccion", label:"Dirección",},
    {show: true, orderable: true, order_dir:"", fieldname: "email", label:"Correo",},
    {show: true, orderable: true, order_dir:"", fieldname: "telefono", label:"Teléf.",},
  ],
  filterParamsProveedores: {
    offset: 25,
    search: "",
    equals: [], // [{fieldname: "sucursal_id", value: "1", text:"principal", campo_text: "Sucursal"}]
    between: {fieldname: "", campo_text: "", range: ""}, // {fieldname: "created_at", campo_text:"Creado", range: "2024-12-18 00:00:00, 2024-12-19 23:59:59"}
    orders: [], // [{fieldname: "nombres", order_dir: "ASC", label: "Nombres"}]
  },
  filterProveedoresCurrent: {
    equals: [],
    between: {fieldname: "", campo_text: "", range: ""},
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
      const order = orders.find(order => order.fieldname === el.fieldname)
      return order ? {...el, order_dir: order?.order_dir} : {...el, order_dir: ""}
    })
    set({camposProveedor: newCamposProveedores})
    set({filterProveedoresCurrent: {equals, between, orders}})
  },
  setCurrentProveedorId: (proveedorId) => set({currentProveedorId: proveedorId}),
  reset: () => set(proveedoresStoreInit),
}))

export default useProveedoresStore;