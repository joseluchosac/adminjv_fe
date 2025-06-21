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
    {show: true, orderable: true, order_dir:"", field_name: "fecha", field_label:"Fecha",},
    {show: true, orderable: false, order_dir:"", field_name: "serie", field_label:"Serie",},
    {show: true, orderable: true, order_dir:"", field_name: "correlativo", field_label:"Correlativo",},
    {show: true, orderable: false, order_dir:"", field_name: "tipo", field_label:"Tipo",},
    {show: true, orderable: false, order_dir:"", field_name: "concepto", field_label:"Concepto",},
    {show: true, orderable: true, order_dir:"", field_name: "observacion", field_label:"Observacion",},
    {show: false, orderable: true, order_dir:"", field_name: "user_id", field_label:"User_id",},
    {show: false, orderable: true, order_dir:"", field_name: "estado", field_label:"Estado",},
    {show: true, orderable: true, order_dir:"", field_name: "created_at", field_label:"Creado",},
    {show: true, orderable: true, order_dir:"", field_name: "updated_at", field_label:"Actualizado",},
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