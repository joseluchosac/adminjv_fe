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
    {show: true, orderable: false, order_dir:"", field_name: "acciones", field_label:"Acciones",},
    {show: false, orderable: true, order_dir:"", field_name: "id", field_label:"Id",},
    {show: true, orderable: true, order_dir:"", field_name: "nombre", field_label:"Nombre",},
    {show: true, orderable: true, order_dir:"", field_name: "estado", field_label:"Estado",},
  ],
  filterParamsLaboratorios: {
    offset: 25,
    search: "",
    equals: [],
    between: {field_name: "", field_label: "", range: ""},
    orders: [],
  },
  filterLaboratoriosCurrent: {
    equals: [],
    between: {field_name: "", field_label: "", range: ""},
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
      const order = orders.find(order => order.field_name === el.field_name)
      return order ? {...el, order_dir: order?.order_dir} : {...el, order_dir: ""}
    })
    set({camposLaboratorio: newCamposLaboratorios})
    set({filterLaboratoriosCurrent: {equals, between, orders}})
  },
  setCurrentLaboratorioId: (laboratorioId) => set({currentLaboratorioId: laboratorioId}),
  reset: () => set(laboratoriosStoreInit),
}))

export default useLaboratoriosStore;