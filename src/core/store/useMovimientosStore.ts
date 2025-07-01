import { create } from "zustand";
import { CampoTable, FilterParams } from "../types";
import { filterParamsInit } from "../utils/constants";

interface UseMovimientosStore {
  camposMovimiento: CampoTable[];
  filterParamsMovimientos: FilterParams;
  setFilterParamsMovimientos: (params:FilterParams) => void;
  setCamposMovimiento: (camposMovimiento: CampoTable[]) => void;
  reset: () => void;
}

const movimientosStoreInit = {
  camposMovimiento: [
    {show: true, orderable: false, order_dir:"", field_name: "acciones", field_label:"Acciones",},
    {show: false, orderable: true, order_dir:"", field_name: "id", field_label:"Id",},
    {show: false, orderable: false, order_dir:"", field_name: "establecimiento_id", field_label:"Establecimiento id",},
    {show: true, orderable: false, order_dir:"", field_name: "establecimiento", field_label:"Establecimiento",},
    {show: true, orderable: true, order_dir:"", field_name: "fecha", field_label:"Fecha",},
    {show: true, orderable: true, order_dir:"", field_name: "numeracion", field_label:"Numeración",},
    {show: true, orderable: false, order_dir:"", field_name: "tipo", field_label:"Tipo",},
    {show: true, orderable: false, order_dir:"", field_name: "concepto", field_label:"Concepto",},
    {show: false, orderable: true, order_dir:"", field_name: "estado", field_label:"Estado",},
    {show: false, orderable: true, order_dir:"", field_name: "created_at", field_label:"Creado",},
  ],
  filterParamsMovimientos: filterParamsInit,
}

const useMovimientosStore = create<UseMovimientosStore>(( set ) => ({
  ...movimientosStoreInit,
  setFilterParamsMovimientos: (params) => {
    set({filterParamsMovimientos: params})
  },

  setCamposMovimiento: (camposMovimiento) => {
    set({camposMovimiento})
  },
  reset: () => set(movimientosStoreInit),
}))

export default useMovimientosStore;