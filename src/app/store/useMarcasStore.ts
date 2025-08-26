import { create } from "zustand";
import { BetweenItem, CampoTable, CommonPeriod, EqualItem, FilterParam, OrderItem } from "../types";
import { betweenItemInit, camposMarcaInit } from "../utils/constants";
import { deepEqualUnordered, getDateRangePeriod } from "../utils/funciones";

const marcaFilterParamInit: FilterParam = {
  offset: 50,
  search: "",
  equal: [],
  between: [],
  order: [],
};

interface UseMarcasStore {
  camposMarca: CampoTable[];
  showMarcaForm: boolean;
  currentMarcaId: number | null;
  showMarcasFilter: boolean;
  marcaFilterForm: FilterParam;
  marcaFilterParam: FilterParam;
  marcaFilterInfo: FilterParam;
  setCamposMarca: () => void;
  setShowMarcaForm: (param: {
    showMarcaForm: boolean;
    currentMarcaId: number | null;
  }) => void;
  setCurrentMarcaId: (marcaId: number | null) => void;
  setShowMarcaFilter: (show: boolean) => void;
  setMarcaFilterForm: (filterParam: FilterParam) => void;
  setMarcaFilterFormSort: (param: {
    field_name: string;
    field_label: string;
    order_dir: "ASC" | "DESC";
  }) => void;
  setMarcaFilterFormSortTable: (param: {
    field_name: string;
    field_label: string;
    ctrlKey: boolean;
  }) => void;
  setMarcaFilterFormEqual: (equalItem: EqualItem) => void;
  setMarcaFilterFormResetEqualItem: (param: {field_name: string}) => void;
  setMarcaFilterFormBetweenField: (param: {field_name: string, field_label: string}) => void;
  setMarcaFilterFormBetweenPeriod: (param: {periodKey: CommonPeriod["key"]}) => void;
  setMarcaFilterFormBetweenDate: (param: {name: string; value: string}) => void;
  setMarcaFilterParam: () => void;
  setMarcaFilterParamBetween: () => void;
  setMarcaFilterInfo: () => void;
}

export const marcasStoreInit = {
  camposMarca: camposMarcaInit,
  showMarcaForm: false,
  currentMarcaId: null,
  showMarcasFilter: false,
  marcaFilterForm: marcaFilterParamInit,
  marcaFilterParam: marcaFilterParamInit,
  marcaFilterInfo: marcaFilterParamInit,
};

