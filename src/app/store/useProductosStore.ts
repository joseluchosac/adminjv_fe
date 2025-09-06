import { create } from "zustand";
import { BetweenItem, CampoTable, CategoriaOpc, CommonPeriod, EqualItem, FilterParam, OrderItem } from "../types";
import { betweenItemInit, camposProductoInit } from "../utils/constants";
import { deepEqualUnordered, getDateRangePeriod } from "../utils/funciones";

const productoFilterParamInit: FilterParam = {
  per_page: 50,
  search: "",
  equal: [],
  between: [],
  order: [],
};

interface UseProductosStore {
  camposProducto: CampoTable[];
  showProductoForm: boolean;
  currentProductoId: number | null;
  categoriasOpc: CategoriaOpc[] | null;
  showProductosFilter: boolean;
  productoFilterForm: FilterParam;
  productoFilterParam: FilterParam;
  productoFilterInfo: FilterParam;
  setCamposProducto: () => void;
  setShowProductoForm: (show: boolean) => void;
  setCurrentProductoId: (productoId: number | null) => void;
  setCategoriasOpc: (categoriasOpc: CategoriaOpc[] | null) => void;
  setShowProductoFilter: (show: boolean) => void;
  setProductoFilterForm: (filterParam: FilterParam) => void;
  setProductoFilterFormSort: (param: {
    field_name: string;
    field_label: string;
    order_dir: "ASC" | "DESC";
  }) => void;
  setProductoFilterFormSortTable: (param: {
    field_name: string;
    field_label: string;
    ctrlKey: boolean;
  }) => void;
  setProductoFilterFormEqual: (equalItem: EqualItem) => void;
  setProductoFilterFormResetEqualItem: (param: {field_name: string}) => void;
  setProductoFilterFormBetweenField: (param: {field_name: string, field_label: string}) => void;
  setProductoFilterFormBetweenPeriod: (param: {periodKey: CommonPeriod["key"]}) => void;
  setProductoFilterFormBetweenDate: (param: {name: string; value: string}) => void;
  setProductoFilterParam: () => void;
  setProductoFilterParamBetween: () => void;
  setProductoFilterInfo: () => void;
}

export const productosStoreInit = {
  camposProducto: camposProductoInit,
  showProductoForm: false,
  currentProductoId: null,
  categoriasOpc: null,
  showProductosFilter: false,
  productoFilterForm: productoFilterParamInit,
  productoFilterParam: productoFilterParamInit,
  productoFilterInfo: productoFilterParamInit,
};

