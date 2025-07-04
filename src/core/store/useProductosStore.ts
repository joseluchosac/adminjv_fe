import { create } from "zustand";
import { CampoTable, FilterParams } from "../types";
import { filterParamsInit } from "../utils/constants";

interface UseProductosStore {
  camposProducto: CampoTable[];
  filterParamsProductos: FilterParams;
  setFilterParamsProductos: (params:FilterParams) => void;
  setCamposProducto: (camposProducto: CampoTable[]) => void;
  reset: () => void;
}

const productosStoreInit = {
  camposProducto: [
    {show: true, orderable: false, order_dir:"", field_name: "acciones", field_label:"Acciones",},
    {show: true, orderable: false, order_dir:"", field_name: "establecimiento_id", field_label:"estab id",},
    {show: false, orderable: true, order_dir:"", field_name: "id", field_label:"Id",},
    {show: false, orderable: true, order_dir:"", field_name: "codigo", field_label:"Codigo",},
    {show: true, orderable: true, order_dir:"", field_name: "descripcion", field_label:"Descripcion",},
    {show: false, orderable: false, order_dir:"", field_name: "marca_id", field_label:"Marca id",},
    {show: false, orderable: true, order_dir:"", field_name: "marca", field_label:"Marca",},
    {show: false, orderable: false, order_dir:"", field_name: "laboratorio_id", field_label:"Laboratorio id",},
    {show: false, orderable: true, order_dir:"", field_name: "laboratorio", field_label:"Lab",},
    {show: false, orderable: true, order_dir:"", field_name: "barcode", field_label:"Cód. barras",},
    {show: true, orderable: true, order_dir:"", field_name: "stock", field_label:"Stock",},
    {show: false, orderable: false, order_dir:"", field_name: "estado", field_label:"Estado",},
    {show: true, orderable: true, order_dir:"", field_name: "created_at", field_label:"F creacion",},
    {show: true, orderable: true, order_dir:"", field_name: "updated_at", field_label:"F actualización",},    
  ],
  filterParamsProductos: filterParamsInit,
}

const useProductosStore = create<UseProductosStore>(( set ) => ({
  ...productosStoreInit,
  setFilterParamsProductos: (params) => {
    set({filterParamsProductos: params})
  },

  setCamposProducto: (camposProducto) => {
    set({camposProducto})
  },
  reset: () => set(productosStoreInit),
}))

export default useProductosStore;