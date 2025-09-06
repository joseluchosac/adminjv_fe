import { create } from "zustand";
import { BetweenItem, CampoTable, CommonPeriod, EqualItem, FilterParam, OrderItem } from "../types";
import { betweenItemInit, camposClienteInit } from "../utils/constants";
import { deepEqualUnordered, getDateRangePeriod } from "../utils/funciones";

const clienteFilterParamInit: FilterParam = {
  per_page: 50,
  search: "",
  equal: [],
  between: [],
  order: [],
};

interface UseClientesStore {
  camposCliente: CampoTable[];
  showClienteForm: boolean;
  currentClienteId: number | null;
  showClientesFilter: boolean;
  clienteFilterForm: FilterParam;
  clienteFilterParam: FilterParam;
  clienteFilterInfo: FilterParam;
  setCamposCliente: () => void;
  setShowClienteForm: (param: {
    showClienteForm: boolean;
    currentClienteId: number | null;
  }) => void;
  setCurrentClienteId: (clienteId: number | null) => void;
  setShowClienteFilter: (show: boolean) => void;
  setClienteFilterForm: (filterParam: FilterParam) => void;
  setClienteFilterFormSort: (param: {
    field_name: string;
    field_label: string;
    order_dir: "ASC" | "DESC";
  }) => void;
  setClienteFilterFormSortTable: (param: {
    field_name: string;
    field_label: string;
    ctrlKey: boolean;
  }) => void;
  setClienteFilterFormEqual: (equalItem: EqualItem) => void;
  setClienteFilterFormResetEqualItem: (param: {field_name: string}) => void;
  setClienteFilterFormBetweenField: (param: {field_name: string, field_label: string}) => void;
  setClienteFilterFormBetweenPeriod: (param: {periodKey: CommonPeriod["key"]}) => void;
  setClienteFilterFormBetweenDate: (param: {name: string; value: string}) => void;
  setClienteFilterParam: () => void;
  setClienteFilterParamBetween: () => void;
  setClienteFilterInfo: () => void;
}

export const clientesStoreInit = {
  camposCliente: camposClienteInit,
  showClienteForm: false,
  currentClienteId: null,
  showClientesFilter: false,
  clienteFilterForm: clienteFilterParamInit,
  clienteFilterParam: clienteFilterParamInit,
  clienteFilterInfo: clienteFilterParamInit,
};