const useProductosStore = create<UseProductosStore>((set, get) => ({
  ...productosStoreInit,
  setCamposProducto: () => {
    const { order } = get().productoFilterForm;
    const newCamposProductos = get().camposProducto.map((el) => {
      const orderh = order.find((order) => order.field_name === el.field_name);
      return orderh
        ? { ...el, order_dir: orderh?.order_dir }
        : { ...el, order_dir: "" };
    });
    set({ camposProducto: newCamposProductos });
  },
  setCurrentProductoId: (currentProductoId) => {
    set({ currentProductoId });
  },
  setCategoriasOpc: (categoriasOpc) => {
    set({ categoriasOpc });
  },
  setShowProductoForm: (show) => {
    set({ showProductoForm: show });
  },
  setShowProductoFilter: (show) => {
    set({ showProductosFilter: show });
  },
  setProductoFilterForm: (filterParam) => {
    set({ productoFilterForm: filterParam });
  },
  setProductoFilterFormSort: ({ field_name, field_label, order_dir }) => {
    const newOrder: OrderItem[] = field_name
      ? [{ field_name, order_dir, field_label }]
      : [];
    set({
      productoFilterForm: { ...get().productoFilterForm, order: newOrder },
    });
  },
  setProductoFilterFormSortTable: ({ field_name, field_label, ctrlKey }) => {
    const orderIdx = get().productoFilterForm.order.findIndex(
      (el) => el.field_name === field_name
    );
    let newOrder: OrderItem[] = [];
    if (ctrlKey) {
      // Orden multiple, click + ctrl
      if (orderIdx === -1) {
        newOrder = [
          ...get().productoFilterForm.order,
          { field_name, order_dir: "ASC", field_label },
        ];
      } else {
        newOrder = structuredClone(get().productoFilterForm.order);
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
        let newOrders = structuredClone(get().productoFilterForm.order);
        newOrder =
          newOrders[orderIdx].order_dir == "ASC"
            ? [{ field_name, order_dir: "DESC", field_label }]
            : [];
      }
    }
    set({
      productoFilterForm: { ...get().productoFilterForm, order: newOrder },
    });
  },
  setProductoFilterFormEqual: (equalItem) => {
    const {field_name, field_value, field_label} = equalItem
    let equalClone = structuredClone(get().productoFilterForm.equal);
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
      productoFilterForm: {...get().productoFilterForm, equal: equalClone},
    });
  },
  setProductoFilterFormResetEqualItem: ({field_name}) => {
    let { equal } = get().productoFilterForm;
    equal = equal.filter((el) => el.field_name !== field_name);
    set({
      productoFilterForm: {...get().productoFilterForm, equal: [...equal]},
    });
  },
  setProductoFilterFormBetweenField: ({field_name, field_label}) => {
    let newBetween: BetweenItem[] = []
    if(field_name){
      let cloneBetweenItem = structuredClone(get().productoFilterForm.between[0]) || betweenItemInit;
      newBetween = [{...cloneBetweenItem, field_name, field_label}]
    }
    set({
      productoFilterForm: {...get().productoFilterForm, between: newBetween},
    });
  },
  setProductoFilterFormBetweenPeriod: ({periodKey}) => {
    const newBetweenItem = structuredClone(get().productoFilterForm.between[0]) || betweenItemInit;
    let newBetween: BetweenItem[] = []
    let from = newBetweenItem.from;
    let to = newBetweenItem.to;
    if(periodKey){
      from = getDateRangePeriod(periodKey).from
      to = getDateRangePeriod(periodKey).to
    }
    newBetween = [{...newBetweenItem, from, to, betweenName:periodKey}]
    set({
      productoFilterForm: {...get().productoFilterForm, between: newBetween},
    });
  },
  setProductoFilterFormBetweenDate: ({name, value}) => {
    const cloneBetweenItem = structuredClone(get().productoFilterForm.between[0]) || betweenItemInit;
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
      productoFilterForm: {...get().productoFilterForm, between: [{...cloneBetweenItem, from, to}]},
    });
  },
  setProductoFilterParam: () => {
    const sonIguales = deepEqualUnordered(get().productoFilterParam, get().productoFilterForm)
    if(!sonIguales){
      set({ productoFilterParam: {...get().productoFilterForm}});
    }
  },
  setProductoFilterParamBetween: () => {
    if(
      get().productoFilterForm.between[0]?.field_name && 
      get().productoFilterForm.between[0]?.from && 
      get().productoFilterForm.between[0]?.to
    ){
      const from = get().productoFilterForm.between[0]?.from
      const to = get().productoFilterForm.between[0]?.to
      const newProductoFilterParam = { 
        ...get().productoFilterParam, 
        between: [{...get().productoFilterForm.between[0], from, to}]
      }
      const sonIguales = deepEqualUnordered(get().productoFilterParam, newProductoFilterParam)
      if(!sonIguales){
        set({ productoFilterParam: newProductoFilterParam});
      }
    }else{
      if(get().productoFilterParam.between.length){ // Solo resetea si between tiene contenido
        const newProductoFilterParam = { ...get().productoFilterParam, between: [] }
        const sonIguales = deepEqualUnordered(get().productoFilterParam, newProductoFilterParam)
        if(!sonIguales){
          set({ productoFilterParam: newProductoFilterParam});
        }
      }
    }
  },
  setProductoFilterInfo: () => {
    const sonIguales = deepEqualUnordered(get().productoFilterInfo, get().productoFilterParam)
    if(sonIguales) return
    const {order} = get().productoFilterForm
    const newCamposProductos = get().camposProducto.map(el=>{
      const orderh = order.find(order => order.field_name === el.field_name)
      return orderh ? {...el, order_dir: orderh?.order_dir} : {...el, order_dir: ""}
    })
    set({ productoFilterInfo: get().productoFilterForm, camposProducto: newCamposProductos});
  },
}));

export default useProductosStore;
