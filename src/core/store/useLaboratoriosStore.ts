import { create } from "zustand";
import { CampoTable, FilterCurrent, FilterParams } from "../types";

interface UseLaboratoriosStore {
  currentLaboratorioId: number;
  camposLaboratorio: CampoTable[];
  filterParamsLaboratorios: FilterParams;
  filterLaboratoriosCurrent: FilterCurrent;
  showLaboratorioFormMdl: boolean;
  setShowLaboratorioFormMdl: (bool:boolean) => void;
  setFilterParamsLaboratorios: (params:FilterParams) => void;
  setFilterLaboratoriosCurrent: () => void;
  setCurrentLaboratorioId: (laboratorioId: number) => void;
  reset: () => void;
}

export const laboratoriosStoreInit = {
  currentLaboratorioId: 0,
  camposLaboratorio: [
    {campo_name: "acciones", text:"Acciones", order_dir:"", show: true},
    {campo_name: "id", text:"Id", order_dir:"", show: false},
    {campo_name: "nombre", text:"Nombre", order_dir:"", show: true},
    {campo_name: "estado", text:"Estado", order_dir:"", show: true},
  ],
  filterParamsLaboratorios: {
    offset: 25,
    search: "",
    equals: [], // [{campo_name: "sucursal_id", value: "1", text:"principal", campo_text: "Sucursal"}]
    between: {campo_name: "", campo_text: "", range: ""}, // {campo_name: "created_at", campo_text:"Creado", range: "2024-12-18 00:00:00, 2024-12-19 23:59:59"}
    orders: [], // [{campo_name: "nombres", order_dir: "ASC", text: "Nombres"}]
  },
  filterLaboratoriosCurrent: {
    equals: [],
    between: {campo_name: "", campo_text: "", range: ""},
    orders: [], 
  },
  showLaboratorioFormMdl: false,
}

const useLaboratoriosStore = create<UseLaboratoriosStore>(( set, get ) => ({
  ...laboratoriosStoreInit,
  setShowLaboratorioFormMdl: (bool) => { set({ showLaboratorioFormMdl: bool }) },
  setFilterParamsLaboratorios: (params) => {
    set({filterParamsLaboratorios: params})
  },
  setFilterLaboratoriosCurrent: () => {
    const {equals, between, orders} = get().filterParamsLaboratorios
    const newCamposLaboratorios = get().camposLaboratorio.map(el=>{
      const order = orders.find(order => order.campo_name === el.campo_name)
      return order ? {...el, order_dir: order?.order_dir} : {...el, order_dir: ""}
    })
    set({camposLaboratorio: newCamposLaboratorios})
    set({filterLaboratoriosCurrent: {equals, between, orders}})
  },
  setCurrentLaboratorioId: (laboratorioId) => set({currentLaboratorioId: laboratorioId}),
  reset: () => set(laboratoriosStoreInit),
}))

export default useLaboratoriosStore;