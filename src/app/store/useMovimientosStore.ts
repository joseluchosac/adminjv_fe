import { create } from "zustand";
import { BetweenItem, CampoTable, CommonPeriod, EqualItem, FilterParam, OrderItem } from "../types";
import { betweenItemInit, camposMovimientoInit } from "../utils/constants";
import { deepEqualUnordered, getDateRangePeriod } from "../utils/funciones";

const movimientoFilterParamInit: FilterParam = {
  per_page: 50,
  search: "",
  equal: [],
  between: [],
  order: [],
};

interface UseMovimientosStore {
  camposMovimiento: CampoTable[];
  showMovimientoForm: boolean;
  currentMovimientoId: number | null;
  showMovimientosFilter: boolean;
  movimientoFilterForm: FilterParam;
  movimientoFilterParam: FilterParam;
  movimientoFilterInfo: FilterParam;
  setCamposMovimiento: () => void;
  setShowMovimientoForm: (show: boolean) => void;
  setCurrentMovimientoId: (movimientoId: number | null) => void;
  setShowMovimientoFilter: (show: boolean) => void;
  setMovimientoFilterForm: (filterParam: FilterParam) => void;
  setMovimientoFilterFormSort: (param: {
    field_name: string;
    field_label: string;
    order_dir: "ASC" | "DESC";
  }) => void;
  setMovimientoFilterFormSortTable: (param: {
    field_name: string;
    field_label: string;
    ctrlKey: boolean;
  }) => void;
  setMovimientoFilterFormEqual: (equalItem: EqualItem) => void;
  setMovimientoFilterFormResetEqualItem: (param: {field_name: string}) => void;
  setMovimientoFilterFormBetweenField: (param: {field_name: string, field_label: string}) => void;
  setMovimientoFilterFormBetweenPeriod: (param: {periodKey: CommonPeriod["key"]}) => void;
  setMovimientoFilterFormBetweenDate: (param: {name: string; value: string}) => void;
  setMovimientoFilterParam: () => void;
  setMovimientoFilterParamBetween: () => void;
  setMovimientoFilterInfo: () => void;
}

export const movimientosStoreInit = {
  camposMovimiento: camposMovimientoInit,
  showMovimientoForm: false,
  currentMovimientoId: null,
  showMovimientosFilter: false,
  movimientoFilterForm: movimientoFilterParamInit,
  movimientoFilterParam: movimientoFilterParamInit,
  movimientoFilterInfo: movimientoFilterParamInit,
};

