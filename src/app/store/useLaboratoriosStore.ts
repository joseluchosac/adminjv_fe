import { create } from "zustand";
import { BetweenItem, CampoTable, CommonPeriod, EqualItem, FilterParam, OrderItem } from "../types";
import { betweenItemInit, camposLaboratorioInit } from "../utils/constants";
import { deepEqualUnordered, getDateRangePeriod } from "../utils/funciones";

const laboratorioFilterParamInit: FilterParam = {
  offset: 50,
  search: "",
  equal: [],
  between: [],
  order: [],
};

interface UseLaboratoriosStore {
  camposLaboratorio: CampoTable[];
  showLaboratorioForm: boolean;
  currentLaboratorioId: number | null;
  showLaboratoriosFilter: boolean;
  laboratorioFilterForm: FilterParam;
  laboratorioFilterParam: FilterParam;
  laboratorioFilterInfo: FilterParam;
  setCamposLaboratorio: () => void;
  setShowLaboratorioForm: (param: {
    showLaboratorioForm: boolean;
    currentLaboratorioId: number | null;
  }) => void;
  setCurrentLaboratorioId: (laboratorioId: number | null) => void;
  setShowLaboratorioFilter: (show: boolean) => void;
  setLaboratorioFilterForm: (filterParam: FilterParam) => void;
  setLaboratorioFilterFormSort: (param: {
    field_name: string;
    field_label: string;
    order_dir: "ASC" | "DESC";
  }) => void;
  setLaboratorioFilterFormSortTable: (param: {
    field_name: string;
    field_label: string;
    ctrlKey: boolean;
  }) => void;
  setLaboratorioFilterFormEqual: (equalItem: EqualItem) => void;
  setLaboratorioFilterFormResetEqualItem: (param: {field_name: string}) => void;
  setLaboratorioFilterFormBetweenField: (param: {field_name: string, field_label: string}) => void;
  setLaboratorioFilterFormBetweenPeriod: (param: {periodKey: CommonPeriod["key"]}) => void;
  setLaboratorioFilterFormBetweenDate: (param: {name: string; value: string}) => void;
  setLaboratorioFilterParam: () => void;
  setLaboratorioFilterParamBetween: () => void;
  setLaboratorioFilterInfo: () => void;
}

export const laboratoriosStoreInit = {
  camposLaboratorio: camposLaboratorioInit,
  showLaboratorioForm: false,
  currentLaboratorioId: null,
  showLaboratoriosFilter: false,
  laboratorioFilterForm: laboratorioFilterParamInit,
  laboratorioFilterParam: laboratorioFilterParamInit,
  laboratorioFilterInfo: laboratorioFilterParamInit,
};

