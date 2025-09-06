import { BetweenItem, CampoTable, CommonPeriod, EqualItem, FilterParam, OrderItem } from "../../../app/types";
import { betweenItemInit, camposUserInit } from "../../../app/utils/constants";
import { deepEqualUnordered, getDateRangePeriod } from "../../../app/utils/funciones";

const userFilterParamInit: FilterParam = {
  per_page: 50,
  search: '',
  equal: [],
  between: [],
  order: [],
}

export type UsersStateType = {
  camposUser: CampoTable[];
  showUserForm: boolean;
  currentUserId: number | null;
  showUsersFilter: boolean;
  userFilterForm: FilterParam; // Parametros de formulario de filtro
  userFilterParam: FilterParam; // Parametros para el envio al back-end
  userFilterInfo: FilterParam; // Parametros para mostrar la informacion en el front-end
}

export type UsersActionsType = 
  { type: 'SET_CAMPOS_USER' } | // devaluar deprecar, esta funcion se ejecuta en SET_USER_FILTER_INFO
  { type: 'SET_SHOW_USER_FORM'; payload: {showUserForm: boolean, currentUserId: number | null} } |
  { type: 'SET_SHOW_USER_FILTER'; payload: boolean } |
  { type: 'SET_OFFSET'; payload: number } |
  { type: 'SET_USER_FILTER_FORM'; payload: FilterParam } |
  { 
    type: 'SET_USER_FILTER_FORM_SORT'; // Ordenar desde selects
    payload: {field_name:string; field_label: string; order_dir: "ASC" | "DESC"}
  } |
  { 
    type: 'SET_USER_FILTER_FORM_SORT_TABLE'; // Ordenar desde los encabezados de la tabla
    payload: {field_name:string; field_label: string; ctrlKey: boolean}
  } |
  { type: 'SET_USER_FILTER_FORM_EQUAL'; payload: EqualItem } |
  { 
    type: 'SET_USER_FILTER_FORM_RESET_EQUAL_ITEM';
    payload: {field_name: string}
  } |
  { 
    type: 'SET_USER_FILTER_FORM_BETWEEN_FIELD';
    payload: {field_name: string, field_label: string}
  } |
  { 
    type: 'SET_USER_FILTER_FORM_BETWEEN_PERIOD';
    payload: {periodKey: CommonPeriod["key"]}
  } |
  { 
    type: 'SET_USER_FILTER_FORM_BETWEEN_DATE';
    payload: {name: string; value: string}
  } |
  { type: 'SET_USER_FILTER_PARAM';} |
  { type: 'SET_USER_FILTER_PARAM_BETWEEN';} |
  { type: 'SET_USER_FILTER_INFO' };

export const usersStateInit: UsersStateType = {
  camposUser: camposUserInit,
  showUserForm: false,
  currentUserId: null,
  showUsersFilter: false,
  userFilterParam: userFilterParamInit,
  userFilterForm: userFilterParamInit,
  userFilterInfo: userFilterParamInit,
}