const useMovimientosStore = create<UseMovimientosStore>((set, get) => ({
  ...movimientosStoreInit,
  setCamposMovimiento: () => {
    const { order } = get().movimientoFilterForm;
    const newCamposMovimientos = get().camposMovimiento.map((el) => {
      const orderh = order.find((order) => order.field_name === el.field_name);
      return orderh
        ? { ...el, order_dir: orderh?.order_dir }
        : { ...el, order_dir: "" };
    });
    set({ camposMovimiento: newCamposMovimientos });
  },
  setCurrentMovimientoId: (currentMovimientoId) => {
    set({ currentMovimientoId });
  },
  setShowMovimientoForm: (show) => {
    set({ showMovimientoForm: show });
  },
  setShowMovimientoFilter: (show) => {
    set({ showMovimientosFilter: show });
  },
  setMovimientoFilterForm: (filterParam) => {
    set({ movimientoFilterForm: filterParam });
  },
  setMovimientoFilterFormSort: ({ field_name, field_label, order_dir }) => {
    const newOrder: OrderItem[] = field_name
      ? [{ field_name, order_dir, field_label }]
      : [];
    set({
      movimientoFilterForm: { ...get().movimientoFilterForm, order: newOrder },
    });
  },
  setMovimientoFilterFormSortTable: ({ field_name, field_label, ctrlKey }) => {
    const orderIdx = get().movimientoFilterForm.order.findIndex(
      (el) => el.field_name === field_name
    );
    let newOrder: OrderItem[] = [];
    if (ctrlKey) {
      // Orden multiple, click + ctrl
      if (orderIdx === -1) {
        newOrder = [
          ...get().movimientoFilterForm.order,
          { field_name, order_dir: "ASC", field_label },
        ];
      } else {
        newOrder = structuredClone(get().movimientoFilterForm.order);
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
        let newOrders = structuredClone(get().movimientoFilterForm.order);
        newOrder =
          newOrders[orderIdx].order_dir == "ASC"
            ? [{ field_name, order_dir: "DESC", field_label }]
            : [];
      }
    }
    set({
      movimientoFilterForm: { ...get().movimientoFilterForm, order: newOrder },
    });
  },
  setMovimientoFilterFormEqual: (equalItem) => {
    const {field_name, field_value, field_label} = equalItem
    let equalClone = structuredClone(get().movimientoFilterForm.equal);
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
      movimientoFilterForm: {...get().movimientoFilterForm, equal: equalClone},
    });
  },
  setMovimientoFilterFormResetEqualItem: ({field_name}) => {
    let { equal } = get().movimientoFilterForm;
    equal = equal.filter((el) => el.field_name !== field_name);
    set({
      movimientoFilterForm: {...get().movimientoFilterForm, equal: [...equal]},
    });
  },
  setMovimientoFilterFormBetweenField: ({field_name, field_label}) => {
    let newBetween: BetweenItem[] = []
    if(field_name){
      let cloneBetweenItem = structuredClone(get().movimientoFilterForm.between[0]) || betweenItemInit;
      newBetween = [{...cloneBetweenItem, field_name, field_label}]
    }
    set({
      movimientoFilterForm: {...get().movimientoFilterForm, between: newBetween},
    });
  },
  setMovimientoFilterFormBetweenPeriod: ({periodKey}) => {
    const newBetweenItem = structuredClone(get().movimientoFilterForm.between[0]) || betweenItemInit;
    let newBetween: BetweenItem[] = []
    let from = newBetweenItem.from;
    let to = newBetweenItem.to;
    if(periodKey){
      from = getDateRangePeriod(periodKey).from
      to = getDateRangePeriod(periodKey).to
    }
    newBetween = [{...newBetweenItem, from, to, betweenName:periodKey}]
    set({
      movimientoFilterForm: {...get().movimientoFilterForm, between: newBetween},
    });
  },
  setMovimientoFilterFormBetweenDate: ({name, value}) => {
    const cloneBetweenItem = structuredClone(get().movimientoFilterForm.between[0]) || betweenItemInit;
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
      movimientoFilterForm: {...get().movimientoFilterForm, between: [{...cloneBetweenItem, from, to}]},
    });
  },
  setMovimientoFilterParam: () => {
    const sonIguales = deepEqualUnordered(get().movimientoFilterParam, get().movimientoFilterForm)
    if(!sonIguales){
      set({ movimientoFilterParam: {...get().movimientoFilterForm}});
    }
  },
  setMovimientoFilterParamBetween: () => {
    if(
      get().movimientoFilterForm.between[0]?.field_name && 
      get().movimientoFilterForm.between[0]?.from && 
      get().movimientoFilterForm.between[0]?.to
    ){
      const from = get().movimientoFilterForm.between[0]?.from
      const to = get().movimientoFilterForm.between[0]?.to
      const newMovimientoFilterParam = { 
        ...get().movimientoFilterParam, 
        between: [{...get().movimientoFilterForm.between[0], from, to}]
      }
      const sonIguales = deepEqualUnordered(get().movimientoFilterParam, newMovimientoFilterParam)
      if(!sonIguales){
        set({ movimientoFilterParam: newMovimientoFilterParam});
      }
    }else{
      if(get().movimientoFilterParam.between.length){ // Solo resetea si between tiene contenido
        const newMovimientoFilterParam = { ...get().movimientoFilterParam, between: [] }
        const sonIguales = deepEqualUnordered(get().movimientoFilterParam, newMovimientoFilterParam)
        if(!sonIguales){
          set({ movimientoFilterParam: newMovimientoFilterParam});
        }
      }
    }
  },
  setMovimientoFilterInfo: () => {
    const sonIguales = deepEqualUnordered(get().movimientoFilterInfo, get().movimientoFilterParam)
    if(sonIguales) return
    const {order} = get().movimientoFilterForm
    const newCamposMovimientos = get().camposMovimiento.map(el=>{
      const orderh = order.find(order => order.field_name === el.field_name)
      return orderh ? {...el, order_dir: orderh?.order_dir} : {...el, order_dir: ""}
    })
    set({ movimientoFilterInfo: get().movimientoFilterForm, camposMovimiento: newCamposMovimientos});
  },
}));

export default useMovimientosStore;