const useLaboratoriosStore = create<UseLaboratoriosStore>((set, get) => ({
  ...laboratoriosStoreInit,
  setCamposLaboratorio: () => {
    const { order } = get().laboratorioFilterForm;
    const newCamposLaboratorios = get().camposLaboratorio.map((el) => {
      const orderh = order.find((order) => order.field_name === el.field_name);
      return orderh
        ? { ...el, order_dir: orderh?.order_dir }
        : { ...el, order_dir: "" };
    });
    set({ camposLaboratorio: newCamposLaboratorios });
  },
  setCurrentLaboratorioId: (currentLaboratorioId) => {
    set({ currentLaboratorioId });
  },
  setShowLaboratorioForm: ({ showLaboratorioForm, currentLaboratorioId }) => {
    set({ showLaboratorioForm, currentLaboratorioId });
  },
  setShowLaboratorioFilter: (show) => {
    set({ showLaboratoriosFilter: show });
  },
  setLaboratorioFilterForm: (filterParam) => {
    set({ laboratorioFilterForm: filterParam });
  },
  setLaboratorioFilterFormSort: ({ field_name, field_label, order_dir }) => {
    const newOrder: OrderItem[] = field_name
      ? [{ field_name, order_dir, field_label }]
      : [];
    set({
      laboratorioFilterForm: { ...get().laboratorioFilterForm, order: newOrder },
    });
  },
  setLaboratorioFilterFormSortTable: ({ field_name, field_label, ctrlKey }) => {
    const orderIdx = get().laboratorioFilterForm.order.findIndex(
      (el) => el.field_name === field_name
    );
    let newOrder: OrderItem[] = [];
    if (ctrlKey) {
      // Orden multiple, click + ctrl
      if (orderIdx === -1) {
        newOrder = [
          ...get().laboratorioFilterForm.order,
          { field_name, order_dir: "ASC", field_label },
        ];
      } else {
        newOrder = structuredClone(get().laboratorioFilterForm.order);
        if (newOrder[orderIdx].order_dir == "ASC") {
          newOrder[orderIdx] = { field_name, order_dir: "DESC", field_label };
        } else {
          newOrder = newOrder.filter((el) => el.field_name !== field_name);
        }
      }
    } else {
      if (orderIdx === -1) {
        // Si no esta ordenado
        newOrder = [{ field_name, order_dir: "ASC", field_label }];
      } else {
        let newOrders = structuredClone(get().laboratorioFilterForm.order);
        newOrder =
          newOrders[orderIdx].order_dir == "ASC"
            ? [{ field_name, order_dir: "DESC", field_label }]
            : [];
      }
    }
    set({
      laboratorioFilterForm: { ...get().laboratorioFilterForm, order: newOrder },
    });
  },
  setLaboratorioFilterFormEqual: (equalItem) => {
    const {field_name, field_value, field_label} = equalItem
    let equalClone = structuredClone(get().laboratorioFilterForm.equal);
    if(!field_value){
      equalClone = equalClone.filter(el => el.field_name !== field_name)
    }else{
      const idx = equalClone.findIndex(el => el.field_name === field_name)
      if(idx === -1){
        equalClone = [ ...equalClone, {field_name, field_value, field_label} ]
      }else{
        equalClone[idx] = {field_name, field_value, field_label}
      }
    }
    set({
      laboratorioFilterForm: {...get().laboratorioFilterForm, equal: equalClone},
    });
  },
  setLaboratorioFilterFormResetEqualItem: ({field_name}) => {
    let { equal } = get().laboratorioFilterForm;
    equal = equal.filter((el) => el.field_name !== field_name);
    set({
      laboratorioFilterForm: {...get().laboratorioFilterForm, equal: [...equal]},
    });
  },
  setLaboratorioFilterFormBetweenField: ({field_name, field_label}) => {
    let newBetween: BetweenItem[] = []
    if(field_name){
      let cloneBetweenItem = structuredClone(get().laboratorioFilterForm.between[0]) || betweenItemInit;
      newBetween = [{...cloneBetweenItem, field_name, field_label}]
    }
    set({
      laboratorioFilterForm: {...get().laboratorioFilterForm, between: newBetween},
    });
  },
  setLaboratorioFilterFormBetweenPeriod: ({periodKey}) => {
    const newBetweenItem = structuredClone(get().laboratorioFilterForm.between[0]) || betweenItemInit;
    let newBetween: BetweenItem[] = []
    let from = newBetweenItem.from;
    let to = newBetweenItem.to;
    if(periodKey){
      from = getDateRangePeriod(periodKey).from
      to = getDateRangePeriod(periodKey).to
    }
    newBetween = [{...newBetweenItem, from, to, betweenName:periodKey}]
    set({
      laboratorioFilterForm: {...get().laboratorioFilterForm, between: newBetween},
    });
  },
  setLaboratorioFilterFormBetweenDate: ({name, value}) => {
    const cloneBetweenItem = structuredClone(get().laboratorioFilterForm.between[0]) || betweenItemInit;
    let from = ""
    let to = ""
    if(name === "from"){
      const dateFrom = new Date(value.split(" ")[0]) // obtiene solo la fecha sin la hora
      const dateTo = new Date(cloneBetweenItem.to.split(" ")[0]) // obtiene solo la fecha sin la hora
      from = value
      to = (dateFrom.getTime() <= dateTo.getTime()) ? cloneBetweenItem.to : value
    }else if(name === "to"){
      const dateFrom = new Date(cloneBetweenItem.from.split(" ")[0])
      const dateTo = new Date(value.split(" ")[0])
      from = (dateFrom.getTime() <= dateTo.getTime()) ? cloneBetweenItem.from : value
      to = value
    }
    from = from ? from + " 00:00:00" : ""
    to = to ? to + " 23:59:59" : ""
    set({
      laboratorioFilterForm: {...get().laboratorioFilterForm, between: [{...cloneBetweenItem, from, to}]},
    });
  },
  setLaboratorioFilterParam: () => {
    const sonIguales = deepEqualUnordered(get().laboratorioFilterParam, get().laboratorioFilterForm)
    if(!sonIguales){
      set({ laboratorioFilterParam: {...get().laboratorioFilterForm}});
    }
  },
  setLaboratorioFilterParamBetween: () => {
    if(
      get().laboratorioFilterForm.between[0]?.field_name && 
      get().laboratorioFilterForm.between[0]?.from && 
      get().laboratorioFilterForm.between[0]?.to
    ){
      const from = get().laboratorioFilterForm.between[0]?.from
      const to = get().laboratorioFilterForm.between[0]?.to
      const newLaboratorioFilterParam = { 
        ...get().laboratorioFilterParam, 
        between: [{...get().laboratorioFilterForm.between[0], from, to}]
      }
      const sonIguales = deepEqualUnordered(get().laboratorioFilterParam, newLaboratorioFilterParam)
      if(!sonIguales){
        set({ laboratorioFilterParam: newLaboratorioFilterParam});
      }
    }else{
      if(get().laboratorioFilterParam.between.length){ // Solo resetea si between tiene contenido
        const newLaboratorioFilterParam = { ...get().laboratorioFilterParam, between: [] }
        const sonIguales = deepEqualUnordered(get().laboratorioFilterParam, newLaboratorioFilterParam)
        if(!sonIguales){
          set({ laboratorioFilterParam: newLaboratorioFilterParam});
        }
      }
    }
  },
  setLaboratorioFilterInfo: () => {
    const sonIguales = deepEqualUnordered(get().laboratorioFilterInfo, get().laboratorioFilterParam)
    if(sonIguales) return
    const {order} = get().laboratorioFilterForm
    const newCamposLaboratorios = get().camposLaboratorio.map(el=>{
      const orderh = order.find(order => order.field_name === el.field_name)
      return orderh ? {...el, order_dir: orderh?.order_dir} : {...el, order_dir: ""}
    })
    set({ laboratorioFilterInfo: get().laboratorioFilterForm, camposLaboratorio: newCamposLaboratorios});
  },
}));

export default useLaboratoriosStore;