export const usersReducer = (
  state: UsersStateType = usersStateInit,
  action: UsersActionsType
) => {
  switch (action.type) {
    case 'SET_CAMPOS_USER':{
      const {order} = state.userFilterForm
      const newCamposUsers = state.camposUser.map(el=>{
        const orderh = order.find(order => order.field_name === el.field_name)
        return orderh ? {...el, order_dir: orderh?.order_dir} : {...el, order_dir: ""}
      })
      return { ...state, camposUser: newCamposUsers }
    };
    case 'SET_SHOW_USER_FORM':{
      const {showUserForm, currentUserId} = action.payload
      return { ...state, showUserForm, currentUserId }
    };
    case 'SET_SHOW_USER_FILTER':
      {return { ...state, showUsersFilter: action.payload }};
    case 'SET_OFFSET':
      {return { ...state, userFilterForm: {...state.userFilterForm, per_page: action.payload} }};
    case 'SET_USER_FILTER_FORM':
      {return { ...state, userFilterForm: action.payload }};
    case 'SET_USER_FILTER_FORM_SORT': {
      const {field_name, field_label, order_dir} = action.payload
      const newOrders: OrderItem[] = field_name ? [{field_name, order_dir, field_label}] : []
      return { ...state, userFilterForm: {...state.userFilterForm, order: newOrders} }
    };
    case 'SET_USER_FILTER_FORM_SORT_TABLE': {
      const {field_name, field_label, ctrlKey} = action.payload
      const orderIdx = state.userFilterForm.order.findIndex(el => el.field_name === field_name)
      let newOrder: OrderItem[] = []
      if(ctrlKey){ // Orden multiple, click + ctrl
        if(orderIdx === -1){
          newOrder = [...state.userFilterForm.order, {field_name, order_dir: "ASC", field_label}]
        }else{
          newOrder = structuredClone(state.userFilterForm.order)
          if(newOrder[orderIdx].order_dir == "ASC"){
            newOrder[orderIdx] = {field_name, order_dir: "DESC", field_label}
          }else{
            newOrder = newOrder.filter(el=>el.field_name !== field_name)
          }
        }
      }else{
        if(orderIdx === -1){// Si no esta ordenado
          newOrder = [{field_name, order_dir: "ASC", field_label}]
        }else{
          let newOrders = structuredClone(state.userFilterForm.order)
          newOrder = (newOrders[orderIdx].order_dir == "ASC")
            ? [{field_name, order_dir: "DESC", field_label}]
            : []
        }
      }
      return { ...state, userFilterForm: {...state.userFilterForm, order: newOrder} }
    }
    case 'SET_USER_FILTER_FORM_EQUAL': {
      const {field_name, field_value, field_label} = action.payload
      let equalClone = structuredClone(state.userFilterForm.equal);
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
      return { ...state, userFilterForm: {...state.userFilterForm, equal: equalClone} }
    }
    case 'SET_USER_FILTER_FORM_RESET_EQUAL_ITEM': {
      const {field_name} = action.payload
      let { equal } = state.userFilterForm;
      equal = equal.filter((el) => el.field_name !== field_name);
      return { ...state, userFilterForm: {...state.userFilterForm, equal: [...equal]} }
    }
    case 'SET_USER_FILTER_FORM_BETWEEN_FIELD': {
      const {field_name, field_label} = action.payload
    let newBetween: BetweenItem[] = []
    if(field_name){
      let cloneBetweenItem = structuredClone(state.userFilterForm.between[0]) || betweenItemInit;
      newBetween = [{...cloneBetweenItem, field_name, field_label}]
    }
      return { ...state, userFilterForm: { ...state.userFilterForm, between: newBetween } }
    }
    case 'SET_USER_FILTER_FORM_BETWEEN_PERIOD': {
      const {periodKey} = action.payload
      const newBetweenItem = structuredClone(state.userFilterForm.between[0]) || betweenItemInit;
      let newBetween: BetweenItem[] = []
      let from = newBetweenItem.from;
      let to = newBetweenItem.to;
      if(periodKey){
        from = getDateRangePeriod(periodKey).from
        to = getDateRangePeriod(periodKey).to
      }
      newBetween = [{...newBetweenItem, from, to, betweenName:periodKey}]
      return { ...state, userFilterForm: { ...state.userFilterForm, between: newBetween } }
    }
    case 'SET_USER_FILTER_FORM_BETWEEN_DATE': {
      const {name, value} = action.payload
      const cloneBetweenItem = structuredClone(state.userFilterForm.between[0]) || betweenItemInit;
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
      return { ...state, userFilterForm: { ...state.userFilterForm, between: [{...cloneBetweenItem, from, to}] } }
    }
    
    case 'SET_USER_FILTER_PARAM': { 
      const sonIguales = deepEqualUnordered(state.userFilterParam, state.userFilterForm)
      if(sonIguales) return state
      return { ...state, userFilterParam: {...state.userFilterForm} } 
    };
    case 'SET_USER_FILTER_PARAM_BETWEEN': {
      if(
        state.userFilterForm.between[0]?.field_name && 
        state.userFilterForm.between[0]?.from && 
        state.userFilterForm.between[0]?.to
      ){
        const from = state.userFilterForm.between[0]?.from
        const to = state.userFilterForm.between[0]?.to
        // const from = state.userFilterForm.between[0]?.from + " 00:00:00"
        // const to = state.userFilterForm.between[0]?.to + " 23:59:59"
        const newUserFilterParam = { 
          ...state.userFilterParam, 
          between: [{...state.userFilterForm.between[0], from, to}] 
        }
        const sonIguales = deepEqualUnordered(state.userFilterParam, newUserFilterParam)
        if(sonIguales) return state
        return { ...state, userFilterParam: newUserFilterParam }
      }else{
        if(state.userFilterParam.between.length){ // Solo resetea si between tiene contenido
          const newUserFilterParam = { ...state.userFilterParam, between: [] }
          const sonIguales = deepEqualUnordered(state.userFilterParam, newUserFilterParam)
          if(sonIguales) return state
          return { ...state, userFilterParam: newUserFilterParam }
        }
      }
      return state;
    };
    case 'SET_USER_FILTER_INFO':{
      const {order} = state.userFilterForm
      const newCamposUsers = state.camposUser.map(el=>{
        const orderh = order.find(order => order.field_name === el.field_name)
        return orderh ? {...el, order_dir: orderh?.order_dir} : {...el, order_dir: ""}
      })
      return { ...state, userFilterInfo: state.userFilterForm, camposUser: newCamposUsers }
    };
    default:
      return state;
  }
}