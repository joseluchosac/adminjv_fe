import { create } from "zustand";
import { CampoUserT, FilterCurrent, FilterParams } from "../types";

interface UseUsersStore {
  currentUserId: number;
  camposUser: CampoUserT[];
  filterParamsUsers: FilterParams;
  filterUsersCurrent: FilterCurrent;
  showUserFormMdl: boolean;
  showUsersFilterMdl: boolean;
  setShowUserFormMdl: (bool:boolean) => void;
  setFilterParamsUsers: (params:FilterParams) => void;
  setFilterUsersCurrent: () => void;
  setShowUsersFilterMdl: (p: boolean) => void;
  setCurrentUserId: (userId: number) => void;
  reset: () => void;
}

export const usersStoreInit = {
  currentUserId: 0,
  camposUser: [
    {campo_name: "id", text:"Id", order_dir:"", show: false},
    {campo_name: "nombres", text:"Nombres", order_dir:"", show: true},
    {campo_name: "apellidos", text:"Apellidos", order_dir:"", show: true},
    {campo_name: "username", text:"Usuario", order_dir:"", show: true},
    {campo_name: "email", text:"Email", order_dir:"", show: true},
    {campo_name: "estado", text:"Estado", order_dir:"", show: true},
    {campo_name: "rol", text:"Rol", order_dir:"", show: true},
    {campo_name: "rol_id", text:"Rol Id", order_dir:"", show: false},
    {campo_name: "caja", text:"Caja", order_dir:"", show: true},
    {campo_name: "caja_id", text:"Caja ID", order_dir:"", show: false},
    {campo_name: "created_at", text:"F creación", order_dir:"", show: true},
    {campo_name: "updated_at", text:"F actualización", order_dir:"", show: true},
  ],
  filterParamsUsers: {
    offset: 25,
    search: "",
    equals: [], // [{campo_name: "sucursal_id", value: "1", text:"principal", campo_text: "Sucursal"}]
    between: {campo_name: "", campo_text: "", range: ""}, // {campo_name: "created_at", campo_text:"Creado", range: "2024-12-18 00:00:00, 2024-12-19 23:59:59"}
    orders: [], // [{campo_name: "nombres", order_dir: "ASC", text: "Nombres"}]
  },
  filterUsersCurrent: {
    equals: [],
    between: {campo_name: "", campo_text: "", range: ""},
    orders: [], 
  },
  showUserFormMdl: false,
  showUsersFilterMdl: false
}

const useUsersStore = create<UseUsersStore>(( set, get ) => ({
  ...usersStoreInit,
  setShowUserFormMdl: (bool) => { set({ showUserFormMdl: bool }) },
  setShowUsersFilterMdl: (bool) => set({ showUsersFilterMdl: bool }),
  setFilterParamsUsers: (params) => {
    set({filterParamsUsers: params})
  },
  setFilterUsersCurrent: () => {
    const {equals, between, orders} = get().filterParamsUsers
    const newCamposUsers = get().camposUser.map(el=>{
      const order = orders.find(order => order.campo_name === el.campo_name)
      return order ? {...el, order_dir: order?.order_dir} : {...el, order_dir: ""}
    })
    // console.log(newCamposUsers)
    set({camposUser: newCamposUsers})
    set({filterUsersCurrent: {equals, between, orders}})
  },
  setCurrentUserId: (userId) => set({currentUserId: userId}),
  reset: () => set(usersStoreInit),
}))

export default useUsersStore;