const useClientesStore = create<UseClientesStore>((set, get) => ({
  ...clientesStoreInit,
  setCamposCliente: () => {
    const { order } = get().clienteFilterForm;
    const newCamposClientes = get().camposCliente.map((el) => {
      const orderh = order.find((order) => order.field_name === el.field_name);
      return orderh
        ? { ...el, order_dir: orderh?.order_dir }
        : { ...el, order_dir: "" };
    });
    set({ camposCliente: newCamposClientes });
  },
  setCurrentClienteId: (currentClienteId) => {
    set({ currentClienteId });
  },
  setShowClienteForm: ({ showClienteForm, currentClienteId }) => {
    set({ showClienteForm, currentClienteId });
  },
  setShowClienteFilter: (show) => {
    set({ showClientesFilter: show });
  },
  setClienteFilterForm: (filterParam) => {
    set({ clienteFilterForm: filterParam });
  },
  setClienteFilterFormSort: ({ field_name, field_label, order_dir }) => {
    const newOrder: OrderItem[] = field_name
      ? [{ field_name, order_dir, field_label }]
      : [];
    set({
      clienteFilterForm: { ...get().clienteFilterForm, order: newOrder },
    });
  },
  setClienteFilterFormSortTable: ({ field_name, field_label, ctrlKey }) => {
    const orderIdx = get().clienteFilterForm.order.findIndex(
      (el) => el.field_name === field_name
    );
    let newOrder: OrderItem[] = [];
    if (ctrlKey) {
      // Orden multiple, click + ctrl
      if (orderIdx === -1) {
        newOrder = [
          ...get().clienteFilterForm.order,
          { field_name, order_dir: "ASC", field_label },
        ];
      } else {
        newOrder = structuredClone(get().clienteFilterForm.order);
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
        let newOrders = structuredClone(get().clienteFilterForm.order);
        newOrder =
          newOrders[orderIdx].order_dir == "ASC"
            ? [{ field_name, order_dir: "DESC", field_label }]
            : [];
      }
    }
    set({
      clienteFilterForm: { ...get().clienteFilterForm, order: newOrder },
    });
  },
  setClienteFilterFormEqual: (equalItem) => {
    const {field_name, field_value, field_label} = equalItem
    let equalClone = structuredClone(get().clienteFilterForm.equal);
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
      clienteFilterForm: {...get().clienteFilterForm, equal: equalClone},
    });
  },
  setClienteFilterFormResetEqualItem: ({field_name}) => {
    let { equal } = get().clienteFilterForm;
    equal = equal.filter((el) => el.field_name !== field_name);
    set({
      clienteFilterForm: {...get().clienteFilterForm, equal: [...equal]},
    });
  },
  setClienteFilterFormBetweenField: ({field_name, field_label}) => {
    let newBetween: BetweenItem[] = []
    if(field_name){
      let cloneBetweenItem = structuredClone(get().clienteFilterForm.between[0]) || betweenItemInit;
      newBetween = [{...cloneBetweenItem, field_name, field_label}]
    }
    set({
      clienteFilterForm: {...get().clienteFilterForm, between: newBetween},
    });
  },
  setClienteFilterFormBetweenPeriod: ({periodKey}) => {
    const newBetweenItem = structuredClone(get().clienteFilterForm.between[0]) || betweenItemInit;
    let newBetween: BetweenItem[] = []
    let from = newBetweenItem.from;
    let to = newBetweenItem.to;
    if(periodKey){
      from = getDateRangePeriod(periodKey).from
      to = getDateRangePeriod(periodKey).to
    }
    newBetween = [{...newBetweenItem, from, to, betweenName:periodKey}]
    set({
      clienteFilterForm: {...get().clienteFilterForm, between: newBetween},
    });
  },
  setClienteFilterFormBetweenDate: ({name, value}) => {
    const cloneBetweenItem = structuredClone(get().clienteFilterForm.between[0]) || betweenItemInit;
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
      clienteFilterForm: {...get().clienteFilterForm, between: [{...cloneBetweenItem, from, to}]},
    });
  },
  setClienteFilterParam: () => {
    const sonIguales = deepEqualUnordered(get().clienteFilterParam, get().clienteFilterForm)
    if(!sonIguales){
      set({ clienteFilterParam: {...get().clienteFilterForm}});
    }
  },
  setClienteFilterParamBetween: () => {
    if(
      get().clienteFilterForm.between[0]?.field_name && 
      get().clienteFilterForm.between[0]?.from && 
      get().clienteFilterForm.between[0]?.to
    ){
      const from = get().clienteFilterForm.between[0]?.from
      const to = get().clienteFilterForm.between[0]?.to
      const newClienteFilterParam = { 
        ...get().clienteFilterParam, 
        between: [{...get().clienteFilterForm.between[0], from, to}]
      }
      const sonIguales = deepEqualUnordered(get().clienteFilterParam, newClienteFilterParam)
      if(!sonIguales){
        set({ clienteFilterParam: newClienteFilterParam});
      }
    }else{
      if(get().clienteFilterParam.between.length){ // Solo resetea si between tiene contenido
        const newClienteFilterParam = { ...get().clienteFilterParam, between: [] }
        const sonIguales = deepEqualUnordered(get().clienteFilterParam, newClienteFilterParam)
        if(!sonIguales){
          set({ clienteFilterParam: newClienteFilterParam});
        }
      }
    }
  },
  setClienteFilterInfo: () => {
    const sonIguales = deepEqualUnordered(get().clienteFilterInfo, get().clienteFilterParam)
    if(sonIguales) return
    const {order} = get().clienteFilterForm
    const newCamposClientes = get().camposCliente.map(el=>{
      const orderh = order.find(order => order.field_name === el.field_name)
      return orderh ? {...el, order_dir: orderh?.order_dir} : {...el, order_dir: ""}
    })
    set({ clienteFilterInfo: get().clienteFilterForm, camposCliente: newCamposClientes});
  },
}));

export default useClientesStore;