const useMarcasStore = create<UseMarcasStore>((set, get) => ({
  ...marcasStoreInit,
  setCamposMarca: () => {
    const { order } = get().marcaFilterForm;
    const newCamposMarcas = get().camposMarca.map((el) => {
      const orderh = order.find((order) => order.field_name === el.field_name);
      return orderh
        ? { ...el, order_dir: orderh?.order_dir }
        : { ...el, order_dir: "" };
    });
    set({ camposMarca: newCamposMarcas });
  },
  setCurrentMarcaId: (currentMarcaId) => {
    set({ currentMarcaId });
  },
  setShowMarcaForm: ({ showMarcaForm, currentMarcaId }) => {
    set({ showMarcaForm, currentMarcaId });
  },
  setShowMarcaFilter: (show) => {
    set({ showMarcasFilter: show });
  },
  setMarcaFilterForm: (filterParam) => {
    set({ marcaFilterForm: filterParam });
  },
  setMarcaFilterFormSort: ({ field_name, field_label, order_dir }) => {
    const newOrder: OrderItem[] = field_name
      ? [{ field_name, order_dir, field_label }]
      : [];
    set({
      marcaFilterForm: { ...get().marcaFilterForm, order: newOrder },
    });
  },
  setMarcaFilterFormSortTable: ({ field_name, field_label, ctrlKey }) => {
    const orderIdx = get().marcaFilterForm.order.findIndex(
      (el) => el.field_name === field_name
    );
    let newOrder: OrderItem[] = [];
    if (ctrlKey) {
      // Orden multiple, click + ctrl
      if (orderIdx === -1) {
        newOrder = [
          ...get().marcaFilterForm.order,
          { field_name, order_dir: "ASC", field_label },
        ];
      } else {
        newOrder = structuredClone(get().marcaFilterForm.order);
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
        let newOrders = structuredClone(get().marcaFilterForm.order);
        newOrder =
          newOrders[orderIdx].order_dir == "ASC"
            ? [{ field_name, order_dir: "DESC", field_label }]
            : [];
      }
    }
    set({
      marcaFilterForm: { ...get().marcaFilterForm, order: newOrder },
    });
  },
  setMarcaFilterFormEqual: (equalItem) => {
    const {field_name, field_value, field_label} = equalItem
    let equalClone = structuredClone(get().marcaFilterForm.equal);
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
      marcaFilterForm: {...get().marcaFilterForm, equal: equalClone},
    });
  },
  setMarcaFilterFormResetEqualItem: ({field_name}) => {
    let { equal } = get().marcaFilterForm;
    equal = equal.filter((el) => el.field_name !== field_name);
    set({
      marcaFilterForm: {...get().marcaFilterForm, equal: [...equal]},
    });
  },
  setMarcaFilterFormBetweenField: ({field_name, field_label}) => {
    let newBetween: BetweenItem[] = []
    if(field_name){
      let cloneBetweenItem = structuredClone(get().marcaFilterForm.between[0]) || betweenItemInit;
      newBetween = [{...cloneBetweenItem, field_name, field_label}]
    }
    set({
      marcaFilterForm: {...get().marcaFilterForm, between: newBetween},
    });
  },
  setMarcaFilterFormBetweenPeriod: ({periodKey}) => {
    const newBetweenItem = structuredClone(get().marcaFilterForm.between[0]) || betweenItemInit;
    let newBetween: BetweenItem[] = []
    let from = newBetweenItem.from;
    let to = newBetweenItem.to;
    if(periodKey){
      from = getDateRangePeriod(periodKey).from
      to = getDateRangePeriod(periodKey).to
    }
    newBetween = [{...newBetweenItem, from, to, betweenName:periodKey}]
    set({
      marcaFilterForm: {...get().marcaFilterForm, between: newBetween},
    });
  },
  setMarcaFilterFormBetweenDate: ({name, value}) => {
    const cloneBetweenItem = structuredClone(get().marcaFilterForm.between[0]) || betweenItemInit;
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
      marcaFilterForm: {...get().marcaFilterForm, between: [{...cloneBetweenItem, from, to}]},
    });
  },
  setMarcaFilterParam: () => {
    const sonIguales = deepEqualUnordered(get().marcaFilterParam, get().marcaFilterForm)
    if(!sonIguales){
      set({ marcaFilterParam: {...get().marcaFilterForm}});
    }
  },
  setMarcaFilterParamBetween: () => {
    if(
      get().marcaFilterForm.between[0]?.field_name && 
      get().marcaFilterForm.between[0]?.from && 
      get().marcaFilterForm.between[0]?.to
    ){
      const from = get().marcaFilterForm.between[0]?.from
      const to = get().marcaFilterForm.between[0]?.to
      const newMarcaFilterParam = { 
        ...get().marcaFilterParam, 
        between: [{...get().marcaFilterForm.between[0], from, to}]
      }
      const sonIguales = deepEqualUnordered(get().marcaFilterParam, newMarcaFilterParam)
      if(!sonIguales){
        set({ marcaFilterParam: newMarcaFilterParam});
      }
    }else{
      if(get().marcaFilterParam.between.length){ // Solo resetea si between tiene contenido
        const newMarcaFilterParam = { ...get().marcaFilterParam, between: [] }
        const sonIguales = deepEqualUnordered(get().marcaFilterParam, newMarcaFilterParam)
        if(!sonIguales){
          set({ marcaFilterParam: newMarcaFilterParam});
        }
      }
    }
  },
  setMarcaFilterInfo: () => {
    const sonIguales = deepEqualUnordered(get().marcaFilterInfo, get().marcaFilterParam)
    if(sonIguales) return
    const {order} = get().marcaFilterForm
    const newCamposMarcas = get().camposMarca.map(el=>{
      const orderh = order.find(order => order.field_name === el.field_name)
      return orderh ? {...el, order_dir: orderh?.order_dir} : {...el, order_dir: ""}
    })
    set({ marcaFilterInfo: get().marcaFilterForm, camposMarca: newCamposMarcas});
  },
}));

export default useMarcasStore;
