import { create } from "zustand";
import { BetweenItem, CampoTable, CommonPeriod, EqualItem, FilterParam, OrderItem } from "../types";
import { betweenItemInit, camposProveedorInit } from "../utils/constants";
import { deepEqualUnordered, getDateRangePeriod } from "../utils/funciones";

const proveedorFilterParamInit: FilterParam = {
  per_page: 50,
  search: "",
  equal: [],
  between: [],
  order: [],
};

interface UseProveedoresStore {
  camposProveedor: CampoTable[];
  showProveedoresFilter: boolean;
  proveedorFilterForm: FilterParam;
  proveedorFilterParam: FilterParam;
  proveedorFilterInfo: FilterParam;
  setCamposProveedor: () => void;
  setShowProveedorFilter: (show: boolean) => void;
  setProveedorFilterForm: (filterParam: FilterParam) => void;
  setProveedorFilterFormSort: (param: {
    field_name: string;
    field_label: string;
    order_dir: "ASC" | "DESC";
  }) => void;
  setProveedorFilterFormSortTable: (param: {
    field_name: string;
    field_label: string;
    ctrlKey: boolean;
  }) => void;
  setProveedorFilterFormEqual: (equalItem: EqualItem) => void;
  setProveedorFilterFormResetEqualItem: (param: {field_name: string}) => void;
  setProveedorFilterFormBetweenField: (param: {field_name: string, field_label: string}) => void;
  setProveedorFilterFormBetweenPeriod: (param: {periodKey: CommonPeriod["key"]}) => void;
  setProveedorFilterFormBetweenDate: (param: {name: string; value: string}) => void;
  setProveedorFilterParam: () => void;
  setProveedorFilterParamBetween: () => void;
  setProveedorFilterInfo: () => void;
}

export const proveedoresStoreInit = {
  camposProveedor: camposProveedorInit,
  showProveedoresFilter: false,
  proveedorFilterForm: proveedorFilterParamInit,
  proveedorFilterParam: proveedorFilterParamInit,
  proveedorFilterInfo: proveedorFilterParamInit,
};

