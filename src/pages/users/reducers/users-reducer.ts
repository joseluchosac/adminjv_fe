import { FilterParam, InfoFilter } from "../../../core/types";
import { filterParamInit, InfoFilterInit } from "../../../core/utils/constants";

export type UsersStateType = {
  showUserForm: boolean;
  currentUserId: number | null;
  showUsersFilterMdl: boolean;
  infoFilterUsers: InfoFilter;
  filterParamsUsersForm: FilterParam;
}

export type UsersActionsType = 
  { type: 'SET_SHOW_USER_FORM'; payload: boolean } |
  { type: 'SET_CURRENT_USER_ID'; payload: number } |
  { type: 'SET_SHOW_USERS_FILTER_MDL'; payload: boolean } |
  { type: 'SET_INFO_FILTER_USERS'; payload: InfoFilter } |
  { type: 'SET_FILTER_PARAMS_USERS_FORM'; payload: FilterParam };

export const usersStateInit: UsersStateType = {
  showUserForm: false,
  currentUserId: null,
  showUsersFilterMdl: false,
  infoFilterUsers: InfoFilterInit,
  filterParamsUsersForm: filterParamInit,
}

export const usersReducer = (
  state: UsersStateType = usersStateInit,
  action: UsersActionsType
) => {
  switch (action.type) {
    case 'SET_SHOW_USER_FORM':
      {return { ...state, showUserForm: action.payload }};
    case 'SET_SHOW_USERS_FILTER_MDL':
      {return { ...state, showUsersFilterMdl: action.payload }};
    case 'SET_CURRENT_USER_ID':
      {return { ...state, currentUserId: action.payload }};
    case 'SET_INFO_FILTER_USERS':
      {return { ...state, infoFilterUsers: action.payload }};
    case 'SET_FILTER_PARAMS_USERS_FORM':
      {return { ...state, filterParamsUsersForm: action.payload }};
    default:
      return state;
  }
}