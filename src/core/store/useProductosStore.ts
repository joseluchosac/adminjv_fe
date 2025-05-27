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
    {show: false, orderable: true, order_dir:"", field_name: "id", field_label:"Id",},
    {show: true, orderable: true, order_dir:"", field_name: "codigo", field_label:"Codigo",},
    {show: true, orderable: true, order_dir:"", field_name: "descripcion", field_label:"Descripcion",},
    {show: true, orderable: true, order_dir:"", field_name: "categoria_ids", field_label:"categoria_ids",},
    {show: true, orderable: true, order_dir:"", field_name: "barcode", field_label:"Codigo de barras",},
    {show: true, orderable: false, order_dir:"", field_name: "unidad_medida_cod", field_label:"unidad_medida_cod",},
    {show: true, orderable: true, order_dir:"", field_name: "tipo_moneda_cod", field_label:"tipo_moneda_cod",},
    {show: true, orderable: false, order_dir:"", field_name: "precio_venta", field_label:"Precio de vent",},
    {show: true, orderable: false, order_dir:"", field_name: "precio_costo", field_label:"Precio de costo",},
    {show: true, orderable: true, order_dir:"", field_name: "impuesto_id_igv", field_label:"impuesto_id_igv",},
    {show: true, orderable: true, order_dir:"", field_name: "impuesto_id_icbper", field_label:"impuesto_id_icbper",},
    {show: true, orderable: false, order_dir:"", field_name: "inventariable", field_label:"Inventariable",},
    {show: true, orderable: true, order_dir:"", field_name: "lotizable", field_label:"Lotizable",},
    {show: true, orderable: true, order_dir:"", field_name: "stock", field_label:"Stock",},
    {show: true, orderable: true, order_dir:"", field_name: "stock_min", field_label:"Stock minimo",},
    {show: true, orderable: true, order_dir:"", field_name: "imagen", field_label:"Imagen",},
    {show: true, orderable: true, order_dir:"", field_name: "estado", field_label:"estado",},
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