const useProveedoresStore = create<UseProveedoresStore>((set, get) => ({
  ...proveedoresStoreInit,
  setCamposProveedor: () => {
    const { order } = get().proveedorFilterForm;
    const newCamposProveedores = get().camposProveedor.map((el) => {
      const orderh = order.find((order) => order.field_name === el.field_name);
      return orderh
        ? { ...el, order_dir: orderh?.order_dir }
        : { ...el, order_dir: "" };
    });
    set({ camposProveedor: newCamposProveedores });
  },

  setShowProveedorFilter: (show) => {
    set({ showProveedoresFilter: show });
  },
  setProveedorFilterForm: (filterParam) => {
    set({ proveedorFilterForm: filterParam });
  },
  setProveedorFilterFormSort: ({ field_name, field_label, order_dir }) => {
    const newOrder: OrderItem[] = field_name
      ? [{ field_name, order_dir, field_label }]
      : [];
    set({
      proveedorFilterForm: { ...get().proveedorFilterForm, order: newOrder },
    });
  },
  setProveedorFilterFormSortTable: ({ field_name, field_label, ctrlKey }) => {
    const orderIdx = get().proveedorFilterForm.order.findIndex(
      (el) => el.field_name === field_name
    );
    let newOrder: OrderItem[] = [];
    if (ctrlKey) {
      // Orden multiple, click + ctrl
      if (orderIdx === -1) {
        newOrder = [
          ...get().proveedorFilterForm.order,
          { field_name, order_dir: "ASC", field_label },
        ];
      } else {
        newOrder = structuredClone(get().proveedorFilterForm.order);
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
        let newOrders = structuredClone(get().proveedorFilterForm.order);
        newOrder =
          newOrders[orderIdx].order_dir == "ASC"
            ? [{ field_name, order_dir: "DESC", field_label }]
            : [];
      }
    }
    set({
      proveedorFilterForm: { ...get().proveedorFilterForm, order: newOrder },
    });
  },
  setProveedorFilterFormEqual: (equalItem) => {
    const {field_name, field_value, field_label} = equalItem
    let equalClone = structuredClone(get().proveedorFilterForm.equal);
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
      proveedorFilterForm: {...get().proveedorFilterForm, equal: equalClone},
    });
  },
  setProveedorFilterFormResetEqualItem: ({field_name}) => {
    let { equal } = get().proveedorFilterForm;
    equal = equal.filter((el) => el.field_name !== field_name);
    set({
      proveedorFilterForm: {...get().proveedorFilterForm, equal: [...equal]},
    });
  },
  setProveedorFilterFormBetweenField: ({field_name, field_label}) => {
    let newBetween: BetweenItem[] = []
    if(field_name){
      let cloneBetweenItem = structuredClone(get().proveedorFilterForm.between[0]) || betweenItemInit;
      newBetween = [{...cloneBetweenItem, field_name, field_label}]
    }
    set({
      proveedorFilterForm: {...get().proveedorFilterForm, between: newBetween},
    });
  },
  setProveedorFilterFormBetweenPeriod: ({periodKey}) => {
    const newBetweenItem = structuredClone(get().proveedorFilterForm.between[0]) || betweenItemInit;
    let newBetween: BetweenItem[] = []
    let from = newBetweenItem.from;
    let to = newBetweenItem.to;
    if(periodKey){
      from = getDateRangePeriod(periodKey).from
      to = getDateRangePeriod(periodKey).to
    }
    newBetween = [{...newBetweenItem, from, to, betweenName:periodKey}]
    set({
      proveedorFilterForm: {...get().proveedorFilterForm, between: newBetween},
    });
  },
  setProveedorFilterFormBetweenDate: ({name, value}) => {
    const cloneBetweenItem = structuredClone(get().proveedorFilterForm.between[0]) || betweenItemInit;
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
      proveedorFilterForm: {...get().proveedorFilterForm, between: [{...cloneBetweenItem, from, to}]},
    });
  },
  setProveedorFilterParam: () => {
    const sonIguales = deepEqualUnordered(get().proveedorFilterParam, get().proveedorFilterForm)
    if(!sonIguales){
      set({ proveedorFilterParam: {...get().proveedorFilterForm}});
    }
  },
  setProveedorFilterParamBetween: () => {
    if(
      get().proveedorFilterForm.between[0]?.field_name && 
      get().proveedorFilterForm.between[0]?.from && 
      get().proveedorFilterForm.between[0]?.to
    ){
      const from = get().proveedorFilterForm.between[0]?.from
      const to = get().proveedorFilterForm.between[0]?.to
      const newProveedorFilterParam = { 
        ...get().proveedorFilterParam, 
        between: [{...get().proveedorFilterForm.between[0], from, to}]
      }
      const sonIguales = deepEqualUnordered(get().proveedorFilterParam, newProveedorFilterParam)
      if(!sonIguales){
        set({ proveedorFilterParam: newProveedorFilterParam});
      }
    }else{
      if(get().proveedorFilterParam.between.length){ // Solo resetea si between tiene contenido
        const newProveedorFilterParam = { ...get().proveedorFilterParam, between: [] }
        const sonIguales = deepEqualUnordered(get().proveedorFilterParam, newProveedorFilterParam)
        if(!sonIguales){
          set({ proveedorFilterParam: newProveedorFilterParam});
        }
      }
    }
  },
  setProveedorFilterInfo: () => {
    const sonIguales = deepEqualUnordered(get().proveedorFilterInfo, get().proveedorFilterParam)
    if(sonIguales) return
    const {order} = get().proveedorFilterForm
    const newCamposProveedores = get().camposProveedor.map(el=>{
      const orderh = order.find(order => order.field_name === el.field_name)
      return orderh ? {...el, order_dir: orderh?.order_dir} : {...el, order_dir: ""}
    })
    set({ proveedorFilterInfo: get().proveedorFilterForm, camposProveedor: newCamposProveedores});
  },
}));

export default useProveedoresStore;
